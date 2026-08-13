// Seed the competitor registry with the verified identities resolved during the
// MVP (Meta page IDs, YouTube handle, generic-name query overrides, pinned
// pages). Idempotent. Run: npm run seed
import { getDb } from '../src/db/client';
import { setBrandSettings } from '../src/lib/brand';

// Seeds into a single workspace — 'dev-workspace' locally, or a real Clerk org
// id via `ORG_ID=org_xxx npm run seed` against a production DATABASE_URL.
const ORG_ID = process.env.ORG_ID ?? 'dev-workspace';

const COMPETITORS = [
  {
    slug: 'upfluence', name: 'Upfluence', domain: 'www.upfluence.com', track_linkedin: true,
    meta_page_id: '322305720976754', youtube_handle: null,
    queries: {},
    extra_tier1: ['/pricing', '/analytics', '/campaign-management', '/creator-marketplace', '/find-influencers', '/influencer-search', '/influencer-payments', '/manage-influencers', '/jaice-ai-influencer-marketing', '/affiliate-marketing', '/ecommerce-influencer-marketing', '/influencer-marketing-api', '/research'],
    extra_tier2: ['/integrations', '/case-studies', '/partner-program', '/press-media'],
  },
  { slug: 'creatoriq', name: 'CreatorIQ', domain: 'creatoriq.com', track_linkedin: true, meta_page_id: '1245956995525658', youtube_handle: null, queries: {}, extra_tier1: [], extra_tier2: [] },
  {
    slug: 'grin', name: 'Grin', domain: 'grin.co', track_linkedin: false, meta_page_id: null,
    youtube_handle: 'GRINInfluencerMarketing',
    queries: { news: '"GRIN" influencer marketing', reddit: 'grin influencer', podcast: 'GRIN influencer marketing' },
    extra_tier1: [], extra_tier2: [],
  },
  { slug: 'modash', name: 'Modash', domain: 'modash.io', track_linkedin: true, meta_page_id: null, youtube_handle: null, queries: {}, extra_tier1: [], extra_tier2: [] },
  {
    slug: 'thecirqle', name: 'The Cirqle', domain: 'thecirqle.com', track_linkedin: false,
    meta_page_id: '363646717110661', youtube_handle: null,
    queries: { news: '"The Cirqle"', reddit: '"the cirqle"', podcast: 'The Cirqle' },
    extra_tier1: ['/affiliate', '/ambassador', '/partnership-ads', '/mcp'], extra_tier2: [],
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
      [ORG_ID, c.slug, c.name, c.domain, c.meta_page_id, c.youtube_handle, c.track_linkedin, JSON.stringify(c.queries), JSON.stringify(c.extra_tier1), JSON.stringify(c.extra_tier2)],
    );
    console.log('seeded', c.name, 'into', ORG_ID);
  }
  // Dev workspace only: seed its own brand identity (Hypefy, the workspace's
  // real product, also tracked reflexively as a 6th "competitor" for demo
  // parity) so the Mentions module has something real to search for out of
  // the box. Never do this for a real customer org — their brand can't be
  // guessed, so a fresh workspace stays unconfigured until the owner sets it.
  if (ORG_ID === 'dev-workspace') {
    await setBrandSettings(ORG_ID, 'Hypefy', 'hypefy.ai', []);
    console.log('seeded brand identity: Hypefy (dev-workspace only)');
  }
  console.log('done.');
  process.exit(0);
}
main();
