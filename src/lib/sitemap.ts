// Sitemap discovery + tier classification (spec §4.2). Ported from the MVP,
// with the Cloudflare-walled-sitemap fallback via smartFetchXml.
import { XMLParser } from 'fast-xml-parser';
import { plainFetch, smartFetchXml, sleep } from './fetchLadder';

export interface SiteUrl {
  loc: string;
  lastmod?: string;
}

const parser = new XMLParser({ ignoreAttributes: true });
const asArray = <T>(x: T | T[] | undefined): T[] => (x === undefined ? [] : Array.isArray(x) ? x : [x]);

const MAX_SITEMAPS = 20;
const MAX_URLS = 8000;

async function sitemapCandidates(domain: string): Promise<string[]> {
  const base = `https://${domain}`;
  const found: string[] = [];
  const robots = await plainFetch(`${base}/robots.txt`, 10000);
  if (robots.status === 200) {
    for (const line of robots.html.split('\n')) {
      const m = line.match(/^\s*sitemap:\s*(\S+)/i);
      if (m) found.push(m[1].trim());
    }
  }
  if (found.length === 0) found.push(`${base}/sitemap.xml`, `${base}/sitemap_index.xml`, `${base}/wp-sitemap.xml`);
  return found;
}

export async function discoverUrls(domain: string): Promise<{ urls: SiteUrl[]; source: string }> {
  const seen = new Map<string, SiteUrl>();
  const queue = await sitemapCandidates(domain);
  const sources: string[] = [];
  let fetched = 0;

  while (queue.length > 0 && fetched < MAX_SITEMAPS && seen.size < MAX_URLS) {
    const smUrl = queue.shift()!;
    fetched++;
    const res = await smartFetchXml(smUrl);
    if (res.status !== 200 || !res.html.trim()) continue;
    let doc: Record<string, any>;
    try {
      doc = parser.parse(res.html);
    } catch {
      continue;
    }
    sources.push(smUrl);
    if (doc?.sitemapindex) {
      for (const sm of asArray(doc.sitemapindex.sitemap) as { loc?: string }[]) {
        if (sm?.loc) queue.push(String(sm.loc));
      }
    }
    if (doc?.urlset) {
      for (const u of asArray(doc.urlset.url) as { loc?: string; lastmod?: string }[]) {
        if (!u?.loc) continue;
        const loc = String(u.loc).trim();
        try {
          const parsed = new URL(loc);
          if (!parsed.hostname.endsWith(domain.replace(/^www\./, ''))) continue;
        } catch {
          continue;
        }
        if (!seen.has(loc)) seen.set(loc, { loc, lastmod: u.lastmod ? String(u.lastmod) : undefined });
      }
    }
    await sleep(200);
  }
  return { urls: [...seen.values()], source: sources.join(', ') || 'none' };
}

export const LOCALE = /^\/(fr|de|es|it|pt|pt-br|nl|ja|zh|zh-cn|ko|sv|da|no|fi|pl|tr|ru)(\/|$)/;
const TIER1 = [/^\/$/, /^\/pricing/, /^\/plans?$/, /^\/products?(\/|$)/, /^\/platform/, /^\/features?(\/|$)/, /^\/solutions?(\/|$)/, /^\/services(\/|$)/];
const TIER2 = [/^\/customers?(\/|$)/, /^\/case-?stud/, /^\/success-stor/, /^\/integrations?(\/|$)/, /^\/partners?(\/|$)/, /^\/about/, /^\/company/, /^\/team/, /^\/compare/, /^\/why-/, /(^|\/)vs-/, /-vs-/, /^\/webinars?$/, /^\/events?$/];

export function classifyTier(url: string): 1 | 2 | 3 {
  let p: string;
  try {
    p = new URL(url).pathname.toLowerCase();
  } catch {
    return 3;
  }
  p = p.replace(/\/+$/, '') || '/';
  if (LOCALE.test(p)) return 3;
  if (TIER1.some((r) => r.test(p))) return 1;
  if (TIER2.some((r) => r.test(p))) return 2;
  return 3;
}

export function contentKind(url: string): string {
  const p = (() => {
    try {
      return new URL(url).pathname.toLowerCase();
    } catch {
      return '';
    }
  })();
  if (/blog|\/post|article|news/.test(p)) return 'Blog post';
  if (/case-?stud|success-stor|customer/.test(p)) return 'Case study';
  if (/changelog|release|whats-new|updates/.test(p)) return 'Changelog/release';
  if (/pricing|plans/.test(p)) return 'Pricing page';
  if (/product|feature|platform|solution/.test(p)) return 'Product page';
  if (/webinar|event/.test(p)) return 'Event/webinar';
  if (/integration|partner/.test(p)) return 'Integration/partner';
  return 'New page';
}
