// Overview — a dashboard, not a document. Modeled on the clean chart-forward
// pattern the user picked: greeting, one big real activity chart, a score
// list, progress bars, and a right rail of gradient cards linking into the
// places where the reasoning actually lives (Battlecards, Radar). No
// paragraphs of commentary here — a signal is a signal, the reads live on
// /battlecards and /competitors.
import { getDb } from '@/db/client';
import { computeThreat } from '@/lib/threat';
import { CHANNELS } from '@/lib/channels';
import { requireOrgId } from '@/lib/tenant';
import { getCompetitorReads } from '@/lib/reason';
import { computeRadar } from '@/lib/radar';

export const dynamic = 'force-dynamic';

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Working late';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

// Category → chart bucket. Three series keeps the chart legible.
function bucketOf(category: string | null): 'product' | 'gtm' | 'market' {
  if (category === 'Product' || category === 'Pricing') return 'product';
  if (category === 'Ads' || category === 'Hiring' || category === 'Marketing') return 'gtm';
  return 'market';
}

const WEEKS = 26;

export default async function Overview() {
  const orgId = await requireOrgId();
  const db = await getDb();

  // Real weekly event volume, last ~6 months — DATED events only
  // (published_at). Undated current-state signals (a first crawl's ads/jobs/
  // techstack baseline) all land on created_at = crawl day and would render
  // as a giant fake "spike" on whatever week we happened to crawl — that's
  // observation time, not event time, and it lies about market activity.
  const weekRows = await db.query<{ wk: string; category: string | null; n: number }>(
    `SELECT date_trunc('week', si.published_at)::date::text AS wk, si.category, COUNT(*)::int AS n
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE c.org_id = $1 AND si.status IN ('pending','signaled')
       AND si.published_at IS NOT NULL AND si.published_at >= now() - interval '${WEEKS * 7} days'
     GROUP BY 1, 2`,
    [orgId],
  );

  // Build the 26 week buckets ending this week. Keys are formatted from
  // LOCAL date parts, not toISOString() — ISO is UTC, which shifts a local
  // Monday-midnight back to Sunday in any UTC+ timezone and then nothing
  // matches Postgres's Monday-truncated weeks.
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const localKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const weeks: { key: string; label: string; product: number; gtm: number; market: number }[] = [];
  for (let i = WEEKS - 1; i >= 0; i--) {
    const d = new Date(monday);
    d.setDate(monday.getDate() - i * 7);
    weeks.push({ key: localKey(d), label: d.toLocaleDateString('en-US', { month: 'short' }), product: 0, gtm: 0, market: 0 });
  }
  const byKey = new Map(weeks.map((w) => [w.key, w]));
  for (const r of weekRows) {
    const w = byKey.get(r.wk);
    if (w) w[bucketOf(r.category)] += r.n;
  }
  const maxWeek = Math.max(1, ...weeks.map((w) => w.product + w.gtm + w.market));
  const thisWeek = weeks[weeks.length - 1];
  const thisWeekTotal = thisWeek.product + thisWeek.gtm + thisWeek.market;
  const last30 = Number(
    (await db.query<{ n: string }>(
      `SELECT COUNT(*)::text n FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
       WHERE c.org_id = $1 AND si.status IN ('pending','signaled') AND si.published_at IS NOT NULL AND si.published_at >= now() - interval '30 days'`,
      [orgId],
    ))[0]?.n ?? 0,
  );

  // Month labels: first bucket of each month.
  const monthTicks: { idx: number; label: string }[] = [];
  let lastMonth = '';
  weeks.forEach((w, idx) => {
    if (w.label !== lastMonth) {
      monthTicks.push({ idx, label: w.label });
      lastMonth = w.label;
    }
  });

  const threat = await computeThreat(orgId);
  const reads = await getCompetitorReads(orgId);
  const radar = await computeRadar(orgId);
  const topRadar = radar[0];

  const compCount = threat.length;
  const battlecardCount = Number(
    (await db.query<{ n: string }>(
      'SELECT COUNT(*)::text n FROM battlecards b JOIN competitors c ON c.id = b.competitor_id WHERE c.org_id = $1',
      [orgId],
    ))[0]?.n ?? 0,
  );
  const activeChannels = CHANNELS.filter((c) => c.status === 'active').length;
  const readsCount = reads.size;

  // Right rail: top-threat competitors with a read, as gradient cards.
  const railCards = threat
    .filter((t) => reads.has(t.slug))
    .slice(0, 3)
    .map((t, i) => ({ ...t, read: reads.get(t.slug)!, g: `g${(i % 3) + 1}` }));

  // Chart geometry.
  const CW = 660;
  const CH = 190;
  const BW = 16;
  const GAP = (CW - WEEKS * BW) / (WEEKS + 1);

  return (
    <main className="main">
      <section className="feed dashwrap">
        <header className="ov-head">
          <h1 className="ov-hello">{greeting()}<span>. The state of your market.</span></h1>
        </header>

        <div className="dash">
          <div className="dash-main">
            <div className="dcard">
              <div className="dhead">
                <div>
                  <h3>Market activity</h3>
                  <p className="dsub">dated events across {compCount} competitors · last 6 months · plotted on when they happened, not when we found them</p>
                </div>
                <div className="dlegend">
                  <span><i className="li p" />Product &amp; pricing</span>
                  <span><i className="li g" />GTM — ads &amp; hiring</span>
                  <span><i className="li m" />Market &amp; news</span>
                </div>
              </div>
              <div className="chart-chip-wrap">
                <div className="up-chip">
                  <b>{thisWeekTotal > 0 ? `+${thisWeekTotal}` : `+${last30}`}</b>
                  <span>{thisWeekTotal > 0 ? 'events this week' : 'events, last 30 days'}</span>
                </div>
              </div>
              <svg viewBox={`0 0 ${CW} 224`} className="wchart" aria-label="Weekly verified signals">
                <defs>
                  <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b8df0" /><stop offset="100%" stopColor="#5457d6" />
                  </linearGradient>
                  <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e0a9cd" /><stop offset="100%" stopColor="#c04b8f" />
                  </linearGradient>
                  <linearGradient id="gm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e6e7f5" /><stop offset="100%" stopColor="#c9cbe6" />
                  </linearGradient>
                </defs>
                {weeks.map((w, i) => {
                  const x = GAP + i * (BW + GAP);
                  const total = w.product + w.gtm + w.market;
                  if (total === 0) {
                    return <rect key={w.key} x={x} y={CH - 3} width={BW} height={3} rx={1.5} fill="#ececf4" />;
                  }
                  const hP = (w.product / maxWeek) * (CH - 10);
                  const hG = (w.gtm / maxWeek) * (CH - 10);
                  const hM = (w.market / maxWeek) * (CH - 10);
                  let y = CH;
                  const segs: React.ReactNode[] = [];
                  if (w.market > 0) { y -= hM; segs.push(<rect key="m" x={x} y={y} width={BW} height={hM} rx={3} fill="url(#gm)" />); }
                  if (w.gtm > 0) { y -= hG; segs.push(<rect key="g" x={x} y={y} width={BW} height={hG} rx={3} fill="url(#gg)" />); }
                  if (w.product > 0) { y -= hP; segs.push(<rect key="p" x={x} y={y} width={BW} height={hP} rx={3} fill="url(#gp)" />); }
                  return <g key={w.key}>{segs}</g>;
                })}
                {monthTicks.map((t) => (
                  <text key={t.idx} x={GAP + t.idx * (BW + GAP)} y={214} className="wchart-tick">{t.label}</text>
                ))}
              </svg>
            </div>

            <div className="dash-row">
              <div className="dcard">
                <div className="dhead">
                  <h3>Threat Index</h3>
                  <a className="mod-more" href="/competitors">Compare →</a>
                </div>
                {threat.map((t) => (
                  <a className="sc-row" key={t.slug} href={`/feed?comp=${t.slug}`}>
                    <span className="sc-avatar">{initials(t.competitor)}</span>
                    <span className="sc-name">{t.competitor}</span>
                    <span className="sc-track"><span className="sc-bar" style={{ width: `${t.total}%` }} /></span>
                    <span className="sc-n">{t.total}</span>
                  </a>
                ))}
              </div>
              <div className="dcard">
                <div className="dhead">
                  <h3>Coverage</h3>
                  <a className="mod-more" href="/admin">Detail →</a>
                </div>
                <div className="prog-row">
                  <span className="prog-l">Channels live</span>
                  <span className="prog-track"><span className="prog-bar pb1" style={{ width: `${(activeChannels / CHANNELS.length) * 100}%` }} /></span>
                  <span className="prog-n">{activeChannels}/{CHANNELS.length}</span>
                </div>
                <div className="prog-row">
                  <span className="prog-l">Battlecards ready</span>
                  <span className="prog-track"><span className="prog-bar pb2" style={{ width: `${compCount ? (battlecardCount / compCount) * 100 : 0}%` }} /></span>
                  <span className="prog-n">{battlecardCount}/{compCount}</span>
                </div>
                <div className="prog-row">
                  <span className="prog-l">Reads current</span>
                  <span className="prog-track"><span className="prog-bar pb3" style={{ width: `${compCount ? (readsCount / compCount) * 100 : 0}%` }} /></span>
                  <span className="prog-n">{readsCount}/{compCount}</span>
                </div>
                <p className="dnote">{last30} verified signals in the last 30 days. Gated channels light up when a key is added.</p>
              </div>
            </div>
          </div>

          <aside className="dash-side">
            <div className="dhead side">
              <h3>The reads</h3>
              <a className="mod-more" href="/battlecards">All →</a>
            </div>
            {railCards.map((c) => (
              <a className={`mini ${c.g}`} key={c.slug} href="/battlecards">
                <div className="mini-top">
                  <span className="mini-avatar">{initials(c.competitor)}</span>
                  <span className="mini-threat">Threat {c.total}</span>
                </div>
                <span className="mini-name">{c.competitor}</span>
                <span className="mini-hook">{c.read.hook}</span>
                <span className="mini-cta">Open battlecard →</span>
              </a>
            ))}
            {topRadar && (
              <a className="mini dark" href="/radar">
                <div className="mini-top">
                  <span className="mini-tag">Launch Radar</span>
                  <span className={`mini-conf c-${topRadar.confidence.toLowerCase()}`}>{topRadar.confidence}</span>
                </div>
                <span className="mini-hook light">{topRadar.headline}</span>
                <span className="mini-cta">See the evidence →</span>
              </a>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
