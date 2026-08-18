// Point a competitor at a per-channel page the vendor needs (Glassdoor employer
// page, LinkedIn company page). These identifiers cannot be derived from a
// domain, and guessing them matches the wrong company.
//
//   node scripts/set-source.mjs <slug> <channel> <url>
//   node scripts/set-source.mjs klue linkedin https://www.linkedin.com/company/klue
import { readFileSync } from 'node:fs';
import postgres from 'postgres';

const [slug, channel, url] = process.argv.slice(2);
if (!slug || !channel || !url) {
  console.error('usage: node scripts/set-source.mjs <competitor-slug> <channel> <url>');
  process.exit(1);
}
const dbUrl = readFileSync('.env.local', 'utf8').split('\n').find((l) => l.startsWith('DATABASE_URL=')).slice(13).trim();
const sql = postgres(dbUrl, { max: 2 });
const [comp] = await sql`SELECT id, name FROM competitors WHERE slug = ${slug} LIMIT 1`;
if (!comp) { console.error(`no competitor with slug "${slug}"`); await sql.end(); process.exit(1); }
await sql`
  INSERT INTO sources (competitor_id, channel, kind, value) VALUES (${comp.id}, ${channel}, 'url', ${url})
  ON CONFLICT (competitor_id, channel, kind) DO UPDATE SET value = EXCLUDED.value`;
console.log(`  ${comp.name} · ${channel} → ${url}`);
await sql.end();
