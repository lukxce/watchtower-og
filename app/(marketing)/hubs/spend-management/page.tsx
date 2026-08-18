import Link from 'next/link';

export const metadata = {
  title: 'Spend Management — Fortress HQ',
  description:
    "We don't estimate a competitor's ad spend in dollars — that number is always a guess. We show you which platforms they're live on, how their creative mix shifts, and where organic effort is going.",
};

export default function SpendManagementHub() {
  return (
    <div className="hbx">
      <section className="hbx-hero">
        <div className="wrap">
          <span className="hbx-crumb">Spend management</span>
          <h1 className="mkt-h1" style={{ marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            We don&apos;t estimate their ad budget. We show you where they&apos;re pointing it.
          </h1>
          <p className="lede" style={{ marginLeft: 0, textAlign: 'left' }}>
            Every &ldquo;ad spend tracker&rdquo; in this category shows a dollar figure that&apos;s a model&apos;s guess wearing
            a currency symbol. Nobody outside the ad platform actually knows what a competitor spent. What&apos;s real
            and public is which platforms they&apos;re running on, how many creatives are live, how that mix shifts, and
            whether their organic reach is growing or shrinking &mdash; and that&apos;s what we track.
          </p>
        </div>
      </section>

      <section className="hbx-stats">
        <div className="wrap">
          <div className="hbx-stat-grid">
            <div className="hbx-stat"><span className="n">3</span><span className="l">Ad-library channels watched &mdash; Meta, Google, LinkedIn</span></div>
            <div className="hbx-stat"><span className="n">2</span><span className="l">Market channels &mdash; Traffic &amp; SEO estimate, and Google Trends search interest</span></div>
            <div className="hbx-stat"><span className="n">5</span><span className="l">GTM &amp; ads channels total, incl. events &amp; webinars and customer logo wins/losses</span></div>
            <div className="hbx-stat"><span className="n">$149/mo</span><span className="l">Starter, published</span></div>
          </div>
        </div>
      </section>

      <section className="hbx-argument">
        <div className="wrap">
          <div className="hbx-panel">
            <h2>Dollar figures are a guess. Volume and format are a fact.</h2>
            <p>
              Third-party ad-spend estimates are modeled from panel data and traffic proxies, and they&apos;re routinely
              off by multiples &mdash; you&apos;ve probably already caught one being wrong about your own company. We
              didn&apos;t want to build a more polished version of the same guess, so we don&apos;t.
            </p>
            <p>
              <span className="accent">What we track instead is verifiable directly against the ad platform&apos;s own
              library</span>: which of Meta, Google and LinkedIn a competitor is actively advertising on, how many ads
              are live, and how their creative themes shift week to week. Paired with organic signal &mdash; estimated
              traffic and search interest &mdash; that gives you where effort and attention are actually going, paid and
              organic together, without a fabricated number in the middle.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-split">
        <div className="wrap">
          <span className="wt-eyebrow">Where we actually stand</span>
          <h2 className="wt-h2">What we track today, and what we deliberately don&apos;t.</h2>
          <div className="hbx-split-grid">
            <div className="hbx-live-panel">
              <span className="hbx-panel-tag live"><i />Live &middot; today</span>
              <h3>What we track today</h3>
              <ul>
                <li><strong>Meta ads</strong> &mdash; the Ad Library Graph API by page ID.</li>
                <li><strong>Google ads</strong> &mdash; the Transparency Center, by domain.</li>
                <li><strong>LinkedIn ads</strong> &mdash; the LinkedIn Ad Library, advertiser-exact.</li>
                <li><strong>Traffic &amp; SEO</strong> &mdash; estimated organic traffic via DataForSEO.</li>
                <li><strong>Search interest</strong> &mdash; Google Trends, via DataForSEO.</li>
                <li><strong>Events &amp; webinars, customer logos</strong> &mdash; the field-marketing themes and win/loss
                  tells that sit beside paid activity in the same GTM &amp; ads group.</li>
              </ul>
            </div>
            <div className="hbx-roadmap-panel">
              <span className="hbx-panel-tag roadmap">Not tracked, on principle</span>
              <h3>What we don&apos;t do</h3>
              <p>
                We do not estimate a competitor&apos;s ad spend in dollars, and we&apos;re not planning to bolt one on to
                look more complete. A modeled number that can&apos;t be traced to a source fails the standard the rest
                of this product is held to.
              </p>
              <ul>
                <li>No dollar-denominated spend estimates.</li>
                <li>No historical &ldquo;spend trend&rdquo; line built on a guess.</li>
                <li>No confidence score standing in for a citation.</li>
              </ul>
              <p>
                If a way to verify spend directly against a platform&apos;s own disclosed numbers ever exists, we&apos;d
                build that as a scout like any other. Until then, volume and format are the honest version of this
                metric.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hbx-cta">
        <div className="wrap">
          <div className="wt-inline-cta">
            <p>See real ad-library and traffic signal, watched daily, in the live demo.</p>
            <div className="wt-cta">
              <Link href="/demo" className="btn btn-primary">Try the live demo &rarr;</Link>
              <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
