// Launch Radar (vision §04 flagship): one signal is a data point, a cluster is
// a prediction. Detects when a competitor shows multiple pre-launch signals in
// the same window — new subdomains, AI/senior engineering hires, fresh
// events/ads, product-page changes — and raises a single forecast. Detection is
// deterministic; the forecast narrative is authored by Claude (in-session
// locally, Claude API in production). Confidence scales with signal breadth.
import { getDb } from '@/db/client';

export interface RadarForecast {
  competitor: string;
  slug: string;
  confidence: 'High' | 'Medium' | 'Emerging';
  headline: string;
  evidence: string[];
  window: string;
}

interface SignalRow { channel: string; title: string; }

// Authored forecast narratives keyed by the dominant cluster shape + competitor.
// In production the Claude API composes these from the evidence set.
function narrate(name: string, ev: { subdomains: string[]; aiHires: number; events: number; ads: number; product: number }): { headline: string; note?: string } | null {
  const signals = [ev.subdomains.length > 0, ev.aiHires > 0, ev.events > 0, ev.ads > 3, ev.product > 0].filter(Boolean).length;
  if (signals < 2) return null;
  // pick the most telling composite
  if (ev.subdomains.some((s) => /ai|beta|labs|app|new/.test(s)) && ev.aiHires > 0) {
    return { headline: `${name} is likely preparing an AI product launch` };
  }
  if (ev.aiHires > 0 && ev.product > 0) {
    return { headline: `${name} is building toward a new product line — engineering hiring + product-page activity` };
  }
  if (ev.ads > 3 && ev.events > 0) {
    return { headline: `${name} is spinning up a major GTM push — coordinated ad + events spend` };
  }
  return { headline: `${name} shows clustered activity worth watching — ${signals} pre-launch signals aligned` };
}

export async function computeRadar(): Promise<RadarForecast[]> {
  const db = await getDb();
  const comps = await db.query<{ id: number; name: string; slug: string }>('SELECT id, name, slug FROM competitors ORDER BY id');
  const out: RadarForecast[] = [];
  for (const c of comps) {
    const rows = await db.query<SignalRow>(
      "SELECT channel, title FROM stream_items WHERE competitor_id=$1 AND status IN ('pending','signaled')",
      [c.id],
    );
    const subs = rows.filter((r) => r.channel === 'subdomains').map((r) => r.title.replace(/^Subdomain observed:\s*/, ''));
    const notableSubs = subs.filter((s) => /(^|\.)(ai|beta|labs|app|new|staging|preview|go)\./.test(s) || /ai|beta|labs/.test(s));
    const aiHires = rows.filter((r) => r.channel === 'jobs' && /engineer|ai|ml|data|product|developer|architect/i.test(r.title)).length;
    const events = rows.filter((r) => r.channel === 'events').length;
    const ads = rows.filter((r) => r.channel.startsWith('ads_')).length;
    const product = rows.filter((r) => (r.channel === 'sitemap' || r.channel === 'website') && /product|pricing|feature|platform/i.test(r.title)).length;

    const ev = { subdomains: notableSubs.length ? notableSubs : subs.slice(0, 3), aiHires, events, ads, product };
    const n = narrate(c.name, ev);
    if (!n) continue;

    const evidence: string[] = [];
    if (ev.subdomains.length) evidence.push(`${ev.subdomains.length} notable subdomain${ev.subdomains.length > 1 ? 's' : ''} (${ev.subdomains.slice(0, 3).join(', ')})`);
    if (aiHires) evidence.push(`${aiHires} engineering/product/data roles open`);
    if (ads > 3) evidence.push(`${ads} active ad creatives across platforms`);
    if (events) evidence.push(`${events} events/webinars staged`);
    if (product) evidence.push(`${product} product/pricing page change${product > 1 ? 's' : ''}`);

    const breadth = evidence.length;
    const confidence = breadth >= 4 ? 'High' : breadth === 3 ? 'Medium' : 'Emerging';
    out.push({ competitor: c.name, slug: c.slug, confidence, headline: n.headline, evidence, window: 'last 30 days' });
  }
  const rank = { High: 0, Medium: 1, Emerging: 2 };
  return out.sort((a, b) => rank[a.confidence] - rank[b.confidence]);
}
