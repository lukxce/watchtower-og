import Link from 'next/link';

export const metadata = {
  title: 'Competitive Intelligence — Fortress HQ',
  description:
    'Verifiable competitive intelligence: 22 public channels watched daily, read together, cited, and published from $149/mo — no demo call required.',
};

const FRAME = [
  { name: 'Klue', theirs: 'Enterprise CI, sales-enablement led. Strong battlecards, deep CRM integration. Quote after a demo call.', us: 'We publish pricing. You are live today, not after procurement.' },
  { name: 'Crayon', theirs: "The category's brand name. Broad tracking, enterprise motion, expensive.", us: 'Same coverage class, an order of magnitude cheaper, and every claim cites a source instead of a confidence score.' },
  { name: 'Kompyte', theirs: "Acquired by Semrush; now runs on Semrush's distribution rather than as an independent product.", us: 'We are a company whose only job is this. Independence is a feature when the roadmap is someone else’s.' },
  { name: 'Signal Labs', theirs: 'Newer, quotes Team tier on a call.', us: 'Published pricing, live demo, no gate.' },
  { name: 'A shared Notion doc', theirs: 'Free. The real competitor for most teams.', us: "It's six months stale and you know it." },
];

const MECH = [
  {
    h: 'Scouts run their own channel, alone',
    p: 'Twenty-two collectors, each responsible for exactly one public surface. website & pricing tiers the page capture and diffs the content. subdomains reads certificate-transparency logs at crt.sh and certspotter for hostnames nobody announced. techstack fingerprints what a competitor runs. Each scout is a small, boring, deterministic program — no scraping behind a login, no guessing at private data — and each one reports honestly the moment it finds nothing, rather than staying silent.',
  },
  {
    h: 'Every mention gets classified before it becomes a signal',
    p: 'A raw keyword hit is not a signal. Before anything reaches your feed, a mention of a competitor’s name is checked and labelled — the client, a different company that happens to share the name, or noise (a song, a band, a farmhouse; this has genuinely happened). Anything that can’t be disambiguated is disclosed as unverifiable instead of shown as a hit. This is brand law 3’s corollary, and it runs before synthesis, not after.',
  },
  {
    h: 'Facts accumulate per competitor, not per channel',
    p: 'Every fact a scout returns is written back tagged with the competitor it belongs to, the channel it came from, a timestamp, and the source URL that proves it. A pricing change from website and a hiring cluster from jobs live in the same record space, so nothing has to be manually stitched together later — the corpus is already organised the way a person would want to read it.',
  },
  {
    h: 'The Tower reads everything on file, together',
    p: 'This is the step that makes twenty-two separate detections into intelligence instead of a longer inbox. The reasoning layer considers what’s accumulated for a competitor — pricing moves, hiring, ad activity, review patterns, funding, press — and writes what’s actually happening, in plain language, with the evidence trail kept underneath as the how-we-know line. It is grounded in retrieved facts on file, not a freeform guess, and we say so rather than calling it magic.',
  },
  {
    h: 'The Threat Index composes the read into one auditable number',
    p: 'Five weighted dimensions — GTM, talent, product, market, corporate — each scored, then combined (25% / 25% / 20% / 20% / 10%) into a single 0–100 total, stored per-dimension so it can be audited rather than trusted blindly. A week-over-week delta is tracked against the prior snapshot, so the number moves for a reason you can see, never as a black box.',
  },
  {
    h: 'You get a briefing or a battlecard, never a raw diff',
    p: '"Klue is shipping an AI interviewer" beats "subdomain observed: interview-v2.klue.com." The observation stays underneath, one click away, as the how-we-know line — but what you read first is the conclusion. That ordering is brand law 1 enforced in the interface, not just claimed in copy.',
  },
];

