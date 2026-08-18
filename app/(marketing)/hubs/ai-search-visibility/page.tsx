import Link from 'next/link';

export const metadata = {
  title: 'AI Search Visibility — Fortress HQ',
  description:
    "We don't track your ChatGPT or Perplexity citations yet. Here's what we track today that gets most of the way there, and why we think we're the right team to build the rest.",
};

const PERSONAS = [
  { role: 'Founder / CEO · 10–150 staff', h: 'Kept up by being the last to know', p: 'Increasingly that includes not knowing what an AI tool told a buyer about you five minutes before they emailed. This hub is the honest version of that worry — what we already track that\'s adjacent, and what we genuinely don\'t track yet.' },
  { role: 'Product marketing · often a team of one', h: 'Kept up by a question nobody can answer yet', p: '"Are we winning inside ChatGPT\'s answers" is a real question with no honest tool-backed answer today, ours included. What is live — classified brand mentions, verified press tracking — is the foundation any real answer to that question would need.' },
];

const CHANNEL_SAMPLE = ['News & press', 'YouTube', 'Podcasts', 'Reddit', 'Product Hunt', 'LinkedIn company posts', 'Newsletters & sequences', 'Funding & M&A'];

const TIERS = [
  { name: 'Starter', price: '$149/mo', note: '3 competitors · watched daily', items: ['News & press, YouTube, podcasts, Reddit, Product Hunt, newsletters — all live from day one', 'Funding & M&A, keyless', 'Every mention classified before it reaches your feed'] },
  { name: 'Growth', price: '$399/mo', note: '10 competitors · full coverage', items: ['Adds LinkedIn company posts — the one Voice & PR channel that needs a licensed vendor, the same way G2 and Capterra do'] },
  { name: 'Enterprise', price: 'Talk to us', note: 'Unlimited competitors', items: ['Same channel set as Growth, at scale', 'No AI-citation feature exists at any tier yet — there is nothing extra to gate here, and we won\'t pretend otherwise'] },
];

const MECH = [
  {
    h: 'It would start as a scout, not a shortcut',
    p: 'One more collector reporting into the same Tower, following the identical pattern the 28 live channels already follow — it does its job, or it says plainly why it didn\'t. No special-cased AI feature that plays by different rules than website & pricing or subdomains does. If it can\'t reach an answer engine on a given run, it reports that honestly, the same way subdomains reports a rate-limited certificate log rather than pretending nothing changed.',
  },
  {
    h: 'It would need repeatable, verifiable queries — not a screenshot',
    p: 'A screenshot of a ChatGPT answer to one prompt on one day is a sample, not a channel. Any real citation-tracking scout would need a defined, repeatable query set and a way to log what came back each time, timestamped, so a change in the answer is a tracked event rather than something someone half-remembers noticing once. Without that discipline it isn\'t a monitoring capability, it\'s a party trick dressed up as one.',
  },
  {
    h: 'Every mention would go through the same classification pass',
    p: 'A brand name surfacing inside an AI answer would need to be checked — is this actually the client, a same-named entity, or noise — the identical corollary work every other channel already does before anything reaches your feed. We wouldn\'t ship a channel that skips the discipline the other 28 don\'t get to skip.',
  },
  {
    h: 'It would compose into the existing read, not live in its own silo',
    p: 'An AI-citation signal would sit alongside pricing, hiring, ads and reviews in the same per-competitor synthesis the Tower already runs — not a separate "AI visibility" dashboard bolted on the side that nobody reads together with the rest. The whole point of reading channels together instead of separately is that a citation shift means more next to a pricing change or a launch than it does sitting alone on its own screen.',
  },
  {
    h: 'It would carry a source, or it wouldn\'t be shown at all',
    p: 'No dashboard number implying a measured "AI visibility score" until there is something underneath it that can be cited the same way every other conclusion in the product already has to be. A number with no source fails the bar the rest of this product is held to, so it doesn\'t ship until it clears it.',
  },
  {
    h: 'Internals before the interface — the same order as everything else',
    p: 'Every one of the 28 live channels was built quiet infrastructure first, customer-facing claim second, and this page is itself evidence of that habit rather than an exception to it. This would be no different: we\'d rather take longer and say "not yet" than ship a page implying more than the collector actually does, the same way we\'d rather publish this page than a features list that quietly rounds "not built" up to "built."',
  },
];

