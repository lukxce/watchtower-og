import Link from 'next/link';
import RotatingTail from './RotatingTail';

export const metadata = {
  title: 'Watchtower · Know the moment your competitors move.',
  description:
    'Watchtower reads everything your competitors do in public and tells you what it means. Actionable competitive intelligence, every fact cited. From $99/mo.',
};

// The watch panel in the hero. Real signal types, worded the way the feed
// words them — this is the product's own voice, not marketing copy about it.
const WATCH = [
  { t: '02:14', text: 'new hostname: launch.grin.co', tag: 'buildout' },
  { t: '06:07', text: 'grin.co/pricing changed · self-serve tiers live', tag: 'pricing' },
  { t: '06:11', text: 'Upfluence: 66 new ads · 43 Google · 23 LinkedIn', tag: 'ads' },
  { t: '06:48', text: 'CreatorIQ: 25 open roles · enterprise CS cluster', tag: 'hiring' },
  { t: '07:30', text: '“Grin is mid-transition, tearing out the old model”', tag: 'the tower', hot: true },
];

const BEATS = [
  { k: '02:14', h: 'A hostname appears', p: 'launch.grin.co shows up on a public certificate log. On its own, it is noise.' },
  { k: 'on file', h: 'Context is already there', p: 'Grin’s own January press: self-serve access, month-to-month, enterprise-only model over.' },
  { k: '07:30', h: 'The Tower connects them', p: 'One read, written for you: Grin is mid-transition, and here is the crack to sell into.' },
];

export default function Home() {
  return (
    <>
      {/* ---------- hero: the sentence finishes itself ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-kicker"><i />Scouts gather. The Tower sees.</span>
            <h1 className="wt-h1">
              Know the moment they{' '}
              <RotatingTail />
            </h1>
            <p className="wt-dek">
              Watchtower reads everything your competitors do in public, then tells you what it means.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="#proof" className="btn btn-ghost btn-lg">See it working ↓</Link>
            </div>
            <p className="wt-note">From $99/mo · no demo call · no card required</p>
          </div>

          <aside className="wt-panel" aria-label="A live morning of Watchtower signals">
            <div className="wt-panel-head">
              <span className="mono">the watch</span>
              <span className="wt-live"><i />live</span>
            </div>
            {WATCH.map((w, i) => (
              <div className={`wt-row${w.hot ? ' hot' : ''}`} key={w.t} style={{ animationDelay: `${0.4 + i * 0.45}s` }}>
                <span className="wt-row-t mono">{w.t}</span>
                <span className="wt-row-x">{w.text}</span>
                <span className="wt-row-g mono">{w.tag}</span>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* ---------- everything, said once, conversationally ---------- */}
      <section className="wt-band">
        <div className="wrap">
          <h2 className="wt-band-h">
            We watch everything they do in public. You just get told what matters.
          </h2>
          <p className="wt-band-p">
            Their prices, their ads, their job board, their reviews, their press, the pages they quietly
            put up before a launch, and what their founders promised on a podcast. You never pick a channel.
          </p>
        </div>
      </section>

      {/* ---------- proof: one real morning ---------- */}
      <section className="wt-proof" id="proof">
        <div className="wrap">
          <span className="wt-eyebrow">A real morning</span>
          <h2 className="wt-h2">One hostname appeared. Watchtower told the whole story.</h2>
          <div className="wt-beats">
            {BEATS.map((b) => (
              <div className="wt-beat" key={b.h}>
                <span className="wt-beat-k mono">{b.k}</span>
                <h3>{b.h}</h3>
                <p>{b.p}</p>
              </div>
            ))}
          </div>
          <p className="wt-fine">
            Where a connection is only timing, the read says exactly that. If a page cannot be verified, it does not appear.
          </p>
        </div>
      </section>

      {/* ---------- the artifact ---------- */}
      <section className="wt-card-sec" id="platform">
        <div className="wrap">
          <div className="wt-card-copy">
            <span className="wt-eyebrow">The artifact</span>
            <h2 className="wt-h2">Then it writes how you win.</h2>
            <p className="wt-lede">
              One briefing per competitor, written against your positioning, refreshed every morning. Your reps
              open it and know what to say.
            </p>
          </div>
          <div className="wt-shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screenshots/battlecards.png" alt="A Watchtower battlecard: the Tower's read, their strengths, their vulnerabilities, and how you win" />
          </div>
          <p className="wt-cap">A real battlecard, from a workspace tracking five real competitors right now.</p>
        </div>
      </section>

      {/* ---------- pricing ---------- */}
      <section className="wt-pricing">
        <div className="wrap">
          <span className="wt-eyebrow">Pricing</span>
          <h2 className="wt-h2">Published, because we are not afraid of it.</h2>
          <p className="wt-lede">The incumbents quote five figures after a demo call. Start today for $99.</p>
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

      {/* ---------- close ---------- */}
      <section className="wt-close">
        <div className="wrap">
          <h2>Stop being the last to know.</h2>
          <p>Name your competitors, or let the Tower name them. Real signals inside the hour.</p>
          <div className="wt-cta">
            <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
            <Link href="/contact" className="btn btn-ghost btn-lg">Talk to us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
