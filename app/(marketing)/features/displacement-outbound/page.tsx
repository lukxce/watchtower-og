import Link from 'next/link';

export const metadata = {
  title: 'Displacement & Outbound — Fortress HQ',
  description:
    "A competitor's own weak signals — a bad-review pattern, a funding gap, a leadership departure — surfaced in the feed, cited, the day they clear the evidence bar.",
};

export default function DisplacementOutboundFeature() {
  return (
    <div className="ftx">
      {/* ---------- hero ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-over">Feature · Displacement &amp; outbound</span>
            <span className="kicker">Reputation · Corporate · Voice &amp; PR</span>
            <h1 className="wt-h1">Their weak moment, your same-day trigger.</h1>
            <p className="wt-dek">
              A bad-review pattern on G2 or Trustpilot. A leadership departure that turns up in the news. A funding
              round that never came. None of these are dramatic on their own — the Tower surfaces the moment in the
              feed the day it clears the evidence bar, so a rep can act on it same-day instead of finding out three
              weeks late in a lost deal.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo →</Link>
            </div>
            <p className="wt-note">From $149/mo · no card required</p>
          </div>

          <div className="ftx-art">
            <div className="wt-panel" aria-label="A mocked displacement signal">
              <div className="wt-panel-head">
                <span className="mono">feed · reputation dip</span>
                <span className="wt-live"><i />live</span>
              </div>
              <div className="wt-row hot" style={{ animationDelay: '0.1s' }}>
                <span className="wt-row-t mono">g2</span>
                <span className="wt-row-x">3rd 1-star review in 2 weeks, all citing &quot;support response time&quot;</span>
                <span className="wt-row-g mono">reputation</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.24s' }}>
                <span className="wt-row-t mono">news</span>
                <span className="wt-row-x">VP of Customer Success departure reported, no replacement named</span>
                <span className="wt-row-g mono">voice &amp; pr</span>
              </div>
              <div className="ftx-readout">
                <span className="mono">the tower</span>
                <b>Support is visibly strained, and the person who owned it just left.</b>
                <p>Three reviews naming the same complaint, arriving the same month a Customer Success VP departs, is a pattern worth a call — not proof of anything beyond that.</p>
              </div>
              <div className="ftx-know">
                <b>How we know:</b> 3 G2 reviews + 1 news article, all linked
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- mechanism ---------- */}
      <section className="mkt-section tight ftx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">How it works</span>
          <h2 className="wt-h2">The Tower surfaces the moment. You set the trigger.</h2>
          <p className="wt-lede">
            This is not a scoring system that ranks competitors by weakness — it is the same reading the Tower
            already does, pointed at the channels where a customer&apos;s own frustration shows up first.
          </p>
          <div className="wt-beats">
            <div className="wt-beat">
              <span className="wt-beat-k mono">reputation</span>
              <h3>Review patterns, not one bad day</h3>
              <p>
                A single 1-star review is noise. Three in a row citing the same complaint, across G2, Trustpilot or
                Capterra, is a pattern — and the Tower only surfaces the pattern.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">corporate</span>
              <h3>A funding gap, read honestly</h3>
              <p>
                A competitor that raised eighteen months ago and hasn&apos;t since is not automatically in trouble —
                but it is a fact worth knowing, and we say so without dressing it up as more than it is.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">voice &amp; pr</span>
              <h3>A departure, reported plainly</h3>
              <p>
                A leadership exit that shows up in the news, especially in a function your prospect deals with
                directly, is exactly the kind of thing a rep should hear the day it happens.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what's real today vs what's next ---------- */}
      <section className="mkt-section tight">
        <div className="wrap mkt-2col">
          <div>
            <span className="mkt-eyebrow">Today</span>
            <h2 style={{ fontSize: 24 }}>It surfaces in the feed, cited.</h2>
            <p className="lede">
              Reputation, corporate and voice-and-pr signals land in the feed and the daily order of the day the
              moment they clear the evidence bar — no proprietary displacement score, no guessing. The same cited
              reasoning the Tower does everywhere else, pointed at the channels most likely to show a competitor&apos;s
              customers are unhappy.
            </p>
          </div>
          <div>
            <span className="mkt-eyebrow">Next</span>
            <h2 style={{ fontSize: 24 }}>Standing orders — in build.</h2>
            <p className="lede">
              A persistent rule you set once on a competitor, so a rep gets told the instant a pattern fires instead
              of checking the feed by hand. The read is real today; the push notification is the next thing we&apos;re
              building, not something we&apos;ll pretend already ships.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className="ftx-relate">
        <div className="wrap">
          <span className="mkt-eyebrow">Keep going</span>
          <h2 style={{ fontSize: 22, margin: '0 0 4px' }}>See how a trigger becomes a card.</h2>
          <div className="ftx-relate-row">
            <Link href="/features/battlecards">Battlecards →</Link>
            <Link href="/features/insights">How the Tower reasons →</Link>
            <Link href="/features/briefings">First light &amp; relief →</Link>
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
