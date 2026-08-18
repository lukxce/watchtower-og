// Run every review channel for every competitor, one PROCESS per competitor.
//
// This matters for cost, not tidiness: the multi-platform actor's result is
// memoized per competitor per process, so running g2/capterra/trustradius in
// the same process is ONE billed Apify run. Running them as separate processes
// would pay for the same 100 rows four times over.
import { readFileSync } from 'node:fs';
for (const l of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

async function main() {
  const only = process.argv.slice(2);
  const { CHANNELS } = await import('../src/lib/channels');
  const { getDb } = await import('../src/db/client');
  const db = await getDb();
  const comps = await db.query<Record<string, unknown>>('SELECT * FROM competitors ORDER BY slug');
  const keys = ['g2', 'capterra', 'trustradius', 'trustpilot'];

  for (const c of comps) {
    if (only.length && !only.includes(String(c.slug))) continue;
    console.log(`\n${c.name}`);
    for (const k of keys) {
      const ch = CHANNELS.find((x) => x.key === k);
      if (!ch) continue;
      try {
        console.log(`  ${k.padEnd(12)} ${await ch.run(c as never)}`);
      } catch (e) {
        console.log(`  ${k.padEnd(12)} THREW ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }
  process.exit(0);
}
main();