const AISV_FAQ = [
  {
    q: 'So does citation tracking inside ChatGPT, Perplexity or Gemini exist in the product today?',
    a: 'No. Not partially, not in beta, not behind a flag. It is a genuinely unbuilt capability, and this page exists to say that plainly rather than let a features list imply otherwise. If you came here hoping to buy it, you can\'t yet — and we\'d rather lose that sale honestly than take it dishonestly.',
  },
  {
    q: 'Why publish a whole page about something you haven\'t built?',
    a: 'Because buyers are already asking about it, and the two dishonest options — staying silent and hoping nobody notices, or quietly implying we do it — both fail our own standard. The honest option is to say exactly where we stand: what we already track that gets partway there, what\'s missing, and why we think we\'re positioned to build it well when we do.',
  },
  {
    q: 'What exactly would need to be true before you\'d ship this?',
    a: 'A query methodology we could stand behind as repeatable rather than a one-off prompt — the same discipline every other channel already has. Until we can build a scout that meets the same evidence bar as the 28 running today, we\'d rather not ship a weaker version just to have a checkbox.',
  },
  {
    q: 'Are you tracking anything AI-related today, even partially?',
    a: 'Not citations inside an AI answer engine, no. What is live is the discipline that any AI-citation channel would need to sit on top of: verified sources, classified mentions, disclosed gaps. That is not a consolation feature — it is the hard part of building this correctly, and it is already running underneath the 28 channels we do have.',
  },
  {
    q: 'Is anyone else in this category actually doing this today, that you can verify?',
    a: 'Not that we can confirm as a live, independently checkable feature — and if we can\'t verify a competitor\'s claim, we don\'t repeat it as fact, the same standard we hold our own numbers to. A marketing page claiming "AI visibility tracking" is easy to write; whether it holds up to the same evidence bar this page is asking of us is a different question, and not one we\'ll answer on someone else\'s behalf.',
  },
  {
    q: 'Will this cost extra when it ships, or is it part of an existing tier?',
    a: 'We haven\'t decided, and we won\'t pretend we have. Announcing pricing for a feature that doesn\'t exist yet is exactly the kind of claim this whole page is trying not to make.',
  },
  {
    q: 'When will this ship?',
    a: 'We\'re not going to give you a date we can\'t hold to. What we can tell you is the order: the discipline underneath it (verified sourcing, classification, disclosed gaps) is already built and running for 28 other channels, which is the hard, unglamorous part. Building the specific collector for AI answer engines on top of that foundation is the next real step — we just haven\'t said "shipped" until it\'s actually shipped.',
  },
  {
    q: 'Could I get early access or join a beta for this?',
    a: 'There isn\'t a formal beta program for this specific capability right now — it wouldn\'t be honest to invite people into a waitlist for something that hasn\'t reached a design we\'d stand behind yet. If that changes, it\'ll be announced the same way everything else on this page is written: plainly, and only once it\'s real.',
  },
];

