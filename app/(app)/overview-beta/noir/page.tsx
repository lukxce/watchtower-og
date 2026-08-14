// Design test 3/4 — "Noir": true-black, neon multi-color accents, terminal feel.
import { requireOrgId } from '@/lib/tenant';
import { getOverviewData, greeting, initials, ago } from '@/lib/overviewData';
import BetaSwitcher from '../BetaSwitcher';
import './noir.css';

export const dynamic = 'force-dynamic';

const NEON = ['#ff8a3d', '#ff5fa2', '#4fc3ff', '#b6ff3d', '#c58bff', '#3dffc4'];

export default async function NoirBeta() {
  const orgId = await requireOrgId();
  const d = await getOverviewData(orgId);
  const CW = 640, CH = 140, BW = 14, GAP = (CW - 26 * BW) / 27;
  const covPct = Math.round((d.activeChannels / d.totalChannels) * 100);

  return (
    <main className="main">
      <BetaSwitcher active="noir" />
      <div className="ov-noir">
        <div className="nr-wrap">
          <header className="nr-head">
            <span className="nr-eyebrow mono">// {greeting().toUpperCase()}</span>
            <h1>Market Overview</h1>
          </header>

          <div className="nr-stats">
            <div className="nr-stat">
              <span className="nr-stat-l">Events this week</span>
              <span className="nr-stat-n" style={{ color: NEON[0] }}>{d.thisWeekTotal}</span>
            </div>
            <div className="nr-stat">
              <span className="nr-stat-l">6-month total</span>
              <span className="nr-stat-n" style={{ color: NEON[2] }}>{d.chartTotal}</span>
            </div>
            <div className="nr-stat">
              <span className="nr-stat-l">Top threat</span>
              <span className="nr-stat-n" style={{ color: NEON[1] }}>{d.threat[0]?.total ?? '—'}</span>
            </div>
            <div className="nr-stat">
              <span className="nr-stat-l">Coverage</span>
              <span className="nr-stat-n" style={{ color: NEON[3] }}>{covPct}%</span>
            </div>
          </div>

          <div className="nr-grid">
            <div className="nr-card nr-chart">
              <div className="nr-card-head"><h3>Market Activity</h3><span className="mono nr-dim">weekly · dated events</span></div>
              <svg viewBox={`0 0 ${CW} ${CH + 20}`} className="nr-svg">
                {d.weeks.map((w, i) => {
                  const x = GAP + i * (BW + GAP);
                  const total = w.product + w.gtm + w.market;
                  if (total === 0) return <rect key={w.key} x={x} y={CH - 1} width={BW} height={1} fill="rgba(255,255,255,.08)" />;
                  const hP = (w.product / d.maxWeek) * (CH - 6), hG = (w.gtm / d.maxWeek) * (CH - 6), hM = (w.market / d.maxWeek) * (CH - 6);
                  let y = CH;
                  const segs: React.ReactNode[] = [];
                  if (w.market > 0) { y -= hM; segs.push(<rect key="m" x={x} y={y} width={BW} height={hM} fill={NEON[2]} opacity={0.55} />); }
                  if (w.gtm > 0) { y -= hG; segs.push(<rect key="g" x={x} y={y} width={BW} height={hG} fill={NEON[1]} />); }
                  if (w.product > 0) { y -= hP; segs.push(<rect key="p" x={x} y={y} width={BW} height={hP} fill={NEON[0]} />); }
                  return <g key={w.key}>{segs}</g>;
                })}
              </svg>
              <div className="nr-legend mono">
                <span style={{ color: NEON[0] }}>■ product</span>
                <span style={{ color: NEON[1] }}>■ gtm</span>
                <span style={{ color: NEON[2] }}>■ market</span>
              </div>
            </div>

            <div className="nr-card nr-ring">
              <div className="nr-card-head"><h3>Coverage</h3></div>
              <svg viewBox="0 0 100 100" className="nr-ringsvg">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="10" />
                <circle cx="50" cy="50" r="42" fill="none" stroke={NEON[3]} strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={`${(covPct / 100) * 264} 264`} transform="rotate(-90 50 50)" />
                <text x="50" y="56" textAnchor="middle" className="nr-ring-n mono" fill={NEON[3]}>{d.activeChannels}/{d.totalChannels}</text>
              </svg>
              <p className="mono nr-dim">channels live</p>
            </div>

            <div className="nr-card">
              <div className="nr-card-head"><h3>Threat Index</h3></div>
              {d.threat.map((t, i) => (
                <a className="nr-row" key={t.slug} href={`/feed?comp=${t.slug}`}>
                  <span className="nr-av" style={{ color: NEON[i % NEON.length] }}>{initials(t.competitor)}</span>
                  <span className="nr-row-name">{t.competitor}</span>
                  <span className="nr-track"><span className="nr-bar" style={{ width: `${t.total}%`, background: NEON[i % NEON.length] }} /></span>
                  <span className="nr-row-n mono">{t.total}</span>
                </a>
              ))}
            </div>

            <div className="nr-card">
              <div className="nr-card-head"><h3>Highlights</h3></div>
              {d.highlights.slice(0, 5).map((h, i) => (
                <a className="nr-hl" key={i} href={`/feed?comp=${h.slug}`}>
                  <span className="nr-hl-tag mono" style={{ color: NEON[i % NEON.length] }}>{h.category}</span>
                  <span className="nr-hl-text"><b>{h.name}</b> {h.headline}</span>
                  <span className="nr-hl-when mono">{ago(h.when)}</span>
                </a>
              ))}
              {d.highlights.length === 0 && <p className="mono nr-dim">no bundled highlights yet</p>}
            </div>

            <div className="nr-card nr-wide">
              <div className="nr-card-head"><h3>The Reads</h3></div>
              <div className="nr-reads">
                {d.railCards.map((c, i) => (
                  <a className="nr-readcard" key={c.slug} href="/battlecards" style={{ borderColor: `${NEON[i % NEON.length]}44` }}>
                    <span className="nr-av" style={{ color: NEON[i % NEON.length] }}>{initials(c.competitor)}</span>
                    <span className="nr-read-name">{c.competitor}<i className="mono">threat {c.total}</i></span>
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
