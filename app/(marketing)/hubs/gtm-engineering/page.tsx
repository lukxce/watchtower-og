import Link from 'next/link';

export const metadata = {
  title: 'GTM Engineering — Fortress HQ',
  description:
    'Every competitive signal in Fortress HQ is already a structured, source-linked record. Today it surfaces in the product. A public API is next, not yet shipped.',
};

const GTM_FRAME = [
  { name: 'Klue', theirs: 'Deep CRM integration is a core, shipped part of their product.', us: 'No public API or CRM surface yet. The record shape underneath is API-ready; the pipe out isn\'t built.' },
  { name: 'Crayon', theirs: 'Enterprise integrations, sold as part of the enterprise motion, priced after a demo call.', us: 'Everything we do have — the feed, the battlecard — is source-linked in-product, with a published price, before any integration conversation.' },
  { name: 'Kompyte', theirs: 'Runs on Semrush\'s distribution now; any integration surface belongs to the suite, not an independent roadmap.', us: 'A dedicated CI product with one job. Whatever ships next is chosen for this product, not folded in around a larger suite\'s priorities.' },
  { name: 'Visualping', theirs: 'A single-purpose page-change tool; not aiming to be a structured data platform.', us: 'The underlying record is already structured across 28 channels — the piece that\'s missing is exposing it externally, not building the structure itself.' },
  { name: 'Signal Labs', theirs: 'Team-tier pricing quoted on a call; integration scope unclear without one.', us: 'Published pricing at every tier, and the same honest "not yet" on API access instead of a quote-gated answer.' },
];

const PERSONAS = [
  { role: 'Product', h: 'Kept up by discovering a competitor shipped the roadmap item', p: 'The structured record described below is what would eventually let a product team pull buildout signals — hostnames, hiring clusters — into their own tools instead of reading them one-by-one in the app.' },
  { role: 'Whoever ends up wiring the pipes', h: 'Not a named BRAND.md persona — said plainly', p: 'BRAND.md\'s audience table names four roles (Founder/CEO, product marketing, sales lead, product), not a dedicated "GTM engineer." This hub speaks to whichever of those four ends up setting up an integration, most often product or a revenue-ops lead working alongside sales or marketing.' },
];

const CHANNEL_SAMPLE = ['Website & pricing', 'Subdomain watch', 'Job postings', 'Meta ads', 'G2 reviews', 'Funding & M&A'];

const TIERS = [
  { name: 'Starter', price: '$79/mo', note: '3 competitors', items: ['600 page-fetches/day workspace budget', '3,000 monitored pages per competitor', '0 licensed-vendor runs/month'] },
  { name: 'Growth', price: '$199/mo', note: '10 competitors', items: ['2,000 page-fetches/day', '320 licensed-vendor runs/month for paid-source channels'] },
  { name: 'Enterprise', price: 'Talk to us', note: '30 competitors, standard config', items: ['7,000 page-fetches/day', '6,000 monitored pages per competitor', '960 licensed-vendor runs/month'] },
];

const MECH = [
  {
    h: 'Every scout returns a record, not a paragraph',
    p: 'A collector like ads_meta, subdomains, jobs or funding doesn\'t hand the Tower prose — it hands back a row: which competitor, which channel, what changed, when, and the source URL that proves it. That structure exists the instant a scout runs, whether or not anyone ever reads it in the product.',
  },
  {
    h: 'Status is computed at runtime, never hardcoded',
    p: 'Whether a channel shows as active, needs a key, needs an account, or is a paid vendor call is derived from which credentials are actually present when the code runs — not set by hand and left to drift. That\'s what keeps the coverage map honest without a person doing a manual audit pass every time a key gets added.',
  },
  {
    h: 'Records accumulate per competitor, tagged and timestamped',
    p: 'Every fact lands against the competitor it belongs to, carrying its channel, category and source URL. A pricing change from website and a hiring cluster from jobs live in the same structured space, which is what lets the next step read them together instead of requiring someone to stitch spreadsheets by hand every Monday morning.',
  },
  {
    h: 'The Tower composes an auditable score on top',
    p: 'The Threat Index is a weighted composite over five dimensions — GTM, talent, product, market, corporate, at 25/25/20/20/10 — stored per-dimension with a week-over-week delta tracked against the prior snapshot. Nothing about this composition is hidden; you can always see which dimension moved and by how much. It\'s just not exposed outside the product yet, which is the entire subject of this page.',
  },
  {
    h: 'Today, the only egress is the product surface itself',
    p: 'The daily feed and the battlecard are where the structured record currently turns into something a person reads — both source-linked, every line traceable back to the record behind it. That\'s the whole delivery layer as it stands: in-app, for a person, not yet for a system, a webhook listener, or a warehouse job running on a schedule.',
  },
  {
    h: 'The pipe out is next, in a specific order — not shipped yet',
    p: 'A way to query the corpus directly, standing orders pushed to Slack, email or a webhook, and a one-click report export are the layers we\'re building first. A public API and webhooks for pulling records programmatically come after that, once there\'s a stable surface worth versioning. None of the four exist today, and we\'d rather say that in order than let the page blur what\'s built.',
  },
];

