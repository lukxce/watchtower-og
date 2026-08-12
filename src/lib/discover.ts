// Onboarding discovery: seed the sitemap baseline and register tier-1/tier-2
// pages + pinned extra pages for a competitor. Idempotent (upserts only).
import { getDb } from '@/db/client';
import { discoverUrls, classifyTier } from '@/lib/sitemap';
import type { Competitor } from '@/db/queries';

const TIER1_CAP = 40;
const TIER2_CAP = 60;

export async function discoverPages(comp: Competitor): Promise<string> {
  const db = await getDb();
  const { urls } = await discoverUrls(comp.domain);
  let t1 = 0;
  let t2 = 0;
  for (const u of urls) {
    const tier = classifyTier(u.loc);
    if (tier === 1 && t1 < TIER1_CAP) {
      await db.query('INSERT INTO pages (competitor_id, url, tier) VALUES ($1,$2,1) ON CONFLICT (competitor_id, url) DO NOTHING', [comp.id, u.loc]);
      t1++;
    } else if (tier === 2 && t2 < TIER2_CAP) {
      await db.query('INSERT INTO pages (competitor_id, url, tier) VALUES ($1,$2,2) ON CONFLICT (competitor_id, url) DO NOTHING', [comp.id, u.loc]);
      t2++;
    }
    await db.query(
      `INSERT INTO sitemap_urls (competitor_id, url, lastmod, tier) VALUES ($1,$2,$3,$4)
       ON CONFLICT (competitor_id, url) DO UPDATE SET lastmod = EXCLUDED.lastmod`,
      [comp.id, u.loc, u.lastmod ?? null, tier],
    );
  }
  // Always watch the homepage + config-pinned pages.
  await db.query('INSERT INTO pages (competitor_id, url, tier) VALUES ($1,$2,1) ON CONFLICT (competitor_id, url) DO NOTHING', [comp.id, `https://${comp.domain}/`]);
  for (const p of comp.extra_tier1 ?? []) {
    await db.query('INSERT INTO pages (competitor_id, url, tier) VALUES ($1,$2,1) ON CONFLICT (competitor_id, url) DO NOTHING', [comp.id, `https://${comp.domain}${p}`]);
    t1++;
  }
  for (const p of comp.extra_tier2 ?? []) {
    await db.query('INSERT INTO pages (competitor_id, url, tier) VALUES ($1,$2,2) ON CONFLICT (competitor_id, url) DO NOTHING', [comp.id, `https://${comp.domain}${p}`]);
    t2++;
  }
  return `${comp.name}: tier1=${t1} tier2=${t2} (sitemap ${urls.length} URLs)`;
}
