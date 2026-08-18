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
            intelligence software.&quot; Broad tracking, a mature enterprise motion, an established customer base:
            it&apos;s not an upstart, it&apos;s the incumbent, and it&apos;s built and sold for large teams with
            large budgets.
          </p>
          <p className="lede">
            That&apos;s exactly why people go looking for an alternative. Being the category leader means being
            priced like one — quoted, not published, sized for a team with a dedicated CI function to run the
            platform. If you&apos;re a team of one doing product marketing, or a founder trying to keep an eye on
            three competitors without hiring for it, Crayon&apos;s breadth is real but the price and the sales
            process are built around an org chart you probably don&apos;t have yet.
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
            the hood. The difference is price, sourcing discipline, and who the product is actually sized for.
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
                  <td className="us">Published: $79–$1,500/mo, self-serve</td>
                  <td>Enterprise pricing, not published, sold by quote</td>
                </tr>
                <tr>
                  <th scope="row">Demo required?</th>
                  <td className="us">No — start free, see the price up front</td>
                  <td>Yes, standard enterprise sales process</td>
                </tr>
                <tr>
                  <th scope="row">Onboarding time</th>
                  <td className="us">Minutes — add competitors, first signal same day</td>
                  <td>Guided enterprise rollout, typically weeks</td>
                </tr>
                <tr>
                  <th scope="row">Contract length</th>
                  <td className="us">Monthly on Starter and Growth; custom terms on Enterprise</td>
                  <td>Annual is standard for enterprise-quoted CI software</td>
                </tr>
                <tr>
                  <th scope="row">Evidence per claim</th>
                  <td className="us">Every claim links to the public source it came from</td>
                  <td>Claims are scored by confidence, not always tied to a visible source</td>
                </tr>
                <tr>
                  <th scope="row">Coverage breadth</th>
                  <td className="us">28 public channels per competitor</td>
                  <td>Broad tracking across a comparable set of public channels</td>
                </tr>
                <tr>
                  <th scope="row">Support model</th>
                  <td className="us">Self-serve product, email support</td>
                  <td>Dedicated CS as part of the enterprise contract, typically</td>
                </tr>
                <tr>
                  <th scope="row">Independence</th>
                  <td className="us">Independent company — this is the only thing we build</td>
                  <td>Independent company, the established category leader</td>
                </tr>
                <tr>
                  <th scope="row">Best fit</th>
                  <td className="us">Founders, PMM teams of one, sales leads who want signal today</td>
                  <td>Large teams with a dedicated CI function and enterprise budget</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>Competitive landscape: how fast the picture actually changes</h2>
          <p className="lede">
            Whichever platform you pick, the underlying market keeps moving — and the most useful signals are often
            things a company stops doing rather than something new it announces. We watch these same vendors
            ourselves, because we compete with them, and one real example we&apos;ve published shows why that
            matters more than a single snapshot ever could.
          </p>
          <div className="cpx-context">
            <h3>An example, not a live counter</h3>
            <ul>
              <li>
                <b>Ad spend</b>
                Google and LinkedIn both publish searchable, public archives of the ads running on their platforms.
                Pulled against our own market, Crayon — an established incumbent — runs zero live ads on Google and
                roughly one on LinkedIn, a near-silent posture next to smaller, newer entrants that advertise
                aggressively. That&apos;s a real, checkable finding from a public ad library, not an estimate.
              </li>
              <li>
                <b>Why it&apos;s worth knowing</b>
                An incumbent going quiet on paid isn&apos;t automatically a weakness — it can mean a company is
                winning on integrations and word of mouth rather than interruption. Either way, it&apos;s a
                strategic fact a one-time look wouldn&apos;t catch, because it&apos;s legible only by comparing this
                month against the last several.
              </li>
            </ul>
            <span className="cite">
              Source: our own field-note research into public ad libraries across our tracked competitor set —
              real, dated, not a projected volume number.
            </span>
          </div>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>When Crayon is still the better choice</h2>
          <p className="lede">
            Crayon earned the category&apos;s name for a reason: at real enterprise scale, with a dedicated CI team
            to run it, it does a lot, and its breadth of coverage and maturity as a platform are genuine. If
            you&apos;re already running a CI program with the headcount to operate it, and the value of that
            breadth clearly outweighs the enterprise price tag you&apos;re already comfortable paying elsewhere in
            the stack, switching isn&apos;t obviously worth the disruption.
          </p>
          <p className="lede">
            Most teams reading this aren&apos;t that team. If you want comparable coverage without the enterprise
            contract, and you want to check a claim against its source yourself rather than trust a confidence
            score, that&apos;s the gap we built for.
          </p>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>Methodology</h2>
          <div className="cpx-method">
            <b>How this comparison was built</b>
            The rows above come from Crayon&apos;s own public pricing page, product marketing and their demo-gated
            sales process — not a paid analyst report or a sales call with them. Our side is drawn directly from
            our own published pricing and product pages. This page follows the same competitive frame set out in
            our brand documentation: we don&apos;t punch down at Crayon for being the established leader — that
            breadth is real — and we don&apos;t claim anything on our side that isn&apos;t shipped today.
          </div>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>Questions people actually ask</h2>
          <div className="cpx-faq">
            <details className="cpx-faq-item">
              <summary>Is Fortress HQ&apos;s coverage really comparable to Crayon&apos;s?</summary>
              <p>
                We watch 28 public channels per competitor — pricing, ads, hiring, reviews, launches, press,
                certificate logs and more. Crayon&apos;s breadth is comparable in scope; the difference we&apos;re
                claiming is price and citation discipline, not a bigger channel count on our side.
              </p>
            </details>
            <details className="cpx-faq-item">
              <summary>What does &quot;confidence score&quot; mean and why does it matter?</summary>
              <p>
                Some CI platforms attach a confidence percentage to a claim instead of a clickable source. That can
                be useful shorthand, but it asks you to trust a number instead of checking the evidence yourself.
                We link the source instead, so you can verify a claim in the time it takes to click through.
              </p>
            </details>
            <details className="cpx-faq-item">
              <summary>Can I run Fortress HQ alongside Crayon during a trial?</summary>
              <p>
                Yes — there&apos;s nothing exclusive about either tool, and starting free doesn&apos;t require
                canceling anything else. Most people evaluating an alternative want to compare real output before
                switching, and that&apos;s a reasonable way to do it.
              </p>
            </details>
            <details className="cpx-faq-item">
              <summary>Is Crayon a bad product?</summary>
              <p>
                No, and we&apos;re not going to pretend otherwise. It&apos;s the category&apos;s established
                leader for a reason. The question this page answers isn&apos;t &quot;which is better&quot; in the
                abstract — it&apos;s which fits a team that doesn&apos;t have a dedicated CI function and an
                enterprise budget.
              </p>
            </details>
            <details className="cpx-faq-item">
              <summary>Do you track Crayon the same way you&apos;d track any competitor?</summary>
              <p>
                Yes — the ad-library example above is exactly the kind of read the product produces for any
                competitor a customer adds. We&apos;re not applying a different process to write about Crayon than
                the one the product runs every day.
              </p>
            </details>
          </div>
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
