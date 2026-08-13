// Overview — the condensed all-in-one dashboard: greeting, KPI row, threat
// gauges, then a day-grouped signal timeline with side modules (channel
// coverage + Ask teaser). Deep dives live on their own pages.
import { getDb } from '@/db/client';
import { computeThreat } from '@/lib/threat';
import { CHANNELS } from '@/lib/channels';
import { requireOrgId } from '@/lib/tenant';
import { industryNews } from '@/lib/industryNews';
import { adsRoundup } from '@/lib/adsSummary';
import { hiringRoundup } from '@/lib/hiringSummary';
import { interpretSignal } from '@/lib/interpret';

export const dynamic = 'force-dynamic';

const FILTERS = ['All channels', 'Pricing', 'Product', 'Hiring', 'Ads', 'News', 'Reviews'];
const catClass = (c: string) => `c-${(c || 'other').toLowerCase()}`;
const scoreClass = (n: number) => (n >= 70 ? 's-hi' : n >= 45 ? 's-md' : 's-lo');

// gauge ring color by threat level — pastel but legible
const ring = (n: number) => (n >= 70 ? '#ef7fae' : n >= 55 ? '#a89bf5' : n >= 42 ? '#93b6f5' : '#7fd0ab');
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function ago(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const h = Math.floor(d / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(d / 60000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Working late';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const BUCKET_ORDER = ['Today', 'Yesterday', 'This week', 'Earlier'] as const;
function bucketOf(iso: string): (typeof BUCKET_ORDER)[number] {
  const d = new Date(iso);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfYesterday.getDate() - 1);
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  if (d >= startOfToday) return 'Today';
  if (d >= startOfYesterday) return 'Yesterday';
  if (d >= startOfWeek) return 'This week';
  return 'Earlier';
}

export default async function Home({ searchParams }: { searchParams: Promise<{ cat?: string; comp?: string }> }) {
  const { cat, comp } = await searchParams;
  const active = cat && FILTERS.includes(cat) ? cat : 'All channels';
  const orgId = await requireOrgId();
  const db = await getDb();

  const clauses: string[] = ["si.status IN ('pending','signaled')", 'c.org_id = $1'];
  const params: unknown[] = [orgId];
  if (active !== 'All channels') {
    params.push(active);
    clauses.push(`si.category = $${params.length}`);
  }
  if (comp) {
    params.push(comp);
    clauses.push(`c.slug = $${params.length}`);
  }
  // Individual ad creatives are near-duplicates at volume; the timeline gets
  // one roundup card per competitor instead, and the full list lives behind
  // the Ads filter.
  if (active !== 'Ads') {
    clauses.push("si.channel NOT IN ('ads_meta','ads_google','ads_linkedin')");
  }
  // Same for job posts: one hiring-roundup card per competitor beats six
  // near-identical rows. Full list behind the Hiring filter.
  if (active !== 'Hiring') {
    clauses.push("si.channel <> 'jobs'");
  }
  const items = await db.query<{ channel: string; category: string | null; score: number | null; title: string; url: string | null; created_at: string; published_at: string | null; name: string }>(
    `SELECT si.channel, si.category, si.score, si.title, si.url, si.created_at, si.published_at, c.name
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE ${clauses.join(' AND ')}
     ORDER BY si.score DESC NULLS LAST, si.created_at DESC LIMIT 40`,
    params,
  );
  const compCount = Number((await db.query<{ n: string }>('SELECT COUNT(*)::text n FROM competitors WHERE org_id = $1', [orgId]))[0]?.n ?? 0);
  const totalSignals = Number(
    (await db.query<{ n: string }>(
      "SELECT COUNT(*)::text n FROM stream_items si JOIN competitors c ON c.id = si.competitor_id WHERE c.org_id = $1 AND si.status IN ('pending','signaled')",
      [orgId],
    ))[0]?.n ?? 0,
  );
  const runStats = (await db.query<{ ok: string; fail: string }>(
    `SELECT COUNT(*) FILTER (WHERE ok)::text ok, COUNT(*) FILTER (WHERE NOT ok)::text fail
     FROM (SELECT cr.ok FROM collection_runs cr JOIN competitors c ON c.id = cr.competitor_id
           WHERE c.org_id = $1 ORDER BY cr.id DESC LIMIT 60) last_runs`,
    [orgId],
  ))[0] ?? { ok: '0', fail: '0' };
  const ads = (await adsRoundup(orgId)).filter((a) => !comp || a.slug === comp);
  const hiring = (await hiringRoundup(orgId)).filter((h) => !comp || h.slug === comp);
  const adsMax = Math.max(1, ...ads.map((a) => a.total));
  interface ShortCard { positioning: string; howToWin: string[] }
  const cardRows = await db.query<{ name: string; slug: string; content: ShortCard | string }>(
    `SELECT c.name, c.slug, b.content FROM battlecards b
     JOIN competitors c ON c.id = b.competitor_id
     LEFT JOIN threat_scores ts ON ts.competitor_id = c.id
     WHERE c.org_id = $1 ORDER BY ts.total DESC NULLS LAST LIMIT 3`,
    [orgId],
  );
  const shorts = cardRows.map((r) => {
    const cnt = (typeof r.content === 'string' ? JSON.parse(r.content) : r.content) as ShortCard;
    return { name: r.name, slug: r.slug, positioning: String(cnt.positioning ?? ''), win: Array.isArray(cnt.howToWin) ? String(cnt.howToWin[0] ?? '') : '' };
  });
  const pulse = await industryNews(orgId);
  const threat = await computeThreat(orgId);
  const top = threat[0];
  const activeComp = comp ? threat.find((t) => t.slug === comp)?.competitor ?? comp : null;
  const pillHref = (f: string) => {
    const p = new URLSearchParams();
    if (f !== 'All channels') p.set('cat', f);
    if (comp) p.set('comp', comp);
    const s = p.toString();
    return s ? `/feed?${s}` : '/feed';
  };
  const activeCount = CHANNELS.filter((c) => c.status === 'active').length;
  const groups = [...new Set(CHANNELS.map((c) => c.group))];

  // Collapse locale duplicates: the same new page published in /de/ /pt/ /ko/…
  // is one product move, not eight. Keep the first (canonical) row and count.
  type FeedItem = (typeof items)[number] & { locales?: number };
  const LOCALE = /^(https?:\/\/[^/]+)\/([a-z]{2}(?:-[a-z]{2})?)\//i;
  const byPage = new Map<string, FeedItem>();
  const display: FeedItem[] = [];
  for (const raw of items as FeedItem[]) {
    const m = raw.title.match(/^New page published: (\S+)$/);
    if (m) {
      const norm = m[1].replace(LOCALE, '$1/');
      const kept = byPage.get(norm);
      if (kept) {
        kept.locales = (kept.locales ?? 1) + 1;
        continue;
      }
      byPage.set(norm, raw);
    }
    display.push(raw);
  }

  const buckets = new Map<(typeof BUCKET_ORDER)[number], FeedItem[]>();
  for (const it of display) {
    const key = bucketOf(it.published_at ?? it.created_at);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(it);
  }

  return (
    <main className="main">
      <section className="feed">
        <header className="ov-head">
          <h1 className="ov-hello">{activeComp ? `${activeComp} signals` : greeting()}<span>{activeComp ? '' : '. Here’s what your competitors did.'}</span></h1>
          <p className="sub">
            {items.length} signals · {activeComp ? '1 competitor' : `${compCount} competitors`} · ranked by impact. Times are the event
            date where known, else when Watchtower first observed it.
          </p>
        </header>

        {!activeComp && (
          <div className="kpis">
            <div className="kpi">
              <div className="kpi-top">
                <span className="kpi-ic v"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h16M4 12h16M4 19h10" strokeLinecap="round" /></svg></span>
                <span className="kpi-l">Signals captured</span>
              </div>
              <span className="kpi-n">{totalSignals}</span>
              <span className="kpi-s">across all channels</span>
            </div>
            <div className="kpi">
              <div className="kpi-top">
                <span className="kpi-ic b"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.2" /><path d="M5 19c.8-3 3.5-4.6 7-4.6s6.2 1.6 7 4.6" strokeLinecap="round" /></svg></span>
                <span className="kpi-l">Competitors tracked</span>
              </div>
              <span className="kpi-n">{compCount}</span>
              <span className="kpi-s">in this workspace</span>
            </div>
            <div className="kpi">
              <div className="kpi-top">
                <span className="kpi-ic p"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 21a9 9 0 1 1 9-9" strokeLinecap="round" /><path d="M12 12l5-3" strokeLinecap="round" /></svg></span>
                <span className="kpi-l">Highest threat</span>
              </div>
              <span className="kpi-n">{top?.total ?? '—'}</span>
              <span className="kpi-s">{top ? top.competitor : 'no data yet'}</span>
            </div>
            <div className="kpi">
              <div className="kpi-top">
                <span className="kpi-ic m"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                <span className="kpi-l">Last crawl</span>
              </div>
              <span className="kpi-n"><span className="ok">{runStats.ok}</span> / <span className="bad">{runStats.fail}</span></span>
              <span className="kpi-s">runs ok / failed, honestly logged</span>
            </div>
          </div>
        )}

        {!activeComp && threat.length > 0 && (
          <div className="tstrip">
            {threat.map((t) => (
              <a className="ttile" key={t.competitor} href={`/feed?comp=${t.slug}`}>
                <div className="ttile-top">
                  <span className="ttile-avatar">{initials(t.competitor)}</span>
                  <span className="ttile-name">{t.competitor}</span>
                </div>
                <div className="ttile-gauge" style={{ background: `conic-gradient(${ring(t.total)} ${t.total * 3.6}deg, var(--gr) 0)` }}>
                  <span>{t.total}</span>
                </div>
                {t.delta == null ? (
                  <div className="tdl flat">baseline</div>
                ) : t.delta >= 0 ? (
                  <div className="tdl up">▲ +{t.delta} wk</div>
                ) : (
                  <div className="tdl down">▼ {t.delta} wk</div>
                )}
              </a>
            ))}
          </div>
        )}

        {activeComp && (
          <div className="filterchip">
            Filtered to <b>{activeComp}</b>
            <a href={active === 'All channels' ? '/feed' : `/feed?cat=${active}`}>clear ✕</a>
          </div>
        )}

        <div className="ov-grid">
          <div className="ov-main">
            <div className="pills">
              {FILTERS.map((f) => (
                <a key={f} href={pillHref(f)} className={`pill ${f === active ? 'on' : ''}`}>
                  {f}
                </a>
              ))}
            </div>

            {active !== 'Hiring' && hiring.length > 0 && (
              <div className="tl-group">
                <div className="tl-label"><span>Hiring activity</span></div>
                {hiring.map((h) => (
                  <a className="card hirecard" key={h.slug} href={`/feed?cat=Hiring${comp ? `&comp=${comp}` : `&comp=${h.slug}`}`}>
                    <div className="crow">
                      <span className="badge c-hiring">Hiring</span>
                      <span className="card-avatar">{initials(h.name)}</span>
                      <span className="comp">{h.name}</span>
                      <span className="when">view all →</span>
                    </div>
                    <div className="title">{h.read}</div>
                  </a>
                ))}
              </div>
            )}

            {active !== 'Ads' && ads.length > 0 && (
              <div className="tl-group">
                <div className="tl-label"><span>Ad activity</span></div>
                {ads.map((a) => (
                  <a className="card adcard" key={a.slug} href={`/feed?cat=Ads${comp ? `&comp=${comp}` : `&comp=${a.slug}`}`}>
                    <div className="crow">
                      <span className="badge c-ads">Ads</span>
                      <span className="card-avatar">{initials(a.name)}</span>
                      <span className="comp">{a.name}</span>
                      <span className="adcard-total">{a.total} active creatives</span>
                      <span className="when">view all →</span>
                    </div>
                    <div className="title">{a.read || 'creative formats unavailable for these platforms'}</div>
                  </a>
                ))}
              </div>
            )}

            {items.length === 0 ? (
              <div className="empty">
                No signals in this view yet. Trigger a collection with <code>POST /api/run</code> (or wait for the daily
                07:00 crawl). The first run captures each competitor&apos;s current state; changes surface from the next run.
              </div>
            ) : (
              <div className="timeline">
                {BUCKET_ORDER.filter((b) => buckets.has(b)).map((b) => (
                  <div className="tl-group" key={b}>
                    <div className="tl-label"><span>{b}</span></div>
                    {buckets.get(b)!.map((it, i) => {
                      const read = interpretSignal(it.channel, it.title, it.name);
                      return (
                        <div className={`card${(it.score ?? 0) >= 80 ? ` featured fc-${catClass(it.category ?? 'other').slice(2)}` : ''}`} key={i}>
                          <div className="crow">
                            <span className={`badge ${catClass(it.category ?? 'other')}`}>{it.category ?? it.channel}</span>
                            <span className="card-avatar">{initials(it.name)}</span>
                            <span className="comp">{it.name}</span>
                            {it.score != null && <span className={`score ${scoreClass(it.score)}`}>{it.score}</span>}
                            {it.published_at ? (
                              <span className="when">{ago(it.published_at)}</span>
                            ) : (
                              <span className="when seen" title="Watchtower first observed this here; the underlying item may be older">
                                first seen {ago(it.created_at)}
                              </span>
                            )}
                          </div>
                          <div className="title">
                            {it.url ? <a href={it.url} target="_blank" rel="noreferrer">{read.headline}</a> : read.headline}
                            {it.locales && it.locales > 1 && <span className="locale-note"> (+{it.locales - 1} locale versions)</span>}
                          </div>
                          {read.howWeKnow && <div className="howknow">How we know: {read.howWeKnow}</div>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="ov-side">
            {pulse.length > 0 && (
              <div className="mod">
                <h3>Industry pulse</h3>
                {pulse.slice(0, 4).map((p, i) => (
                  <a className="pulse-row" key={i} href={p.url} target="_blank" rel="noreferrer">
                    <span className="pulse-t">{p.title}</span>
                    <span className="pulse-s">{p.source}</span>
                  </a>
                ))}
                <a className="mod-more" href="/industry">All industry news →</a>
              </div>
            )}

            {shorts.length > 0 && (
              <div className="mod">
                <h3>Battlecards at a glance</h3>
                {shorts.map((sc) => (
                  <a className="short-bc" key={sc.slug} href="/battlecards">
                    <div className="short-bc-top">
                      <span className="cc-avatar sm">{initials(sc.name)}</span>
                      <span className="comp">{sc.name}</span>
                    </div>
                    <p className="short-bc-pos">{sc.positioning.length > 110 ? `${sc.positioning.slice(0, 110)}…` : sc.positioning}</p>
                    {sc.win && <p className="short-bc-win">How we win: {sc.win}</p>}
                  </a>
                ))}
                <a className="mod-more" href="/battlecards">Full battlecards →</a>
              </div>
            )}

            {ads.length > 1 && (
              <div className="mod">
                <h3>Ad share of voice</h3>
                {ads.map((a) => (
                  <div className="mix-row" key={a.slug}>
                    <span className="mix-label">{a.name}</span>
                    <span className="mix-track"><span className="mix-bar" style={{ width: `${(a.total / adsMax) * 100}%` }} /></span>
                    <span className="mix-n">{a.total}</span>
                  </div>
                ))}
                <p className="covnote">Active creatives we can see across ad libraries. Spend isn&apos;t public; volume is the honest proxy.</p>
              </div>
            )}

            <div className="mod dark">
              <h3>Ask Watchtower</h3>
              <p className="mod-ask-t">Ask about your competitors.</p>
              <p className="mod-ask-p">
                “What changed on CreatorIQ&apos;s pricing this quarter?” Every answer cites the signals it came from.
              </p>
              <a className="mod-ask-a" href="/ask">Ask Watchtower →</a>
            </div>

            <div className="mod cov" id="coverage">
              <h3>Channel coverage · {activeCount}/{CHANNELS.length}</h3>
              {groups.map((g) => (
                <div key={g}>
                  <div className="covgrp">{g}</div>
                  {CHANNELS.filter((c) => c.group === g).map((c) => (
                    <div className={`covitem ${c.status === 'active' ? 'live' : ''}`} key={c.key} title={c.note}>
                      <span className={`dot d-${c.status}`} />
                      {c.label}
                    </div>
                  ))}
                </div>
              ))}
              <p className="covnote">Green = live now · orange = needs a free key/account · blue = paid data source. Deferred channels light up automatically once configured.</p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
