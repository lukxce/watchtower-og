// Plan limits — the single source of truth for what a workspace may consume.
//
// Every number here traces back to the cost model in docs/UNIT-ECONOMICS.md,
// computed at PESSIMISTIC vendor rates so a plan cannot lose money even in the
// bad case. Nothing else in the codebase may hardcode a limit; read it from
// here so pricing changes are a one-file edit.
//
// The design principle behind the caps: a workspace is never told "no". It is
// told "not today". Work that exceeds the daily budget rolls to tomorrow in
// priority order, so a big competitor takes longer to cover rather than
// failing — which is also the honest thing to show the customer.

export type PlanId = 'starter' | 'growth' | 'enterprise' | 'demo';

/** Meters we count. One row per (org, day, meter) in usage_daily. */
export type Meter =
  | 'page_fetch'    // one page pulled for capture/diff (plain or rendered)
  | 'render'        // the subset of page_fetch that needed Firecrawl
  | 'vendor_run'    // one Apify actor run (reviews, LinkedIn)
  | 'llm_ask'       // one Ask the Tower question
  | 'llm_read';     // one competitor read regenerated

export interface Plan {
  id: PlanId;
  label: string;
  priceMonthly: number | null;
  /** Hard ceiling on tracked competitors. */
  competitors: number;
  /** Pages kept under ongoing monitoring, per competitor. */
  monitoredPagesPerCompetitor: number;
  /** Workspace-wide daily crawl budget. The rolling queue spends this. */
  pageFetchesPerDay: number;
  /** Apify actor runs per month, workspace-wide. 0 = channels off. */
  vendorRunsPerMonth: number;
  /** Ask the Tower questions per month. */
  asksPerMonth: number;
  /** Reviews + LinkedIn channels are the expensive ones; gate them. */
  vendorChannels: boolean;
}

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: 'starter',
    label: 'Starter',
    priceMonthly: 149,
    competitors: 3,
    monitoredPagesPerCompetitor: 200,
    // 200 pages tiered ≈ 31 fetches/day/competitor; ×3 ≈ 93, +headroom.
    pageFetchesPerDay: 150,
    vendorRunsPerMonth: 0,
    asksPerMonth: 50,
    vendorChannels: false,
  },
  growth: {
    id: 'growth',
    label: 'Growth',
    priceMonthly: 399,
    competitors: 10,
    monitoredPagesPerCompetitor: 1000,
    // 1000 pages tiered ≈ 155/day/competitor; ×10 ≈ 1550, +headroom.
    pageFetchesPerDay: 1800,
    vendorRunsPerMonth: 320, // 32/competitor × 10
    asksPerMonth: 300,
    vendorChannels: true,
  },
  enterprise: {
    id: 'enterprise',
    label: 'Enterprise',
    priceMonthly: null, // quoted; crawl volume is stated explicitly on the order
    competitors: 30,
    monitoredPagesPerCompetitor: 5000,
    pageFetchesPerDay: 25000,
    vendorRunsPerMonth: 960,
    asksPerMonth: 2000,
    vendorChannels: true,
  },
  // The public demo is read-only and must never be able to spend.
  demo: {
    id: 'demo',
    label: 'Demo',
    priceMonthly: 0,
    competitors: 5,
    monitoredPagesPerCompetitor: 0,
    pageFetchesPerDay: 0,
    vendorRunsPerMonth: 0,
    asksPerMonth: 5,
    vendorChannels: false,
  },
};

export const DEFAULT_PLAN: PlanId = 'starter';

export function planOf(id: string | null | undefined): Plan {
  return PLANS[(id ?? DEFAULT_PLAN) as PlanId] ?? PLANS[DEFAULT_PLAN];
}

/** Monthly meters reset on the 1st; daily meters reset at UTC midnight. */
export const MONTHLY_METERS: Meter[] = ['vendor_run', 'llm_ask', 'llm_read'];
export const DAILY_METERS: Meter[] = ['page_fetch', 'render'];

export function limitFor(plan: Plan, meter: Meter): number {
  switch (meter) {
    case 'page_fetch':
      return plan.pageFetchesPerDay;
    case 'render':
      // Rendering is a subset of fetching; cap it at a share so one pathological
      // JS-heavy site cannot consume the whole Firecrawl budget.
      return Math.ceil(plan.pageFetchesPerDay * 0.35);
    case 'vendor_run':
      return plan.vendorRunsPerMonth;
    case 'llm_ask':
      return plan.asksPerMonth;
    case 'llm_read':
      // One read per competitor per day is the natural ceiling.
      return plan.competitors * 31;
    default:
      return 0;
  }
}
