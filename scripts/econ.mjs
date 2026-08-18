// Watchtower unit economics — v2, built on MEASURED page volumes.
// Run: node scripts/econ.mjs
//
// v1 assumed 8 tracked pages and no review/LinkedIn scraping. Measured
// reality: ~478 sitemap URLs per competitor, and only 1 of 3 sites publishes
// trustworthy <lastmod>, so edits must be caught by re-fetch + content hash.

const D = 30;
const money = (n) => '$' + n.toFixed(2);

// ── measured, 17–18 Aug 2026 ────────────────────────────────────────────────
const SITEMAP_URLS = 478;      // avg across 5 tracked competitors (50–1278)
const NEW_PER_DAY  = 3;        // klue.com, the only site with honest lastmod

// ── page fetching for change detection ──────────────────────────────────────
// Tiering already exists in sitemap.ts. Long tail is deliberately NOT crawled.
const tier1 = 10 * D;              // pricing, product, homepage — daily
const tier2 = 40 * 4;              // customers, integrations, compare — weekly
const fresh = NEW_PER_DAY * D;     // newly published
const PAGE_FETCHES = tier1 + tier2 + fresh;
const WALLED = 0.20;               // need JS rendering → Firecrawl

// Firecrawl tiers differ 6x per credit — plan choice is a real lever.
const FC_HOBBY = 16 / 3000;        // $0.00533
const FC_STD   = 83 / 100000;      // $0.00083
const fcCredits = PAGE_FETCHES * WALLED;

// ── Apify: the vendor-scraping channels, all of which lack a public API ─────
const ACTORS = [
  ['Trustpilot reviews',      4],
  ['Glassdoor sentiment',     4],
  ['G2 reviews',              4],
  ['Capterra reviews',        4],
  ['LinkedIn company posts',  8],
  ['LinkedIn founder posts',  8],   // 2 founders x weekly-ish
];
const actorRuns = ACTORS.reduce((s, [, n]) => s + n, 0);
const APIFY_LO = 0.02, APIFY_MID = 0.05, APIFY_HI = 0.15;  // per run, wide

// ── Claude: stays. Reads + scoring. ────────────────────────────────────────
const IN = 1 / 1e6, OUT = 5 / 1e6;
const llm = (2500 * IN + 700 * OUT) * D + (1000 * IN + 400 * OUT) * D;

// ── storage: snapshots kept only when the hash changes ─────────────────────
const snapshots = PAGE_FETCHES * 0.10;      // ~10% actually differ
const storageGB = (snapshots * 30 * 1024) / 1e9;
const neon = storageGB * 0.35 + 0.02;

function model(apifyRate, fcRate, label) {
  const firecrawl = fcCredits * fcRate;
  const apify = actorRuns * apifyRate;
  const total = llm + firecrawl + apify + neon;
  return { label, llm, firecrawl, apify, neon, total };
}

console.log(`MEASURED INPUTS
  sitemap URLs / competitor      ${SITEMAP_URLS}
  page fetches / competitor / mo ${PAGE_FETCHES}   (tier1 daily, tier2 weekly, new pages)
  Firecrawl credits / mo         ${Math.round(fcCredits)}
  Apify actor runs / mo          ${actorRuns}   (${ACTORS.length} channels)
`);

const scenarios = [
  model(APIFY_LO,  FC_STD,   'Optimistic  (cheap actors, Firecrawl Standard)'),
  model(APIFY_MID, FC_STD,   'Expected    (mid actors, Firecrawl Standard)'),
  model(APIFY_HI,  FC_HOBBY, 'Pessimistic (heavy actors, Firecrawl Hobby)'),
];

console.log('PER COMPETITOR / MONTH');
console.log('  scenario                                        LLM  Firecrawl   Apify   Neon    TOTAL');
for (const s of scenarios) {
  console.log(`  ${s.label.padEnd(46)}${money(s.llm)}   ${money(s.firecrawl).padStart(6)}  ${money(s.apify).padStart(6)}  ${money(s.neon).padStart(5)}   ${money(s.total).padStart(6)}`);
}

console.log('\nPER PACKAGE (marginal only)');
for (const s of scenarios) {
  console.log(`\n  ${s.label}`);
  for (const [tier, comps, price] of [['Starter', 3, 99], ['Growth', 10, 399]]) {
    const c = s.total * comps;
    const m = 100 * (1 - c / price);
    console.log(`    ${tier.padEnd(9)} ${String(comps).padStart(2)} comps  cost ${money(c).padStart(7)}  price $${price}  margin ${m.toFixed(1)}%`);
  }
}

console.log(`\nWHAT DOMINATES (expected case)`);
const e = scenarios[1];
for (const [k, v] of [['Apify (6 scraped channels)', e.apify], ['Firecrawl (page rendering)', e.firecrawl], ['Claude (reads + scoring)', e.llm], ['Neon (snapshots)', e.neon]])
  console.log(`  ${k.padEnd(30)} ${money(v).padStart(6)}  ${(100 * v / e.total).toFixed(0)}%`);
