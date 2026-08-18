const m=n=>'$'+n.toFixed(3);
const D=30, FC=83/100000, APIFY=0.15, DFS=0.002;
// [channel, runs/mo, vendor, unitCost, note]
const CH=[
  // free: plain HTTP or keyless API — no vendor fee, only our own compute
  ['sitemap',        30,'free',   0,   'XML fetch, 1-25 files'],
  ['subdomains',     30,'free',   0,   'certspotter JSON'],
  ['jobs',           30,'free',   0,   '6 ATS JSON APIs'],
  ['appstore',       30,'free',   0,   'iTunes Search'],
  ['podcasts',       30,'free',   0,   'iTunes Search'],
  ['news',           30,'free',   0,   'Google News RSS'],
  ['youtube',        30,'free',   0,   'channel RSS'],
  ['events',         30,'free',   0,   'HTML fetch'],
  ['logos',          30,'free',   0,   'shares website capture'],
  ['techstack',      30,'free',   0,   'homepage fingerprint'],
  ['reddit',         30,'free',   0,   'OAuth API, free app'],
  ['producthunt',    30,'free',   0,   'GraphQL, free token'],
  ['ads_meta',       30,'free',   0,   'Graph API, free token'],
  ['ads_linkedin',   30,'free',   0,   'HTML, no render needed'],
  ['funding',        30,'free',   0,   'Crunchbase / via news'],
  ['newsletters',    30,'free',   0,   'inbound email'],
  // firecrawl-rendered channels I had NOT counted separately
  ['ads_google',     30,'FC',    FC,   'JS shell, needs render'],
  ['googleplay',     30,'FC',    FC,   'needs render'],
  // apify
  ['trustpilot',      4,'apify',APIFY,'403 on public page'],
  ['glassdoor',       4,'apify',APIFY,''],
  ['g2',              4,'apify',APIFY,''],
  ['capterra',        4,'apify',APIFY,''],
  ['linkedin_posts',  8,'apify',APIFY,''],
  ['linkedin_founder',8,'apify',APIFY,'not built yet'],
  // dataforseo
  ['traffic',         4,'dfs',  DFS,  ''],
  ['trends',          4,'dfs',  DFS,  ''],
];
console.log('EVERY CHANNEL, per competitor / month (pessimistic vendor rates)\n');
const byVendor={};
for(const [c,r,v,u] of CH){ byVendor[v]=(byVendor[v]||0)+r*u; }
let runs=0;
for(const [c,r,v,u,n] of CH){ runs+=r;
  if(u>0) console.log(`  ${c.padEnd(18)} ${String(r).padStart(3)} runs  ${v.padEnd(6)} ${m(r*u).padStart(8)}  ${n}`);
}
console.log(`  ${'— 16 free channels —'.padEnd(18)} ${String(CH.filter(x=>x[2]==='free').reduce((s,x)=>s+x[1],0)).padStart(3)} runs  free      $0.000`);

console.log('\nCHANNEL SUBTOTAL BY VENDOR');
for(const [v,c] of Object.entries(byVendor)) console.log(`  ${v.padEnd(8)} ${m(c)}`);

// page fetching, tiered, per plan
console.log('\nCOMPLETE PER-COMPETITOR COST');
for(const [tier,pages,comps,price] of [['Starter',200,3,149],['Growth',1000,10,399],['Enterprise',5000,30,1500]]){
  const daily=Math.round(pages*0.10),weekly=Math.round(pages*0.25),monthly=pages-daily-weekly;
  const fetches=daily*D+weekly*4+monthly;
  const pageFC=fetches*0.20*FC;
  const channels=Object.values(byVendor).reduce((a,b)=>a+b,0);
  const llm=0.27, neon=0.02;
  // Vercel compute: 26 channels x 30 days, ~4s avg @1GB
  const gbHours=(26*D*4)/3600;
  const vercel=Math.max(0,gbHours-0)*0.18;
  const per=pageFC+channels+llm+neon+vercel;
  const total=per*comps;
  console.log(`\n  ${tier} — ${pages} pages, ${comps} competitors, $${price}`);
  console.log(`    page fetches   ${String(fetches).padStart(6)}/mo → firecrawl ${m(pageFC)}`);
  console.log(`    all channels                      ${m(channels)}`);
  console.log(`    claude + neon                     ${m(llm+neon)}`);
  console.log(`    vercel compute (${gbHours.toFixed(2)} GB-h)       ${m(vercel)}`);
  console.log(`    ── per competitor                 ${m(per)}   ${per<=12?'under $12':'OVER $12'}`);
  console.log(`    x${comps} competitors = $${total.toFixed(2)}  → margin ${(100*(1-total/price)).toFixed(1)}%`);
}
