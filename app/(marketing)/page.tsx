import Link from 'next/link';

export const metadata = {
  title: 'Watchtower · While you slept, your market moved.',
  description:
    'Watchtower tracks every pricing change, launch, hire, ad blitz and funding round across your competitors. The Keeper reads them together and hands you the next move. Every fact cited. From $99/mo.',
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
  { t: '07:30', text: 'the Keeper updated a briefing · “Grin: mid-transition, tearing out the old model”', tag: 'the keeper', cls: 'lg-b' },
  { t: '07:31', text: 'battlecard refreshed · how you win, updated', tag: 'battlecard', cls: 'lg-b' },
];

const STORY = [
  {
    n: '01',
    title: 'A hostname appears',
    body: 'One quiet ping on the public certificate log: launch.grin.co. Most tools would forward it to you raw, or miss it entirely.',
    cite: 'source: crt.sh, cited in-product',
  },
  {
    n: '02',
    title: 'Context, already on file',
    body: 'GRIN’s own press from January 27, 2026 was sitting in the workspace: instant self-serve access, month-to-month billing, the enterprise-only model over.',
    cite: 'source: GRIN press release, Jan 27 2026',
  },
  {
    n: '03',
    title: 'The Keeper connects them',
    body: 'The Keeper writes the briefing: “Grin is mid-transition, tearing out the old model.” Confident, and not because an AI guessed. Their own announcement confirms what the hostname implies.',
    cite: 'one read per competitor, every fact dated',
  },
  {
    n: '04',
    title: 'Your team moves',
    body: 'The battlecard updates itself: migration friction for their Classic customers, proven “GRIN alternatives” search demand, and literally how you win.',
    cite: 'personalized to your company, not abstract advice',
  },
];

const WATCH = [
  {
    title: 'Pricing & packaging',
    body: 'A tier gets cheaper, a feature moves behind a paywall, a plan quietly disappears. You hear about it that morning, not from a lost deal three weeks later.',
    icon: <><path d="M12 3.5v17" strokeLinecap="round" /><path d="M16 7.2c-.8-1.3-2.3-2-4-2-2.3 0-4 1.2-4 3 0 3.9 8 2.1 8 6 0 1.9-1.8 3.1-4 3.1-1.9 0-3.4-.8-4.2-2.2" strokeLinecap="round" /></>,
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
    body: 'Sixty-six new ads is one bundled card with the platform and format mix, not sixty-six alerts. Which platforms, aimed at whom, where the money points.',
    icon: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /></>,
  },
  {
    title: 'Reviews & reputation',
    body: 'The complaints buried in their G2 and Trustpilot reviews are your objection-handling script. We collect them for you.',
    icon: <path d="M12 3.5l2.5 5.2 5.7.7-4.2 3.9 1.1 5.6-5.1-2.8-5.1 2.8 1.1-5.6L3.8 9.4l5.7-.7Z" strokeLinejoin="round" />,
  },
  {
    title: 'News, funding & events',
    body: 'A funding round covered by five outlets is one story with five citations, not five signals. Plus executive moves, partnerships, and the wider industry pulse.',
    icon: <><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M8 9.5h8M8 13h5" strokeLinecap="round" /></>,
  },
];

