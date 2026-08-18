import Link from 'next/link';

export const metadata = {
  title: 'Insights — Fortress HQ',
  description:
    "How the Tower turns raw signals into one plain-language conclusion, with a how-we-know citation under every claim. No false fires — ever.",
};

export default function InsightsFeature() {
  return (
    <div className="ftx">
      {/* ---------- hero ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-over">Feature · Insights</span>
            <span className="kicker">The Tower · the reasoning layer</span>
            <h1 className="wt-h1">One conclusion. Always with its receipts.</h1>
            <p className="wt-dek">
              The Tower is the part of Fortress HQ that reads everything the scouts bring back — together, per
              competitor — and writes one plain-language conclusion. Not a pile of alerts you interpret yourself.
              And under every conclusion, a how-we-know line, so the read never outruns the evidence.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo →</Link>
            </div>
            <p className="wt-note">From $149/mo · no card required</p>
          </div>

          <div className="ftx-art">
            <div className="wt-panel" aria-label="A mocked Tower read">
              <div className="wt-panel-head">
                <span className="mono">the tower · read</span>
                <span className="wt-live"><i />live</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.1s' }}>
                <span className="wt-row-t mono">scout</span>
                <span className="wt-row-x">interview.klue.com observed on certificate-transparency log</span>
                <span className="wt-row-g mono">buildout</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.22s' }}>
                <span className="wt-row-t mono">scout</span>
                <span className="wt-row-x">4 open roles tagged &quot;voice&quot; posted this month</span>
                <span className="wt-row-g mono">hiring</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.34s' }}>
                <span className="wt-row-t mono">scout</span>
                <span className="wt-row-x">2025 report referenced &quot;agentic interviewing&quot; once, in passing</span>
                <span className="wt-row-g mono">context</span>
              </div>
              <div className="ftx-readout">
                <span className="mono">the tower · conclusion</span>
                <b>Klue is building an AI interviewer. They haven&apos;t said so.</b>
                <p>Three facts, none of them a launch on their own. Read together, they are a team, not an experiment.</p>
              </div>
              <div className="ftx-know">
                <b>How we know:</b> cert-transparency log + 4 hiring posts + 1 report line, all linked
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- flow ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">How it works</span>
          <h2 className="wt-h2">From scattered facts to one sentence you can act on.</h2>
          <p className="wt-lede">
            This is brand law 1 and law 3, built into a feature: the tower reads, you decide — and no false fires.
          </p>
          <div className="ftx-flow">
            <div className="ftx-flow-step">
              <span className="mono">1 · scouts report</span>
              <h4>Facts, with sources</h4>
              <p>
                Each scout reports honestly on its one channel — a hostname, a job post, a review, an ad. A fact with
                a source, nothing interpreted yet.
              </p>
            </div>
            <div className="ftx-flow-step">
              <span className="mono">2 · the tower reads</span>
              <h4>Read together, per competitor</h4>
              <p>
                The Tower looks at everything a competitor&apos;s scouts brought back in one pass, not channel by
                channel — which is where the actual connection lives.
              </p>
            </div>
            <div className="ftx-flow-step">
              <span className="mono">3 · one conclusion</span>
              <h4>Plain language, cited underneath</h4>
              <p>
                A single sentence a Watch Commander can act on, with the how-we-know line always visible beneath it —
                never buried, never optional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- the two laws ---------- */}
      <section className="mkt-section tight ftx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">Two rules that never bend</span>
          <h2 className="wt-h2">No false fires. No guessing.</h2>
          <div className="wt-beats">
            <div className="wt-beat">
              <span className="wt-beat-k mono">law 3</span>
              <h3>No false fires</h3>
              <p>
                Every conclusion carries its source. If a page can&apos;t be verified, the product says so out loud
                instead of filling the gap with a guess.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">the corollary</span>
              <h3>A name match isn&apos;t a mention</h3>
              <p>
                A brand name that also matches a song, a band or an unrelated company is not a signal. Every match is
                classified before it reaches you — client, different entity, or noise.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">law 2</span>
              <h3>The beacon is earned</h3>
              <p>
                Loud treatment is reserved for whatever clears the evidence bar. Most of the page stays calm on
                purpose, so when something is highlighted, it means look here — this is real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className="ftx-relate">
        <div className="wrap">
          <span className="mkt-eyebrow">Keep going</span>
          <h2 style={{ fontSize: 22, margin: '0 0 4px' }}>See the read applied to a real competitor.</h2>
          <div className="ftx-relate-row">
            <Link href="/features/battlecards">Battlecards →</Link>
            <Link href="/features/overview">The daily briefing surface →</Link>
            <Link href="/features/displacement-outbound">Turning a read into outreach →</Link>
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
