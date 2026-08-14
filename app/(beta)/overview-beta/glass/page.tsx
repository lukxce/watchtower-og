// Design test 1/4 — "Glass", faithful to the sage/glass call-stats
// reference: muted grey-green scene, one large translucent panel with its
// own pill nav + profile, airy thin bars with a highlighted week and a
// white tooltip flag, yellow accent buttons, white stat sub-cards below.
// Own chrome — no app topbar/rail. Real data via getOverviewData.
import { requireOrgId } from '@/lib/tenant';
import { getBrandSettings } from '@/lib/brand';
import { getOverviewData, greeting, initials, ago } from '@/lib/overviewData';
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
  { title: 'News', href: '/feed?cat=News', d: 'M4 5h16v14H4zM8 9.5h8M8 13h5' },
];

export default async function GlassBeta() {
  const orgId = await requireOrgId();
  const [d, brand] = [await getOverviewData(orgId), await getBrandSettings(orgId)];
  const me = brand.configured ? brand.brandName : 'Workspace';

  // chart geometry — thin airy bars, one highlighted week with a flag
  const CW = 760, CH = 210, BW = 13, GAP = (CW - 26 * BW) / 27;
  let hiIdx = 0;
  d.weeks.forEach((w, i) => {
    if (w.product + w.gtm + w.market > (d.weeks[hiIdx].product + d.weeks[hiIdx].gtm + d.weeks[hiIdx].market)) hiIdx = i;
  });
  const hi = d.weeks[hiIdx];
  const hiTotal = hi.product + hi.gtm + hi.market;
  const hiX = GAP + hiIdx * (BW + GAP);
  const flagX = Math.min(Math.max(hiX - 70, 4), CW - 160);

  return (
    <main className="gx">
      <BetaSwitcher active="glass" />

      <aside className="gx-rail">
        {RAIL.map((r) => (
          <a key={r.title} href={r.href} title={r.title}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={r.d} /></svg>
          </a>
        ))}
      </aside>

      <div className="gx-scene">
        <section className="gx-panel">
          <header className="gx-top">
            <a className="gx-logo" href="/overview">
              <svg viewBox="0 0 26 26"><line x1="2" y1="21" x2="9" y2="6" /><line x1="8" y1="21" x2="15" y2="3" /><line x1="14" y1="21" x2="21" y2="9" /><line x1="20" y1="21" x2="24" y2="13" /></svg>
              watchtower
            </a>
            <nav className="gx-nav">
              {NAV.map((n) => <a key={n.label} href={n.href} className={n.on ? 'on' : ''}>{n.label}</a>)}
            </nav>
            <div className="gx-topright">
              <button className="gx-iconbtn" aria-label="Notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 4a5.5 5.5 0 0 0-5.5 5.5c0 4-1.8 5.5-1.8 5.5h14.6s-1.8-1.5-1.8-5.5A5.5 5.5 0 0 0 12 4Z" strokeLinejoin="round" /><path d="M10.3 18.5a1.8 1.8 0 0 0 3.4 0" strokeLinecap="round" /></svg>
                <i />
              </button>
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
              <a className="gx-yellow" href="/battlecards">+ Add competitor</a>
            </div>
            <div className="gx-hey">
              <b>Hey! 👋</b>
              <span>Explore your market&apos;s history</span>
            </div>
          </div>

          <div className="gx-body">
            <div className="gx-info">
              <div className="gx-info-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" strokeLinejoin="round" /></svg>
              </div>
              <h2>All signals</h2>
              <p>Everything that happened across your {d.compCount} competitors — dated, deduped, bundled. Need context? Open the reads.</p>
              <div className="gx-big">{d.chartTotal}</div>
              <div className="gx-legend">
                <span><i className="lp" />{d.weeks.reduce((s, w) => s + w.product, 0)} product &amp; pricing</span>
                <span><i className="lg" />{d.weeks.reduce((s, w) => s + w.gtm, 0)} GTM — ads &amp; hiring</span>
                <span><i className="lm" />{d.weeks.reduce((s, w) => s + w.market, 0)} market &amp; news</span>
              </div>
            </div>

            <div className="gx-chartwrap">
              <svg viewBox={`0 0 ${CW} ${CH + 76}`} className="gx-chart">
                {[0.25, 0.5, 0.75, 1].map((f) => (
                  <text key={f} x={CW - 2} y={64 + (CH - 6) * (1 - f)} className="gx-ytick">{Math.round(d.maxWeek * f)}</text>
                ))}
                {d.weeks.map((w, i) => {
                  const x = GAP + i * (BW + GAP);
                  const total = w.product + w.gtm + w.market;
                  const h = total === 0 ? 3 : Math.max(6, (total / d.maxWeek) * (CH - 6));
                  const isHi = i === hiIdx && total > 0;
                  return (
                    <g key={w.key}>
                      <title>{`Week of ${w.nice} — ${total} events`}</title>
                      <rect x={x} y={60 + (CH - h)} width={BW} height={h} rx={6.5} className={isHi ? 'gx-bar hi' : 'gx-bar'} />
                    </g>
                  );
                })}
                {hiTotal > 0 && (
                  <g className="gx-flag">
                    <rect x={flagX} y={2} width={156} height={46} rx={12} />
                    <text x={flagX + 14} y={21} className="gx-flag-d">Week of {hi.nice}</text>
                    <text x={flagX + 14} y={38} className="gx-flag-n">{hiTotal} events · {hi.product}p {hi.gtm}g {hi.market}m</text>
                    <line x1={hiX + BW / 2} y1={48} x2={hiX + BW / 2} y2={60 + (CH - Math.max(6, (hiTotal / d.maxWeek) * (CH - 6)))} />
                  </g>
                )}
                {d.monthTicks.map((t) => (
                  <text key={t.idx} x={GAP + t.idx * (BW + GAP)} y={CH + 72} className="gx-xtick">{t.label}</text>
                ))}
              </svg>
            </div>
          </div>

          <div className="gx-tabs">
            {['All', 'Pricing', 'Product', 'Hiring', 'Ads', 'News', 'Reviews'].map((t, i) => (
              <a key={t} href={i === 0 ? '/feed' : `/feed?cat=${t}`} className={i === 0 ? 'on' : ''}>{t}</a>
            ))}
          </div>
        </section>

        <section className="gx-cards">
          <div className="gx-card">
            <div className="gx-card-head"><h4>Threat performance</h4><span>live</span></div>
            {d.threat.slice(0, 4).map((t) => (
              <a className="gx-trow" key={t.slug} href={`/feed?comp=${t.slug}`}>
                <span className="gx-avatar sm">{initials(t.competitor)}</span>
                <span className="gx-trow-name">{t.competitor}</span>
                <span className="gx-trow-score">{t.total}</span>
                <span className="gx-trow-note">threat</span>
              </a>
            ))}
          </div>

          <div className="gx-card center">
            <div className="gx-card-head"><h4>Coverage</h4></div>
            <div className="gx-gauge-n">{Math.round((d.activeChannels / d.totalChannels) * 100)}<i>%</i></div>
            <svg viewBox="0 0 120 64" className="gx-gauge">
              <path d="M10 58 A50 50 0 0 1 110 58" fill="none" stroke="#e7ebe2" strokeWidth="10" strokeLinecap="round" />
              <path d="M10 58 A50 50 0 0 1 110 58" fill="none" stroke="#e3e75a" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${(d.activeChannels / d.totalChannels) * 157} 157`} />
            </svg>
            <p>{d.activeChannels} of {d.totalChannels} channels live</p>
          </div>

          <div className="gx-card">
            <div className="gx-card-head"><h4>Mentions of {me}</h4><span>12 wks</span></div>
            <div className="gx-mbars">
              {d.mWeeks.map((w) => (
                <span key={w.key} style={{ height: `${w.n === 0 ? 8 : Math.max(14, (w.n / d.mMax) * 100)}%` }} className={w.n > 0 ? 'on' : ''} />
              ))}
            </div>
            <p className="gx-mnote">{d.mTotal} mentions in news &amp; signals</p>
          </div>

          <div className="gx-card">
            <div className="gx-card-head"><h4>The reads</h4><a href="/battlecards">→</a></div>
            {d.railCards.slice(0, 2).map((c) => (
              <a className="gx-read" key={c.slug} href="/battlecards">
                <b>{c.competitor}</b>
                <span>{c.read.hook}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
