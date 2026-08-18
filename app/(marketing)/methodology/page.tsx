import Link from 'next/link';
import '../company.css';

export const metadata = {
  title: 'Methodology — Fortress HQ',
  description: 'How Fortress HQ verifies what it shows you, with the specific mechanisms behind each check, what it gets wrong, and how it handles that honestly.',
};

export default function Methodology() {
  return (
    <section className="cox-page">
      <div className="wrap cox-prose">
        <span className="cox-kicker">Methodology</span>
        <h1>How we know what we tell you.</h1>
        <p className="cox-lede">
          Every conclusion Fortress HQ shows you carries its source. Anything unverifiable is skipped and
          disclosed, never guessed at. That&rsquo;s not a promise on a trust page — it&rsquo;s enforced by
          specific mechanisms, below, in as much detail as we can put on a public page.
        </p>

        <h2>The bar every signal has to clear</h2>
        <p>
          The tower reads, you decide: what reaches you is always a plain-language conclusion, never raw
          detection plumbing, with the underlying observation kept visible underneath as a &ldquo;how we
          know&rdquo; line. And no false fires — a bare keyword match is never treated as a real signal. A
          company name that also belongs to a song, a band, or an unrelated business with the same name is
          worthless as a mention unless it&rsquo;s disambiguated first. Here&rsquo;s how each channel actually
          does that.
        </p>

        <span className="cox-tile-k">Mechanism 1</span>
        <h2>Reviews: matched on the platform&rsquo;s own domain field, never on name</h2>
        <p>
          We don&rsquo;t match a competitor&rsquo;s G2 listing by company name alone, because names collide
          constantly. A live search for a company called &ldquo;Klue&rdquo; on G2 returns five product cards:
          Klue itself, a separate &ldquo;Klue Win-Loss&rdquo; listing, Kluster, Wolters Kluwer, and KlientBoost.
          Three of those five are entirely different companies that merely happen to share a name prefix — the
          exact same failure mode that shows up under &ldquo;Crayon&rdquo; in funding data and under
          &ldquo;Fortress HQ&rdquo; in our own brand-mention search.
        </p>
        <p>
          The fix isn&rsquo;t a smarter fuzzy match, it&rsquo;s a different field entirely. G2 search rows carry
          a <code>companyDomain</code> value — the vendor&rsquo;s own verified domain, not a display name — and
          that&rsquo;s what we check a competitor&rsquo;s tracked domain against, exactly, not approximately. A
          row only counts as belonging to the competitor when its domain matches theirs. Everything else is
          discarded before it ever reaches scoring, regardless of how close the name looked.
        </p>
        <p>
          This also means we don&rsquo;t stop at the first listing we find. Because resolution is domain-verified
          rather than name-guessed, we can safely pick up every product line a vendor lists under its own domain
          — Klue&rsquo;s separate Win-Loss listing is a real example, and a second product listing appearing
          under a competitor&rsquo;s domain is itself worth surfacing as a signal, not just noise to filter. The
          resolution is cached once a competitor is added rather than re-searched on every crawl, and refreshed
          occasionally specifically because a vendor launching a new listing is exactly the kind of thing worth
          catching early.
        </p>
        <div className="cox-callout">
          <b>Example:</b> a name-only search for &ldquo;Klue&rdquo; on G2 also returns Kluster, Wolters Kluwer
          and KlientBoost — three unrelated companies. Matching on the verified <code>companyDomain</code> field
          instead of the display name is what keeps all three out automatically, with no manual exclusion list to
          maintain.
        </div>

        <span className="cox-tile-k">Mechanism 2</span>
        <h2>Funding &amp; M&amp;A: SEC EDGAR Form D, cross-checked against news</h2>
        <p>
          A funding or M&amp;A signal is never shown on the strength of a single blog post or press release. We
          check two free, public sources and require corroboration before anything is treated as confident.
        </p>
        <p>
          The first is Form D on SEC EDGAR. Any US company running a private securities offering has to file a
          Form D within 15 days of the first sale — which means the filing can land, and often does,{' '}
          <strong>before the funding round is ever announced in the press.</strong> That&rsquo;s the whole reason
          it&rsquo;s worth checking: it&rsquo;s a leading indicator, not a mirror of what a press release already
          told you. EDGAR is also free and authoritative, which matters because the obvious alternative,
          Crunchbase, isn&rsquo;t: its Pro tier is search-and-export only, its Business tier still isn&rsquo;t API
          access, and real API access needs an Enterprise licence that&rsquo;s quote-only and, because the data
          would be resold inside a product we charge for, falls under a separate Data Licensing agreement again.
          For a channel whose entire question is &ldquo;did they just raise?&rdquo;, that&rsquo;s an absurd price
          to pay, so we don&rsquo;t. What we give up in exchange is Crunchbase&rsquo;s structured history — full
          round lists, investor names, valuations as clean data. A briefing needs the event, not the database, so
          that&rsquo;s the trade we take.
        </p>
        <p>
          The second source is straightforward funding-language news, matched against the competitor&rsquo;s
          name. Neither source is filtered by default, and both would produce false fires without one more step:
          entity disambiguation. An EDGAR full-text search matches a term anywhere in a filing, and a news search
          matches a name anywhere in a headline — neither one knows which company it means when two companies
          share a name.
        </p>
        <div className="cox-callout">
          <b>Example:</b> two real, unrelated companies are both named &ldquo;Crayon&rdquo; — one a
          competitive-intelligence company, the other a Norwegian IT reseller that SoftwareOne acquired for
          $1.4bn. Both produce funding headlines that read, verbatim, &ldquo;&hellip;Crayon&hellip;&rdquo;. No
          amount of regex separates them, because the headline itself doesn&rsquo;t say which Crayon it means. So
          rather than guess, the item is held and counted rather than shown as fact — &ldquo;N items held, name
          shared with another company&rdquo; is a true statement we&rsquo;re allowed to make; attributing a
          headline to the wrong company is not.
        </div>
        <p>
          The same discipline applies on the EDGAR side, differently. A filer name only counts as a match after
          an exact comparison with corporate suffixes stripped — not a prefix match, because a looser check lets
          through filings like &ldquo;Crayon Software Experts LLC&rdquo; (an actual Norwegian IT reseller filing),
          &ldquo;Bold Crayon Corp&rdquo; and &ldquo;Crayon Interface Inc&rdquo; for a search on the word
          &ldquo;Crayon&rdquo; alone — none of them the competitor. Even exact matching has an honest limit: it
          still can&rsquo;t separate two companies that share a genuinely identical legal name. When that happens
          the filing title always prints the filer exactly as EDGAR recorded it, so you can judge it yourself
          rather than trust a label we assigned.
        </p>

        <span className="cox-tile-k">Mechanism 3</span>
        <h2>Brand mentions: classified before they&rsquo;re ever shown as a mention</h2>
        <p>
          A bare keyword search for almost any company name returns more noise than signal. We learned this from
          our own name: searching Google News for &ldquo;Fortress HQ&rdquo; on name alone returns a Jehovah&rsquo;s
          Witnesses magazine, a thrash-metal band, a concert venue and a gig listing long before it returns
          anything about this company. It&rsquo;s also the exact problem that led us to rename the product away
          from its original name, Watchtower — that name collided with a well-known song, a band, a film and a
          farmhouse, on top of half a dozen unrelated cybersecurity products. If a bare name match isn&rsquo;t
          good enough to trust about our own brand, it isn&rsquo;t good enough to trust about yours either.
        </p>
        <p>
          So a name has to co-occur with something specific to your market before we ever call it a
          &ldquo;mention&rdquo;: your own domain, a competitor you&rsquo;re already tracking, or a distinctive
          word drawn from how you describe your own business. We pull mentions from three real, sourced places —
          general news naming the brand; the brand&rsquo;s name appearing inside a competitor&rsquo;s own
          already-captured page content, which is the highest-value kind, a competitor talking about you on their
          own site; and any signal already ingested on any channel whose title happens to name the brand. An
          empty result across all three is itself a reportable, honest answer, not a broken page.
        </p>
        <p>
          Every match that survives is then classified, not just counted, into one of three verdicts: is this{' '}
          <strong>you</strong>, a <strong>different entity sharing the name</strong>, or genuinely{' '}
          <strong>unverifiable</strong>? A second check looks for words that commonly mark the other sense of a
          short brand word — song, album, band, tour, venue, episode, film, castle, fortress — and only downgrades
          an item to &ldquo;same name&rdquo; when it also failed to match anything about your actual market, so a
          client that genuinely operates in music or film is never silently muted. And when a workspace hasn&rsquo;t
          told us enough yet to disambiguate against — no domain, no description, no tracked competitors — we say
          that plainly and flag every result as unconfirmed, rather than either hiding real coverage or quietly
          treating a concert listing as market intelligence.
        </p>

        <h2>How a signal becomes a briefing</h2>
        <p>
          The mechanisms above answer &ldquo;is this real?&rdquo; on a single channel. What actually reaches you
          is the result of putting three engineering principles — not just marketing lines — on top of that, in
          order.
        </p>
        <p>
          <strong>Scouts gather.</strong> Individual collectors run per channel, per competitor, and each one
          reports back honestly, including when it finds nothing — a channel that checked and found nothing
          looks different, in the record, from a channel that never ran. <strong>The Tower sees</strong> — the
          reasoning layer reads what every scout brought back for a given competitor <em>together</em>, not
          channel by channel in isolation, because a subdomain appearing on a certificate log the same week a
          competitor announces a funding round is a different, sharper story than either fact alone. That&rsquo;s
          Law 1, the tower reads, you decide: what you see is always the plain-language conclusion, with the
          specific observations that produced it kept visible underneath as the &ldquo;how we know&rdquo; line —
          never the reverse.
        </p>
        <p>
          <strong>The beacon is earned</strong> next, before anything is delivered. Loud visual treatment — the
          highlighter accent, size, prominence — is reserved for conclusions that clear the evidence bar
          described above: multiple corroborating sources, a verified domain match, a disambiguated name. Most
          of what the scouts bring back stays calm, recorded but not highlighted, because a product where
          everything looks urgent has no way left to tell you what actually matters. <strong>No false fires</strong>{' '}
          closes the loop: anything that couldn&rsquo;t be verified is disclosed as such rather than smoothed
          over, right up to the moment it lands in your daily briefing. Then the command is yours — the Tower
          hands you the conclusion and stops. It doesn&rsquo;t recommend, and it doesn&rsquo;t act on your behalf.
        </p>

        <h2>What we get wrong, and how we handle it</h2>
        <p>
          A methodology page that only describes what works is marketing, not methodology. Here&rsquo;s where the
          real limits are, and what we do instead of pretending they don&rsquo;t exist.
        </p>
        <p>
          <strong>Sitemap timestamps aren&rsquo;t trustworthy enough to rely on.</strong> Most sitemaps carry a{' '}
          <code>lastmod</code> field that&rsquo;s supposed to say when a page last changed. Checking it against
          real competitor sites, only a minority of sites we tested published a <code>lastmod</code> field worth
          trusting — several active marketing sites reported zero changes across an entire month, which
          isn&rsquo;t credible for a company that publishes content regularly. So change detection doesn&rsquo;t
          rely on that flag: pages are re-fetched on a schedule and their content is hashed, and a change is only
          recorded when the actual content differs, not when a site claims it does.
        </p>
        <p>
          <strong>Certificate-transparency lookups can rate-limit, and we say so instead of guessing.</strong>{' '}
          Subdomain discovery — the channel that catches a <code>beta.</code> or <code>launch.</code> hostname
          weeks before a launch post — depends on public certificate-transparency logs, and the primary one we
          use can return rate-limit errors under load. We run it with retries and backoff, and fall back to a
          second, independent CT source if the first is unavailable, specifically so a temporarily flaky log
          never quietly turns into a false &ldquo;no new subdomains found.&rdquo; If both sources fail, the
          channel is reported as unavailable for that run, not as a clean result.
        </p>
        <p>
          <strong>Vendor-run channels can go down on the vendor&rsquo;s side, not just ours.</strong> Review-site
          and social channels are built on third-party scraping infrastructure rather than in-house scrapers,
          because a self-built scraper silently breaks the moment a site redesigns its page — we&rsquo;ve already
          hit real vendor-side failures in testing, including a review platform returning a flat access error on
          a direct request. A broken channel quietly reporting &ldquo;nothing found&rdquo; is the exact failure
          the product exists to prevent, so an outage is recorded and disclosed as an outage, never smoothed into
          a zero.
        </p>

        <h2>Questions we get asked</h2>
        <div className="cox-faq">
          <div className="cox-faq-item">
            <h3>How do you avoid false positives?</h3>
            <p>
              Every channel above has its own disambiguation step before a match counts — a domain field for
              reviews, an exact name match after suffix-stripping plus corroborating news for funding, a
              three-way classification for mentions. Anything that doesn&rsquo;t clear that bar is held and
              disclosed as ambiguous rather than shown as a confident conclusion.
            </p>
          </div>
          <div className="cox-faq-item">
            <h3>What happens if a source turns out to be wrong?</h3>
            <p>
              Every conclusion links to the source it came from, so you can check it yourself — that&rsquo;s the
              point of the &ldquo;how we know&rdquo; line. If a source is unreliable for a given item, the honest
              answer is the same as when a page can&rsquo;t be reached at all: it&rsquo;s disclosed, not silently
              trusted.
            </p>
          </div>
          <div className="cox-faq-item">
            <h3>Do you use AI to make things up?</h3>
            <p>
              No. The reasoning layer writes the plain-language conclusion, but it&rsquo;s grounded in the
              specific evidence retrieved for that competitor on that day — the same evidence shown underneath as
              the citation — not the model&rsquo;s general knowledge about the company. We won&rsquo;t claim
              completeness we can&rsquo;t prove, and we won&rsquo;t claim AI magic; if a page can&rsquo;t be
              fetched, the product says so instead of filling the gap with a plausible guess.
            </p>
          </div>
          <div className="cox-faq-item">
            <h3>Why not just use Crunchbase for funding data?</h3>
            <p>
              Its API isn&rsquo;t available on any plan that fits a product at this price — real API access needs
              an Enterprise licence, quoted separately, plus a Data Licensing agreement for reselling it inside a
              paid product. SEC EDGAR is free, public, and in the specific case of Form D filings, can actually
              land before the press release does. The trade-off is structured round history, which we don&rsquo;t
              have; the event itself, which is what a briefing needs, we do.
            </p>
          </div>
          <div className="cox-faq-item">
            <h3>What happens when a channel finds nothing?</h3>
            <p>
              It&rsquo;s reported as checked-and-empty, not left silent. A channel that ran and found nothing and
              a channel that never ran look identical to you unless the product tells you which happened, so it
              always does.
            </p>
          </div>
          <div className="cox-faq-item">
            <h3>Can a competitor tell they&rsquo;re being watched?</h3>
            <p>
              No. Every channel reads something the competitor already chose to make public — a pricing page, a
              job listing, an ad, a certificate log, a press mention. Nothing is fetched by pretending to be
              someone else, no login wall is bypassed, and nothing gated or private is ever touched.
            </p>
          </div>
          <div className="cox-faq-item">
            <h3>Is the channel list finished?</h3>
            <p>
              No, and we&rsquo;d rather say that than imply otherwise. New channels get added openly, and until
              one is real, the product doesn&rsquo;t pretend it&rsquo;s already live. The current, complete
              inventory is public on <Link href="/features/data-sources">what we track</Link>.
            </p>
          </div>
        </div>

        <h2>What this means in practice</h2>
        <p>
          Loud visual treatment — the highlighter accent — is reserved for conclusions that clear this bar. Most
          of the interface stays calm on purpose. When something is highlighted, it means the evidence is real
          and checked, not that the scouts merely found a keyword. If a channel can&rsquo;t be reached, or a
          match can&rsquo;t be disambiguated, the product says so out loud rather than filling the gap with a
          guess.
        </p>

        <div className="cox-cta-row">
          <Link href="/pricing" className="btn btn-primary">See pricing</Link>
          <Link href="/demo" className="btn btn-ghost">Try the live demo →</Link>
        </div>
      </div>
    </section>
  );
}
