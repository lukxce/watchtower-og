// Data-access layer shared by all collectors: stream-item ingestion with
// bootstrap-archiving, collection-run health records, and resolved-source
// caching. Ports the proven MVP semantics 1:1.
import { getDb } from './client';

export interface Competitor {
  id: number;
  org_id: string;
  slug: string;
  name: string;
  domain: string;
  meta_page_id: string | null;
  youtube_handle: string | null;
  track_linkedin: boolean;
  queries: { news?: string; reddit?: string; podcast?: string };
  extra_tier1: string[];
  extra_tier2: string[];
}

export async function allCompetitors(orgId: string): Promise<Competitor[]> {
  const db = await getDb();
  return db.query<Competitor>('SELECT * FROM competitors WHERE org_id = $1 ORDER BY id', [orgId]);
}

export async function distinctOrgIds(): Promise<string[]> {
  const db = await getDb();
  const rows = await db.query<{ org_id: string }>('SELECT DISTINCT org_id FROM competitors');
  return rows.map((r) => r.org_id);
}

export interface StreamItem {
  externalId: string;
  title: string;
  url?: string;
  publishedAt?: string;
  payload?: unknown;
  // Collector-level judgment: record the item (dedup, history) but keep it
  // out of the feed. Used for known-noise like email/CDN infra subdomains.
  archive?: boolean;
}

// Dedup by (competitor, channel, external_id). On the first run per
// competitor+channel we archive only genuinely OLD, dated news-style items
// (>21d) so the feed isn't flooded with stale press — but current-state signals
// (live ads, open roles, product/pricing pages, reviews) stay visible so a new
// workspace sees its baseline immediately. After the first run, every new item
// is pending. "Change" channels (website/sitemap) only ever emit real diffs.
const ARCHIVE_ON_BOOTSTRAP = new Set(['news', 'youtube', 'podcasts', 'reddit']);
export async function ingestItems(
  competitorId: number,
  channel: string,
  items: StreamItem[],
): Promise<{ added: number; fresh: number }> {
  const db = await getDb();
  const existing = await db.query<{ c: string }>(
    'SELECT COUNT(*)::text c FROM stream_items WHERE competitor_id = $1 AND channel = $2',
    [competitorId, channel],
  );
  const bootstrap = Number(existing[0]?.c ?? 0) === 0;
  const cutoff = Date.now() - 21 * 86400000;
  let added = 0;
  let fresh = 0;
  for (const it of items) {
    if (!it.externalId || !it.title) continue;
    const ts = it.publishedAt ? Date.parse(it.publishedAt) : NaN;
    // Archive when the collector itself flags known noise, or on bootstrap
    // for dated news-style channels with old dates.
    const archive = it.archive === true || (bootstrap && ARCHIVE_ON_BOOTSTRAP.has(channel) && !Number.isNaN(ts) && ts < cutoff);
    const res = await db.query<{ id: number }>(
      `INSERT INTO stream_items (competitor_id, channel, external_id, title, url, published_at, payload, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (competitor_id, channel, external_id) DO NOTHING RETURNING id`,
      [
        competitorId,
        channel,
        it.externalId.slice(0, 500),
        it.title.slice(0, 500),
        it.url ?? null,
        it.publishedAt && !Number.isNaN(ts) ? new Date(ts).toISOString() : null,
        it.payload !== undefined ? JSON.stringify(it.payload) : null,
        archive ? 'archived' : 'pending',
      ],
    );
    if (res.length === 1) {
      added++;
      if (!archive) fresh++;
    }
  }
  return { added, fresh };
}

export async function recordRun(
  competitorId: number,
  channel: string,
  ok: boolean,
  items: number,
  note?: string | null,
): Promise<void> {
  const db = await getDb();
  await db.query('INSERT INTO collection_runs (competitor_id, channel, ok, items, note) VALUES ($1, $2, $3, $4, $5)', [
    competitorId,
    channel,
    ok,
    items,
    note ?? null,
  ]);
}

export async function getSource(competitorId: number, channel: string, kind: string): Promise<string | null> {
  const db = await getDb();
  const r = await db.query<{ value: string }>(
    'SELECT value FROM sources WHERE competitor_id = $1 AND channel = $2 AND kind = $3',
    [competitorId, channel, kind],
  );
  return r[0]?.value ?? null;
}

export async function setSource(competitorId: number, channel: string, kind: string, value: string): Promise<void> {
  const db = await getDb();
  await db.query(
    `INSERT INTO sources (competitor_id, channel, kind, value) VALUES ($1, $2, $3, $4)
     ON CONFLICT (competitor_id, channel, kind) DO UPDATE SET value = EXCLUDED.value`,
    [competitorId, channel, kind, value],
  );
}

export async function jsonFetch(url: string, timeoutMs = 20000): Promise<unknown | null> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { 'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', accept: 'application/json' },
      signal: ctl.signal,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}
