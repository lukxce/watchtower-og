// Industry pulse: general industry headlines, not tied to any competitor —
// the "what's happening in our market" rail on the Overview. Real Google News
// RSS, fetched server-side with a short in-memory cache. The query is a
// workspace-level setting conceptually; until workspace settings exist it
// defaults per-org here (dev workspace = influencer marketing, matching the
// seeded competitor set).
import { XMLParser } from 'fast-xml-parser';

export interface IndustryItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string | null;
}

// TODO: move to a per-workspace setting once workspace config exists.
const QUERY_BY_ORG: Record<string, string> = {};
const DEFAULT_QUERY = '"influencer marketing" industry';

const cache = new Map<string, { at: number; items: IndustryItem[] }>();
const TTL = 10 * 60 * 1000;

export async function industryNews(orgId: string, limit = 6): Promise<IndustryItem[]> {
  const query = QUERY_BY_ORG[orgId] ?? DEFAULT_QUERY;
  const hit = cache.get(query);
  if (hit && Date.now() - hit.at < TTL) return hit.items.slice(0, limit);

  try {
    const res = await fetch(
      `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`,
      { headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }, signal: AbortSignal.timeout(8000) },
    );
    if (!res.ok) return hit?.items.slice(0, limit) ?? [];
    const xml = await res.text();
    const parsed = new XMLParser().parse(xml) as {
      rss?: { channel?: { item?: { title?: string; link?: string; pubDate?: string; source?: { '#text'?: string } | string }[] } };
    };
    let raw = parsed.rss?.channel?.item ?? [];
    if (!Array.isArray(raw)) raw = [raw];
    const items: IndustryItem[] = raw.slice(0, 20).map((it) => {
      // Google News titles come as "Headline - Source"; the <source> tag is authoritative when present.
      const srcTag = typeof it.source === 'object' ? it.source?.['#text'] : it.source;
      let title = String(it.title ?? '').trim();
      let source = String(srcTag ?? '').trim();
      if (!source) {
        const m = title.match(/^(.*)\s-\s([^-]+)$/);
        if (m) {
          title = m[1].trim();
          source = m[2].trim();
        }
      } else if (title.endsWith(` - ${source}`)) {
        title = title.slice(0, -(source.length + 3)).trim();
      }
      const ts = it.pubDate ? Date.parse(it.pubDate) : NaN;
      return {
        title,
        source: source || 'unknown source',
        url: String(it.link ?? ''),
        publishedAt: Number.isNaN(ts) ? null : new Date(ts).toISOString(),
      };
    }).filter((i) => i.title && i.url);
    // newest first — Google mostly returns that order, but don't rely on it
    items.sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));
    cache.set(query, { at: Date.now(), items });
    return items.slice(0, limit);
  } catch {
    return hit?.items.slice(0, limit) ?? [];
  }
}
