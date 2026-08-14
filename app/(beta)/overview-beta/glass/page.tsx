// Design test — "Glass", round 6. User fixes on v5:
// - The template's ACTUAL palette (eafd35 highlighter, e2f463/c9dc7c
//   supporting greens, 142522 ink, 404d4a secondary, adc4ba/96b0b0 scene).
// - Full menu restored (More dropdown with Ask/Newsletters/Reports/Alerts/
//   Admin), not a trimmed nav.
// - The rail filters SIGNALS — scouts are the collectors, not the labels:
//   "Pricing", "Ads", "News"… caption stays SIGNALS. Scout language lives
//   in module titles ("Scout reports"), where it belongs.
// - Priority re-order: Ask the Tower is a prominent hero row; Briefings,
//   Threat and Radar right under it; Scout reports + Beyond the walls next
//   (denser: 8 reports, 5 headlines); Scouts deployed + Mentions demoted
//   to a slim bottom band. No more empty-for-no-reason space.
import { requireOrgId } from '@/lib/tenant';
import { getBrandSettings } from '@/lib/brand';
import { getOverviewData, initials, ago } from '@/lib/overviewData';
import BetaSwitcher from '../BetaSwitcher';
import GlassChart from './GlassChart';
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
const MORE = [
  { label: 'Ask', href: '/ask' },
  { label: 'Newsletters', href: '/newsletters' },
  { label: 'Reports', href: '/reports' },
  { label: 'Alerts', href: '/alerts' },
  { label: 'Admin', href: '/admin' },
];
const RAIL = [
  { title: 'All signals', href: '/feed', d: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z' },
  { title: 'Pricing', href: '/feed?cat=Pricing', d: 'M12 3.5v17M16 7.2c-.8-1.3-2.3-2-4-2-2.3 0-4 1.2-4 3 0 3.9 8 2.1 8 6 0 1.9-1.8 3.1-4 3.1-1.9 0-3.4-.8-4.2-2.2' },
  { title: 'Product', href: '/feed?cat=Product', d: 'M5 19c1.5-4.5 3-7.5 7-11.5 2.5-2.5 6-3 7-2s.5 4.5-2 7C13 16.5 10 18 5.5 19.5Z' },
  { title: 'Hiring', href: '/feed?cat=Hiring', d: 'M12 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 12 11ZM5 19c.8-3 3.5-4.6 7-4.6s6.2 1.6 7 4.6' },
  { title: 'Ads', href: '/feed?cat=Ads', d: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' },
  { title: 'News', href: '/feed?cat=News', d: 'M4 5h16v14H4zM8 9.5h8M8 13h5' },
];
const CAT_CLS: Record<string, string> = { Ads: 'ct-coral', Hiring: 'ct-sky', News: 'ct-sand', Pricing: 'ct-lime', Product: 'ct-lime' };

export default async function GlassBeta({ searchParams }: { searchParams: Promise<{ focus?: string }> }) {
  const { focus } = await searchParams;
  const orgId = await requireOrgId();
  const d = await getOverviewData(orgId, focus);
  const brand = await getBrandSettings(orgId);
  const me = brand.configured ? brand.brandName : 'Workspace';

  const totals = d.weeks.map((w) => w.product + w.gtm + w.market);
  const avgLast = Math.round(totals.slice(-4).reduce((a, b) => a + b, 0) / 4);
  const gtmTotal = d.weeks.reduce((s, w) => s + w.gtm, 0);
  const marketTotal = d.weeks.reduce((s, w) => s + w.market, 0);
  const productTotal = d.weeks.reduce((s, w) => s + w.product, 0);
  const heat = (n: number) => (n >= 70 ? 'heat-hot' : n >= 50 ? 'heat-warm' : 'heat-cool');

  return (
    <main className="gx">
      <BetaSwitcher active="glass" />

      <aside className="gx-rail" aria-label="Filter by signal type">
        <span className="gx-rail-cap">Signals</span>
        {RAIL.slice(0, 1).map((r) => (
          <a key={r.title} href={r.href} data-label={r.title}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={r.d} /></svg>
          </a>
        ))}
        <span className="gx-rail-div" aria-hidden="true" />
        {RAIL.slice(1).map((r) => (
          <a key={r.title} href={r.href} data-label={r.title}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d={r.d} /></svg>
          </a>
        ))}
        <span className="gx-rail-line" aria-hidden="true" />
      </aside>

      <div className="gx-scene">
        {/* ---------- sheet 1: the tower ---------- */}
        <section className="gx-sheet">
          <header className="gx-top">
            <a className="gx-logo" href="/overview">
              <span className="gx-logo-mark" />
              watchtower
            </a>
            <nav className="gx-nav">
              {NAV.map((n) => <a key={n.label} href={n.href} className={n.on ? 'on' : ''}>{n.label}</a>)}
              <details className="gx-more">
                <summary>More ▾</summary>
                <div className="gx-more-menu">
                  {MORE.map((n) => <a key={n.label} href={n.href}>{n.label}</a>)}
                </div>
              </details>
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
              <span>{d.thisWeekTotal > 0 ? `Your scouts brought back ${d.thisWeekTotal} report${d.thisWeekTotal === 1 ? '' : 's'} this week` : 'The scouts are out — quiet week so far'}</span>
            </div>
            <a className="gx-icb ghost round-lg" href="/overview-beta/glass" aria-label="Refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
          </div>

          <div className="gx-body">
            <div className="gx-info">
              <div className="gx-info-ic">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" strokeLinejoin="round" /></svg>
              </div>
              <h2>All signals{d.focusComp ? ` — ${d.focusComp.competitor}` : ''}</h2>
              <p>Everything that happened across your {d.compCount} competitors — dated, bundled, cited. <a href="/battlecards">Need context?</a></p>
              <div className="gx-big">{d.chartTotal}</div>
              <div className="gx-leg">
                <div className="gx-leg-row"><i className="lg-dash" /><span>Momentum, 4-wk</span><b>{avgLast} /wk</b></div>
                <div className="gx-leg-row"><i className="lg-dot w" /><span>GTM — ads &amp; hiring</span><b>{gtmTotal}</b></div>
                <div className="gx-leg-row"><i className="lg-dot m" /><span>Market &amp; news</span><b>{marketTotal}</b></div>
                <div className="gx-leg-row"><i className="lg-dot f" /><span>Product &amp; pricing</span><b>{productTotal}</b></div>
              </div>
            </div>

            <div className="gx-chartwrap">
              <div className="gx-chart-meta"><span>last 6 months · hover to inspect</span></div>
              <GlassChart weeks={d.weeks} maxWeek={d.maxWeek} monthTicks={d.monthTicks} />
              <div className="gx-chips">
                <a href="/overview-beta/glass" className={!d.focusComp ? 'on' : ''}>All</a>
                {d.threat.map((t) => (
                  <a key={t.slug} href={`/overview-beta/glass?focus=${t.slug}`} className={d.focusComp?.slug === t.slug ? 'on' : ''}>
                    <span className="gx-chip-av">{initials(t.competitor)}</span>{t.competitor}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- sheet 2: ask the tower + the war table ---------- */}
        <section className="gx-sheet cool">
          <div className="gx-askhero">
            <div className="gx-askhero-copy">
              <h3>Ask the Tower</h3>
              <p>Scouts gather. The Tower reads. Every answer cites the signals it came from.</p>
            </div>
            <form className="gx-askhero-form" action="/ask" method="get">
              <input name="q" placeholder="What changed on CreatorIQ's pricing this quarter?" maxLength={300} />
              <button type="submit">Ask <span>↑</span></button>
            </form>
          </div>

          <div className="gx-band three">
            <div className="gx-bcol">
              <div className="gx-bhead"><h4>Threat performance</h4><a href="/battlecards">↗</a></div>
              <div className="gx-bsub">Competitor ratings</div>
              <div className="gx-thead"><span>Competitor</span><span>Threat</span><span>Product</span></div>
              {d.threat.slice(0, 5).map((t) => (
                <a className="gx-trow" key={t.slug} href={`/feed?comp=${t.slug}`}>
                  <span className="gx-avatar sm">{initials(t.competitor)}</span>
                  <span className="gx-trow-name">{t.competitor}<small>{t.delta == null ? 'baseline' : t.delta > 0 ? `▲ +${t.delta} this week` : t.delta < 0 ? `▼ ${t.delta} this week` : 'no change'}</small></span>
                  <b className={heat(t.total)}>{t.total}</b>
                  <em>{t.dims.product ?? '—'}</em>
                </a>
              ))}
            </div>

            <div className="gx-bcol">
              <div className="gx-bhead"><h4>Briefings</h4><a href="/battlecards">All ↗</a></div>
              <div className="gx-bsub">The Tower&apos;s read on each</div>
              {d.railCards.map((c) => (
                <a className="gx-brief" key={c.slug} href="/battlecards">
                  <span className="gx-avatar sm">{initials(c.competitor)}</span>
                  <span className="gx-brief-body"><b>{c.competitor}</b><span>{c.read.hook}</span></span>
                  <em className={heat(c.total)}>{c.total}</em>
                </a>
              ))}
            </div>

            <div className="gx-bcol">
              <div className="gx-bhead"><h4>Launch radar</h4><a href="/radar">↗</a></div>
              <div className="gx-bsub">Evidence powered</div>
              <div className="gx-ring-row">
                <svg viewBox="0 0 64 64" className="gx-ring">
                  <circle cx="32" cy="32" r="26" fill="none" className="gx-ring-bg" />
                  <circle cx="32" cy="32" r="26" fill="none" className="gx-ring-fg"
                    strokeDasharray={`${(d.battlecardCount / Math.max(1, d.compCount)) * 163} 163`} transform="rotate(-90 32 32)" />
                </svg>
                <div className="gx-ring-meta">
                  <div><span>Battlecards</span><b>{d.battlecardCount}/{d.compCount}</b></div>
                  <div><span>Forecast</span><b className={d.topRadar ? `conf-${d.topRadar.confidence.toLowerCase()}` : ''}>{d.topRadar ? d.topRadar.confidence : 'Clear'}</b></div>
                </div>
              </div>
              {d.topRadar && <p className="gx-radarline">{d.topRadar.headline}</p>}
              <a className="gx-minicta" href="/radar">See the evidence</a>
            </div>
          </div>
        </section>

        {/* ---------- sheet 3: scout reports + beyond the walls ---------- */}
        <section className="gx-sheet cool">
          <div className="gx-reports">
            <div className="gx-rcol wide">
              <div className="gx-bhead"><h4>Scout reports</h4><a href="/feed">Full feed ↗</a></div>
              <div className="gx-bsub">The bundled things that mattered, last 60 days</div>
              {d.highlights.map((h, i) => (
                <a className="gx-report" key={i} href={`/feed?comp=${h.slug}`}>
                  <span className={`gx-cat ${CAT_CLS[h.category] ?? 'ct-sand'}`}>{h.category}</span>
                  <span className="gx-report-name">{h.name}</span>
                  <span className="gx-report-text">{h.headline}{h.sub ? <em> — {h.sub}</em> : null}</span>
                  <span className="gx-report-when">{ago(h.when)}</span>
                </a>
              ))}
              {d.highlights.length === 0 && <p className="gx-bnote">No bundled reports yet — the scouts report after the next watch.</p>}
            </div>

            <div className="gx-rcol">
              <div className="gx-bhead"><h4>Beyond the walls</h4><a href="/industry">All ↗</a></div>
              <div className="gx-bsub">The market around your set</div>
              {d.pulse.map((p, i) => (
                <a className="gx-pulse" key={i} href={p.url} target="_blank" rel="noreferrer">
                  <span>{p.title}</span>
                  <small>{p.source}</small>
                </a>
              ))}
              {d.pulse.length === 0 && <p className="gx-bnote">Headlines unavailable right now — back on the next load.</p>}
            </div>
          </div>
        </section>

        {/* ---------- sheet 4 (slim): the watch itself ---------- */}
        <section className="gx-sheet cool slim">
          <div className="gx-band duo">
            <div className="gx-bcol">
              <div className="gx-bhead"><h4>Scouts deployed</h4><a href="/admin">Detail ↗</a></div>
              <div className="gx-watchrow">
                <svg viewBox="0 0 120 62" className="gx-gauge">
                  <path d="M12 56 A48 48 0 0 1 108 56" fill="none" className="gx-gauge-bg" />
                  <path d="M12 56 A48 48 0 0 1 108 56" fill="none" className="gx-gauge-fg"
                    strokeDasharray={`${(d.activeChannels / d.totalChannels) * 151} 151`} />
                </svg>
                <div>
                  <div className="gx-gauge-n">{d.activeChannels}<i>/{d.totalChannels}</i></div>
                  <p className="gx-bnote">channels on the watch — gated ones light up when a key is added</p>
                </div>
              </div>
            </div>
            <div className="gx-bcol">
              <div className="gx-bhead"><h4>Mentions of {me}</h4><a href="/mentions">All ↗</a></div>
              <div className="gx-watchrow">
                <div className="gx-mbars slim">
                  {d.mWeeks.map((w) => (
                    <span key={w.key} style={{ height: `${w.n === 0 ? 12 : Math.max(18, (w.n / d.mMax) * 100)}%` }} className={w.n > 0 ? 'on' : ''} />
                  ))}
                </div>
                <div>
                  <div className="gx-gauge-n">{d.mTotal}</div>
                  <p className="gx-bnote">in news &amp; captured signals, last 12 weeks</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
