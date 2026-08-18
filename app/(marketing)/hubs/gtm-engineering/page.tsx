import Link from 'next/link';

export const metadata = {
  title: 'GTM Engineering — Fortress HQ',
  description:
    'Every competitive signal in Fortress HQ is already a structured, source-linked record. Today it surfaces in the product. A public API is next, not yet shipped.',
};

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
            <div className="hbx-stat"><span className="n">22</span><span className="l">Public channels, each collector self-defers cleanly when its own credential is absent</span></div>
            <div className="hbx-stat"><span className="n">7</span><span className="l">Channel groups every signal is tagged with &mdash; Product, GTM &amp; ads, Talent, Voice &amp; PR, Reputation, Market, Corporate</span></div>
            <div className="hbx-stat"><span className="n">5</span><span className="l">Weighted dimensions behind the Threat Index, stored per-dimension for audit, not a black box</span></div>
            <div className="hbx-stat"><span className="n">1</span><span className="l">Source URL required on every conclusion, or it isn&apos;t shown</span></div>
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
                Each of the 22 channels &mdash; <code>ads_meta</code>, <code>subdomains</code>, <code>jobs</code>,
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
