// Marginal cost per competitor per MONTH. Daily crawl = 30 runs.
const D = 30;

// --- LLM (claude-haiku-4-5). Rates as published; verify before quoting.
const IN = 1.00 / 1e6, OUT = 5.00 / 1e6;
// one competitor read per crawl: payload JSON + 700 max out
const read = (2500 * IN + 700 * OUT) * D;
// signal scoring, batched: ~20 new signals/day/competitor
const score = (1000 * IN + 400 * OUT) * D;

// --- Firecrawl: only fires on WALLED pages. ~8 tracked pages/competitor,
// assume 20% walled, memoized once per run.
const fcCredits = 8 * 0.20 * D;         // ≈48 credits
const firecrawl = fcCredits * 0.005;     // Hobby $16/3000 credits

// --- Apify: 4 actors (G2, Capterra, Glassdoor, LinkedIn), weekly not daily
const apify = 4 * 4 * 0.03;

// --- DataForSEO: traffic + trends, weekly
const dfs = 2 * 4 * 0.002;

// --- Neon: measured 11MB for 11 competitors ≈ 1MB each
const neon = 0.001 * 1;

const rows = [
  ['LLM — competitor read (daily)', read],
  ['LLM — signal scoring', score],
  ['Firecrawl (walled pages only)', firecrawl],
  ['Apify (4 review/social actors, weekly)', apify],
  ['DataForSEO (weekly)', dfs],
  ['Neon storage', neon],
];
let total = 0;
console.log('MARGINAL COST PER COMPETITOR PER MONTH');
for (const [k, v] of rows) { total += v; console.log('  ' + k.padEnd(40) + '$' + v.toFixed(3)); }
console.log('  ' + '─'.repeat(48));
console.log('  ' + 'TOTAL'.padEnd(40) + '$' + total.toFixed(2));

console.log('\nPER PACKAGE (marginal only)');
for (const [tier, comps, price] of [['Starter', 3, 99], ['Growth', 10, 399], ['Enterprise', 30, 1500]]) {
  const c = total * comps;
  console.log(`  ${tier.padEnd(11)} ${String(comps).padStart(2)} competitors  cost $${c.toFixed(2).padStart(6)}  price $${price}  margin ${(100*(1-c/price)).toFixed(1)}%`);
}

console.log('\nFIXED PLATFORM FLOOR (paid before a single customer)');
const fixed = [['Vercel Pro',20],['Neon Launch',19],['Clerk',25],['Firecrawl Hobby',16],['Apify Starter',49],['DataForSEO min',50],['Anthropic (usage)',0]];
let f=0; for (const [k,v] of fixed){f+=v;console.log('  '+k.padEnd(24)+'$'+v);}
console.log('  '+'─'.repeat(32)); console.log('  '+'TOTAL'.padEnd(24)+'$'+f+'/mo');
console.log(`\n  Break-even: ${Math.ceil(f/99)} Starter customers, or ${Math.ceil(f/399)} Growth.`);
