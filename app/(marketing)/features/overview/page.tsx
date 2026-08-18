import Link from 'next/link';

export const metadata = {
  title: 'Overview — Fortress HQ',
  description:
    "The Tower's daily briefing surface: market activity, competitor ratings, the biggest threat this week, and who is closest to shipping.",
};

export default function OverviewFeature() {
  return (
    <div className="ftx">
      {/* ---------- hero ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-over">Feature · Overview</span>
            <span className="kicker">On watch · every morning</span>
            <h1 className="wt-h1">See your whole market on one page.</h1>
            <p className="wt-dek">
              Overview is where the Tower puts everything it read overnight. What moved across your market since
              yesterday, how each competitor is rated this week, who is the biggest threat right now, and who looks
              closest to shipping something new. One page, read before your coffee is done.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo →</Link>
            </div>
            <p className="wt-note">From $149/mo · no card required</p>
          </div>

          <div className="ftx-art">
            <div className="wt-panel" aria-label="A mocked Overview page">
              <div className="wt-panel-head">
                <span className="mono">first light · 06:04</span>
                <span className="wt-live"><i />live</span>
              </div>
              <div className="ftx-stats">
                <div className="ftx-stat"><b>6</b><span>competitors watched</span></div>
                <div className="ftx-stat"><b>41</b><span>signals this week</span></div>
                <div className="ftx-stat"><b>Klue</b><span>biggest threat</span></div>
              </div>
              <div className="wt-row hot" style={{ animationDelay: '0.1s' }}>
                <span className="wt-row-t mono">05:52</span>
                <span className="wt-row-x">interview.klue.com goes live in production</span>
                <span className="wt-row-g mono">buildout</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.24s' }}>
                <span className="wt-row-t mono">06:10</span>
                <span className="wt-row-x">Crayon: zero paid spend, third month running</span>
                <span className="wt-row-g mono">gap</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.38s' }}>
                <span className="wt-row-t mono">06:22</span>
                <span className="wt-row-x">Signal Labs still quotes Team tier on a call</span>
                <span className="wt-row-g mono">pricing</span>
              </div>
              <div className="ftx-readout">
                <span className="mono">the tower</span>
                <b>Klue is this week&apos;s biggest threat.</b>
                <p>Three new hostnames plus a hiring cluster tagged &quot;voice&quot; point at a real launch, not a test.</p>
              </div>
              <div className="ftx-know">
                <b>How we know:</b> certificate-transparency log + 4 open roles · cited in full on the battlecard
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- mechanism ---------- */}
      <section className="mkt-section tight ftx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">How it works</span>
          <h2 className="wt-h2">One page, read before coffee.</h2>
          <p className="wt-lede">
            Overview does not ask you to open six tabs and reconstruct the week yourself. The Tower already did that,
            and it shows its work.
          </p>
          <div className="wt-beats">
            <div className="wt-beat">
              <span className="wt-beat-k mono">market activity</span>
              <h3>Everything, bundled by day</h3>
              <p>
                Every scout&apos;s report from the last 24 hours, grouped by competitor and dated, so a quiet week
                and a loud one look different at a glance instead of both being a wall of rows.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">competitor ratings</span>
              <h3>A rating you can open</h3>
              <p>
                Each competitor carries a Threat Index — never a bare number, always shown with the signals that fed
                it, so you can see why it moved instead of taking our word for it.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">launch radar</span>
              <h3>Who is closest to shipping</h3>
              <p>
                A forecast with named evidence, not a prophecy. It fires only when the signal types actually
                corroborate each other — a hostname alone is not a launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className="ftx-relate">
        <div className="wrap">
          <span className="mkt-eyebrow">Keep going</span>
          <h2 style={{ fontSize: 22, margin: '0 0 4px' }}>Overview is the surface. Here is what feeds it.</h2>
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
