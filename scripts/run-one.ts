// Run a single channel for a single competitor, end to end, against the real
// vendor. Usage: npx tsx scripts/run-one.ts <slug> <channel>
import { readFileSync } from 'node:fs';
for (const l of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
}

async function main() {
  const [slug, key] = process.argv.slice(2);
  const { CHANNELS } = await import('../src/lib/channels');
  const { getDb } = await import('../src/db/client');
  const db = await getDb();
  const [comp] = await db.query<Record<string, unknown>>('SELECT * FROM competitors WHERE slug = $1 LIMIT 1', [slug]);
  if (!comp) { console.error(`no competitor "${slug}"`); process.exit(1); }
  const ch = CHANNELS.find((c) => c.key === key);
  if (!ch) { console.error(`no channel "${key}"`); process.exit(1); }

  console.log(`\n  ${ch.label} · ${comp.name} · max=${process.env.APIFY_MAX_REVIEWS ?? 25}\n`);
  const t = Date.now();
  const out = await ch.run(comp as never);
  console.log(`  result: ${out}   (${((Date.now() - t) / 1000).toFixed(1)}s)\n`);

  const rows = await db.query<Record<string, unknown>>(
    `SELECT title, url, published_at, payload FROM stream_items
     WHERE competitor_id = $1 AND channel = $2 ORDER BY id DESC LIMIT 6`,
    [comp.id as number, key],
  );
  console.log(`  newest ${rows.length} row(s) in stream_items:`);
  for (const r of rows) console.log(`    · ${String(r.title).slice(0, 118)}`);
  const [{ n }] = await db.query<{ n: string }>(
    'SELECT count(*) n FROM stream_items WHERE competitor_id=$1 AND channel=$2', [comp.id as number, key]);
  console.log(`  total stored: ${n}`);
  process.exit(0);
}
main();
