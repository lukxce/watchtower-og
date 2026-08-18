import Link from 'next/link';

export const metadata = {
  title: 'For Product Marketing — Fortress HQ',
  description:
    'Battlecards that update themselves and cite their sources, so you stop being the one thing standing between sales and a stale card.',
};

export default function ProductMarketingPage() {
  return (
    <>
      <section className="tmx-hero">
        <div className="tmx-wrap">
          <h1 className="tmx-pull">
            Someone asks what&apos;s new with them. <span className="hl">You don&apos;t know.</span>
          </h1>
          <p className="tmx-dek">
            You wrote the battlecard once, carefully, with sources. That was three months and one price change ago.
            You&apos;re the whole competitive intelligence function, and the market didn&apos;t agree to wait for
            you to have a free afternoon.
          </p>
        </div>
      </section>

      <section className="tmx-proof-sec">
        <div className="tmx-wrap">
          <p className="tmx-proof">
            When a competitor&apos;s pricing page changes, their card updates the same day, with the page it came
            from linked underneath. <b>What you forward to a rep is something you can defend on a call</b> —
            not a paraphrase of a screenshot someone sent you, but a claim with a source attached.
          </p>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap tmx-monday">
          <span className="tmx-eyebrow">Monday morning</span>
          <h2 className="tmx-h2">The job that used to be &quot;maintain six cards&quot; on top of everything else.</h2>
          <span className="tmx-monday-time">10:05 — between a sales enablement call and a launch deck</span>
          <p>
            You used to keep six competitor battlecards in a shared doc, each one a small research project of its
            own — check the pricing page, check the changelog, skim G2 for anything new, ask a rep if they&apos;d
            heard anything on a call. You&apos;d get through it maybe once a quarter, because product marketing is
            also positioning the new release, briefing sales on messaging, and running win-loss calls, and the cards
            were always the thing that could wait one more week. Then a rep would ask &quot;what&apos;s new with
            Kompyte&quot; in Slack and you&apos;d realize the honest answer was you didn&apos;t know either.
          </p>
          <p>
            Now the cards update themselves. You open Klue&apos;s card Monday morning not because it&apos;s stale
            and you&apos;re dreading the rewrite, but because the feed flagged something worth a look: three
            hostnames tagged for interviewing and voice, showing up on the certificate-transparency log, alongside
            four open roles posted this month in the same area. <b>The card already reflects it</b> — the product
            angle now reads &quot;Voice interviewing is new ground for them. We haven&apos;t built it either — watch
            it,&quot; with the hostnames and the hiring cluster cited underneath.
          </p>
          <p>
            You don&apos;t rewrite it from scratch. You read what changed, decide whether it changes how you&apos;d
            brief sales on this competitor this quarter, and move on to the launch deck you actually have to ship
            today. When the rep pings you at 2pm asking what&apos;s new with Kompyte, you already know: their
            careers page has been a 404 since the acquisition, no independent ad accounts running. You forward the
            card. It took four seconds, and it&apos;s something you can defend if the rep repeats it on a call.
          </p>
          <p>
            That&apos;s the actual shift — not that the research disappears, but that it stops being the thing
            competing with everything else on your plate for a free afternoon that rarely comes.
          </p>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">What you get</span>
          <h2 className="tmx-h2">Everything a one-person CI function needs to stop being a bottleneck.</h2>
          <p className="tmx-lede">
            You&apos;re usually not just writing battlecards — you&apos;re the de facto competitive intelligence
            function for the whole company. This is built around that reality, not a narrower one.
          </p>
          <div className="tmx-grid">
            <div className="tmx-card">
              <span className="tmx-card-k">Battlecards</span>
              <h3>Three angles, always current</h3>
              <p>
                Sales, marketing and product angles on one card per competitor, updating the same day something
                changes — you review and edit judgment calls, you don&apos;t rebuild the card from scratch.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Signal feed</span>
              <h3>Everything, before it&apos;s a Slack question</h3>
              <p>
                Pricing, product, hiring and reputation activity across 22 public channels, dated and sourced — so
                &quot;what&apos;s new with X&quot; has an answer before someone asks it.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Threat Index</span>
              <h3>Where to spend your limited hours</h3>
              <p>
                A weighted score across five dimensions — GTM, talent, product, market, corporate — so when you only
                have time to deep-dive one competitor this week, it&apos;s the right one.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Launch Radar</span>
              <h3>A heads-up before the launch, not after</h3>
              <p>
                A forecast built on corroborating buildout signals, so the card — and your own launch positioning —
                can get ahead of a competitor&apos;s announcement instead of scrambling the week it drops.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Campaign intelligence</span>
              <h3>What they&apos;re actually spending on</h3>
              <p>
                Live counts across Meta, Google and LinkedIn ad libraries, plus events and webinar pages — the
                marketing-angle evidence behind every card, not a guess about their GTM motion.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Comparison discovery</span>
              <h3>Know when they build a page against you</h3>
              <p>
                A competitor standing up a comparison page targeting your product turns up in the feed, sourced —
                one more input into the card instead of a surprise from a prospect.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Reports</span>
              <h3>Forwardable to anyone who won&apos;t log in</h3>
              <p>
                Built from the same cited signals as the card, ready to hand to a rep, an exec, or a launch team
                that needs the competitive picture without opening the product themselves.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Relief</span>
              <h3>A weekly catch-up across every competitor</h3>
              <p>
                A digest across the whole watch, once a week — useful for spotting the pattern across competitors
                that a single card, read in isolation, would miss.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">How product marketing actually uses it</span>
          <h2 className="tmx-h2">You review and forward. You don&apos;t rebuild from zero.</h2>
          <div className="tmx-steps">
            <div className="tmx-step">
              <span className="tmx-step-n">01</span>
              <div>
                <h3>A card updates because something changed</h3>
                <p>
                  A pricing edit, a new ad, a buildout signal — the card reflects it the same day, with the source
                  linked underneath the new line.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">02</span>
              <div>
                <h3>You read the change, not the whole card</h3>
                <p>
                  You&apos;re checking whether this changes how sales or marketing should talk about this competitor
                  this quarter — a judgment call the card surfaces but doesn&apos;t make for you.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">03</span>
              <div>
                <h3>A rep asks what&apos;s new — you forward the card</h3>
                <p>
                  No rewrite, no digging. The card is already current, and the source underneath means the rep can
                  repeat it on a call without checking with you first.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">04</span>
              <div>
                <h3>Launch Radar flags a competitor buildout</h3>
                <p>
                  You get a heads-up before the launch post, giving your own positioning and messaging time to react
                  instead of being written in a scramble the week they announce.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-section tmx-honest">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">Why not just do this by hand</span>
          <h2 className="tmx-h2">One person can&apos;t out-watch a whole market by hand.</h2>
          <p>
            At most companies, competitive intelligence isn&apos;t a team — it&apos;s a responsibility bolted onto
            product marketing, alongside launches, sales enablement and messaging. <b>You wrote the cards once,
            carefully, and then the job became remembering to go back and check them</b>, which competes for time
            against everything with a deadline attached — and cards never have a deadline until someone notices
            they&apos;re wrong.
          </p>
          <p>
            The honest failure mode isn&apos;t that the cards are bad. It&apos;s that they&apos;re good the week
            you write them and then quietly decay, one price change and one feature launch at a time, until the gap
            between what the card says and what&apos;s actually true is wide enough that a rep gets burned on a call
            and the whole team stops trusting the cards — including the parts that are still accurate.
          </p>
          <p>
            This doesn&apos;t take the writing away from you. It takes away the part where staying current required
            re-doing research you&apos;d already done, over and over, on a schedule that never actually held.
          </p>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">Questions PMMs actually ask</span>
          <h2 className="tmx-h2">Including the one about whether this is your replacement.</h2>
          <div className="tmx-faq">
            <details>
              <summary>Does this replace product marketing&apos;s job?</summary>
              <p>
                No. It replaces the manual research loop that used to eat a chunk of your week — checking pricing
                pages, skimming review sites, asking reps if they&apos;d heard anything. Deciding what a change means
                for your positioning, and writing the actual messaging, is still yours. The tower reads; you decide.
              </p>
            </details>
            <details>
              <summary>We already have Klue or Crayon. Why would we need this too?</summary>
              <p>
                Klue and Crayon are real enterprise CI platforms, and if your org already has one embedded in the
                CRM with a dedicated admin, it may already cover what you need. This exists for the far more common
                case: a solo PMM or a small team without the budget or headcount for an enterprise CI deployment,
                who still needs cards that stay current without becoming a second job.
              </p>
            </details>
            <details>
              <summary>How accurate are the cards — do I need to fact-check them before forwarding?</summary>
              <p>
                Every claim on a card carries a how-we-know citation to the page, post or filing it came from. If a
                page can&apos;t be verified, the product says so instead of filling the gap with a guess. You should
                still apply judgment to what a fact means — but the fact itself is sourced, not paraphrased from a
                screenshot.
              </p>
            </details>
            <details>
              <summary>What does it cost for a team our size?</summary>
              <p>
                Starter is $149/mo for 3 competitors watched daily — the right starting point for most solo-PMM
                setups. If you&apos;re tracking more than a handful of named competitors, or need campaign and
                landing-page tracking on top of the core cards, Growth at $399/mo covers up to 10.
              </p>
            </details>
            <details>
              <summary>Can I set it to notify me the moment a card changes?</summary>
              <p>
                Not yet — standing orders, the persistent rule that would push a notification the moment something
                fires, are in build, not shipped. What&apos;s real today is that the card itself updates the same
                day and you can check it in the app; we&apos;d rather tell you that plainly than promise a push
                notification that doesn&apos;t exist.
              </p>
            </details>
          </div>
        </div>
      </section>

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
    </>
  );
}
