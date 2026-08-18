import Link from 'next/link';

export const metadata = {
  title: 'Alternatives — Fortress HQ',
  description:
    'Looking for a Klue, Crayon, or Kompyte alternative? Honest, source-by-source comparisons — published pricing, no demo call, every claim cited.',
};

const ALTS = [
  {
    slug: 'klue',
    name: 'Klue',
    line: 'Enterprise CI, sales-enablement led. Strong battlecards, deep CRM integration — but pricing is a quote after a demo call.',
  },
  {
    slug: 'crayon',
    name: 'Crayon',
    line: "The category's brand name. Broad tracking, enterprise motion, enterprise pricing to match.",
  },
  {
    slug: 'kompyte',
    name: 'Kompyte',
    line: "Acquired by Semrush in 2022. Now runs on Semrush's distribution rather than as an independent product.",
  },
];

export default function AlternativesIndex() {
  return (
    <>
      <section className="cpx-hero">
        <div className="wrap">
          <span className="kicker">Alternatives</span>
          <h1>Looking for a Klue, Crayon, or Kompyte alternative?</h1>
          <p className="lede">
            Here&apos;s the honest version of each comparison — their real position, ours, and a plain table you
            can check for yourself. No spin, no invented competitors: these are the three vendors people actually
            search against us.
          </p>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <div className="cpx-cards">
            {ALTS.map((a) => (
              <Link key={a.slug} href={`/alternatives/${a.slug}`} className="cpx-card">
                <h3>{a.name} alternative</h3>
                <p>{a.line}</p>
                <span className="cpx-link">Compare Fortress HQ vs. {a.name} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
