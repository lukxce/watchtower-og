import Link from 'next/link';

export const metadata = {
  title: 'Kompyte alternative — Fortress HQ',
  description:
    'A Kompyte alternative from a company whose only job is competitive intelligence — independence is a feature when the roadmap is someone else\'s.',
};

export default function KompyteAlternative() {
  return (
    <>
      <section className="cpx-hero">
        <div className="wrap">
          <span className="kicker">Kompyte alternative</span>
          <h1>Looking for a Kompyte alternative?</h1>
          <p className="lede">
            Kompyte was acquired by Semrush in 2022. It still exists as a product, but it now runs on Semrush&apos;s
            distribution and roadmap rather than as an independent competitive-intelligence company — which changes
            what gets prioritized and by whom.
          </p>
          <div className="counter">
            <b>Our counter:</b> we&apos;re a company whose only job is this. Independence is a feature when the
            roadmap is someone else&apos;s.
          </div>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>Fortress HQ vs. Kompyte</h2>
          <p className="lede">
            This isn&apos;t a knock on Kompyte&apos;s original product — it&apos;s a fact about ownership, and
            ownership determines a roadmap.
          </p>
          <div className="cpx-table-wrap">
            <table className="cpx-table">
              <caption>Fortress HQ vs. Kompyte</caption>
              <thead>
                <tr>
                  <th scope="col">&nbsp;</th>
                  <th scope="col" className="us">Fortress HQ</th>
                  <th scope="col">Kompyte</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Pricing model</th>
                  <td className="us">Published: $149–$1,500/mo, self-serve</td>
                  <td>Quoted, typically bundled with or sold alongside Semrush plans</td>
                </tr>
                <tr>
                  <th scope="row">Demo required?</th>
                  <td className="us">No — start free, see a real result today</td>
                  <td>Yes, through Semrush&apos;s sales process</td>
                </tr>
                <tr>
                  <th scope="row">Evidence per claim</th>
                  <td className="us">Every claim links to the public source it came from</td>
                  <td>Signal tracking exists; sourcing discipline varies by feature</td>
                </tr>
                <tr>
                  <th scope="row">Coverage breadth</th>
                  <td className="us">22 public channels per competitor</td>
                  <td>Comparable tracking, positioned as one module inside Semrush&apos;s SEO-first suite</td>
                </tr>
                <tr>
                  <th scope="row">Independence</th>
                  <td className="us">Independent — competitive intelligence is the entire company</td>
                  <td>Owned by Semrush; roadmap sits inside a larger SEO/marketing suite, not standalone</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>Why independence is the actual question</h2>
          <p className="lede">
            A CI tool owned by an SEO platform will get roadmap attention in proportion to how it serves the SEO
            platform&apos;s business, not necessarily yours. That&apos;s not a flaw in Kompyte&apos;s people or
            code — it&apos;s a structural fact about who a product answers to. We only answer to whether the watch
            is good.
          </p>
        </div>
      </section>

      <div className="wrap">
        <div className="wt-inline-cta">
          <p>See it running on real competitors before you decide anything.</p>
          <div className="wt-cta">
            <Link href="/demo" className="btn btn-primary">Try the live demo</Link>
            <Link href="/pricing" className="btn btn-ghost">See pricing</Link>
          </div>
        </div>
      </div>
    </>
  );
}