const ENGINE = [
  {
    title: 'Bundled, not dumped.',
    body: 'Ten ads on the same day is one thing that happened. The same story in five outlets is one story. You read what mattered, not what was detected.',
  },
  {
    title: 'Read by the Keeper.',
    body: 'Every competitor gets one whole-picture briefing: moves, buildouts, and hiring, read together by the Keeper. Not a pile of disconnected alerts.',
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
          <span className="kicker"><span className="nw-beacon" />Scouts gather. The Tower sees. The Keeper reads.</span>
          <h1 className="mkt-h1">While you slept, <span className="accent">your market moved.</span></h1>
          <p className="mkt-dek">
            Your scouts track every pricing change, launch, hire, ad blitz and funding round across your
            competitors. The Keeper reads them together and hands you the next move. Every fact cited.
          </p>
          <div className="mkt-hero-cta">
            <Link href="/sign-up" className="btn btn-primary btn-lg">Start free, no card required</Link>
            <Link href="#brain" className="btn btn-ghost btn-lg">How the brain works ↓</Link>
          </div>
          <p className="mkt-hero-note">Self-serve from $99/mo · no demo call · signals within the hour</p>
        </div>
        <div className="mkt-hero-device">
          <div className="wrap" style={{ position: 'relative' }}>
            <div className="float-chip fc-1">
              <span className="fc-ic v"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" strokeLinejoin="round" /></svg></span>
              <span>6 new signals this morning<span className="fc-sub">bundled · every one cited</span></span>
            </div>
            <div className="float-chip fc-3">
              <span className="fc-ic m"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 19c1.5-4.5 3-7.5 7-11.5 2.5-2.5 6-3 7-2s.5 4.5-2 7C13 16.5 10 18 5.5 19.5Z" strokeLinejoin="round" /></svg></span>
              <span>Grin is preparing a launch<span className="fc-sub">launch.grin.co + their own press</span></span>
            </div>
            <div className="float-chip fc-2">
              <span className="fc-ic p"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 21a9 9 0 1 1 9-9" strokeLinecap="round" /><path d="M12 12l5-3" strokeLinecap="round" /></svg></span>
              <span>Threat 86 · ▲ +6 this week<span className="fc-sub">CreatorIQ</span></span>
            </div>
            <div className="shot-frame">
              <div className="shot-bar"><span /><span /><span /></div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/screenshots/overview.png" alt="The Watchtower overview: market activity chart, bundled highlights, threat index, coverage, and per-competitor reads" className="shot-img" />
            </div>
          </div>
        </div>
      </section>

      <section className="mkt-section" id="brain">
        <div className="wrap">
          <span className="mkt-eyebrow">How the brain works</span>
          <h2>One hostname appeared. Watchtower told the whole story.</h2>
          <p className="lede">
            A true sequence, from a live workspace. This is the difference between forwarding detections and doing
            intelligence: signals are read <em>together</em>, per competitor, and only claimed when the facts confirm it.
          </p>
          <div className="story-strip">
            {STORY.map((s) => (
              <div className="story-step" key={s.n}>
                <span className="story-n mono">{s.n}</span>
                <h4>{s.title}</h4>
                <p>{s.body}</p>
                <span className="story-cite mono">{s.cite}</span>
              </div>
            ))}
          </div>
          <p className="story-note">
            Where a connection is only timing, like a funding round followed by new hostnames, the read says exactly that
            instead of overclaiming. No false fires is a product law here, not a slogan.
          </p>
        </div>
      </section>

      <section className="mkt-section alt" id="watch">
        <div className="wrap">
          <span className="mkt-eyebrow">22 channels on the watch</span>
          <h2>If they ship it, price it, post it, or hire for it, you&apos;ll know.</h2>
          <p className="lede">Everything a competitor does in public, watched daily: their site, their ads, their job board, their reviews, their press.</p>
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

      <section className="mkt-section">
        <div className="wrap">
          <div className="mkt-2col">
            <div>
              <span className="mkt-eyebrow">Every morning</span>
              <h2>Ten seconds to the state of your market.</h2>
              <p className="lede">
                The watch runs daily. By the time you open it: one chart of real, dated market activity, the bundled
                highlights that matter, a read per competitor, and a battlecard that literally says how{' '}
                <em>your</em> company wins.
              </p>
              <p className="lede">
                No pile of alerts. Sixty-six ads is one card. Five articles about the same funding round is one story.
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
            <p className="lede">Tell us who you are and pick your competitors, or let the Keeper recommend them. Real, sourced signals appear inside an hour.</p>
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
