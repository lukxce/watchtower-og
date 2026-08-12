// Market-demand channels — Traffic/SEO and Google Trends — via DataForSEO
// (paid, official-ish API; no free source for either). Both defer cleanly
// without DATAFORSEO_LOGIN + DATAFORSEO_PASSWORD. These feed the Threat Index
// market-demand dimension.
import { ingestItems, recordRun, type Competitor } from '@/db/queries';

function auth(): string | null {
  const u = process.env.DATAFORSEO_LOGIN;
  const p = process.env.DATAFORSEO_PASSWORD;
  if (!u || !p) return null;
  return Buffer.from(`${u}:${p}`).toString('base64');
}

async function dfs(path: string, body: unknown): Promise<unknown | null> {
  const a = auth();
  if (!a) return null;
  try {
    const res = await fetch(`https://api.dataforseo.com/v3/${path}`, {
      method: 'POST',
      headers: { authorization: `Basic ${a}`, 'content-type': 'application/json' },
      body: JSON.stringify([body]),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function collectTraffic(comp: Competitor): Promise<string> {
  if (!auth()) {
    await recordRun(comp.id, 'traffic', true, 0, 'deferred: set DATAFORSEO_LOGIN/PASSWORD (paid)');
    return 'deferred (needs DataForSEO)';
  }
  const bare = comp.domain.replace(/^www\./, '');
  const json = (await dfs('dataforseo_labs/google/domain_rank_overview/live', { target: bare, location_code: 2840, language_code: 'en' })) as
    | { tasks?: { result?: { items?: { metrics?: { organic?: { etv?: number; count?: number } } }[] }[] }[] }
    | null;
  const m = json?.tasks?.[0]?.result?.[0]?.items?.[0]?.metrics?.organic;
  if (!m) {
    await recordRun(comp.id, 'traffic', false, 0, 'no data returned');
    return 'FAILED (no data)';
  }
  const { added, fresh } = await ingestItems(comp.id, 'traffic', [
    {
      externalId: `traffic:${bare}:${new Date().toISOString().slice(0, 10)}`,
      title: `SEO snapshot: ~${Math.round(m.etv ?? 0).toLocaleString()} est. monthly organic traffic across ${m.count ?? 0} ranking keywords`,
      url: `https://${bare}`,
      payload: { etv: m.etv, keywords: m.count },
    },
  ]);
  await recordRun(comp.id, 'traffic', true, added, `etv ${Math.round(m.etv ?? 0)}, ${m.count} keywords`);
  return `+${added} (${fresh} pending) — etv ~${Math.round(m.etv ?? 0)}`;
}

export async function collectTrends(comp: Competitor): Promise<string> {
  if (!auth()) {
    await recordRun(comp.id, 'trends', true, 0, 'deferred: set DATAFORSEO_LOGIN/PASSWORD (paid)');
    return 'deferred (needs DataForSEO)';
  }
  const json = (await dfs('keywords_data/google_trends/explore/live', { keywords: [comp.name], location_code: 2840, time_range: 'past_30_days' })) as
    | { tasks?: { result?: { items?: { data?: { values?: number[] }[] }[] }[] }[] }
    | null;
  const series = json?.tasks?.[0]?.result?.[0]?.items?.[0]?.data;
  if (!series || series.length === 0) {
    await recordRun(comp.id, 'trends', false, 0, 'no trends data');
    return 'FAILED (no data)';
  }
  const vals = series.map((d) => d.values?.[0] ?? 0);
  const recent = vals.slice(-7).reduce((a, b) => a + b, 0) / 7;
  const prior = vals.slice(0, 7).reduce((a, b) => a + b, 0) / 7;
  const dir = recent > prior * 1.15 ? 'rising' : recent < prior * 0.85 ? 'falling' : 'flat';
  const { added, fresh } = await ingestItems(comp.id, 'trends', [
    {
      externalId: `trends:${comp.slug}:${new Date().toISOString().slice(0, 10)}`,
      title: `Brand search interest ${dir} (30d): ${Math.round(prior)} → ${Math.round(recent)}`,
      payload: { recent, prior, dir },
    },
  ]);
  await recordRun(comp.id, 'trends', true, added, `search interest ${dir}`);
  return `+${added} (${fresh} pending) — interest ${dir}`;
}
