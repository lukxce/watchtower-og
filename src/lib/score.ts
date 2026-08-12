// Signal scoring (spec §6). Produces the 0–100 Signal Score + category shown on
// each feed card. Two implementations behind one interface:
//   • LLM (Claude) when ANTHROPIC_API_KEY is set — impact × confidence × recency
//   • transparent heuristic fallback otherwise, so the feed always has scores.
// A scoring pass fills score/category on pending stream_items after collection.
import { getDb } from '@/db/client';
import { claudeJSON } from '@/lib/claude';

export interface Scorable {
  channel: string;
  title: string;
  payload?: Record<string, unknown> | null;
}

const CATEGORY_BY_CHANNEL: Record<string, string> = {
  ads_meta: 'Ads', ads_google: 'Ads', ads_linkedin: 'Ads',
  jobs: 'Hiring', sitemap: 'Product', website: 'Product', appstore: 'Product',
  subdomains: 'Product', techstack: 'Product', news: 'News', youtube: 'News',
  podcasts: 'News', reddit: 'Community', trustpilot: 'Reviews', logos: 'Customers',
  events: 'Marketing',
};

// Channel base weight (how consequential this kind of signal usually is).
const BASE: Record<string, number> = {
  ads_meta: 60, ads_google: 60, ads_linkedin: 58, jobs: 62, sitemap: 55, website: 66,
  appstore: 58, subdomains: 64, techstack: 48, news: 38, youtube: 34, podcasts: 30,
  reddit: 40, trustpilot: 50, logos: 52, events: 44,
};

const BUMP: [RegExp, number][] = [
  [/pricing|\$\d|price|plan\b/i, 22],
  [/funding|raised|series [a-e]|acqui|merger|valuation/i, 26],
  [/launch|now available|introducing|new (product|feature|platform)|ga\b/i, 18],
  [/partner(ship)?|integration/i, 12],
  [/layoff|shuts? down|deprecat|sunset/i, 20],
  [/\b(head of|vp|vice president|chief|director|c[a-z]o)\b/i, 14],
  [/enterprise|agency|holdco/i, 8],
  [/beta\.|ai\.|app\.|staging|preview/i, 16], // pre-launch subdomains
];
const DAMP: [RegExp, number][] = [
  [/no new|repeated|existing positioning|unchanged/i, -22],
  [/webinar recap|newsletter|weekly roundup/i, -10],
];

const clamp = (n: number) => Math.max(1, Math.min(99, Math.round(n)));

export function heuristicScore(s: Scorable): { score: number; category: string } {
  let v = BASE[s.channel] ?? 40;
  const hay = `${s.title} ${JSON.stringify(s.payload ?? {})}`;
  for (const [re, d] of BUMP) if (re.test(hay)) v += d;
  for (const [re, d] of DAMP) if (re.test(hay)) v += d;
  return { score: clamp(v), category: CATEGORY_BY_CHANNEL[s.channel] ?? 'Other' };
}

// LLM scoring — Claude judges impact when ANTHROPIC_API_KEY is set (shared
// wrapper). Batched; falls back to the heuristic per-item on any miss. The
// prompt encodes the never-fabricate / no-meta-commentary doctrine.
async function llmScore(items: Scorable[]): Promise<{ score: number; category: string }[] | null> {
  if (items.length === 0) return null;
  const arr = await claudeJSON<{ score: number; category: string }[]>(
    'You score competitive-intelligence signals for an influencer-marketing platform. For each signal return score 0-100 (impact on us × confidence × recency) and one category from: Pricing, Product, Positioning, Hiring, Funding, Ads, News, Reviews, Customers, Community, Other. Never invent facts beyond the signal text. Reply ONLY as a JSON array of {"score","category"}, one per input, in order.',
    JSON.stringify(items.map((i) => ({ channel: i.channel, title: i.title }))),
    1500,
  );
  return arr && arr.length === items.length ? arr : null;
}

// Fill score/category on any pending stream_items that lack them.
export async function scoreUnscored(limit = 500): Promise<number> {
  const db = await getDb();
  const rows = await db.query<{ id: number; channel: string; title: string; payload: Record<string, unknown> | null }>(
    "SELECT id, channel, title, payload FROM stream_items WHERE score IS NULL AND status IN ('pending','signaled') ORDER BY id DESC LIMIT $1",
    [limit],
  );
  if (rows.length === 0) return 0;
  const llm = await llmScore(rows);
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const s = llm?.[i] ?? heuristicScore(r);
    await db.query('UPDATE stream_items SET score = $1, category = $2 WHERE id = $3', [s.score, s.category, r.id]);
  }
  return rows.length;
}
