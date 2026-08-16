// Seeds the PUBLIC demo workspace (src/lib/demo.ts → DEMO_ORG_ID).
//
// Deliberately not the dev/Hypefy workspace: that one holds a real company's
// private competitive analysis, and /demo is world-readable. This workspace is
// Watchtower dogfooding itself — us against the real competitive-intelligence
// market. Every competitor below is a genuine public company in this category,
// so every signal the demo shows is real, which is the whole pitch.
//
// Run: DATABASE_URL=... npx tsx scripts/seed-demo.ts
import { getDb } from '../src/db/client';
import { setBrandSettings } from '../src/lib/brand';
import { DEMO_ORG_ID } from '../src/lib/demo';

const COMPETITORS = [
  {
    slug: 'kompyte', name: 'Kompyte', domain: 'kompyte.com', track_linkedin: true,
    meta_page_id: null, youtube_handle: null,
    queries: { news: 'Kompyte competitive intelligence', reddit: 'kompyte', podcast: 'Kompyte' },
    extra_tier1: ['/pricing', '/battlecards', '/competitive-intelligence-automation', '/integrations'],
    extra_tier2: ['/case-studies', '/about'],
  },
  {
    slug: 'crayon', name: 'Crayon', domain: 'www.crayon.co', track_linkedin: true,
    meta_page_id: null, youtube_handle: null,
    queries: { news: 'Crayon competitive intelligence platform', reddit: 'crayon competitive intelligence', podcast: 'Crayon competitive intelligence' },
    extra_tier1: ['/pricing', '/platform', '/battlecards', '/competitive-intelligence'],
    extra_tier2: ['/customers', '/resources'],
  },
  {
    slug: 'klue', name: 'Klue', domain: 'klue.com', track_linkedin: true,
    meta_page_id: null, youtube_handle: null,
    queries: { news: 'Klue competitive enablement', reddit: 'klue competitive', podcast: 'Klue competitive enablement' },
    extra_tier1: ['/pricing', '/platform', '/battlecards', '/win-loss-analysis'],
    extra_tier2: ['/customers', '/about'],
  },
  {
    slug: 'visualping', name: 'Visualping', domain: 'visualping.io', track_linkedin: true,
    meta_page_id: null, youtube_handle: null,
    queries: { news: 'Visualping website change monitoring', reddit: 'visualping', podcast: 'Visualping' },
    extra_tier1: ['/pricing', '/enterprise', '/competitive-intelligence'],
    extra_tier2: ['/blog', '/about'],
  },
  {
    // The closest competitor in the set: same promise (source-linked
    // citations on every claim), same artifacts (battlecards, an ask-the-AI
    // chat in "Ask CIx"), and a free tier that tracks one competitor.
    slug: 'signal-labs', name: 'Signal Labs', domain: 'usesignallabs.com', track_linkedin: true,
    meta_page_id: null, youtube_handle: null,
    queries: { news: '"Signal Labs" competitive intelligence CIx', reddit: 'signal labs competitive intelligence', podcast: 'Signal Labs competitive intelligence' },
    extra_tier1: ['/pricing', '/cix', '/solutions', '/docs'],
    extra_tier2: ['/blog', '/about', '/contact'],
  },
];

async function main() {
  const db = await getDb();
  for (const c of COMPETITORS) {
    await db.query(
      `INSERT INTO competitors (org_id, slug, name, domain, meta_page_id, youtube_handle, track_linkedin, queries, extra_tier1, extra_tier2)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (org_id, slug) DO UPDATE SET name=EXCLUDED.name, domain=EXCLUDED.domain, meta_page_id=EXCLUDED.meta_page_id,
         youtube_handle=EXCLUDED.youtube_handle, track_linkedin=EXCLUDED.track_linkedin, queries=EXCLUDED.queries,
         extra_tier1=EXCLUDED.extra_tier1, extra_tier2=EXCLUDED.extra_tier2`,
      [DEMO_ORG_ID, c.slug, c.name, c.domain, c.meta_page_id, c.youtube_handle, c.track_linkedin,
       JSON.stringify(c.queries), JSON.stringify(c.extra_tier1), JSON.stringify(c.extra_tier2)],
    );
    console.log('seeded', c.name);
  }

  // Our own identity, so Mentions has something real to look for and the
  // battlecards are written against our actual positioning.
  await setBrandSettings(
    DEMO_ORG_ID,
    'Watchtower',
    'watchtower-og.vercel.app',
    ['Watchtower', 'watchtower.ai'],
    'Competitive intelligence that reads signals together instead of forwarding detections. Tracks 22 public channels per competitor including certificate transparency logs, ad libraries, job boards and review sites, bundles them into one card per real event, and writes one cited briefing per competitor. Self-serve from $99/mo, prices published, no demo call.',
    'Signal bundling, cross-referenced reads, cited evidence with disclosed gaps, pre-launch detection via certificate logs, self-serve pricing',
  );
  console.log('seeded brand identity: Watchtower →', DEMO_ORG_ID);
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
