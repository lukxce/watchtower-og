// LinkedIn Ad Library (spec §4.3): public, server-rendered, plain fetch. Parse
// per ad card; filter to ads whose advertiser name PREFIX-matches the brand —
// exact-equality misses suffixed names ("The Cirqle | Meta & TikTok Partner"),
// substring wrongly catches lookalikes ("Cirql®", "Cirql.ai").
import { plainFetch, smartFetch } from '@/lib/fetchLadder';
import { ingestItems, recordRun, type Competitor } from '@/db/queries';

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

function parseAds(html: string): { id: string; advertiser: string; type: string }[] {
  const seen = new Map<string, { id: string; advertiser: string; type: string }>();
  const cards = html.split('search-result-item').slice(1);
  for (const card of cards) {
    const aria = card.match(/aria-label="([^"]+?),\s*([^",]+?),\s*View details"/);
    const detail = card.match(/ad-library\/detail\/(\d+)/);
    if (!aria || !detail) continue;
    if (!seen.has(detail[1])) seen.set(detail[1], { id: detail[1], advertiser: aria[1].trim(), type: aria[2].trim() });
  }
  return [...seen.values()];
}

export async function collectAdsLinkedin(comp: Competitor): Promise<string> {
  const url = `https://www.linkedin.com/ad-library/search?keyword=${encodeURIComponent(comp.name)}`;
  let html = '';
  const plain = await plainFetch(url, 20000);
  if (plain.status === 200 && /ad-library\/detail/.test(plain.html)) html = plain.html;
  else {
    const br = await smartFetch(url);
    if (br.status !== 200) {
      await recordRun(comp.id, 'ads_linkedin', false, 0, `HTTP ${br.status}`);
      return `FAILED (HTTP ${br.status})`;
    }
    html = br.html;
  }
  const brand = norm(comp.name);
  const all = parseAds(html);
  const mine = all.filter((a) => norm(a.advertiser).startsWith(brand));
  const { added, fresh } = await ingestItems(
    comp.id,
    'ads_linkedin',
    mine.map((a) => ({
      externalId: `liad:${a.id}`,
      title: `LinkedIn ad (${a.type}) — ${a.advertiser}`,
      url: `https://www.linkedin.com/ad-library/detail/${a.id}`,
      payload: { advertiser: a.advertiser, type: a.type },
    })),
  );
  await recordRun(comp.id, 'ads_linkedin', true, added, `${mine.length} own ads (of ${all.length} on page)`);
  return `+${added} (${fresh} pending) — ${mine.length} own ads (of ${all.length} shown)`;
}
