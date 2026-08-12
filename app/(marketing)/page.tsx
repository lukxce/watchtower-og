import Link from 'next/link';
import LiveFeedDemo from './LiveFeedDemo';

export const metadata = {
  title: 'Watchtower — Verifiable competitive intelligence',
  description: 'Every signal cited, every gap disclosed. Track every competitor across 22 channels — self-serve, from $99/mo.',
};

const FEATURES = [
  {
    title: '22 channels, zero setup for most',
    body: '15 run with no API key at all — ads, hiring, product, reviews, subdomains, tech stack. The rest light up the moment you add a key.',
    icon: <path d="M4 5h16M4 12h16M4 19h10" strokeLinecap="round" />,
  },
  {
    title: 'Comparison-page discovery',
    body: 'Sitemap, crawl, and the Wayback CDX index unioned to find every "vs" and "alternative to" page a competitor has ever published about you — including deleted ones.',
    icon: <><path d="M9 3v18M15 3v18" strokeLinecap="round" /><path d="M3 8h4M3 16h4M17 8h4M17 16h4" strokeLinecap="round" /></>,
  },
  {
    title: 'Campaign & landing-page tracking',
    body: "Maps ad spend to the landing page it's sending traffic to — and flags when multiple ads land on one new page the same day.",
    icon: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>,
  },
  {
    title: 'Claim ledger, not a diff feed',
    body: 'Every captured page is turned into cited claims — new, reaffirmed, or changed — checked against your own feature truth table for contradictions.',
    icon: <path d="M6 4h9l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z M14 4v6h6 M9 14h6 M9 17h6" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    title: 'Threat Index, per dimension',
    body: 'A weighted, auditable composite across GTM, talent, product, and market signals — with week-over-week deltas, not a black-box score.',
    icon: <><path d="M12 21a9 9 0 1 1 9-9" strokeLinecap="round" /><path d="M12 12l5-3" strokeLinecap="round" /></>,
  },
  {
    title: 'Battlecards that cite their source',
    body: 'Positioning, vulnerabilities, and how-to-win — assembled from live signals, not a quarterly refresh someone forgot to schedule.',
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
            Watchtower tracks every competitor across 22 channels and turns raw pages into cited claims — not a diff
            feed you have to interpret yourself. Every signal traces to a source. Every gap says so.
          </p>
          <div className="mkt-hero-cta">
            <Link href="/sign-up" className="btn btn-on-navy btn-lg">Start free — no card</Link>
            <Link href="#brain" className="btn btn-on-navy-ghost btn-lg">See how it works</Link>
          </div>
          <p className="mkt-hero-note">Self-serve from $99/mo. No demo required to see it run.</p>
        </div>
        <div className="mkt-hero-device">
          <div className="wrap">
            <LiveFeedDemo />
          </div>
        </div>
      </section>

      <section className="mkt-stats">
        <div className="wrap">
          <div className="mkt-stat">
            <span className="n mono">22</span>
            <span className="l">channels tracked — ads, hiring, product, pricing, reviews, tech stack</span>
          </div>
          <div className="mkt-stat">
            <span className="n mono">&lt;60s</span>
            <span className="l">target full crawl time, parallelized per competitor</span>
          </div>
          <div className="mkt-stat">
            <span className="n mono">$99</span>
            <span className="l">self-serve monthly floor — the category's norm is a five-figure annual contract</span>
          </div>
          <div className="mkt-stat">
            <span className="n mono">0</span>
            <span className="l">fabricated signals. Unfetchable rows are skipped and logged, never guessed</span>
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
                Most competitive intelligence tools alert on the diff and stop — which means every alert still needs
                a human to read the page, decide what changed, and decide whether it matters. That&apos;s the manual
                curation burden buyers complain about across this entire category, and it isn&apos;t a training
                problem. It&apos;s what happens when the unit of record is &ldquo;a page changed&rdquo; instead of
                &ldquo;a claim changed.&rdquo;
              </p>
              <p className="lede">
                Watchtower extracts the actual claim, tracks it as a first-class object with its own history, and
                only surfaces what&apos;s genuinely new or changed. The rest is reaffirmation — which raises
                confidence instead of triggering an alert.
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
            No black box. Every step is inspectable, and every one has an honest failure mode — a row that can&apos;t
            be fetched is skipped and logged, never invented.
          </p>
          <div className="mkt-pipeline">
            <div className="mkt-step">
              <div className="sn">01 — CAPTURE</div>
              <h4>Discover &amp; capture</h4>
              <p>Sitemap, crawl, and Wayback CDX unioned to find pricing pages, changelogs, and comparison pages — including deleted ones.</p>
            </div>
            <div className="mkt-step">
              <div className="sn">02 — EXTRACT</div>
              <h4>Extract claims</h4>
              <p>Structured, cited extraction — one claim per unit, quoted from the source sentence. Nothing paraphrased into existence.</p>
            </div>
            <div className="mkt-step">
              <div className="sn">03 — RECONCILE</div>
              <h4>Dedupe &amp; contradict</h4>
              <p>Matched against prior claims (new / reaffirmed / changed) and against your own feature truth table for direct contradictions.</p>
            </div>
            <div className="mkt-step">
              <div className="sn">04 — ROUTE</div>
              <h4>Route to a battlecard</h4>
              <p>Scored on source credibility and repetition, then inserted into the right section — or queued for review, or discarded as noise.</p>
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
          <span className="mkt-eyebrow">Built to be verifiable</span>
          <h2>If we can&apos;t source it, we don&apos;t show it.</h2>
          <p className="lede">
            No placeholder text, no confidence score standing in for a citation, no quiet retry loop pretending a
            failure didn&apos;t happen. This is the actual failure state, shown in the product — not hidden in a log
            file only we can see.
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
                <p>&ldquo;fathomlabs.com/enterprise — unfetchable, robots-blocked. Skipped.&rdquo;</p>
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
            <Link href="/sign-up" className="btn btn-on-navy btn-lg">Start free — no card</Link>
            <Link href="/contact" className="btn btn-on-navy-ghost btn-lg">Talk to us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
