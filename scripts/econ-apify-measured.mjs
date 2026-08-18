const $=n=>'$'+n.toFixed(3);
// MEASURED, 18 Aug 2026, memo23/g2-scraper run:
//   5 result rows -> $0.00875  => $1.75 / 1,000 rows
//   Actor Start x2 -> $0.01    => $0.005 per GB, actor ran at 2GB
const ROW = 1.75/1000, START = 0.01;

console.log('MEASURED vs MODELLED, per vendor channel / competitor / month\n');
const shapes = [
  ['daily runs, 5 new rows each',        30, 5],
  ['weekly runs, 10 new rows each',       4, 10],
  ['weekly runs, 25 rows (no dedupe)',    4, 25],
  ['monthly run, 25 rows',                1, 25],
];
for (const [label, runs, rows] of shapes) {
  const c = runs*START + runs*rows*ROW;
  console.log(`  ${label.padEnd(36)} ${$(c)}   (${$(runs*START)} start + ${$(runs*rows*ROW)} rows)`);
}

console.log('\n  => the START fee dominates. Fewer, larger runs beat many small ones.\n');

const PER_CHANNEL = 4*START + 4*10*ROW;   // weekly, onlyNewReviews
const CHANNELS = 6;
const apify = PER_CHANNEL * CHANNELS;
console.log(`APIFY TOTAL, 6 vendor channels, weekly + onlyNewReviews`);
console.log(`  per channel ${$(PER_CHANNEL)}  x${CHANNELS} = ${$(apify)} / competitor / month`);
console.log(`  I had modelled $4.420 — overstated by ${(4.42/apify).toFixed(1)}x\n`);

// full per-competitor picture with the measured figure
const pageCost=1.09, infra=0.186, readWeekly=0.13, scoring=0.09, perAsk=(3000*2+800*10)/1e6;
console.log('REVISED PER-COMPETITOR COST');
console.log('  plan        pages   apify    AI    infra   TOTAL     x comps   revenue  margin');
for (const [t,comps,price,asks,vendor] of [['Starter',3,149,50,false],['Growth',10,399,300,true],['Enterprise',30,1500,2000,true]]) {
  const ap = vendor ? apify : 0;
  const ai = readWeekly + scoring + perAsk*asks/comps;
  const tot = pageCost + ap + ai + infra;
  console.log(`  ${t.padEnd(11)} ${$(pageCost)}  ${$(ap).padStart(6)} ${$(ai).padStart(6)} ${$(infra).padStart(6)}  ${('$'+tot.toFixed(2)).padStart(6)}   ${('$'+(tot*comps).toFixed(2)).padStart(8)}  $${String(price).padStart(4)}  ${(100*(1-tot*comps/price)).toFixed(1)}%`);
}
