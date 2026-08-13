// Signal feed dashboard — a threat strip up top (not buried in a side rail),
// a day-grouped timeline of scored signal cards below it, and channel
// coverage as a secondary rail. Deliberately not the generic
// sidebar+list+rail shape: the threat data is the hero, not an afterthought.
import { getDb } from '@/db/client';
import { computeThreat } from '@/lib/threat';
import { CHANNELS } from '@/lib/channels';
import { requireOrgId } from '@/lib/tenant';

export const dynamic = 'force-dynamic';

const FILTERS = ['All channels', 'Pricing', 'Product', 'Hiring', 'Ads', 'News', 'Reviews'];
const catClass = (c: string) => `c-${(c || 'other').toLowerCase()}`;
const scoreClass = (n: number) => (n >= 70 ? 's-hi' : n >= 45 ? 's-md' : 's-lo');

// gauge ring color by threat level
const ring = (n: number) => (n >= 70 ? '#B8362A' : n >= 55 ? '#9A5B00' : n >= 42 ? '#4A5BC9' : '#1F7A45');
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function ago(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const h = Math.floor(d / 3600000);
  if (h < 1) return `${Math.max(1, Math.floor(d / 60000))}m ago`;
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
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
  const items = await db.query<{ channel: string; category: string | null; score: number | null; title: string; url: string | null; created_at: string; published_at: string | null; name: string }>(
    `SELECT si.channel, si.category, si.score, si.title, si.url, si.created_at, si.published_at, c.name
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE ${clauses.join(' AND ')}
     ORDER BY si.score DESC NULLS LAST, si.created_at DESC LIMIT 40`,
    params,
  );
  const compCount = (await db.query<{ n: string }>('SELECT COUNT(*)::text n FROM competitors WHERE org_id = $1', [orgId]))[0]?.n ?? '0';
  const threat = await computeThreat(orgId);
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

  const buckets = new Map<(typeof BUCKET_ORDER)[number], typeof items>();
  for (const it of items) {
    const key = bucketOf(it.published_at ?? it.created_at);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(it);
  }

  return (
    <main className="main">
      <section className="feed">
        <h1>{activeComp ? `${activeComp} — signals` : 'Signal feed'}</h1>
        <p className="sub">
          {items.length} signals · {activeComp ? '1 competitor' : `${compCount} competitors`} · ranked by impact. Times are the event
          date where known, else when Watchtower first observed it.
        </p>

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

        <div className="pills">
          {FILTERS.map((f) => (
            <a key={f} href={pillHref(f)} className={`pill ${f === active ? 'on' : ''}`}>
              {f}
            </a>
          ))}
        </div>

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
                {buckets.get(b)!.map((it, i) => (
                  <div className={`card cat-${catClass(it.category ?? 'other').slice(2)}`} key={i}>
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
                    <div className="title">{it.url ? <a href={it.url} target="_blank" rel="noreferrer">{it.title}</a> : it.title}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </section>

      <aside className="rail">
        <div className="cov" id="coverage">
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
    </main>
  );
}
