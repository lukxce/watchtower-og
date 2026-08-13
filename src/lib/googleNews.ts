// Shared Google News RSS fetcher — used by industryNews.ts (market-wide
// pulse) and mentions.ts (brand-mention search). One parsing path so a fix
// or a rate-limit workaround only has to happen once.
import { XMLParser } from 'fast-xml-parser';

export interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string | null;
}

const cache = new Map<string, { at: number; items: NewsItem[] }>();
const TTL = 10 * 60 * 1000;

export async function fetchGoogleNewsRss(query: string, limit = 20): Promise<NewsItem[]> {
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
    const items: NewsItem[] = raw.slice(0, 20).map((it) => {
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
