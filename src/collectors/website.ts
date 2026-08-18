// Website capture. The fetching itself now lives in src/lib/pageCrawl.ts,
// which is budget-aware — this file is the channel-registry entry point and
// the place the competitor's own names are assembled for the mention scan.
//
// The old implementation queried every tier<=2 page and fetched all of them,
// with no ceiling and no record of when a page was last seen. A competitor
// with 3,000 monitored pages would have attempted all 3,000 in one run.
import { getDb } from '@/db/client';
import { crawlCompetitorPages } from '@/lib/pageCrawl';
import type { Competitor } from '@/db/queries';

export async function collectWebsite(comp: Competitor): Promise<string> {
  // Names a tier-3 page can be promoted for: the workspace's own brand, and
  // every other competitor it tracks. A rival writing about any of them is
  // competitive content and will be edited, so it earns a weekly re-check.
  const db = await getDb();
  const rows = await db.query<{ name: string }>(
    'SELECT name FROM competitors WHERE org_id = $1',
    [comp.org_id],
  );
  const brand = await db.query<{ brand_name: string | null }>(
    'SELECT brand_name FROM org_settings WHERE org_id = $1',
    [comp.org_id],
  );
  const names = [...rows.map((r) => r.name), brand[0]?.brand_name ?? '']
    .map((n) => n.trim())
    .filter((n) => n.length >= 3);

  const r = await crawlCompetitorPages(comp, { names });
  if (r.blocked) return r.blocked;
  return `${r.fetched}/${r.due} due · ${r.changed} changed${r.promoted ? ` · ${r.promoted} promoted` : ''}${r.deferred ? ` · ${r.deferred} deferred` : ''}`;
}
