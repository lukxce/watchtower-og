// Meta Ad Library (spec §4.3): official Graph API, query by verified PAGE ID
// only (never keyword — matches ad text → junk/false-zeros). page_id resolved
// once via the ad-snapshot method and stored on the competitor. Defers cleanly
// without META_ADS_TOKEN.
import { ingestItems, recordRun, type Competitor } from '@/db/queries';

interface AdRow {
  id: string;
  ad_creative_link_titles?: string[];
  ad_creative_bodies?: string[];
  ad_delivery_start_time?: string;
  ad_snapshot_url?: string;
}

export async function collectAdsMeta(comp: Competitor): Promise<string> {
  if (!comp.meta_page_id) {
    await recordRun(comp.id, 'ads_meta', true, 0, 'no meta_page_id in registry — resolve & store to enable');
    return 'skipped (no meta_page_id)';
  }
  const token = process.env.META_ADS_TOKEN;
  if (!token) {
    await recordRun(comp.id, 'ads_meta', true, 0, 'deferred: set META_ADS_TOKEN');
    return 'deferred (no META_ADS_TOKEN)';
  }
  const fields = 'id,ad_creative_link_titles,ad_creative_bodies,ad_delivery_start_time,ad_snapshot_url';
  const url =
    `https://graph.facebook.com/v21.0/ads_archive?search_page_ids=[${comp.meta_page_id}]` +
    `&ad_active_status=ACTIVE&ad_reached_countries=['ALL']&fields=${fields}&limit=200&access_token=${token}`;
  let rows: AdRow[];
  try {
    const res = await fetch(url);
    const json = (await res.json()) as { data?: AdRow[]; error?: { message?: string } };
    if (json.error) {
      await recordRun(comp.id, 'ads_meta', false, 0, `graph API: ${json.error.message}`);
      return `FAILED (${json.error.message})`;
    }
    rows = json.data ?? [];
  } catch (e) {
    await recordRun(comp.id, 'ads_meta', false, 0, e instanceof Error ? e.message : String(e));
    return 'FAILED (fetch)';
  }
  const { added, fresh } = await ingestItems(
    comp.id,
    'ads_meta',
    rows.map((r) => {
      const headline = r.ad_creative_link_titles?.[0] ?? r.ad_creative_bodies?.[0]?.slice(0, 80) ?? 'untitled creative';
      return {
        externalId: `ad:${r.id}`,
        title: `Active Meta ad: "${headline}"`,
        url: r.ad_snapshot_url,
        publishedAt: r.ad_delivery_start_time,
        payload: { headline, body: r.ad_creative_bodies?.[0]?.slice(0, 500) },
      };
    }),
  );
  await recordRun(comp.id, 'ads_meta', true, added, `${rows.length} active ads on page ${comp.meta_page_id}`);
  return `+${added} (${fresh} pending) — ${rows.length} active ads`;
}
