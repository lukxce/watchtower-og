import Link from 'next/link';

export const metadata = {
  title: 'Data Sources — Fortress HQ',
  description:
    'The full inventory: 22 public channels across Product, GTM & ads, Talent, Voice & PR, Reputation and Market, watched continuously.',
};

export default function DataSourcesFeature() {
  return (
    <div className="ftx">
      {/* ---------- hero ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-over">Feature · Data sources</span>
            <span className="kicker">22 public channels · always on</span>
            <h1 className="wt-h1">Every channel we watch, named.</h1>
            <p className="wt-dek">
              Fortress HQ tracks competitors across 22 public channels, grouped into six areas of a business. Nothing
              private, nothing scraped from behind a login, nothing implied. Here is the honest inventory — not a
              feature list, an actual accounting of where the scouts go.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo →</Link>
            </div>
            <p className="wt-note">From $149/mo · no card required</p>
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
          <h2 className="wt-h2">22 channels, six groups, watched daily.</h2>
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
          <div className="wt-beats">
            <div className="wt-beat">
              <span className="wt-beat-k mono">public only</span>
              <h3>Nothing behind a login</h3>
              <p>
                Everything here is public. It is simply read continuously, and read together — which is the part
                almost nobody actually does by hand.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">read together</span>
              <h3>One channel is a fact, not a story</h3>
              <p>
                A single ad, a single job post, a single review — none of them mean much alone. The value shows up
                when they&apos;re read against each other, per competitor.
              </p>
            </div>
            <div className="wt-beat">
              <span className="wt-beat-k mono">honest gaps</span>
              <h3>If a page can&apos;t be reached, we say so</h3>
              <p>
                A channel that returns nothing gets reported as nothing found, not silently skipped. Coverage you can
                trust includes knowing where it stops.
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
