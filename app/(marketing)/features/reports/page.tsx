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
          <div className="wt-beats">
            <div className="wt-beat">
              <span className="wt-beat-k mono">same evidence</span>
              <h3>No new claims appear</h3>
              <p>
                Everything in a report already exists in the feed or a battlecard. Pulling a report together doesn&apos;t
                introduce anything the Tower hasn&apos;t already read and cited.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">built to forward</span>
              <h3>For the reader who isn&apos;t in the app</h3>
              <p>
                A rep prepping for a call, or an exec who wants the quarter in five minutes, gets a document made to
                be read once, cover to cover, without a login.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">honest by default</span>
              <h3>Gaps stay gaps</h3>
              <p>
                If a channel had nothing to report on a competitor that quarter, the report says so, rather than
                padding the page to look busier than the market actually was.
              </p>
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
