// Website capture (spec §4.2 layer B): snapshot each active tier-1 page (tier-2
// weekly), diff against the prior snapshot, queue meaningful changes. Diff on
// meaning not bytes (noise filters); append is transactional.
import { smartFetch, sleep } from '@/lib/fetchLadder';
import { convert } from 'html-to-text';
import { createHash } from 'node:crypto';
import { diffLines } from 'diff';
import { getDb } from '@/db/client';
import { recordRun, type Competitor } from '@/db/queries';

const NOISE = [/^\d[\d,.%+kKmM\s]*$/, /^[©®™].*/, /^\s*[|•·–—-]+\s*$/, /^(19|20)\d{2}$/];

function normalize(html: string): string {
  const text = convert(html, {
    wordwrap: false,
    selectors: [
      { selector: 'script', format: 'skip' },
      { selector: 'style', format: 'skip' },
      { selector: 'img', format: 'skip' },
      { selector: 'svg', format: 'skip' },
      { selector: 'a', options: { ignoreHref: true } },
    ],
  });
  return text
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter((l) => l.length > 0 && !NOISE.some((r) => r.test(l)))
    .join('\n');
}

export async function collectWebsite(comp: Competitor, includeTier2 = false): Promise<string> {
  const db = await getDb();
  const maxTier = includeTier2 ? 2 : 1;
  const pages = await db.query<{ id: number; url: string }>(
    'SELECT id, url FROM pages WHERE competitor_id = $1 AND active = true AND tier <= $2 ORDER BY tier, id',
    [comp.id, maxTier],
  );
  let ok = 0;
  let changed = 0;
  let errors = 0;
  for (const page of pages) {
    const res = await smartFetch(page.url);
    if (res.status !== 200) {
      errors++;
      await sleep(300);
      continue;
    }
    const text = normalize(res.html);
    const hash = createHash('sha256').update(text).digest('hex');
    const prevRows = await db.query<{ id: number; content_hash: string; content: string }>(
      'SELECT id, content_hash, content FROM snapshots WHERE page_id = $1 ORDER BY captured_at DESC LIMIT 1',
      [page.id],
    );
    const prev = prevRows[0];
    const snap = await db.query<{ id: number }>(
      'INSERT INTO snapshots (page_id, content_hash, content, http_status) VALUES ($1, $2, $3, $4) RETURNING id',
      [page.id, hash, text, res.status],
    );
    ok++;
    if (!prev) continue; // baseline
    if (prev.content_hash === hash) continue;
    const parts = diffLines(prev.content, text);
    const meaningful = parts.filter((p) => (p.added || p.removed) && normalize(p.value).length > 0);
    if (meaningful.length === 0) continue;
    const diffText = meaningful.map((p) => `${p.added ? '+ ' : '- '}${p.value.trim().slice(0, 400)}`).join('\n');
    await db.query(
      `INSERT INTO changes (page_id, prev_snapshot_id, new_snapshot_id, diff, status) VALUES ($1, $2, $3, $4, 'pending')`,
      [page.id, prev.id, snap[0].id, `URL: ${page.url}\n\n${diffText}`],
    );
    changed++;
    await sleep(400);
  }
  const runOk = pages.length === 0 || ok > 0;
  await recordRun(
    comp.id,
    'website',
    runOk,
    ok,
    runOk ? (errors ? `partial: ${errors} errors` : null) : 'SUSPECTED BLOCK: zero successful fetches',
  );
  return `${pages.length} pages · ${ok} ok · ${changed} changed · ${errors} errors`;
}
