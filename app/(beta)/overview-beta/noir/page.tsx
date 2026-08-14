// Design test 3/4 — "Noir", faithful to the black/neon analytics
// reference: own dark top nav (logo · links · gear/bell/avatar), a date
// range, a donut with center number + side legend, an area/line chart with
// a dashed comparison line and a white tooltip flag, twin half-donut
// gauges, clustered multi-color monthly bars, and a "most active" table
// with a footer link row. Own chrome. Real data.
import { requireOrgId } from '@/lib/tenant';
import { getBrandSettings } from '@/lib/brand';
import { getOverviewData, initials, ago } from '@/lib/overviewData';
import BetaSwitcher from '../BetaSwitcher';
import './noir.css';

export const dynamic = 'force-dynamic';

const ORANGE = '#ff9f2e', PINK = '#ff4fa0', BLUE = '#3aa0ff', GREEN = '#58d364', VIOLET = '#b78bff';

export default async function NoirBeta() {
  const orgId = await requireOrgId();
  const d = await getOverviewData(orgId);
  const brand = await getBrandSettings(orgId);
  const me = brand.configured ? brand.brandName : 'Workspace';

  const pTotal = d.weeks.reduce((s, w) => s + w.product, 0);
  const gTotal = d.weeks.reduce((s, w) => s + w.gtm, 0);
  const mTotal = d.weeks.reduce((s, w) => s + w.market, 0);
  const donutSegs = [
    { v: pTotal, c: ORANGE, label: 'Product & pricing' },
    { v: gTotal, c: PINK, label: 'GTM — ads & hiring' },
    { v: mTotal, c: BLUE, label: 'Market & news' },
  ];
  const donutSum = Math.max(1, pTotal + gTotal + mTotal);
  const CIRC = 2 * Math.PI * 40;
  let acc = 0;

  // area chart: weekly totals (solid) + 4-week moving average (dashed)
  const LW = 560, LH = 130;
  const totals = d.weeks.map((w) => w.product + w.gtm + w.market);
  const px = (i: number) => (i / (totals.length - 1)) * LW;
  const py = (v: number) => LH - 8 - (v / d.maxWeek) * (LH - 20);
  const line = totals.map((v, i) => `${px(i)},${py(v)}`).join(' ');
  const avg = totals.map((_, i) => {
    const s = totals.slice(Math.max(0, i - 3), i + 1);
    return s.reduce((a, b) => a + b, 0) / s.length;
  });
  const avgLine = avg.map((v, i) => `${px(i)},${py(v)}`).join(' ');
  let hiIdx = 0;
  totals.forEach((v, i) => { if (v > totals[hiIdx]) hiIdx = i; });
  const flagX = Math.min(Math.max(px(hiIdx) - 55, 2), LW - 116);

  // clustered monthly bars per bucket
  const months = new Map<string, { label: string; product: number; gtm: number; market: number }>();
  for (const w of d.weeks) {
    if (!months.has(w.label)) months.set(w.label, { label: w.label, product: 0, gtm: 0, market: 0 });
    const m = months.get(w.label)!;
    m.product += w.product; m.gtm += w.gtm; m.market += w.market;
  }
  const monthArr = [...months.values()];
  const mMax = Math.max(1, ...monthArr.flatMap((m) => [m.product, m.gtm, m.market]));

  const gauge = (v: number, max: number) => `${(Math.min(1, v / Math.max(1, max))) * 126} 252`;

  return (
    <main className="nx">
      <BetaSwitcher active="noir" />
      <div className="nx-frame">
        <header className="nx-top">
          <a className="nx-logo" href="/overview">
            <svg viewBox="0 0 26 26"><line x1="2" y1="21" x2="9" y2="6" /><line x1="8" y1="21" x2="15" y2="3" /><line x1="14" y1="21" x2="21" y2="9" /><line x1="20" y1="21" x2="24" y2="13" /></svg>
          </a>
          <nav className="nx-nav">
            <a className="on" href="/overview-beta/noir">Dashboard</a>
            <a href="/feed">Feed</a>
            <a href="/battlecards">Battlecards</a>
            <a href="/radar">Radar</a>
            <a href="/industry">Industry</a>
          </nav>
          <div className="nx-topright">
            <button className="nx-icb" aria-label="Settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.06-.4.1-.8.1-1.2Z" strokeLinejoin="round" /></svg></button>
            <button className="nx-icb" aria-label="Notifications"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 4a5.5 5.5 0 0 0-5.5 5.5c0 4-1.8 5.5-1.8 5.5h14.6s-1.8-1.5-1.8-5.5A5.5 5.5 0 0 0 12 4Z" strokeLinejoin="round" /></svg><i /></button>
            <span className="nx-avatar">{initials(me)}</span>
          </div>
        </header>

        <div className="nx-sub">
          <span className="nx-range mono">▦ last 6 months · dated events</span>
          <div className="nx-tabs">
            <a className="on" href="/overview-beta/noir">Review</a>
            <a href="/feed">Signals</a>
            <a href="/mentions">Mentions</a>
            <a href="/battlecards">Reads</a>
          </div>
        </div>

        <div className="nx-grid">
          <div className="nx-card">
            <div className="nx-ch"><h3>Events by type</h3><span className="mono">6 mo</span></div>
            <div className="nx-donut-row">
              <svg viewBox="0 0 100 100" className="nx-donut">
                {donutSegs.map((s, i) => {
                  const frac = s.v / donutSum;
                  const el = (
                    <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={s.c} strokeWidth="11"
                      strokeDasharray={`${frac * CIRC} ${CIRC}`} strokeDashoffset={-acc * CIRC}
                      transform="rotate(-90 50 50)" strokeLinecap="butt" />
                  );
                  acc += frac;
                  return el;
                })}
                <text x="50" y="47" textAnchor="middle" className="nx-donut-n">{donutSum}</text>
                <text x="50" y="61" textAnchor="middle" className="nx-donut-l">events</text>
              </svg>
              <div className="nx-donut-legend">
                {donutSegs.map((s) => (
                  <div key={s.label}><i style={{ background: s.c }} /><span>{s.label}</span><b className="mono">{s.v}</b></div>
                ))}
              </div>
            </div>
          </div>

          <div className="nx-card nx-span2">
            <div className="nx-ch"><h3>Total activity</h3><span className="mono"><i className="nx-dot" style={{ background: BLUE }} /> weekly · <i className="nx-dot" style={{ background: ORANGE }} /> 4-wk avg</span></div>
            <svg viewBox={`0 0 ${LW} ${LH + 34}`} className="nx-area" preserveAspectRatio="none">
              <polygon points={`0,${LH} ${line} ${LW},${LH}`} fill="url(#nxfill)" opacity="0.35" />
              <defs>
                <linearGradient id="nxfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BLUE} /><stop offset="100%" stopColor="transparent" /></linearGradient>
              </defs>
              <polyline points={line} fill="none" stroke={BLUE} strokeWidth="2" />
              <polyline points={avgLine} fill="none" stroke={ORANGE} strokeWidth="1.5" strokeDasharray="5 4" />
              <line x1={px(hiIdx)} y1={py(totals[hiIdx])} x2={px(hiIdx)} y2={LH} stroke="#ffffff33" />
              <circle cx={px(hiIdx)} cy={py(totals[hiIdx])} r="3.5" fill="#fff" />
              <g>
                <rect x={flagX} y={0} width={112} height={26} rx={7} fill="#fff" />
                <text x={flagX + 10} y={17} className="nx-flag">{d.weeks[hiIdx].nice} · {totals[hiIdx]} events</text>
              </g>
              {d.monthTicks.map((t) => (
                <text key={t.idx} x={px(t.idx)} y={LH + 26} className="nx-xt mono">{t.label}</text>
              ))}
            </svg>
          </div>

          <div className="nx-card">
            <div className="nx-ch"><h3>Statistics</h3><span className="mono">now</span></div>
            <div className="nx-gauges">
              <div>
                <svg viewBox="0 0 100 58"><path d="M10 52 A44 44 0 0 1 90 52" fill="none" stroke="#26262e" strokeWidth="9" strokeLinecap="round" /><path d="M10 52 A44 44 0 0 1 90 52" fill="none" stroke={PINK} strokeWidth="9" strokeLinecap="round" strokeDasharray={gauge(d.thisWeekTotal, 20)} /></svg>
                <b className="mono" style={{ color: PINK }}>+{d.thisWeekTotal}</b>
                <span>events this week</span>
              </div>
              <div>
                <svg viewBox="0 0 100 58"><path d="M10 52 A44 44 0 0 1 90 52" fill="none" stroke="#26262e" strokeWidth="9" strokeLinecap="round" /><path d="M10 52 A44 44 0 0 1 90 52" fill="none" stroke={VIOLET} strokeWidth="9" strokeLinecap="round" strokeDasharray={gauge(d.mTotal, 30)} /></svg>
                <b className="mono" style={{ color: VIOLET }}>{d.mTotal}</b>
                <span>mentions of {me}</span>
              </div>
            </div>
            <div className="nx-threatline">
              {d.threat.slice(0, 3).map((t, i) => (
                <div key={t.slug}><i style={{ background: [ORANGE, PINK, BLUE][i] }} /><span>{t.competitor}</span><b className="mono">{t.total}</b></div>
              ))}
            </div>
          </div>

          <div className="nx-card nx-span2">
            <div className="nx-ch"><h3>Activity by month</h3><span className="mono"><i className="nx-dot" style={{ background: ORANGE }} /> product <i className="nx-dot" style={{ background: PINK }} /> gtm <i className="nx-dot" style={{ background: GREEN }} /> market</span></div>
            <div className="nx-months">
              {monthArr.map((m) => (
                <div className="nx-month" key={m.label}>
                  <div className="nx-mbars">
                    <span style={{ height: `${Math.max(4, (m.product / mMax) * 100)}%`, background: ORANGE }} title={`${m.product} product`} />
                    <span style={{ height: `${Math.max(4, (m.gtm / mMax) * 100)}%`, background: PINK }} title={`${m.gtm} gtm`} />
                    <span style={{ height: `${Math.max(4, (m.market / mMax) * 100)}%`, background: GREEN }} title={`${m.market} market`} />
                  </div>
                  <span className="nx-mlabel mono">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="nx-card">
            <div className="nx-ch"><h3>Most active</h3><span className="mono">60 d</span></div>
            <table className="nx-table">
              <tbody>
                {d.highlights.slice(0, 5).map((h, i) => (
                  <tr key={i}>
                    <td className="nx-td-name">{h.name}</td>
                    <td className="nx-td-text">{h.headline}</td>
                    <td className="nx-td-when mono">{ago(h.when)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="nx-foot">
              <a href="/admin">Status</a><a href="/industry">Industry</a><a href="/mentions">Mentions</a><a href="/battlecards">Reads</a><a href="/radar">Radar</a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
