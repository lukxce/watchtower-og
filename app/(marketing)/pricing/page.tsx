import Link from 'next/link';

export const metadata = {
  title: 'Pricing — Watchtower',
  description: "Self-serve from $99/mo. No demo required to see a price, unlike the rest of this category.",
};

export default function Pricing() {
  return (
    <>
      <section className="mkt-page-hero">
        <div className="wrap">
          <span className="kicker">Pricing</span>
          <h1 className="mkt-h1">Published prices. No sales call required.</h1>
          <p className="lede">
            Every established competitive intelligence platform gates pricing behind a demo. Third-party trackers
            estimate entry deployments around $15,000/year, scaling well past six figures. We think that friction
            protects the vendor more than the buyer, so here&apos;s what it actually costs.
          </p>
        </div>
      </section>

      <section className="mkt-section tight">
        <div className="wrap">
          <div className="mkt-tiers">
            <div className="tier">
              <span className="tier-tag">Starter</span>
              <h3>Self-serve</h3>
              <div className="price">$99<span>/mo</span></div>
              <p className="tier-note">3 competitors · watched daily</p>
              <ul>
                <li>Signal feed &amp; Threat Index</li>
                <li>Comparison-page discovery</li>
                <li>Compare view, Launch Radar</li>
                <li>Weekly email digest</li>
              </ul>
              <Link href="/sign-up" className="btn btn-ghost">Start free</Link>
            </div>
            <div className="tier on">
              <span className="tier-tag">Growth</span>
              <h3>Full coverage</h3>
              <div className="price">$399<span>/mo</span></div>
              <p className="tier-note">10 competitors · full coverage</p>
              <ul>
                <li>Everything in Starter</li>
                <li>Auto-generated battlecards, always current</li>
                <li>Campaign &amp; landing-page tracking</li>
                <li>Slack / Teams digest</li>
                <li>Paid-source channels (traffic, reviews, G2/Capterra)</li>
              </ul>
              <Link href="/sign-up" className="btn btn-primary">Start free</Link>
            </div>
            <div className="tier">
              <span className="tier-tag">Enterprise</span>
              <h3>Custom</h3>
              <div className="price">Talk to us</div>
              <p className="tier-note">Unlimited competitors · SSO · win-loss</p>
              <ul>
                <li>Everything in Growth</li>
                <li>SSO &amp; audit log</li>
                <li>CRM-embedded battlecards</li>
                <li>Native win-loss program</li>
                <li>Dedicated onboarding</li>
              </ul>
              <Link href="/contact" className="btn btn-ghost">Contact sales</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-section alt">
        <div className="wrap">
          <div className="mkt-2col">
            <div>
              <span className="mkt-eyebrow">Why we publish this</span>
              <h2>The honest test is whether it survives a stranger signing up.</h2>
              <p className="lede">
                If a competitive intelligence tool actually works, a new user should be able to pick two or three
                competitors and watch real, sourced signals appear inside an hour. No demo, no sales call needed to
                find out whether it&apos;s worth the price. Gating that behind a conversation doesn&apos;t protect
                the product&apos;s value; it just hides how long it actually takes to deliver any.
              </p>
            </div>
            <div>
              <span className="mkt-eyebrow">Unit economics, honestly</span>
              <h2 style={{ fontSize: 22 }}>What the entry tier does and doesn&apos;t include</h2>
              <p className="lede">
                Starter runs everything that needs no paid data source: ads, hiring, product pages, launches,
                tech stack, reviews. Paid market data (traffic/SEO, G2/Capterra, review platforms billed per call)
                sits in Growth and above, because those costs scale with usage and we won&apos;t promise a flat
                price we can&apos;t actually hold.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
