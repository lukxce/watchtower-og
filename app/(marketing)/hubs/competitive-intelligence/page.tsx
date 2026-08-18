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
