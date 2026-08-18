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
  /** Workspace-wide daily crawl budget. The rolling queue spends this.
   *  Sized so the archive sweep is spread evenly across the month rather
   *  than run as one burst — a 2,500-page sweep is ~83 fetches a day. */
  pageFetchesPerDay: number;
  /** Apify actor runs per month, workspace-wide. 0 = channels off. */
  vendorRunsPerMonth: number;
  /** Ask the Tower questions per month. */
  asksPerMonth: number;
  /** Reviews + LinkedIn channels are the expensive ones; gate them. */
  vendorChannels: boolean;
}

// Prices set 19 Aug 2026 against the mid-market tier, not the enterprise one.
// The comparison set is IndustryLens (EUR59), RivalSense ($29) and Signal Labs
// (freemium) — NOT Klue and Crayon at $20-50k/yr. $79/$199 sits above the
// cheap end so price is not the story, and below the point where selling
// would need a demo-call motion.
//
// Margin was never the constraint: measured variable cost is $5.44 on Starter
// and $20.34 on Growth (Opus reads + Sonnet chat), so every price from $29 up
// clears 84%. What price actually decides is HOW MANY customers are needed —
// ~$400k ARR covers a 10-person team at any of these prices, which is 482
// customers at $49/$129, 290 at $79/$199, 142 at $149/$399. This is a
// go-to-market choice wearing a pricing decision's clothes.
export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: 'starter',
    label: 'Starter',
    priceMonthly: 79,
    competitors: 3,
    // Pages are ~5% of cost — a bigger site is nearly free to watch, so the
    // allowance is generous on purpose. 25 tier-1 daily + ~500 tier-2 weekly
    // + a 2,500-page archive swept 83/day + new pages = ~182 fetches/day.
    monitoredPagesPerCompetitor: 3000,
    pageFetchesPerDay: 600, // 3 competitors x ~200/day, with headroom
    vendorRunsPerMonth: 0,  // reviews + LinkedIn are Growth and up
    asksPerMonth: 50,
    vendorChannels: false,
  },
  growth: {
    id: 'growth',
    label: 'Growth',
    priceMonthly: 199,
    competitors: 10,
    monitoredPagesPerCompetitor: 3000,
    pageFetchesPerDay: 2000, // 10 competitors x ~200/day
    // The vendor channels are 61% of Growth's marginal cost. They are the
    // reason this tier exists, not the competitor count.
    vendorRunsPerMonth: 320,
    asksPerMonth: 300,
    vendorChannels: true,
  },
  enterprise: {
    id: 'enterprise',
    label: 'Enterprise',
    priceMonthly: null, // quoted; crawl volume stated explicitly on the order
    competitors: 30,
    monitoredPagesPerCompetitor: 6000,
    pageFetchesPerDay: 7000,
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
