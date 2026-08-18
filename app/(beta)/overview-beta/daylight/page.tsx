// Design test 4/4 — "Daylight", faithful to the Finexy fintech reference:
// white shell, centered black pill tabs, floating two-group icon rail on
// the left, round search/bell buttons + profile chip on the right, big
// friendly greeting, a green-gradient hero tile among white stat tiles, a
// paired green/black bar chart, a Recent Activities table with status
// chips, and a dark "card" visual. Own chrome. Real data.
import { requireOrgId } from '@/lib/tenant';
import { getBrandSettings } from '@/lib/brand';
import { getOverviewData, greeting, initials, ago } from '@/lib/overviewData';
import BetaSwitcher from '../BetaSwitcher';
import './daylight.css';

export const dynamic = 'force-dynamic';

export default async function DaylightBeta() {
  const orgId = await requireOrgId();
  const d = await getOverviewData(orgId);
  const brand = await getBrandSettings(orgId);
  const me = brand.configured ? brand.brandName : 'Workspace';
  const domain = brand.brandDomain ?? 'workspace';

  // paired monthly bars: "their moves" (product+gtm, green) vs market (black)
  const months = new Map<string, { label: string; moves: number; market: number }>();
  for (const w of d.weeks) {
    if (!months.has(w.label)) months.set(w.label, { label: w.label, moves: 0, market: 0 });
    const m = months.get(w.label)!;
    m.moves += w.product + w.gtm; m.market += w.market;
  }
  const monthArr = [...months.values()];
  const mMax = Math.max(1, ...monthArr.flatMap((m) => [m.moves, m.market]));

  const scoreChip = (s: number) => (s >= 80 ? ['High impact', 'dc-green'] : s >= 45 ? ['Notable', 'dc-yellow'] : ['Routine', 'dc-blue']);

  return (
    <main className="dx">
      <BetaSwitcher active="daylight" />

      <aside className="dx-rail">
        <div className="dx-rail-group">
          <a href="/feed" title="All signals"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></svg></a>
          <a href="/feed?cat=Pricing" title="Pricing"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M12 3.5v17" /><path d="M16 7.2c-.8-1.3-2.3-2-4-2-2.3 0-4 1.2-4 3 0 3.9 8 2.1 8 6 0 1.9-1.8 3.1-4 3.1-1.9 0-3.4-.8-4.2-2.2" /></svg></a>
          <a href="/feed?cat=Product" title="Product"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M5 19c1.5-4.5 3-7.5 7-11.5 2.5-2.5 6-3 7-2s.5 4.5-2 7C13 16.5 10 18 5.5 19.5Z" /></svg></a>
          <a href="/feed?cat=Hiring" title="Hiring"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="8" r="3.2" /><path d="M5 19c.8-3 3.5-4.6 7-4.6s6.2 1.6 7 4.6" /></svg></a>
          <a href="/feed?cat=Ads" title="Ads"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></svg></a>
        </div>
        <div className="dx-rail-group">
          <a href="/mentions" title="Mentions"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"><path d="M4 6h16v10H9l-4 4V6Z" /></svg></a>
          <a href="/admin" title="Admin"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7 7 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.06-.4.1-.8.1-1.2Z" strokeLinejoin="round" /></svg></a>
        </div>
      </aside>

      <div className="dx-page">
        <header className="dx-top">
          <a className="dx-logo" href="/overview">
            <span className="dx-logo-mark"><svg viewBox="0 0 26 26"><line x1="2" y1="21" x2="9" y2="6" /><line x1="8" y1="21" x2="15" y2="3" /><line x1="14" y1="21" x2="21" y2="9" /><line x1="20" y1="21" x2="24" y2="13" /></svg></span>
            fortress hq
          </a>
          <nav className="dx-tabs">
            <a className="on" href="/overview-beta/daylight">Overview</a>
            <a href="/feed">Feed</a>
            <a href="/battlecards">Battlecards</a>
            <a href="/radar">Radar</a>
            <a href="/industry">Industry</a>
            <a href="/mentions">Mentions</a>
          </nav>
          <div className="dx-topright">
            <button className="dx-round" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-3.8-3.8" strokeLinecap="round" /></svg></button>
            <button className="dx-round" aria-label="Notifications"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 4a5.5 5.5 0 0 0-5.5 5.5c0 4-1.8 5.5-1.8 5.5h14.6s-1.8-1.5-1.8-5.5A5.5 5.5 0 0 0 12 4Z" strokeLinejoin="round" /></svg><i /></button>
            <div className="dx-profile">
              <span className="dx-avatar">{initials(me)}</span>
              <div><b>{me}</b><small>{domain}</small></div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dx-caret"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
        </header>

        <h1 className="dx-hello">{greeting()}, {me}</h1>
        <p className="dx-hello-sub">Stay on top of your market, monitor competitors, and track what changed.</p>

        <div className="dx-grid">
          <div className="dx-left">
            <div className="dx-card">
              <span className="dx-label">Signals on file</span>
              <div className="dx-balance">{d.chartTotal}<span className="dx-up">↑ {d.thisWeekTotal} this week</span></div>
              <div className="dx-wallets">
                <div className="dx-wallet"><small>Product</small><b>{d.weeks.reduce((s, w) => s + w.product, 0)}</b><em className="dw-a">dated</em></div>
                <div className="dx-wallet"><small>GTM</small><b>{d.weeks.reduce((s, w) => s + w.gtm, 0)}</b><em className="dw-a">dated</em></div>
                <div className="dx-wallet"><small>Market</small><b>{d.weeks.reduce((s, w) => s + w.market, 0)}</b><em className="dw-a">dated</em></div>
              </div>
            </div>

            <div className="dx-card">
              <span className="dx-label">Channel coverage</span>
              <div className="dx-prog"><span style={{ width: `${(d.activeChannels / d.totalChannels) * 100}%` }} /></div>
              <div className="dx-prog-meta"><span>{d.activeChannels} live</span><span>of {d.totalChannels} channels</span></div>
            </div>

            <div className="dx-card dx-cardviz-wrap">
              <div className="dx-cardhead"><span className="dx-label">Top battlecard</span><a className="dx-more" href="/battlecards">All →</a></div>
              {d.railCards[0] && (
                <a className="dx-cardviz" href="/battlecards">
                  <div className="dx-cardviz-top"><span>● live read</span><b>{d.railCards[0].total}</b></div>
                  <b className="dx-cardviz-name">{d.railCards[0].competitor}</b>
                  <p>{d.railCards[0].read.hook}</p>
                </a>
              )}
            </div>
          </div>

          <div className="dx-right">
            <div className="dx-tiles">
              <a className="dx-tile dark-green" href="/feed">
                <span className="dx-tile-ic">⚡</span>
                <span className="dx-tile-l">Events this week</span>
                <b>+{d.thisWeekTotal}</b>
                <small>bundled &amp; cited</small>
              </a>
              <div className="dx-tile">
                <span className="dx-tile-ic t2">▲</span>
                <span className="dx-tile-l">Top threat</span>
                <b>{d.threat[0]?.total ?? '—'}</b>
                <small>{d.threat[0]?.competitor}</small>
              </div>
              <div className="dx-tile">
                <span className="dx-tile-ic t3">◎</span>
                <span className="dx-tile-l">Mentions, 12w</span>
                <b>{d.mTotal}</b>
                <small>of {me}</small>
              </div>
              <div className="dx-tile">
                <span className="dx-tile-ic t4">✦</span>
                <span className="dx-tile-l">Reads current</span>
                <b>{d.reads.size}/{d.compCount}</b>
                <small>whole-picture</small>
              </div>
            </div>

            <div className="dx-card">
              <div className="dx-cardhead">
                <span className="dx-label">Market activity</span>
                <span className="dx-legend"><i className="dl-g" />their moves<i className="dl-k" />market &amp; news</span>
              </div>
              <div className="dx-bars">
                {monthArr.map((m) => (
                  <div className="dx-bargroup" key={m.label}>
                    <div className="dx-barpair">
                      <span className="bg-g" style={{ height: `${Math.max(5, (m.moves / mMax) * 100)}%` }} title={`${m.moves} moves`} />
                      <span className="bg-k" style={{ height: `${Math.max(5, (m.market / mMax) * 100)}%` }} title={`${m.market} market`} />
                    </div>
                    <small>{m.label}</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="dx-card">
              <div className="dx-cardhead"><span className="dx-label">Recent activities</span><a className="dx-more" href="/feed">Full feed →</a></div>
              <table className="dx-table">
                <thead>
                  <tr><th></th><th>Category</th><th>Competitor</th><th>What happened</th><th>When</th><th>Impact</th></tr>
                </thead>
                <tbody>
                  {d.highlights.slice(0, 5).map((h, i) => {
                    const [label, cls] = scoreChip(h.score);
                    return (
                      <tr key={i}>
                        <td><span className="dx-check" /></td>
                        <td><span className="dx-cat">{h.category}</span></td>
                        <td className="dx-td-name">{h.name}</td>
                        <td className="dx-td-text">{h.headline}</td>
                        <td className="dx-td-when">{ago(h.when)}</td>
                        <td><span className={`dx-chip ${cls}`}>{label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
