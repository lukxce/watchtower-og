import '../compare-resources.css';

export const metadata = {
  title: 'Companies — Fortress HQ',
  description:
    'The competitors tracked in the live Fortress HQ demo workspace: Kompyte, Crayon, Klue, Visualping, and Signal Labs.',
};

// The real five competitors seeded into the public demo workspace — see
// scripts/seed-demo.ts. Domains copied verbatim from there. Positioning
// lines are drawn from docs/BRAND.md §2 where a counter exists; the two
// without a Part-1 alternatives page (Visualping, Signal Labs) get a
// neutral factual line instead, and no link, per that same table.
const COMPANIES: {
  name: string;
  domain: string;
  line: string;
  slug?: string;
}[] = [
  {
    name: 'Klue',
    domain: 'klue.com',
    line: 'Enterprise CI, sales-enablement led. Strong battlecards, deep CRM integration. Quote after a demo call.',
    slug: 'klue',
  },
  {
    name: 'Crayon',
    domain: 'crayon.co',
    line: "The category's brand name. Broad tracking, enterprise motion, expensive.",
    slug: 'crayon',
  },
  {
    name: 'Kompyte',
    domain: 'kompyte.com',
    line: "Acquired by Semrush; now runs on Semrush's distribution rather than as an independent product.",
    slug: 'kompyte',
  },
  {
    name: 'Visualping',
    domain: 'visualping.io',
    line: 'Page-change monitoring. Cheap, useful, and genuinely good at one channel.',
  },
  {
    name: 'Signal Labs',
    domain: 'usesignallabs.com',
    line: 'Newer entrant in competitive intelligence. Quotes Team-tier pricing on a call.',
  },
];

export default function Companies() {
  return (
    <div className="cpx">
      <section className="cpx-hero">
        <div className="wrap">
          <span className="kicker">Companies</span>
          <h1>The companies we track in the live demo</h1>
          <p className="lede">
            This is a static, honest directory — not a data pull. It lists the five real competitors seeded into
            the public Fortress HQ demo workspace, why each of them is here, and one plain line on where they
            stand. For live signal counts and threat scores on any of them, see the actual demo.
          </p>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <div className="cpx-cards">
            {COMPANIES.map((c) => (
              <div key={c.domain} className="cpx-card">
                <h3>{c.name}</h3>
                <span className="domain">{c.domain}</span>
                <p>{c.line}</p>
                {c.slug ? (
                  <a className="cpx-link" href={`/alternatives/${c.slug}`}>
                    {c.name} alternative →
                  </a>
                ) : (
                  <span className="cpx-nolink">No alternatives page yet</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
