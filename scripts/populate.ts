// Populate the dev DB with a full baseline: run the free channels for all
// competitors, score every signal, snapshot threat. Server must be stopped
// (PGlite is single-process). Run: npm run populate
import { runCollection } from '../src/lib/orchestrator';
import { computeThreat, snapshotThreat } from '../src/lib/threat';

const FREE = ['sitemap', 'news', 'ads_google', 'ads_linkedin', 'jobs', 'subdomains', 'techstack', 'podcasts', 'trustpilot', 'logos', 'events'];

async function main() {
  console.log('Running free channels for all competitors…\n');
  const lines = await runCollection({ channels: FREE });
  for (const l of lines) console.log(`  ${l.competitor.padEnd(11)} ${l.channel.padEnd(13)} ${l.result}`);
  await snapshotThreat();
  console.log('\nThreat Index:');
  for (const t of await computeThreat()) {
    console.log(`  ${t.competitor.padEnd(11)} ${t.total}  (gtm ${t.dims.gtm} tal ${t.dims.talent} prd ${t.dims.product} mkt ${t.dims.market})`);
  }
  process.exit(0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
