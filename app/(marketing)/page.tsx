import Link from 'next/link';

export const metadata = {
  title: 'Watchtower — Verifiable competitive intelligence',
  description: 'Every signal cited, every gap disclosed. Track every competitor across 22 channels, self-serve, from $99/mo.',
};

const FEATURES = [
  {
    title: '22 channels, zero setup for most',
    body: '15 of them run with no API key at all: ads, hiring, product pages, reviews, subdomains, tech stack. The rest turn on the moment you add a key.',
    icon: <path d="M4 5h16M4 12h16M4 19h10" strokeLinecap="round" />,
  },
  {
    title: 'Comparison-page discovery',
    body: 'Sitemap, crawl, and the Wayback CDX index combined to find every "vs" and "alternative to" page a competitor has ever published about you, even the ones they took down.',
    icon: <><path d="M9 3v18M15 3v18" strokeLinecap="round" /><path d="M3 8h4M3 16h4M17 8h4M17 16h4" strokeLinecap="round" /></>,
  },
  {
    title: 'Campaign & landing-page tracking',
    body: "Maps ad spend to the landing page it's sending traffic to, and flags it when several ads point at one new page on the same day.",
    icon: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>,
  },
  {
    title: 'A claim ledger, not a diff feed',
    body: 'Every captured page becomes a set of cited claims, tagged new, reaffirmed, or changed, and checked against your own feature list for direct contradictions.',
    icon: <path d="M6 4h9l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z M14 4v6h6 M9 14h6 M9 17h6" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: 'Threat Index, per dimension',
    body: 'A weighted, auditable composite across GTM, talent, product, and market signals, with a week-over-week delta you can trace back to what actually moved it.',
    icon: <><path d="M12 21a9 9 0 1 1 9-9" strokeLinecap="round" /><path d="M12 12l5-3" strokeLinecap="round" /></>,
  },
  {
    title: 'Battlecards that cite their source',
    body: 'Positioning, vulnerabilities, and how-to-win content pulled from live signals instead of whatever someone last updated a quarter ago.',
    icon: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 9h4M7 13h7" strokeLinecap="round" /></>,
  },
];

