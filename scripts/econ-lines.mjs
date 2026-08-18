// Line-by-line cost, every channel. Run: node scripts/econ-lines.mjs
const D=30;
const FC=83/100000;        // Firecrawl Standard, per credit  (verified)
const CU=0.20, CU_RUN=0.03;// Apify: $0.20/CU, ~0.03 CU per run (rate verified)
const DFS=0.002;           // DataForSEO per request
const VERCEL_GBH=0.18;     // per GB-hour beyond plan
const secPerRun=4, gbh=r=>(r*secPerRun)/3600*VERCEL_GBH;
const $=n=> n===0 ? '     —' : '$'+n.toFixed(3);

function lines(pages){
  const daily=Math.round(pages*.10), weekly=Math.round(pages*.25), monthly=pages-daily-weekly;
  const fetches=daily*D+weekly*4+monthly;
  return [
  // channel,            runs/mo, vendor cost,                compute,      note
  ['website (page diff)', fetches, fetches*0.20*FC,            gbh(fetches), `${pages} monitored, tiered`],
  ['sitemap',             D,       0,                          gbh(D),       'XML, 1-25 files'],
  ['subdomains',          D,       0,                          gbh(D),       'certspotter JSON'],
  ['jobs',                D,       0,                          gbh(D),       '6 ATS JSON APIs'],
  ['appstore',            D,       0,                          gbh(D),       'iTunes Search'],
  ['googleplay',          D,       D*FC,                       gbh(D),       'Firecrawl render'],
  ['techstack',           D,       0,                          gbh(D),       'homepage fingerprint'],
  ['ads_meta',            D,       0,                          gbh(D),       'Graph API, free key'],
  ['ads_google',          D,       D*FC,                       gbh(D),       'Firecrawl render (2.4MB shell)'],
  ['ads_linkedin',        D,       0,                          gbh(D),       'HTML, no render'],
  ['events',              D,       0,                          gbh(D),       'HTML'],
  ['logos',               0,       0,                          0,            'shares website capture'],
  ['news',                D,       0,                          gbh(D),       'Google News RSS, no key'],
  ['youtube',             D,       0,                          gbh(D),       'channel RSS'],
  ['podcasts',            D,       0,                          gbh(D),       'iTunes'],
  ['reddit',              D,       0,                          gbh(D),       'OAuth, free app'],
  ['producthunt',         D,       0,                          gbh(D),       'GraphQL, free token'],
  ['newsletters',         0,       0,                          0,            'inbound email'],
  ['funding',             D,       0,                          gbh(D),       'Crunchbase / via news'],
  ['trustpilot',          4,       4*CU_RUN*CU,                0,            'Apify compute'],
  ['glassdoor',           4,       4*CU_RUN*CU,                0,            'Apify compute'],
  ['g2',                  4,       4*CU_RUN*CU,                0,            'Apify compute'],
  ['capterra',            4,       4*CU_RUN*CU,                0,            'Apify compute'],
  ['linkedin_posts',      8,       8*CU_RUN*CU,                0,            'Apify compute'],
  ['linkedin_founders',   8,       8*CU_RUN*CU,                0,            'Apify compute · NOT BUILT'],
  ['traffic',             4,       4*DFS,                      0,            'DataForSEO'],
  ['trends',              4,       4*DFS,                      0,            'DataForSEO'],
  ['claude — read',       D,       0.18,                       0,            'daily competitor read'],
  ['claude — scoring',    D,       0.09,                       0,            'batched signal scoring'],
  ['neon storage',        0,       0.02,                       0,            '~1MB/competitor'],
  ];
}

for (const [tier,pages] of [['STARTER',200],['GROWTH',1000],['ENTERPRISE',5000]]) {
  const L=lines(pages);
  console.log(`\n${'='.repeat(78)}\n${tier} — ${pages} monitored pages, per competitor / month\n${'='.repeat(78)}`);
  console.log('  channel                runs/mo     vendor    compute      total   note');
  let tv=0,tc=0;
  for(const [c,r,v,comp,n] of L){ tv+=v; tc+=comp;
    console.log(`  ${c.padEnd(21)} ${String(r).padStart(6)}  ${$(v).padStart(9)}  ${$(comp).padStart(9)}  ${$(v+comp).padStart(9)}   ${n}`);
  }
  console.log(`  ${'─'.repeat(74)}`);
  console.log(`  ${'TOTAL'.padEnd(21)} ${''.padStart(6)}  ${$(tv).padStart(9)}  ${$(tc).padStart(9)}  ${('$'+(tv+tc).toFixed(2)).padStart(9)}`);
}
