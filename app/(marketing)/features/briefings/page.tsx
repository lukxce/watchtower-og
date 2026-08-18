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
          <div className="ftx-steps">
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">standing watch</span>
                <h4>Scouts never stop</h4>
                <p>
                  The 22 channels get checked continuously, day and night, for every competitor you&apos;re watching.
                  A briefing is a moment where the watch gets handed to you — it is not a separate process running on
                  its own schedule, disconnected from what the scouts are actually finding.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">the day accumulates</span>
                <h4>Reports pile up, cited, until first light</h4>
                <p>
                  Through the day and overnight, every scout report lands against its competitor with its source
                  attached. Nothing gets written into a sentence yet — the Tower waits until it has the whole
                  picture before drawing a conclusion.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">first light compiles</span>
                <h4>The order of the day gets written</h4>
                <p>
                  At first light, the Tower reads everything that landed overnight, together, per competitor, and
                  writes the order of the day — what changed, why it matters, and whether any of it clears the
                  evidence bar for the beacon.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">the beacon decides</span>
                <h4>Only lit when it&apos;s earned</h4>
                <p>
                  Most of a briefing stays calm on purpose. The highlighter appears only for what clears the evidence
                  bar — so when you see it, you know to actually stop and read, instead of treating every row as
                  equally urgent.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">relief comes on duty</span>
                <h4>Once a week, the whole watch gets handed over</h4>
                <p>
                  Relief gathers every day&apos;s orders since the last one and compiles them into a single handover
                  — the shape of the week, across every competitor, for the reader who checks in weekly instead of
                  daily.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what's included ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">What&apos;s in a briefing</span>
          <h2 className="wt-h2">First light and relief, itemized.</h2>
          <div className="ftx-included">
            <div className="ftx-inc">
              <b>Order of the day</b>
              <p>The daily briefing itself — what changed overnight, grouped by competitor, written in plain language.</p>
            </div>
            <div className="ftx-inc">
              <b>Beacon highlighting</b>
              <p>Anything that clears the evidence bar gets visually lifted so it can&apos;t be skimmed past by accident.</p>
            </div>
            <div className="ftx-inc">
              <b>How-we-know citations</b>
              <p>Every line in a briefing traces to a scout&apos;s report, linked, so nothing arrives as an unsourced claim.</p>
            </div>
            <div className="ftx-inc">
              <b>Relief — the weekly digest</b>
              <p>A single handover compiling the week&apos;s orders across every competitor, for the once-a-week reader.</p>
            </div>
            <div className="ftx-inc">
              <b>Quiet-day honesty</b>
              <p>A day with nothing worth the beacon says so plainly, rather than inflating routine activity to look busier.</p>
            </div>
            <div className="ftx-inc">
              <b>Per-competitor grouping</b>
              <p>Both first light and relief organize by competitor first, so a specific rival&apos;s week is easy to isolate.</p>
            </div>
            <div className="ftx-inc">
              <b>Timestamped rows</b>
              <p>Every signal in a briefing carries the time it was found, not just the day — useful when more than one thing moved.</p>
            </div>
            <div className="ftx-inc">
              <b>Your cadence, either way</b>
              <p>Read first light every morning, lean on relief once a week, or both — the underlying watch runs the same regardless.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- today vs next: delivery honesty ---------- */}
      <section className="mkt-section tight">
        <div className="wrap mkt-2col">
          <div>
            <span className="mkt-eyebrow">Today</span>
            <h2 style={{ fontSize: 24 }}>You open the app and read it.</h2>
            <p className="lede">
              First light and relief are both real, generated pages inside Fortress HQ — the order of the day
              genuinely gets written every morning from cited signals, and relief genuinely compiles it weekly. What
              they are today is something you check, not something that finds you.
            </p>
          </div>
          <div>
            <span className="mkt-eyebrow">Next</span>
            <h2 style={{ fontSize: 24 }}>Standing orders — in build.</h2>
            <p className="lede">
              Push delivery of a briefing to Slack, email or a webhook the moment it&apos;s written is a standing
              order, and standing-order delivery is in build, not shipped. We&apos;d rather tell you honestly that
              you check the page today than claim a notification that doesn&apos;t exist yet.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- who reads which rhythm ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Two cadences, two kinds of mornings</span>
          <h2 className="wt-h2">A founder checks daily. A weekly reader still gets the whole picture.</h2>
          <div className="ftx-pair">
            <div className="ftx-paircard">
              <span className="mono">founder / ceo</span>
              <h3>First light, most mornings</h3>
              <p>
                Being the last to know is the specific fear first light exists to remove — a competitor&apos;s move
                showing up in a board meeting before it showed up in your own briefing. A minute at first light
                closes that gap.
              </p>
              <p>On a genuinely quiet morning, that minute confirms nothing needs attention — also useful, just less dramatic.</p>
            </div>
            <div className="ftx-paircard">
              <span className="mono">product / sales lead</span>
              <h3>Relief, once a week, still complete</h3>
              <p>
                Someone who doesn&apos;t check daily still needs the shape of the week when they do look — a product
                lead catching up on buildout signals, or a sales lead scanning for anything that changes this
                week&apos;s talking points.
              </p>
              <p>Relief exists so skipping five mornings never means missing the week&apos;s actual story.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">A morning first light earned its keep</span>
          <h2 className="wt-h2">The order of the day that named Kompyte&apos;s quiet absorption.</h2>
          <div className="ftx-story">
            <span className="mono">first light · 06:04</span>
            <h3>&quot;Kompyte is running on Semrush&apos;s roadmap now, not its own.&quot;</h3>
            <p>
              Overnight on August 5th, three scouts filed on Kompyte separately. The careers scout found their
              careers page returning a 404 for the second week running — not a redesign glitch, since the rest of
              the site was live. The ads scout found zero independent Google or LinkedIn ad accounts under
              Kompyte&apos;s own name, only Semrush&apos;s. The news scout turned up nothing at all — no press, no
              blog post, since the original acquisition coverage over a year earlier.
            </p>
            <p>
              None of those three facts is a story by itself. A 404&apos;d careers page could be a bug. Zero
              independent ad spend could be a quiet quarter. No press could just mean nothing happened. Read together
              at first light, the Tower wrote one line: &quot;Kompyte shows no sign of running as an independent
              product anymore — hiring, spend and press have all folded into Semrush&apos;s.&quot;
            </p>
            <p>
              That line got the beacon. It was the only thing in that morning&apos;s order of the day that did — a
              genuinely quiet night for the other five competitors on the watch, and the product said so.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> careers page 404 (2 consecutive scout runs) + zero independent ad accounts + zero
              press since acquisition, all linked
            </div>
          </div>
        </div>
      </section>

      {/* ---------- comparison ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="mkt-eyebrow">Versus the alternative</span>
          <h2 style={{ fontSize: 24 }}>Better than a shared Notion doc. Different from an alert forward.</h2>
          <div className="ftx-vs">
            <span className="mono">how the others do it</span>
            <p>
              The real competitor to a daily briefing is a shared Notion doc someone updates when they remember to —
              free, and six months stale, and you know it. Klue and Crayon forward raw detections you still have to
              interpret yourself into a narrative. First light and relief are already the narrative: read together,
              conclusion first, evidence attached, so the reading is done before you open the page.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Questions</span>
          <h2 className="wt-h2">Briefings, honestly.</h2>
          <div className="ftx-faq">
            <div className="ftx-faq-item">
              <h4>Do you notify me automatically, or do I have to check?</h4>
              <p>
                You check it today. First light and relief are real pages, generated on schedule, but push delivery
                to Slack, email or a webhook is a standing order still in build. We say that plainly rather than
                imply a notification that doesn&apos;t exist.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>What if nothing happened overnight — is there still a briefing?</h4>
              <p>
                Yes, and it says so. A quiet night produces a short, calm order of the day rather than a padded one.
                Under Law 2, the beacon only appears when something actually clears the evidence bar — most mornings,
                nothing does, and that&apos;s the intended, honest outcome.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can I choose weekly only and skip the daily briefing entirely?</h4>
              <p>
                Yes — read first light every morning, lean on relief once a week, or both. The scouts run
                continuously either way; the briefings are just two different moments of reading the same watch.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Is the beacon ever wrong — does it light for something that turns out to be nothing?</h4>
              <p>
                It can misjudge significance, since judgment is what a reasoning layer does. What it won&apos;t do is
                light without a cited source — every beacon traces to specific scout reports you can open and check
                for yourself.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Does relief just repeat the week&apos;s first-light briefings?</h4>
              <p>
                It compiles them into one handover rather than re-pasting five separate mornings — the point is the
                shape of the week for someone who doesn&apos;t have time to read five daily orders, not a duplicate
                feed.
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
