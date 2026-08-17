// The coverage map ("fog of war"). Its whole reason to exist is a distinction
// the rest of the UI currently hides: the difference between "we looked and
// there was genuinely nothing" and "we never looked". A blank cell today means
// both, which is the one dishonest thing in the product.
//
// Five states, derived from collection_runs + the channel registry:
//   found    ok, items > 0            — collected, with a count
//   empty    ok, items = 0            — checked, real zero. Still coverage.
//   failed   ok = false               — tried and could not (blocked, no page)
//   locked   channel status ≠ active  — needs a key/account, so never attempted
//   fog      no run row at all        — genuinely unknown. This is the point.
import { getDb } from '@/db/client';
import { CHANNELS, type ChannelGroup } from '@/lib/channels';

export type CellState = 'found' | 'empty' | 'failed' | 'locked' | 'fog';

export interface Cell {
  channel: string;
  label: string;
  group: ChannelGroup;
  state: CellState;
  items: number;
  note: string | null;
  lastRun: string | null;
}
export interface CoverageRow { competitor: string; slug: string; cells: Cell[] }
export interface Coverage {
  rows: CoverageRow[];
  channels: { key: string; label: string; group: ChannelGroup }[];
  counts: Record<CellState, number>;
  litPct: number;
}

export async function getCoverage(orgId: string): Promise<Coverage> {
  const db = await getDb();
  const comps = await db.query<{ id: number; name: string; slug: string }>(
    'SELECT id, name, slug FROM competitors WHERE org_id = $1 ORDER BY name',
    [orgId],
  );

  // Latest run per (competitor, channel). DISTINCT ON keeps the newest row.
  const runs = await db.query<{ competitor_id: number; channel: string; ok: boolean; items: number; note: string | null; run_at: string }>(
    `SELECT DISTINCT ON (cr.competitor_id, cr.channel)
       cr.competitor_id, cr.channel, cr.ok, cr.items, cr.note, cr.run_at::text AS run_at
     FROM collection_runs cr JOIN competitors c ON c.id = cr.competitor_id
     WHERE c.org_id = $1
     ORDER BY cr.competitor_id, cr.channel, cr.run_at DESC`,
    [orgId],
  );
  const byKey = new Map(runs.map((r) => [`${r.competitor_id}:${r.channel}`, r]));

  const channels = CHANNELS.map((c) => ({ key: c.key, label: c.label, group: c.group }));
  const counts: Record<CellState, number> = { found: 0, empty: 0, failed: 0, locked: 0, fog: 0 };

  const rows: CoverageRow[] = comps.map((comp) => ({
    competitor: comp.name,
    slug: comp.slug,
    cells: CHANNELS.map((ch) => {
      const run = byKey.get(`${comp.id}:${ch.key}`);
      let state: CellState;
      if (ch.status !== 'active') state = 'locked';
      else if (!run) state = 'fog';
      else if (!run.ok) state = 'failed';
      else state = run.items > 0 ? 'found' : 'empty';
      counts[state]++;
      return {
        channel: ch.key, label: ch.label, group: ch.group, state,
        items: run?.items ?? 0, note: run?.note ?? null, lastRun: run?.run_at ?? null,
      };
    }),
  }));

  const total = Math.max(1, rows.length * CHANNELS.length);
  return { rows, channels, counts, litPct: Math.round((counts.found / total) * 100) };
}
