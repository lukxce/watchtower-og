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
    const threatRow = await db.query<{ total: number }>('SELECT total FROM threat_scores WHERE competitor_id=$1', [c.id]);
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
    });
  }
  return out;
}
