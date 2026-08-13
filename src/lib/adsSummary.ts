// Ads roundup: individual ad creatives are near-identical rows ("LinkedIn ad
// (Video Ad) — X" times thirty), so the Overview shows ONE summary card per
// competitor and the full creative list lives behind the Ads filter.
// The read we can give honestly today comes from what the ad libraries expose
// without keys: volume per platform and the creative-format mix. Commentary on
// what the ads SAY needs creative text, which only the (key-gated) Meta
// channel returns — until that's on, we don't pretend to know the messaging.
import { getDb } from '@/db/client';

export interface AdsRoundup {
  competitorId: number;
  name: string;
  slug: string;
  total: number;
  byChannel: { linkedin: number; google: number; meta: number };
  formats: Record<string, number>; // e.g. { 'Video Ad': 8, 'Single Image Ad': 4 }
  read: string; // deterministic one-line read of the mix
}

function buildRead(r: AdsRoundup): string {
  const bits: string[] = [];
  const fmts = Object.entries(r.formats).sort((a, b) => b[1] - a[1]);
  if (fmts.length > 0 && r.byChannel.linkedin > 0) {
    const [topFmt, topN] = fmts[0];
    const share = topN / r.byChannel.linkedin;
    if (share >= 0.6 && r.byChannel.linkedin >= 5) {
      bits.push(`${topFmt.replace(' Ad', '').toLowerCase()}-led on LinkedIn (${topN} of ${r.byChannel.linkedin})`);
    } else {
      bits.push(`mixed formats on LinkedIn (${fmts.map(([f, n]) => `${n} ${f.replace(' Ad', '').toLowerCase()}`).join(', ')})`);
    }
  }
  if (r.byChannel.google > 0) bits.push(`${r.byChannel.google} Google creative${r.byChannel.google > 1 ? 's' : ''} visible`);
  if (r.byChannel.meta > 0) bits.push(`${r.byChannel.meta} Meta creative${r.byChannel.meta > 1 ? 's' : ''}`);
  return bits.join(' · ');
}

export async function adsRoundup(orgId: string): Promise<AdsRoundup[]> {
  const db = await getDb();
  const rows = await db.query<{ competitor_id: number; name: string; slug: string; channel: string; title: string }>(
    `SELECT si.competitor_id, c.name, c.slug, si.channel, si.title
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE c.org_id = $1 AND si.channel LIKE 'ads%' AND si.status IN ('pending','signaled')`,
    [orgId],
  );
  const byComp = new Map<number, AdsRoundup>();
  for (const r of rows) {
    let agg = byComp.get(r.competitor_id);
    if (!agg) {
      agg = { competitorId: r.competitor_id, name: r.name, slug: r.slug, total: 0, byChannel: { linkedin: 0, google: 0, meta: 0 }, formats: {}, read: '' };
      byComp.set(r.competitor_id, agg);
    }
    agg.total += 1;
    if (r.channel === 'ads_linkedin') {
      agg.byChannel.linkedin += 1;
      const fmt = r.title.match(/LinkedIn ad \(([^)]+)\)/)?.[1];
      if (fmt) agg.formats[fmt] = (agg.formats[fmt] ?? 0) + 1;
    } else if (r.channel === 'ads_google') {
      agg.byChannel.google += 1;
    } else if (r.channel === 'ads_meta') {
      agg.byChannel.meta += 1;
    }
  }
  const out = [...byComp.values()];
  for (const r of out) r.read = buildRead(r);
  return out.sort((a, b) => b.total - a.total);
}
