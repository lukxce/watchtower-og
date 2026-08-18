import Link from 'next/link';

export const metadata = {
  title: 'For Sales — Fortress HQ',
  description:
    'How you win against each competitor, in language a rep can use on a call, sourced instead of guessed.',
};

export default function SalesTeamPage() {
  return (
    <>
      <section className="tmx-hero">
        <div className="tmx-wrap">
          <h1 className="tmx-pull">
            <span className="hl">You find out from a lost deal.</span>
          </h1>
          <p className="tmx-dek">
            The rep hits an objection nobody briefed them on, on a call, live, and loses ground they can&apos;t
            get back. Not because the answer didn&apos;t exist — because nobody had written it down yet.
          </p>
          <div className="tmx-tiles">
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>Objection handling before the call</p>
            </div>
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>Sourced, not guessed</p>
            </div>
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>One battlecard per deal</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-proof-sec">
        <div className="tmx-wrap">
          <p className="tmx-proof">
            Each competitor&apos;s battlecard carries the objections reps actually hit — a pricing move, a feature
            they started advertising, a review that names you — each one sourced to the page or post that raised
            it. <b>&quot;How we win against X&quot; is written in language a rep can say out loud</b>, not a
            paragraph of positioning theory nobody reads before a call.
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
