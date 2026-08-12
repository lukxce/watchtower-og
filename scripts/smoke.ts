// End-to-end smoke test: seed registry → discover pages for one competitor →
// run a few free channels → recompute threat → print a feed sample. Proves the
// whole pipeline works without a browser, token, or the Next server.
import { getDb } from '../src/db/client';
import { allCompetitors } from '../src/db/queries';
import { discoverPages } from '../src/lib/discover';
import { collectNews } from '../src/collectors/news';
import { collectSubdomains } from '../src/collectors/subdomains';
import { collectTechstack } from '../src/collectors/techstack';
import { collectAdsGoogle } from '../src/collectors/adsGoogle';
import { collectAdsLinkedin } from '../src/collectors/adsLinkedin';
import { computeThreat } from '../src/lib/threat';

const ORG_ID = process.env.ORG_ID ?? 'dev-workspace';

async function main() {
  const db = await getDb();
  const comps = await allCompetitors(ORG_ID);
  if (comps.length === 0) {
    console.error('No competitors — run `npm run seed` first.');
    process.exit(1);
  }
  const c = comps.find((x) => x.slug === 'modash') ?? comps[0];
  console.log(`\n== discover pages: ${c.name} ==`);
  console.log(' ', await discoverPages(c));

  console.log(`\n== free-channel collection: ${c.name} ==`);
  console.log('  news       ', await collectNews(c));
  console.log('  subdomains ', await collectSubdomains(c));
  console.log('  techstack  ', await collectTechstack(c));
  console.log('  ads_google ', await collectAdsGoogle(c));
  console.log('  ads_linkedin', await collectAdsLinkedin(c));

  console.log('\n== threat index ==');
  for (const t of await computeThreat(ORG_ID)) console.log(`  ${t.competitor.padEnd(11)} ${t.total}  (gtm ${t.dims.gtm} talent ${t.dims.talent} product ${t.dims.product} market ${t.dims.market})`);

  console.log('\n== feed sample ==');
  const items = await db.query<{ channel: string; title: string }>(
    "SELECT channel, title FROM stream_items WHERE competitor_id=$1 AND status='pending' ORDER BY id DESC LIMIT 8",
    [c.id],
  );
  for (const it of items) console.log(`  [${it.channel}] ${it.title.slice(0, 90)}`);
  console.log('\nOK — pipeline works end to end.');
  process.exit(0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
