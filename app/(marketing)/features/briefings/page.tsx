import Link from 'next/link';

export const metadata = {
  title: 'Briefings — Fortress HQ',
  description:
    'The order of the day at first light, and relief at the end of the week — the two moments your market gets handed to you, read and cited.',
};

export default function BriefingsFeature() {
  return (
    <div className="ftx">
      {/* ---------- hero ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-over">Feature · Briefings</span>
            <span className="kicker">First light · daily. Relief · weekly.</span>
            <h1 className="wt-h1">The order of the day, and the relief that follows it.</h1>
            <p className="wt-dek">
              Every morning at first light, the Tower hands you the order of the day — what moved overnight, why it
              matters. Every week, relief comes on duty: a handover digest telling you what happened while you
              weren&apos;t watching. Scouts gather. The Tower sees. You command.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo →</Link>
            </div>
            <p className="wt-note">From $149/mo · no card required</p>
          </div>

          <div className="ftx-art">
            <div className="wt-panel" aria-label="A mocked first light briefing">
              <div className="wt-panel-head">
                <span className="mono">first light · 06:04</span>
                <span className="wt-live"><i />live</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.1s' }}>
                <span className="wt-row-t mono">05:40</span>
                <span className="wt-row-x">Visualping: 11 ads live across Google</span>
                <span className="wt-row-g mono">ads</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.22s' }}>
                <span className="wt-row-t mono">05:52</span>
                <span className="wt-row-x">mcp-adapter.app.klue.com is live in production</span>
                <span className="wt-row-g mono">buildout</span>
              </div>
              <div className="wt-row hot" style={{ animationDelay: '0.34s' }}>
                <span className="wt-row-t mono">07:30</span>
                <span className="wt-row-x">&quot;Klue is building AI voice interviewing, unannounced&quot;</span>
                <span className="wt-row-g mono">the tower</span>
              </div>
              <div className="ftx-readout">
                <span className="mono">order of the day</span>
                <b>One thing worth acting on: Klue&apos;s buildout.</b>
                <p>Everything else this morning was routine — logged, cited, and not worth the beacon.</p>
              </div>
              <div className="ftx-know">
                <b>How we know:</b> 3 scout reports, cited individually above
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- the two rhythms ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Two rhythms</span>
          <h2 className="wt-h2">A daily order, and a weekly relief.</h2>
          <p className="wt-lede">
            The watch never stops, but you shouldn&apos;t have to stand it every hour. These are the two moments it
            hands itself back to you.
          </p>
          <div className="ftx-pair">
            <div className="ftx-paircard">
              <span className="mono">daily</span>
              <h3>First light — the order of the day</h3>
              <p>
                The morning briefing moment. Overnight, every scout reported in; the Tower read it together and wrote
                the order of the day — what changed, why it matters, whether anything is worth the beacon.
              </p>
              <p>
                Most mornings, that&apos;s a short, calm read. That is by design: the product only shouts when
                something actually clears the evidence bar.
              </p>
            </div>
            <div className="ftx-paircard">
              <span className="mono">weekly</span>
              <h3>Relief — the handover digest</h3>
              <p>
                A watch is relieved, not summarized. Once a week, relief comes on duty and tells you what happened
                across the whole watch while you were off the wall — every competitor, one digest.
              </p>
              <p>
                Built for the person who checks in weekly rather than daily: a founder, an exec, anyone who needs the
                shape of the week without reading five mornings of orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- mechanism ---------- */}
      <section className="mkt-section tight ftx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">How it works</span>
          <h2 className="wt-h2">The same watch, two ways of reading it.</h2>
          <div className="wt-beats">
            <div className="wt-beat">
              <span className="wt-beat-k mono">standing watch</span>
              <h3>Scouts never stop</h3>
              <p>
                The 22 channels get checked continuously, day and night — a briefing is a moment where the watch gets
                handed to you, not a separate process that runs on its own schedule.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">the beacon</span>
              <h3>Only lit when it&apos;s earned</h3>
              <p>
                Most of a briefing stays calm on purpose. The highlighter appears only for what clears the evidence
                bar — so when you see it, you know to actually stop and read.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">your rhythm</span>
              <h3>Daily or weekly, your call</h3>
              <p>
                Read the order of the day every morning, or let relief catch you up once a week — the watch runs
                either way, and command stays yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className="ftx-relate">
        <div className="wrap">
          <span className="mkt-eyebrow">Keep going</span>
          <h2 style={{ fontSize: 22, margin: '0 0 4px' }}>See the surface these briefings feed.</h2>
          <div className="ftx-relate-row">
            <Link href="/features/overview">The daily briefing surface →</Link>
            <Link href="/features/insights">How the Tower reasons →</Link>
            <Link href="/features/reports">Forwarding a briefing →</Link>
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
