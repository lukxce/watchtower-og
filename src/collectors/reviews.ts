// G2, Capterra & Glassdoor — vendor-scraped review/sentiment channels (no open
// API). All three share the Apify-class vendor helper and the same shape:
// resolve nothing (vendor takes the brand/domain), pull recent reviews, ingest.
// Each defers cleanly without APIFY_TOKEN + its actor env var. Gray sources —
// gate to paid tiers, degrade gracefully.
import { hasVendor, runApifyActor, buildActorInput } from '@/lib/vendor';
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
  const input = buildActorInput(
    actorEnv.replace('_ACTOR', '_INPUT'),
    { company: comp.name, domain: bare, slug: comp.slug, url: `https://${bare}` },
    { company: comp.name, domain: comp.domain, maxItems: 25 },
  );
  const raw = await runApifyActor<Record<string, unknown>>(actor, input);
  const rows = raw?.map(normalizeReview) ?? null;
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
