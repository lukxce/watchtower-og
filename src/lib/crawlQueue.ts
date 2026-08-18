// The rolling page-crawl queue.
//
// The design brief, in one line: never scan the whole site every day — scan
// the sitemap every day, and spend a fixed daily page budget on whatever is
// most overdue.
//
// Two things fall out of that, and both matter:
//
//  * A workspace is never told "no", only "not today". Pages that don't fit
//    today's budget stay at the front of tomorrow's queue, so a 5,000-page
//    competitor is covered more slowly rather than failing. The first run is
//    just the case where everything is overdue at once.
//
//  * `<lastmod>` cannot be trusted to tell us what changed. Measured across
//    the tracked set: klue.com reports 3 changes in a day, while crayon.co and
//    kompyte.com both report ZERO in thirty days, which is false — they
//    publish constantly. So sitemap diffing reliably gives us NEW and REMOVED
//    urls, and edits are caught by re-fetching on a cadence and comparing a
//    content hash. That re-fetch is what the budget pays for.
import { getDb } from '@/db/client';
import { spend } from '@/lib/budget';
import { planOf } from '@/lib/plans';
import { CADENCE_HOURS } from '@/lib/pageTiers';

// Tier 3 is fetch-once (null cadence), so it never appears in the due query.
// The archive sweep is instead spread across the month by the daily budget:
// pages come back round in most-overdue-first order, which self-levels.
const DUE_HOURS: Record<string, number> = {
  '1': CADENCE_HOURS[1]!,
  '2': CADENCE_HOURS[2]!,
};

export interface DuePage {
  id: number;
  competitorId: number;
  url: string;
  tier: number;
  lastFetchedAt: string | null;
}

export interface CrawlPlan {
  /** Pages to fetch now — never longer than the granted budget. */
  pages: DuePage[];
  /** Pages that were due but did not fit today. Reported, not hidden. */
  deferred: number;
  budget: { granted: number; used: number; limit: number };
  /** Set when nothing could be fetched, with a customer-readable reason. */
  blocked?: string;
}

/**
 * Decide what to crawl for a workspace right now.
 *
 * Ordering is "most overdue first, then by tier", so a page that is a week
 * late outranks a tier-1 page that is an hour late. Never-fetched pages sort
 * first, which makes the first run fall out of the same query rather than
 * needing a separate code path.
 */
export async function planCrawl(orgId: string, planId?: string | null): Promise<CrawlPlan> {
  const plan = planOf(planId);
  const db = await getDb();

  const cap = plan.monitoredPagesPerCompetitor;
  if (cap <= 0) {
    return { pages: [], deferred: 0, budget: { granted: 0, used: 0, limit: 0 }, blocked: `${plan.label} does not crawl pages` };
  }

  // Everything currently due, ranked. `monitoredPagesPerCompetitor` is applied
  // per competitor via the window function so one huge site cannot crowd the
  // others out of the queue entirely.
  const due = await db.query<{ id: number; competitor_id: number; url: string; tier: number; last_fetched_at: string | null }>(
    `WITH ranked AS (
       SELECT p.id, p.competitor_id, p.url, p.tier, p.last_fetched_at,
              ROW_NUMBER() OVER (PARTITION BY p.competitor_id ORDER BY p.tier, p.discovered_at) AS rn
       FROM pages p
       JOIN competitors c ON c.id = p.competitor_id
       WHERE c.org_id = $1 AND p.active = true
     )
     SELECT id, competitor_id, url, tier, last_fetched_at::text
     FROM ranked
     WHERE rn <= $2
       -- tier 3 has no cadence: it is fetched once (last_fetched_at IS NULL)
       -- and then never becomes due again.
       AND (last_fetched_at IS NULL
            OR (($3::jsonb ->> tier::text) IS NOT NULL
                AND last_fetched_at < now() - (($3::jsonb ->> tier::text)::int * INTERVAL '1 hour')))
     ORDER BY last_fetched_at NULLS FIRST, tier`,
    [orgId, cap, JSON.stringify(DUE_HOURS)],
  );

  if (due.length === 0) {
    return { pages: [], deferred: 0, budget: { granted: 0, used: 0, limit: plan.pageFetchesPerDay } };
  }

  // Claim only what we will actually use. Partial grants are expected and fine.
  const claim = await spend(orgId, 'page_fetch', due.length, { planId, allowPartial: true });
  if (!claim.ok || claim.granted <= 0) {
    return {
      pages: [],
      deferred: due.length,
      budget: { granted: 0, used: claim.used, limit: claim.limit },
      blocked: claim.reason ?? "today's crawl budget is spent",
    };
  }

  const take = due.slice(0, claim.granted);
  return {
    pages: take.map((r) => ({
      id: r.id,
      competitorId: r.competitor_id,
      url: r.url,
      tier: r.tier,
      lastFetchedAt: r.last_fetched_at,
    })),
    deferred: due.length - take.length,
    budget: { granted: claim.granted, used: claim.used, limit: claim.limit },
  };
}

/**
 * Record the outcome of a fetch. The hash is what actually detects an edit —
 * an unchanged hash still updates `last_fetched_at`, so the page moves to the
 * back of the queue rather than being re-fetched forever.
 */
export async function markFetched(pageId: number, contentHash: string | null): Promise<{ changed: boolean }> {
  const db = await getDb();
  const rows = await db.query<{ last_hash: string | null }>('SELECT last_hash FROM pages WHERE id = $1', [pageId]);
  const prev = rows[0]?.last_hash ?? null;
  const changed = contentHash !== null && prev !== null && prev !== contentHash;
  await db.query('UPDATE pages SET last_fetched_at = now(), last_hash = COALESCE($2, last_hash) WHERE id = $1', [
    pageId,
    contentHash,
  ]);
  return { changed };
}

/** Give the budget back for pages we claimed but could not fetch (network dead). */
export async function refundUnused(orgId: string, unused: number): Promise<void> {
  if (unused <= 0) return;
  const { release } = await import('@/lib/budget');
  await release(orgId, 'page_fetch', unused);
}
