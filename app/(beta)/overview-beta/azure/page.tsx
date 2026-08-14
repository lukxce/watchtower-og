// Design test 2/4 — "Azure", faithful to the aeros smart-home reference:
// near-black navy, a tall left visual panel with big light title and
// room-style pills, thin top link nav with date/time + search + avatar,
// modules with huge thin numerals, circular icon chips, a big status word,
// line + mini-bar charts, one blue pill button. Own chrome. Real data.
import { requireOrgId } from '@/lib/tenant';
import { getBrandSettings } from '@/lib/brand';
import { getOverviewData, greeting, initials } from '@/lib/overviewData';
import BetaSwitcher from '../BetaSwitcher';
import './azure.css';

export const dynamic = 'force-dynamic';

export default async function AzureBeta() {
  const orgId = await requireOrgId();
  const d = await getOverviewData(orgId);
  const brand = await getBrandSettings(orgId);
  const me = brand.configured ? brand.brandName : 'Workspace';
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  // two polylines: product+gtm ("their moves") vs market ("the noise")
  const LW = 300, LH = 84;
  const pts = (get: (w: (typeof d.weeks)[number]) => number) =>
    d.weeks.map((w, i) => `${(i / (d.weeks.length - 1)) * LW},${LH - 6 - (get(w) / d.maxWeek) * (LH - 14)}`).join(' ');

  return (
    <main className="az2">
      <BetaSwitcher active="azure" />
      <div className="az2-frame">
        <aside className="az2-visual">
          <div className="az2-visual-art" aria-hidden="true" />
          <span className="az2-crumb">◈ {me} workspace</span>
          <h1>Market</h1>
          <p className="az2-visual-sub">{d.compCount} competitors on the watch</p>
          <div className="az2-rooms">
            <a className="on" href="/overview-beta/azure">All</a>
            {d.threat.slice(0, 3).map((t) => (
              <a key={t.slug} href={`/overview?focus=${t.slug}`}>{t.competitor}</a>
            ))}
            <a href="/battlecards">+</a>
          </div>
        </aside>

        <section className="az2-main">
          <header className="az2-top">
            <button className="az2-round" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.8-3.8" strokeLinecap="round" /></svg>
            </button>
            <nav className="az2-nav">
              <a className="on" href="/overview-beta/azure">Overview</a>
              <a href="/feed">Feed</a>
              <a href="/battlecards">Battlecards</a>
              <a href="/radar">Radar</a>
              <a href="/industry">Industry</a>
              <a href="/mentions">AI Insights</a>
            </nav>
            <div className="az2-topright">
              <span className="az2-date">{dateStr} · {timeStr}</span>
              <button className="az2-round" aria-label="Notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 4a5.5 5.5 0 0 0-5.5 5.5c0 4-1.8 5.5-1.8 5.5h14.6s-1.8-1.5-1.8-5.5A5.5 5.5 0 0 0 12 4Z" strokeLinejoin="round" /></svg>
                <i />
              </button>
              <span className="az2-avatar">{initials(me)}</span>
            </div>
          </header>

          <h2 className="az2-title">Overview</h2>

          <div className="az2-grid">
            <div className="az2-card az2-hero">
              <div className="az2-card-top">
                <span className="az2-label">Events this week<small>{greeting()}</small></span>
                <span className="az2-chip-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" strokeLinejoin="round" /></svg></span>
              </div>
              <div className="az2-huge">{d.thisWeekTotal}<i>ev</i></div>
              <span className="az2-updated">{d.chartTotal} dated events in 6 months</span>
              <svg viewBox={`0 0 ${LW} ${LH}`} className="az2-line" preserveAspectRatio="none">
                <polyline points={pts((w) => w.product + w.gtm)} className="az2-l1" />
                <polyline points={pts((w) => w.market)} className="az2-l2" />
              </svg>
              <div className="az2-line-legend"><span><i className="c1" />their moves</span><span><i className="c2" />market noise</span></div>
              <a className="az2-blue" href="/feed">Open feed</a>
            </div>

            <div className="az2-col">
              <div className="az2-card">
                <div className="az2-card-top">
                  <span className="az2-label">Top threat<small>{d.threat[0]?.competitor}</small></span>
                  <span className="az2-chip-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 3l7 4v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V7l7-4Z" strokeLinejoin="round" /></svg></span>
                </div>
                <div className="az2-big">{d.threat[0]?.total ?? '—'}<i>/100</i></div>
                <div className="az2-dims">
                  {d.threat[0] && Object.entries(d.threat[0].dims).slice(0, 4).map(([k, v]) => (
                    <span key={k} style={{ height: `${Math.max(12, Number(v))}%` }} title={`${k} ${v}`} />
                  ))}
                </div>
              </div>
              <div className="az2-card">
                <div className="az2-card-top">
                  <span className="az2-label">Mentions of {me}<small>12 weeks</small></span>
                  <span className="az2-chip-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 6h16v10H9l-4 4V6Z" strokeLinejoin="round" /></svg></span>
                </div>
                <div className="az2-big">{d.mTotal}</div>
                <div className="az2-dims wide">
                  {d.mWeeks.map((w) => <span key={w.key} style={{ height: `${w.n === 0 ? 10 : Math.max(18, (w.n / d.mMax) * 100)}%` }} className={w.n > 0 ? 'on' : ''} />)}
                </div>
              </div>
            </div>

            <div className="az2-col">
              <div className="az2-card az2-status">
                <div className="az2-card-top">
                  <span className="az2-label">Launch Radar<small>{d.topRadar ? d.topRadar.competitor : 'quiet'}</small></span>
                  <span className="az2-chip-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></svg></span>
                </div>
                <div className={`az2-word ${d.topRadar ? d.topRadar.confidence.toLowerCase() : ''}`}>{d.topRadar ? d.topRadar.confidence : 'Clear'}</div>
                {d.topRadar && <p className="az2-word-sub">{d.topRadar.headline}</p>}
                <a className="az2-ghost" href="/radar">See the evidence</a>
              </div>
              <div className="az2-card">
                <div className="az2-card-top">
                  <span className="az2-label">Coverage<small>{d.activeChannels} of {d.totalChannels} live</small></span>
                  <span className="az2-chip-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 12h4l2-6 4 12 2-6h4" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                </div>
                <div className="az2-big">{Math.round((d.activeChannels / d.totalChannels) * 100)}<i>%</i></div>
                <div className="az2-track"><span style={{ width: `${(d.activeChannels / d.totalChannels) * 100}%` }} /></div>
              </div>
            </div>

            <div className="az2-card az2-wide">
              <div className="az2-card-top">
                <span className="az2-label">The reads<small>whole-picture, per competitor</small></span>
                <a className="az2-ghost" href="/battlecards">All battlecards</a>
              </div>
              <div className="az2-reads">
                {d.railCards.map((c) => (
                  <a key={c.slug} href="/battlecards" className="az2-readrow">
                    <span className="az2-avatar sm">{initials(c.competitor)}</span>
                    <div><b>{c.competitor}</b><span>{c.read.hook}</span></div>
                    <em>{c.total}</em>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
