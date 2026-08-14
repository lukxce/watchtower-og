// Design test 4/4 — "Daylight": clean white fintech dashboard, colored icon
// avatars, lime/green accent, big friendly greeting.
import { requireOrgId } from '@/lib/tenant';
import { getOverviewData, greeting, initials, ago } from '@/lib/overviewData';
import BetaSwitcher from '../BetaSwitcher';
import './daylight.css';

export const dynamic = 'force-dynamic';

export default async function DaylightBeta() {
  const orgId = await requireOrgId();
  const d = await getOverviewData(orgId);
  const CW = 640, CH = 140, BW = 14, GAP = (CW - 26 * BW) / 27;

  return (
    <main className="main">
      <BetaSwitcher active="daylight" />
      <div className="ov-daylight">
        <div className="dl-wrap">
          <header className="dl-head">
            <div>
              <h1>{greeting()}, watch commander 👋</h1>
              <p>Stay on top of your market, one glance at a time.</p>
            </div>
            <div className="dl-stat-pill">
              <span className="dl-stat-n">{d.thisWeekTotal}</span>
              <span className="dl-stat-l">events this week</span>
            </div>
          </header>

          <div className="dl-kpis">
            <div className="dl-kpi">
              <span className="dl-kpi-ic dl-ic-1">◆</span>
              <div><span className="dl-kpi-n">{d.chartTotal}</span><span className="dl-kpi-l">Dated events, 6mo</span></div>
            </div>
            <div className="dl-kpi">
              <span className="dl-kpi-ic dl-ic-2">▲</span>
              <div><span className="dl-kpi-n">{d.threat[0]?.total ?? '—'}</span><span className="dl-kpi-l">Top threat score</span></div>
            </div>
            <div className="dl-kpi">
              <span className="dl-kpi-ic dl-ic-3">●</span>
              <div><span className="dl-kpi-n">{d.activeChannels}/{d.totalChannels}</span><span className="dl-kpi-l">Channels live</span></div>
            </div>
            <div className="dl-kpi">
              <span className="dl-kpi-ic dl-ic-4">★</span>
              <div><span className="dl-kpi-n">{d.reads.size}/{d.compCount}</span><span className="dl-kpi-l">Reads current</span></div>
            </div>
          </div>

          <div className="dl-grid">
            <div className="dl-card dl-chart">
              <div className="dl-card-head">
                <h3>Market activity</h3>
                <div className="dl-legend">
                  <span><i className="dll-p" />Product</span>
                  <span><i className="dll-g" />GTM</span>
                  <span><i className="dll-m" />Market</span>
                </div>
              </div>
              <svg viewBox={`0 0 ${CW} ${CH + 20}`} className="dl-svg">
                {d.weeks.map((w, i) => {
                  const x = GAP + i * (BW + GAP);
                  const total = w.product + w.gtm + w.market;
                  if (total === 0) return <rect key={w.key} x={x} y={CH - 2} width={BW} height={2} rx={1} fill="#eef0e6" />;
                  const hP = (w.product / d.maxWeek) * (CH - 6), hG = (w.gtm / d.maxWeek) * (CH - 6), hM = (w.market / d.maxWeek) * (CH - 6);
                  let y = CH;
                  const segs: React.ReactNode[] = [];
                  if (w.market > 0) { y -= hM; segs.push(<rect key="m" x={x} y={y} width={BW} height={hM} rx={3} fill="#dfe6cf" />); }
                  if (w.gtm > 0) { y -= hG; segs.push(<rect key="g" x={x} y={y} width={BW} height={hG} rx={3} fill="#161616" />); }
                  if (w.product > 0) { y -= hP; segs.push(<rect key="p" x={x} y={y} width={BW} height={hP} rx={3} fill="#a3d139" />); }
                  return <g key={w.key}>{segs}</g>;
                })}
              </svg>
            </div>

            <div className="dl-card">
              <div className="dl-card-head"><h3>Threat Index</h3></div>
              {d.threat.map((t) => (
                <a className="dl-row" key={t.slug} href={`/feed?comp=${t.slug}`}>
                  <span className="dl-av">{initials(t.competitor)}</span>
                  <span className="dl-row-name">{t.competitor}</span>
                  <span className="dl-track"><span className="dl-bar" style={{ width: `${t.total}%` }} /></span>
                  <span className="dl-row-n">{t.total}</span>
                </a>
              ))}
            </div>

            <div className="dl-card dl-wide">
              <div className="dl-card-head"><h3>Recent highlights</h3><a href="/feed" className="dl-more">Full feed →</a></div>
              <table className="dl-table">
                <tbody>
                  {d.highlights.slice(0, 5).map((h, i) => (
                    <tr key={i}>
                      <td><span className="dl-tabletag">{h.category}</span></td>
                      <td className="dl-tablename">{h.name}</td>
                      <td className="dl-tabletext">{h.headline}</td>
                      <td className="dl-tablewhen">{ago(h.when)}</td>
                    </tr>
                  ))}
                  {d.highlights.length === 0 && <tr><td colSpan={4} className="dl-empty">No bundled highlights yet.</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="dl-card dl-wide">
              <div className="dl-card-head"><h3>The reads</h3><a href="/battlecards" className="dl-more">All →</a></div>
              <div className="dl-reads">
                {d.railCards.map((c) => (
                  <a className="dl-readcard" key={c.slug} href="/battlecards">
                    <span className="dl-av">{initials(c.competitor)}</span>
                    <span className="dl-read-name">{c.competitor}<i>Threat {c.total}</i></span>
                    <p>{c.read.hook}</p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
