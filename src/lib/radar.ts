// Launch Radar (vision §04 flagship): one signal is a data point, a cluster is
// a prediction. Blends signal types across a 6-month window — buildout
// hostnames, hiring clusters, product-page cadence, and now real corporate
// moves (funding, executive hires, partnerships, launches, acquisitions)
// pulled from the news channel — instead of leaning on subdomains alone.
// Detection is deterministic; the forecast narrative is authored by Claude.
// Confidence scales with how many independent signal TYPES corroborate, not
// with the raw count of any one type.
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

const WINDOW_DAYS = 180;

// Corporate-move detector for the news channel: funding, executive changes,
// partnerships, launches, acquisitions. Same keyword family as the scorer's
// BUMP list (src/lib/score.ts), kept here narrowly for classification rather
// than scoring.
export const CORPORATE_MOVE =
  /funding|raised|series [a-e]|acqui|merger|valuation|partnership|integrat|launch(es|ed)?|introduc|appoint|named|joins? as|chief (executive|technology|strategy|marketing|product) officer|\bC[EOTMS]O\b|vice president|\bVP\b/i;

// Forecast narratives, deliberately conservative. Lessons encoded from real
// false positives: a company with hundreds of engineers hiring 2 devs is not
// "pre-launch"; simply having ads running proves nothing by itself; a hiring
// CLUSTER means several roles in the same window, not any hiring. The bar:
// at least two independent signal TYPES, or one genuinely new buildout
// hostname on its own, which earns only a modest "worth watching".
function narrate(
  name: string,
  ev: { subdomains: string[]; hireCluster: number; events: number; ads: number; product: number; corporateMoves: number },
): { headline: string; confidence: 'High' | 'Medium' | 'Emerging' } | null {
  const strong = [ev.subdomains.length > 0, ev.hireCluster >= 4, ev.product >= 2, ev.corporateMoves >= 2].filter(Boolean).length;
  const support = [ev.events > 0, ev.ads > 10].filter(Boolean).length;

  if (ev.subdomains.length > 0 && ev.corporateMoves >= 2) {
    return {
      headline: `${name} looks to be building something new — a fresh buildout hostname lines up with real corporate moves in the same window`,
      confidence: strong + support >= 3 ? 'High' : 'Medium',
    };
  }
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
  if (ev.corporateMoves >= 2 && (ev.hireCluster > 0 || ev.product > 0)) {
    return {
      headline: `${name} is in an active stretch — multiple corporate moves alongside hiring or product activity`,
      confidence: strong + support >= 3 ? 'Medium' : 'Emerging',
    };
  }
  if (ev.subdomains.length > 0) {
    return {
      headline: `New buildout spotted at ${name}: ${ev.subdomains[0]} — worth watching, not yet a pattern`,
      confidence: 'Emerging',
    };
  }
  return null; // hiring alone, ads alone, or a single corporate move don't clear the bar
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
      `SELECT channel, title FROM stream_items
       WHERE competitor_id=$1 AND status IN ('pending','signaled')
         AND COALESCE(published_at, created_at) >= now() - interval '${WINDOW_DAYS} days'`,
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
    const corporateMoves = rows.filter((r) => r.channel === 'news' && CORPORATE_MOVE.test(r.title)).length;

    const ev = { subdomains: notableSubs, hireCluster, events, ads, product, corporateMoves };
    const n = narrate(c.name, ev);
    if (!n) continue;

    const evidence: string[] = [];
    if (notableSubs.length) evidence.push(`${notableSubs.length} new buildout hostname${notableSubs.length > 1 ? 's' : ''} (${notableSubs.slice(0, 3).join(', ')})`);
    if (corporateMoves >= 2) evidence.push(`${corporateMoves} corporate moves in the news (funding, hires, partnerships, or launches)`);
    else if (corporateMoves === 1 && notableSubs.length > 0) evidence.push('1 corporate move in the news (below the pattern threshold alone)');
    if (hireCluster >= 4) evidence.push(`${hireCluster} engineering/product/data roles open in the same window`);
    else if (hireCluster > 0 && notableSubs.length > 0) evidence.push(`${hireCluster} technical role${hireCluster > 1 ? 's' : ''} open (below cluster threshold on its own)`);
    if (events) evidence.push(`${events} events/webinars staged`);
    if (ads > 10 && (notableSubs.length > 0 || hireCluster >= 4)) evidence.push(`${ads} active ad creatives running as context`);
    if (product >= 2) evidence.push(`${product} product/pricing page changes`);

    out.push({ competitor: c.name, slug: c.slug, confidence: n.confidence, headline: n.headline, evidence, window: `last ${WINDOW_DAYS} days` });
  }
  const rank = { High: 0, Medium: 1, Emerging: 2 };
  return out.sort((a, b) => rank[a.confidence] - rank[b.confidence]);
}
