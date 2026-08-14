// Overview — a dashboard, not a document. One big real activity chart
// (filterable per competitor, tooltips per week), the bundled highlights
// that actually matter ("10 new ads observed", "covered by 5 outlets"), the
// Threat score list, coverage, your own mentions as a mini chart, a line of
// industry pulse, an ask box — and a right rail carrying each competitor
// read's one-line hook into its battlecard. Deep reasoning lives on
// /battlecards; single events live on /feed.
import { getDb } from '@/db/client';
import { computeThreat } from '@/lib/threat';
import { CHANNELS } from '@/lib/channels';
import { requireOrgId } from '@/lib/tenant';
import { getCompetitorReads } from '@/lib/reason';
import { computeRadar } from '@/lib/radar';
import { bundleRows, type BundleRow } from '@/lib/bundle';
import { findBrandMentions } from '@/lib/mentions';
import { industryNews } from '@/lib/industryNews';

export const dynamic = 'force-dynamic';

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const catClass = (c: string) => `c-${(c || 'other').toLowerCase()}`;

function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Working late';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function bucketOf(category: string | null): 'product' | 'gtm' | 'market' {
  if (category === 'Product' || category === 'Pricing') return 'product';
  if (category === 'Ads' || category === 'Hiring' || category === 'Marketing') return 'gtm';
  return 'market';
}