export default function Home() {
  return (
    <>
      <section className="mkt-hero" id="product">
        <div className="wrap">
          <span className="kicker">Verifiable competitive intelligence</span>
          <h1 className="mkt-h1">
            Know what they did. Know <span className="accent">exactly how we know.</span>
          </h1>
          <p className="mkt-dek">
            Watchtower tracks every competitor across 22 channels and turns raw pages into cited claims. Each one
            comes with a source and a timestamp, so it's never just a diff you have to go interpret yourself. When
            something can't be verified, the feed says so instead of guessing.
          </p>
          <div className="mkt-hero-cta">
            <Link href="/sign-up" className="btn btn-on-navy btn-lg">Start free, no card required</Link>
            <Link href="#brain" className="btn btn-on-navy-ghost btn-lg">See how it works</Link>
          </div>
          <p className="mkt-hero-note">Self-serve from $99/mo. No demo required to see it run.</p>
        </div>
        <div className="mkt-hero-device">
          <div className="wrap">
            <div className="shot-frame">
              <div className="shot-bar"><span /><span /><span /></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/screenshots/feed.png" alt="The Watchtower signal feed: threat-index strip, category-coded signal cards, channel coverage" className="shot-img" />
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-stats">
        <div className="wrap">
          <div className="mkt-stat">
            <span className="n mono">22</span>
            <span className="l">channels we actively track, spanning ads, hiring, product, pricing, reviews, and tech stack</span>
          </div>
          <div className="mkt-stat">
            <span className="n mono">&lt;60s</span>
            <span className="l">target full crawl time, parallelized per competitor</span>
          </div>
          <div className="mkt-stat">
            <span className="n mono">$99</span>
            <span className="l">self-serve monthly floor. Most of this category starts at a five-figure annual contract</span>
          </div>
          <div className="mkt-stat">
            <span className="n mono">0</span>
            <span className="l">fabricated signals. Unfetchable rows get skipped and logged, never guessed</span>
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="wrap">
          <div className="mkt-2col">
            <div>
              <span className="mkt-eyebrow">The problem</span>
              <h2>A page changing isn&apos;t intelligence.</h2>
              <p className="lede">
                Most competitive intelligence tools alert on the diff and stop there. Someone still has to open the
                page, work out what actually changed, and decide whether it matters. That&apos;s the manual curation
                buyers complain about across this whole category, and it isn&apos;t a training problem. It comes
                from tracking pages instead of tracking claims.
              </p>
              <p className="lede">
                Watchtower extracts the actual claim and gives it its own history, so it can tell you whether
                something is genuinely new, has changed, or is just showing up again. A repeated claim raises our
                confidence in it instead of triggering another alert.
              </p>
            </div>
            <div className="contrast">
              <div className="contrast-card bad">
                <span className="contrast-tag">What a diff feed gives you</span>
                <p>&ldquo;northwind.com/pricing changed at 14:02 UTC.&rdquo;</p>
              </div>
              <div className="contrast-card good">
                <span className="contrast-tag">What a claim ledger gives you</span>
                <p>&ldquo;Starter tier dropped from $49 → $39/mo. 2nd confirmation this week.&rdquo;</p>
                <span className="cite">cite: northwind.com/pricing · captured 14:02 UTC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-section alt" id="brain">
        <div className="wrap">
          <span className="mkt-eyebrow">How it works</span>
          <h2>From a raw page to a cited claim, in four steps.</h2>
          <p className="lede">
            No black box. Every step is inspectable, and every one fails honestly: a row that can&apos;t be fetched
            gets skipped and logged, not invented.
          </p>
          <div className="mkt-pipeline">
            <div className="mkt-step">
              <div className="sn">01 · CAPTURE</div>
              <h4>Discover &amp; capture</h4>
              <p>Sitemap, crawl, and the Wayback CDX index combined to find pricing pages, changelogs, and comparison pages, including ones that were quietly taken down.</p>
            </div>
            <div className="mkt-step">
              <div className="sn">02 · EXTRACT</div>
              <h4>Extract claims</h4>
              <p>Structured, cited extraction: one claim per unit, quoted straight from the source sentence rather than paraphrased into something new.</p>
            </div>
            <div className="mkt-step">
              <div className="sn">03 · RECONCILE</div>
              <h4>Dedupe &amp; contradict</h4>
              <p>Matched against prior claims (new, reaffirmed, or changed) and against your own feature truth table for direct contradictions.</p>
            </div>
            <div className="mkt-step">
              <div className="sn">04 · ROUTE</div>
              <h4>Route to a battlecard</h4>
              <p>Scored on source credibility and repetition, then inserted into the right section, queued for review, or discarded as noise.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="wrap">
          <span className="mkt-eyebrow">Coverage</span>
          <h2>Everything a competitor does, in one feed.</h2>
          <p className="lede">Six things Watchtower does that a page-diff tool structurally can&apos;t.</p>
          <div className="mkt-grid">
            {FEATURES.map((f) => (
              <div className="mkt-feature" key={f.title}>
                <div className="fi">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{f.icon}</svg>
                </div>
                <h4>{f.title}</h4>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-section alt">
        <div className="wrap">
          <span className="mkt-eyebrow">Positioning</span>
          <h2>See the whole landscape, not just a list.</h2>
          <p className="lede">A real market positioning map per workspace, plus how many of the tracked dimensions each competitor actually leads on.</p>
          <div className="shot-frame light">
            <div className="shot-bar"><span /><span /><span /></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screenshots/competitors.png" alt="Watchtower's Competitors page: a 2x2 market positioning map and per-competitor cards with real computed stats" className="shot-img" />
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="wrap">
          <span className="mkt-eyebrow">Built to be verifiable</span>
          <h2>If we can&apos;t source it, we don&apos;t show it.</h2>
          <p className="lede">
            No placeholder text. No confidence score standing in for a citation. No quiet retry loop pretending a
            failure didn&apos;t happen. This is the actual failure state, shown right in the product instead of
            buried in a log file only we can see.
          </p>
          <div className="trust-mock">
            <div className="row">
              <div className="trust-card">
                <span className="te">New claim</span>
                <p>&ldquo;Fathom Labs now lists a compare page targeting our SOC 2 gap.&rdquo;</p>
                <span className="chip">Cite source</span>
              </div>
              <div className="trust-card">
                <span className="te">Honest failure</span>
                <p>&ldquo;fathomlabs.com/enterprise: unfetchable, robots-blocked. Skipped.&rdquo;</p>
                <span className="chip skip">Logged, not guessed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="wrap">
          <span className="mkt-eyebrow">Pricing</span>
          <h2>No demo required to see a price.</h2>
          <p className="lede">The category&apos;s norm is a sales call and a five-figure annual quote. Ours is a self-serve tier that runs in minutes.</p>
          <div className="mkt-tiers">
            <div className="tier">
              <span className="tier-tag">Starter</span>
              <h3>Self-serve</h3>
              <div className="price">$99<span>/mo</span></div>
              <p className="tier-note">3 competitors · 15 zero-key channels</p>
              <ul>
                <li>Signal feed &amp; Threat Index</li>
                <li>Comparison-page discovery</li>
                <li>Weekly digest</li>
              </ul>
              <Link href="/sign-up" className="btn btn-ghost">Start free</Link>
            </div>
            <div className="tier on">
              <span className="tier-tag">Growth</span>
              <h3>Full coverage</h3>
              <div className="price">$399<span>/mo</span></div>
              <p className="tier-note">10 competitors · all 22 channels</p>
              <ul>
                <li>Everything in Starter</li>
                <li>Claim ledger &amp; auto battlecards</li>
                <li>Campaign &amp; landing-page tracking</li>
                <li>Slack / Teams digest</li>
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
                <li>CRM battlecard surface</li>
                <li>Dedicated onboarding</li>
              </ul>
              <Link href="/contact" className="btn btn-ghost">Contact sales</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-cta-band">
        <div className="wrap">
          <span className="kicker">Get started</span>
          <h2>See your competitors before they announce anything.</h2>
          <p className="lede">Pick two or three competitors. Watch real, cited signals appear inside an hour.</p>
          <div className="mkt-hero-cta">
            <Link href="/sign-up" className="btn btn-on-navy btn-lg">Start free, no card required</Link>
            <Link href="/contact" className="btn btn-on-navy-ghost btn-lg">Talk to us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
