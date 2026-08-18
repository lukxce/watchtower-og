import Link from 'next/link';

export const metadata = {
  title: 'For Sales — Fortress HQ',
  description:
    'How you win against each competitor, in language a rep can use on a call, sourced instead of guessed.',
};

export default function SalesTeamPage() {
  return (
    <>
      <section className="tmx-hero">
        <div className="tmx-wrap">
          <h1 className="tmx-pull">
            <span className="hl">You find out from a lost deal.</span>
          </h1>
          <p className="tmx-dek">
            The rep hits an objection nobody briefed them on, on a call, live, and loses ground they can&apos;t
            get back. Not because the answer didn&apos;t exist — because nobody had written it down yet.
          </p>
        </div>
      </section>

      <section className="tmx-proof-sec">
        <div className="tmx-wrap">
          <p className="tmx-proof">
            Each competitor&apos;s battlecard carries the objections reps actually hit — a pricing move, a feature
            they started advertising, a review that names you — each one sourced to the page or post that raised
            it. <b>&quot;How we win against X&quot; is written in language a rep can say out loud</b>, not a
            paragraph of positioning theory nobody reads before a call.
          </p>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap tmx-monday">
          <span className="tmx-eyebrow">Monday morning</span>
          <h2 className="tmx-h2">The week you actually have, not the one enablement wishes you had.</h2>
          <span className="tmx-monday-time">08:52 — twenty minutes before your first call</span>
          <p>
            You used to start Mondays digging through a shared Slack channel called #competitive-intel that three
            people update inconsistently, looking for anything on the account you&apos;re about to call. Half the
            posts are screenshots with no date. The other half are a rep from Q2 asking &quot;does anyone know if
            Klue still does X&quot; with no reply. You&apos;d open the deal, open the competitor&apos;s pricing page
            in a second tab, and try to remember if anything had changed since you last looked — which is not a
            real answer, it&apos;s a guess with confidence attached to it.
          </p>
          <p>
            Now you open the feed instead. It&apos;s sorted by competitor, and the one you&apos;re calling —
            say Klue — has three lines from the last five days: an ad live on LinkedIn using new language about
            &quot;AI interviewing,&quot; a pricing page still gated behind &quot;request a demo,&quot; and a G2
            review from last week complaining about onboarding time. None of that is dramatic on its own. Together,
            it&apos;s exactly what you need thirty seconds before a call — not a personality profile of the
            competitor, three current facts with sources under them.
          </p>
          <p>
            You open their battlecard. The sales angle is one line: <b>&quot;Ask what shipped since their last
            release. Make them answer with dates.&quot;</b> It&apos;s not a slogan — it&apos;s a specific question
            built from what their own product pages actually show versus what their sales deck claims. You screenshot
            nothing. You don&apos;t need to — the card is still going to be there, and still current, the next time
            this account comes up.
          </p>
          <p>
            The call happens. The prospect brings up a competitor&apos;s new feature, half-remembered from a demo.
            You already know what it is, when it shipped, and what it doesn&apos;t do yet, because you read it
            twenty minutes ago with a source attached. You don&apos;t improvise an answer — you cite one. That&apos;s
            the entire difference between this Monday and the old one.
          </p>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">What you get</span>
          <h2 className="tmx-h2">Built for the exact moment a deal turns on one answer.</h2>
          <p className="tmx-lede">
            Not a research tool you have to remember to check — a set of surfaces built around the moments a rep
            actually needs an answer fast.
          </p>
          <div className="tmx-grid">
            <div className="tmx-card">
              <span className="tmx-card-k">Battlecards</span>
              <h3>&quot;How we win against X,&quot; sourced</h3>
              <p>
                One card per competitor, written in language a rep can say on a call — not a feature-comparison
                table. Every objection it covers traces back to a page, post, or review, so you can cite it instead
                of guessing.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Signal feed</span>
              <h3>What changed, dated and cited</h3>
              <p>
                Pricing moves, new ads, review patterns and hiring activity across 28 public channels, in one place
                per competitor — so &quot;has anything changed&quot; has a real answer instead of a shrug.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Threat Index</span>
              <h3>Who to prep for hardest this week</h3>
              <p>
                A weighted score across five dimensions — GTM, talent, product, market, corporate — shown with the
                signals that fed it, so you know which competitor is actually moving before a big call, not just
                which one comes up most in Slack.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Pricing &amp; packaging</span>
              <h3>Every price change, flagged</h3>
              <p>
                A competitor&apos;s pricing or plan page changes and it shows up in the feed the same week, dated —
                so you&apos;re never the one quoting a number a prospect already knows is stale.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Displacement signals</span>
              <h3>Their weak moment, same day</h3>
              <p>
                A pattern of bad reviews, a leadership departure, a funding round that never came — read together
                and surfaced in the feed the day it clears the evidence bar, so you can act on it same-week instead
                of finding out in a lost deal.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Comparison discovery</span>
              <h3>See what they&apos;re saying about you</h3>
              <p>
                When a competitor stands up a comparison page against you, it turns up in the feed instead of a
                prospect forwarding it to you first — so you find out from us, not from them.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Launch Radar</span>
              <h3>What they&apos;re about to ship</h3>
              <p>
                A forecast built on corroborating signals — hostnames, hiring clusters, changelog language — not a
                guess. If a prospect asks about a rumored feature, you&apos;ll likely have already read about the
                buildout.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Reports</span>
              <h3>One page to forward to your manager</h3>
              <p>
                Built from the same cited signals as the feed and the battlecards, ready to hand to a sales manager
                prepping a deal review — nothing summarized away, nothing invented to fill a slide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">How sales actually uses it</span>
          <h2 className="tmx-h2">The workflow is built around the objection, not the tool.</h2>
          <div className="tmx-steps">
            <div className="tmx-step">
              <span className="tmx-step-n">01</span>
              <div>
                <h3>An objection comes up on a call</h3>
                <p>
                  A prospect says &quot;X does this already&quot; or &quot;X is cheaper.&quot; You don&apos;t
                  argue from memory — you note it and move on, knowing you can check it in two minutes after the
                  call.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">02</span>
              <div>
                <h3>You open that competitor&apos;s battlecard</h3>
                <p>
                  The sales angle is written for exactly this — a specific question or contrast, not a paragraph of
                  positioning. You check whether the claim the prospect made is even still true.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">03</span>
              <div>
                <h3>You cite the source back to the prospect</h3>
                <p>
                  &quot;Their pricing page still says request-a-demo as of this week&quot; lands differently than
                  &quot;I think they still do that.&quot; The how-we-know line under every claim is what makes it
                  sayable out loud.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">04</span>
              <div>
                <h3>Before the next call, you check the feed</h3>
                <p>
                  Thirty seconds, sorted by competitor — anything that changed since you last looked on this
                  account. Most days it&apos;s quiet. That&apos;s useful information too.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">05</span>
              <div>
                <h3>You pull a report for the deal review</h3>
                <p>
                  Your manager doesn&apos;t log into the feed. A one-page report built from the same cited signals
                  gives them the competitive picture without you re-explaining it live.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-section tmx-honest">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">Why not just do this by hand</span>
          <h2 className="tmx-h2">A shared doc doesn&apos;t survive contact with a live call.</h2>
          <p>
            The honest version of the status quo isn&apos;t &quot;nothing&quot; — it&apos;s a Notion page or a
            Slack channel that someone set up with good intentions during onboarding, that three reps update
            inconsistently, and that nobody trusts enough to quote to a prospect without checking it first. That
            checking is the actual cost: it happens live, on the call, where you don&apos;t have five minutes to
            verify a claim before you say it out loud.
          </p>
          <p>
            The deeper problem is that <b>competitive information decays fast and nobody on a sales team is paid
            to watch it continuously</b>. A rep&apos;s job is to be on calls, not to check six competitor pricing
            pages and three ad libraries every morning. So the doc gets updated after a deal is lost to something
            in it, which is the most expensive possible time to learn it was wrong.
          </p>
          <p>
            This doesn&apos;t replace judgment on a call — it replaces the twenty minutes of digging you used to do
            before one, and the guessing you did when there wasn&apos;t time for even that.
          </p>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">Questions reps actually ask</span>
          <h2 className="tmx-h2">Straight answers, including the ones that aren&apos;t flattering.</h2>
          <div className="tmx-faq">
            <details>
              <summary>What does it cost, and do I need my own seat?</summary>
              <p>
                Starter is $149/mo for 3 competitors watched daily, which covers most single-team deployments.
                Access is set up at the account level by whoever owns the workspace — talk to whoever runs sales
                enablement or ops about getting added, rather than signing up individually per rep.
              </p>
            </details>
            <details>
              <summary>How do I know a claim in a battlecard is actually right?</summary>
              <p>
                Every line carries a how-we-know citation — the specific page, ad, or post it came from. If a page
                can&apos;t be verified, the product says so instead of guessing, so what you cite on a call is
                something you can stand behind if the prospect pushes back.
              </p>
            </details>
            <details>
              <summary>We already pay for Klue. Why would we also use this?</summary>
              <p>
                If your team lives inside Salesforce and needs cards surfaced at deal time in the CRM, Klue&apos;s
                integration depth is real and worth what you pay for it. If you want a second, independent read on
                what a competitor is actually doing this week — priced for a team that isn&apos;t running a
                dedicated CI function — that&apos;s the gap this fills.
              </p>
            </details>
            <details>
              <summary>Will I get pinged the moment something changes?</summary>
              <p>
                Not yet, honestly. Standing orders — a rule you set once that notifies you the moment a pattern
                fires — are in build, not shipped. What&apos;s real today is the feed and the battlecards, both
                current and both worth checking before a call; the push notification is the next thing we&apos;re
                building, and we&apos;d rather say that plainly than pretend it already exists.
              </p>
            </details>
            <details>
              <summary>Does this replace the work of sales enablement?</summary>
              <p>
                No. It replaces the manual research a battlecard used to require to stay current, and the guessing
                that happened when it didn&apos;t. Deciding what a card should emphasize for your specific market is
                still a judgment call for a human — the tower reads, your team decides.
              </p>
            </details>
            <details>
              <summary>How fast does a new competitor move show up?</summary>
              <p>
                Scouts run on a daily cadence across the 28 channels, so most changes — a new ad, a pricing page
                edit, a review — show up in the feed within a day of happening, cited to the source. It&apos;s not
                real-time to the minute, and we won&apos;t claim it is.
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
