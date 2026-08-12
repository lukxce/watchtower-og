// RSS / Atom parsing (news, YouTube). Ported unchanged from the MVP.
import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });
const arr = <T>(x: T | T[] | undefined): T[] => (x === undefined ? [] : Array.isArray(x) ? x : [x]);

export interface FeedEntry {
  id: string;
  title: string;
  url?: string;
  publishedAt?: string;
}

const text = (v: unknown): string => {
  if (v == null) return '';
  if (typeof v === 'object' && '#text' in (v as Record<string, unknown>)) return String((v as Record<string, unknown>)['#text']);
  return String(v);
};

export function toIso(d: unknown): string | undefined {
  if (!d) return undefined;
  const t = Date.parse(String(d));
  return Number.isNaN(t) ? undefined : new Date(t).toISOString();
}

export function parseFeed(xml: string): FeedEntry[] | null {
  let doc: Record<string, any>;
  try {
    doc = parser.parse(xml);
  } catch {
    return null;
  }
  if (doc?.rss?.channel) {
    return arr(doc.rss.channel.item)
      .map((it: any) => ({
        id: text(it.guid) || text(it.link) || text(it.title),
        title: text(it.title).trim(),
        url: text(it.link) || undefined,
        publishedAt: toIso(it.pubDate),
      }))
      .filter((e) => e.id && e.title);
  }
  if (doc?.feed) {
    return arr(doc.feed.entry)
      .map((it: any) => {
        const links = arr(it.link);
        const alt = links.find((l: any) => l?.['@_rel'] === 'alternate') ?? links[0];
        const href = alt?.['@_href'] ? String(alt['@_href']) : undefined;
        return {
          id: text(it.id) || href || text(it.title),
          title: text(it.title).trim(),
          url: href,
          publishedAt: toIso(it.published ?? it.updated),
        };
      })
      .filter((e) => e.id && e.title);
  }
  return null;
}
