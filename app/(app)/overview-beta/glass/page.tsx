// Design test 1/4 — "Glass": frosted translucent cards, sage/mint hue,
// soft blurred gradient backdrop. Real data via getOverviewData; this is a
// skin test, not a new feature.
import { requireOrgId } from '@/lib/tenant';
import { getOverviewData, greeting, initials, ago } from '@/lib/overviewData';
import BetaSwitcher from '../BetaSwitcher';
import './glass.css';

export const dynamic = 'force-dynamic';

export default async function GlassBeta() {
  const orgId = await requireOrgId();
  const d = await getOverviewData(orgId);
  const CW = 640, CH = 150, BW = 14, GAP = (CW - 26 * BW) / 27;

  return (
    <main className="main">
      <BetaSwitcher active="glass" />
      <div className="ov-glass">
        <div className="g-wrap">
          <header className="g-head">
            <span className="g-wave">👋</span>
            <div>
              <h1>{greeting()}</h1>
              <p>Here&apos;s what your market did.</p>
            </div>
          </header>

          <div className="g-grid">
            <div className="g-card g-hero">
              <span className="g-label">Events this week</span>
              <div className="g-bignum">{d.thisWeekTotal}</div>
              <span className="g-sub">{d.chartTotal} in the last 6 months</span>
              <div className="g-spark">
                {d.weeks.slice(-10).map((w, i) => {
                  const t = w.product + w.gtm + w.market;
                  const h = Math.max(4, (t / d.maxWeek) * 34);
                  return <span key={i} style={{ height: h }} />;
                })}
              </div>
            </div>

            <div className="g-card g-chart">
              <div className="g-card-head">
                <h3>Market activity</h3>
                <div className="g-legend">
                  <span><i className="gl-p" />Product</span>
                  <span><i className="gl-g" />GTM</span>
                  <span><i className="gl-m" />Market</span>
                </div>
              </div>
              <svg viewBox={`0 0 ${CW} ${CH + 24}`} className="g-svg">
                <defs>
                  <linearGradient id="ggp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7bcba3" /><stop offset="100%" stopColor="#3f8f68" /></linearGradient>
                  <linearGradient id="ggg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a9dfc4" /><stop offset="100%" stopColor="#6cbf94" /></linearGradient>
                  <linearGradient id="ggm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#e4f3ea" /><stop offset="100%" stopColor="#c9e8d6" /></linearGradient>
                </defs>
                {d.weeks.map((w, i) => {
                  const x = GAP + i * (BW + GAP);
                  const total = w.product + w.gtm + w.market;
                  if (total === 0) return <rect key={w.key} x={x} y={CH - 2} width={BW} height={2} rx={1} fill="rgba(63,143,104,.15)" />;
                  const hP = (w.product / d.maxWeek) * (CH - 8), hG = (w.gtm / d.maxWeek) * (CH - 8), hM = (w.market / d.maxWeek) * (CH - 8);
                  let y = CH;
                  const segs: React.ReactNode[] = [];
                  if (w.market > 0) { y -= hM; segs.push(<rect key="m" x={x} y={y} width={BW} height={hM} rx={4} fill="url(#ggm)" />); }
                  if (w.gtm > 0) { y -= hG; segs.push(<rect key="g" x={x} y={y} width={BW} height={hG} rx={4} fill="url(#ggg)" />); }
                  if (w.product > 0) { y -= hP; segs.push(<rect key="p" x={x} y={y} width={BW} height={hP} rx={4} fill="url(#ggp)" />); }
                  return <g key={w.key}>{segs}</g>;
                })}
              </svg>
            </div>

            <div className="g-card g-list">
              <div className="g-card-head"><h3>Threat Index</h3></div>
              {d.threat.map((t) => (
                <a className="g-row" key={t.slug} href={`/feed?comp=${t.slug}`}>
                  <span className="g-av">{initials(t.competitor)}</span>
                  <span className="g-row-name">{t.competitor}</span>
                  <span className="g-track"><span className="g-bar" style={{ width: `${t.total}%` }} /></span>
                  <span className="g-row-n">{t.total}</span>
                </a>
              ))}
            </div>

            <div className="g-card g-list">
              <div className="g-card-head"><h3>Highlights</h3></div>
              {d.highlights.slice(0, 4).map((h, i) => (
                <a className="g-hl" key={i} href={`/feed?comp=${h.slug}`}>
                  <span className="g-hl-tag">{h.category}</span>
                  <span className="g-hl-text"><b>{h.name}</b> {h.headline}</span>
                  <span className="g-hl-when">{ago(h.when)}</span>
                </a>
              ))}
              {d.highlights.length === 0 && <p className="g-empty">No bundled highlights yet.</p>}
            </div>

            <div className="g-card g-wide">
              <div className="g-card-head"><h3>The reads</h3></div>
              <div className="g-reads">
                {d.railCards.map((c) => (
                  <a className="g-readcard" key={c.slug} href="/battlecards">
                    <span className="g-av">{initials(c.competitor)}</span>
                    <span className="g-read-name">{c.competitor}<i>Threat {c.total}</i></span>
                    <p>{c.read.hook}</p>
                  </a>
                ))}
              </div>
            </div>

            <div className="g-card g-coverage">
              <div className="g-card-head"><h3>Coverage</h3></div>
              <div className="g-ring-row">
                <svg viewBox="0 0 80 80" className="g-ring">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(63,143,104,.14)" strokeWidth="9" />
                  <circle cx="40" cy="40" r="34" fill="none" stroke="url(#ggp)" strokeWidth="9" strokeLinecap="round"
                    strokeDasharray={`${(d.activeChannels / d.totalChannels) * 213} 213`} transform="rotate(-90 40 40)" />
                  <text x="40" y="46" textAnchor="middle" className="g-ring-n">{d.activeChannels}/{d.totalChannels}</text>
                </svg>
                <div>
                  <p><b>{d.battlecardCount}/{d.compCount}</b> battlecards ready</p>
                  <p><b>{d.reads.size}/{d.compCount}</b> reads current</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
