import { getDb } from './src/db/client';
import { runCollection } from './src/lib/orchestrator';
(async () => {
  const db = await getDb();
  // drop the polluted news before recollecting under the tighter queries
  const del = await db.query<{ n: string }>(
    `DELETE FROM stream_items WHERE channel='news' AND competitor_id IN
       (SELECT id FROM competitors WHERE org_id='demo-workspace') RETURNING '1' n`);
  console.log('  cleared old news rows:', del.length);
  const lines = await runCollection('demo-workspace', { channels: ['news'] });
  for (const l of lines) console.log(`  ${l.competitor.padEnd(13)} ${l.result}`);
  process.exit(0);
})();
