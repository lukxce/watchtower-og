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
    line: [
      'Enterprise CI, sales-enablement led. Strong battlecards, deep CRM integration for teams that live inside Salesforce at deal time.',
      'The catch is the sales process: pricing is a quote, and the quote comes after a demo call, which is real friction for a team of one.',
    ],
  },
  {
    slug: 'crayon',
    name: 'Crayon',
    line: [
      "The category's brand name — broad tracking, an established customer base, an enterprise motion to match.",
      'Priced and sold for a team with a dedicated CI function, not necessarily for the team evaluating it today.',
    ],
  },
  {
    slug: 'kompyte',
    name: 'Kompyte',
    line: [
      'Acquired by Semrush in 2022. The original product was capable, but it now runs on Semrush’s distribution and roadmap.',
      'That’s a structural fact about ownership, not a knock on the technology — and it changes what gets prioritized.',
    ],
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
          <h2>What this section is, and how it&apos;s built</h2>
          <p className="lede">
            Each page below follows the same structure: their real position stated plainly, a comparison table with
            the rows people actually ask about, an honest section on where the other tool is still the better
            choice, and a short methodology note on where the numbers came from. We don&apos;t maintain a separate
            &quot;alternatives&quot; content team writing sales copy — every row in every table traces back to
            either the competitor&apos;s own public pricing and product pages, or to our own published pricing and
            product pages, so both halves of any comparison are checkable against a primary source. The competitive
            frame these pages follow — who we compare against, and what we&apos;re allowed to claim about them — is
            set out in our own brand documentation, and we hold ourselves to it: we don&apos;t punch down at a
            smaller or more honest tool, and we don&apos;t claim a feature on our side that hasn&apos;t shipped.
          </p>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <div className="cpx-cards">
            {ALTS.map((a) => (
              <Link key={a.slug} href={`/alternatives/${a.slug}`} className="cpx-card">
                <h3>{a.name} alternative</h3>
                {a.line.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <span className="cpx-link">Compare Fortress HQ vs. {a.name} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
