// Brand mentions — where does OUR brand show up? Three real, sourced lenses,
// no fabrication: (1) general news naming the brand, (2) the brand's name
// found inside a competitor's own already-captured page content (the
// highest-value kind — a competitor talking about us on their own site), and
// (3) any already-ingested signal (any channel) whose title names the brand.
// An empty result on all three is itself an honest, reportable answer.
import { getDb } from '@/db/client';
import { fetchGoogleNewsRss, type NewsItem } from '@/lib/googleNews';
import { getBrandSettings } from '@/lib/brand';

export interface SiteMention {
  competitorName: string;
  competitorSlug: string;
  url: string;
  snippet: string;
  capturedAt: string;
}

export interface SignalMention {
  competitorName: string;
  competitorSlug: string;
  channel: string;
  title: string;
  url: string | null;
  at: string;
}

export interface BrandMentions {
  configured: boolean;
  brandName: string;
  news: NewsItem[];
  siteMentions: SiteMention[];
  signalMentions: SignalMention[];
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function snippetAround(text: string, index: number, matchLen: number, radius = 90): string {
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + matchLen + radius);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  return `${prefix}${text.slice(start, end).replace(/\s+/g, ' ').trim()}${suffix}`;
}

export async function findBrandMentions(orgId: string): Promise<BrandMentions> {
  const settings = await getBrandSettings(orgId);
  if (!settings.configured || !settings.brandName.trim()) {
    return { configured: false, brandName: '', news: [], siteMentions: [], signalMentions: [] };
  }
  const names = [settings.brandName, ...settings.aliases].filter(Boolean).slice(0, 4);
  const db = await getDb();

  // 1) News — one RSS search per name/alias (capped), merged and deduped by URL.
  const newsLists = await Promise.all(names.map((n) => fetchGoogleNewsRss(`"${n}"`, 8)));
  const seenUrls = new Set<string>();
  const news: NewsItem[] = [];
  for (const list of newsLists) {
    for (const item of list) {
      if (seenUrls.has(item.url)) continue;
      seenUrls.add(item.url);
      news.push(item);
    }
  }
  news.sort((a, b) => (b.publishedAt ?? '').localeCompare(a.publishedAt ?? ''));

  // 2) Site mentions — regex whole-word scan of each active competitor page's
  // latest snapshot, scoped to this org. Real text already sitting in the DB
  // from the website/sitemap collectors; nothing new is fetched.
  const nameRe = new RegExp(`\\b(${names.map(escapeRe).join('|')})\\b`, 'i');
  const pageRows = await db.query<{ competitor_id: number; name: string; slug: string; url: string; content: string; captured_at: string }>(
    `SELECT DISTINCT ON (p.id) p.competitor_id, c.name, c.slug, p.url, s.content, s.captured_at
     FROM pages p
     JOIN competitors c ON c.id = p.competitor_id
     JOIN snapshots s ON s.page_id = p.id
     WHERE c.org_id = $1 AND p.active = true
     ORDER BY p.id, s.captured_at DESC`,
    [orgId],
  );
  const siteMentions: SiteMention[] = [];
  for (const row of pageRows) {
    const m = nameRe.exec(row.content);
    if (!m) continue;
    siteMentions.push({
      competitorName: row.name,
      competitorSlug: row.slug,
      url: row.url,
      snippet: snippetAround(row.content, m.index, m[0].length),
      capturedAt: row.captured_at,
    });
  }
  siteMentions.sort((a, b) => b.capturedAt.localeCompare(a.capturedAt));

  // 3) Signal mentions — any already-ingested stream_item (news, reviews,
  // reddit, jobs, anything) whose title names the brand.
  const sigRows = await db.query<{ channel: string; title: string; url: string | null; published_at: string | null; created_at: string; name: string; slug: string }>(
    `SELECT si.channel, si.title, si.url, si.published_at, si.created_at, c.name, c.slug
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE c.org_id = $1 AND si.status IN ('pending','signaled')
     ORDER BY COALESCE(si.published_at, si.created_at) DESC LIMIT 400`,
    [orgId],
  );
  const signalMentions: SignalMention[] = sigRows
    .filter((r) => nameRe.test(r.title))
    .map((r) => ({ competitorName: r.name, competitorSlug: r.slug, channel: r.channel, title: r.title, url: r.url, at: r.published_at ?? r.created_at }));

  return { configured: true, brandName: settings.brandName, news, siteMentions, signalMentions };
}
