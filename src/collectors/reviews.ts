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
import { ingestItems, recordRun, getSource, setSource, type Competitor } from '@/db/queries';

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
  // zen-studio splits the body into `pros`/`cons` and frequently leaves `text`
  // null — 20 of the 48 rows in the first live run had no `text` at all. Taking
  // `text` alone would have ingested those as ratings with no content.
  const prosCons = [str(raw.pros) && `Pros: ${str(raw.pros)}`, str(raw.cons) && `Cons: ${str(raw.cons)}`]
    .filter(Boolean)
    .join(' · ');

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
    (qaParts.length ? qaParts.join(' — ') : undefined) ??
    (prosCons || undefined);

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
  // Reviewer context arrives nested (memo23) OR flattened with literal dotted
  // keys (zen-studio emits "reviewer.name", not reviewer: { name }).
  const reviewer = raw.reviewer as Record<string, unknown> | undefined;
  const flat = (k: string) => str(raw[`reviewer.${k}`]);
  const segment = str(reviewer?.business_size) ?? flat('companySize');
  const jobTitle = str(reviewer?.reviewer_job_title) ?? flat('jobTitle');
  if (segment) extra.segment = segment;
  if (jobTitle) extra.jobTitle = jobTitle;
  if (flat('industry')) extra.industry = flat('industry');
  if (raw.platform) extra.platform = str(raw.platform);

  // The most valuable field a review directory exposes for competitive
  // intelligence: which products the buyer weighed against this one, and what
  // else they run. TrustRadius names them outright.
  const pd = raw.platformData as Record<string, unknown> | undefined;
  const alts = Array.isArray(pd?.alternativesConsidered) ? pd!.alternativesConsidered : undefined;
  if (alts?.length) extra.alternativesConsidered = alts;
  const alongside = Array.isArray(pd?.otherSoftwareUsed) ? pd!.otherSoftwareUsed : undefined;
  if (alongside?.length) {
    extra.usedAlongside = (alongside as { product?: string }[]).map((x) => x.product).filter(Boolean);
  }
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
interface ReviewRun {
  byChannel: Map<string, VendorReview[]>;
  totalRows: number;
  /**
   * The run came back at the row cap, so it was cut off mid-collection and a
   * platform with no rows may simply never have been reached. Absence proves
   * nothing here — a competitor with 200 G2 reviews could exhaust the cap
   * before Trustpilot is ever looked at.
   */
  truncated: boolean;
}

const reviewRunCache = new Map<number, ReviewRun>();

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

async function fetchAllReviews(comp: Competitor): Promise<ReviewRun | null> {
  const cached = reviewRunCache.get(comp.id);
  if (cached) return cached;

  const actor = process.env.APIFY_REVIEWS_ACTOR ?? '';
  if (!actor) return null;

  const bare = comp.domain.replace(/^www\./, '');
  const cap = Math.max(100, MAX_REVIEWS);
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
      maxResults: cap,
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
  const run: ReviewRun = { byChannel, totalRows: raw.length, truncated: raw.length >= cap };
  reviewRunCache.set(comp.id, run);
  return run;
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
  let rows: VendorReview[] | null = all ? (all.byChannel.get(channel) ?? []) : null;

  // The combined actor covers five platforms, but not equally well. Measured:
  // it returns zero Gartner rows for Klue, which has 20 Gartner Peer Insights
  // reviews at 4.8 stars — its Gartner module is effectively a stub, and the
  // same developer publishes a separate `gartner-review-scraper` precisely
  // because of that.
  //
  // So an empty slice has to be able to fall through to a dedicated actor.
  // Previously the fallback fired only when the WHOLE combined call failed,
  // which meant a per-channel actor could never rescue a channel the combined
  // run merely covered badly — the exact case we have. Opt-in: this only
  // costs a second run when that channel's actor env var is actually set.
  if (rows !== null && rows.length === 0 && process.env[actorEnv]) rows = null;

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
      fallback = {
        startUrls: [{ url: stored }],
        command: 'reviews',
        maxItems: MAX_REVIEWS,
        // This actor has what zen-studio lacks: incremental collection. Both
        // flags together mean a repeat run bills only genuinely new reviews
        // rather than re-pulling the same tail every time — which is why
        // Glassdoor can run weekly where the multi-platform actor cannot.
        monitoringModeForReviews: true,
        saveOnlyUniqueItems: true,
        // Aggregate stats come back without paying for every underlying
        // review: the rating trend is the signal, not the individual posts.
        includeCompanyReviewStats: true,
      };
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
  if (rows.length === 0) {
    // Three different facts hide behind "zero rows", and collapsing them into
    // one message is a false fire in the quiet direction. `no Trustpilot
    // reviews found` reads as "we read their profile and it was empty" — but
    // Klue has NO Trustpilot profile, and searching Trustpilot for "crayon"
    // returns eight unrelated companies. Reporting that we watched something
    // we cannot see is exactly the failure the brand exists to prevent.
    //
    // The combined run separates them for free. If the SAME call returned
    // reviews from other platforms and was not cut off at the cap, the lookup
    // demonstrably worked — so this platform's silence is a fact about the
    // competitor, not about us, and we are entitled to say so.
    if (all && !all.truncated && all.totalRows > 0) {
      // Careful with the wording. A successful run that found nothing here
      // means the LOOKUP came back empty — which is not the same as the
      // competitor being absent, because the actor's module for a platform can
      // simply be weak. Measured case: Klue has 20 Gartner Peer Insights
      // reviews at 4.8 stars, and this actor returns zero Gartner rows for it.
      // "Not listed on Gartner" would have been confident and false — the
      // exact failure mode this whole branch exists to avoid. So we report
      // what we did, not what is true of the world, and show the evidence.
      await setSource(comp.id, channel, 'presence', 'not_found');
      const note = `no ${label} listing found — the same run returned ${all.totalRows} reviews from other platforms, so the lookup itself worked`;
      await recordRun(comp.id, channel, true, 0, note);
      return `no ${label} listing found`;
    }
    await recordRun(comp.id, channel, true, 0, `${label} returned nothing and nothing proves the lookup ran — coverage unconfirmed`);
    return `${label} unconfirmed`;
  }

  await setSource(comp.id, channel, 'presence', 'listed');
  await recordRun(comp.id, channel, true, added, `${rows.length} reviews via vendor`);
  return `+${added} (${fresh} pending) — ${rows.length} reviews`;
}

export const collectG2 = (c: Competitor) => collectReviewSource(c, 'g2', 'APIFY_G2_ACTOR', 'G2');
export const collectCapterra = (c: Competitor) => collectReviewSource(c, 'capterra', 'APIFY_CAPTERRA_ACTOR', 'Capterra');
export const collectGlassdoor = (c: Competitor) => collectReviewSource(c, 'glassdoor', 'APIFY_GLASSDOOR_ACTOR', 'Glassdoor');
export const collectTrustRadius = (c: Competitor) => collectReviewSource(c, 'trustradius', 'APIFY_TRUSTRADIUS_ACTOR', 'TrustRadius');
export const collectGartner = (c: Competitor) => collectReviewSource(c, 'gartner', 'APIFY_GARTNER_ACTOR', 'Gartner');

/**
 * Trustpilot via the licensed multi-platform run.
 *
 * Used only when there is no TRUSTPILOT_API_KEY — see `collectors/trustpilot.ts`
 * for why the public-page fallback can no longer stand on its own.
 */
export const collectTrustPilotViaVendor = (c: Competitor) =>
  collectReviewSource(c, 'trustpilot', 'APIFY_TRUSTPILOT_ACTOR', 'Trustpilot');
