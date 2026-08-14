// Design test — "Glass", round 3, faithful to the Rinesk references:
// cool grey-green scene, ONE continuous glass sheet (icon column inside the
// panel's left edge, pill nav, profile row with highlighter-green button,
// right-aligned greeting + refresh), the reference chart anatomy (needle
// bars + smooth highlighter momentum curve + tinted tooltip card + y-ticks
// right + month labels above), value-row legend, then a COOLER frosted
// bottom band split by hairline dividers — no white boxes anywhere.
// Real data via getOverviewData.
import { requireOrgId } from '@/lib/tenant';
import { getBrandSettings } from '@/lib/brand';
import { getOverviewData, greeting, initials } from '@/lib/overviewData';
import BetaSwitcher from '../BetaSwitcher';
import './glass.css';

export const dynamic = 'force-dynamic';

const NAV = [
  { label: 'Overview', href: '/overview-beta/glass', on: true },
  { label: 'Feed', href: '/feed' },
  { label: 'Battlecards', href: '/battlecards' },
  { label: 'Radar', href: '/radar' },
  { label: 'Industry', href: '/industry' },
  { label: 'Mentions', href: '/mentions' },
];
const RAIL = [
  { title: 'All signals', href: '/feed', d: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { title: 'Pricing', href: '/feed?cat=Pricing', d: 'M12 3.5v17M16 7.2c-.8-1.3-2.3-2-4-2-2.3 0-4 1.2-4 3 0 3.9 8 2.1 8 6 0 1.9-1.8 3.1-4 3.1-1.9 0-3.4-.8-4.2-2.2' },
  { title: 'Product', href: '/feed?cat=Product', d: 'M5 19c1.5-4.5 3-7.5 7-11.5 2.5-2.5 6-3 7-2s.5 4.5-2 7C13 16.5 10 18 5.5 19.5Z' },
  { title: 'Hiring', href: '/feed?cat=Hiring', d: 'M12 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 12 11ZM5 19c.8-3 3.5-4.6 7-4.6s6.2 1.6 7 4.6' },
  { title: 'Ads', href: '/feed?cat=Ads', d: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' },
];

// Smooth Catmull-Rom → cubic bézier path through points.
function smoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  let dPath = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
    dPath += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`;
  }
  return dPath;
}

export default async function GlassBeta() {
  const orgId = await requireOrgId();
  const d = await getOverviewData(orgId);
  const brand = await getBrandSettings(orgId);
  const me = brand.configured ? brand.brandName : 'Workspace';

  const totals = d.weeks.map((w) => w.product + w.gtm + w.market);
  const gtmTotal = d.weeks.reduce((s, w) => s + w.gtm, 0);
  const marketTotal = d.weeks.reduce((s, w) => s + w.market, 0);
  const productTotal = d.weeks.reduce((s, w) => s + w.product, 0);

  // momentum: 4-week moving average
  const avg = totals.map((_, i) => {
    const s = totals.slice(Math.max(0, i - 3), i + 1);
    return s.reduce((a, b) => a + b, 0) / s.length;
  });

  // chart geometry — needle bars + curve, ticks right, labels above
  const CW = 700, CH = 190, TOP = 64, NEEDLE = 4.5;
  const GAP = (CW - 30 - d.weeks.length * NEEDLE) / (d.weeks.length + 1);
  const bx = (i: number) => GAP + i * (NEEDLE + GAP);
  const by = (v: number) => TOP + (CH - TOP) * (1 - v / d.maxWeek);
  const curvePts: [number, number][] = avg.map((v, i) => [bx(i) + NEEDLE / 2, by(v)]);
  const curve = smoothPath(curvePts);
  const area = `${curve} L ${curvePts[curvePts.length - 1][0]} ${CH} L ${curvePts[0][0]} ${CH} Z`;

  let hiIdx = 0;
  totals.forEach((v, i) => { if (v > totals[hiIdx]) hiIdx = i; });
  const hi = d.weeks[hiIdx];
  const flagX = Math.min(Math.max(bx(hiIdx) - 62, 4), CW - 175);

  return (
    <main className="gx">
      <BetaSwitcher active="glass" />
      <div className="gx-scene">
        <section className="gx-sheet">
          <div className="gx-cols">
            <aside className="gx-rail">
              {RAIL.map((r) => (
                <a key={r.title} href={r.href} title={r.title}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={r.d} /></svg>
                </a>
              ))}
            </aside>

            <div className="gx-content">
              <header className="gx-top">
                <a className="gx-logo" href="/overview">
                  <span className="gx-logo-mark" />
                  watchtower
                </a>
                <nav className="gx-nav">
                  {NAV.map((n) => <a key={n.label} href={n.href} className={n.on ? 'on' : ''}>{n.label}</a>)}
                </nav>
                <div className="gx-topright">
                  <button className="gx-icb" aria-label="Settings"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.06-.4.1-.8.1-1.2Z" strokeLinejoin="round" /></svg></button>
                  <button className="gx-icb" aria-label="Notifications"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 4a5.5 5.5 0 0 0-5.5 5.5c0 4-1.8 5.5-1.8 5.5h14.6s-1.8-1.5-1.8-5.5A5.5 5.5 0 0 0 12 4Z" strokeLinejoin="round" /></svg><i /></button>
                  <span className="gx-avatar">{initials(me)}</span>
                </div>
              </header>

              <div className="gx-profile">
                <div className="gx-me">
                  <span className="gx-avatar lg">{initials(me)}</span>
                  <div>
                    <small>Watch commander</small>
                    <b>{me}</b>
                  </div>
                  <a className="gx-lime" href="/battlecards">Add competitor</a>
                  <button className="gx-icb ghost" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.8-3.8" strokeLinecap="round" /></svg></button>
                </div>
                <div className="gx-hey">
                  <b>Hey, {me}! 👋</b>
                  <span>Explore your market&apos;s history</span>
                </div>
                <a className="gx-icb ghost round-lg" href="/overview-beta/glass" aria-label="Refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
              </div>

              <div className="gx-body">
                <div className="gx-info">
                  <div className="gx-info-ic">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" strokeLinejoin="round" /></svg>
                  </div>
                  <h2>All signals</h2>
                  <p>Everything that happened across your {d.compCount} competitors — dated, bundled, cited. <a href="/battlecards">Need context?</a></p>
                  <div className="gx-big">{d.chartTotal}</div>
                  <div className="gx-leg">
                    <div className="gx-leg-row"><i className="lg-dash" /><span>Momentum, 4-wk</span><b>{Math.round(avg[avg.length - 1])} /wk</b></div>
                    <div className="gx-leg-row"><i className="lg-dot w" /><span>GTM — ads &amp; hiring</span><b>{gtmTotal}</b></div>
                    <div className="gx-leg-row"><i className="lg-dot m" /><span>Market &amp; news</span><b>{marketTotal}</b></div>
                    <div className="gx-leg-row"><i className="lg-dot f" /><span>Product &amp; pricing</span><b>{productTotal}</b></div>
                  </div>
                </div>

                <div className="gx-chartwrap">
                  <div className="gx-chart-meta"><span>last 6 months</span></div>
                  <svg viewBox={`0 0 ${CW} ${CH + 30}`} className="gx-chart">
                    {d.monthTicks.map((t) => (
                      <text key={t.idx} x={bx(t.idx)} y={14} className="gx-wlab">{t.label}</text>
                    ))}
                    {[0.33, 0.66, 1].map((f) => (
                      <text key={f} x={CW - 2} y={by(d.maxWeek * f) + 3} className="gx-ytick">{Math.round(d.maxWeek * f)}</text>
                    ))}
                    <path d={area} className="gx-area" />
                    {d.weeks.map((w, i) => {
                      const total = totals[i];
                      const h = total === 0 ? 4 : Math.max(7, (CH - TOP) * (total / d.maxWeek));
                      return (
                        <g key={w.key}>
                          <title>{`Week of ${w.nice} — ${total} events`}</title>
                          <rect x={bx(i)} y={CH - h} width={NEEDLE} height={h} rx={2.2} className={i === hiIdx && total > 0 ? 'gx-needle hi' : 'gx-needle'} />
                        </g>
                      );
                    })}
                    <path d={curve} className="gx-curve" />
                    {totals[hiIdx] > 0 && (
                      <g className="gx-flag">
                        <rect x={flagX} y={20} width={170} height={62} rx={12} />
                        <text x={flagX + 13} y={38} className="gx-flag-d">Week of {hi.nice}</text>
                        <rect x={flagX + 11} y={45} width={8} height={8} rx={2.5} className="fr1" />
                        <text x={flagX + 24} y={52.5} className="gx-flag-r">{totals[hiIdx]} events</text>
                        <rect x={flagX + 11} y={59} width={8} height={8} rx={2.5} className="fr2" />
                        <text x={flagX + 24} y={66.5} className="gx-flag-r">{hi.gtm} gtm · {hi.market} market · {hi.product} product</text>
                        <line x1={bx(hiIdx) + NEEDLE / 2} y1={84} x2={bx(hiIdx) + NEEDLE / 2} y2={CH - Math.max(7, (CH - TOP) * (totals[hiIdx] / d.maxWeek))} />
                      </g>
                    )}
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="gx-tabs">
            {['All', 'Pricing', 'Product', 'Hiring', 'Ads', 'News', 'Reviews'].map((t, i) => (
              <a key={t} href={i === 0 ? '/feed' : `/feed?cat=${t}`} className={i === 0 ? 'on' : ''}>{t}</a>
            ))}
          </div>

          <div className="gx-band">
            <div className="gx-bcol">
              <div className="gx-bhead"><h4>Threat performance</h4><a href="/battlecards">↗</a></div>
              <div className="gx-bsub">Competitor ratings</div>
              <div className="gx-thead"><span>Competitor</span><span>Threat</span><span>Product</span></div>
              {d.threat.slice(0, 4).map((t) => (
                <a className="gx-trow" key={t.slug} href={`/feed?comp=${t.slug}`}>
                  <span className="gx-avatar sm">{initials(t.competitor)}</span>
                  <span className="gx-trow-name">{t.competitor}<small>{t.delta == null ? 'baseline' : t.delta > 0 ? `▲ +${t.delta} this week` : t.delta < 0 ? `▼ ${t.delta} this week` : 'no change'}</small></span>
                  <b>{t.total}</b>
                  <em>{t.dims.product ?? '—'}</em>
                </a>
              ))}
            </div>

            <div className="gx-bcol center">
              <div className="gx-bhead"><h4>Coverage</h4></div>
              <div className="gx-gauge-n">{Math.round((d.activeChannels / d.totalChannels) * 100)}<i>%</i></div>
              <svg viewBox="0 0 120 62" className="gx-gauge">
                <path d="M12 56 A48 48 0 0 1 108 56" fill="none" className="gx-gauge-bg" />
                <path d="M12 56 A48 48 0 0 1 108 56" fill="none" className="gx-gauge-fg"
                  strokeDasharray={`${(d.activeChannels / d.totalChannels) * 151} 151`} />
              </svg>
              <p className="gx-bnote">Channels live</p>
              <div className="gx-bfoot"><span>Reads current</span><b>{d.reads.size}/{d.compCount}</b></div>
            </div>

            <div className="gx-bcol">
              <div className="gx-bhead"><h4>Mentions over time</h4></div>
              <div className="gx-bleg"><span><i className="lg-dot l" />{me}</span><span><i className="lg-dot m" />weekly</span></div>
              <div className="gx-mbars">
                {d.mWeeks.map((w) => (
                  <span key={w.key} style={{ height: `${w.n === 0 ? 10 : Math.max(16, (w.n / d.mMax) * 100)}%` }} className={w.n > 0 ? 'on' : ''} />
                ))}
              </div>
              <div className="gx-mrange"><span>{d.mWeeks[0]?.key.slice(5)}</span><span>{d.mWeeks[d.mWeeks.length - 1]?.key.slice(5)}</span></div>
            </div>

            <div className="gx-bcol">
              <div className="gx-bhead"><h4>Launch radar</h4></div>
              <div className="gx-bsub">Evidence powered</div>
              <div className="gx-ring-row">
                <svg viewBox="0 0 64 64" className="gx-ring">
                  <circle cx="32" cy="32" r="26" fill="none" className="gx-ring-bg" />
                  <circle cx="32" cy="32" r="26" fill="none" className="gx-ring-fg"
                    strokeDasharray={`${(d.battlecardCount / Math.max(1, d.compCount)) * 163} 163`} transform="rotate(-90 32 32)" />
                </svg>
                <div className="gx-ring-meta">
                  <div><span>Battlecards</span><b>{d.battlecardCount}/{d.compCount}</b></div>
                  <div><span>Forecast</span><b className="lime">{d.topRadar ? d.topRadar.confidence : 'Clear'}</b></div>
                </div>
              </div>
              {d.topRadar && <p className="gx-radarline">{d.topRadar.headline}</p>}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
