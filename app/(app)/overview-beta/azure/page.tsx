// Design test 2/4 — "Azure": deep navy glass panels, blue glow accents.
import { requireOrgId } from '@/lib/tenant';
import { getOverviewData, greeting, initials, ago } from '@/lib/overviewData';
import BetaSwitcher from '../BetaSwitcher';
import './azure.css';

export const dynamic = 'force-dynamic';

export default async function AzureBeta() {
  const orgId = await requireOrgId();
  const d = await getOverviewData(orgId);
  const CW = 640, CH = 150, BW = 14, GAP = (CW - 26 * BW) / 27;

  return (
    <main className="main">
      <BetaSwitcher active="azure" />
      <div className="ov-azure">
        <div className="az-wrap">
          <header className="az-head">
            <div>
              <span className="az-eyebrow">Overview</span>
              <h1>{greeting()}. The state of your market.</h1>
            </div>
            <div className="az-headstat">
              <span>{d.thisWeekTotal}</span>
              <small>events this week</small>
            </div>
          </header>

          <div className="az-grid">
            <div className="az-card az-chart">
              <div className="az-card-head">
                <h3>Market activity</h3>
                <div className="az-legend">
                  <span><i className="al-p" />Product</span>
                  <span><i className="al-g" />GTM</span>
                  <span><i className="al-m" />Market</span>
                </div>
              </div>
              <svg viewBox={`0 0 ${CW} ${CH + 24}`} className="az-svg">
                <defs>
                  <linearGradient id="azp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7fb4ff" /><stop offset="100%" stopColor="#3d7ee0" /></linearGradient>
                  <linearGradient id="azg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9adcf2" /><stop offset="100%" stopColor="#4fb8d9" /></linearGradient>
                  <linearGradient id="azm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2c4a76" /><stop offset="100%" stopColor="#1f3760" /></linearGradient>
                </defs>
                {d.weeks.map((w, i) => {
                  const x = GAP + i * (BW + GAP);
                  const total = w.product + w.gtm + w.market;
                  if (total === 0) return <rect key={w.key} x={x} y={CH - 2} width={BW} height={2} rx={1} fill="rgba(122,164,255,.14)" />;
                  const hP = (w.product / d.maxWeek) * (CH - 8), hG = (w.gtm / d.maxWeek) * (CH - 8), hM = (w.market / d.maxWeek) * (CH - 8);
                  let y = CH;
                  const segs: React.ReactNode[] = [];
                  if (w.market > 0) { y -= hM; segs.push(<rect key="m" x={x} y={y} width={BW} height={hM} rx={4} fill="url(#azm)" />); }
                  if (w.gtm > 0) { y -= hG; segs.push(<rect key="g" x={x} y={y} width={BW} height={hG} rx={4} fill="url(#azg)" />); }
                  if (w.product > 0) { y -= hP; segs.push(<rect key="p" x={x} y={y} width={BW} height={hP} rx={4} fill="url(#azp)" />); }
                  return <g key={w.key}>{segs}</g>;
                })}
              </svg>
            </div>

            <div className="az-card az-focus">
              <div className="az-card-head"><h3>Launch Radar</h3></div>
              {d.topRadar ? (
                <a href="/radar" className="az-radar">
                  <span className={`az-conf az-c-${d.topRadar.confidence.toLowerCase()}`}>{d.topRadar.confidence}</span>
                  <p>{d.topRadar.headline}</p>
                  <span className="az-cta">See the evidence →</span>
                </a>
              ) : <p className="az-empty">Nothing clears the bar yet.</p>}
            </div>

            <div className="az-card az-list">
              <div className="az-card-head"><h3>Threat Index</h3></div>
              {d.threat.map((t) => (
                <a className="az-row" key={t.slug} href={`/feed?comp=${t.slug}`}>
                  <span className="az-av">{initials(t.competitor)}</span>
                  <span className="az-row-name">{t.competitor}</span>
                  <span className="az-track"><span className="az-bar" style={{ width: `${t.total}%` }} /></span>
                  <span className="az-row-n">{t.total}</span>
                </a>
              ))}
            </div>

            <div className="az-card az-list">
              <div className="az-card-head"><h3>Highlights</h3></div>
              {d.highlights.slice(0, 4).map((h, i) => (
                <a className="az-hl" key={i} href={`/feed?comp=${h.slug}`}>
                  <span className="az-hl-tag">{h.category}</span>
                  <span className="az-hl-text"><b>{h.name}</b> {h.headline}</span>
                  <span className="az-hl-when">{ago(h.when)}</span>
                </a>
              ))}
              {d.highlights.length === 0 && <p className="az-empty">No bundled highlights yet.</p>}
            </div>

            <div className="az-card az-wide">
              <div className="az-card-head"><h3>The reads</h3></div>
              <div className="az-reads">
                {d.railCards.map((c) => (
                  <a className="az-readcard" key={c.slug} href="/battlecards">
                    <span className="az-av">{initials(c.competitor)}</span>
                    <span className="az-read-name">{c.competitor}<i>Threat {c.total}</i></span>
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