const CI_FAQ = [
  {
    q: 'What actually counts as a "public channel" here?',
    a: 'Anything reachable without a login and without paying for private data — a pricing page, a job board, an ad library, a certificate-transparency log, a review site, a sitemap. Nothing behind a paywall, nothing scraped from an account we don’t have permission to be in. The 22 channels split across seven groups: Product, GTM & ads, Talent, Voice & PR, Reputation, Market, and Corporate. Every one of them is named on the data-sources page, not just gestured at.',
  },
  {
    q: 'How is this different from putting a Visualping watch or a Google Alert on a competitor?',
    a: 'Those tools are honest about being one channel, and a good one — page-change monitoring is genuinely useful. Page changes are one of our 22 channels, run alongside pricing, hiring, ads, reviews, hostnames and funding. The difference isn’t volume, it’s synthesis: an alert tells you a page changed, we tell you what it means once it’s read against everything else on file for that competitor.',
  },
  {
    q: 'What happens when a page can’t be reached, or a source is unverifiable?',
    a: 'The product says so. That’s brand law 3, enforced, not just written down: if a page can’t be fetched, the gap is disclosed rather than silently skipped, and a mention that can’t be disambiguated is flagged as unverifiable rather than shown as a hit. An honest "we don’t know" is worth more than a confident guess wearing a citation.',
  },
  {
    q: 'How is the Threat Index actually calculated — can I see what’s behind the number?',
    a: 'Yes, always — it’s never shown alone. It’s a weighted composite over five dimensions (GTM 25%, talent 25%, product 20%, market 20%, corporate 10%), each one visible individually, with a week-over-week delta against the prior snapshot. If the total moved, you can see which dimension moved it.',
  },
  {
    q: 'What happens when a competitor’s name collides with something else — another company, a band, a place?',
    a: 'It gets classified before it ever reaches your feed: client, a different entity of the same name, or noise. This came out of a real problem — a farmhouse and a song both once looked like a "mention" before the classification pass existed. Now anything that can’t be resolved is disclosed as unverifiable rather than counted as a hit.',
  },
  {
    q: 'Is any of this actually reasoning, or is it scraping dressed up with better formatting?',
    a: 'Both, honestly, and we’d rather say which part is which than blur it. The 22 collectors are exactly what they sound like — deterministic programs hitting public sources, no AI involved in the fetch. The synthesis on top — the Tower reading everything on file for a competitor and writing what’s happening — is where the reasoning sits, and it’s grounded in the retrieved facts on file rather than a freeform guess. We won’t claim "AI magic" because that’s not what’s running, and BRAND.md says so on purpose.',
  },
  {
    q: 'Can I try this on real competitors before I pay for anything?',
    a: 'Starter is $149/mo for 3 competitors watched daily, and there’s a live demo workspace with real, current signal from our own market before you enter a card number anywhere.',
  },
];

