import Link from 'next/link';

export const metadata = {
  title: 'For Marketing Teams — Fortress HQ',
  description:
    'Comparison pages, campaigns and positioning built on what your competitors are actually doing right now, not what someone remembers from last quarter.',
};

export default function MarketingTeamPage() {
  return (
    <>
      <section className="tmx-hero">
        <div className="tmx-wrap">
          <h1 className="tmx-pull">
            You find out your comparison page is wrong <span className="hl">from a prospect&apos;s reply-all.</span>
          </h1>
          <p className="tmx-dek">
            A competitor drops their price, renames a plan, ships the feature your page says they don&apos;t have —
            and the page just sits there, wrong, until someone outside the company points it out. Marketing carries
            the market&apos;s narrative. It only holds up if the facts under it are current.
          </p>
          <div className="tmx-tiles">
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>One market narrative, sourced</p>
            </div>
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>Comparison pages that stay true</p>
            </div>
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>Nothing goes out uncited</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-proof-sec">
        <div className="tmx-wrap">
          <p className="tmx-proof">
            Every signal in the feed links to the page, ad, job post or filing it came from — the same citation
            that keeps a comparison page honest instead of guessed at. <b>When a competitor changes their pricing
            page, that&apos;s a dated, sourced fact you can act on the same week</b>, not a rumor someone half-remembers
            from a call three months ago.
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
