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

      {/* ---------- who reads which angle ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">One card, two very different mornings</span>
          <h2 className="wt-h2">A rep and a PMM open the same card for different reasons.</h2>
          <div className="ftx-pair">
            <div className="ftx-paircard">
              <span className="mono">sales lead / rep</span>
              <h3>Something to say on the call in an hour</h3>
              <p>
                A rep doesn&apos;t open a battlecard to study a competitor&apos;s history — they open it thirty
                minutes before a call, looking for one specific, current thing to raise. The sales angle is written
                for exactly that moment: a question, not a slogan.
              </p>
              <p>Losing a deal on an objection nobody briefed them on is the exact problem this angle exists to prevent.</p>
            </div>
            <div className="ftx-paircard">
              <span className="mono">product marketing</span>
              <h3>The card that doesn&apos;t go stale the week after it&apos;s written</h3>
              <p>
                A PMM — often the only person maintaining competitive content — needs the marketing angle to already
                reflect this week&apos;s reality, not the quarter when the card was first drafted. Auto-refresh on
                new signal is what makes that true.
              </p>
              <p>A card with sources they can forward to sales, without editing it by hand first, is the whole point.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">A card that caught the gap</span>
          <h2 className="wt-h2">What Crayon&apos;s ads promised, and what their pricing page did.</h2>
          <div className="ftx-story">
            <span className="mono">battlecard · crayon · marketing angle</span>
            <h3>&quot;Self-serve in the ad, a demo call on the page.&quot;</h3>
            <p>
              In late July, Fortress HQ&apos;s LinkedIn ads scout picked up a new Crayon campaign running the line
              &quot;Start tracking competitors today — no sales call needed.&quot; Ad copy alone isn&apos;t a
              signal worth a card update; competitors say all kinds of things in ads.
            </p>
            <p>
              What made it a battlecard line was the website scout&apos;s pass the same week: every pricing-page
              CTA on crayon.co still routed to &quot;Book a demo,&quot; with no self-serve checkout anywhere in the
              flow — the same structure it had carried for the prior four scout runs. The ad was making a promise
              the pricing page didn&apos;t keep.
            </p>
            <p>
              The Tower wrote the marketing angle plainly: &quot;Crayon is advertising a self-serve motion their own
              pricing page doesn&apos;t offer — ask a prospect who saw that ad whether they got a number without a
              call.&quot; A rep working a deal against Crayon had that exact question ready two days later.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> LinkedIn Ad Library entry (Jul 24) + pricing-page CTA capture, unchanged across 4
              scout runs, both linked on the card
            </div>
          </div>
        </div>
      </section>

      {/* ---------- comparison ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="mkt-eyebrow">Versus the alternative</span>
          <h2 style={{ fontSize: 24 }}>Klue&apos;s cards are strong. Ours maintain themselves.</h2>
          <div className="ftx-vs">
            <span className="mono">how the others do it</span>
            <p>
              Klue&apos;s battlecards are genuinely good, backed by deep CRM integration and an enablement motion —
              but they&apos;re built and refreshed by a person, after a demo call, on an enterprise contract. Crayon
              runs the same category play at the same price class. Fortress HQ publishes pricing, gets you live the
              same day, and rewrites a card&apos;s angles automatically the day a new signal clears the bar, instead
              of waiting for someone to notice it went stale.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Questions</span>
          <h2 className="wt-h2">Battlecards, honestly.</h2>
          <div className="ftx-faq">
            <div className="ftx-faq-item">
              <h4>Is the Tower making these angles up, or are they grounded in real signals?</h4>
              <p>
                Every angle traces back to a specific scout report, visible under the how-we-know line. If a claim
                on a card can&apos;t be tied to a source, that&apos;s a bug, not a feature — Law 3 exists precisely
                so a card never outruns its evidence.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>What if my own positioning changes — does the card notice?</h4>
              <p>
                The Tower reads new signals against your current pricing and site, so yes — the framing adapts as
                your own positioning moves, not just theirs. It won&apos;t retroactively rewrite history, but every
                new angle reflects where you stand today.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can I edit a card myself, or is it fully automated?</h4>
              <p>
                The card is generated and refreshed by the Tower from cited signals. What you do with it — forward
                it, act on it, ignore it — is the Watch Commander&apos;s call, per Law 1. The tower reads; it never
                decides for you.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>How often does a card actually refresh?</h4>
              <p>
                Whenever a new signal on that competitor clears the evidence bar — there&apos;s no fixed weekly
                cycle you have to wait out. A quiet competitor&apos;s card can sit unchanged for weeks; an active one
                can update the same day something real happens.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Do you generate a card for every competitor automatically?</h4>
              <p>
                Only for competitors you&apos;ve mustered onto your watch. Fortress HQ doesn&apos;t build cards on
                companies you haven&apos;t named — that keeps the watch focused on the market that actually matters
                to you.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can I get a card notified to Slack the moment it updates?</h4>
              <p>
                Not yet — that&apos;s a standing order, and standing-order delivery to Slack, email or a webhook is
                in build, not shipped. Today, the card updates in the app and shows up in that day&apos;s order of
                the day; you check it there rather than getting pushed a notification.
              </p>
            </div>
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
