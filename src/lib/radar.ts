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

// Forecast narratives, deliberately conservative. Lessons encoded from real
// false positives: a company with hundreds of engineers hiring 2 devs is not
// "pre-launch"; simply having ads running proves nothing by itself; and a
// hiring CLUSTER means several roles in the same window, not any hiring.
// The bar: at least two STRONG signal types, or one genuinely new buildout
// (a notable subdomain) which alone earns only a modest "worth watching".
function narrate(name: string, ev: { subdomains: string[]; hireCluster: number; events: number; ads: number; product: number }): { headline: string; confidence: 'High' | 'Medium' | 'Emerging' } | null {
  const strong = [ev.subdomains.length > 0, ev.hireCluster >= 4, ev.product >= 2].filter(Boolean).length;
  const support = [ev.events > 0, ev.ads > 10].filter(Boolean).length;

  if (ev.subdomains.length > 0 && ev.hireCluster >= 4) {
    return {
      headline: `${name} looks to be building something new — fresh buildout hostnames plus a hiring cluster in the same window`,
      confidence: strong + support >= 3 ? 'High' : 'Medium',
    };
  }
  if (ev.hireCluster >= 4 && ev.product >= 2) {
    return {
      headline: `${name} is investing in product — a hiring cluster alongside product-page changes`,
      confidence: strong + support >= 3 ? 'Medium' : 'Emerging',
    };
  }
  if (ev.subdomains.length > 0) {
    // A single new buildout hostname is worth an eyebrow, not a forecast.
    return {
      headline: `New buildout spotted at ${name}: ${ev.subdomains[0]} — worth watching, not yet a pattern`,
      confidence: 'Emerging',
    };
  }
  return null; // hiring alone, ads alone, or ads+events don't clear the bar
}

export async function computeRadar(orgId: string): Promise<RadarForecast[]> {
  const db = await getDb();
  const comps = await db.query<{ id: number; name: string; slug: string }>(
    'SELECT id, name, slug FROM competitors WHERE org_id = $1 ORDER BY id',
    [orgId],
  );
  const out: RadarForecast[] = [];
  for (const c of comps) {
    const rows = await db.query<SignalRow>(
      "SELECT channel, title FROM stream_items WHERE competitor_id=$1 AND status IN ('pending','signaled')",
      [c.id],
    );
    // Only allowlist-surviving subdomains count (archived plumbing never gets
    // here — status filter above excludes it). No fallback: if nothing
    // notable exists, subdomain evidence is zero, not "the first three".
    const subPriority = (s: string) => (/(^|[.-])(launch|beta|labs?|pilot|ai|alpha|new)([.-]|$)/.test(s) ? 0 : 1);
    const notableSubs = rows
      .filter((r) => r.channel === 'subdomains')
      .map((r) => r.title.replace(/^Subdomain observed:\s*/, ''))
      .sort((a, b) => subPriority(a) - subPriority(b));
    const hireCluster = rows.filter((r) => r.channel === 'jobs' && /engineer|ai|ml|data|product|developer|architect/i.test(r.title)).length;
    const events = rows.filter((r) => r.channel === 'events').length;
    const ads = rows.filter((r) => r.channel.startsWith('ads_')).length;
    const product = rows.filter((r) => (r.channel === 'sitemap' || r.channel === 'website') && /product|pricing|feature|platform/i.test(r.title)).length;

    const ev = { subdomains: notableSubs, hireCluster, events, ads, product };
    const n = narrate(c.name, ev);
    if (!n) continue;

    const evidence: string[] = [];
    if (notableSubs.length) evidence.push(`${notableSubs.length} new buildout hostname${notableSubs.length > 1 ? 's' : ''} (${notableSubs.slice(0, 3).join(', ')})`);
    if (hireCluster >= 4) evidence.push(`${hireCluster} engineering/product/data roles open in the same window`);
    else if (hireCluster > 0 && notableSubs.length > 0) evidence.push(`${hireCluster} technical role${hireCluster > 1 ? 's' : ''} open (below cluster threshold on its own)`);
    if (events) evidence.push(`${events} events/webinars staged`);
    if (ads > 10 && (notableSubs.length > 0 || hireCluster >= 4)) evidence.push(`${ads} active ad creatives running as context`);
    if (product >= 2) evidence.push(`${product} product/pricing page changes`);

    out.push({ competitor: c.name, slug: c.slug, confidence: n.confidence, headline: n.headline, evidence, window: 'last 30 days' });
  }
  const rank = { High: 0, Medium: 1, Emerging: 2 };
  return out.sort((a, b) => rank[a.confidence] - rank[b.confidence]);
}
