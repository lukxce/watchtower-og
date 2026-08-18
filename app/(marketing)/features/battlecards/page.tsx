import Link from 'next/link';

export const metadata = {
  title: 'Battlecards — Fortress HQ',
  description:
    'One briefing per competitor, written against your own positioning, not a generic template — with sales, marketing and product angles, every line cited.',
};

export default function BattlecardsFeature() {
  return (
    <div className="ftx">
      {/* ---------- hero ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-over">Feature · Battlecards</span>
            <span className="kicker">Always current · never stale</span>
            <h1 className="wt-h1">The briefing that maintains itself.</h1>
            <p className="wt-dek">
              A battlecard is the per-competitor briefing — what they are doing, why it matters, and how you win
              against them, written against your own positioning instead of a generic template. When something
              changes, the card changes. Nobody has to remember to update it.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo →</Link>
            </div>
            <p className="wt-note">From $149/mo · no card required</p>
          </div>

          <div className="ftx-art">
            <div className="wt-panel" aria-label="A mocked battlecard header">
              <div className="wt-panel-head">
                <span className="mono">battlecard · klue</span>
                <span className="wt-live"><i />live</span>
              </div>
              <div className="ftx-readout">
                <span className="mono">the tower</span>
                <b>Klue is shipping an AI interviewer. They haven&apos;t said so.</b>
                <p>
                  Three hostnames given over to interviewing and voice, plus a hiring cluster in the same area,
                  is real engineering commitment — not an experiment.
                </p>
              </div>
              <div className="ftx-know">
                <b>How we know:</b> cert-transparency log, 3 hostnames + 4 open roles tagged &quot;voice&quot;
              </div>
              <div className="wt-row" style={{ animationDelay: '0.14s' }}>
                <span className="wt-row-t mono">sales</span>
                <span className="wt-row-x">Ask what shipped since the acquisition. Make them answer with dates.</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.26s' }}>
                <span className="wt-row-t mono">marketing</span>
                <span className="wt-row-x">Their pricing page routes every visitor to a demo call, ours has a number.</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.38s' }}>
                <span className="wt-row-t mono">product</span>
                <span className="wt-row-x">Voice interviewing is new ground for them. We haven&apos;t built it either — watch it.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- mechanism ---------- */}
      <section className="mkt-section tight ftx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">How it works</span>
          <h2 className="wt-h2">Three angles, one card, always cited.</h2>
          <p className="wt-lede">
            A battlecard is not a feature-comparison table. It is a read, written for the three people who actually
            have to use it in a live conversation.
          </p>
          <div className="ftx-steps">
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">muster</span>
                <h4>A competitor is mustered onto the watch</h4>
                <p>
                  You name a competitor, or let the Tower suggest one from your market. From that moment, all 22
                  channels start reporting on them, and a blank battlecard is created with the frame the rest of this
                  page fills in.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">signals accumulate</span>
                <h4>Every scout report gets attached to the card</h4>
                <p>
                  A new ad, a pricing change, a hiring cluster, a review pattern — each one lands against that
                  competitor&apos;s card individually, cited, the same day it&apos;s found. The card is a living
                  file, not a document someone writes once.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">read against your positioning</span>
                <h4>The Tower checks it against your own site and pricing</h4>
                <p>
                  The same signal reads differently depending on what you actually compete on. The Tower weighs each
                  new fact against your own pricing, your own claims and your own gaps before deciding what it means
                  for you specifically — not a generic template answer.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">three angles compiled</span>
                <h4>Sales, marketing and product each get a written angle</h4>
                <p>
                  A question a rep can ask live. A gap between what they claim and what their pages show. A buildout
                  signal product should know about before a launch post. Three different readers, three different
                  angles, one card.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">the card updates itself</span>
                <h4>Nobody has to remember to refresh it</h4>
                <p>
                  When a new signal clears the evidence bar, the card&apos;s angles get rewritten to reflect it —
                  automatically, the same day. A battlecard that goes stale the week after it&apos;s written is
                  exactly the problem this replaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what's included ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">What&apos;s on every card</span>
          <h2 className="wt-h2">One shape, every competitor, no exceptions.</h2>
          <div className="ftx-included">
            <div className="ftx-inc">
              <b>Sales angle</b>
              <p>A live-call question or contrast the competitor can&apos;t answer comfortably — written for a rep mid-conversation.</p>
            </div>
            <div className="ftx-inc">
              <b>Marketing angle</b>
              <p>The gap between what they tell the market and what their own pages, ads and pricing actually show.</p>
            </div>
            <div className="ftx-inc">
              <b>Product angle</b>
              <p>Buildout signals — hostnames, hiring clusters, changelog language — read together as an early roadmap tell.</p>
            </div>
            <div className="ftx-inc">
              <b>How-we-know citations</b>
              <p>Every line on a card traces to the scout report that produced it — never a claim without its source attached.</p>
            </div>
            <div className="ftx-inc">
              <b>Auto-refresh on new signal</b>
              <p>A card rewrites its own angles the day a new signal clears the evidence bar — no manual maintenance required.</p>
            </div>
            <div className="ftx-inc">
              <b>Written against your positioning</b>
              <p>The same competitor fact is framed differently depending on your own pricing and claims — never a generic template.</p>
            </div>
            <div className="ftx-inc">
              <b>All 22 channels feed it</b>
              <p>Product, GTM &amp; ads, talent, voice &amp; PR, reputation and market signals all land on the same card, not separate silos.</p>
            </div>
            <div className="ftx-inc">
              <b>One card per competitor</b>
              <p>No merged, generic &quot;the competition&quot; view — every competitor on your watch gets their own card, built from their own signals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- grounding: written against your positioning ---------- */}
      <section className="mkt-section tight">
        <div className="wrap mkt-2col">
          <div>
            <span className="mkt-eyebrow">Not a template</span>
            <h2 style={{ fontSize: 24 }}>Written against your positioning, not a generic one.</h2>
            <p className="lede">
              The same competitor reads differently depending on who is watching them. A card built for you is built
              from your own pricing, your own claims and your own gaps — the same finding lands as a different
              sentence depending on what you are actually competing on.
            </p>
          </div>
          <div>
            <span className="mkt-eyebrow">Law 1 · in practice</span>
            <h2 style={{ fontSize: 24 }}>The tower reads. You decide.</h2>
            <p className="lede">
              A card never tells you what to do next — that is a command, and the command is yours. It tells you what
              happened, why it matters, and hands you the evidence. What you do with it is the Watch Commander&apos;s
              call.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className="ftx-relate">
        <div className="wrap">
          <span className="mkt-eyebrow">Keep going</span>
          <h2 style={{ fontSize: 22, margin: '0 0 4px' }}>See how a card gets written.</h2>
          <div className="ftx-relate-row">
            <Link href="/features/insights">How the Tower reasons →</Link>
            <Link href="/features/displacement-outbound">Turning a weak spot into outreach →</Link>
            <Link href="/features/reports">Sharing a card outside the app →</Link>
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
