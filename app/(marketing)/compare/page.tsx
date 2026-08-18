import Link from 'next/link';

export const metadata = {
  title: 'Compare — Fortress HQ',
  description: 'How Fortress HQ compares to the other ways people try to track competitors.',
};

const COMPARES = [
  {
    slug: 'chatgpt',
    name: 'Just asking ChatGPT',
    line: 'AI chat tools are genuinely good at summarizing what has already been written about a competitor. That is a different job from watching one.',
  },
];

export default function CompareIndex() {
  return (
    <>
      <section className="cpx-hero">
        <div className="wrap">
          <span className="kicker">Compare</span>
          <h1>How Fortress HQ compares</h1>
          <p className="lede">
            Not every alternative to a proper watch is another vendor. Sometimes it&apos;s a habit — asking an AI
            chat tool, or keeping a shared doc. Here&apos;s the honest comparison.
          </p>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <div className="cpx-cards">
            {COMPARES.map((c) => (
              <Link key={c.slug} href={`/compare/${c.slug}`} className="cpx-card">
                <h3>Fortress HQ vs. {c.name}</h3>
                <p>{c.line}</p>
                <span className="cpx-link">Read the comparison →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
