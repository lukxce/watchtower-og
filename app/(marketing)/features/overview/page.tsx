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
                <span className="wt-row-t mono">06:28</span>
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
            and it shows its work — five steps, every morning, before you&apos;ve seen it.
          </p>
          <div className="ftx-steps">
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">overnight</span>
                <h4>Every scout reports in</h4>
                <p>
                  Across the night, all 28 channels get checked for every competitor on your watch — pricing pages,
                  ad libraries, job boards, certificate-transparency logs, review sites, sitemaps. Each scout files
                  its own honest report, including the ones that found nothing.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">the tower reads</span>
                <h4>Everything, bundled by day and competitor</h4>
                <p>
                  The Tower reads each competitor&apos;s reports together, not channel by channel, and groups the
                  result by day. A quiet week and a loud one look different at a glance — a wall of rows never does
                  that on its own.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">threat index</span>
                <h4>Each competitor&apos;s rating recalculates</h4>
                <p>
                  Every competitor carries a Threat Index — never a bare number, always shown with the signals that
                  fed it. When it moves, you can open it and see exactly which reports caused the move instead of
                  taking our word for it.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">launch radar</span>
                <h4>Corroborating signals get checked for a launch pattern</h4>
                <p>
                  A forecast with named evidence, not a prophecy. Launch Radar only fires when independent signal
                  types actually corroborate each other — a new hostname plus a hiring cluster plus changelog
                  language, not a hostname alone.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">assembled</span>
                <h4>Overview gets written, biggest threat first</h4>
                <p>
                  The page assembles itself around whatever actually cleared the evidence bar this week — the
                  single biggest threat named at the top, everything else logged calmly underneath. Nothing gets
                  inflated to fill the page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- the beacon rule, applied to this page ---------- */}
      <section className="mkt-section tight">
        <div className="wrap mkt-2col">
          <div>
            <span className="mkt-eyebrow">Law 2 · in practice</span>
            <h2 style={{ fontSize: 24 }}>Calm by default. Loud only when it&apos;s earned.</h2>
            <p className="lede">
              Most rows on Overview render in the same quiet type as everything else on the page. The highlighter —
              the beacon — only appears on a row that has cleared the evidence bar: independent signal types,
              corroborating each other, not a single event dressed up to look bigger.
            </p>
          </div>
          <div>
            <span className="mkt-eyebrow">Why it matters here specifically</span>
            <h2 style={{ fontSize: 24 }}>An interface that can say &quot;this one matters.&quot;</h2>
            <p className="lede">
              A dashboard where every row is styled as urgent has no way left to say a specific row actually is. On
              Overview, if you see the highlighter, stop and read it — that&apos;s the entire point of reserving it.
              Everything else can wait until you have the time.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- what's included ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">What&apos;s on the page</span>
          <h2 className="wt-h2">Everything Overview actually shows.</h2>
          <p className="wt-lede">
            Not a widget dashboard you configure yourself — a fixed set of reads the Tower assembles for you,
            every morning, the same way.
          </p>
          <div className="ftx-included">
            <div className="ftx-inc">
              <b>Market activity feed</b>
              <p>Every signal from the last 24 hours, grouped by competitor and timestamped, oldest to newest.</p>
            </div>
            <div className="ftx-inc">
              <b>Competitor threat ratings</b>
              <p>A Threat Index per competitor, shown with the specific signals that moved it — open any number.</p>
            </div>
            <div className="ftx-inc">
              <b>Biggest-threat callout</b>
              <p>One competitor named as this week&apos;s biggest threat, with the evidence chain underneath it.</p>
            </div>
            <div className="ftx-inc">
              <b>Launch Radar</b>
              <p>Who looks closest to shipping something new, based on corroborating signal types — not a guess.</p>
            </div>
            <div className="ftx-inc">
              <b>Quiet-week honesty</b>
              <p>On a genuinely quiet week, Overview says so. It does not manufacture activity to look useful.</p>
            </div>
            <div className="ftx-inc">
              <b>Per-competitor drill-down</b>
              <p>Every row on Overview opens into the full battlecard behind it — the summary is never the whole story.</p>
            </div>
            <div className="ftx-inc">
              <b>Evidence on every line</b>
              <p>A how-we-know citation under every conclusion on the page, not just the headline one.</p>
            </div>
            <div className="ftx-inc">
              <b>Six-channel-group coverage</b>
              <p>Product, GTM &amp; ads, Talent, Voice &amp; PR, Reputation and Market — all represented, none hidden.</p>
            </div>
            <div className="ftx-inc">
              <b>Standing-watch status</b>
              <p>A live indicator that the watch never stopped overnight — scouts ran, whether or not anything moved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- who reads it ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Who opens it first</span>
          <h2 className="wt-h2">Two different mornings, same page.</h2>
          <div className="ftx-pair">
            <div className="ftx-paircard">
              <span className="mono">founder / ceo</span>
              <h3>Ten seconds, not a meeting</h3>
              <p>
                What keeps a founder up isn&apos;t missing a detail — it&apos;s being the last to know something
                that shows up in a board meeting first. Overview exists so the state of the market is a glance, not
                an ask to someone on the team to go compile one.
              </p>
              <p>
                The biggest-threat callout is written for exactly this reader: one sentence, evidence underneath it,
                nothing to configure.
              </p>
            </div>
            <div className="ftx-paircard">
              <span className="mono">product marketing</span>
              <h3>The context behind a battlecard update</h3>
              <p>
                A PMM — often a team of one — needs to know not just that something changed, but whether it&apos;s
                the kind of thing sales will ask about this week. Overview is where that judgment call gets made
                before the battlecard even needs opening.
              </p>
              <p>
                Launch Radar in particular saves a PMM from being blindsided by a launch post they should have seen
                coming.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">A morning it actually caught something</span>
          <h2 className="wt-h2">The week Signal Labs stopped hiding its price.</h2>
          <div className="ftx-story">
            <span className="mono">overview · week of aug 3</span>
            <h3>&quot;Signal Labs quietly published Team-tier pricing.&quot;</h3>
            <p>
              For four months, Signal Labs&apos; pricing page routed every visitor to &quot;Talk to sales&quot; for
              anything above their entry tier — no number, no call to skip. On August 6th, the website scout&apos;s
              diff on signal-labs.com/pricing flagged three new lines of copy: a Team tier, a dollar figure, and a
              seat count. Nothing dramatic on its own — pricing pages change.
            </p>
            <p>
              What moved it onto that week&apos;s Overview page was the second signal: the same week, Signal Labs&apos;
              jobs channel showed two new postings tagged &quot;sales development,&quot; the first hiring in that
              function in over ninety days. A pricing page opening up and a sales team growing, in the same seven-day
              window, is a company trying to close the gap between quoted deals and self-serve ones — read together,
              not as two unrelated rows.
            </p>
            <p>
              The Tower wrote it as one line on Overview: &quot;Signal Labs opened Team-tier pricing the same week
              they started hiring SDRs — a self-serve push, not a repricing.&quot; A founder using Fortress HQ saw it
              at first light, three days before it would have surfaced any other way.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> website pricing diff (Aug 6) + 2 job postings tagged &quot;sales development&quot;
              (Aug 8), both linked on the card
            </div>
          </div>
        </div>
      </section>

      {/* ---------- second worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">A rating that moved for a quiet reason</span>
          <h2 className="wt-h2">Kompyte&apos;s Threat Index fell to an 8, and that was the story.</h2>
          <div className="ftx-story">
            <span className="mono">overview · week of jul 20</span>
            <h3>&quot;Kompyte&apos;s rating keeps falling — no independent GTM activity in three months.&quot;</h3>
            <p>
              On July 20th, the ratings panel on Overview showed Kompyte&apos;s Threat Index drop from 34 to 8 in a
              single week — the kind of move that would look alarming on a page that treats every number the same
              way. Opening the card showed why: no independent ad spend for the third straight month, a careers page
              still returning a 404, and zero press mentions since the Semrush acquisition over a year earlier. None
              of that was new that week; the drop reflected a slow bleed the Tower had been tracking for months.
            </p>
            <p>
              What made it worth a line on Overview wasn&apos;t the number itself — it was the direction, against
              the other five competitors on the same watch, all of whom held steady or climbed that week. A single
              rating falling while everything else stays flat is itself a pattern: evidence that one competitor
              specifically had stopped operating as an independent threat, not that the market had gone quiet.
            </p>
            <p>
              The Tower wrote it calmly, no beacon: &quot;Kompyte&apos;s rating keeps falling — down to an 8, no
              independent GTM activity in three months.&quot; A founder reading Overview that morning took it as
              permission to stop spending attention on a competitor that had effectively stopped competing, and put
              it toward the two names that were actually moving.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> Threat Index history (34 → 8, Jul 13–20) + 0 independent ad accounts + careers
              page 404, all linked from the card
            </div>
          </div>
        </div>
      </section>

      {/* ---------- comparison ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="mkt-eyebrow">Versus the alternative</span>
          <h2 style={{ fontSize: 24 }}>A dashboard you read, not one you build.</h2>
          <div className="ftx-vs">
            <span className="mono">how the others do it</span>
            <p>
              Klue and Crayon both give you a dashboard — but you configure the widgets, set the filters, and decide
              what counts as important yourself, usually after a setup call. Overview ships with one fixed shape:
              biggest threat first, everything else calm underneath, no configuration required before it&apos;s
              useful. Kompyte&apos;s equivalent runs on Semrush&apos;s own product priorities, not a purpose-built
              competitive surface. Visualping doesn&apos;t attempt this at all — it tells you a page changed, not
              what it means alongside five other channels.
            </p>
          </div>
          <div className="ftx-cmp">
            <table className="ftx-cmp-table">
              <thead>
                <tr><th>Vendor</th><th>Their opening screen</th><th>Overview</th></tr>
              </thead>
              <tbody>
                <tr>
                  <th>Klue</th>
                  <td>Configurable widgets, set up after a demo call, filters you own and maintain.</td>
                  <td className="us">One fixed shape — biggest threat first — no config, live the day you sign up.</td>
                </tr>
                <tr>
                  <th>Crayon</th>
                  <td>Broad dashboard, similar enterprise setup motion, priced accordingly.</td>
                  <td className="us">Same fixed shape, from $149/mo, no onboarding call required to see it work.</td>
                </tr>
                <tr>
                  <th>Kompyte</th>
                  <td>Now runs inside Semrush&apos;s own dashboard, not a purpose-built CI surface.</td>
                  <td className="us">A dedicated page, built only around the competitors you actually named.</td>
                </tr>
                <tr>
                  <th>Visualping</th>
                  <td>No market-wide dashboard at all — a per-page alert, one competitor, one URL.</td>
                  <td className="us">One page synthesizing all 28 channels across every competitor at once.</td>
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
          <h2 className="wt-h2">Overview, honestly.</h2>
          <div className="ftx-faq">
            <div className="ftx-faq-item">
              <h4>Is Overview just an alert feed with extra styling?</h4>
              <p>
                No — an alert feed forwards raw detections and leaves you to interpret them. Overview is the Tower&apos;s
                read of those detections, bundled per competitor, with a single sentence at the top telling you what
                actually matters this week. The raw signals are still there if you want them, one click down.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>What happens on a quiet week — do I just see a blank page?</h4>
              <p>
                No. A quiet week still shows what every scout found, it&apos;s just that nothing cleared the evidence
                bar for the beacon treatment. &quot;Nothing worth acting on this week&quot; is itself a useful,
                honestly-earned conclusion — not a bug in the product.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>How is the Threat Index actually calculated — can I trust the number?</h4>
              <p>
                It&apos;s never shown as a bare number for exactly that reason. Every Threat Index opens into the
                signals that produced it, so you can check the reasoning yourself instead of trusting a black box.
                If the inputs don&apos;t justify the score to you, that&apos;s worth telling us.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can I get Overview pushed to Slack every morning instead of checking the page?</h4>
              <p>
                Not yet, honestly. Today, Overview is a page you check at first light — reading it takes under a
                minute. Standing orders that push a briefing to Slack, email or a webhook the instant something
                clears the bar are in build, not shipped, and we&apos;d rather say that plainly than pretend it
                already runs.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Does Overview miss things that happen outside the 28 channels?</h4>
              <p>
                Yes, by definition — anything not public, or not on one of the 28 channels, doesn&apos;t exist in the
                product. We&apos;d rather be honest about that boundary than imply broader coverage than we actually
                have. See the full inventory on the data sources page.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Is the Tower&apos;s read on Overview ever wrong?</h4>
              <p>
                It can misjudge significance — that&apos;s a reasoning layer, not an oracle. What it won&apos;t do is
                assert something without a source: every line traces back to a scout&apos;s report you can open and
                check. If a read looks off, the evidence underneath it is exactly where you&apos;d find out why.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Does Overview look different depending on which plan I&apos;m on — Starter versus Growth?</h4>
              <p>
                The page shape is identical on every tier — biggest threat first, ratings, Launch Radar. What
                changes is how many competitors it&apos;s built from: 3 on Starter ($149/mo), 10 on Growth
                ($399/mo). Nobody gets a stripped-down version of the reasoning; they get a smaller market to reason
                over.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>What happens on Overview if a scout can&apos;t reach one of a competitor&apos;s pages that day?</h4>
              <p>
                It&apos;s reported as unreachable in that competitor&apos;s file, not silently dropped. If enough of
                a competitor&apos;s channels went quiet in a given week that the picture is genuinely thin, Overview
                would rather show a shorter, honestly incomplete read than pad it with old data dressed up as
                current.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Is Overview meant to replace a weekly competitive-intel meeting entirely?</h4>
              <p>
                It&apos;s meant to make that meeting shorter and better-informed, not to replace judgment. Overview
                compiles the read; deciding what to do about it — reprice, brief a rep, greenlight a feature — is
                still a human call. That split is Law 1, not a hedge.
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
