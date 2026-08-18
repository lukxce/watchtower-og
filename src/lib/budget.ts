// Usage metering and budget enforcement.
//
// Two rules this module exists to guarantee:
//
//  1. Nothing that costs money is spent without being counted first. Every
//     metered action goes through `spend()`, which checks and records in one
//     step, so there is no path where a caller checks, forgets to record, and
//     the ledger silently under-counts.
//
//  2. Hitting a cap is never a silent failure. `spend()` returns a reason, and
//     the caller is expected to surface it — "you have used today's crawl
//     budget, the rest continues tomorrow" is honest; a page that quietly never
//     got fetched is exactly the false-fire the product promises against.
//
// Counters are rolled up per (org, period, meter) rather than logged per event.
// A page fetch is far too frequent to justify a row each.
import { getDb } from '@/db/client';
import { limitFor, planOf, MONTHLY_METERS, type Meter, type Plan } from '@/lib/plans';

/** Daily meters key on the date; monthly meters key on the 1st of the month. */
export function periodKey(meter: Meter, now = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  if (MONTHLY_METERS.includes(meter)) return `${y}-${m}-01`;
  return `${y}-${m}-${String(now.getUTCDate()).padStart(2, '0')}`;
}

export interface BudgetState {
  meter: Meter;
  used: number;
  limit: number;
  remaining: number;
  /** Period this budget resets on — 'day' or 'month'. */
  window: 'day' | 'month';
}

export async function usage(orgId: string, meter: Meter, plan: Plan): Promise<BudgetState> {
  const db = await getDb();
  const rows = await db.query<{ units: number }>(
    'SELECT units FROM usage_daily WHERE org_id = $1 AND period = $2 AND meter = $3',
    [orgId, periodKey(meter), meter],
  );
  const used = Number(rows[0]?.units ?? 0);
  const limit = limitFor(plan, meter);
  return {
    meter,
    used,
    limit,
    remaining: Math.max(0, limit - used),
    window: MONTHLY_METERS.includes(meter) ? 'month' : 'day',
  };
}

export interface SpendResult extends BudgetState {
  ok: boolean;
  /** How many units were actually granted — may be less than requested. */
  granted: number;
  reason?: string;
}

/**
 * Atomically claim `units` of a meter. Returns how many were granted, which
 * may be fewer than asked for when the budget is partially spent — callers
 * that can do partial work (the crawl queue) should honour `granted`.
 *
 * `allowPartial: false` makes it all-or-nothing, which is right for a single
 * indivisible action like one Ask question.
 */
export async function spend(
  orgId: string,
  meter: Meter,
  units = 1,
  opts: { planId?: string | null; allowPartial?: boolean } = {},
): Promise<SpendResult> {
  const plan = planOf(opts.planId);
  const allowPartial = opts.allowPartial ?? true;
  const limit = limitFor(plan, meter);
  const period = periodKey(meter);
  const window = MONTHLY_METERS.includes(meter) ? 'month' : 'day';

  if (limit <= 0) {
    return {
      meter, used: 0, limit, remaining: 0, window, ok: false, granted: 0,
      reason: `${plan.label} does not include ${meter.replace('_', ' ')}`,
    };
  }

  const db = await getDb();
  // One statement, so two concurrent crawlers cannot both read "under budget"
  // and both spend. The CTE computes the grant from the CURRENT value and the
  // upsert applies exactly that, so the increment and the check can't drift.
  const rows = await db.query<{ units: number; granted: number }>(
    `WITH g AS (
       SELECT LEAST($4::int, GREATEST($5::int - COALESCE(
         (SELECT units FROM usage_daily WHERE org_id = $1 AND period = $2 AND meter = $3), 0), 0)) AS granted
     )
     INSERT INTO usage_daily (org_id, period, meter, units)
     VALUES ($1, $2, $3, (SELECT granted FROM g))
     ON CONFLICT (org_id, period, meter) DO UPDATE
       SET units = usage_daily.units + (SELECT granted FROM g), updated_at = now()
     RETURNING units, (SELECT granted FROM g) AS granted`,
    [orgId, period, meter, units, limit],
  );

  const used = Number(rows[0]?.units ?? 0);
  const granted = Number(rows[0]?.granted ?? 0);
  const remaining = Math.max(0, limit - used);

  if (granted <= 0) {
    return {
      meter, used, limit, remaining: 0, window, ok: false, granted: 0,
      reason: `${plan.label} ${meter.replace('_', ' ')} budget for this ${window} is used up`,
    };
  }
  if (granted < units && !allowPartial) {
    // Hand back what we took — this action needed all of it or none.
    await release(orgId, meter, granted);
    return {
      meter, used: used - granted, limit, remaining: limit - (used - granted), window,
      ok: false, granted: 0,
      reason: `${plan.label} ${meter.replace('_', ' ')} budget for this ${window} is used up`,
    };
  }
  return { meter, used, limit, remaining, window, ok: true, granted };
}

/** Give budget back — used when a claimed action fails before doing any work. */
export async function release(orgId: string, meter: Meter, units = 1): Promise<void> {
  if (units <= 0) return;
  const db = await getDb();
  await db.query(
    `UPDATE usage_daily SET units = GREATEST(0, units - $4), updated_at = now()
     WHERE org_id = $1 AND period = $2 AND meter = $3`,
    [orgId, periodKey(meter), meter, units],
  );
}

/** Everything a workspace has spent this period — for the usage UI. */
export async function usageSummary(orgId: string, planId?: string | null): Promise<BudgetState[]> {
  const plan = planOf(planId);
  const meters: Meter[] = ['page_fetch', 'render', 'vendor_run', 'llm_ask', 'llm_read'];
  return Promise.all(meters.map((m) => usage(orgId, m, plan)));
}
