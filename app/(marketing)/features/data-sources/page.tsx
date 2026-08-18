import Link from 'next/link';

export const metadata = {
  title: 'Data Sources — Fortress HQ',
  description:
    'The full inventory: 28 public channels across Product, GTM & ads, Talent, Voice & PR, Reputation and Market, watched continuously.',
};

export default function DataSourcesFeature() {
  return (
    <div className="ftx">
      {/* ---------- hero ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-over">Feature · Data sources</span>
            <span className="kicker">28 public channels · always on</span>
            <h1 className="wt-h1">Every channel we watch, named.</h1>
            <p className="wt-dek">
              Fortress HQ tracks competitors across 28 public channels, grouped into six areas of a business. Nothing
              private, nothing scraped from behind a login, nothing implied. Here is the honest inventory — not a
              feature list, an actual accounting of where the scouts go.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo →</Link>
            </div>
            <p className="wt-note">From $79/mo · no card required</p>
          </div>

          <div className="ftx-art">
            <div className="wt-panel" aria-label="A mocked scout status list">
              <div className="wt-panel-head">
                <span className="mono">scouts · deployed</span>
                <span className="wt-live"><i />live</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.1s' }}>
                <span className="wt-row-t mono">product</span>
                <span className="wt-row-x">Sitemap diff on 6 competitors · last run 04:40</span>
                <span className="wt-row-g mono">ok</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.22s' }}>
                <span className="wt-row-t mono">gtm</span>
                <span className="wt-row-x">Ad library check, 3 networks · last run 05:10</span>
                <span className="wt-row-g mono">ok</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.34s' }}>
                <span className="wt-row-t mono">reputation</span>
                <span className="wt-row-x">G2 + Trustpilot pulled · 2 new reviews found</span>
                <span className="wt-row-g mono">ok</span>
              </div>
              <div className="wt-row" style={{ animationDelay: '0.46s' }}>
                <span className="wt-row-t mono">voice &amp; pr</span>
                <span className="wt-row-x">Secret-shopper inbox: 1 newsletter received</span>
                <span className="wt-row-g mono">ok</span>
              </div>
              <div className="ftx-know">
                <b>How we know:</b> every row above is a scout&apos;s own report — a fact with a source
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- the inventory ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">The inventory</span>
          <h2 className="wt-h2">28 channels, six groups, watched daily.</h2>
          <p className="wt-lede">
            This is the actual list. If a channel isn&apos;t here, we don&apos;t watch it — and we&apos;d rather say
            that plainly than imply more than the product does.
          </p>

          <div className="ftx-channels">
            <div className="ftx-group">
              <div className="ftx-group-h"><b>Product</b><span>always-on</span></div>
              <ul className="ftx-chanlist">
                <li>Website &amp; pricing pages</li>
                <li>Sitemap diff</li>
                <li>iOS &amp; Android release tracking</li>
                <li>Subdomain &amp; certificate-transparency watch</li>
                <li>Tech stack detection</li>
              </ul>
            </div>
            <div className="ftx-group">
              <div className="ftx-group-h"><b>GTM &amp; ads</b><span>always-on</span></div>
              <ul className="ftx-chanlist">
                <li>Meta ad library</li>
                <li>Google ad library</li>
                <li>LinkedIn ad library</li>
                <li>Events &amp; webinar pages</li>
                <li>Customer-logo walls</li>
              </ul>
            </div>
            <div className="ftx-group">
              <div className="ftx-group-h"><b>Talent</b><span>always-on</span></div>
              <ul className="ftx-chanlist">
                <li>Job postings</li>
                <li>Glassdoor sentiment</li>
              </ul>
            </div>
            <div className="ftx-group">
              <div className="ftx-group-h"><b>Voice &amp; PR</b><span>always-on</span></div>
              <ul className="ftx-chanlist">
                <li>News</li>
                <li>YouTube</li>
                <li>Podcasts</li>
                <li>Reddit</li>
                <li>Product Hunt</li>
                <li>LinkedIn company posts</li>
                <li>Newsletters, via a secret-shopper inbox</li>
              </ul>
            </div>
            <div className="ftx-group">
              <div className="ftx-group-h"><b>Reputation</b><span>always-on</span></div>
              <ul className="ftx-chanlist">
                <li>Trustpilot</li>
                <li>G2</li>
                <li>Capterra</li>
                <li>TrustRadius</li>
                <li>Gartner Peer Insights</li>
              </ul>
            </div>
            <div className="ftx-group">
              <div className="ftx-group-h"><b>Market</b><span>always-on</span></div>
              <ul className="ftx-chanlist">
                <li>SEO &amp; organic traffic estimates</li>
                <li>Google Trends search interest</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- mechanism ---------- */}
      <section className="mkt-section tight ftx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">How it works</span>
          <h2 className="wt-h2">Coverage that says what it doesn&apos;t know, too.</h2>
          <p className="wt-lede">
            A channel isn&apos;t a checkbox on a marketing page — it&apos;s a real collector, running on a schedule,
            reporting honestly. Here is what actually happens between a scout going out and a signal landing in your
            feed.
          </p>
          <div className="ftx-steps">
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">public only</span>
                <h4>The scout goes to a public place</h4>
                <p>
                  A pricing page, an ad library, a job board, a certificate-transparency log, a review site. Nothing
                  behind a login, nothing that requires impersonating a user — every channel reads what anyone could
                  read, it just does it every day instead of once.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">status is computed, not claimed</span>
                <h4>Coverage reflects what&apos;s actually wired up</h4>
                <p>
                  A channel&apos;s status — active, needs a free key, needs an account, or runs on a paid vendor — is
                  computed at runtime from which credentials are actually present, not hand-set on a marketing page.
                  The coverage map you see is always the coverage you&apos;re actually getting.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">self-deferring</span>
                <h4>A blocked channel is a safe no-op, not a silent failure</h4>
                <p>
                  If a channel needs a credential we don&apos;t have yet — Reddit&apos;s OAuth app, an Apify token for
                  the review-platform actor — it defers itself cleanly and says so, instead of erroring out or
                  quietly skipping a competitor without telling you.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">read together</span>
                <h4>One channel is a fact, not a story</h4>
                <p>
                  A single ad, a single job post, a single review — none of them mean much alone. The value shows up
                  when the Tower reads them against each other, per competitor, across all six channel groups at
                  once.
                </p>
              </div>
            </div>
            <div className="ftx-step">
              <div className="ftx-step-n" />
              <div className="ftx-step-body">
                <span className="mono">honest gaps</span>
                <h4>If a page can&apos;t be reached, we say so</h4>
                <p>
                  A channel that returns nothing gets reported as nothing found, not silently skipped. Coverage you
                  can trust includes knowing exactly where it stops — that disclosure is treated as part of the
                  product, not an embarrassment to hide.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what's included: how coverage actually behaves ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">What coverage actually means</span>
          <h2 className="wt-h2">Not a channel count. A set of guarantees.</h2>
          <p className="wt-lede">
            &quot;28 channels&quot; is a headline number. This is what it actually buys you, operationally.
          </p>
          <div className="ftx-included">
            <div className="ftx-inc">
              <b>Real collector code, per channel</b>
              <p>Every channel on the list runs its own working collector today — none of them are placeholders waiting to be built.</p>
            </div>
            <div className="ftx-inc">
              <b>Four honest status states</b>
              <p>Active, needs a free key, needs a free account, or runs on a paid vendor — every channel is labeled exactly as it is.</p>
            </div>
            <div className="ftx-inc">
              <b>Free-tier channels stay free</b>
              <p>Meta ads, Reddit, Product Hunt and news can all reach &quot;active&quot; on a free developer key you set yourself — no upsell required.</p>
            </div>
            <div className="ftx-inc">
              <b>Licensed-vendor channels, disclosed</b>
              <p>G2, Capterra, TrustRadius, Gartner Peer Insights, LinkedIn posts and Glassdoor run on a licensed data vendor, priced and labeled as such.</p>
            </div>
            <div className="ftx-inc">
              <b>Keyless channels, on by default</b>
              <p>Website &amp; pricing, sitemap diff, app-store releases, subdomain watch, tech stack, Google &amp; LinkedIn ads, jobs, YouTube, podcasts and SEC funding data all run with zero setup.</p>
            </div>
            <div className="ftx-inc">
              <b>Six channel groups, one watch</b>
              <p>Product, GTM &amp; ads, Talent, Voice &amp; PR, Reputation and Market — every function of a competitor&apos;s business gets a channel, not just their marketing.</p>
            </div>
            <div className="ftx-inc">
              <b>A secret-shopper inbox for newsletters</b>
              <p>A persona inbox subscribes to competitors&apos; email sequences directly, so newsletter and lifecycle messaging becomes a channel too, not a blind spot.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- law 3, applied to channel honesty ---------- */}
      <section className="mkt-section tight">
        <div className="wrap mkt-2col">
          <div>
            <span className="mkt-eyebrow">Law 3 · in practice</span>
            <h2 style={{ fontSize: 24 }}>No false fires — including about ourselves.</h2>
            <p className="lede">
              A vendor-gated channel that isn&apos;t configured shows as &quot;needs a key,&quot; not as silently
              missing rows. We&apos;d rather show an honest gap in the coverage map than imply a channel is watching
              when it isn&apos;t.
            </p>
          </div>
          <div>
            <span className="mkt-eyebrow">Why this is unusual</span>
            <h2 style={{ fontSize: 24 }}>Most tools don&apos;t show you their own gaps</h2>
            <p className="lede">
              A dashboard that never says &quot;we couldn&apos;t reach this&quot; is either watching less than it
              claims, or hiding when it fails. The coverage map here is built to be checked, not just trusted —
              because trust that can&apos;t be checked isn&apos;t really trust.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">What breadth actually catches</span>
          <h2 className="wt-h2">The Meta ad account a page-diff tool would never see.</h2>
          <div className="ftx-story">
            <span className="mono">data sources · GTM &amp; ads + product</span>
            <h3>&quot;Visualping would have shown nothing that week.&quot;</h3>
            <p>
              A page-change monitor watches one thing: the page you point it at. In mid-July, a Fortress HQ customer
              had Visualping running on a rival&apos;s pricing page for eighteen months — reliable, cheap, and that
              week it reported no change. Nothing moved on the page. By that tool&apos;s only channel, it was a
              quiet month.
            </p>
            <p>
              Fortress HQ&apos;s Meta ads scout, checking the same competitor&apos;s public Ad Library entry on its
              normal schedule, found something the pricing page never would: fourteen new ad creatives launched in
              nine days, every one of them driving to a landing page announcing a free-tier removal — a pricing
              change communicated through paid media before the pricing page itself was touched.
            </p>
            <p>
              Read alongside the sitemap scout, which had flagged a new <code>/pricing-faq</code> page two days
              earlier, the Tower wrote it as one line: &quot;They&apos;re retiring the free tier — announced in ads
              and a support FAQ, before the pricing page moved.&quot; A single-channel tool watching the one page
              everyone expects to change would have caught this three weeks later, when the page finally updated.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> Meta Ad Library (14 new creatives, Jul 12–21) + sitemap diff (<code>/pricing-faq</code>,
              Jul 10), both linked on the card
            </div>
          </div>
        </div>
      </section>

      {/* ---------- second worked example ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">What two unrelated channels caught together</span>
          <h2 className="wt-h2">Signal Labs&apos; hiring freeze, seen from Talent and Reputation.</h2>
          <div className="ftx-story">
            <span className="mono">data sources · talent + reputation</span>
            <h3>&quot;Paused hiring, and sentiment turning toward restructuring.&quot;</h3>
            <p>
              In early August, the jobs channel logged something quiet: Signal Labs had zero net-new postings across
              all functions for the sixth straight week, after averaging four to six a month most of the year. A
              hiring lull alone isn&apos;t a story — companies pause hiring for ordinary reasons, and one channel
              reporting silence proves nothing by itself.
            </p>
            <p>
              The Glassdoor sentiment channel, watched independently under Talent, told a different piece of the
              same period: three new reviews in those six weeks, each mentioning &quot;restructuring&quot; or
              &quot;uncertainty,&quot; a sharp shift from the mostly neutral reviews in the prior two quarters.
              Neither the jobs freeze nor the sentiment dip would have justified a line on its own.
            </p>
            <p>
              Read together across two channel groups the Tower doesn&apos;t usually pair, the conclusion became
              specific: &quot;Signal Labs has paused hiring for six weeks while internal sentiment turned toward
              restructuring — worth watching before assuming it&apos;s just a quiet quarter.&quot; A sales lead
              using Fortress HQ treated it as a reason to check in on a stalled deal rather than assume the silence
              was routine.
            </p>
            <div className="ftx-know">
              <b>How we know:</b> jobs channel (0 postings, 6 weeks) + 3 Glassdoor reviews mentioning
              &quot;restructuring&quot;/&quot;uncertainty&quot; (Jul 8–Aug 15), both linked
            </div>
          </div>
        </div>
      </section>

      {/* ---------- what could go wrong ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Honest limits</span>
          <h2 className="wt-h2">What could go wrong with coverage, and how it&apos;s handled.</h2>
          <div className="ftx-risk-grid">
            <div className="ftx-risk">
              <div className="ftx-risk-what">
                <span className="mono">unconfigured paid channel</span>
                <p>A licensed-vendor channel — G2, Capterra, TrustRadius, Gartner Peer Insights, Glassdoor, LinkedIn posts — isn&apos;t configured on your account yet.</p>
              </div>
              <div className="ftx-risk-how">
                <span className="mono">how we handle it</span>
                <p>It shows &quot;needs a key&quot; in the coverage map, not a silently missing row. The rest of the 28 channels keep running regardless.</p>
              </div>
            </div>
            <div className="ftx-risk">
              <div className="ftx-risk-what">
                <span className="mono">missing free-tier key</span>
                <p>A free channel — Meta ads, Reddit, Product Hunt, news — needs a developer key you haven&apos;t set yourself yet.</p>
              </div>
              <div className="ftx-risk-how">
                <span className="mono">how we handle it</span>
                <p>It self-defers cleanly and reports its own status honestly instead of erroring or quietly skipping a competitor — setting the key later brings it active without losing history.</p>
              </div>
            </div>
            <div className="ftx-risk">
              <div className="ftx-risk-what">
                <span className="mono">a source is unreachable</span>
                <p>A public page is temporarily down, blocked, or rate-limited on a given scout run.</p>
              </div>
              <div className="ftx-risk-how">
                <span className="mono">how we handle it</span>
                <p>That run logs &quot;unreachable,&quot; not &quot;nothing found&quot; — the two are treated differently on purpose, because conflating them is exactly the false confidence Law 3 exists to prevent.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- comparison ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="mkt-eyebrow">Versus the alternative</span>
          <h2 style={{ fontSize: 24 }}>Breadth is the whole argument.</h2>
          <div className="ftx-vs">
            <span className="mono">how the others do it</span>
            <p>
              Visualping is honest about what it is — a page-change monitor, and a genuinely good one at that single
              job. It just isn&apos;t 28 channels; page changes are one of ours, not the whole product. Klue and
              Crayon claim broad tracking too, but at a price built for an enterprise motion and a demo call before
              you can see the list. Fortress HQ publishes the inventory on this page, in full, before you&apos;ve
              paid anything.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="mkt-section tight">
        <div className="wrap">
          <span className="wt-eyebrow">Questions</span>
          <h2 className="wt-h2">Coverage, honestly.</h2>
          <div className="ftx-faq">
            <div className="ftx-faq-item">
              <h4>What if a channel reports something wrong?</h4>
              <p>
                A scout report is a fact with a source — a hostname on a cert log, an ad in a public library — so
                &quot;wrong&quot; usually means the source itself is stale or ambiguous, not fabricated. If a channel
                surfaces something that doesn&apos;t hold up, the link is right there to check it yourself, and
                that&apos;s the whole point of Law 3.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Do any channels scrape behind a login or paywall?</h4>
              <p>
                No. Every channel reads something public — a page, an API meant for exactly this kind of query, or a
                public listing. That boundary is a brand law, not just a technical choice: Fortress HQ reads public
                data continuously and together, which is different from reading private data at all.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Do I have to pay extra for the licensed-vendor channels like G2 or Glassdoor?</h4>
              <p>
                Those channels run on a third-party licensed data vendor rather than a free public API, so they carry
                their own cost and are labeled &quot;paid&quot; in the coverage map rather than folded in silently.
                You can see exactly which channels those are before you commit to anything.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>How often do channels actually run — is this real-time?</h4>
              <p>
                Channels run on a daily cadence as the baseline, which is what &quot;the watch never stops&quot;
                means in practice — continuous, not instant. Fortress HQ is not built to catch a change within
                minutes; it&apos;s built to make sure nothing you&apos;d care about goes more than a day unnoticed.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Is 28 channels enough — what about a channel you don&apos;t cover?</h4>
              <p>
                If it&apos;s not on this list, we don&apos;t watch it, and we&apos;d rather tell you that than imply
                broader coverage than the product actually has. The list here is the real, current inventory — not a
                roadmap dressed up as a feature.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can I point a channel at a private or internal source?</h4>
              <p>
                Not today — every channel is built around a public source by design, which is also what keeps the
                product legally and ethically simple. If that changes, it&apos;ll be a distinct, clearly-labeled
                capability, not folded quietly into the existing 28.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Do Starter customers get fewer of the 28 channels than Growth?</h4>
              <p>
                The free and keyless channels — website, sitemap, ads, jobs, subdomains, tech stack and more — run
                the same on every tier. The licensed-vendor channels (G2, Capterra, TrustRadius, Gartner Peer
                Insights, traffic and review data) are part of Growth ($199/mo) and above; Starter&apos;s coverage
                map shows those as available on upgrade rather than pretending they&apos;re already active.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>Can a channel report a false positive — say something changed when it didn&apos;t?</h4>
              <p>
                It&apos;s rare but possible, usually from a page&apos;s own instability (an A/B test, a cached CDN
                response) rather than the scout inventing something. Because every report links to what was actually
                captured, a false positive is checkable and correctable rather than a black-box claim you just have
                to trust.
              </p>
            </div>
            <div className="ftx-faq-item">
              <h4>How does this compare to Klue&apos;s or Crayon&apos;s channel count?</h4>
              <p>
                Both claim broad tracking, but neither publishes an equivalent channel-by-channel inventory before a
                demo call. Fortress HQ&apos;s list is on this page, named and grouped, whether or not you&apos;ve
                paid for anything yet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- related ---------- */}
      <section className="ftx-relate">
        <div className="wrap">
          <span className="mkt-eyebrow">Keep going</span>
          <h2 style={{ fontSize: 22, margin: '0 0 4px' }}>See a channel become a briefing.</h2>
          <div className="ftx-relate-row">
            <Link href="/features/insights">How the Tower reasons →</Link>
            <Link href="/features/campaign-intelligence">Ad &amp; GTM tracking in depth →</Link>
            <Link href="/features/overview">The daily briefing surface →</Link>
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
