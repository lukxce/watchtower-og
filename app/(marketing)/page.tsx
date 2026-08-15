import Link from 'next/link';

export const metadata = {
  title: 'Watchtower · While you slept, your market moved.',
  description:
    'Watchtower tracks every pricing change, launch, hire, ad blitz and funding round across your competitors, reads them together, and hands you the next move. Every fact cited. From $99/mo.',
};

// The watch log in the hero is real output, not lorem: every line below is a
// genuine signal type this product produced against real competitors, worded
// exactly the way the feed words it.
const LOG: { t: string; text: string; tag: string; cls: string }[] = [
  { t: '02:14', text: 'cert log · new hostname: launch.grin.co', tag: 'buildout', cls: 'lg-p' },
  { t: '06:00', text: 'the daily watch begins · 6 competitors · 22 channels', tag: 'crawl', cls: 'lg-m' },
  { t: '06:07', text: 'grin.co/pricing changed · self-serve tiers are live', tag: 'pricing', cls: 'lg-p' },
  { t: '06:11', text: 'Upfluence: 66 new ads observed · 43 Google · 23 LinkedIn', tag: 'ads', cls: 'lg-g' },
  { t: '06:48', text: 'CreatorIQ: 25 open roles · enterprise CS cluster', tag: 'hiring', cls: 'lg-g' },
  { t: '07:02', text: 'Hypefy raises $7.2M Series A · covered by 5 outlets', tag: 'news', cls: 'lg-m' },
  { t: '07:30', text: 'the Tower updated a briefing · “Grin: mid-transition, tearing out the old model”', tag: 'the tower', cls: 'lg-b' },
  { t: '07:31', text: 'battlecard refreshed · how you win, updated', tag: 'battlecard', cls: 'lg-b' },
];

const SOURCES = [
  'Pricing pages', 'Ad libraries', 'Job boards', 'Certificate logs', 'Press & news', 'G2 & Trustpilot', 'Changelogs', 'LinkedIn',
];

const ENGINE = [
  { title: 'Bundled, not dumped.', body: 'Ten ads in a day is one card, not ten alerts.' },
  { title: 'Read together.', body: 'One whole-picture briefing per competitor, not a pile of pings.' },
  { title: 'Sourced, always.', body: 'Every line links to where it came from, and when.' },
];

