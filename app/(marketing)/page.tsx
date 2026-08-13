import Link from 'next/link';

export const metadata = {
  title: 'Watchtower — We watch your competitors. You get the next move.',
  description:
    'Pricing changes, launches, job posts, ad campaigns, reviews. Watchtower tracks it all, scores what matters, and hands your team the battlecard. From $99/mo.',
};

const WATCH = [
  {
    title: 'Pricing & packaging',
    body: 'A tier gets cheaper, a feature moves behind a paywall, a plan quietly disappears. You hear about it that morning, not from a lost deal three weeks later.',
    icon: <><path d="M12 3v18M7 7.5c0-1.4 2.2-2.5 5-2.5s5 1.1 5 2.5-2.2 2.5-5 2.5-5 1.1-5 2.5 2.2 2.5 5 2.5 5 1.1 5 2.5" strokeLinecap="round" /></>,
  },
  {
    title: 'Product & launches',
    body: 'Changelogs, app releases, new pages, and pre-launch subdomains like launch.grin.co, often visible weeks before the announcement.',
    icon: <><path d="M5 19c1.5-4.5 3-7.5 7-11.5 2.5-2.5 6-3 7-2s.5 4.5-2 7C13 16.5 10 18 5.5 19.5Z" strokeLinejoin="round" /><path d="M9 15l-1.5 4M15 9l4-1.5" strokeLinecap="round" /></>,
  },
  {
    title: 'Hiring',
    body: 'One job post is noise. Four senior ML roles in the same week is a roadmap. We flag the cluster and skip the noise.',
    icon: <><circle cx="12" cy="8" r="3.2" /><path d="M5 19c.8-3 3.5-4.6 7-4.6s6.2 1.6 7 4.6" strokeLinecap="round" /></>,
  },
  {
    title: 'Ads & campaigns',
    body: 'Which ads they run, on which platforms, aimed at whom, and which landing pages the money is pointed at.',
    icon: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>,
  },
  {
    title: 'Reviews & reputation',
    body: 'The complaints buried in their G2 and Trustpilot reviews are your objection-handling script. We collect them for you.',
    icon: <path d="M12 3.5l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6-5.1-2.8-5.1 2.8 1.1-5.6L3.8 9.4l5.7-.7Z" strokeLinejoin="round" />,
  },
  {
    title: 'News, funding & events',
    body: 'Funding rounds, executive moves, webinars, partnerships, plus a pulse on the wider industry so nothing blindsides you.',
    icon: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M8 9.5h8M8 13h5" strokeLinecap="round" /></>,
  },
];

const ENGINE = [
  {
    title: 'Scored, not dumped.',
    body: 'Every signal gets an impact score. A pricing change outranks a podcast appearance, and email-server noise never reaches you at all.',
  },
  {
    title: 'Summarized, not linked.',
    body: 'The feed tells you what changed, like “Starter dropped from $49 to $39,” not just that a page did. Nobody on your team re-reads their whole site.',
  },
  {
    title: 'Sourced, always.',
    body: 'Every line links to the page it came from, with a capture time. If we couldn’t verify something, it isn’t in your feed.',
  },
];

