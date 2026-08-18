// Watchtower cost model — v3, with VERIFIED Apify pricing.
// Run: node scripts/econ-channels.mjs
//
// v2 modelled Apify as $0.15 per actor run, marginal. That was wrong in kind,
// not just degree. Checked against apify.com/pricing on 18 Aug 2026:
//
//   Platform:  Free $0 ($5 credit) · Starter $29 · Scale $199 · Business $999
//   Compute:   1 CU = 1 GB-RAM-hour. $0.20/CU (Starter), $0.16 (Scale), $0.13 (Business)
//   Actors:    EITHER a monthly rental — the LinkedIn Post Scraper is
//              "$30.00/month + usage" — OR pay-per-result, typically $1-10
//              per 1,000 results.
//
// The structural point: a rental is a FIXED monthly fee that covers every
// competitor and every customer. It does not scale per competitor at all, so
// most of what v2 booked as marginal cost is actually fixed cost.
const m = n => '$' + n.toFixed(3);
const D = 30, FC = 83 / 100000;
const CU_RATE = 0.20;            // Starter tier
const CU_PER_RUN = 0.03;         // ~2 min at 1GB — confirm against real runs
const RUNS = 32;                 // 6 vendor channels/competitor/month

// results pulled per competitor per month, for pay-per-result actors
const RESULTS = 140;
const PER_RESULT_LO = 1 / 1000, PER_RESULT_HI = 10 / 1000;

const apifyCompute = RUNS * CU_PER_RUN * CU_RATE;
const apifyRentalOnly = apifyCompute;                       // all 6 are rentals
const apifyPerResult  = apifyCompute + RESULTS * PER_RESULT_HI;

console.log(`APIFY, per competitor / month (MARGINAL only)
  compute  ${RUNS} runs x ${CU_PER_RUN} CU x $${CU_RATE}/CU        ${m(apifyCompute)}
  if all 6 actors are RENTAL                     ${m(apifyRentalOnly)}
  if all 6 are pay-per-result @ $10/1k           ${m(apifyPerResult)}
  v2 assumed                                     $4.800   <- wrong by 25x
`);

console.log(`APIFY, FIXED per month (covers ALL customers and competitors)
  platform Starter                               $29.00
  6 actor rentals @ ~$30 (LinkedIn verified)     $180.00
  ── total                                       $209.00
`);

const other = { claude: 0.27, neon: 0.02, vercel: 0.156, dfs: 0.016, renderChannels: 0.05 };
const fixedOther = { vercel: 20, neon: 19, clerk: 25, firecrawl: 83, dfs: 50 };

console.log('COMPLETE PER-COMPETITOR MARGINAL COST');
for (const [tier, pages, comps, price] of [['Starter', 200, 3, 149], ['Growth', 1000, 10, 399], ['Enterprise', 5000, 30, 1500]]) {
  const daily = Math.round(pages * .10), weekly = Math.round(pages * .25), monthly = pages - daily - weekly;
  const fetches = daily * D + weekly * 4 + monthly;
  const pageFC = fetches * 0.20 * FC;
  const base = pageFC + Object.values(other).reduce((a, b) => a + b, 0);
  const lo = base + apifyRentalOnly, hi = base + apifyPerResult;
  console.log(`\n  ${tier} — ${pages} pages, ${comps} comps, $${price}`);
  console.log(`    ${fetches} fetches/mo → firecrawl ${m(pageFC)}`);
  console.log(`    per competitor:  ${m(lo)} (rental actors)  →  ${m(hi)} (per-result actors)`);
  console.log(`    x${comps}:          $${(lo * comps).toFixed(2)}  →  $${(hi * comps).toFixed(2)}`);
  console.log(`    margin:          ${(100 * (1 - lo * comps / price)).toFixed(1)}%  →  ${(100 * (1 - hi * comps / price)).toFixed(1)}%`);
  console.log(`    vs $15 ceiling:  ${hi <= 15 ? 'well under' : 'OVER'}`);
}

const fixed = 209 + Object.values(fixedOther).reduce((a, b) => a + b, 0);
console.log(`\nFIXED FLOOR  $${fixed}/mo`);
console.log(`  break-even: ${Math.ceil(fixed / 149)} Starter, or ${Math.ceil(fixed / 399)} Growth customers`);
