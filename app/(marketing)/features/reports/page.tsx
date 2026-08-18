import Link from 'next/link';

export const metadata = {
  title: 'Reports — Fortress HQ',
  description:
    'A briefing built from the same cited signals as the feed, ready to forward to a rep or an exec — nothing invented, nothing that outruns the evidence.',
};

export default function ReportsFeature() {
  return (
    <div className="ftx">
      {/* ---------- hero ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-over">Feature · Reports</span>
            <span className="kicker">Same evidence · portable</span>
            <h1 className="wt-h1">A briefing you can actually forward.</h1>
            <p className="wt-dek">
              A report is built from the same cited signals as your feed and your battlecards — nothing summarized
              away, nothing added. Pull one together for a competitor, a quarter, or a deal, and hand it to a rep or
              an exec who doesn&apos;t log into Fortress HQ themselves.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo →</Link>
            </div>
            <p className="wt-note">From $149/mo · no card required</p>
          </div>

          <div className="ftx-art">
            <div className="wt-panel" aria-label="A mocked report summary">
              <div className="wt-panel-head">
                <span className="mono">report · q3 competitor review</span>
                <span className="wt-live"><i />live</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.1s' }}>
                <span className="wt-row-t mono">klue</span>
                <span className="wt-row-x">Building an AI interviewer, unannounced — 3 hostnames, 4 roles</span>
                <span className="wt-row-g mono">product</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.22s' }}>
                <span className="wt-row-t mono">crayon</span>
                <span className="wt-row-x">Ad spend down to 1 live ad, defending installed base</span>
                <span className="wt-row-g mono">gtm</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.34s' }}>
                <span className="wt-row-t mono">kompyte</span>
                <span className="wt-row-x">Careers page 404 since acquisition, no independent ad accounts</span>
                <span className="wt-row-g mono">corporate</span>
              </div>
              <div className="ftx-readout">
                <span className="mono">summary</span>
                <b>Three competitors, three different postures this quarter.</b>
                <p>One building quietly, one retreating on spend, one absorbed into a larger suite — each line traces back to its own signal.</p>
              </div>
              <div className="ftx-know">
                <b>How we know:</b> every line above cites the same signal shown in the feed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- mechanism ---------- */}
      <section className="mkt-section tight ftx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">How it works</span>
          <h2 className="wt-h2">Nothing gets rewritten on the way out.</h2>
          <p className="wt-lede">
            A report is not a second product with its own claims. It is the same cited reads you already trust,
            arranged for a reader who won&apos;t click through to the source.
          </p>
          <div className="ftx-steps">
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">choose a scope</span>
                <h4>Pick a competitor, a quarter, or a deal</h4>
                <p>
                  A report starts with a scope, not a blank page — one competitor&apos;s whole file, everything the
                  watch found across a quarter, or a focused pull for a specific deal a rep is working right now.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">the same signals get pulled</span>
                <h4>Nothing gets fetched fresh, and nothing gets invented</h4>
                <p>
                  A report draws from the exact same cited feed and battlecard signals you already see in the app —
                  it doesn&apos;t run a separate synthesis pass with its own claims. What you&apos;d find by
                  clicking around is what ends up on the page.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">arranged, not summarized away</span>
                <h4>Built for someone who reads it once, cover to cover</h4>
                <p>
                  The signals get ordered for a reader who won&apos;t click through to a source — grouped by
                  competitor or theme, evidence still attached, but laid out for a single linear read instead of a
                  dashboard you explore.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">gaps stay visible</span>
                <h4>A quiet channel says so, instead of padding the page</h4>
                <p>
                  If a channel had nothing to report on a competitor that quarter, the report says that plainly,
                  rather than filling space to look busier than the market actually was. An honest gap is more useful
                  than a padded page.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">handed off</span>
                <h4>Ready for someone outside Fortress HQ</h4>
                <p>
                  The finished report is meant to be handed to a rep, an exec, or a board — someone who doesn&apos;t
                  log into the app themselves — with the same evidence trail intact, so a skeptical reader can still
                  trace any line back to its source.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what's included ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">What a report can be scoped to</span>
          <h2 className="wt-h2">Three shapes, same underlying evidence.</h2>
          <div className="ftx-included">
            <div className="ftx-inc">
              <b>Per-competitor report</b>
              <p>Everything on file for one competitor, arranged as a single read — the whole battlecard, in document form.</p>
            </div>
            <div className="ftx-inc">
              <b>Per-quarter report</b>
              <p>Every competitor&apos;s activity across a defined period, for the reader who wants the shape of the quarter.</p>
            </div>
            <div className="ftx-inc">
              <b>Per-deal pull</b>
              <p>A focused set of signals on the specific competitor a rep is up against in a live deal, right now.</p>
            </div>
            <div className="ftx-inc">
              <b>Same-evidence guarantee</b>
              <p>No claim appears in a report that doesn&apos;t already exist, cited, in the feed or a battlecard.</p>
            </div>
            <div className="ftx-inc">
              <b>Gaps preserved, not hidden</b>
              <p>A quiet channel is reported as quiet — the report never manufactures activity to look more thorough.</p>
            </div>
            <div className="ftx-inc">
              <b>Built for a non-user reader</b>
              <p>Written to be read once, cover to cover, by someone who will never log into Fortress HQ themselves.</p>
            </div>
            <div className="ftx-inc">
              <b>Evidence trail intact</b>
              <p>Every line still traces to its source — a report is a different shape of the same cited reasoning, not a rewrite.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">A report built for a board meeting</span>
          <h2 className="wt-h2">Signal Labs, compiled for five minutes of attention.</h2>
          <div className="ftx-story">
            <span className="mono">report · signal labs · quarterly pull</span>
            <h3>&quot;Quoting on a call, and quietly not hiring for it.&quot;</h3>
            <p>
              A founder preparing for a board meeting pulled a quarterly report scoped to Signal Labs specifically —
              the competitor the board had asked about twice already. The report compiled three signals already
              sitting in the feed: Signal Labs still gates its Team tier behind a sales call, unchanged across every
              scout run that quarter; their jobs channel showed zero new sales-development postings in ninety days;
              and their events page had gone quiet since a single webinar in early spring.
            </p>
            <p>
              None of those three facts was new information — each had already surfaced individually in earlier
              first-light briefings. What the report did was put them on one page, in order, so a board member
              reading it once could see the pattern without having logged into Fortress HQ at all: a competitor
              still quoting deals by hand, not visibly staffing up to change that, and going quiet on demand-gen.
            </p>
            <p>
              The founder forwarded the report ahead of the meeting instead of presenting from memory. Every line in
              it still carried its original citation, so when a board member asked &quot;how do we know that,&quot;
              the answer was already on the page.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> pricing-page capture (unchanged, 3 scout runs) + jobs channel (0 SDR postings,
              trailing 90 days) + events page (last updated in spring), all linked in the report
            </div>
          </div>
        </div>
      </section>

      {/* ---------- comparison ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="mkt-eyebrow">Versus the alternative</span>
          <h2 style={{ fontSize: 24 }}>No analyst required to compile it.</h2>
          <div className="ftx-vs">
            <span className="mono">how the others do it</span>
            <p>
              An enterprise CI suite at Klue or Crayon&apos;s price point can absolutely produce a polished report —
              usually with someone on staff whose job includes assembling it. Fortress HQ compiles the same cited
              signals you already have into a report shape without a separate analyst step, at a fraction of the
              cost. It won&apos;t out-design a dedicated report-authoring tool; what it won&apos;t do is invent a
              claim to fill a gap the way a rushed manual deck sometimes does.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Questions</span>
          <h2 className="wt-h2">Reports, honestly.</h2>
          <div className="ftx-faq">
            <div className="ftx-faq-item">
              <h4>Can I export this as a PDF right now?</h4>
              <p>
                Not as a promised, polished export today — we&apos;d rather not claim a specific file format we
                haven&apos;t built. What&apos;s real is the same cited reasoning the rest of the product runs on, put
                in a shape you can already hand to someone else; the packaged export format is on our list, not on
                the page yet.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Does anyone need a Fortress HQ login to read a report?</h4>
              <p>
                No — that&apos;s the point of a report. It&apos;s built for the rep prepping for a call or the exec
                in a board meeting who will never log into the app themselves, with the evidence trail still intact
                on the page.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can a report include something that isn&apos;t already in my feed?</h4>
              <p>
                No, by design. A report is not a second product with its own claims — everything in it already
                exists, cited, in the feed or a battlecard. Pulling a report together doesn&apos;t introduce anything
                new.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can I schedule a report to run automatically and land in my inbox?</h4>
              <p>
                Not yet — that&apos;s a standing order, and standing-order delivery to email, Slack or a webhook is
                in build, not shipped. Today, you pull a report when you need one.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>How current is a report — is it a live view or a snapshot?</h4>
              <p>
                It reflects the feed and battlecards as they stand the moment you pull it together — current, not
                stale, but also not a live document that keeps updating after you&apos;ve handed it to someone.
                Pulling a fresh one gets you the latest signals.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can I white-label a report with my own logo before forwarding it?</h4>
              <p>
                Not today. A report currently carries Fortress HQ&apos;s own presentation, not a custom brand layer —
                if that matters for how you&apos;d use it, that&apos;s worth telling us directly rather than us
                promising it before it exists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- who a report gets handed to ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Built to be handed to someone else</span>
          <h2 className="wt-h2">A board and a prospect-facing rep need the same trust, differently.</h2>
          <div className="ftx-pair">
            <div className="ftx-paircard">
              <span className="mono">founder / exec / board</span>
              <h3>Five minutes, not a live demo</h3>
              <p>
                A board member asking &quot;what&apos;s happening with X&quot; doesn&apos;t want a tour of the app —
                they want the quarter, read once, with sources attached in case anyone asks &quot;how do we know
                that.&quot;
              </p>
              <p>A quarterly report scoped to the competitors that actually came up in the last meeting fits that exactly.</p>
            </div>
            <div className="ftx-paircard">
              <span className="mono">sales rep</span>
              <h3>The one-pager before a call</h3>
              <p>
                A deal-scoped report compiles everything relevant to the specific competitor in a specific deal, so a
                rep prepping in the ten minutes before a call has one document instead of five tabs to reconstruct
                themselves.
              </p>
              <p>Every line still cites its source, so a sharp prospect asking &quot;how do you know&quot; has a real answer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what this is not ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="mkt-eyebrow">Plainly</span>
          <h2 style={{ fontSize: 24 }}>What a report is — and isn&apos;t</h2>
          <p className="lede">
            A report is a briefing you can forward — built for a person, not a system. We won&apos;t promise a
            specific export format or a list of integrations we haven&apos;t built; what&apos;s real is the same
            cited reasoning the rest of the product runs on, put in a shape you can hand to someone else.
          </p>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className="ftx-relate">
        <div className="wrap">
          <span className="mkt-eyebrow">Keep going</span>
          <h2 style={{ fontSize: 22, margin: '0 0 4px' }}>See where a report&apos;s evidence comes from.</h2>
          <div className="ftx-relate-row">
            <Link href="/features/battlecards">Battlecards →</Link>
            <Link href="/features/briefings">First light &amp; relief →</Link>
            <Link href="/features/insights">How the Tower reasons →</Link>
            <Link href="/pricing">Pricing →</Link>
          </div>
        </div>
      </section>

      {/* ---------- close ---------- */}
      <section className="wt-close">
        <div className="wrap">
          <h2>Stop being the last to know.</h2>
          <p>Name your competitors, or let the Tower find them. Real signals inside the hour.</p>
          <div className="wt-cta">
            <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
            <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
