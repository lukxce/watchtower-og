import Link from 'next/link';
import '../company.css';

export const metadata = {
  title: 'Methodology — Fortress HQ',
  description: 'How Fortress HQ verifies what it shows you, with the specific mechanisms behind each check.',
};

export default function Methodology() {
  return (
    <section className="cox-page">
      <div className="wrap cox-prose">
        <span className="cox-kicker">Methodology</span>
        <h1>How we know what we tell you.</h1>
        <p className="cox-lede">
          Every conclusion Fortress HQ shows you carries its source. Anything unverifiable is skipped and
          disclosed, never guessed at. That&rsquo;s not a promise on a trust page — it&rsquo;s enforced by three
          specific mechanisms, below.
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

        <div className="cox-tiles">
          <div className="cox-tile">
            <span className="cox-tile-k">Reviews</span>
            <h3>G2 matching is verified against the platform&rsquo;s own domain field</h3>
            <p>
              We don&rsquo;t match a competitor&rsquo;s reviews by company name alone — names collide constantly.
              Every G2 review is checked against the review platform&rsquo;s own <code>companyDomain</code>{' '}
              field, not a fuzzy name match.
            </p>
            <p className="cox-example">
              Example: a search for &ldquo;Klue&rdquo; on name alone also returns Kluster, Wolters Kluwer, and
              KlientBoost — three unrelated companies that merely share a name prefix. Matching on the verified
              domain field is what keeps them out.
            </p>
          </div>

          <div className="cox-tile">
            <span className="cox-tile-k">Funding &amp; M&amp;A</span>
            <h3>Cross-checked against SEC EDGAR Form D, plus corroborating news</h3>
            <p>
              A funding or M&amp;A signal isn&rsquo;t shown on a single blog post or press release. It&rsquo;s
              cross-checked against Form D filings on SEC EDGAR — a public, authoritative, free source — together
              with corroborating news coverage. Anything ambiguous is held out of the briefing rather than
              guessed at.
            </p>
            <p className="cox-example">
              Example: two different companies are both named &ldquo;Crayon&rdquo; — one a competitive-intelligence
              company, one a Norwegian IT reseller acquired by SoftwareOne. Rather than pick one, we hold the
              item and disclose it as &ldquo;N items held, name shared with another company.&rdquo;
            </p>
          </div>

          <div className="cox-tile">
            <span className="cox-tile-k">Brand mentions</span>
            <h3>Every match is classified before it&rsquo;s ever shown as a mention</h3>
            <p>
              A bare keyword search for a company name can just as easily return a song, a band, or an unrelated
              business. So nothing is surfaced as a &ldquo;mention&rdquo; until it&rsquo;s classified: is this the
              client, a different entity of the same name, or noise? When there&rsquo;s nothing to disambiguate
              against, we say that plainly instead of pretending the match is real.
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