function ago(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const h = Math.floor(d / 3600000);
  if (h < 24) return `${Math.max(1, h)}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const WEEKS = 26;

export default async function Overview({ searchParams }: { searchParams: Promise<{ focus?: string }> }) {
  const { focus } = await searchParams;
  const orgId = await requireOrgId();
  const db = await getDb();

  const threat = await computeThreat(orgId);
  const focusComp = focus ? threat.find((t) => t.slug === focus) : null;

  // Real weekly event volume — DATED events only, plotted on when they
  // happened (a first-crawl baseline of undated signals would otherwise
  // fake a spike on crawl week). Optional per-competitor focus.
  const chartParams: unknown[] = [orgId];
  let chartFocusClause = '';
  if (focusComp) {
    chartParams.push(focusComp.slug);
    chartFocusClause = ` AND c.slug = $${chartParams.length}`;
  }
  const weekRows = await db.query<{ wk: string; category: string | null; n: number }>(
    `SELECT date_trunc('week', si.published_at)::date::text AS wk, si.category, COUNT(*)::int AS n
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE c.org_id = $1 AND si.status IN ('pending','signaled')
       AND si.published_at IS NOT NULL AND si.published_at >= now() - interval '${WEEKS * 7} days'${chartFocusClause}
     GROUP BY 1, 2`,
    chartParams,
  );

  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const localKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const weeks: { key: string; label: string; nice: string; product: number; gtm: number; market: number }[] = [];
  for (let i = WEEKS - 1; i >= 0; i--) {
    const d = new Date(monday);
    d.setDate(monday.getDate() - i * 7);
    weeks.push({
      key: localKey(d),
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      nice: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      product: 0,
      gtm: 0,
      market: 0,
    });
  }
  const byKey = new Map(weeks.map((w) => [w.key, w]));
  for (const r of weekRows) {
    const w = byKey.get(r.wk);
    if (w) w[bucketOf(r.category)] += r.n;
  }
  const maxWeek = Math.max(1, ...weeks.map((w) => w.product + w.gtm + w.market));
  const thisWeek = weeks[weeks.length - 1];
  const thisWeekTotal = thisWeek.product + thisWeek.gtm + thisWeek.market;
  const chartTotal = weeks.reduce((s, w) => s + w.product + w.gtm + w.market, 0);

  const monthTicks: { idx: number; label: string }[] = [];
  let lastMonth = '';
  weeks.forEach((w, idx) => {
    if (w.label !== lastMonth) {
      monthTicks.push({ idx, label: w.label });
      lastMonth = w.label;
    }
  });

  // Highlights: bundle the last 60 days of signals, keep what matters —
  // multi-item bundles (an ad blitz, a PR push) and high-impact singles.
  const hlRows = await db.query<BundleRow>(
    `SELECT si.id, si.channel, si.category, si.score, si.title, si.url, si.created_at, si.published_at, c.name, c.slug
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE c.org_id = $1 AND si.status IN ('pending','signaled')
       AND COALESCE(si.published_at, si.created_at) >= now() - interval '60 days'
     ORDER BY si.score DESC NULLS LAST, si.created_at DESC LIMIT 400`,
    [orgId],
  );
  const highlights = bundleRows(hlRows)
    .filter((b) => b.rows.length >= 2 || b.score >= 80)
    .sort((a, b) => b.rows.length * 12 + b.score - (a.rows.length * 12 + a.score))
    .slice(0, 5);

  const reads = await getCompetitorReads(orgId);
  const radar = await computeRadar(orgId);
  const topRadar = radar[0];
  const mentions = await findBrandMentions(orgId);
  const pulse = await industryNews(orgId, 3);

  // Mentions mini chart: news + signal mentions of the workspace's own
  // brand by week, last 12 weeks (directional — capped RSS source).
  const M_WEEKS = 12;
  const mWeeks: { key: string; n: number }[] = [];
  for (let i = M_WEEKS - 1; i >= 0; i--) {
    const d = new Date(monday);
    d.setDate(monday.getDate() - i * 7);
    mWeeks.push({ key: localKey(d), n: 0 });
  }
  const mByKey = new Map(mWeeks.map((w) => [w.key, w]));
  const mentionDates = [
    ...mentions.news.map((n) => n.publishedAt).filter(Boolean) as string[],
    ...mentions.signalMentions.map((s) => s.at),
  ];
  for (const iso of mentionDates) {
    const d = new Date(iso);
    const wd = new Date(d);
    wd.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const w = mByKey.get(localKey(wd));
    if (w) w.n++;
  }
  const mMax = Math.max(1, ...mWeeks.map((w) => w.n));
  const mTotal = mWeeks.reduce((s, w) => s + w.n, 0);

  const compCount = threat.length;
  const battlecardCount = Number(
    (await db.query<{ n: string }>(
      'SELECT COUNT(*)::text n FROM battlecards b JOIN competitors c ON c.id = b.competitor_id WHERE c.org_id = $1',
      [orgId],
    ))[0]?.n ?? 0,
  );
  const activeChannels = CHANNELS.filter((c) => c.status === 'active').length;

  const railCards = threat
    .filter((t) => reads.has(t.slug))
    .slice(0, 3)
    .map((t, i) => ({ ...t, read: reads.get(t.slug)!, g: `g${(i % 3) + 1}` }));

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
                  <h3>Market activity{focusComp ? ` — ${focusComp.competitor}` : ''}</h3>
                  <p className="dsub">{chartTotal} dated events · last 6 months · plotted on when they happened, not when we found them</p>
                </div>
                <div className="dlegend">
                  <span><i className="li p" />Product &amp; pricing</span>
                  <span><i className="li g" />GTM — ads &amp; hiring</span>
                  <span><i className="li m" />Market &amp; news</span>
                </div>
              </div>
              <div className="chart-chip-wrap">
                <div className="up-chip">
                  <b>+{thisWeekTotal}</b>
                  <span>events this week</span>
                </div>
              </div>
              <svg viewBox={`0 0 ${CW} 224`} className="wchart" aria-label="Weekly verified events">
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
                  const tip = `Week of ${w.nice} — ${total} event${total === 1 ? '' : 's'}: ${w.product} product, ${w.gtm} GTM, ${w.market} market`;
                  if (total === 0) {
                    return (
                      <g key={w.key}><title>{tip}</title><rect x={x} y={CH - 3} width={BW} height={3} rx={1.5} fill="#ececf4" /></g>
                    );
                  }
                  const hP = (w.product / maxWeek) * (CH - 10);
                  const hG = (w.gtm / maxWeek) * (CH - 10);
                  const hM = (w.market / maxWeek) * (CH - 10);
                  let y = CH;
                  const segs: React.ReactNode[] = [];
                  if (w.market > 0) { y -= hM; segs.push(<rect key="m" x={x} y={y} width={BW} height={hM} rx={3} fill="url(#gm)" />); }
                  if (w.gtm > 0) { y -= hG; segs.push(<rect key="g" x={x} y={y} width={BW} height={hG} rx={3} fill="url(#gg)" />); }
                  if (w.product > 0) { y -= hP; segs.push(<rect key="p" x={x} y={y} width={BW} height={hP} rx={3} fill="url(#gp)" />); }
                  return <g key={w.key}><title>{tip}</title>{segs}</g>;
                })}
                {monthTicks.map((t) => (
                  <text key={t.idx} x={GAP + t.idx * (BW + GAP)} y={214} className="wchart-tick">{t.label}</text>
                ))}
              </svg>
              <div className="chart-chips">
                <a href="/overview" className={`cchip ${!focusComp ? 'on' : ''}`}>All</a>
                {threat.map((t) => (
                  <a key={t.slug} href={`/overview?focus=${t.slug}`} className={`cchip ${focusComp?.slug === t.slug ? 'on' : ''}`} title={t.competitor}>
                    <span className="cchip-av">{initials(t.competitor)}</span>{t.competitor}
                  </a>
                ))}
              </div>
            </div>

            {highlights.length > 0 && (
              <div className="dcard">
                <div className="dhead">
                  <h3>Highlights</h3>
                  <a className="mod-more" href="/feed">Full feed →</a>
                </div>
                {highlights.map((h, i) => (
                  <a className="hl-row" key={i} href={`/feed?comp=${h.slug}`}>
                    <span className={`badge ${catClass(h.category)}`}>{h.category}</span>
                    <span className="hl-name">{h.name}</span>
                    <span className="hl-text">{h.headline}{h.sub ? <span className="hl-sub"> — {h.sub}</span> : null}</span>
                    <span className="hl-when">{ago(h.when)}</span>
                  </a>
                ))}
              </div>
            )}

            <div className="dash-row">
              <div className="dcard">
                <div className="dhead">
                  <h3>Threat Index</h3>
                  <a className="mod-more" href="/battlecards">Compare →</a>
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
                  <span className="prog-track"><span className="prog-bar pb3" style={{ width: `${compCount ? (reads.size / compCount) * 100 : 0}%` }} /></span>
                  <span className="prog-n">{reads.size}/{compCount}</span>
                </div>
                <p className="dnote">Gated channels light up when a key is added.</p>
              </div>
            </div>

            <div className="dash-row r2">
              <div className="dcard">
                <div className="dhead">
                  <h3>{mentions.configured ? `Mentions of ${mentions.brandName}` : 'Your mentions'}</h3>
                  <a className="mod-more" href="/mentions">All →</a>
                </div>
                {!mentions.configured ? (
                  <p className="covnote">Set your brand identity on the <a href="/mentions" style={{ color: 'var(--brand)', fontWeight: 700 }}>Mentions page</a> to start tracking where you&apos;re named.</p>
                ) : (
                  <>
                    <svg viewBox="0 0 280 74" className="mchart" aria-label="Brand mentions by week">
                      <defs>
                        <linearGradient id="gpm" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#8b8df0" /><stop offset="100%" stopColor="#5457d6" />
                        </linearGradient>
                      </defs>
                      {mWeeks.map((w, i) => {
                        const bw = 16;
                        const gap = (280 - M_WEEKS * bw) / (M_WEEKS + 1);
                        const h = w.n === 0 ? 3 : Math.max(6, (w.n / mMax) * 60);
                        return (
                          <g key={w.key}><title>{`Week of ${w.key}: ${w.n} mention${w.n === 1 ? '' : 's'}`}</title>
                            <rect x={gap + i * (bw + gap)} y={66 - h} width={bw} height={h} rx={3} fill={w.n === 0 ? '#ececf4' : 'url(#gpm)'} />
                          </g>
                        );
                      })}
                    </svg>
                    <p className="dnote">{mTotal} mention{mTotal === 1 ? '' : 's'} in news and captured signals, last 12 weeks — directional, from public sources.</p>
                  </>
                )}
              </div>
              <div className="dcard">
                <div className="dhead">
                  <h3>Industry pulse</h3>
                  <a className="mod-more" href="/industry">All →</a>
                </div>
                {pulse.length === 0 ? (
                  <p className="covnote">Headlines unavailable right now — back on the next load.</p>
                ) : (
                  pulse.map((p, i) => (
                    <a className="pulse-row" key={i} href={p.url} target="_blank" rel="noreferrer">
                      <span className="pulse-t">{p.title}</span>
                      <span className="pulse-s">{p.source}</span>
                    </a>
                  ))
                )}
              </div>
            </div>
          </div>

          <aside className="dash-side">
            <form className="ask-mini" action="/ask" method="get">
              <span className="mini-tag">Ask Watchtower</span>
              <input name="q" placeholder="What changed on CreatorIQ's pricing?" maxLength={300} />
            </form>
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
