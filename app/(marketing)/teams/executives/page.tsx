import Link from 'next/link';

export const metadata = {
  title: 'For Executives — Fortress HQ',
  description:
    'The state of the market in ten seconds, without assigning anyone to compile it.',
};

export default function ExecutivesPage() {
  return (
    <>
      <section className="tmx-hero">
        <div className="tmx-wrap">
          <h1 className="tmx-pull">
            <span className="hl">You find out in the board meeting.</span>
          </h1>
          <p className="tmx-dek">
            A board member mentions a competitor&apos;s move and the room turns to you. You could ask someone to go
            compile a market update, or you could already have one — not a feed to scroll, one page, that says
            what changed and why it matters.
          </p>
          <div className="tmx-tiles">
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>The state of the market in ten seconds</p>
            </div>
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>No feed to read</p>
            </div>
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>One page, cited</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-proof-sec">
        <div className="tmx-wrap">
          <p className="tmx-proof">
            Every morning&apos;s briefing is one page: what moved, why it matters, what&apos;s worth watching.
            <b> Every line traces back to a source</b> — a pricing page, a job post, a filing — so what you bring
            into the room is something you can stand behind, not a summary of a summary.
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
