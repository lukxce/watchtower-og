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

      {/* ---------- how it works, in more detail ---------- */}
      <section className="mkt-section tight ftx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">The same flow, in five steps</span>
          <h2 className="wt-h2">From a raw fact to a cited conclusion.</h2>
          <p className="wt-lede">
            The three-step flow above is the shape. This is what actually happens to a single fact between a scout
            finding it and it reaching you.
          </p>
          <div className="ftx-steps">
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">a fact is found</span>
                <h4>A scout reports, with a source attached</h4>
                <p>
                  A hostname on a certificate-transparency log, a job post, a review, an ad. The scout reports it
                  exactly as found, with a link back to where it came from — nothing is interpreted or embellished at
                  this stage.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">filed and disambiguated</span>
                <h4>It gets tagged against the right competitor</h4>
                <p>
                  A brand-name mention gets classified before it goes anywhere — is this the client, a different
                  company with the same name, or noise like a song or a band? Only a genuine match gets filed against
                  a competitor at all.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">pulled together</span>
                <h4>At read time, every fact on file gets pulled in one pass</h4>
                <p>
                  When the Tower reads a competitor, it isn&apos;t reading one channel — it pulls everything filed
                  against them across all six channel groups, so a hostname and a hiring cluster from completely
                  different scouts end up in the same view.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">corroboration is checked</span>
                <h4>Independent signal types are weighed against each other</h4>
                <p>
                  One fact rarely earns a conclusion on its own. The Tower checks whether separate, independent
                  signals actually point the same direction — a hostname and a hiring cluster and a report mention,
                  not the same fact restated three ways.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">written and cited</span>
                <h4>One sentence goes out, with its receipts underneath</h4>
                <p>
                  The conclusion gets written in plain language, and every fact that fed it stays attached as a
                  how-we-know line. If the evidence doesn&apos;t clear the bar, no conclusion gets written at all —
                  the gap gets reported instead.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what's included ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">What the reasoning layer actually does</span>
          <h2 className="wt-h2">Nine things the Tower does before you see a sentence.</h2>
          <div className="ftx-included">
            <div className="ftx-inc">
              <b>Fact ingestion</b>
              <p>Every scout report lands as a discrete, sourced fact — never pre-interpreted before it reaches the Tower.</p>
            </div>
            <div className="ftx-inc">
              <b>Name disambiguation</b>
              <p>Every brand-name match is classified as the client, a different entity, or noise, before it counts as a mention.</p>
            </div>
            <div className="ftx-inc">
              <b>Cross-channel filing</b>
              <p>Facts from all six channel groups get filed against the same competitor record, not siloed by source.</p>
            </div>
            <div className="ftx-inc">
              <b>Corroboration checking</b>
              <p>Independent signal types are weighed against each other before a conclusion is written, not just counted.</p>
            </div>
            <div className="ftx-inc">
              <b>Plain-language synthesis</b>
              <p>Findings become one sentence a Watch Commander can act on, not a dump of raw detections to interpret.</p>
            </div>
            <div className="ftx-inc">
              <b>How-we-know citation</b>
              <p>Every conclusion keeps its source list attached and visible, never buried behind a &quot;details&quot; click.</p>
            </div>
            <div className="ftx-inc">
              <b>Evidence-bar gatekeeping</b>
              <p>If the facts don&apos;t corroborate, no conclusion gets written — an honest gap, not a padded guess.</p>
            </div>
            <div className="ftx-inc">
              <b>Beacon assignment</b>
              <p>Only conclusions that clear the bar get the highlighter — most reads stay in the calm, ordinary type.</p>
            </div>
            <div className="ftx-inc">
              <b>Positioning-aware framing</b>
              <p>On a battlecard, the same fact gets weighed against your own pricing and claims before it&apos;s written.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Where corroboration changed the read</span>
          <h2 className="wt-h2">Visualping&apos;s price cut wasn&apos;t what it looked like alone.</h2>
          <div className="ftx-story">
            <span className="mono">insights · visualping · read, not a guess</span>
            <h3>&quot;A defensive cut, not a repositioning.&quot;</h3>
            <p>
              In mid-July, the website scout flagged a straightforward fact: Visualping had dropped its Team-tier
              price 18%, no announcement, quietly edited on the pricing page. Read alone — the way a single
              page-change monitor would report it — that&apos;s just &quot;price changed.&quot; Interpreting it as
              strategy or panic would be a guess dressed up as insight.
            </p>
            <p>
              The Tower checked two other channels before writing anything. The funding channel showed no new
              round in over twenty months — a long gap for a company at that stage. The jobs channel showed zero
              net-new sales postings across the same period, meaning the price cut wasn&apos;t being paired with a
              go-to-market push to backfill the lost margin.
            </p>
            <p>
              Together, the Tower wrote: &quot;Visualping&apos;s price cut looks defensive, not strategic — no
              funding to burn on a self-serve land-grab, and no sales hiring to support a bigger push.&quot; A
              single-channel monitor would have reported the price change and stopped there, leaving the actual
              interpretation to whoever read it.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> pricing-page diff (Jul 16) + funding channel (no raise in 20 months) + jobs
              channel (0 net-new sales postings, trailing 90 days), all linked
            </div>
          </div>
        </div>
      </section>

      {/* ---------- comparison ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="mkt-eyebrow">Versus the alternative</span>
          <h2 style={{ fontSize: 24 }}>A cited source, not a confidence score.</h2>
          <div className="ftx-vs">
            <span className="mono">how the others do it</span>
            <p>
              Crayon reports at roughly the same coverage class, at a much higher price, and tends to hand back a
              confidence score rather than the source behind it. Kompyte&apos;s reasoning now runs on Semrush&apos;s
              roadmap rather than as an independent product&apos;s own priority. Fortress HQ&apos;s wedge inside the
              category is specifically this: every claim cites a source instead of a bare confidence number — that
              is enforced in code, not just written on this page.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Questions</span>
          <h2 className="wt-h2">The Tower, honestly.</h2>
          <div className="ftx-faq">
            <div className="ftx-faq-item">
              <h4>Is this AI making things up?</h4>
              <p>
                It shouldn&apos;t, and it&apos;s built specifically not to: the reasoning layer is grounded in
                retrieved, cited facts, not free-generated from a model&apos;s general knowledge. If a claim can&apos;t
                be traced to a scout&apos;s report, it doesn&apos;t get written — that&apos;s Law 3, enforced, not a
                promise on a page.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>How many corroborating signals does it actually take before something gets written?</h4>
              <p>
                There&apos;s no fixed magic number published, on purpose — it&apos;s a judgment about whether
                independent signal types genuinely agree, not a threshold you could game by manufacturing three weak
                signals. What&apos;s consistent is that a single, uncorroborated fact doesn&apos;t clear the bar
                alone.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can the name-disambiguation step get it wrong?</h4>
              <p>
                It&apos;s a classification, not a certainty — genuinely ambiguous cases can be missed or
                over-included. What it won&apos;t do is silently treat every keyword hit as a real mention; when
                there&apos;s nothing to disambiguate against, the product says that rather than guessing.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can I see the raw scout reports myself, not just the Tower&apos;s conclusion?</h4>
              <p>
                Yes — the how-we-know line under every conclusion links back to the underlying facts. The conclusion
                is never the only thing available; the receipts are always one click away.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>How is this different from just asking a general AI chatbot to summarize a competitor?</h4>
              <p>
                A general chatbot answers from whatever it already knows, which can be stale or invented. The Tower
                only reasons over what your scouts actually collected today, from real public sources, with each
                fact&apos;s origin attached — the difference is the grounding, not the underlying model.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Does the Tower ever reach behind a login or paywall to build its read?</h4>
              <p>
                No. Every fact it reasons over came from a public channel — the same boundary the scouts themselves
                are built around. If a page can&apos;t be reached publicly, it&apos;s reported as unreachable, not
                worked around.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- who relies on the read ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Two readers, same conclusion</span>
          <h2 className="wt-h2">Product wants the early tell. Marketing wants the gap.</h2>
          <div className="ftx-pair">
            <div className="ftx-paircard">
              <span className="mono">product</span>
              <h3>Hearing about the roadmap before the launch post</h3>
              <p>
                Discovering a competitor shipped the thing on your own roadmap, from a launch post, is the specific
                fear this reasoning layer targets. Corroborated buildout signals — hostnames, hiring clusters — are
                exactly the read a product team needs weeks earlier.
              </p>
              <p>The Tower&apos;s job is finding where independent signals agree before either one alone would justify a conclusion.</p>
            </div>
            <div className="ftx-paircard">
              <span className="mono">product marketing</span>
              <h3>The gap between the pitch and the page</h3>
              <p>
                A PMM&apos;s hardest question is usually &quot;what&apos;s actually true about them, versus what
                they say about themselves.&quot; Reading pricing, ads and reviews together, cited, is precisely how
                that gap gets found instead of guessed at.
              </p>
              <p>It&apos;s also why every conclusion keeps its receipts — a PMM needs to defend the claim to sales.</p>
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
