// Cross-referencing signal context — "connect everything" (per the user's
// GRIN-research-brief reasoning: a single trigger like launch.grin.co only
// tells the real story once it's read alongside what's already known about
// that competitor — real corporate moves in the news, hiring, product-page
// activity, other buildouts, the battlecard's authored read if one exists).
// Batched once per page load (one query per data source, not per row) so
// Feed/Overview stay cheap.
//
// Deliberately does NOT require a battlecard to exist — a competitor added
// via the UI (no card generated yet) still has real signals on file and
// deserves the same connective read as one with a hand-authored card. The
// card is one more input when present, never a gate.
import { getDb } from '@/db/client';
import { CORPORATE_MOVE } from '@/lib/radar';

// The narrower subset of corporate moves that read as a go-to-market or
// pricing/business-model shift — worth its own, more specific headline
// phrasing than "something happened at this company."
const MODEL_MOVE = /self-serve|self serve|month-to-month|no[- ]demo|free tier|freemium|repric|pricing model|business model|enterprise-only|instant access/i;
const MODEL_CATEGORY_HINTS = new Set(['pricing_change', 'product_launch']);
const RELEVANT_ROLE = /engineer|ai|ml|data|product|developer|architect/i;
const PRODUCT_PAGE = /product|pricing|feature|platform/i;

export interface CorporateMove {
  title: string;
  url: string | null;
  date: string;
}

export interface CompetitorContext {
  moves: CorporateMove[];
  modelMoves: CorporateMove[];
  hireCluster: number;
  productChanges: number;
  positioning?: string;
  siblingBuildouts: string[];
}

const WINDOW_DAYS = 270; // matches the historical backfill's depth

function inClause(ids: number[], startAt = 1): { sql: string; params: number[] } {
  return { sql: ids.map((_, i) => `$${startAt + i}`).join(','), params: ids };
}

export async function getCompetitorContext(competitorIds: number[]): Promise<Map<number, CompetitorContext>> {
  const map = new Map<number, CompetitorContext>();
  const ids = [...new Set(competitorIds)];
  for (const id of ids) map.set(id, { moves: [], modelMoves: [], hireCluster: 0, productChanges: 0, siblingBuildouts: [] });
  if (ids.length === 0) return map;

  const db = await getDb();
  const { sql: idList, params: idParams } = inClause(ids);

  const newsRows = await db.query<{ competitor_id: number; title: string; url: string | null; published_at: string | null; created_at: string; payload: unknown }>(
    `SELECT competitor_id, title, url, published_at, created_at, payload FROM stream_items
     WHERE competitor_id IN (${idList}) AND channel = 'news' AND status IN ('pending','signaled')
       AND COALESCE(published_at, created_at) >= now() - interval '${WINDOW_DAYS} days'
     ORDER BY COALESCE(published_at, created_at) DESC`,
    idParams,
  );
  const subRows = await db.query<{ competitor_id: number; title: string }>(
    `SELECT competitor_id, title FROM stream_items
     WHERE competitor_id IN (${idList}) AND channel = 'subdomains' AND status IN ('pending','signaled')
       AND COALESCE(published_at, created_at) >= now() - interval '${WINDOW_DAYS} days'`,
    idParams,
  );
  const jobRows = await db.query<{ competitor_id: number; title: string }>(
    `SELECT competitor_id, title FROM stream_items
     WHERE competitor_id IN (${idList}) AND channel = 'jobs' AND status IN ('pending','signaled')
       AND COALESCE(published_at, created_at) >= now() - interval '${WINDOW_DAYS} days'`,
    idParams,
  );
  const productRows = await db.query<{ competitor_id: number; title: string }>(
    `SELECT competitor_id, title FROM stream_items
     WHERE competitor_id IN (${idList}) AND channel IN ('sitemap','website') AND status IN ('pending','signaled')
       AND COALESCE(published_at, created_at) >= now() - interval '${WINDOW_DAYS} days'`,
    idParams,
  );
  const bcRows = await db.query<{ competitor_id: number; content: unknown }>(
    `SELECT competitor_id, content FROM battlecards WHERE competitor_id IN (${idList})`,
    idParams,
  );

  for (const r of newsRows) {
    const ctx = map.get(r.competitor_id);
    if (!ctx) continue;
    const payload = (typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload) as { category_hint?: string } | null;
    const isModelMove = MODEL_MOVE.test(r.title) || MODEL_CATEGORY_HINTS.has(payload?.category_hint ?? '');
    // MODEL_MOVE is a narrower, stronger signal than CORPORATE_MOVE (funding/
    // exec/partnership/launch language) — a pricing/self-serve shift like
    // GRIN's doesn't always say "launch", so it needs its own gate rather
    // than piggybacking on CORPORATE_MOVE's keyword list.
    if (!CORPORATE_MOVE.test(r.title) && !isModelMove) continue;
    const move: CorporateMove = { title: r.title, url: r.url, date: r.published_at ?? r.created_at };
    ctx.moves.push(move);
    if (isModelMove) ctx.modelMoves.push(move);
  }
  for (const r of subRows) {
    const ctx = map.get(r.competitor_id);
    if (ctx) ctx.siblingBuildouts.push(r.title.replace(/^Subdomain observed:\s*/, ''));
  }
  for (const r of jobRows) {
    const ctx = map.get(r.competitor_id);
    if (ctx && RELEVANT_ROLE.test(r.title)) ctx.hireCluster++;
  }
  for (const r of productRows) {
    const ctx = map.get(r.competitor_id);
    if (ctx && PRODUCT_PAGE.test(r.title)) ctx.productChanges++;
  }
  for (const r of bcRows) {
    const ctx = map.get(r.competitor_id);
    if (!ctx) continue;
    const content = (typeof r.content === 'string' ? JSON.parse(r.content) : r.content) as { positioning?: string } | null;
    if (content?.positioning) ctx.positioning = content.positioning;
  }
  return map;
}