export default function CompetitiveIntelligenceHub() {
  return (
    <div className="hbx">
      <section className="hbx-hero">
        <div className="wrap">
          <span className="hbx-crumb">Competitive intelligence</span>
          <h1 className="mkt-h1" style={{ marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            Verifiable competitive intelligence, not a bigger pile of alerts.
          </h1>
          <p className="lede" style={{ marginLeft: 0, textAlign: 'left' }}>
            We compete in the category buyers already search for &mdash; &ldquo;competitive intelligence software,&rdquo;
            &ldquo;Klue pricing,&rdquo; &ldquo;Crayon alternative.&rdquo; What we claim inside it is a stance: every signal
            comes from a named public source, every conclusion cites the evidence behind it, and the price is on this
            site instead of behind a form. Fortress HQ watches 22 public channels a day, reads them together, and
            writes the briefing &mdash; from $149/mo.
          </p>
        </div>
      </section>

      <section className="hbx-stats">
        <div className="wrap">
          <div className="hbx-stat-grid">
            <div className="hbx-stat"><span className="n">22</span><span className="l">Public channels watched, from pricing pages to certificate-transparency logs</span></div>
            <div className="hbx-stat"><span className="n">7</span><span className="l">Channel groups &mdash; Product, GTM &amp; ads, Talent, Voice &amp; PR, Reputation, Market, Corporate</span></div>
            <div className="hbx-stat"><span className="n">$149/mo</span><span className="l">Starter tier, published &mdash; no demo call to see a price</span></div>
            <div className="hbx-stat"><span className="n">3 &rarr; 10</span><span className="l">Competitors watched daily on Starter, 10 on Growth ($399/mo)</span></div>
            <div className="hbx-stat"><span className="n">5</span><span className="l">Weighted dimensions behind the Threat Index, always shown with its inputs</span></div>
            <div className="hbx-stat"><span className="n">5</span><span className="l">Named vendors we compare against directly &mdash; Klue, Crayon, Kompyte, Visualping, Signal Labs</span></div>
            <div className="hbx-stat"><span className="n">100%</span><span className="l">Of mentions classified as client, same-name, or noise before they reach your feed</span></div>
          </div>
        </div>
      </section>

      <section className="hbx-argument">
        <div className="wrap">
          <div className="hbx-panel">
            <h2>The wedge is one word: verifiable.</h2>
            <p>
              We are not inventing a category. Inventing a name means fighting for a term nobody types. Inside
              &ldquo;competitive intelligence,&rdquo; though, most of the field asks you to trust a confidence score or a
              black-box detector. We do the opposite: <span className="accent">a scout&apos;s report is a fact with a
              source, and the Tower&apos;s read is a conclusion built on top of it</span> &mdash; and the product never
              blurs the two.
            </p>
            <p>
              That is enforced in code, not just in copy. If a page can&apos;t be fetched, the product says so instead of
              quietly skipping it. If a competitor&apos;s name matches a song, a different company, or a farmhouse, that
              mention is classified &mdash; client, same-name, or noise &mdash; before it ever reaches your feed. Anything
              that can&apos;t be disambiguated is disclosed as unverifiable rather than shown as a hit.
            </p>
            <p>
              The status quo we&apos;re really up against is a shared Notion doc someone updated in March. It&apos;s free,
              and it&apos;s the honest reason most teams find out a competitor cut price or shipped a feature three weeks
              late, from a lost deal.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-how">
        <div className="wrap">
          <span className="wt-eyebrow">How it actually works</span>
          <h2 className="wt-h2">Three steps, run every day, on every competitor you name.</h2>
          <div className="hbx-how-grid">
            <div className="hbx-how-item">
              <span className="step">01 · Scouts collect</span>
              <h3>Every public channel, separately</h3>
              <p>
                <code>website &amp; pricing</code> tiers the page capture and diffs the content. <code>sitemap</code> watches
                for new and changed pages. <code>subdomains</code> reads certificate-transparency logs for hostnames
                nobody announced. <code>techstack</code> fingerprints what they run. Each scout reports honestly when it
                finds nothing.
              </p>
            </div>
            <div className="hbx-how-item">
              <span className="step">02 · The Tower reads together</span>
              <h3>One synthesis per competitor, not per signal</h3>
              <p>
                The reasoning layer considers everything on file &mdash; pricing moves, hiring clusters, ad activity,
                review patterns, funding news &mdash; and writes what&apos;s actually happening, not a list of detections.
                The <strong>Threat Index</strong> is a weighted composite over five dimensions, stored per-dimension so
                it&apos;s auditable, never shown as a bare number.
              </p>
            </div>
            <div className="hbx-how-item">
              <span className="step">03 · You get a briefing</span>
              <h3>A conclusion, cited, never a raw diff</h3>
              <p>
                &ldquo;Klue is shipping an AI interviewer&rdquo; beats &ldquo;subdomain observed: interview-v2.klue.com.&rdquo;
                The observation stays underneath as the how-we-know line. Nothing you read in the feed or a battlecard
                is unsourced.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="hbx-mech">
        <div className="wrap">
          <span className="wt-eyebrow">The full mechanism</span>
          <h2 className="wt-h2">From a public page to a cited conclusion, in six steps.</h2>
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
          <span className="wt-eyebrow">What &ldquo;verifiable&rdquo; means in practice</span>
          <h2 className="wt-h2">The Klue find, seen from the audit trail instead of the timeline.</h2>
          <div className="hbx-scenario">
            <span className="hbx-scenario-tag">Worked example &middot; real find, our own demo workspace</span>
            <p>
              Our homepage tells this as a timeline: three hostnames, then context, then a conclusion. Here&apos;s the
              same find from the other direction &mdash; what the Tower actually had to check before it was allowed to
              say anything.
            </p>
            <p>
              The <code>subdomains</code> channel returned <code>interview.klue.com</code>, <code>interviewer-v2.klue.com</code> and
              <code> voice.klue.com</code> off the public certificate log. On its own, a new hostname is a fact with a
              source and nothing more &mdash; that is exactly where a page-change tool would stop. The Tower didn&apos;t
              stop there. It confirmed the mention was Klue&apos;s own domain, not a same-named entity. It pulled what
              was already on file &mdash; Klue runs win-loss interviews as a core motion, and had spent the year
              publishing agentic-workflow workshops and an AI report &mdash; and checked for corroboration in
              <code> news</code> and <code>jobs</code>. It found none: no press mention, no &ldquo;voice AI engineer&rdquo; role
              posted anywhere. <span className="accent">That absence matters as much as the hostnames</span> &mdash; it&apos;s
              exactly why the briefing reads &ldquo;they haven&apos;t said so&rdquo; instead of treating three subdomains as
              a confirmed launch. If a corroborating job posting had shown up the same week, the read would have said
              that too, and gotten more confident. It didn&apos;t, so it didn&apos;t. A conclusion is only as strong as
              the evidence stacked under it, and the briefing shows that stack instead of asserting a score.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-argument">
        <div className="wrap">
          <span className="wt-eyebrow">The competitive frame</span>
          <h2 className="wt-h2">Where the others sit, and our counter.</h2>
          <div className="hbx-table-wrap">
            <table className="hbx-table">
              <thead>
                <tr><th>Vendor</th><th>Their position</th><th>Our counter</th></tr>
              </thead>
              <tbody>
                {FRAME.map((f) => (
                  <tr key={f.name}>
                    <th>{f.name}</th>
                    <td>{f.theirs}</td>
                    <td className="us">{f.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="wt-fine">
            We don&apos;t punch down at Visualping &mdash; page-change monitoring is honest about being one channel. Page
            changes are one of our 22. A change is not an insight; what it means is.
          </p>
        </div>
      </section>

      <section className="hbx-faq">
        <div className="wrap">
          <span className="wt-eyebrow">Questions worth asking</span>
          <h2 className="wt-h2">Including the ones a skeptical buyer would actually ask.</h2>
          <div className="hbx-faq-list">
            {CI_FAQ.map((f) => (
              <details className="hbx-faq-item" key={f.q}>
                <summary><span className="q-txt">{f.q}</span></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="hbx-cta">
        <div className="wrap">
          <div className="wt-inline-cta">
            <p>Published pricing, a live demo with no gate, and every claim cited. See it against your own market.</p>
            <div className="wt-cta">
              <Link href="/pricing" className="btn btn-primary">See pricing</Link>
              <Link href="/demo" className="btn btn-ghost">Try the live demo &rarr;</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
