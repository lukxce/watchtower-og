import Link from 'next/link';

export const metadata = {
  title: 'Klue alternative — Fortress HQ',
  description:
    'A Klue alternative with published pricing and no demo call. Same job — battlecards, competitive signal — a different way of getting there.',
};

export default function KlueAlternative() {
  return (
    <>
      <section className="cpx-hero">
        <div className="wrap">
          <span className="kicker">Klue alternative</span>
          <h1>Looking for a Klue alternative?</h1>
          <p className="lede">
            Klue is a real enterprise competitive-intelligence platform — sales-enablement led, with strong
            battlecards and deep CRM integration. It&apos;s a solid product. It&apos;s also sold the way most
            enterprise software is sold: pricing is a quote, and the quote comes after a demo call.
          </p>
          <div className="counter">
            <b>Our counter:</b> we publish pricing. You can see the product, the price, and real signal on real
            competitors today — not after procurement signs off on a call.
          </div>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>Fortress HQ vs. Klue</h2>
          <p className="lede">
            A plain comparison, not a scorecard we rigged. Where Klue genuinely wins — CRM-embedded battlecards
            for large sales orgs — we say so.
          </p>
          <div className="cpx-table-wrap">
            <table className="cpx-table">
              <caption>Fortress HQ vs. Klue</caption>
              <thead>
                <tr>
                  <th scope="col">&nbsp;</th>
                  <th scope="col" className="us">Fortress HQ</th>
                  <th scope="col">Klue</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Pricing model</th>
                  <td className="us">Published: $149–$1,500/mo, self-serve</td>
                  <td>Custom quote, sold enterprise</td>
                </tr>
                <tr>
                  <th scope="row">Demo required?</th>
                  <td className="us">No — sign up and see real signal today</td>
                  <td>Yes, to see pricing or the product</td>
                </tr>
                <tr>
                  <th scope="row">Evidence per claim</th>
                  <td className="us">Every claim links to its public source</td>
                  <td>Battlecards are built and sourced by your team</td>
                </tr>
                <tr>
                  <th scope="row">Coverage breadth</th>
                  <td className="us">22 public channels per competitor, automated</td>
                  <td>Deep on sales enablement and CRM integration; breadth of public-channel tracking is narrower by design</td>
                </tr>
                <tr>
                  <th scope="row">Independence</th>
                  <td className="us">Independent company — this is the only thing we build</td>
                  <td>Independent company, focused on sales-enablement CI</td>
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
            If your team lives inside Salesforce and needs battlecards surfaced directly in the CRM at deal time,
            Klue&apos;s integration depth is real and worth paying for. If you want to know what your market did
            this morning — every claim cited, live the day you sign up, without a procurement cycle — that&apos;s
            what we built.
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