export default function Home() {
  return (
    <>
      <section className="mkt-hero" id="product">
        <div className="wrap">
          <span className="kicker"><span className="nw-beacon" />Scouts gather. The Tower sees.</span>
          <h1 className="mkt-h1">Know your competitors&apos; <span className="accent">next&nbsp;move</span>, before your customers do.</h1>
          <p className="mkt-dek">Actionable intelligence, not a pile of alerts. Every fact cited, updated daily.</p>
          <div className="mkt-hero-cta">
            <Link href="/sign-up" className="btn btn-primary btn-lg">Start free, no card required</Link>
            <Link href="#platform" className="btn btn-ghost btn-lg">See a real battlecard ↓</Link>
          </div>
          <p className="mkt-hero-note">Self-serve from $99/mo · no demo call · signals within the hour</p>
        </div>
        <div className="mkt-hero-device">
          <div className="wrap">
            <div className="shot-frame">
              <div className="shot-bar"><span /><span /><span /></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/screenshots/overview.png" alt="The Watchtower overview: market activity chart, bundled highlights, threat index, coverage, and per-competitor reads" className="shot-img" />
            </div>
          </div>
        </div>
      </section>

      <section className="source-strip">
        <div className="wrap">
          <span className="source-label">22 channels of real public data, not guesses</span>
          <div className="source-row">
            {SOURCES.map((s) => <span key={s}>{s}</span>)}
          </div>
        </div>
      </section>

      <section className="mkt-section" id="platform">
        <div className="wrap">
          <span className="mkt-eyebrow">Actionable intelligence</span>
          <h2>We watch everything. You just get told what matters.</h2>
          <p className="lede big">
            Know when they cut a price. Know when they&apos;re about to launch. Know when they mention you by name.
            Know what their ads say, and who they&apos;re chasing. Know what their founders are telling the press.
            You don&apos;t pick channels, you just get told what changed, and why it matters.
          </p>
          <div className="platform-one">
            <div className="shot-frame light">
              <div className="shot-bar"><span /><span /><span /></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/screenshots/battlecards.png" alt="A Watchtower battlecard: the Tower's read, strengths, vulnerabilities, and how you win" className="shot-img" />
            </div>
            <p className="platform-caption">A real battlecard from a real workspace, tracking five real competitors right now.</p>
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="wrap">
          <div className="mkt-2col">
            <div>
              <span className="mkt-eyebrow">Every morning</span>
              <h2>Ten seconds to the state of your market.</h2>
              <p className="lede">
                Sixty-six ads is one card, not sixty-six alerts. Five articles about the same raise is one story.
                You read what mattered, not everything that happened.
              </p>
            </div>
            <div className="nw-log" aria-label="A real morning of Watchtower signals">
              <div className="nw-log-head">
                <span className="mono">this morning&apos;s signals</span>
                <span className="nw-live"><span />live</span>
              </div>
              {LOG.map((l, i) => (
                <div className={`nw-line ${l.cls}`} key={i} style={{ animationDelay: `${0.35 + i * 0.5}s` }}>
                  <span className="nw-t mono">{l.t}</span>
                  <span className="nw-txt">{l.text}</span>
                  <span className="nw-tag mono">{l.tag}</span>
                </div>
              ))}
              <p className="nw-log-note">Real signal types from a live workspace, worded exactly as the feed words them.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-section alt">
        <div className="wrap">
          <span className="mkt-eyebrow">No false fires</span>
          <h2>If we can&apos;t verify it, we don&apos;t show it.</h2>
          <p className="lede">
            No fabricated rows, no confidence-score hand-waving, no silent failures. When a page can&apos;t be fetched,
            the log says so, in the product, where you can see it.
          </p>
          <div className="mkt-3up">
            {ENGINE.map((e) => (
              <div className="engine-card" key={e.title}>
                <h4>{e.title}</h4>
                <p>{e.body}</p>
              </div>
            ))}
          </div>
          <div className="trust-mock">
            <div className="row">
              <div className="trust-card">
                <span className="te">New signal</span>
                <p>&ldquo;Fathom Labs published a compare page targeting our SOC 2 gap.&rdquo;</p>
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
          <h2>Start at $99. See value in an hour.</h2>
          <p className="lede">The incumbents quote five figures after a demo call. We publish prices and let the product do the demo.</p>
          <div className="mkt-tiers">
            <div className="tier">
              <span className="tier-tag">Starter</span>
              <h3>Self-serve</h3>
              <div className="price">$99<span>/mo</span></div>
              <p className="tier-note">3 competitors · watched daily</p>
              <ul>
                <li>Bundled signal feed &amp; Threat Index</li>
                <li>Comparison-page discovery</li>
                <li>Weekly digest</li>
              </ul>
              <Link href="/sign-up" className="btn btn-ghost">Start free</Link>
            </div>
            <div className="tier on">
              <span className="tier-tag">Growth</span>
              <h3>Full coverage</h3>
              <div className="price">$399<span>/mo</span></div>
              <p className="tier-note">10 competitors · all channels</p>
              <ul>
                <li>Everything in Starter</li>
                <li>Reads &amp; auto-generated battlecards</li>
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
          <div className="mkt-cta-inner">
            <span className="kicker">Get started</span>
            <h2>Stop being the last to know.</h2>
            <p className="lede">Tell us who you are and pick your competitors, or let the Tower recommend them. Real, sourced signals appear inside an hour.</p>
            <div className="mkt-hero-cta">
              <Link href="/sign-up" className="btn btn-on-navy btn-lg">Start free, no card required</Link>
              <Link href="/contact" className="btn btn-on-navy-ghost btn-lg">Talk to us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
