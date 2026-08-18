import Link from 'next/link';

export const metadata = {
  title: 'Sales Intelligence — Fortress HQ',
  description:
    'Battlecards built from review patterns and funding moves, not a hunch — how a rep wins against a named competitor, cited and current.',
};

export default function SalesIntelligenceHub() {
  return (
    <div className="hbx">
      <section className="hbx-hero">
        <div className="wrap">
          <span className="hbx-crumb">Sales intelligence</span>
          <h1 className="mkt-h1" style={{ marginLeft: 0, marginRight: 0, textAlign: 'left' }}>
            How we win against X, before the call.
          </h1>
          <p className="lede" style={{ marginLeft: 0, textAlign: 'left' }}>
            Reps lose deals on objections nobody briefed them on, and battlecards go stale the week after someone
            writes them by hand. Fortress HQ builds the battlecard from what a competitor is actually doing right
            now &mdash; their review patterns, their funding, their pricing &mdash; and keeps it current without anyone
            maintaining a doc.
          </p>
        </div>
      </section>

      <section className="hbx-stats">
        <div className="wrap">
          <div className="hbx-stat-grid">
            <div className="hbx-stat"><span className="n">5</span><span className="l">Review platforms watched for win-loss signal &mdash; G2, Trustpilot, Capterra, TrustRadius, Gartner</span></div>
            <div className="hbx-stat"><span className="n">1</span><span className="l">Funding &amp; M&amp;A channel &mdash; SEC EDGAR Form D plus funding news, no key required</span></div>
            <div className="hbx-stat"><span className="n">5</span><span className="l">Weighted dimensions behind the Threat Index, always shown with its inputs</span></div>
            <div className="hbx-stat"><span className="n">$399/mo</span><span className="l">Growth tier &mdash; auto-generated battlecards, always current</span></div>
          </div>
        </div>
      </section>

      <section className="hbx-argument">
        <div className="wrap">
          <div className="hbx-panel">
            <h2>A battlecard is only useful if it&apos;s still true.</h2>
            <p>
              Most battlecards are written once, after a lost deal, and go stale the moment the market moves again.
              Fortress HQ writes &ldquo;how we win against X&rdquo; from the same signals a rep would want on a call, and
              rebuilds it as those signals change &mdash; not on a quarterly review cycle.
            </p>
            <p>
              <span className="accent">Review patterns are the closest thing to a live focus group your competitor
              runs on themselves.</span> A cluster of new G2 or Capterra reviews naming the same complaint &mdash; slow
              support, a missing integration, a confusing upgrade path &mdash; is an objection a rep can use, sourced to
              the review itself. A Trustpilot or Gartner Peer Insights pattern that skews positive tells you where
              not to compete on price alone.
            </p>
            <p>
              Corporate moves matter just as much. A competitor raising a round changes their runway and their sales
              pressure. A departed VP of Sales or Product is a deal-relevant fact, not gossip &mdash; and it always links
              to the article or filing that says so.
            </p>
          </div>
        </div>
      </section>

      <section className="hbx-how">
        <div className="wrap">
          <span className="wt-eyebrow">How it actually works</span>
          <h2 className="wt-h2">From a public review to a line a rep can say on a call.</h2>
          <div className="hbx-how-grid">
            <div className="hbx-how-item">
              <span className="step">01 · Reputation channels</span>
              <h3>Review patterns become objections</h3>
              <p>
                <code>g2</code>, <code>trustpilot</code>, <code>capterra</code>, <code>trustradius</code> and
                <code> gartner</code> feed the same reasoning layer &mdash; a recurring complaint or a review spike is
                weighed into the read, cited to the platform it came from.
              </p>
            </div>
            <div className="hbx-how-item">
              <span className="step">02 · Corporate moves</span>
              <h3>Funding and exec changes are deal facts</h3>
              <p>
                The <code>funding</code> channel reads SEC EDGAR Form D filings and funding news, keyless. A raise, a
                departure, an acquisition &mdash; each lands with the source, not as a rumor a rep half-remembers from
                LinkedIn.
              </p>
            </div>
            <div className="hbx-how-item">
              <span className="step">03 · The card writes itself</span>
              <h3>One briefing, scored, always current</h3>
              <p>
                Battlecards rebuild from everything on file &mdash; strengths, vulnerabilities, how to win, the one
                question to ask &mdash; alongside a Threat Index scored across five dimensions and shown with its
                inputs, never as a bare number.
              </p>
            </div>
          </div>
          <p className="wt-fine">
            Today, review patterns and funding moves surface in the daily feed and in each battlecard. Pushing a
            standing rule out to Slack the moment one fires is the delivery layer we&apos;re building next &mdash; the
            scoring that decides what&apos;s worth surfacing already runs; the notification isn&apos;t wired yet, and we&apos;d
            rather say that than imply it.
          </p>
        </div>
      </section>

      <section className="hbx-cta">
        <div className="wrap">
          <div className="wt-inline-cta">
            <p>See a real battlecard, built from public signals about our own market, with every line sourced.</p>
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
