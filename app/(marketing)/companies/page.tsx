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
  line: string[];
  slug?: string;
}[] = [
  {
    name: 'Klue',
    domain: 'klue.com',
    line: [
      'Enterprise CI, sales-enablement led. Strong battlecards, deep CRM integration for sales orgs standardized on Salesforce.',
      'Quote after a demo call — no published price, and the sales process is sized for a large deployment, not a quick evaluation.',
    ],
    slug: 'klue',
  },
  {
    name: 'Crayon',
    domain: 'crayon.co',
    line: [
      "The category's brand name — broad tracking, an enterprise motion, and the customer base that comes with being the incumbent.",
      'Their public ad spend has run near-zero on Google in our own checks, which reads as a company defending an installed base rather than chasing new logos through paid channels.',
    ],
    slug: 'crayon',
  },
  {
    name: 'Kompyte',
    domain: 'kompyte.com',
    line: [
      "Acquired by Semrush in 2022; now runs on Semrush's distribution and roadmap rather than as an independent product.",
      'Their own careers page has returned a 404 and there is no independent ad account under their name in either Google or LinkedIn’s public libraries — both consistent with hiring and spend now routing through the parent company.',
    ],
    slug: 'kompyte',
  },
  {
    name: 'Visualping',
    domain: 'visualping.io',
    line: [
      'Page-change monitoring. Cheap, useful, and genuinely good at one channel — it tells you a page changed.',
      "It doesn't tell you why the change matters or read it alongside anything else happening at the same company, which is a different job than the one it's built for.",
    ],
  },
  {
    name: 'Signal Labs',
    domain: 'usesignallabs.com',
    line: [
      'A newer entrant in competitive intelligence, still establishing its position in a category Klue and Crayon have occupied for years.',
      'Pricing is quoted at Team tier on a call rather than published, the same gate as the larger incumbents.',
    ],
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
            the public Fortress HQ demo workspace, why each of them is here, and one plain description of where
            they stand. For live signal counts and threat scores on any of them, see the actual demo.
          </p>
        </div>
      </section>

      <section className="cpx-section">
        <div className="wrap">
          <h2>What this directory is, and how a company gets on it</h2>
          <p className="lede">
            Five companies are on this page because they are the same five competitors seeded into the public demo
            workspace anyone can try without an account — not a ranked list, not a &quot;top vendors&quot; roundup,
            and not something a competitor can pay to appear on or be removed from. Three of them (Klue, Crayon,
            Kompyte) get a full comparison page because they&apos;re the vendors people actually search against us
            by name; the other two get a shorter, neutral line because we don&apos;t have a built comparison for
            them yet, not because we think less of them. Nothing here is a live pull from our own tracking system
            — the descriptions are static, written once, and updated by hand when something material changes,
            which is also why they carry no invented statistics or counters that would go stale the moment they&apos;re
            published. If you want the version of this that updates itself, that&apos;s what the actual product
            watches for.
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
                {c.line.map((p) => (
                  <p key={p}>{p}</p>
                ))}
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
