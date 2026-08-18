import Link from 'next/link';

export const metadata = {
  title: 'For Product Marketing — Fortress HQ',
  description:
    'Battlecards that update themselves and cite their sources, so you stop being the one thing standing between sales and a stale card.',
};

export default function ProductMarketingPage() {
  return (
    <>
      <section className="tmx-hero">
        <div className="tmx-wrap">
          <h1 className="tmx-pull">
            Someone asks what&apos;s new with them. <span className="hl">You don&apos;t know.</span>
          </h1>
          <p className="tmx-dek">
            You wrote the battlecard once, carefully, with sources. That was three months and one price change ago.
            You&apos;re the whole competitive intelligence function, and the market didn&apos;t agree to wait for
            you to have a free afternoon.
          </p>
          <div className="tmx-tiles">
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>Cards that update themselves</p>
            </div>
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>Sourced, forwardable to sales</p>
            </div>
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>One card per competitor, current</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-proof-sec">
        <div className="tmx-wrap">
          <p className="tmx-proof">
            When a competitor&apos;s pricing page changes, their card updates the same day, with the page it came
            from linked underneath. <b>What you forward to a rep is something you can defend on a call</b> —
            not a paraphrase of a screenshot someone sent you, but a claim with a source attached.
          </p>
        </div>
      </section>

      <section className="wt-close">
        <div className="wrap">
          <h2>Stop being the last to know.</h2>
          <p>Name your competitors, or let the Tower find them. Real signals inside the hour.</p>
          <div className="wt-cta">
            <Link href="/sign-up" className="btn btn-primary btn-lg">Start free</Link>
            <Link href="/demo" className="btn btn-ghost btn-lg">Try the live demo</Link>
          </div>
        </div>
      </section>
    </>
  );
}