const GTM_FAQ = [
  {
    q: 'If there\'s no API, isn\'t this whole page just marketing about something that doesn\'t exist?',
    a: 'That\'s a fair read if the page implied the API exists — it doesn\'t, and we\'ve tried hard not to word it that way. What does exist, verifiably, is the structured record every signal is stored as before it\'s ever written into a sentence — the same shape an API response would need. This page is about that foundation, said honestly as a foundation, not a launch announcement wearing a foundation as a disguise.',
  },
  {
    q: 'Is there a public API today?',
    a: 'No. Not in beta, not on request, not for enterprise customers on a special path. The record structure that an API would expose is real and running; the API itself is not built.',
  },
  {
    q: 'Can I at least get a webhook or a push notification when something changes?',
    a: 'Not yet. Standing orders that push to Slack, email or a webhook the moment a rule fires are on the list ahead of the API, and they\'re not shipped either. The scoring that would decide what\'s worth pushing already runs inside the product — the delivery mechanism to get it outside the product doesn\'t exist yet.',
  },
  {
    q: 'Then what\'s actually true today, structurally?',
    a: 'Every one of the 28 channels writes back a structured record — competitor, channel, timestamp, category, source URL — the moment it runs. The Tower reads those records together and composes a Threat Index and a battlecard from them. All of that is real and running. What isn\'t real yet is a way to pull any of it out of the product programmatically.',
  },
  {
    q: 'Why does any of this matter if I can\'t access it externally yet?',
    a: 'Because it determines how hard the eventual API is to build well. A product that only decided to structure its data the day someone asked for an API usually ships a bad one, retrofitted around whatever the UI happened to need. Ours is structured this way from the first scout run, which is exactly why we\'re confident saying the pipe out is "next" rather than "eventually, maybe."',
  },
  {
    q: 'When will the API ship?',
    a: 'We\'re not attaching a date we can\'t hold to. The order is public, though: a query interface, standing orders, and exportable reports come first, because they\'re closer to done and more people need them sooner. The API is the step after that, once there\'s a stable surface worth committing to version.',
  },
  {
    q: 'Is this the same kind of "not built yet" as the AI search visibility page, or different?',
    a: 'Same honesty standard, different reason for the gap. AI-citation tracking doesn\'t exist because the underlying methodology hasn\'t been built to a bar we\'d trust. The API doesn\'t exist because we chose to build the in-product query and delivery layers first — the data has been structured correctly since day one, we just haven\'t built the door to hand it to you directly.',
  },
  {
    q: 'Will the eventual API be free, or a paid add-on on top of a plan?',
    a: 'We haven\'t decided, and we\'re not going to announce pricing for something that isn\'t built — that\'s the exact kind of claim this page is trying not to make. What we can say is that the underlying plan limits (page-fetch budgets, licensed-vendor runs) are already metered per tier, so an API would plausibly sit on top of that existing metering rather than invent a separate pricing model from nothing.',
  },
];

