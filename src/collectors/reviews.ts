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
import { ingestItems, recordRun, getSource, type Competitor } from '@/db/queries';

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


// ---------------------------------------------------------------------------
// One call, many platforms
// ---------------------------------------------------------------------------
//
// zen-studio/software-review-scraper covers G2, Capterra, Trustpilot,
// TrustRadius and Gartner in a single run, and — crucially — is queried by
// DOMAIN rather than by product name. That is the identity key itself: no slug
// resolution, no fuzzy matching, none of the Crayon-Group / Gong-cha / Kluster
// failures that every name-matched channel produced.
//
// Because one run answers three of our channels, the result is memoized per
// competitor per collection run. Whichever channel executes first pays for the
// call; the others read the cache. Cleared alongside the page capture cache.
const reviewRunCache = new Map<number, Map<string, VendorReview[]>>();

export function clearReviewCache(): void {
  reviewRunCache.clear();
}

/** Our channel key ← the actor's `platform` value. */
const PLATFORM_CHANNEL: Record<string, string> = {
  g2: 'g2',
  capterra: 'capterra',
  trustpilot: 'trustpilot',
  trustradius: 'trustradius',
  gartner: 'gartner',
};

async function fetchAllReviews(comp: Competitor): Promise<Map<string, VendorReview[]> | null> {
  const cached = reviewRunCache.get(comp.id);
  if (cached) return cached;

  const actor = process.env.APIFY_REVIEWS_ACTOR ?? '';
  if (!actor) return null;

  const bare = comp.domain.replace(/^www\./, '');
  const input = buildActorInput(
    'APIFY_REVIEWS_INPUT',
    { company: comp.name, domain: bare, slug: comp.slug, url: `https://${bare}` },
    {
      query: bare, // the domain — identity, not a name
      platforms: Object.keys(PLATFORM_CHANNEL),
      // The actor enforces maxResults >= 100, so 25 is rejected outright and
      // there is no cheap run. It also has no incremental mode — every run
      // re-pulls and re-bills reviews we already hold. Both push this channel
      // to a MONTHLY cadence: 100 rows once a month is $0.50 per competitor
      // for five platforms, where weekly would be $2.00 for the same reviews.
      // Reviews move slowly enough that monthly loses nothing.
      maxResults: Math.max(100, MAX_REVIEWS),
      sort: 'most_recent',
    },
  );

  const raw = await runApifyActor<Record<string, unknown>>(actor, input);
  if (raw === null) return null;

  const byChannel = new Map<string, VendorReview[]>();
  for (const row of raw) {
    const platform = String(row.platform ?? '').toLowerCase();
    const channel = PLATFORM_CHANNEL[platform];
    if (!channel) continue;
    const list = byChannel.get(channel) ?? [];
    list.push(normalizeReview(row));
    byChannel.set(channel, list);
  }
  reviewRunCache.set(comp.id, byChannel);
  return byChannel;
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

  // Preferred path: the one multi-platform actor, queried by domain.
  const all = await fetchAllReviews(comp);
  let rows: VendorReview[] | null = all ? (all.get(channel) ?? []) : null;

  // Fallback: a per-channel actor, for anything the combined one does not
  // cover (Glassdoor) or if it is simply not configured.
  if (rows === null) {
    const actor = process.env[actorEnv] ?? '';
    if (!actor) {
      await recordRun(comp.id, channel, true, 0, `deferred: set APIFY_REVIEWS_ACTOR or ${actorEnv}`);
      return 'deferred (no actor)';
    }
    const bare = comp.domain.replace(/^www\./, '');
    // Per-channel actors do NOT share an input shape. memo23's Glassdoor
    // scraper takes startUrls + command, with no `query` field at all — a
    // generic {query,maxItems} body would have been rejected outright. Checked
    // against its published schema rather than assumed, after making exactly
    // that mistake with G2.
    // Glassdoor employer pages are keyed by an internal id — the actor's own
    // example is .../Avis/Azaé-Avis-E1360610.htm — which cannot be derived
    // from a domain or a name. So the URL is stored per competitor in
    // `sources`, the same way jobs.ts remembers an ATS board, and set once
    // from the employer's real Reviews page.
    let fallback: Record<string, unknown>;
    if (channel === 'glassdoor') {
      const stored = await getSource(comp.id, 'glassdoor', 'url');
      if (!stored) {
        await recordRun(
          comp.id,
          'glassdoor',
          true,
          0,
          'needs the employer Reviews URL — Glassdoor keys pages by an internal id we cannot derive',
        );
        return 'needs Glassdoor employer URL';
      }
      fallback = { startUrls: [{ url: stored }], command: 'reviews', maxItems: MAX_REVIEWS };
    } else {
      fallback = { query: bare, maxItems: MAX_REVIEWS, maxResults: MAX_REVIEWS };
    }

    const input = buildActorInput(
      actorEnv.replace('_ACTOR', '_INPUT'),
      { company: comp.name, domain: bare, slug: comp.slug, url: `https://${bare}` },
      fallback,
    );
    const raw = await runApifyActor<Record<string, unknown>>(actor, input);
    if (raw === null) {
      await recordRun(comp.id, channel, false, 0, `vendor run failed / ${actorEnv} unset`);
      return 'FAILED (vendor)';
    }
    rows = raw.map(normalizeReview);
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
  return rows.length === 0 ? `no ${label} reviews found` : `+${added} (${fresh} pending) — ${rows.length} reviews`;
}

export const collectG2 = (c: Competitor) => collectReviewSource(c, 'g2', 'APIFY_G2_ACTOR', 'G2');
export const collectCapterra = (c: Competitor) => collectReviewSource(c, 'capterra', 'APIFY_CAPTERRA_ACTOR', 'Capterra');
export const collectGlassdoor = (c: Competitor) => collectReviewSource(c, 'glassdoor', 'APIFY_GLASSDOOR_ACTOR', 'Glassdoor');
export const collectTrustRadius = (c: Competitor) => collectReviewSource(c, 'trustradius', 'APIFY_TRUSTRADIUS_ACTOR', 'TrustRadius');
export const collectGartner = (c: Competitor) => collectReviewSource(c, 'gartner', 'APIFY_GARTNER_ACTOR', 'Gartner');
