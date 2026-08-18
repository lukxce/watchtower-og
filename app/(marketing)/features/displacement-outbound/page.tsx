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
          <div className="ftx-steps">
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">reputation</span>
                <h4>Review patterns, not one bad day</h4>
                <p>
                  A single 1-star review is noise — people have bad support calls everywhere. More than one
                  independent review citing the same specific complaint, across G2, Trustpilot or Capterra, is a
                  pattern, and the Tower only ever surfaces the pattern, never a single data point dressed up as one.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">corporate</span>
                <h4>A funding gap, read honestly</h4>
                <p>
                  A competitor that raised eighteen months ago and hasn&apos;t since is not automatically in
                  trouble — funding cycles vary — but it is a fact worth knowing. The funding channel reads SEC Form
                  D filings and funding news directly, and reports the gap without dressing it up as more than it is.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">voice &amp; pr</span>
                <h4>A departure, reported plainly</h4>
                <p>
                  A leadership exit that shows up in the news, especially in a function your prospect deals with
                  directly, is exactly the kind of thing a rep should hear the day it happens — not three weeks later
                  from a prospect who mentions it offhand on a call.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">corroboration</span>
                <h4>The Tower checks whether signals actually agree</h4>
                <p>
                  A review pattern alone doesn&apos;t get the beacon. A review pattern the same month a relevant
                  leader departs, or the same quarter funding goes quiet, is read together — the corroboration is
                  what turns three separate facts into something worth a rep&apos;s attention.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">surfaced, same day</span>
                <h4>It lands in the feed and the order of the day</h4>
                <p>
                  The moment a pattern clears the bar, it appears in your feed and that morning&apos;s briefing,
                  cited — available to act on the same day it&apos;s found, rather than surfacing weeks later in a
                  lost-deal debrief.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what's included ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">What gets watched for a weak signal</span>
          <h2 className="wt-h2">The channels most likely to show strain first.</h2>
          <div className="ftx-included">
            <div className="ftx-inc">
              <b>G2 review patterns</b>
              <p>Repeated complaints across G2&apos;s public reviews, read as a pattern rather than isolated feedback.</p>
            </div>
            <div className="ftx-inc">
              <b>Trustpilot &amp; Capterra</b>
              <p>The same pattern-reading applied across the other major public review platforms, not just one.</p>
            </div>
            <div className="ftx-inc">
              <b>Funding &amp; M&amp;A silence</b>
              <p>SEC Form D filings and funding news, tracked keylessly, to flag when a raise cycle has gone quiet.</p>
            </div>
            <div className="ftx-inc">
              <b>Leadership departures</b>
              <p>News coverage of executive exits, especially in functions a prospect deals with directly.</p>
            </div>
            <div className="ftx-inc">
              <b>Glassdoor sentiment</b>
              <p>Employee sentiment as a second, independent read on internal strain alongside customer reviews.</p>
            </div>
            <div className="ftx-inc">
              <b>Cross-category corroboration</b>
              <p>The Tower checks reputation, corporate and voice-and-pr signals against each other before surfacing anything.</p>
            </div>
            <div className="ftx-inc">
              <b>No proprietary weakness score</b>
              <p>No bare number ranking a competitor&apos;s vulnerability — every signal is shown with its own evidence instead.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">A pattern a rep actually used</span>
          <h2 className="wt-h2">Klue&apos;s G2 rating, and the post that explained it.</h2>
          <div className="ftx-story">
            <span className="mono">displacement · klue · reputation + voice &amp; pr</span>
            <h3>&quot;Support response time, three ways, one month.&quot;</h3>
            <p>
              Across the first two weeks of August, Klue&apos;s G2 profile picked up two new reviews in the 2-star
              range, both specifically citing slow support-ticket turnaround — a complaint that hadn&apos;t appeared
              in any of their prior six months of reviews. Two reviews with the same specific complaint, on their
              own, would have logged quietly and stayed off the beacon.
            </p>
            <p>
              What corroborated it was a LinkedIn post from a former Klue customer-success staffer, found by the
              LinkedIn company-posts scout, describing a &quot;stretched&quot; support team following a round of
              internal reorganization — posted the same week as the second review. Two independent channels, same
              underlying story, same fortnight.
            </p>
            <p>
              The Tower surfaced it in the feed as: &quot;Klue&apos;s support experience looks strained — two recent
              G2 reviews and a former employee&apos;s account both point at the same gap.&quot; A sales rep working a
              renewal decision against Klue used the exact wording, softened, as a question in a live call the
              following week.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> 2 G2 reviews (Aug 3, Aug 11) + 1 LinkedIn post from a former staffer (Aug 9), all
              linked
            </div>
          </div>
        </div>
      </section>

      {/* ---------- second worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">A quiet capital gap, corroborated by the reviews</span>
          <h2 className="wt-h2">Crayon went eighteen months without a raise. The reviews said why.</h2>
          <div className="ftx-story">
            <span className="mono">displacement · crayon · corporate + reputation</span>
            <h3>&quot;A funding gap, and reviews increasingly citing a slower roadmap.&quot;</h3>
            <p>
              Crayon&apos;s funding channel — reading SEC Form D filings and funding news directly — had shown no
              new round in eighteen months by mid-July, a long gap for a company that had raised twice in its first
              three years. A funding gap alone isn&apos;t proof of anything; plenty of healthy companies go long
              stretches between rounds by choice.
            </p>
            <p>
              What corroborated it was a shift in G2 review language over the same window: four reviews in the
              prior two months cited &quot;slower roadmap&quot; or &quot;fewer updates than expected,&quot; a theme
              that hadn&apos;t appeared in Crayon&apos;s reviews before that year. Two independent signals — a
              capital gap and a product-pace complaint — in the same window, neither proving the other, but
              pointing the same direction.
            </p>
            <p>
              The Tower surfaced it plainly: &quot;Crayon&apos;s funding has gone quiet for 18 months, and recent
              reviews increasingly cite a slower roadmap — worth knowing, not confirmed as cause and effect.&quot; A
              sales rep working a renewal against Crayon used the roadmap-pace angle as a genuine, low-key question
              rather than a scripted attack line.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> funding channel (no raise in 18 months, checked Jul 14) + 4 G2 reviews citing
              &quot;roadmap&quot;/&quot;updates&quot; (May–Jul), all linked
            </div>
          </div>
        </div>
      </section>

      {/* ---------- comparison ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="mkt-eyebrow">Versus the alternative</span>
          <h2 style={{ fontSize: 24 }}>No bespoke &quot;vulnerability score.&quot;</h2>
          <div className="ftx-vs">
            <span className="mono">how the others do it</span>
            <p>
              Some enterprise CI suites sell a proprietary displacement or vulnerability score — a single number with
              its methodology behind an NDA. Fortress HQ doesn&apos;t manufacture that number. It runs the same cited
              reasoning it uses everywhere else, pointed at reputation, corporate and voice-and-pr channels, and
              shows you the actual reviews and articles behind any pattern it surfaces — closer to Visualping&apos;s
              honesty about showing its source, at a scope none of the single-channel tools attempt.
            </p>
          </div>
          <div className="ftx-cmp">
            <table className="ftx-cmp-table">
              <thead>
                <tr><th>Approach</th><th>How weakness gets read</th><th>Fortress HQ</th></tr>
              </thead>
              <tbody>
                <tr>
                  <th>Klue / Crayon (enterprise tier)</th>
                  <td>Some editions offer a proprietary displacement or win-probability score, methodology usually undisclosed.</td>
                  <td className="us">No bespoke score — the same cited reasoning as everywhere else, sources always attached.</td>
                </tr>
                <tr>
                  <th>Visualping</th>
                  <td>Not attempted — a page-change tool has no concept of &quot;weakness,&quot; only &quot;changed.&quot;</td>
                  <td className="us">Reads reputation, corporate and voice-and-pr together, specifically for corroborated weak-signal patterns.</td>
                </tr>
                <tr>
                  <th>A CRM&apos;s own win-loss notes</th>
                  <td>Reactive — captured only after a deal is already lost.</td>
                  <td className="us">Surfaces the pattern while a deal is still live, the same day it clears the evidence bar.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Questions</span>
          <h2 className="wt-h2">Displacement signals, honestly.</h2>
          <div className="ftx-faq">
            <div className="ftx-faq-item">
              <h4>Isn&apos;t this just fear-mongering about a competitor&apos;s bad week?</h4>
              <p>
                That&apos;s the risk with any weakness-focused feature, which is why it&apos;s built defensively: no
                score, no ranking of who&apos;s &quot;weakest,&quot; just cited patterns surfaced when they clear the
                same evidence bar as everything else on the Tower. A single bad review never appears here — only a
                corroborated pattern does.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>What if a review pattern is coincidence, not a real problem?</h4>
              <p>
                It might be — the Tower reports a pattern exists, not that it proves a company is failing. That
                distinction is deliberate: the read is &quot;worth a look,&quot; never &quot;confirmed weakness,&quot;
                and the underlying reviews are always linked so you can judge for yourself.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Do you tell me the moment a pattern fires, or do I have to check?</h4>
              <p>
                Today, it surfaces in the feed and that morning&apos;s briefing — you check it there. Standing orders
                that push an instant notification to a rep the moment a pattern fires are in build, not shipped yet.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>How many bad reviews does it take before something surfaces?</h4>
              <p>
                There&apos;s no single public number to game, deliberately — it&apos;s a judgment about whether
                independent reports genuinely corroborate each other, not a fixed threshold. What&apos;s consistent
                is that one isolated review never clears the bar on its own.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Does this work the same way for my own company&apos;s reviews?</h4>
              <p>
                Fortress HQ watches the competitors you name, not your own listing — it&apos;s built to tell you what
                your market is doing, not to audit your own reputation. If your own G2 or Trustpilot page matters to
                you, that&apos;s a separate concern from this feature.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can this replace a rep&apos;s own judgment on a deal?</h4>
              <p>
                No, and it&apos;s not meant to. Per Law 1, the Tower reads and hands you the evidence — it never
                decides what to do with a weak-signal pattern. That call, in a live deal, stays entirely with the
                rep and their manager.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Is displacement-signal detection a Growth- or Enterprise-only feature?</h4>
              <p>
                No — it runs on the same reputation, corporate and voice-and-pr channels every tier gets, reading
                the same way regardless of plan. What Growth and Enterprise add is more competitors watched and, on
                Enterprise, a formal win-loss program layered on top.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Is this the same as a &quot;battle-tested displacement play&quot; some sales tools sell?</h4>
              <p>
                Different premise. Some sales tools sell a scripted displacement campaign — talk tracks assuming
                your competitor is already weak. We don&apos;t assume anything; we surface a specific, cited pattern
                only when it clears the same evidence bar as every other Fortress HQ read, and you decide what to do
                with it.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Could a competitor manipulate this by faking reviews about themselves?</h4>
              <p>
                Not meaningfully — the Tower requires corroboration across independent channels (reviews plus a
                departure, or reviews plus a funding gap), and a handful of fabricated reviews on one platform
                wouldn&apos;t clear that bar alone. It&apos;s a real limit worth naming rather than claiming
                immunity to manipulation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- who acts on it ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Two ways the same pattern gets used</span>
          <h2 className="wt-h2">A rep asks a different question than a founder does.</h2>
          <div className="ftx-pair">
            <div className="ftx-paircard">
              <span className="mono">sales rep</span>
              <h3>A same-day talking point, not a strategy memo</h3>
              <p>
                Reps lose deals on objections nobody briefed them on. A corroborated pattern — a review cluster, a
                departure — turns into one specific, low-key question a rep can ask on a live call, without ever
                naming Fortress HQ as the source.
              </p>
              <p>The value is the timing: same-day, not three weeks later in a lost-deal debrief.</p>
            </div>
            <div className="ftx-paircard">
              <span className="mono">founder / ceo</span>
              <h3>Market context, not a scoreboard</h3>
              <p>
                For a founder, a funding gap or a leadership exit at a competitor is one data point in reading the
                market&apos;s overall shape — not a reason to celebrate. It shows up in Overview and relief the same
                way any other signal does, weighed, not gloated over.
              </p>
              <p>The product is built to report the fact plainly, not to editorialize about a rival&apos;s trouble.</p>
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
