import Link from 'next/link';

export const metadata = {
  title: 'Compare — Fortress HQ',
  description: 'How Fortress HQ compares to the other ways people try to track competitors.',
};

const COMPARES = [
  {
    slug: 'chatgpt',
    name: 'Just asking ChatGPT',
    line: [
      'AI chat tools are genuinely good at summarizing what has already been written about a competitor — that credit is real.',
      "That's a different job from watching one continuously, verifying a claim, or catching something that happened an hour ago.",
    ],
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
          <h2>How this section differs from Alternatives</h2>
          <p className="lede">
            <Link href="/alternatives">Alternatives</Link> compares us to other vendors — Klue, Crayon, Kompyte —
            purpose-built competitive-intelligence products with their own pricing pages and sales teams. This
            section compares us to something else entirely: the habits and workarounds most teams reach for before
            they ever evaluate a dedicated tool. A chat model. A shared doc someone updates when they remember to.
            Those aren&apos;t vendors with a position to fact-check against a pricing page, so the comparisons here
            lean more on describing how the habit actually behaves in practice — where it genuinely helps, and
            where it quietly stops being enough. Same rule as the rest of the site: we credit what the alternative
            is actually good at before we say where it falls short, and every comparison follows the same
            competitive frame set out in our brand documentation.
          </p>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <div className="cpx-cards">
            {COMPARES.map((c) => (
              <Link key={c.slug} href={`/compare/${c.slug}`} className="cpx-card">
                <h3>Fortress HQ vs. {c.name}</h3>
                {c.line.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <span className="cpx-link">Read the comparison →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
