// Overview — the Glass system, now the real page (chrome comes from the
// app layout; this page is just the sheets). Lore: scouts gather, the
// Tower sees, the KEEPER reads — the Keeper is the AI.
// Sheet 1: profile + hero chart (interactive) + focus chips.
// Sheet 2: Ask the Keeper (hero, with suggested questions) + competitor
//          ratings (each row opens its briefing) + biggest-threat
//          spotlight + launch radar (evidence, not slogans).
// Sheet 3: Scout reports (bundled) + Beyond the walls.
// Sheet 4 (slim): scouts deployed + mentions.
import { requireOrgId } from '@/lib/tenant';
import { getBrandSettings } from '@/lib/brand';
import { getOverviewData, initials, ago } from '@/lib/overviewData';
import GlassChart from './GlassChart';
import './overview.css';

export const dynamic = 'force-dynamic';

const CAT_CLS: Record<string, string> = {
  Ads: 'ct-coral', Hiring: 'ct-sky', News: 'ct-sand', Pricing: 'ct-olive',
  Product: 'ct-green', Reviews: 'ct-violet', Funding: 'ct-amber', Positioning: 'ct-olive',
};
const SUGGESTIONS = [
  'What changed on pricing this quarter?',
  'Who is hiring for AI roles?',
  'Which competitor is closest to a launch?',
];

export default async function Overview({ searchParams }: { searchParams: Promise<{ focus?: string }> }) {
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
  const top = d.railCards[0];

  return (
    <main className="main gxo">
      <div className="gx-scene">
        {/* ---------- sheet 1: the tower ---------- */}
        <section className="gx-sheet">
          <div className="gx-profile">
            <div className="gx-me">
              <span className="gx-avatar lg">{initials(me)}</span>
              <div>
                <small>Watch commander</small>
                <b>{me}</b>
              </div>
              <a className="gx-lime" href="/battlecards">Add competitor</a>
            </div>
            <div className="gx-hey">
              <b>Hey, {me}! 👋</b>
              <span>{d.thisWeekTotal > 0 ? `Your scouts brought back ${d.thisWeekTotal} report${d.thisWeekTotal === 1 ? '' : 's'} this week` : 'The scouts are out — quiet week so far'}</span>
            </div>
            <a className="gx-icb ghost round-lg" href="/overview" aria-label="Refresh"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v4h-4" strokeLinecap="round" strokeLinejoin="round" /></svg></a>
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
                <a href="/overview" className={!d.focusComp ? 'on' : ''}>All</a>
                {d.threat.map((t) => (
                  <a key={t.slug} href={`/overview?focus=${t.slug}`} className={d.focusComp?.slug === t.slug ? 'on' : ''}>
                    <span className="gx-chip-av">{initials(t.competitor)}</span>{t.competitor}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- sheet 2: the keeper + the war table ---------- */}
        <section className="gx-sheet cool">
          <div className="gx-askhero">
            <div className="gx-askhero-copy">
              <h3>Ask the Keeper</h3>
              <p>Scouts gather. The Tower sees. The Keeper reads — and cites every signal.</p>
            </div>
            <div className="gx-askhero-main">
              <form className="gx-askhero-form" action="/ask" method="get">
                <input name="q" placeholder="Ask anything about your market…" maxLength={300} />
                <button type="submit">Ask <span>↑</span></button>
              </form>
              <div className="gx-askhero-sugs">
                {SUGGESTIONS.map((s) => (
                  <a key={s} href={`/ask?q=${encodeURIComponent(s)}`}>{s}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="gx-band three">
            <div className="gx-bcol">
              <div className="gx-bhead"><h4>Competitor ratings</h4><a href="/battlecards">All briefings ↗</a></div>
              <div className="gx-bsub">Tap a competitor for the Keeper&apos;s briefing</div>
              <div className="gx-thead"><span>Competitor</span><span>Threat</span><span>Product</span></div>
              {d.threat.slice(0, 5).map((t) => (
                <a className="gx-trow" key={t.slug} href={`/battlecards#${t.slug}`}>
                  <span className="gx-avatar sm">{initials(t.competitor)}</span>
                  <span className="gx-trow-name">{t.competitor}<small>{t.delta == null ? 'baseline' : t.delta > 0 ? `▲ +${t.delta} this week` : t.delta < 0 ? `▼ ${t.delta} this week` : 'no change'}</small></span>
                  <b className={heat(t.total)}>{t.total}</b>
                  <em>{t.dims.product ?? '—'}</em>
                </a>
              ))}
            </div>

            <div className="gx-bcol">
              <div className="gx-bhead"><h4>Biggest threat</h4>{top && <a href={`/battlecards#${top.slug}`}>Open briefing ↗</a>}</div>
              {top ? (
                <a className="gx-spot" href={`/battlecards#${top.slug}`}>
                  <div className="gx-spot-top">
                    <span className="gx-avatar">{initials(top.competitor)}</span>
                    <div className="gx-spot-name"><b>{top.competitor}</b><small>{top.delta == null ? 'baseline' : top.delta > 0 ? `▲ +${top.delta} this week` : 'holding'}</small></div>
                    <span className={`gx-spot-score ${heat(top.total)}`}>{top.total}</span>
                  </div>
                  <p className="gx-spot-hook">{top.read.hook}</p>
                  <p className="gx-spot-body">{top.read.narrative}</p>
                </a>
              ) : (
                <p className="gx-bnote">No briefings yet — run the battlecards generation.</p>
              )}
            </div>

            <div className="gx-bcol">
              <div className="gx-bhead"><h4>Launch radar</h4><a href="/radar">↗</a></div>
              {d.topRadar ? (
                <>
                  <div className="gx-bsub">{d.topRadar.competitor} <span className={`gx-conf conf-${d.topRadar.confidence.toLowerCase()}`}>{d.topRadar.confidence}</span></div>
                  <p className="gx-radarline">{d.topRadar.headline}</p>
                  <ul className="gx-evidence">
                    {d.topRadar.evidence.slice(0, 3).map((e, i) => <li key={i}>{e}</li>)}
                  </ul>
                  <a className="gx-minicta" href="/radar">Full forecast</a>
                </>
              ) : (
                <>
                  <div className="gx-bsub">All quiet</div>
                  <p className="gx-radarline">Nothing clears the evidence bar right now — a single hostname or a lone job post doesn&apos;t count. When multiple signal types line up, it shows here.</p>
                </>
              )}
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