export default function GtmEngineeringHub() {
  return (
    <div className="hbx">
      <section className="hbx-hero">
        <div className="wrap">
          <span className="hbx-crumb">GTM engineering</span>
          <h1 className="mkt-h1" style={{ marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            The data is already structured. The pipe out isn&apos;t built yet.
          </h1>
          <p className="lede" style={{ marginLeft: 0, textAlign: 'left' }}>
            Every signal Fortress HQ collects exists as a structured record &mdash; competitor, channel, timestamp,
            source URL, category &mdash; before it&apos;s ever written into a sentence. That&apos;s the discipline an
            integration would need. Today, that structure surfaces through the product itself. It doesn&apos;t yet
            surface through a wire, and we&apos;d rather tell you that plainly than let you assume otherwise.
          </p>
        </div>
      </section>

      <section className="hbx-stats">
        <div className="wrap">
          <div className="hbx-stat-grid">
            <div className="hbx-stat"><span className="n">28</span><span className="l">Public channels, each collector self-defers cleanly when its own credential is absent</span></div>
            <div className="hbx-stat"><span className="n">7</span><span className="l">Channel groups every signal is tagged with &mdash; Product, GTM &amp; ads, Talent, Voice &amp; PR, Reputation, Market, Corporate</span></div>
            <div className="hbx-stat"><span className="n">5</span><span className="l">Weighted dimensions behind the Threat Index, stored per-dimension for audit, not a black box</span></div>
            <div className="hbx-stat"><span className="n">1</span><span className="l">Source URL required on every conclusion, or it isn&apos;t shown</span></div>
            <div className="hbx-stat"><span className="n">0</span><span className="l">Public API endpoints shipped today &mdash; said plainly, not implied</span></div>
            <div className="hbx-stat"><span className="n">3</span><span className="l">In-build product layers ahead of the API &mdash; a query interface, standing orders, exportable reports</span></div>
            <div className="hbx-stat"><span className="n">$79&ndash;$199</span><span className="l">Starter and Growth tiers today read the same structured record, entirely inside the product</span></div>
          </div>
        </div>
      </section>

      <section className="hbx-argument">
        <div className="wrap">
          <div className="hbx-panel">
            <h2>Structured underneath, product-only on top &mdash; for now.</h2>
            <p>
              A scout doesn&apos;t hand the Tower a paragraph. It hands back a record: which competitor, which channel,
              what changed, when, and the URL that proves it. The Tower reads those records together and writes the
              briefing. <span className="accent">That record is the same shape an API response or a webhook payload
              would need to be</span> &mdash; we just haven&apos;t built the pipe that hands it to you directly yet.
            </p>
            <p>
              Right now the only way to see it is inside the product: the daily feed, and the battlecard built for
              each competitor. Both are already source-linked &mdash; every line traces back to the record behind it,
              the same discipline whether a person or a system ends up reading it.
            </p>
            <p>
              We&apos;re also building the next layer of the product itself &mdash; a way to query the corpus directly, a
              way to push a standing rule out to Slack the moment it fires, a one-click export of a briefing. None of
              those three are shipped yet either. A public API and webhooks are the step after that, once there&apos;s a
              stable surface worth versioning. We&apos;d rather ship the internals first and say so than announce
              integrations that don&apos;t exist.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-how">
        <div className="wrap">
          <span className="wt-eyebrow">How it actually works</span>
          <h2 className="wt-h2">From a public page to a structured record, to a briefing.</h2>
          <div className="hbx-how-grid">
            <div className="hbx-how-item">
              <span className="step">01 · Every signal is a record</span>
              <h3>Not a blob of text</h3>
              <p>
                Each of the 28 channels &mdash; <code>ads_meta</code>, <code>subdomains</code>, <code>jobs</code>,
                <code> funding</code>, and the rest &mdash; writes back competitor, channel key, timestamp, category and
                source URL. Status is computed at runtime from which credentials are present, so the record of what
                ran is always accurate.
              </p>
            </div>
            <div className="hbx-how-item">
              <span className="step">02 · The Tower composes</span>
              <h3>An auditable score, not a guess</h3>
              <p>
                The Threat Index is a weighted composite across five dimensions &mdash; GTM, talent, product, market,
                corporate &mdash; stored per-dimension. You can see what moved the number, because the number is never
                shown alone.
              </p>
            </div>
            <div className="hbx-how-item">
              <span className="step">03 · Today, it surfaces in-product</span>
              <h3>Not through a wire, yet</h3>
              <p>
                The feed and the battlecards are the only egress today. A conversational query interface, standing
                orders that deliver to Slack or a webhook, and exportable reports are in build. A public API for
                pulling the underlying records directly is the natural next step after that &mdash; not shipped.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hbx-block">
        <div className="wrap">
          <span className="wt-eyebrow">Who this is actually for</span>
          <h2 className="wt-h2">Two ways to read this page, honestly labelled.</h2>
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
          <span className="wt-eyebrow">Six channels, one record shape</span>
          <h2 className="wt-h2">Different sources, identical structure underneath.</h2>
          <div className="hbx-chips">
            {CHANNEL_SAMPLE.map((c) => <span className="hbx-chip" key={c}>{c}</span>)}
          </div>
        </div>
      </section>

      <section className="hbx-block">
        <div className="wrap">
          <span className="wt-eyebrow">What&apos;s included, by tier</span>
          <h2 className="wt-h2">Scale, not features — nothing API-shaped differs by plan yet.</h2>
          <div className="hbx-callout-grid">
            {TIERS.map((t) => (
              <div className="hbx-callout-card" key={t.name}>
                <h4>{t.name} &middot; {t.price}</h4>
                <p>{t.note}</p>
                <p className="us">{t.items.join(' · ')}</p>
              </div>
            ))}
          </div>
          <p className="wt-fine">
            One more honest detail for anyone reading this closely: Ask-the-Tower question quotas are already budgeted
            per plan in the code &mdash; 50 a month on Starter, 300 on Growth, 2,000 on Enterprise &mdash; even though the
            feature itself shows a &ldquo;coming soon&rdquo; state in the product today. The unit economics were modeled
            before the feature shipped, not after. That&apos;s the same &ldquo;structured underneath, product-only on
            top&rdquo; pattern this whole hub is describing, one layer further down.
          </p>
        </div>
      </section>

      <section className="hbx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">The full mechanism</span>
          <h2 className="wt-h2">From a public page to a structured record, honestly to where it stops today.</h2>
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
          <span className="wt-eyebrow">What the gap actually looks like</span>
          <h2 className="wt-h2">A GTM engineer wants competitor signal in the warehouse. Here&apos;s what&apos;s true today.</h2>
          <div className="hbx-scenario">
            <span className="hbx-scenario-tag">Worked example &middot; an honest walkthrough of the current limit</span>
            <p>
              A growth engineer wants to join competitor signal against internal pipeline data &mdash; did threat scores
              on Klue or Crayon move the week before a batch of deals were lost. The instinct is to reach for an API
              key. There isn&apos;t one. There&apos;s also no webhook to catch events as they happen, and no export job to
              schedule against a warehouse.
            </p>
            <p>
              What does exist: the feed and each battlecard, readable in the product, every line already carrying its
              source URL. If the engineer needed one fact today, they could open the battlecard and copy it by hand,
              cited. That&apos;s a real, if manual, path &mdash; not the automated one they actually want.
              <span className="accent"> The reason we can say the API is a "next step" and not a "someday" is that the
              record shape already matches what an API response would need</span> &mdash; competitor, channel, timestamp,
              category, source URL &mdash; because it was built that way from the first scout run, not bolted on after
              the fact. When the pipe gets built, the data behind it won&apos;t need a redesign. It just needs a door.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-argument">
        <div className="wrap">
          <span className="wt-eyebrow">The competitive frame, for integration surface</span>
          <h2 className="wt-h2">Where the others sit on this specifically.</h2>
          <div className="hbx-table-wrap">
            <table className="hbx-table">
              <thead>
                <tr><th>Vendor</th><th>Their position</th><th>Our counter</th></tr>
              </thead>
              <tbody>
                {GTM_FRAME.map((f) => (
                  <tr key={f.name}>
                    <th>{f.name}</th>
                    <td>{f.theirs}</td>
                    <td className="us">{f.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="hbx-faq">
        <div className="wrap">
          <span className="wt-eyebrow">Questions worth asking</span>
          <h2 className="wt-h2">Including the one that gets right to the point.</h2>
          <div className="hbx-faq-list">
            {GTM_FAQ.map((f) => (
              <details className="hbx-faq-item" key={f.q}>
                <summary>
                  <span className="q-txt">
                    {f.q.startsWith('If there') && <span className="hbx-faq-tag">Hard question</span>}
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
            <p>See the structured signal underneath a real briefing, in the live demo.</p>
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
