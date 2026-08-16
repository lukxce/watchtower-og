// News & press. Production source: a licensed news API (GNews) — reliable,
// structured, real publish dates. Falls back to Google News RSS when GNEWS_API_KEY
// is absent (dev / pre-key), so the channel always works but upgrades cleanly.
// Per-competitor query overrides are mandatory for generic brand names.
import { plainFetch } from '@/lib/fetchLadder';
import { parseFeed } from '@/lib/feeds';
import { ingestItems, recordRun, type Competitor, type StreamItem } from '@/db/queries';

async function viaGNews(comp: Competitor, q: string): Promise<StreamItem[] | null> {
  const key = process.env.GNEWS_API_KEY;
  if (!key) return null;
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=25&sortby=publishedAt&apikey=${key}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null; // fall through to RSS
    const json = (await res.json()) as { articles?: { title: string; url: string; publishedAt: string; source?: { name?: string } }[] };
    return (json.articles ?? []).map((a) => ({
      externalId: a.url,
      title: a.source?.name ? `${a.title} — ${a.source.name}` : a.title,
      url: a.url,
      publishedAt: a.publishedAt,
      payload: { query: q, source: a.source?.name },
    }));
  } catch {
    return null;
  }
}

async function viaRss(q: string): Promise<StreamItem[] | null> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`;
  const res = await plainFetch(url, 20000);
  if (res.status !== 200) return null;
  const entries = parseFeed(res.html);
  if (!entries) return null;
  return entries.map((e) => ({ externalId: e.id, title: e.title, url: e.url, publishedAt: e.publishedAt, payload: { query: q } }));
}

export async function collectNews(comp: Competitor): Promise<string> {
  const q = comp.queries?.news ?? `"${comp.name}"`;
  const gnews = await viaGNews(comp, q);
  let items = gnews ?? (await viaRss(q));
  const via = gnews ? 'GNews API' : 'Google News RSS (fallback)';
  if (!items) {
    await recordRun(comp.id, 'news', false, 0, 'both GNews and RSS failed');
    return 'FAILED (news)';
  }
  // Generic brand names (Crayon, Klue, Signal Labs) collide with unrelated
  // companies, songs, even obituaries — and neither GNews nor Google News RSS
  // reliably honours boolean grouping in the query, so the filtering has to
  // happen here. When queries.newsMust is set, a headline must contain at
  // least one of those terms to count. Competitors with a distinctive name
  // leave it unset and are unaffected. Dropping a real story is the cheaper
  // error: a feed full of the wrong company is what "no false fires" is for.
  let dropped = 0;
  const must = comp.queries?.newsMust;
  if (must?.length) {
    const before = items.length;
    const needles = must.map((m) => m.toLowerCase());
    items = items.filter((it) => {
      const hay = `${it.title} ${it.url ?? ''}`.toLowerCase();
      return needles.some((nd) => hay.includes(nd));
    });
    dropped = before - items.length;
  }
  const { added, fresh } = await ingestItems(comp.id, 'news', items);
  const note = dropped ? `${via}, ${dropped} off-topic dropped` : via;
  await recordRun(comp.id, 'news', true, added, `via ${note}`);
  return `+${added} (${fresh} pending) via ${note}`;
}
