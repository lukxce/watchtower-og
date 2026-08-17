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
  /** Read as a different entity sharing the name — reported, never silently dropped. */
  newsSameName: NewsItem[];
  /** Carries the name with nothing to confirm or deny it — the honest middle. */
  newsUnverified: NewsItem[];
  /** True when the workspace gave us nothing to disambiguate against, so
   *  `news` is a raw name match rather than a confirmed one. */
  newsUnconfirmed: boolean;
  siteMentions: SiteMention[];
  signalMentions: SignalMention[];
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Brand names are rarely unique words. Searching Google News for "Watchtower"
// returns the Jehovah's Witnesses magazine, a thrash band, a venue and a
// concert listing long before it returns anything about this company. A bare
// name search is a keyword alert, not intelligence.
//
// So the name has to co-occur with something from THIS market before we call
// it a mention: the brand's own domain, a tracked competitor, or a salient
// word from how the workspace describes itself. Items that only match the
// bare name are counted and reported rather than silently dropped — an
// over-tight filter that hides a real mention is the worse failure.
const CTX_STOP = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'into', 'your', 'our', 'their', 'they', 'you', 'are',
  'was', 'were', 'has', 'have', 'had', 'not', 'but', 'all', 'any', 'can', 'will', 'more', 'most', 'other',
  'than', 'then', 'them', 'what', 'when', 'which', 'who', 'why', 'how', 'about', 'every', 'each', 'also',
  'company', 'companies', 'business', 'businesses', 'product', 'products', 'platform', 'team', 'teams',
  'customer', 'customers', 'people', 'help', 'helps', 'make', 'makes', 'best', 'new', 'get', 'use', 'used',
]);

function salientWords(text: string | null | undefined, max: number): string[] {
  if (!text) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of text.toLowerCase().split(/[^a-z0-9-]+/)) {
    if (raw.length < 4 || CTX_STOP.has(raw) || seen.has(raw)) continue;
    seen.add(raw);
    out.push(raw);
    if (out.length >= max) break;
  }
  return out;
}

/** Terms that, alongside the brand name, mark an item as being about US. */
export function contextTerms(
  settings: { brandDomain: string | null; description: string | null; competencies: string | null },
  competitorNames: string[],
): string[] {
  const terms: string[] = [];
  if (settings.brandDomain) {
    const bare = settings.brandDomain.replace(/^https?:\/\//, '').replace(/^www\./, '');
    terms.push(bare);
    const label = bare.split('.')[0];
    if (label.length >= 4) terms.push(label);
  }
  terms.push(...competitorNames.filter((n) => n.length >= 4).map((n) => n.toLowerCase()));
  terms.push(...salientWords(settings.description, 6));
  terms.push(...salientWords(settings.competencies, 4));
  return [...new Set(terms)].slice(0, 14);
}

/** What an item that carries the brand name actually turned out to be. */
export type MentionVerdict = 'client' | 'same_name' | 'unverified';

export interface ClassifiedNews {
  item: NewsItem;
  verdict: MentionVerdict;
  /** The context term that placed it, when there is one. */
  matched?: string;
}

// Common senses a short brand word collides with. This never decides on its own
// — it only downgrades an item that ALSO failed to match any workspace context,
// so a client genuinely in the music or film business is not silently muted.
const OTHER_SENSE =
  /\b(song|album|guitar(ist)?|bassist|drummer|band|tour|concert|gig|setlist|venue|festival|lyrics?|single|remix|rock|metal|episode|season|movie|film|trailer|comic|novel|magazine|church|congregation|castle|fortress|ruins?|medieval)\b/i;

/**
 * Classify one item that matched the brand name.
 *
 * `client`      — corroborated by something this workspace owns
 * `same_name`   — reads as a different entity of the same name
 * `unverified`  — carries the name, nothing to confirm or deny it
 *
 * The third bucket is the fallback that has to exist: when a workspace has no
 * domain, no description and no competitors yet, there is nothing to
 * disambiguate against, and pretending otherwise would either hide real
 * coverage or wave through a concert listing.
 */
export function classifyMention(item: NewsItem, terms: string[]): ClassifiedNews {
  const hay = `${item.title} ${(item as { description?: string }).description ?? ''} ${item.url}`.toLowerCase();
  const matched = terms.find((t) => hay.includes(t));
  if (matched) return { item, verdict: 'client', matched };
  if (terms.length === 0) return { item, verdict: 'unverified' };
  if (OTHER_SENSE.test(hay)) return { item, verdict: 'same_name' };
  return { item, verdict: 'unverified' };
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
    return { configured: false, brandName: '', news: [], newsSameName: [], newsUnverified: [], newsUnconfirmed: false, siteMentions: [], signalMentions: [] };
  }
  const names = [settings.brandName, ...settings.aliases].filter(Boolean).slice(0, 4);
  const db = await getDb();

  // 1) News — the name alone is not enough (see contextTerms above). The query
  // is narrowed with market context, and whatever still comes back is checked
  // against the same terms before it counts as a mention.
  const compNames = await db.query<{ name: string }>('SELECT name FROM competitors WHERE org_id = $1', [orgId]);
  const terms = contextTerms(settings, compNames.map((c) => c.name));
  const narrow = terms.slice(0, 6).map((t) => `"${t}"`).join(' OR ');
  // Two passes: the narrowed query is what finds real coverage, and the bare
  // one exists so we can say how much noise carries the name. Both are cached.
  const newsLists = await Promise.all([
    ...names.map((n) => fetchGoogleNewsRss(narrow ? `"${n}" (${narrow})` : `"${n}"`, 8)),
    ...(narrow ? names.slice(0, 2).map((n) => fetchGoogleNewsRss(`"${n}"`, 10)) : []),
  ]);
  const seenUrls = new Set<string>();
  const news: NewsItem[] = [];
  const newsSameName: NewsItem[] = [];
  const newsUnverified: NewsItem[] = [];
  for (const list of newsLists) {
    for (const item of list) {
      if (seenUrls.has(item.url)) continue;
      seenUrls.add(item.url);
      const { verdict } = classifyMention(item, terms);
      if (verdict === 'client') news.push(item);
      else if (verdict === 'same_name') newsSameName.push(item);
      else newsUnverified.push(item);
    }
  }
  // Fallback. A workspace with no domain, no description and no competitors
  // yet has nothing to disambiguate against, so EVERYTHING lands in
  // 'unverified' — and showing that client an empty page would be a worse lie
  // than showing them an unconfirmed list. Promote it, flagged, and let the
  // page say why. Once they fill in their identity this branch stops firing.
  const unconfirmed = terms.length === 0;
  if (unconfirmed && news.length === 0) {
    news.push(...newsUnverified.splice(0, newsUnverified.length));
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

  return { configured: true, brandName: settings.brandName, news, newsSameName, newsUnverified, newsUnconfirmed: unconfirmed, siteMentions, signalMentions };
}
