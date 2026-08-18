// FINAL cost model. Run: node scripts/econ-final.mjs
// Verified rates: Apify $29 platform / $0.20 per CU / $8 per GB residential
// (apify.com/pricing) · Claude Opus 5 $5/$25, Sonnet 5 $2/$10, Haiku 4.5 $1/$5
// · Firecrawl Standard $83/100k credits. Measured: 478 sitemap URLs/competitor.
const D=30, FC=83/100000, VERCEL=0.18;
const perFetch=0.20*FC + (4/3600)*VERCEL;
const $=n=>'$'+n.toFixed(2);
const c=(i,o,r)=>(i*r[0]+o*r[1])/1e6;
const OPUS=[5,25], SONNET=[2,10], HAIKU=[1,5];

// page work per competitor: t1 daily, t2 weekly, archive swept 150/day, new pages
const T1=25, T2=500, SWEEP_PER_DAY=83, NEW=3;
const fetchesPerDay = T1 + Math.round(T2/7) + SWEEP_PER_DAY + NEW;
const fetchesPerMonth = fetchesPerDay*D;
const pages = T1+T2+2500;

const pageCost   = fetchesPerMonth*perFetch;
const apify      = 4.42;                      // 32 runs x (0.3 CU + 10MB residential)
const infra      = 0.186;                     // dataforseo, 2 rendered channels, free-channel compute, neon
const readDaily  = c(2500,700,OPUS)*D;        // Opus 5, daily
const readWeekly = c(2500,700,OPUS)*4.3;      // Opus 5, weekly
const scoring    = c(1000,400,HAIKU)*D;       // Haiku 4.5
const perAsk     = c(3000,800,SONNET);        // Sonnet 5

console.log(`PAGE WORK PER COMPETITOR
  tier 1 ${T1} daily · tier 2 ${T2} weekly · archive swept ${SWEEP_PER_DAY}/day · ~${NEW} new/day
  = ${fetchesPerDay} fetches/day, ${fetchesPerMonth}/month, ~${pages} pages under watch
  cost ${$(pageCost)}\n`);

console.log('FIXED COST PER MONTH (independent of customers)\n');
const fixedNow=[['Vercel Pro',20],['Neon Launch',19],['Clerk (free <10k MAU)',0]];
const fixedFull=[['Vercel Pro',20],['Neon Launch',19],['Clerk',25],['Firecrawl Standard',83],['Apify platform',29],['Apify actor rentals (worst case 6x$30)',180],['DataForSEO',50]];
let a=0; console.log('  day one — 16 keyless channels, no vendors');
for(const [k,v] of fixedNow){a+=v;console.log(`    ${k.padEnd(40)} $${v}`);}
console.log(`    ${'TOTAL'.padEnd(40)} $${a}/mo\n`);
let b=0; console.log('  full stack — all 26 channels');
for(const [k,v] of fixedFull){b+=v;console.log(`    ${k.padEnd(40)} $${v}`);}
console.log(`    ${'TOTAL'.padEnd(40)} $${b}/mo`);
console.log(`    (with $0-rental actors instead: $${b-180}/mo)\n`);

console.log('EXPECTED COST PER COMPETITOR, PER PLAN\n');
const plans=[['Starter',3,149,50,false],['Growth',10,399,300,true],['Enterprise',30,1500,2000,true]];
console.log('  plan        pages   apify    AI    infra   TOTAL    x comps    revenue   margin');
for(const [t,comps,price,asks,vendor] of plans){
  const ap = vendor ? apify : 0;
  const ai = readWeekly + scoring + (perAsk*asks/comps);
  const tot = pageCost + ap + ai + infra;
  console.log(`  ${t.padEnd(11)} ${$(pageCost)}  ${$(ap).padStart(6)} ${$(ai).padStart(6)} ${$(infra).padStart(6)}  ${$(tot).padStart(6)}   ${$(tot*comps).padStart(8)}   $${String(price).padStart(5)}   ${(100*(1-tot*comps/price)).toFixed(1)}%`);
}
console.log('\n  (Starter excludes vendor channels — reviews + LinkedIn are Growth+)');
console.log(`  (AI = Opus 5 read weekly ${$(readWeekly)} + Haiku scoring ${$(scoring)} + Sonnet chat)`);

console.log('\nBREAK-EVEN');
for(const [label,f] of [['day one',a],['full stack',b],['full, $0-rental actors',b-180]]){
  console.log(`  ${label.padEnd(24)} $${f}/mo → ${Math.ceil(f/149)} Starter or ${Math.ceil(f/399)} Growth customers`);
}

console.log('\nWITH SHARED COLLECTION (same competitor, N customers)');
const shareable=pageCost+apify+infra;
for(const n of [1,3,5,10]){
  const each=shareable/n + readWeekly+scoring+perAsk*300/10;
  console.log(`  ${String(n).padStart(3)} customers → ${$(each)} each   ${n>1?'(-'+(100*(1-each/(shareable+readWeekly+scoring+perAsk*30))).toFixed(0)+'%)':''}`);
}
