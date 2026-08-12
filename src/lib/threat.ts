// Threat Index (spec §6): weighted composite over measurable dimensions, stored
// per-dimension so it's auditable. In Phase 2 the dimension inputs come from an
// LLM rubric over the signal corpus; here we derive transparent proxies from the
// captured counts so the dashboard has a live, defensible number from day one.
import { getDb } from '@/db/client';
import { allCompetitors } from '@/db/queries';

const WEIGHTS = { gtm: 0.25, talent: 0.25, product: 0.2, market: 0.2, corporate: 0.1 };
const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export interface ThreatRow {
  competitor: string;
  slug: string;
  dims: { gtm: number; talent: number; product: number; market: number; corporate: number };
  total: number;
  delta: number | null;
}

export async function computeThreat(): Promise<ThreatRow[]> {
  const db = await getDb();
  const comps = await allCompetitors();
  const rows: ThreatRow[] = [];
  for (const c of comps) {
    const count = async (channel: string) => {
      const r = await db.query<{ n: string }>('SELECT COUNT(*)::text n FROM stream_items WHERE competitor_id=$1 AND channel=$2', [c.id, channel]);
      return Number(r[0]?.n ?? 0);
    };
    const ads = (await count('ads_meta')) + (await count('ads_google')) + (await count('ads_linkedin'));
    const jobs = await count('jobs');
    const events = await count('events');
    const news = await count('news');
    const smRows = await db.query<{ n: string }>('SELECT COUNT(*)::text n FROM sitemap_urls WHERE competitor_id=$1', [c.id]);
    const pages = Number(smRows[0]?.n ?? 0);

    // transparent proxies (log-ish scaling to 0-100)
    const scale = (v: number, full: number) => clamp((Math.log1p(v) / Math.log1p(full)) * 100);
    const dims = {
      gtm: scale(ads + events * 2, 300),
      talent: scale(jobs, 35),
      product: scale(pages, 2000) * 0.6 + 30, // sites all have real products; floor 30
      market: scale(news + pages / 20, 120),
      corporate: 45, // placeholder until funding/partnership signals are scored
    };
    const total = clamp(
      dims.gtm * WEIGHTS.gtm + dims.talent * WEIGHTS.talent + dims.product * WEIGHTS.product + dims.market * WEIGHTS.market + dims.corporate * WEIGHTS.corporate,
    );
    const rounded = {
      gtm: clamp(dims.gtm), talent: clamp(dims.talent), product: clamp(dims.product), market: clamp(dims.market), corporate: clamp(dims.corporate),
    };
    // Week-over-week delta vs the most recent snapshot older than ~5 days.
    const prior = await db.query<{ total: number }>(
      "SELECT total FROM threat_history WHERE competitor_id=$1 AND captured_at < now() - interval '5 days' ORDER BY captured_at DESC LIMIT 1",
      [c.id],
    );
    const delta = prior.length ? total - prior[0].total : null;
    rows.push({ competitor: c.name, slug: c.slug, dims: rounded, total, delta });
    await db.query(
      `INSERT INTO threat_scores (competitor_id, dims, total, as_of) VALUES ($1,$2,$3,$4)
       ON CONFLICT (competitor_id) DO UPDATE SET dims=EXCLUDED.dims, total=EXCLUDED.total, as_of=EXCLUDED.as_of`,
      [c.id, JSON.stringify(rounded), total, new Date().toISOString()],
    );
  }
  return rows.sort((a, b) => b.total - a.total);
}

// Snapshot current totals into history (called once per collection run) so
// week-over-week deltas have a trail to compare against.
export async function snapshotThreat(): Promise<void> {
  const db = await getDb();
  const rows = await db.query<{ competitor_id: number; total: number }>('SELECT competitor_id, total FROM threat_scores');
  for (const r of rows) {
    await db.query('INSERT INTO threat_history (competitor_id, total) VALUES ($1, $2)', [r.competitor_id, r.total]);
  }
}
