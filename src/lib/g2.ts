// G2 product resolution — find which G2 listings actually belong to a
// competitor, then remember them.
//
// A live search for "Klue" returns five product cards: Klue, Klue Win-Loss,
// Kluster, Wolters Kluwer and KlientBoost. Three of those are different
// companies that merely share a prefix — the same failure that produced
// Crayon Group in funding and Gong cha in mentions.
//
// The difference here is that G2 rows carry `companyDomain`, so identity can
// be VERIFIED instead of guessed: klue.com, kluster.com, wolterskluwer.com,
// klientboost.com. Matching on that is exact, and it is the first channel we
// have wired that can prove a row belongs to the competitor.
//
// It also finds every product a vendor lists, not just the obvious one. Klue
// runs a separate "Klue Win-Loss" listing — a distinct product line worth
// tracking on its own.
//
// Resolution is cached in `sources` (the pattern jobs.ts uses for ATS boards),
// so the search cost is paid once rather than on every crawl.
import { getSource, setSource, type Competitor } from '@/db/queries';
import { runApifyActor, buildActorInput } from '@/lib/vendor';

export interface G2Product {
  slug: string;
  name: string;
  rating: number | null;
  reviewCount: number | null;
  categories: string[];
}

interface SearchRow {
  productName?: string;
  productUrl?: string;
  companyDomain?: string;
  ratingOutOfFive?: number;
  reviewCount?: number;
  relatedCategories?: string[];
}

/** `https://www.g2.com/products/klue/reviews` → `klue` */
export function slugFromProductUrl(url: string | undefined): string | null {
  return url?.match(/\/products\/([^/?#]+)/)?.[1] ?? null;
}

const bare = (d: string) => d.replace(/^www\./, '').toLowerCase();

/** Keep only the search rows whose companyDomain IS the competitor's domain. */
export function productsForCompetitor(rows: SearchRow[], comp: Competitor): G2Product[] {
  const want = bare(comp.domain);
  const out: G2Product[] = [];
  for (const r of rows) {
    const got = r.companyDomain ? bare(r.companyDomain) : null;
    if (!got || got !== want) continue; // exact domain match or nothing
    const slug = slugFromProductUrl(r.productUrl);
    if (!slug) continue;
    out.push({
      slug,
      name: r.productName ?? slug,
      rating: typeof r.ratingOutOfFive === 'number' ? r.ratingOutOfFive : null,
      reviewCount: typeof r.reviewCount === 'number' ? r.reviewCount : null,
      categories: Array.isArray(r.relatedCategories) ? r.relatedCategories : [],
    });
  }
  return out;
}

/**
 * The competitor's G2 products, resolved once and cached.
 *
 * `refresh` forces a new search — worth doing occasionally, since a vendor
 * launching a second listing (as Klue did with Win-Loss) is itself a signal.
 */
export async function resolveG2Products(
  comp: Competitor,
  opts: { refresh?: boolean } = {},
): Promise<G2Product[] | null> {
  if (!opts.refresh) {
    const cached = await getSource(comp.id, 'g2', 'products');
    if (cached === 'none') return [];
    if (cached) {
      try {
        return JSON.parse(cached) as G2Product[];
      } catch {
        /* fall through and re-resolve */
      }
    }
  }

  const actor = process.env.APIFY_G2_ACTOR ?? '';
  const input = buildActorInput(
    'APIFY_G2_SEARCH_INPUT',
    { company: comp.name, domain: bare(comp.domain) },
    {
      searchQueries: [comp.name],
      maxItems: 10,
      useCachedData: false,
      proxy: { useApifyProxy: true, apifyProxyGroups: ['RESIDENTIAL'] },
      slowMode: true,
    },
  );
  const rows = await runApifyActor<SearchRow>(actor, input);
  if (rows === null) return null; // vendor unavailable — caller reports honestly

  const products = productsForCompetitor(rows, comp);
  await setSource(comp.id, 'g2', 'products', products.length ? JSON.stringify(products) : 'none');
  return products;
}