export default function Home() {
  return (
    <>
      <section className="mkt-hero" id="product">
        <div className="wrap">
          <span className="kicker">Competitive intelligence for operators</span>
          <h1 className="mkt-h1">
            We watch everything your competitors do. <span className="accent">You get the next move.</span>
          </h1>
          <p className="mkt-dek">
            Pricing changes, launches, job posts, ad campaigns, funding, reviews. Watchtower tracks it all, scores
            what actually matters, and hands your team the battlecard and the counter-move. Every fact links back to
            where we found it.
          </p>
          <div className="mkt-hero-cta">
            <Link href="/sign-up" className="btn btn-primary btn-lg">Start free, no card required</Link>
            <Link href="#watch" className="btn btn-ghost btn-lg">See what it watches</Link>
          </div>
          <p className="mkt-hero-note">Self-serve from $99/mo. No demo call. Signals within the hour.</p>
        </div>
        <div className="mkt-hero-device">
          <div className="wrap" style={{ position: 'relative' }}>
            <div className="float-chip fc-1">
              <span className="fc-ic v"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 5h16M4 12h16M4 19h10" strokeLinecap="round" /></svg></span>
              <span>Starter tier dropped to $39<span className="fc-sub">cite: northwind.com/pricing</span></span>
            </div>
            <div className="float-chip fc-2">
              <span className="fc-ic p"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21a9 9 0 1 1 9-9" strokeLinecap="round" /><path d="M12 12l5-3" strokeLinecap="round" /></svg></span>
              <span>Threat 86<span className="fc-sub">▲ +6 this week</span></span>
            </div>
            <div className="shot-frame">
              <div className="shot-bar"><span /><span /><span /></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/screenshots/overview.png" alt="The Watchtower overview: KPI cards, threat gauges, top signals, battlecards, industry pulse, and activity charts" className="shot-img" />
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-section" id="watch">
        <div className="wrap">
          <span className="mkt-eyebrow">What it watches</span>
          <h2>If they ship it, price it, post it, or hire for it, you&apos;ll know.</h2>
          <p className="lede">Everything a competitor does in public, watched daily, across their site, their ads, their job board, and their reviews.</p>
          <div className="mkt-grid">
            {WATCH.map((f) => (
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
          <span className="mkt-eyebrow">From signal to next move</span>
          <h2>A feed you finish in five minutes, because we did the reading.</h2>
          <p className="lede">Most tools forward you a pile of alerts and call it intelligence. Watchtower&apos;s job is to hand you conclusions.</p>
          <div className="mkt-3up">
            {ENGINE.map((e) => (
              <div className="engine-card" key={e.title}>
                <h4>{e.title}</h4>
                <p>{e.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="wrap">
          <span className="mkt-eyebrow">Battlecards</span>
          <h2>Battlecards in minutes, not quarters.</h2>
          <p className="lede">
            Pick a competitor and Watchtower writes the card from live signals: positioning, strengths,
            vulnerabilities, how you win, and the question to ask in discovery. When the landscape moves, the card
            moves with it, instead of waiting for someone to remember the quarterly refresh.
          </p>
          <div className="shot-frame light">
            <div className="shot-bar"><span /><span /><span /></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screenshots/battlecards.png" alt="A Watchtower battlecard: positioning, strengths, vulnerabilities, how to win, and the discovery question" className="shot-img" />
          </div>
        </div>
      </section>

      <section className="mkt-section alt">
        <div className="wrap">
          <span className="mkt-eyebrow">The landscape</span>
          <h2>The whole market on one screen.</h2>
          <p className="lede">A live threat index per competitor, a positioning map of the field, and who actually leads on what, computed from signals rather than vibes.</p>
          <div className="shot-frame light">
            <div className="shot-bar"><span /><span /><span /></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screenshots/competitors.png" alt="Watchtower's Competitors page: a market positioning map and per-competitor cards with live stats" className="shot-img" />
          </div>
        </div>
      </section>

      <section className="mkt-section">
        <div className="wrap">
          <span className="mkt-eyebrow">Why you can trust it</span>
          <h2>If we can&apos;t verify it, we don&apos;t show it.</h2>
          <p className="lede">
            No fabricated rows, no confidence-score hand-waving, no silent failures. When a page can&apos;t be
            fetched, the log says so, in the product, where you can see it.
          </p>
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

      <section className="mkt-section alt">
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
              <p className="tier-note">10 competitors · all channels</p>
              <ul>
                <li>Everything in Starter</li>
                <li>Auto-generated battlecards</li>
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
            <p className="lede">Pick two or three competitors. Watch real, sourced signals appear inside an hour.</p>
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
