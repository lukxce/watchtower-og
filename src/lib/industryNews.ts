// Industry pulse: general industry headlines, not tied to any competitor —
// the "what's happening in our market" rail on the Overview. Real Google News
// RSS via the shared fetcher (googleNews.ts). The query is a workspace-level
// setting conceptually; until workspace settings exist it defaults per-org
// here (dev workspace = influencer marketing, matching the seeded competitor set).
import { fetchGoogleNewsRss, type NewsItem } from '@/lib/googleNews';

export type IndustryItem = NewsItem;

// TODO: move to a per-workspace setting once workspace config exists.
const QUERY_BY_ORG: Record<string, string> = {};
const DEFAULT_QUERY = '"influencer marketing" industry';

export async function industryNews(orgId: string, limit = 6): Promise<IndustryItem[]> {
  const query = QUERY_BY_ORG[orgId] ?? DEFAULT_QUERY;
  return fetchGoogleNewsRss(query, limit);
}
