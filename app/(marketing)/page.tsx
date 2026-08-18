import Link from 'next/link';
import RotatingTail from './RotatingTail';
import BattlecardDemo from './BattlecardDemo';
import FogPanel from './FogPanel';

export const metadata = {
  title: 'Fortress HQ · Know the moment your competitors move.',
  description:
    'Fortress HQ turns everything your competitors do in public into one briefing that says what it means and what to do. Every fact cited. From $149/mo.',
};

// Real lines from our own workspace, worded the way the feed words them.
// These are our actual competitors, not a borrowed example set.
const WATCH = [
  { t: '05:40', text: 'Visualping: 11 ads live across Google', tag: 'ads' },
  { t: '05:52', text: 'mcp-adapter.app.klue.com is live in production', tag: 'buildout' },
  { t: '06:07', text: 'crayon.co is hiring again · 3 roles opened', tag: 'hiring' },
  { t: '06:48', text: 'Signal Labs: 10 ads live, still zero press coverage', tag: 'gap' },
  { t: '07:30', text: '“Klue is building AI voice interviewing into win-loss, unannounced”', tag: 'the tower', hot: true },
];

// The story is ours, and it is built from two absences — the kind of thing a
// feature-comparison tool would never notice.
const BEATS = [
  { k: '02:14', h: 'Three hostnames appear', p: 'interview.klue.com, interviewer-v2.klue.com and voice.klue.com turn up on the public certificate log. Nobody announced anything.' },
  { k: 'on file', h: 'The context was already there', p: 'Klue runs win-loss interviews as a core motion, and spent this year publishing agentic-workflow workshops and an AI report.' },
  { k: '07:30', h: 'The Tower connects them', p: 'Three hostnames given over to interviewing and voice is real engineering commitment, not an experiment. They are building it. Nobody has announced it.' },
];

export default function Home() {
  return (
    <>
      {/* ---------- hero: headline, then the product itself ---------- */}
      <section className="wt-hero">
        <div className="wrap wt-hero-grid">
          <div className="wt-hero-copy">
            <span className="wt-over">Competitive intelligence</span>
            <span className="wt-kicker"><i />On watch · 24/7 · every public source</span>
            <h1 className="wt-h1">
              Know the moment <span className="wt-keep">they <RotatingTail /></span>
            </h1>
            <p className="wt-dek">
              One briefing every morning that says what changed, why it matters, and what to do about it. Every fact cited.
            </p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
              <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo →</Link>
            </div>
            <p className="wt-note">From $149/mo · no card required<span className="wt-note-x"> · the demo needs no account</span></p>
          </div>

          {/* The product itself, bleeding off the right edge so it reads as
              part of the hero rather than a slab dropped under it. */}
          <div className="wt-hero-shot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/screenshots/overview.png" alt="The Fortress HQ dashboard: market activity, competitor ratings, biggest threat and launch radar" />
          </div>
        </div>
      </section>

      {/* ---------- fog of war: the pitch as an interaction ---------- */}
      <section className="wt-fogsec">
        <div className="wrap">
          <span className="wt-eyebrow">Fog of war</span>
          <h2 className="wt-h2">Most of your market happens in the dark.</h2>
          <p className="wt-lede">
            All of this is public. None of it is anywhere you look. Sweep the light.
          </p>
          <FogPanel />
        </div>
      </section>

      {/* ---------- what it catches, as things that happen ---------- */}
      <section className="wt-band">
        <div className="wrap wt-band-grid">
          <div>
            <span className="wt-eyebrow">Scouts gather</span>
            <h2 className="wt-band-h">You never watch a channel. You just get told what happened.</h2>
            <p className="wt-band-p">
            They quietly drop a price. They start advertising a feature they have not launched yet. They post four
            senior roles in one week. They pick up a bad review that names you. Their founder promises something
            on a podcast. A hostname goes up that nobody was meant to see.
            </p>
          </div>

          {/* the feed itself, right where the claim is made — this column was
              empty and the page sagged here */}
          <aside className="wt-panel" aria-label="A morning of Fortress HQ signals">
            <div className="wt-panel-head">
              <span className="mono">first light · 06:04</span>
              <span className="wt-live"><i />live</span>
            </div>
            {WATCH.map((w, i) => (
              <div className={`wt-row${w.hot ? ' hot' : ''}`} key={w.t} style={{ animationDelay: `${0.1 + i * 0.14}s` }}>
                <span className="wt-row-t mono">{w.t}</span>
                <span className="wt-row-x">{w.text}</span>
                <span className="wt-row-g mono">{w.tag}</span>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* ---------- the artifact, interactive ---------- */}
      <section className="wt-card-sec" id="platform">
        <div className="wrap">
          {/* Deliberately "The Tower", not the company name — this section is
              the reasoning layer's own byline, and the Tower is who lives
              inside the walls and does the reading. See BRAND.md §1. */}
          <span className="wt-eyebrow">The Tower</span>
          <h2 className="wt-h2">Then it writes how you win.</h2>
          <p className="wt-lede">
            One briefing per competitor, written against your positioning. These are real cards from our own
            workspace, watching our own market. Switch between them.
          </p>
          <BattlecardDemo />

          <div className="wt-inline-cta">
            <p>Everything above was found, checked, connected and written by the product itself, from public signals about our own market. Nobody typed a word of it.</p>
            <div className="wt-cta">
              <Link href="/sign-up" className="btn btn-primary">Start free</Link>
              <Link href="/demo" className="btn btn-ghost">See the live demo →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- proof: two absences, one conclusion ---------- */}
      <section className="wt-proof" id="proof">
        <div className="wrap">
          <span className="wt-eyebrow">A real find, from our own workspace</span>
          <h2 className="wt-h2">Klue is shipping an AI interviewer. They have not said so.</h2>
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

      {/* ---------- pricing ---------- */}
      <section className="wt-pricing">
        <div className="wrap">
          <span className="wt-eyebrow">Pricing</span>
          <h2 className="wt-h2">Published, because we are not afraid of it.</h2>
          <p className="wt-lede">The incumbents quote five figures after a demo call. Start today for $149.</p>
          <div className="mkt-tiers">
            <div className="tier">
              <span className="tier-tag">Starter</span>
              <h3>Self-serve</h3>
              <div className="price">$149<span>/mo</span></div>
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
          <p>Name your competitors, or let the Tower find them. Real signals inside the hour.</p>
          <div className="wt-cta">
            <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
            <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo</Link>
          </div>
        </div>
      </section>
    </>
  );
}
