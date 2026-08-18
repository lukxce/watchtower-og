import Link from 'next/link';

export const metadata = {
  title: 'Campaign Intelligence — Fortress HQ',
  description:
    'Ad monitoring across the Meta, Google and LinkedIn ad libraries, plus events, webinars and customer-logo wins and losses — what they are actually running, not press releases about it.',
};

export default function CampaignIntelligenceFeature() {
  return (
    <div className="ftx">
      {/* ---------- hero ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-over">Feature · Campaign intelligence</span>
            <span className="kicker">GTM &amp; ads · watched daily</span>
            <h1 className="wt-h1">We watch what they&apos;re running, not what they announce.</h1>
            <p className="wt-dek">
              Campaign intelligence scouts the Meta, Google and LinkedIn ad libraries, events and webinar pages, and
              customer-logo walls for every competitor on your watch. A press release tells you what a competitor
              wants you to think. Live spend tells you what they actually believe is working.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo →</Link>
            </div>
            <p className="wt-note">From $149/mo · no card required</p>
          </div>

          <div className="ftx-art">
            <div className="wt-panel" aria-label="A mocked campaign intelligence feed">
              <div className="wt-panel-head">
                <span className="mono">gtm &amp; ads · today</span>
                <span className="wt-live"><i />live</span>
              </div>
              <div className="ftx-stats">
                <div className="ftx-stat"><b>11</b><span>Visualping ads live</span></div>
                <div className="ftx-stat"><b>1</b><span>Crayon LinkedIn ad</span></div>
                <div className="ftx-stat"><b>0</b><span>Crayon Google ads</span></div>
              </div>
              <div className="wt-row hot" style={{ animationDelay: '0.1s' }}>
                <span className="wt-row-t mono">08:12</span>
                <span className="wt-row-x">Signal Labs: 10 ads live, still zero press coverage</span>
                <span className="wt-row-g mono">ads</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.24s' }}>
                <span className="wt-row-t mono">09:05</span>
                <span className="wt-row-x">Klue: new events page live, &quot;State of CI&quot; webinar listed</span>
                <span className="wt-row-g mono">events</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.38s' }}>
                <span className="wt-row-t mono">10:31</span>
                <span className="wt-row-x">Kompyte: logo wall unchanged for the fourth month running</span>
                <span className="wt-row-g mono">logos</span>
              </div>
              <div className="ftx-readout">
                <span className="mono">the tower</span>
                <b>Crayon is defending, not hunting.</b>
                <p>Zero Google ads and one on LinkedIn, against a events page pushing enterprise case studies — this is retention spend, not new-buyer spend.</p>
              </div>
              <div className="ftx-know">
                <b>How we know:</b> Google &amp; LinkedIn ad library counts, checked daily · cited on the card
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- mechanism ---------- */}
      <section className="mkt-section tight ftx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">How it works</span>
          <h2 className="wt-h2">Spend is a confession. We read it daily.</h2>
          <p className="wt-lede">
            What a competitor spends money to say, in public, and how that changes week to week — three real
            channels, read together.
          </p>
          <div className="wt-beats">
            <div className="wt-beat">
              <span className="wt-beat-k mono">ad libraries</span>
              <h3>Meta, Google, LinkedIn</h3>
              <p>
                Every public ad library gets checked on a schedule, and the count and the message get logged — so a
                quiet quarter and a spend surge both show up as a trend, not a one-off screenshot.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">events &amp; webinars</span>
              <h3>What they&apos;re trying to convince a room of</h3>
              <p>
                New events pages and webinar listings are one of the earliest tells of a positioning shift — they
                get written months before the campaign that follows them.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">customer logos</span>
              <h3>Wins and losses on the wall</h3>
              <p>
                A logo wall that adds a name is a proof point. One that goes quiet for months is a gap. Either way,
                it is evidence — not a guess about who they closed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className="ftx-relate">
        <div className="wrap">
          <span className="mkt-eyebrow">Keep going</span>
          <h2 style={{ fontSize: 22, margin: '0 0 4px' }}>Ad spend is one channel of 22.</h2>
          <div className="ftx-relate-row">
            <Link href="/features/data-sources">See the full channel list →</Link>
            <Link href="/features/battlecards">How this feeds a battlecard →</Link>
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
