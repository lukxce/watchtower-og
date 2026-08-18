// Budgeted page crawl — the thing that actually fills `pages` and `snapshots`.
//
// This replaces the old "fetch every tier-1 page, plus tier-2 on Mondays"
// loop, which had no ceiling: a competitor with 3,000 monitored pages would
// have tried all of them in one invocation.
//
// What happens per run, per competitor:
//
//   1. ask the queue what is due (most-overdue-first, tier cadence)
//   2. claim that many page_fetch units from the workspace's daily budget —
//      partial grants are normal and the remainder simply waits for tomorrow
//   3. fetch, normalise, hash, snapshot, diff
//   4. a tier-3 page is fetched ONCE; that single fetch doubles as the mention
//      scan, and a page naming us or a tracked rival is promoted to tier 2
//   5. only changes worth a card produce one (pageTiers.isChangeWorthSurfacing)
import { smartFetch, sleep } from '@/lib/fetchLadder';
import { convert } from 'html-to-text';
import { createHash } from 'node:crypto';
import { diffLines } from 'diff';
import { getDb } from '@/db/client';
import { recordRun, type Competitor } from '@/db/queries';
import { spend, release } from '@/lib/budget';
import { CADENCE_HOURS, promoteOnContent, isChangeWorthSurfacing, type Tier } from '@/lib/pageTiers';

const NOISE = [/^\d[\d,.%+kKmM\s]*$/, /^[©®™].*/, /^\s*[|•·–—-]+\s*$/, /^(19|20)\d{2}$/];

export function normalize(html: string): string {
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

interface DueRow {
  id: number;
  url: string;
  tier: number;
  last_fetched_at: string | null;
}

/** Pages due for this competitor, most overdue first. Tier 3 is due only once. */
async function duePages(competitorId: number, cap: number): Promise<DueRow[]> {
  const db = await getDb();
  return db.query<DueRow>(
    `SELECT id, url, tier, last_fetched_at::text
     FROM pages
     WHERE competitor_id = $1 AND active = true
       AND (
         last_fetched_at IS NULL
         OR (tier = 1 AND last_fetched_at < now() - ($2::int * INTERVAL '1 hour'))
         OR (tier = 2 AND last_fetched_at < now() - ($3::int * INTERVAL '1 hour'))
       )
     ORDER BY last_fetched_at NULLS FIRST, tier
     LIMIT $4`,
    [competitorId, CADENCE_HOURS[1], CADENCE_HOURS[2], cap],
  );
}

export interface CrawlResult {
  due: number;
  fetched: number;
  changed: number;
  errors: number;
  promoted: number;
  deferred: number;
  blocked?: string;
}

export async function crawlCompetitorPages(
  comp: Competitor,
  opts: { names?: string[]; maxPerRun?: number } = {},
): Promise<CrawlResult> {
  const db = await getDb();
  const cap = opts.maxPerRun ?? 400;
  const due = await duePages(comp.id, cap);
  if (due.length === 0) {
    await recordRun(comp.id, 'website', true, 0, 'nothing due');
    return { due: 0, fetched: 0, changed: 0, errors: 0, promoted: 0, deferred: 0 };
  }

  const claim = await spend(comp.org_id, 'page_fetch', due.length, { allowPartial: true });
  if (!claim.ok || claim.granted <= 0) {
    await recordRun(comp.id, 'website', true, 0, claim.reason ?? 'daily crawl budget spent');
    return { due: due.length, fetched: 0, changed: 0, errors: 0, promoted: 0, deferred: due.length, blocked: claim.reason };
  }

  const take = due.slice(0, claim.granted);
  let fetched = 0, changed = 0, errors = 0, promoted = 0;

  for (const page of take) {
    const res = await smartFetch(page.url);
    if (res.status !== 200) {
      errors++;
      // Still stamp it, or a permanently dead URL is retried every single run
      // and quietly eats the budget forever.
      await db.query('UPDATE pages SET last_fetched_at = now() WHERE id = $1', [page.id]);
      await sleep(250);
      continue;
    }
    const text = normalize(res.html);
    const hash = createHash('sha256').update(text).digest('hex');

    // The one tier-3 fetch is also the mention scan.
    if (page.tier === 3 && opts.names?.length) {
      const { tier: newTier, named } = promoteOnContent(3 as Tier, text, opts.names);
      if (newTier === 2) {
        await db.query('UPDATE pages SET tier = 2 WHERE id = $1', [page.id]);
        promoted++;
        void named;
      }
    }

    const prevRows = await db.query<{ id: number; content_hash: string; content: string }>(
      'SELECT id, content_hash, content FROM snapshots WHERE page_id = $1 ORDER BY captured_at DESC LIMIT 1',
      [page.id],
    );
    const prev = prevRows[0];
    const snap = await db.query<{ id: number }>(
      'INSERT INTO snapshots (page_id, content_hash, content, http_status) VALUES ($1, $2, $3, $4) RETURNING id',
      [page.id, hash, text, res.status],
    );
    await db.query('UPDATE pages SET last_fetched_at = now(), last_hash = $2 WHERE id = $1', [page.id, hash]);
    fetched++;

    if (!prev || prev.content_hash === hash) continue;
    if (!isChangeWorthSurfacing(page.tier as Tier)) continue;

    const parts = diffLines(prev.content, text);
    const meaningful = parts.filter((p) => (p.added || p.removed) && normalize(p.value).length > 0);
    if (meaningful.length === 0) continue;
    const diffText = meaningful.map((p) => `${p.added ? '+ ' : '- '}${p.value.trim().slice(0, 400)}`).join('\n');
    await db.query(
      `INSERT INTO changes (page_id, prev_snapshot_id, new_snapshot_id, diff, status) VALUES ($1, $2, $3, $4, 'pending')`,
      [page.id, prev.id, snap[0].id, `URL: ${page.url}\n\n${diffText}`],
    );
    changed++;
    await sleep(300);
  }

  // Hand back budget for anything we claimed but could not fetch.
  const unused = claim.granted - (fetched + errors);
  if (unused > 0) await release(comp.org_id, 'page_fetch', unused);

  const deferred = due.length - take.length;
  const runOk = fetched > 0 || take.length === 0;
  await recordRun(
    comp.id,
    'website',
    runOk,
    fetched,
    runOk
      ? `${fetched}/${due.length} due · ${changed} changed${promoted ? ` · ${promoted} promoted` : ''}${deferred ? ` · ${deferred} deferred` : ''}`
      : 'SUSPECTED BLOCK: zero successful fetches',
  );
  return { due: due.length, fetched, changed, errors, promoted, deferred };
}
