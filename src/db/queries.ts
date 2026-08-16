// Data-access layer shared by all collectors: stream-item ingestion with
// bootstrap-archiving, collection-run health records, and resolved-source
// caching. Ports the proven MVP semantics 1:1.
import { getDb } from './client';
import { CORPORATE_MOVE } from '@/lib/radar';

export interface Competitor {
  id: number;
  org_id: string;
  slug: string;
  name: string;
  domain: string;
  meta_page_id: string | null;
  youtube_handle: string | null;
  track_linkedin: boolean;
  queries: { news?: string; reddit?: string; podcast?: string; newsMust?: string[] };
  extra_tier1: string[];
  extra_tier2: string[];
}

// JSONB columns can come back double-encoded: the seed scripts pass
// JSON.stringify(obj) as a parameter, and postgres.js then encodes that JS
// string as a JSON *string scalar*, so the column holds "{\"news\":...}"
// rather than {"news":...}. Reads then produced a string where the type said
// object, which made comp.queries?.news silently undefined — every custom
// news/reddit/podcast query and every pinned extra_tier1/extra_tier2 page has
// been quietly ignored. Normalising on read fixes it for rows already stored
// wrong, under both drivers (PGlite parses, postgres.js may not), which
// writing it correctly from now on would not.
function asJson<T>(v: unknown, fallback: T): T {
  if (v == null) return fallback;
  if (typeof v === 'string') {
    try { return JSON.parse(v) as T; } catch { return fallback; }
  }
  return v as T;
}

export async function allCompetitors(orgId: string): Promise<Competitor[]> {
  const db = await getDb();
  const rows = await db.query<Competitor>('SELECT * FROM competitors WHERE org_id = $1 ORDER BY id', [orgId]);
  return rows.map((r) => ({
    ...r,
    queries: asJson(r.queries, {} as Competitor['queries']),
    extra_tier1: asJson(r.extra_tier1, [] as string[]),
    extra_tier2: asJson(r.extra_tier2, [] as string[]),
  }));
}

export async function distinctOrgIds(): Promise<string[]> {
  const db = await getDb();
  const rows = await db.query<{ org_id: string }>('SELECT DISTINCT org_id FROM competitors');
  return rows.map((r) => r.org_id);
}

export interface WorkspaceRow {
  orgId: string;
  name: string | null;
  createdAt: string;
  lastSeenAt: string;
}

// Every workspace that has ever signed in — a superset of distinctOrgIds(),
// which only sees orgs that already have a competitor row. Registered on
// every authenticated request via touchWorkspace() so a brand-new, still-empty
// signup shows up in /admin/workspaces immediately instead of being invisible
// until they add their first competitor.
export async function allWorkspaces(): Promise<WorkspaceRow[]> {
  const db = await getDb();
  // ::text casts are load-bearing: postgres.js auto-parses bare TIMESTAMPTZ
  // columns into JS Date objects, not strings, which silently breaks any
  // caller (e.g. .localeCompare()) that trusts the WorkspaceRow['...':
  // string] type. Cast at the query so the runtime value actually matches
  // what TypeScript claims — tsc has no way to catch this class of bug since
  // it just trusts the generic on db.query<T>().
  const rows = await db.query<{ org_id: string; name: string | null; created_at: string; last_seen_at: string }>(
    'SELECT org_id, name, created_at::text created_at, last_seen_at::text last_seen_at FROM workspaces ORDER BY last_seen_at DESC',
  );
  return rows.map((r) => ({ orgId: r.org_id, name: r.name, createdAt: r.created_at, lastSeenAt: r.last_seen_at }));
}

// Upsert-on-every-request, cheap by design (one indexed PK write). Name is
// best-effort (Clerk's org slug, if the session carries one) and never
// overwrites a previously-known name with null.
export async function touchWorkspace(orgId: string, name?: string | null): Promise<void> {
  const db = await getDb();
  await db.query(
    `INSERT INTO workspaces (org_id, name, last_seen_at) VALUES ($1, $2, now())
     ON CONFLICT (org_id) DO UPDATE SET last_seen_at = now(), name = COALESCE(EXCLUDED.name, workspaces.name)`,
    [orgId, name ?? null],
  );
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
//
// Exception: a real corporate move (funding, exec hire, partnership, launch,
// acquisition — CORPORATE_MOVE) is never bootstrap-archived just for being
// old. This was a real gap: a competitor added weeks after founding had its
// entire funding round (6 weeks old on day one) silently archived by this
// heuristic — genuinely significant history isn't "stale press" just because
// the workspace onboarded after it happened, and every downstream reader
// (the feed, Mentions, the connect.ts cross-referencing context) depends on
// this staying visible. Generic old press (top-10 listicles, think pieces)
// still gets archived; a real move doesn't.
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
    // for dated news-style channels with old dates — unless it's a real
    // corporate move, which stays visible regardless of age.
    const archive =
      it.archive === true ||
      (bootstrap && ARCHIVE_ON_BOOTSTRAP.has(channel) && !Number.isNaN(ts) && ts < cutoff && !CORPORATE_MOVE.test(it.title));
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
