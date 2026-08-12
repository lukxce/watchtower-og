// Shared per-competitor stats used by the Competitors and Compare pages.
import { getDb } from '@/db/client';

export interface CompStat {
  id: number;
  slug: string;
  name: string;
  domain: string;
  signals: number;
  byChannel: Record<string, number>;
  adNote: { meta?: string; google?: string; linkedin?: string };
  jobs: number;
  threat: number | null;
  dims: { gtm: number; talent: number; product: number; market: number; corporate: number } | null;
  latestSignal: { title: string; createdAt: string } | null;
}

export async function competitorStats(orgId: string): Promise<CompStat[]> {
  const db = await getDb();
  const comps = await db.query<{ id: number; slug: string; name: string; domain: string }>(
    'SELECT id, slug, name, domain FROM competitors WHERE org_id = $1 ORDER BY id',
    [orgId],
  );
  const out: CompStat[] = [];
  for (const c of comps) {
    const chans = await db.query<{ channel: string; n: string }>(
      "SELECT channel, COUNT(*)::text n FROM stream_items WHERE competitor_id=$1 AND status IN ('pending','signaled') GROUP BY channel",
      [c.id],
    );
    const byChannel: Record<string, number> = {};
    for (const r of chans) byChannel[r.channel] = Number(r.n);
    const note = async (ch: string) => {
      const r = await db.query<{ note: string }>(
        'SELECT note FROM collection_runs WHERE competitor_id=$1 AND channel=$2 AND ok=true ORDER BY id DESC LIMIT 1',
        [c.id, ch],
      );
      return r[0]?.note ?? undefined;
    };
    const threatRow = await db.query<{ total: number; dims: CompStat['dims'] | string }>('SELECT total, dims FROM threat_scores WHERE competitor_id=$1', [c.id]);
    const rawDims = threatRow[0]?.dims;
    const dims = typeof rawDims === 'string' ? (JSON.parse(rawDims) as CompStat['dims']) : rawDims ?? null;
    const latest = await db.query<{ title: string; created_at: string }>(
      "SELECT title, created_at FROM stream_items WHERE competitor_id=$1 AND status IN ('pending','signaled') ORDER BY created_at DESC LIMIT 1",
      [c.id],
    );
    out.push({
      id: c.id,
      slug: c.slug,
      name: c.name,
      domain: c.domain,
      signals: Object.values(byChannel).reduce((a, b) => a + b, 0),
      byChannel,
      adNote: { meta: await note('ads_meta'), google: await note('ads_google'), linkedin: await note('ads_linkedin') },
      jobs: byChannel['jobs'] ?? 0,
      threat: threatRow[0]?.total ?? null,
      dims,
      latestSignal: latest[0] ? { title: latest[0].title, createdAt: latest[0].created_at } : null,
    });
  }
  return out;
}

// For each competitor, count how many of the 5 threat dimensions it has the
// (tied-)highest score on among the set passed in. Real, computed from
// threat_scores — not the authored positioning-map read.
export function leadCounts(stats: CompStat[]): Record<number, number> {
  const dimKeys = ['gtm', 'talent', 'product', 'market', 'corporate'] as const;
  const out: Record<number, number> = {};
  for (const s of stats) out[s.id] = 0;
  for (const key of dimKeys) {
    const withDim = stats.filter((s) => s.dims);
    if (withDim.length === 0) continue;
    const max = Math.max(...withDim.map((s) => s.dims![key]));
    for (const s of withDim) if (s.dims![key] === max) out[s.id] += 1;
  }
  return out;
}
