// G2, Capterra & Glassdoor — vendor-scraped review/sentiment channels (no open
// API). All three share the Apify-class vendor helper and the same shape:
// resolve nothing (vendor takes the brand/domain), pull recent reviews, ingest.
// Each defers cleanly without APIFY_TOKEN + its actor env var. Gray sources —
// gate to paid tiers, degrade gracefully.
import { hasVendor, runApifyActor, buildActorInput } from '@/lib/vendor';
import { resolveG2Products } from '@/lib/g2';

/**
 * Reviews pulled per product per run.
 *
 * 25 is the production value. Rows are the billed unit — measured at $1.75
 * per 1,000 on top of a $0.01 start fee — so a run costs about 5c. The env
 * override exists so a throwaway test can be run at 5 without editing code
 * or carrying a value in anyone's config; it is not something a deployment
 * needs to set.
 */
const MAX_REVIEWS = Number(process.env.APIFY_MAX_REVIEWS ?? 25);
import { ingestItems, recordRun, type Competitor } from '@/db/queries';

interface VendorReview {
  id?: string;
  title?: string;
  text?: string;
  rating?: number;
  date?: string;
  url?: string;
  /** Extras worth keeping: who they switched from, NPS, segment. */
  extra?: Record<string, unknown>;
}

const str = (v: unknown): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim() : typeof v === 'number' ? String(v) : undefined;

/**
 * Review actors do not agree on field names, and picking one actor's shape
 * would break the moment it is swapped. azzouzana/g2-scraper returns
 * `reviewId` / `reviewUrl` / `published_at` and splits the prose across
 * `whatDoYouLike`, `whatDoYouDislike` and `whatProblemsOrBenefits` — none of
 * which match the `id` / `url` / `date` / `text` this file used to read. The
 * result would have been rows that looked fine and silently carried no link,
 * no date and no review body.
 */
export function normalizeReview(raw: Record<string, unknown>): VendorReview {
  const pick = (...keys: string[]) => {
    for (const k of keys) {
      const v = str(raw[k]);
      if (v) return v;
    }
    return undefined;
  };

  // Prose arrives three different ways depending on the actor: one field,
  // G2's three-part split (azzouzana), or a question->answer object keyed by
  // the literal G2 prompts (memo23).
  const qa = raw.review_question_answers;
  const qaParts =
    qa && typeof qa === 'object' && !Array.isArray(qa)
      ? Object.values(qa as Record<string, unknown>).map(str).filter(Boolean)
      : [];
  const splitParts = [
    str(raw.whatDoYouLike),
    str(raw.whatDoYouDislike),
    str(raw.whatProblemsOrBenefits),
  ].filter(Boolean);
  const text =
    pick('review_content', 'text', 'body', 'content', 'review', 'comment') ??
    (splitParts.length ? splitParts.join(' — ') : undefined) ??
    (qaParts.length ? qaParts.join(' — ') : undefined);

  const ratingRaw = raw.review_rating ?? raw.rating ?? raw.ratingOutOfFive ?? raw.score ?? raw.stars;
  const rating = typeof ratingRaw === 'number' ? ratingRaw : Number(ratingRaw) || undefined;

  // Switching data is the most valuable thing a review directory exposes for
  // competitive intelligence: it names who they are taking deals from.
  const switchedFrom = Array.isArray(raw.switched_from_products) ? raw.switched_from_products : undefined;
  const extra: Record<string, unknown> = {};
  if (rating !== undefined) extra.rating = rating;
  if (switchedFrom?.length) extra.switchedFrom = switchedFrom;
  if (raw.switching_theme_humanized) extra.switchingTheme = raw.switching_theme_humanized;
  if (raw.nps !== undefined && raw.nps !== null) extra.nps = raw.nps;
  if (raw.company_segment_label) extra.segment = raw.company_segment_label;

  // memo23 puts reviewer context in a nested object, and — uniquely among the
  // actors — carries the vendor's OWN domain on every row. That is a real join
  // key: it verifies the row belongs to this competitor instead of trusting a
  // name match, which is the failure that has bitten every other channel.
  const reviewer = raw.reviewer as Record<string, unknown> | undefined;
  if (reviewer?.business_size) extra.segment = str(reviewer.business_size) ?? extra.segment;
  if (reviewer?.reviewer_job_title) extra.jobTitle = str(reviewer.reviewer_job_title);
  const domain = pick('company_domain', 'companyDomain');
  if (domain) extra.companyDomain = domain;

  return {
    id: pick('reviewId', 'review_id', 'id', 'uuid'),
    title: pick('review_title', 'title', 'headline', 'summary'),
    text,
    rating,
    date: pick('publish_date', 'published_at', 'date', 'publishedAt', 'createdAt', 'submitted_at', 'reviewDate'),
    url: pick('review_link', 'reviewUrl', 'url', 'link', 'reviewLink'),
    extra,
  };
}

