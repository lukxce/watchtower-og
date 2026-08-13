// Overview — the command center. Big, bold, at-a-glance: one consolidated
// Threat Index leaderboard, insight KPIs (not raw counts), top signals
// already interpreted, battlecards front and center, industry pulse
// prominent, hiring and ad activity as chart modules. Single events live on
// /feed; this page is for opening the app and knowing the state of the
// market in ten seconds.
import { getDb } from '@/db/client';
import { computeThreat } from '@/lib/threat';
import { CHANNELS } from '@/lib/channels';
import { requireOrgId } from '@/lib/tenant';
import { industryNews } from '@/lib/industryNews';
import { adsRoundup } from '@/lib/adsSummary';
import { hiringRoundup } from '@/lib/hiringSummary';
import { interpretSignal } from '@/lib/interpret';

export const dynamic = 'force-dynamic';

const catClass = (c: string) => `c-${(c || 'other').toLowerCase()}`;
const scoreClass = (n: number) => (n >= 70 ? 's-hi' : n >= 45 ? 's-md' : 's-lo');
const ring = (n: number) => (n >= 70 ? '#d2484f' : n >= 55 ? '#b8860f' : n >= 42 ? '#2f7fd1' : '#188a56');
const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Working late';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default async function Overview() {
  const orgId = await requireOrgId();
  const db = await getDb();

  const compCount = Number((await db.query<{ n: string }>('SELECT COUNT(*)::text n FROM competitors WHERE org_id = $1', [orgId]))[0]?.n ?? 0);
  const totalSignals = Number(
    (await db.query<{ n: string }>(
      "SELECT COUNT(*)::text n FROM stream_items si JOIN competitors c ON c.id = si.competitor_id WHERE c.org_id = $1 AND si.status IN ('pending','signaled')",
      [orgId],
    ))[0]?.n ?? 0,
  );

  // Top signals: the highest-impact single events, ads and jobs excluded
  // (those live as the activity charts below).
  const topSignals = await db.query<{ channel: string; category: string | null; score: number | null; title: string; url: string | null; name: string; slug: string }>(
    `SELECT si.channel, si.category, si.score, si.title, si.url, c.name, c.slug
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE c.org_id = $1 AND si.status IN ('pending','signaled')
       AND si.channel NOT IN ('ads_meta','ads_google','ads_linkedin','jobs')
     ORDER BY si.score DESC NULLS LAST, si.created_at DESC LIMIT 4`,
    [orgId],
  );

  interface CardContent { positioning: string; strengths: string[]; vulnerabilities: string[]; howToWin: string[]; keyQuestion: string }
  const cardRows = await db.query<{ name: string; slug: string; content: CardContent | string }>(
    `SELECT c.name, c.slug, b.content FROM battlecards b
     JOIN competitors c ON c.id = b.competitor_id
     LEFT JOIN threat_scores ts ON ts.competitor_id = c.id
     WHERE c.org_id = $1 ORDER BY ts.total DESC NULLS LAST LIMIT 2`,
    [orgId],
  );
  const cards = cardRows.map((r) => {
    const c = (typeof r.content === 'string' ? JSON.parse(r.content) : r.content) as CardContent;
    return { name: r.name, slug: r.slug, ...c };
  });

  const pulseAll = await industryNews(orgId, 12);
  const pulse = pulseAll.slice(0, 5);
  const competitors = await db.query<{ name: string; slug: string }>('SELECT name, slug FROM competitors WHERE org_id = $1', [orgId]);
  const mentionsOf = (title: string) => competitors.filter((c) => title.toLowerCase().includes(c.name.toLowerCase()));
  const mentionCount = pulseAll.filter((p) => mentionsOf(p.title).length > 0).length;

  const ads = await adsRoundup(orgId);
  const adsMax = Math.max(1, ...ads.map((a) => a.total));
  const hiring = await hiringRoundup(orgId);
  const hiringMax = Math.max(1, ...hiring.map((h) => h.total));
  const threat = await computeThreat(orgId);
  const activeCount = CHANNELS.filter((c) => c.status === 'active').length;

  // Insight KPIs — what's DIFFERENT this week, not raw inventory counts.
  const biggestMover = [...threat].filter((t) => t.delta != null).sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0))[0];
  const needsAttention = Number(
    (await db.query<{ n: string }>(
      `SELECT COUNT(*)::text n FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
       WHERE c.org_id = $1 AND si.status IN ('pending','signaled') AND si.score >= 70 AND si.created_at >= now() - interval '7 days'`,
      [orgId],
    ))[0]?.n ?? 0,
  );
  const newBuilds = Number(
    (await db.query<{ n: string }>(
      `SELECT COUNT(*)::text n FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
       WHERE c.org_id = $1 AND si.channel = 'subdomains' AND si.status IN ('pending','signaled') AND si.created_at >= now() - interval '30 days'`,
      [orgId],
    ))[0]?.n ?? 0,
  );

  return (
    <main className="main">
      <section className="feed">
        <header className="ov-head">
          <h1 className="ov-hello">{greeting()}<span>. The state of your market.</span></h1>
          <p className="sub">{compCount} competitors watched · {totalSignals} verified signals on file · single events live in the <a href="/feed" style={{ color: 'var(--brand)', fontWeight: 700 }}>Feed</a>.</p>
        </header>

        <div className="kpis">
          <div className="kpi">
            <div className="kpi-top">
              <span className="kpi-ic v"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" strokeLinejoin="round" /></svg></span>
              <span className="kpi-l">Biggest mover</span>
            </div>
            {biggestMover && (biggestMover.delta ?? 0) > 0 ? (
              <>
                <span className="kpi-n">+{biggestMover.delta}</span>
                <span className="kpi-s">{biggestMover.competitor}, this week</span>
              </>
            ) : (
              <>
                <span className="kpi-n">—</span>
                <span className="kpi-s">no upward movement yet</span>
              </>
            )}
          </div>
          <div className="kpi">
            <div className="kpi-top">
              <span className="kpi-ic p"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 4a5.5 5.5 0 0 0-5.5 5.5c0 4-1.8 5.5-1.8 5.5h14.6s-1.8-1.5-1.8-5.5A5.5 5.5 0 0 0 12 4Z" strokeLinejoin="round" /><path d="M10.3 18.5a1.8 1.8 0 0 0 3.4 0" strokeLinecap="round" /></svg></span>
              <span className="kpi-l">Needs attention</span>
            </div>
            <span className="kpi-n">{needsAttention}</span>
            <span className="kpi-s">high-impact signals this week</span>
          </div>
          <div className="kpi">
            <div className="kpi-top">
              <span className="kpi-ic b"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 19c1.5-4.5 3-7.5 7-11.5 2.5-2.5 6-3 7-2s.5 4.5-2 7C13 16.5 10 18 5.5 19.5Z" strokeLinejoin="round" /></svg></span>
              <span className="kpi-l">New builds detected</span>
            </div>
            <span className="kpi-n">{newBuilds}</span>
            <span className="kpi-s">buildout hostnames, last 30 days</span>
          </div>
          <div className="kpi">
            <div className="kpi-top">
              <span className="kpi-ic m"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M8 9.5h8M8 13h5" strokeLinecap="round" /></svg></span>
              <span className="kpi-l">Industry mentions</span>
            </div>
            <span className="kpi-n">{mentionCount}</span>
            <span className="kpi-s">headlines naming your set</span>
          </div>
        </div>

        <div className="ovx">
          <div className="mod ovx-w12">
            <div className="mod-title-row">
              <h3>Threat Index</h3>
              <span className="covnote" style={{ margin: 0 }}>weighted composite · recomputed each crawl</span>
            </div>
            <div className="lb-list">
              {threat.map((t) => (
                <a className="lb-row" key={t.competitor} href={`/feed?comp=${t.slug}`}>
                  <span className="lb-avatar">{initials(t.competitor)}</span>
                  <span className="lb-name">{t.competitor}</span>
                  <span className="lb-track"><span className="lb-bar" style={{ width: `${t.total}%`, background: ring(t.total) }} /></span>
                  <span className="lb-score">{t.total}</span>
                  {t.delta == null ? (
                    <span className="lb-delta flat">baseline</span>
                  ) : t.delta > 0 ? (
                    <span className="lb-delta up">▲ +{t.delta}</span>
                  ) : t.delta < 0 ? (
                    <span className="lb-delta down">▼ {t.delta}</span>
                  ) : (
                    <span className="lb-delta flat">no change</span>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div className="mod ovx-w7">
            <div className="mod-title-row">
              <h3>Top signals right now</h3>
              <a className="mod-more" href="/feed">Open the feed →</a>
            </div>
            {topSignals.length === 0 ? (
              <div className="empty">No signals yet — the first crawl baselines each competitor; changes surface from the next one.</div>
            ) : (
              topSignals.map((it, i) => {
                const read = interpretSignal(it.channel, it.title, it.name);
                return (
                  <a className="ovsig" key={i} href={it.url ?? `/feed?comp=${it.slug}`} target={it.url ? '_blank' : undefined} rel="noreferrer">
                    <div className="ovsig-head">
                      <span className={`badge ${catClass(it.category ?? 'other')}`}>{it.category ?? it.channel}</span>
                      <span className="card-avatar">{initials(it.name)}</span>
                      <span className="comp">{it.name}</span>
                      {it.score != null && <span className={`score ${scoreClass(it.score)}`}>{it.score}</span>}
                    </div>
                    <div className="ovsig-title">{read.headline}</div>
                    {read.howWeKnow && <div className="ovsig-know">How we know: {read.howWeKnow}</div>}
                  </a>
                );
              })
            )}
          </div>

          <div className="mod ovx-w5">
            <div className="mod-title-row">
              <h3>Industry pulse</h3>
              <a className="mod-more" href="/industry">All →</a>
            </div>
            {pulse.length === 0 ? (
              <p className="covnote">Headlines unavailable right now — back on the next load.</p>
            ) : (
              pulse.map((p, i) => {
                const mentions = mentionsOf(p.title);
                return (
                  <a className="pulse-row" key={i} href={p.url} target="_blank" rel="noreferrer">
                    <span className="pulse-t">
                      {mentions.map((m) => <span className="pulse-mention" key={m.slug}>{m.name}</span>)}
                      {p.title}
                    </span>
                    <span className="pulse-s">{p.source}</span>
                  </a>
                );
              })
            )}
          </div>

          <div className="mod ovx-w7">
            <div className="mod-title-row">
              <h3>Battlecards</h3>
              <a className="mod-more" href="/battlecards">All cards →</a>
            </div>
            {cards.length === 0 ? (
              <div className="empty">No battlecards generated yet.</div>
            ) : (
              cards.map((c) => (
                <a className="ovbc" key={c.slug} href="/battlecards">
                  <div className="ovbc-top">
                    <span className="cc-avatar sm">{initials(c.name)}</span>
                    <span className="comp">{c.name}</span>
                  </div>
                  <p className="ovbc-pos">{c.positioning}</p>
                  <div className="ovbc-cols">
                    <div className="ovbc-col weak">
                      <h5>Their weak points</h5>
                      <ul>{c.vulnerabilities.slice(0, 2).map((v, i) => <li key={i}>{v}</li>)}</ul>
                    </div>
                    <div className="ovbc-col win">
                      <h5>How we win</h5>
                      <ul>{c.howToWin.slice(0, 2).map((w, i) => <li key={i}>{w}</li>)}</ul>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>

          <div className="ovx-w5" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="mod">
              <div className="mod-title-row">
                <h3>Hiring activity</h3>
                <a className="mod-more" href="/feed?cat=Hiring">Roles →</a>
              </div>
              {hiring.length === 0 ? (
                <p className="covnote">No open roles visible across the set.</p>
              ) : (
                <>
                  {hiring.map((h) => (
                    <div className="chart-row" key={h.slug}>
                      <span className="chart-label"><span className="card-avatar">{initials(h.name)}</span>{h.name}</span>
                      <span className="chart-track"><span className="chart-bar hire" style={{ width: `${(h.total / hiringMax) * 100}%` }} /></span>
                      <span className="chart-n">{h.total}</span>
                    </div>
                  ))}
                  <p className="chart-note">
                    Open roles per competitor.{' '}
                    {hiring[0]?.topDept && hiring[0].topDept.n >= 2
                      ? `${hiring[0].name}'s biggest concentration: ${hiring[0].topDept.name} (${hiring[0].topDept.n}).`
                      : ''}
                  </p>
                </>
              )}
            </div>
            <div className="mod">
              <div className="mod-title-row">
                <h3>Ad share of voice</h3>
                <a className="mod-more" href="/feed?cat=Ads">Creatives →</a>
              </div>
              {ads.length === 0 ? (
                <p className="covnote">No active creatives visible.</p>
              ) : (
                <>
                  {ads.map((a) => (
                    <div className="chart-row" key={a.slug}>
                      <span className="chart-label"><span className="card-avatar">{initials(a.name)}</span>{a.name}</span>
                      <span className="chart-track"><span className="chart-bar ads" style={{ width: `${(a.total / adsMax) * 100}%` }} /></span>
                      <span className="chart-n">{a.total}</span>
                    </div>
                  ))}
                  <p className="chart-note">Active creatives visible in public ad libraries. Spend isn&apos;t public; volume is the honest proxy.</p>
                </>
              )}
            </div>
          </div>

          <div className="mod dark ovx-w6">
            <h3>Ask Watchtower</h3>
            <p className="mod-ask-t">Ask about your competitors.</p>
            <p className="mod-ask-p">“What changed on CreatorIQ&apos;s pricing this quarter?” Every answer cites the signals it came from.</p>
            <a className="mod-ask-a" href="/ask">Ask Watchtower →</a>
          </div>

          <div className="mod ovx-w6">
            <div className="mod-title-row">
              <h3>Coverage</h3>
              <span className="covnote" style={{ margin: 0 }}>{activeCount}/{CHANNELS.length} channels live — the rest light up when a key is added</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 14px' }}>
              {CHANNELS.map((c) => (
                <span className={`covitem ${c.status === 'active' ? 'live' : ''}`} key={c.key} title={c.note}>
                  <span className={`dot d-${c.status}`} />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
