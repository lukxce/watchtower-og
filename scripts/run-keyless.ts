// Run the channels that need no paid vendor, for the given competitors.
// 21 of the 28 channels are keyless — an exhausted Apify plan blocks 7, not
// the product.
import { readFileSync } from 'node:fs';
for (const l of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}
const KEYLESS = ['sitemap', 'techstack', 'subdomains', 'news', 'funding', 'jobs', 'events', 'logos', 'ads_google'];

async function main() {
  const only = process.argv.slice(2);
  const { CHANNELS } = await import('../src/lib/channels');
  const { getDb } = await import('../src/db/client');
  const db = await getDb();
  const comps = await db.query<Record<string, unknown>>('SELECT * FROM competitors ORDER BY slug');
  for (const c of comps) {
    if (only.length && !only.includes(String(c.slug))) continue;
    console.log(`\n${c.name}  (${c.domain})`);
    for (const k of KEYLESS) {
      const ch = CHANNELS.find((x) => x.key === k);
      if (!ch) continue;
      try {
        console.log(`  ${k.padEnd(11)} ${await ch.run(c as never)}`);
      } catch (e) {
        console.log(`  ${k.padEnd(11)} THREW ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }
  process.exit(0);
}
main();
