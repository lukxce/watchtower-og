import Link from 'next/link';

export const metadata = {
  title: 'For Product Teams — Fortress HQ',
  description:
    'Early buildout signals — hostnames, hiring clusters — before the launch post, not after.',
};

export default function ProductTeamPage() {
  return (
    <>
      <section className="tmx-hero">
        <div className="tmx-wrap">
          <h1 className="tmx-pull">
            You find out they shipped it <span className="hl">from the launch post.</span>
          </h1>
          <p className="tmx-dek">
            The thing on your roadmap, the one you were building carefully and on your own timeline, is suddenly a
            competitor&apos;s announcement. The work that gave it away was public for months. Nobody was watching
            for it.
          </p>
          <div className="tmx-tiles">
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>Hostnames before the announcement</p>
            </div>
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>Hiring clusters as a leading signal</p>
            </div>
            <div className="tmx-tile">
              <span className="tmx-tile-k">What you get</span>
              <p>Buildout, not headlines</p>
            </div>
          </div>
        </div>
      </section>

      <section className="tmx-proof-sec">
        <div className="tmx-wrap">
          <p className="tmx-proof">
            A hostname on the certificate log shows up the week it&apos;s registered, not the week they announce
            it. <b>Three subdomains handed to one feature, alongside a run of senior hires in the same area</b>, is
            engineering commitment you can see months before the press release — read together, not as a pile of
            disconnected facts.
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
