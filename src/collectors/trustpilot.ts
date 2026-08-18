// Trustpilot reviews. Production source: the official Trustpilot Business API
// (structured score + reviews) when TRUSTPILOT_API_KEY is set. Falls back to
// parsing the public review page (via the fetch ladder → Firecrawl if walled)
// so the channel works pre-key. Feeds the customer-sentiment Threat dimension.
import { smartFetch } from '@/lib/fetchLadder';
import { hasVendor } from '@/lib/vendor';
import { collectTrustPilotViaVendor } from '@/collectors/reviews';
import { ingestItems, recordRun, type Competitor, type StreamItem } from '@/db/queries';

interface Parsed {
  score?: number;
  total?: number;
  items: StreamItem[];
}

async function viaApi(bare: string): Promise<Parsed | null> {
  const key = process.env.TRUSTPILOT_API_KEY;
  if (!key) return null;
  try {
    // Resolve the business unit by domain, then pull recent reviews.
    const find = await fetch(`https://api.trustpilot.com/v1/business-units/find?name=${encodeURIComponent(bare)}&apikey=${key}`);
    if (!find.ok) return null;
    const bu = (await find.json()) as { id?: string; score?: { trustScore?: number }; numberOfReviews?: { total?: number } };
    if (!bu.id) return null;
    const rev = await fetch(`https://api.trustpilot.com/v1/business-units/${bu.id}/reviews?perPage=20&orderBy=createdat.desc&apikey=${key}`);
    const revJson = rev.ok ? ((await rev.json()) as { reviews?: { id: string; title?: string; text?: string; stars?: number; createdAt?: string }[] }) : { reviews: [] };
    return {
      score: bu.score?.trustScore,
      total: bu.numberOfReviews?.total,
      items: (revJson.reviews ?? []).map((r) => ({
        externalId: `tp:${r.id}`,
        title: `Trustpilot ${r.stars ?? '?'}★: ${(r.title || r.text || '').slice(0, 120)}`,
        url: `https://www.trustpilot.com/review/${bare}`,
        publishedAt: r.createdAt,
        payload: { rating: r.stars },
      })),
    };
  } catch {
    return null;
  }
}

async function viaPage(bare: string): Promise<Parsed | null> {
  const res = await smartFetch(`https://www.trustpilot.com/review/${bare}`);
  if (res.status !== 200) return null;
  const m = res.html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  try {
    const data = JSON.parse(m[1]);
    const pp = data?.props?.pageProps;
    const biz = pp?.businessUnit;
    const reviews = (pp?.reviews ?? []) as { id?: string; title?: string; text?: string; rating?: number; dates?: { publishedDate?: string } }[];
    return {
      score: biz?.trustScore ?? biz?.stars,
      total: biz?.numberOfReviews?.total ?? biz?.numberOfReviews,
      items: reviews
        .filter((r) => r.id && (r.title || r.text))
        .map((r) => ({
          externalId: `tp:${r.id}`,
          title: `Trustpilot ${r.rating ?? '?'}★: ${(r.title || r.text || '').slice(0, 120)}`,
          url: `https://www.trustpilot.com/review/${bare}`,
          publishedAt: r.dates?.publishedDate,
          payload: { rating: r.rating },
        })),
    };
  } catch {
    return null;
  }
}

export async function collectTrustpilot(comp: Competitor): Promise<string> {
  const bare = comp.domain.replace(/^www\./, '');
  const api = await viaApi(bare);

  // Without a key, the public page is no longer a fallback worth trusting:
  // Trustpilot now answers 403 to every server-side request — the .com page,
  // the locale mirrors, and their own business-unit find endpoint alike. So
  // `viaPage` returns null for a reachable profile and an absent one exactly
  // the same way, and the channel would report "no profile" for a company that
  // has one.
  //
  // The licensed multi-platform run already asks for Trustpilot alongside G2
  // and Capterra, at no extra cost, and it CAN tell those two apart: if the
  // same call returned reviews from other platforms, the lookup worked.
  if (!api && hasVendor()) return collectTrustPilotViaVendor(comp);

  const parsed = api ?? (await viaPage(bare));
  const via = api ? 'Business API' : 'public page';
  if (!parsed) {
    // Deliberately not "no profile" — we cannot see one from here either way.
    await recordRun(comp.id, 'trustpilot', false, 0, 'Trustpilot unreachable (403) and no API key — coverage unconfirmed');
    return 'unconfirmed (403, no key)';
  }
  const { added, fresh } = await ingestItems(comp.id, 'trustpilot', parsed.items);
  await recordRun(comp.id, 'trustpilot', true, added, `score ${parsed.score ?? '?'} · ${parsed.total ?? '?'} reviews · via ${via}`);
  return `+${added} (${fresh} pending) — score ${parsed.score ?? '?'}, ${parsed.total ?? '?'} reviews (${via})`;
}
