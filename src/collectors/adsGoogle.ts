// Google Ads Transparency (spec §4.3): the center has NO official API for
// commercial ads — we call its internal SearchCreatives RPC directly (plain
// JSON over POST, no browser). Query by DOMAIN, never advertiser name: ads run
// under parent-company accounts ("SocialEdge, Inc." for CreatorIQ, "GRIN
// TECHNOLOGIES INC." for Grin). Response tail "4"/"5" = est. total count range.
import { ingestItems, recordRun, type Competitor } from '@/db/queries';

const RPC = 'https://adstransparency.google.com/anji/_/rpc/SearchService/SearchCreatives?authuser=';
const H = {
  'content-type': 'application/x-www-form-urlencoded',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'accept-language': 'en-US,en;q=0.9',
  'x-same-domain': '1',
  origin: 'https://adstransparency.google.com',
  referer: 'https://adstransparency.google.com/',
};

const fmt = (n: number) => (n === 1 ? 'text' : n === 2 ? 'image' : n === 3 ? 'video' : `format ${n}`);

interface Creative {
  1: string;
  2: string;
  4?: number;
  6?: { 1?: string };
  12?: string;
}

export async function collectAdsGoogle(comp: Competitor): Promise<string> {
  const domain = comp.domain.replace(/^www\./, '');
  const body = 'f.req=' + encodeURIComponent(JSON.stringify({ 2: 40, 3: { 12: { 1: domain, 2: true } }, 7: { 1: 1, 2: 0, 3: 2688 } }));
  let raw: string;
  try {
    const res = await fetch(RPC, { method: 'POST', headers: H, body });
    if (!res.ok) {
      await recordRun(comp.id, 'ads_google', false, 0, `RPC HTTP ${res.status}`);
      return `FAILED (HTTP ${res.status})`;
    }
    raw = await res.text();
  } catch (e) {
    await recordRun(comp.id, 'ads_google', false, 0, e instanceof Error ? e.message : String(e));
    return 'FAILED (fetch)';
  }
  let json: { 1?: Creative[] };
  try {
    json = JSON.parse(raw);
  } catch {
    await recordRun(comp.id, 'ads_google', false, 0, 'unparseable RPC response (format may have changed)');
    return 'FAILED (parse)';
  }
  const creatives = json[1] ?? [];
  const range = raw.match(/"4":"(\d+)","5":"(\d+)"\}\s*$/);
  const countLabel = range ? (range[1] === range[2] ? range[1] : `${range[1]}-${range[2]}`) : `${creatives.length}+`;
  const advertisers = [...new Set(creatives.map((c) => c[12]).filter(Boolean))];
  const { added, fresh } = await ingestItems(
    comp.id,
    'ads_google',
    creatives
      .filter((c) => c[2])
      .map((c) => {
        const first = c[6]?.[1] ? new Date(Number(c[6][1]) * 1000).toISOString() : undefined;
        return {
          externalId: `gad:${c[2]}`,
          title: `Google ad (${fmt(c[4] ?? 0)}) — running since ${first?.slice(0, 10) ?? 'unknown'}`,
          url: `https://adstransparency.google.com/advertiser/${c[1]}/creative/${c[2]}?region=anywhere`,
          publishedAt: first,
          payload: { advertiser: c[12], format: c[4] },
        };
      }),
  );
  await recordRun(comp.id, 'ads_google', true, added, `~${countLabel} ads for ${domain} via [${advertisers.join(', ')}]`);
  return `+${added} (${fresh} pending) — ~${countLabel} total via ${advertisers.join(', ') || 'n/a'}`;
}
