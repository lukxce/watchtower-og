import Link from 'next/link';

export const metadata = {
  title: 'Crayon alternative — Fortress HQ',
  description:
    'A Crayon alternative: the same coverage class, an order of magnitude cheaper, and every claim cites a source instead of a confidence score.',
};

export default function CrayonAlternative() {
  return (
    <>
      <section className="cpx-hero">
        <div className="wrap">
          <span className="kicker">Crayon alternative</span>
          <h1>Looking for a Crayon alternative?</h1>
          <p className="lede">
            Crayon is the category&apos;s brand name — the name people say when they mean &quot;competitive
            intelligence software.&quot; Broad tracking, an enterprise motion, and pricing to match: it&apos;s
            built and sold for large teams with large budgets.
          </p>
          <div className="counter">
            <b>Our counter:</b> the same coverage class, an order of magnitude cheaper, and every claim cites a
            source instead of a confidence score.
          </div>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>Fortress HQ vs. Crayon</h2>
          <p className="lede">
            Crayon&apos;s tracking breadth is real — this isn&apos;t a case of a bigger platform with nothing under
            the hood. The difference is price, and whether a claim comes with a source or a confidence score.
          </p>
          <div className="cpx-table-wrap">
            <table className="cpx-table">
              <caption>Fortress HQ vs. Crayon</caption>
              <thead>
                <tr>
                  <th scope="col">&nbsp;</th>
                  <th scope="col" className="us">Fortress HQ</th>
                  <th scope="col">Crayon</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Pricing model</th>
                  <td className="us">Published: $149–$1,500/mo, self-serve</td>
                  <td>Enterprise pricing, not published, sold by quote</td>
                </tr>
                <tr>
                  <th scope="row">Demo required?</th>
                  <td className="us">No — start free, see the price up front</td>
                  <td>Yes, standard enterprise sales process</td>
                </tr>
                <tr>
                  <th scope="row">Evidence per claim</th>
                  <td className="us">Every claim links to the public source it came from</td>
                  <td>Claims are scored by confidence, not always tied to a visible source</td>
                </tr>
                <tr>
                  <th scope="row">Coverage breadth</th>
                  <td className="us">22 public channels per competitor</td>
                  <td>Broad tracking across a comparable set of public channels</td>
                </tr>
                <tr>
                  <th scope="row">Independence</th>
                  <td className="us">Independent company — this is the only thing we build</td>
                  <td>Independent company, the established category leader</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>Where each one actually fits</h2>
          <p className="lede">
            Crayon earned the category&apos;s name for a reason: at real enterprise scale, with a dedicated CI team
            to run it, it does a lot. Most teams reading this aren&apos;t that team. If you want comparable
            coverage without the enterprise contract, and you want to be able to check a claim against its source
            yourself rather than trust a score, that&apos;s the gap we built for.
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
