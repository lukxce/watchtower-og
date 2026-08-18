import Link from 'next/link';

export const metadata = {
  title: 'For Executives — Fortress HQ',
  description:
    'The state of the market in ten seconds, without assigning anyone to compile it.',
};

export default function ExecutivesPage() {
  return (
    <>
      <section className="tmx-hero">
        <div className="tmx-wrap">
          <h1 className="tmx-pull">
            <span className="hl">You find out in the board meeting.</span>
          </h1>
          <p className="tmx-dek">
            A board member mentions a competitor&apos;s move and the room turns to you. You could ask someone to go
            compile a market update, or you could already have one — not a feed to scroll, one page, that says
            what changed and why it matters.
          </p>
        </div>
      </section>

      <section className="tmx-proof-sec">
        <div className="tmx-wrap">
          <p className="tmx-proof">
            Every morning&apos;s briefing is one page: what moved, why it matters, what&apos;s worth watching.
            <b> Every line traces back to a source</b> — a pricing page, a job post, a filing — so what you bring
            into the room is something you can stand behind, not a summary of a summary.
          </p>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap tmx-monday">
          <span className="tmx-eyebrow">Monday morning</span>
          <h2 className="tmx-h2">The market update you used to have to assign to someone.</h2>
          <span className="tmx-monday-time">07:40 — before the leadership stand-up</span>
          <p>
            You used to handle this the way most founders and execs do: badly, and only when forced. Someone on the
            team — a chief of staff, a PMM, sometimes you, at 11pm before a board meeting — would spend an afternoon
            googling competitor names, reading their pricing pages, checking LinkedIn for hiring activity, trying to
            reconstruct three months of a market&apos;s movement from memory and open tabs. It was never wrong,
            exactly. It was just always a week behind by the time it reached a slide, and it cost someone&apos;s
            afternoon every single time.
          </p>
          <p>
            Now you open Overview before your coffee is done. One page: how many competitors you&apos;re watching,
            how many signals came in this week, and who the Tower is calling the biggest threat right now — say
            Klue, this week, because three new hostnames tagged &quot;voice&quot; showed up on the certificate log
            alongside a run of senior hires in the same area. That&apos;s not a hunch. It&apos;s two channels read
            together, and the how-we-know line underneath tells you exactly why it&apos;s the top line today and
            not last week.
          </p>
          <p>
            Underneath it, the rest of the week is right there too — Crayon running zero paid ad spend for a third
            straight month, Signal Labs still quoting Team-tier pricing on a call instead of publishing it. None of
            it needed anyone to compile it. <b>You read it in less time than it takes to finish the coffee</b>, and
            when the board asks what&apos;s happening with a competitor, you&apos;re not reconstructing it from
            memory — you&apos;re reading off something you already read this morning, with a source under every
            line.
          </p>
          <p>
            On Friday, relief comes on duty instead — the weekly digest, for the week you didn&apos;t check in
            daily. Same standard, wider lens: the whole watch, one document, built for the person who needs the
            shape of the week, not five mornings of orders.
          </p>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">What you get</span>
          <h2 className="tmx-h2">Built for someone who needs the market, not the feed.</h2>
          <p className="tmx-lede">
            You&apos;re not the person who should be reading twenty rows of raw signal every morning. These are the
            surfaces built for the ten seconds you actually have.
          </p>
          <div className="tmx-grid">
            <div className="tmx-card">
              <span className="tmx-card-k">Overview</span>
              <h3>The whole market, one page</h3>
              <p>
                Competitors watched, signals this week, and the biggest threat right now — read before your coffee
                is done, with every line able to open into its own evidence if you need to go deeper.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Threat Index</span>
              <h3>A rating you can actually open</h3>
              <p>
                A weighted score across five dimensions — GTM, talent, product, market, corporate — shown with the
                signals that fed it. Never a bare number you have to take on faith.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Launch Radar</span>
              <h3>Who&apos;s closest to shipping</h3>
              <p>
                A forecast with named evidence, not a guess — it fires only when signal types actually corroborate
                each other, so you&apos;re not caught flat-footed by a launch that was visible months in advance.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Relief</span>
              <h3>The weekly digest for a weekly cadence</h3>
              <p>
                A handover, not a summary — what happened across the whole watch while you weren&apos;t checking in
                daily. Built for the person who needs the shape of the week, not the play-by-play.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Corporate signals</span>
              <h3>Funding, leadership, and what&apos;s missing</h3>
              <p>
                A funding round that never came, a leadership departure reported in the news — read honestly, without
                dressing up a gap as more than it is.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Signal feed</span>
              <h3>The evidence, if you want to go read it</h3>
              <p>
                Every scout&apos;s report across 22 public channels, dated and sourced — there for the moment you
                want to check a claim yourself instead of taking the summary on trust.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Reports</span>
              <h3>Something you can put in front of the board</h3>
              <p>
                Built from the same cited signals as the feed, ready to hand to a board member or an investor who
                won&apos;t log into the product themselves — nothing added, nothing rewritten on the way out.
              </p>
            </div>
            <div className="tmx-card">
              <span className="tmx-card-k">Battlecards</span>
              <h3>One per competitor, for when you go deep</h3>
              <p>
                If a specific competitor becomes the topic of the meeting, their card is already written — sales,
                marketing and product angles, each one cited, ready before you&apos;re asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">How you actually use it</span>
          <h2 className="tmx-h2">A cadence built around a board meeting, not a dashboard habit.</h2>
          <div className="tmx-steps">
            <div className="tmx-step">
              <span className="tmx-step-n">01</span>
              <div>
                <h3>Monday, you open Overview</h3>
                <p>
                  Thirty seconds before the leadership stand-up — competitors watched, this week&apos;s biggest
                  threat, and whether anything actually cleared the evidence bar since Friday.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">02</span>
              <div>
                <h3>Something moves, you check the Threat Index</h3>
                <p>
                  A competitor&apos;s rating shifts and you open it to see why — which of the five dimensions moved,
                  and what specifically fed it, before you repeat the conclusion to anyone else.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">03</span>
              <div>
                <h3>Before the board meeting, you pull a report</h3>
                <p>
                  One page, sourced, that you can forward ahead of the meeting or read from directly — built from
                  what the Tower already read, not compiled the night before.
                </p>
              </div>
            </div>
            <div className="tmx-step">
              <span className="tmx-step-n">04</span>
              <div>
                <h3>Friday, relief tells you what you missed</h3>
                <p>
                  If the week got away from you, the digest catches you up in one read — the whole watch, not five
                  days of orders you now have to skim in reverse.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-section tmx-honest">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">Why not just do this by hand</span>
          <h2 className="tmx-h2">Assigning it to someone is still a tax on their week.</h2>
          <p>
            The usual answer at a 10–150 person company is to give someone — a chief of staff, a PMM, sometimes an
            exec themselves — an informal mandate to &quot;keep an eye on the competition.&quot; It never works
            cleanly, because <b>competitive intelligence competes for time against that person&apos;s actual job</b>,
            and it always loses until a board meeting or a lost deal makes it urgent again.
          </p>
          <p>
            The output is also uneven in a way that&apos;s easy to miss: a manually compiled update reflects whatever
            the person had time to check, not what actually matters, and it rarely says what it didn&apos;t get to.
            An update built from continuous coverage across 22 channels doesn&apos;t have that gap — and when it
            does have one, a page it couldn&apos;t reach, it says so instead of quietly leaving it out.
          </p>
          <p>
            This doesn&apos;t remove the need for judgment about what a competitor&apos;s move means for your
            strategy — that&apos;s still yours. It removes the part where someone spends an afternoon finding out
            what happened before anyone can even start deciding what to do about it.
          </p>
        </div>
      </section>

      <section className="tmx-section">
        <div className="tmx-wrap">
          <span className="tmx-eyebrow">Questions founders actually ask</span>
          <h2 className="tmx-h2">Including the ones about whether this is worth the time.</h2>
          <div className="tmx-faq">
            <details>
              <summary>How much time does this actually take from me each week?</summary>
              <p>
                Most weeks, Overview is a thirty-second read and the rest of your week doesn&apos;t change. It&apos;s
                built for someone who checks in, not someone who logs in daily — read the order of the day if you
                want the daily rhythm, or let relief catch you up once a week if you don&apos;t.
              </p>
            </details>
            <details>
              <summary>What does it cost at our stage?</summary>
              <p>
                Starter is $149/mo for 3 competitors watched daily — reasonable for an early-stage team watching a
                handful of named rivals. Growth, at $399/mo, covers up to 10 competitors with full campaign and
                landing-page tracking, which is where most Series A–B teams land. Enterprise is a quote, and covers
                SSO, audit logs and a dedicated onboarding for larger orgs.
              </p>
            </details>
            <details>
              <summary>Do I need someone dedicated to running this?</summary>
              <p>
                No — that&apos;s the point. The watch runs on its own; you&apos;re reading a finished briefing, not
                operating a research tool. Someone on your team can still muster new competitors or adjust what&apos;s
                watched, but nobody needs to be assigned to compile updates by hand.
              </p>
            </details>
            <details>
              <summary>How do I know the Threat Index isn&apos;t just a vibe dressed up as a number?</summary>
              <p>
                It&apos;s never shown as a bare number. Every score is a weighted composite across five stored
                dimensions — GTM, talent, product, market, corporate — and you can open any of them to see exactly
                what moved it. If you can&apos;t trace a number to evidence, we&apos;d rather you distrust it.
              </p>
            </details>
            <details>
              <summary>What happens if a competitor is quiet — do I still get spammed with updates?</summary>
              <p>
                No. Law 2 in how we build this: the beacon is earned. A quiet week for a competitor reads as a quiet
                week — most of the interface stays calm on purpose, so when something is actually highlighted, it
                means it&apos;s real, not that the product needed to fill space.
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
