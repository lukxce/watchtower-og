import Link from 'next/link';

export const metadata = {
  title: 'Newsletters & Sequences — Fortress HQ',
  description:
    'A persona inbox subscribes to what a competitor sends its own list — pricing changes, feature previews, win-back offers, sales sequences — read the day it lands, cited.',
};

export default function NewslettersFeature() {
  return (
    <div className="ftx">
      {/* ---------- hero ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-over">Feature · Newsletters &amp; sequences</span>
            <span className="kicker">Voice &amp; PR · secret shopper, not scraping</span>
            <h1 className="wt-h1">What they tell their own list, before they tell the market.</h1>
            <p className="wt-dek">
              A persona inbox subscribes to a competitor&apos;s newsletter, product updates and sales sequences the
              same way any prospect would — because the mail is addressed to us, nothing here is scraped. It catches
              what a public page structurally can&apos;t: the price change announced to subscribers first, the
              feature preview sent before the changelog entry exists, the win-back offer that only goes out once
              someone tries to churn.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo →</Link>
            </div>
            <p className="wt-note">From $149/mo · no card required</p>
          </div>

          <div className="ftx-art">
            <div className="wt-panel" aria-label="A mocked newsletter capture">
              <div className="wt-panel-head">
                <span className="mono">inbox · watch+acme@fortresshq.com</span>
                <span className="wt-live"><i />live</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.1s' }}>
                <span className="wt-row-t mono">newsletters</span>
                <span className="wt-row-x">&quot;A quick price update for our current customers&quot; — Kompyte</span>
                <span className="wt-row-g mono">voice &amp; pr</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.22s' }}>
                <span className="wt-row-t mono">newsletters</span>
                <span className="wt-row-x">Product update: &quot;here&apos;s what we&apos;re shipping next month&quot;</span>
                <span className="wt-row-g mono">voice &amp; pr</span>
              </div>
              <div className="ftx-readout">
                <span className="mono">the tower</span>
                <b>Kompyte raised Team-tier pricing 12% for existing customers, three weeks before the public page moved.</b>
                <p>Sent only to their own list. The public pricing page still showed the old number when this arrived.</p>
              </div>
              <div className="ftx-know">
                <b>How we know:</b> subscriber email, Aug 6, sender verified against Kompyte&apos;s domain
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- mechanism ---------- */}
      <section className="mkt-section tight ftx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">How it works</span>
          <h2 className="wt-h2">One inbox, subscribed like any other prospect.</h2>
          <p className="wt-lede">
            This is not scraping and it is not a leaked source — it is secret shopping, which is how competitive
            research has always worked. The mail is sent to an address we hold, because we signed up the same way
            anyone on the market would.
          </p>
          <div className="ftx-steps">
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">one shared address</span>
                <h4>watch+&lt;org&gt;@fortresshq.com, no per-tenant setup</h4>
                <p>
                  There is one persona inbox, not one per customer. It subscribes directly to a competitor&apos;s own
                  newsletter or product-update list, or a customer forwards a sales sequence they received — either
                  way, nothing needs to be wired per workspace. Plus-addressing carries the workspace in the
                  recipient itself, so the mail already knows where it belongs.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">sender, verified</span>
                <h4>Matched against the competitors you actually track</h4>
                <p>
                  Every inbound email is checked against the sending domain of the competitors on your watch. A
                  match ingests as a signal on that competitor&apos;s file. Mail from a company you don&apos;t track
                  isn&apos;t an error — the persona inbox receives plenty of unrelated post, and Law 3 means an
                  unmatched sender gets disclosed as unmatched, not silently binned or falsely flagged.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">ingested, cited</span>
                <h4>Subject, sender and preview, stored against the record</h4>
                <p>
                  A matched email becomes a signal with its subject line, sender domain and a preview of the body,
                  timestamped to when it arrived. The Tower can read it the same way it reads any other channel —
                  as a fact with a source attached, never as an unsourced paraphrase of &quot;a competitor said
                  something.&quot;
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">read against everything else</span>
                <h4>One more channel the Tower corroborates, not a silo</h4>
                <p>
                  A newsletter line rarely stands alone. A subscriber-only price cut read next to a hiring pause, or
                  a feature preview read next to a subdomain buildout, is where the channel earns the beacon — the
                  same evidence-bar reasoning every other channel goes through, applied to mail nobody else is
                  reading for you.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">honest on a quiet week</span>
                <h4>Zero emails in 48 hours is a real, reported state</h4>
                <p>
                  The channel reports how many emails arrived recently, plainly. A quiet week means the competitor
                  hasn&apos;t sent much, not that the channel is broken — and it says so instead of padding the
                  coverage map to look busier than the inbox actually is.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what's included ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">What&apos;s in the channel</span>
          <h2 className="wt-h2">What a subscribed inbox actually gets you.</h2>
          <div className="ftx-included">
            <div className="ftx-inc">
              <b>One shared persona inbox</b>
              <p>watch+&lt;org&gt;@fortresshq.com — no separate mailbox to create or maintain per workspace.</p>
            </div>
            <div className="ftx-inc">
              <b>Direct subscription or forwarding</b>
              <p>The inbox subscribes to a competitor&apos;s list directly, or a customer forwards a sequence they personally received.</p>
            </div>
            <div className="ftx-inc">
              <b>Sender-domain verification</b>
              <p>Every inbound email is matched against a tracked competitor&apos;s domain before it&apos;s attributed to their file.</p>
            </div>
            <div className="ftx-inc">
              <b>Disclosed, not discarded, mismatches</b>
              <p>Mail from an untracked sender is recorded as unmatched rather than silently dropped or wrongly attributed.</p>
            </div>
            <div className="ftx-inc">
              <b>Subject, sender &amp; preview stored</b>
              <p>Each captured email keeps its subject line, sending domain and a body preview against the timestamp it arrived.</p>
            </div>
            <div className="ftx-inc">
              <b>Fed into first light &amp; relief</b>
              <p>A newsletter signal that clears the evidence bar reads into the same morning briefing and weekly digest as every other channel.</p>
            </div>
            <div className="ftx-inc">
              <b>Runs on every tier</b>
              <p>Not a licensed-vendor channel gated to Growth and up — it runs the same on Starter through Enterprise.</p>
            </div>
            <div className="ftx-inc">
              <b>Channel-health reporting</b>
              <p>The coverage map shows recent email volume honestly, including a quiet stretch with nothing new to report.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">A price change the public page hadn&apos;t caught up to</span>
          <h2 className="wt-h2">Kompyte told its list before it told its pricing page.</h2>
          <div className="ftx-story">
            <span className="mono">newsletters · kompyte · voice &amp; pr</span>
            <h3>&quot;A quick price update for our current customers.&quot;</h3>
            <p>
              On August 6th, the persona inbox received an email from Kompyte&apos;s billing address — subject line
              &quot;A quick price update for our current customers&quot; — announcing a 12% increase on their Team
              tier, effective the following billing cycle. It was addressed to existing subscribers only, the kind
              of mail that never appears on a public changelog.
            </p>
            <p>
              The website channel, which diffs Kompyte&apos;s pricing page on its normal schedule, still showed the
              old number three weeks later. Two channels, read together, told a more complete story than either
              alone: the price was already moving for the people paying it, well before it moved for anyone
              evaluating the product cold.
            </p>
            <p>
              The Tower wrote it as: &quot;Kompyte raised Team-tier pricing 12% for existing customers, three weeks
              before the public page moved.&quot; A sales rep working against Kompyte used it to time a proposal
              before the increase became public knowledge, rather than after.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> subscriber email (Aug 6, sender verified against Kompyte&apos;s domain) + website
              pricing diff (unchanged as of Aug 27), both linked
            </div>
          </div>
        </div>
      </section>

      {/* ---------- second worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">A sequence that named the objection before a rep found it</span>
          <h2 className="wt-h2">Signal Labs&apos; win-back offer said more than the offer itself.</h2>
          <div className="ftx-story">
            <span className="mono">newsletters · signal labs · voice &amp; pr</span>
            <h3>&quot;We&apos;d love to have you back — 30% off your first quarter.&quot;</h3>
            <p>
              A customer who had trialed and then dropped Signal Labs forwarded a re-engagement sequence to the
              persona inbox in mid-July — three emails over eight days, escalating from a feature-update note to a
              direct 30%-off win-back offer by the third message. Read as marketing copy, it&apos;s a normal
              re-engagement play. Read as a signal, a discount that steep, that fast, on a lapsed trial is a fact
              about how hard Signal Labs is fighting to hold its funnel.
            </p>
            <p>
              What made it worth noting rather than routine was the timing against the jobs channel: Signal Labs had
              posted two new SDR roles the same month, meaning they were simultaneously spending on new pipeline and
              discounting to save people already leaving it — not necessarily contradictory, but a fact about
              funnel pressure worth having on file.
            </p>
            <p>
              The Tower surfaced it plainly: &quot;Signal Labs is offering a 30% win-back discount to a lapsed trial
              — worth knowing, not proof of broader churn on its own.&quot; A sales rep working a live evaluation
              against Signal Labs used the discount pattern as context for how much room a prospect might actually
              have to negotiate.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> 3-email win-back sequence forwarded by a lapsed trial user (Jul 12–20) + 2 new SDR
              postings the same month (jobs channel), both linked
            </div>
          </div>
        </div>
      </section>

      {/* ---------- comparison ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="mkt-eyebrow">Versus the alternative</span>
          <h2 style={{ fontSize: 24 }}>Not something we&apos;ve seen listed as a category elsewhere.</h2>
          <div className="ftx-vs">
            <span className="mono">how the others do it</span>
            <p>
              IndustryLens publishes its own breakdown of buyer-intelligence categories — Review Platforms, Job
              Boards, News &amp; PR, Social, Ads Intelligence, Pricing/Product, Analyst/Aggregator — and newsletters
              isn&apos;t one of them. That&apos;s not a claim that no competitor anywhere has this; we can&apos;t
              verify that. It&apos;s simply not a category we&apos;ve seen named elsewhere, and it captures things
              the other seven structurally can&apos;t: mail sent only to people already on a list.
            </p>
          </div>
          <div className="ftx-cmp">
            <table className="ftx-cmp-table">
              <thead>
                <tr><th>Approach</th><th>What it can actually see</th><th>Fortress HQ</th></tr>
              </thead>
              <tbody>
                <tr>
                  <th>Klue / Crayon</th>
                  <td>Public-facing detections — site, ads, reviews, news. Nothing addressed only to a subscriber list.</td>
                  <td className="us">A persona inbox subscribes like a real prospect, so subscriber-only mail becomes a citable signal.</td>
                </tr>
                <tr>
                  <th>Visualping</th>
                  <td>Diffs public pages on a schedule. A page that never changes publicly never shows anything.</td>
                  <td className="us">Reads what was sent privately to a list, independent of whether the public page ever moves.</td>
                </tr>
                <tr>
                  <th>Manually forwarding to a teammate</th>
                  <td>Works, but relies on someone remembering to forward, and nothing is searchable afterward.</td>
                  <td className="us">One address, permanently subscribed, ingested and cited automatically the moment it lands.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ---------- today vs next ---------- */}
      <section className="mkt-section tight">
        <div className="wrap mkt-2col">
          <div>
            <span className="mkt-eyebrow">Today</span>
            <h2 style={{ fontSize: 24 }}>It lands in the feed and the daily order.</h2>
            <p className="lede">
              A matched email becomes a real, cited signal the moment it&apos;s ingested — visible in the feed, and
              folded into first light or relief if it clears the evidence bar. What it is today is something you
              read inside Fortress HQ, not something that pushes to you the instant it arrives.
            </p>
          </div>
          <div>
            <span className="mkt-eyebrow">Next</span>
            <h2 style={{ fontSize: 24 }}>Standing orders — in build.</h2>
            <p className="lede">
              A standing order that pushes a newsletter capture to Slack or email the moment it&apos;s matched, and
              an export built specifically for newsletter signals, are both in build, not shipped. We&apos;d rather
              say you check the feed today than describe a push notification that doesn&apos;t exist yet.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- who reads it ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Two readers, two different reasons to care</span>
          <h2 className="wt-h2">A rep wants the offer. A PMM wants the roadmap tell.</h2>
          <div className="ftx-pair">
            <div className="ftx-paircard">
              <span className="mono">sales rep</span>
              <h3>What they&apos;re telling their own funnel</h3>
              <p>
                A win-back discount, a renewal nudge, a &quot;we miss you&quot; sequence — these tell a rep exactly
                how hard a competitor is fighting to keep or win back specific accounts, which is a different
                signal than anything on a public page.
              </p>
              <p>Useful the same way a forwarded email always was, minus the part where someone has to remember to forward it.</p>
            </div>
            <div className="ftx-paircard">
              <span className="mono">product marketing</span>
              <h3>What they&apos;re building before the changelog says so</h3>
              <p>
                Feature previews and &quot;here&apos;s what&apos;s coming&quot; notes often go to a mailing list
                weeks before a public changelog entry exists — early enough to update a battlecard before a rep gets
                caught flat-footed on a call.
              </p>
              <p>The lead time is the value: knowing before the announcement, not after.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Questions</span>
          <h2 className="wt-h2">Newsletters &amp; sequences, honestly.</h2>
          <div className="ftx-faq">
            <div className="ftx-faq-item">
              <h4>Is this scraping a competitor&apos;s private mail?</h4>
              <p>
                No. Nothing is scraped, and nothing is intercepted. A persona inbox subscribes to a competitor&apos;s
                own newsletter or product-update list the same way any prospect would, and the mail is addressed to
                us. This is secret shopping — a research method that predates software by decades — not a breach of
                anyone&apos;s systems.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Do I need to set anything up per competitor?</h4>
              <p>
                No. There&apos;s one shared inbox address, watch+&lt;org&gt;@fortresshq.com, and no per-tenant
                configuration. The inbox subscribes directly, or you forward a sequence you personally received —
                either way nothing needs wiring on your side.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>What if an email arrives from a company I don&apos;t track?</h4>
              <p>
                It&apos;s recorded as unmatched, not discarded and not falsely attributed. The persona inbox
                receives plenty of unrelated mail; Law 3 means we disclose what didn&apos;t match rather than
                quietly dropping it or guessing at a competitor it might belong to.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Is this a Growth- or Enterprise-only channel?</h4>
              <p>
                No — it isn&apos;t one of the licensed-vendor channels (reviews, LinkedIn) that Growth and Enterprise
                unlock. It runs the same on Starter as on every other tier.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Do you notify me the moment an email arrives?</h4>
              <p>
                Not yet — today it lands in the feed and, if it clears the evidence bar, that morning&apos;s
                briefing or the weekly relief digest. Push delivery of a standing order the instant something is
                matched is in build, not shipped.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>What if a competitor never emails their list — is the channel just empty?</h4>
              <p>
                Then it reports that plainly: zero emails in the last 48 hours, an honest quiet channel rather than
                a padded one. Some competitors run active nurture sequences and some barely email at all — the
                coverage map reflects whichever is actually true.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can I forward a sales sequence I personally received?</h4>
              <p>
                Yes — forwarding to the persona inbox works the same as the inbox subscribing directly. Either path
                ends with the email verified against the sender&apos;s domain and ingested the same way.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>How is this different from the website or sitemap channel?</h4>
              <p>
                Those diff what&apos;s publicly published. This channel reads what&apos;s sent only to people
                already on a list — a price change, a feature preview or a win-back offer that may never appear on
                a public page at all, or not for weeks.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Does anyone else offer this as a named category?</h4>
              <p>
                We can&apos;t claim nobody does — that&apos;s not verifiable. What we can say is that IndustryLens&apos;s
                own published breakdown of buyer-intelligence categories doesn&apos;t list it, and it isn&apos;t a
                category we&apos;ve seen named elsewhere either.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className="ftx-relate">
        <div className="wrap">
          <span className="mkt-eyebrow">Keep going</span>
          <h2 style={{ fontSize: 22, margin: '0 0 4px' }}>See the rest of what feeds the watch.</h2>
          <div className="ftx-relate-row">
            <Link href="/features/data-sources">All 28 channels →</Link>
            <Link href="/features/displacement-outbound">Displacement &amp; outbound →</Link>
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