async function collectReviewSource(
  comp: Competitor,
  channel: string,
  actorEnv: string,
  label: string,
): Promise<string> {
  if (!hasVendor()) {
    await recordRun(comp.id, channel, true, 0, `deferred: set APIFY_TOKEN + ${actorEnv} (licensed vendor)`);
    return `deferred (needs vendor)`;
  }
  const actor = process.env[actorEnv] ?? '';
  const bare = comp.domain.replace(/^www\./, '');

  // G2 needs resolving before it can be read. A search for "Klue" returns
  // Klue, Klue Win-Loss, Kluster, Wolters Kluwer and KlientBoost — three of
  // which are other companies. resolveG2Products keeps only the listings whose
  // companyDomain IS ours, caches them, and hands back real G2 slugs. Reviews
  // are then fetched per slug, which is what the actor actually needs;
  // searchQueries returns product cards, not reviews.
  let slugs: string[] = [comp.slug];
  if (channel === 'g2') {
    const products = await resolveG2Products(comp);
    if (products === null) {
      await recordRun(comp.id, channel, false, 0, 'vendor run failed resolving G2 products');
      return 'FAILED (vendor)';
    }
    if (products.length === 0) {
      await recordRun(comp.id, channel, true, 0, `no G2 listing found for ${bare}`);
      return 'no G2 listing';
    }
    slugs = products.map((p) => p.slug);
  }

  const input = buildActorInput(
    actorEnv.replace('_ACTOR', '_INPUT'),
    { company: comp.name, domain: bare, slug: slugs[0], url: `https://${bare}` },
    {
      productSlugs: slugs,
      sortOrder: 'most_recent',
      // Rows are the billed unit and the start fee dominates at low volume
      // (measured: $0.01 start + $1.75/1,000 rows). APIFY_MAX_REVIEWS keeps
      // test runs cheap without editing code — set it to 5 while validating.
      maxReviews: MAX_REVIEWS,
      maxItems: MAX_REVIEWS * slugs.length,
      onlyNewReviews: true,
      useCachedData: false,
      proxy: { useApifyProxy: true, apifyProxyGroups: ['RESIDENTIAL'] },
      slowMode: true,
    },
  );
  const raw = await runApifyActor<Record<string, unknown>>(actor, input);
  // Search/summary rows share the dataset with review rows; keep only reviews.
  const rows = raw?.filter((r) => r.type === 'review' || r.reviewId || r.review_id).map(normalizeReview) ?? null;
  if (rows === null) {
    await recordRun(comp.id, channel, false, 0, `vendor run failed / ${actorEnv} unset`);
    return 'FAILED (vendor)';
  }
  const { added, fresh } = await ingestItems(
    comp.id,
    channel,
    rows.filter((r) => r.title || r.text).map((r) => ({
      externalId: `${channel}:${r.id ?? r.url ?? (r.title ?? '').slice(0, 40)}`,
      title: `${label} ${r.rating ?? '?'}★: ${(r.title || r.text || '').slice(0, 120)}`,
      url: r.url,
      publishedAt: r.date,
      payload: r.extra ?? { rating: r.rating },
    })),
  );
  await recordRun(comp.id, channel, true, added, `${rows.length} reviews via vendor`);
  return `+${added} (${fresh} pending) — ${rows.length} reviews`;
}

export const collectG2 = (c: Competitor) => collectReviewSource(c, 'g2', 'APIFY_G2_ACTOR', 'G2');
export const collectCapterra = (c: Competitor) => collectReviewSource(c, 'capterra', 'APIFY_CAPTERRA_ACTOR', 'Capterra');
export const collectGlassdoor = (c: Competitor) => collectReviewSource(c, 'glassdoor', 'APIFY_GLASSDOOR_ACTOR', 'Glassdoor');
