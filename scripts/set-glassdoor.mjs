// Point a competitor at its Glassdoor employer page.
//
// Glassdoor keys review pages by an internal employer id — the actor's own
// example is .../Avis/Azaé-Avis-E1360610.htm — which cannot be derived from a
// domain or a company name. So it is set once per competitor, the same way an
// ATS board is remembered.
//
//   node scripts/set-glassdoor.mjs <competitor-slug> <glassdoor reviews url>
//   node scripts/set-glassdoor.mjs klue https://www.glassdoor.com/Reviews/Klue-Reviews-E1234567.htm
import { readFileSync } from 'node:fs';
import postgres from 'postgres';

const [slug, url] = process.argv.slice(2);
if (!slug || !url) {
  console.error('usage: node scripts/set-glassdoor.mjs <competitor-slug> <glassdoor-reviews-url>');
  process.exit(1);
}
if (!/glassdoor\.[a-z.]+\/.*-E\d+\.htm/i.test(url)) {
  console.error('That does not look like an employer Reviews URL — it must carry the E<id> segment,');
  console.error('e.g. https://www.glassdoor.com/Reviews/Klue-Reviews-E1234567.htm');
  process.exit(1);
}

const dbUrl = readFileSync('.env.local', 'utf8').split('\n').find((l) => l.startsWith('DATABASE_URL=')).slice(13).trim();
const sql = postgres(dbUrl, { max: 2 });
const [comp] = await sql`SELECT id, name FROM competitors WHERE slug = ${slug} LIMIT 1`;
if (!comp) {
  console.error(`no competitor with slug "${slug}"`);
  await sql.end();
  process.exit(1);
}
await sql`
  INSERT INTO sources (competitor_id, channel, kind, value) VALUES (${comp.id}, 'glassdoor', 'url', ${url})
  ON CONFLICT (competitor_id, channel, kind) DO UPDATE SET value = EXCLUDED.value`;
console.log(`  ${comp.name} → ${url}`);
await sql.end();