export default function AiSearchVisibilityHub() {
  return (
    <div className="hbx">
      <section className="hbx-hero">
        <div className="wrap">
          <span className="hbx-crumb">AI search visibility</span>
          <h1 className="mkt-h1" style={{ marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Buyers are asking ChatGPT to compare you before they hit your site.
          </h1>
          <p className="lede" style={{ marginLeft: 0, textAlign: 'left' }}>
            &ldquo;Most of your market happens in the dark&rdquo; used to mean the pages nobody checks. Increasingly it
            means the conversation happening inside a chat window, where a buyer asks an AI tool to shortlist
            vendors and gets an answer built from whatever that model has read and trusts. That answer is public in
            the sense that it&apos;s reachable &mdash; it just isn&apos;t watched by anyone yet, including us.
          </p>
        </div>
      </section>

      <section className="hbx-stats">
        <div className="wrap">
          <div className="hbx-stat-grid">
            <div className="hbx-stat"><span className="n">28</span><span className="l">Public channels watched daily, today &mdash; none of them an AI answer engine, yet</span></div>
            <div className="hbx-stat"><span className="n">7</span><span className="l">Voice &amp; PR channels already tracking how competitors are talked about in public</span></div>
            <div className="hbx-stat"><span className="n">100%</span><span className="l">Of mentions classified as client, same-name, or noise before they reach your feed</span></div>
            <div className="hbx-stat"><span className="n">$149/mo</span><span className="l">Starter, published &mdash; the same price whether a feature is shipped or roadmap</span></div>
            <div className="hbx-stat"><span className="n">1</span><span className="l">Corporate channel &mdash; funding &amp; M&amp;A, keyless &mdash; the kind of fact an AI answer would need to surface too</span></div>
            <div className="hbx-stat"><span className="n">0 / 3</span><span className="l">Of the major AI answer engines (ChatGPT, Perplexity, Gemini) currently tracked by this product</span></div>
            <div className="hbx-stat"><span className="n">3</span><span className="l">In-build product layers ahead of an API &mdash; Ask-the-Tower, standing orders, exportable reports</span></div>
          </div>
        </div>
      </section>

      <section className="hbx-argument">
        <div className="wrap">
          <div className="hbx-panel">
            <h2>We don&apos;t track your ChatGPT citations yet.</h2>
            <p>
              Here&apos;s why we think we&apos;re the right team to build it, and what we already track today that gets us
              most of the way there. Live citation tracking inside ChatGPT, Perplexity, Gemini or any other AI answer
              engine is not a shipped Fortress HQ capability. It isn&apos;t something we quietly do in the background
              either &mdash; it simply isn&apos;t built. Anyone who tells you their tool fully monitors this today is
              either overstating a sample of manual prompt checks, or asking you to trust a black box. We&apos;d rather
              say we don&apos;t have it yet.
            </p>
            <p>
              What we do have is the same discipline that would need to sit underneath a feature like that: sources
              that are verified rather than guessed, mentions that are classified rather than keyword-matched, and
              gaps that are disclosed instead of papered over. That&apos;s not a consolation prize &mdash; it&apos;s the hard
              part of building this correctly, and it&apos;s already running.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-split">
        <div className="wrap">
          <span className="wt-eyebrow">Where we actually stand</span>
          <h2 className="wt-h2">What&apos;s live today, and what genuinely isn&apos;t.</h2>
          <div className="hbx-split-grid">
            <div className="hbx-live-panel">
              <span className="hbx-panel-tag live"><i />Live &middot; today</span>
              <h3>What we track today that gets you most of the way there</h3>
              <p>
                The pieces an AI-citation channel would eventually build on top of are already running, watching how
                competitors show up in public voice and press:
              </p>
              <ul>
                <li><strong>News &amp; press monitoring</strong> &mdash; the <code>news</code> channel, on Google News RSS by
                  default and GNews API when configured.</li>
                <li><strong>Brand mention tracking, classified</strong> &mdash; every mention is checked against your own
                  brand settings and marked client, a different same-name entity, or noise, never shown as a bare
                  keyword hit.</li>
                <li><strong>Funding &amp; corporate-move tracking</strong> &mdash; the <code>funding</code> channel, SEC EDGAR
                  Form D plus funding news, keyless, is exactly the kind of fact an AI answer engine would surface
                  about a company&apos;s trajectory.</li>
                <li><strong>The verified-source discipline</strong> &mdash; every fact cited, every gap disclosed. This is
                  the part of the system that an AI-citation channel can&apos;t skip, and it&apos;s the part we&apos;ve already
                  built.</li>
              </ul>
            </div>
            <div className="hbx-roadmap-panel">
              <span className="hbx-panel-tag roadmap">Roadmap &middot; not shipped</span>
              <h3>What&apos;s not built yet, said plainly</h3>
              <p>
                We&apos;re built to extend into this. It isn&apos;t live yet, and we won&apos;t claim it is:
              </p>
              <ul>
                <li>Live tracking of whether and how your brand is cited inside ChatGPT, Perplexity, Gemini, or
                  similar answer engines.</li>
                <li>Monitoring how a competitor is described or ranked in AI-generated comparisons.</li>
                <li>Any dashboard number that implies a measured &ldquo;AI visibility score&rdquo; &mdash; we haven&apos;t built
                  one, and we won&apos;t publish a made-up one in the meantime.</li>
              </ul>
              <p>
                When we build it, it will be a scout &mdash; one more collector reporting honestly into the same Tower,
                held to the same evidence bar as everything above. That&apos;s the architecture; this is just the
                channel we haven&apos;t written yet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hbx-block">
        <div className="wrap">
          <span className="wt-eyebrow">Who this is actually for</span>
          <h2 className="wt-h2">Two roles asking a question nobody can fully answer yet.</h2>
          <div className="hbx-persona-grid">
            {PERSONAS.map((per) => (
              <div className="hbx-persona-card" key={per.role}>
                <span className="role">{per.role}</span>
                <h4>{per.h}</h4>
                <p>{per.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hbx-chansec">
        <div className="wrap">
          <span className="wt-eyebrow">What&apos;s live today, by channel</span>
          <h2 className="wt-h2">The eight channels closest to this problem, already running.</h2>
          <div className="hbx-chips">
            {CHANNEL_SAMPLE.map((c) => <span className="hbx-chip" key={c}>{c}</span>)}
          </div>
        </div>
      </section>

      <section className="hbx-block">
        <div className="wrap">
          <span className="wt-eyebrow">What&apos;s included, by tier</span>
          <h2 className="wt-h2">No AI-visibility tier exists, because no AI-visibility feature does.</h2>
          <div className="hbx-callout-grid">
            {TIERS.map((t) => (
              <div className="hbx-callout-card" key={t.name}>
                <h4>{t.name} &middot; {t.price}</h4>
                <p>{t.note}</p>
                <p className="us">{t.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hbx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">How this would actually be built</span>
          <h2 className="wt-h2">Not a promise &mdash; the same six-step discipline the other 28 channels already follow.</h2>
          <div className="hbx-mech-list">
            {MECH.map((m, i) => (
              <div className="hbx-mech-step" key={m.h}>
                <span className="hbx-mech-num">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{m.h}</h3>
                  <p>{m.p}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hbx-example">
        <div className="wrap">
          <span className="wt-eyebrow">What the gap actually looks like, today</span>
          <h2 className="wt-h2">Ask ChatGPT to compare us to Klue right now. Nobody will tell you what it said.</h2>
          <div className="hbx-scenario">
            <span className="hbx-scenario-tag">Worked example &middot; the honest version of this story</span>
            <p>
              If you wanted to know, this minute, whether ChatGPT recommends Fortress HQ over Klue, Crayon, Kompyte,
              Visualping or Signal Labs when a buyer asks it to compare competitive-intelligence tools, there is
              exactly one way to find out: open ChatGPT yourself and ask it. Whatever it says back is a snapshot of
              one moment, for one prompt, on one model version &mdash; unsourced, unrepeatable, gone the moment you
              close the tab. Ask again tomorrow and the model may answer differently, and neither of us would know
              why.
            </p>
            <p>
              That is precisely the failure mode the rest of this product exists to avoid. A pricing page, a subdomain,
              a review pattern &mdash; every one of the 28 channels we already run returns something we can point to,
              timestamp, and re-check. <span className="accent">A single hand-typed prompt into a chat window has none
              of that</span>, which is exactly why we won&apos;t sell you a feature built on it. Faking this with a
              screenshot and a confident label would be easy. It would also be the first thing on this site that
              didn&apos;t hold up to its own citation &mdash; so we&apos;re not doing it, and this page is the record of
              that decision.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-argument">
        <div className="wrap">
          <span className="wt-eyebrow">Where the named competitors stand on this, honestly</span>
          <h2 className="wt-h2">We hold their claims to the same bar we hold ours.</h2>
          <p className="wt-lede">
            We are not going to tell you Klue, Crayon, Kompyte, Visualping or Signal Labs do or don&apos;t track AI-answer
            citations &mdash; we have no verified, independently checkable evidence either way, and repeating an
            unverified claim about a competitor breaks the exact rule this whole page is built around.
          </p>
          <div className="hbx-callout-grid">
            <div className="hbx-callout-card">
              <h4>Klue &amp; Crayon</h4>
              <p>Enterprise CI, sales-enablement led, pricing behind a demo call. We have no verifiable evidence of a live, independently checkable AI-citation-tracking feature from either, and we won&apos;t assert one we can&apos;t confirm.</p>
            </div>
            <div className="hbx-callout-card">
              <h4>Kompyte</h4>
              <p>Now runs on Semrush&apos;s distribution rather than as an independent product. Same standard applies: no confirmed claim on this specific capability, so no claim made here.</p>
            </div>
            <div className="hbx-callout-card">
              <h4>Visualping &amp; Signal Labs</h4>
              <p>Page-change monitoring, and a newer CI entrant respectively. Neither is something we&apos;ve verified as tracking AI-answer citations live &mdash; and an unverified feature claim is exactly what we won&apos;t publish about ourselves or about them.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hbx-faq">
        <div className="wrap">
          <span className="wt-eyebrow">Questions worth asking</span>
          <h2 className="wt-h2">Including the one that gets right to the point.</h2>
          <div className="hbx-faq-list">
            {AISV_FAQ.map((f) => (
              <details className="hbx-faq-item" key={f.q}>
                <summary>
                  <span className="q-txt">
                    {f.q.startsWith('So does citation tracking') && <span className="hbx-faq-tag">Hard question</span>}
                    {f.q}
                  </span>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="hbx-cta">
        <div className="wrap">
          <div className="wt-inline-cta">
            <p>See the 28 channels that are live today, in the workspace we run on our own market.</p>
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
