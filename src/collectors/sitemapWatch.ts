// Sitemap watch (spec §4.2 layer A): diff URL set + lastmod every run.
// New URL = new content; changed lastmod = page updated. New tier-1/2 pages
// auto-join the capture watch list. Replaces RSS entirely.
import { getDb } from '@/db/client';
import { discoverUrls, classifyTier, contentKind } from '@/lib/sitemap';
import { ingestItems, recordRun, type Competitor, type StreamItem } from '@/db/queries';

export async function collectSitemap(comp: Competitor): Promise<string> {
  const { urls, source } = await discoverUrls(comp.domain);
  if (urls.length === 0) {
    await recordRun(comp.id, 'sitemap', false, 0, `no sitemap reachable for ${comp.domain}`);
    return 'no sitemap reachable';
  }
  const db = await getDb();
  const storedRows = await db.query<{ url: string; lastmod: string | null }>(
    'SELECT url, lastmod FROM sitemap_urls WHERE competitor_id = $1',
    [comp.id],
  );
  const stored = new Map(storedRows.map((r) => [r.url, r.lastmod]));
  const bootstrap = stored.size === 0;

  const events: StreamItem[] = [];
  for (const u of urls) {
    const tier = classifyTier(u.loc);
    const prev = stored.get(u.loc);
    const isNew = !stored.has(u.loc);
    const changed = !isNew && u.lastmod !== undefined && (u.lastmod ?? null) !== (prev ?? null);
    await db.query(
      `INSERT INTO sitemap_urls (competitor_id, url, lastmod, tier) VALUES ($1, $2, $3, $4)
       ON CONFLICT (competitor_id, url) DO UPDATE SET lastmod = EXCLUDED.lastmod`,
      [comp.id, u.loc, u.lastmod ?? null, tier],
    );
    if (bootstrap) continue;
    if (isNew) {
      events.push({ externalId: `new:${u.loc}`, title: `${contentKind(u.loc)} published: ${u.loc}`, url: u.loc, publishedAt: u.lastmod });
    } else if (changed) {
      events.push({ externalId: `upd:${u.loc}:${u.lastmod}`, title: `Page updated: ${u.loc}`, url: u.loc, publishedAt: u.lastmod });
    }
    if ((isNew || changed) && tier <= 2) {
      await db.query(
        'INSERT INTO pages (competitor_id, url, tier) VALUES ($1, $2, $3) ON CONFLICT (competitor_id, url) DO NOTHING',
        [comp.id, u.loc, tier],
      );
    }
  }
  const { added, fresh } = await ingestItems(comp.id, 'sitemap', events);
  await recordRun(comp.id, 'sitemap', true, added, bootstrap ? `baseline: ${urls.length} URLs (${source})` : `${urls.length} URLs; ${events.length} new/updated`);
  return bootstrap ? `baseline ${urls.length} URLs` : `+${added} (${fresh} pending) of ${urls.length}`;
}
