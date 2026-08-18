// LinkedIn company posts. No official API — licensed vendor only (Apify-class).
// Needs APIFY_TOKEN + APIFY_LINKEDIN_ACTOR; defers cleanly. Gray source: gate
// to paid tiers and always degrade gracefully.
//
// The target URL is STORED per competitor, never derived. `linkedin.com/company/
// <slug>` looks guessable and is not: klue.com is linkedin.com/company/klue,
// while linkedin.com/company/goklue is an unrelated company of the same name.
// Guessing here would reproduce the Crayon Group / Kluster failure on a channel
// where a wrong match means publishing another company's announcements.
import { hasVendor, runApifyActor, buildActorInput } from '@/lib/vendor';
import { smartFetch } from '@/lib/fetchLadder';
import { ingestItems, recordRun, getSource, setSource, type Competitor } from '@/db/queries';

/**
 * Find a competitor's LinkedIn company page from their own site.
 *
 * Companies link their LinkedIn from the footer on essentially every page, so
 * the homepage is enough. This matters more than it looks: the slug is not a
 * function of the domain, and measuring the real ones proves it —
 *
 *   crayon.co         -> /company/crayon-co        (not "crayon")
 *   grin.co           -> /company/grin-inc-        (trailing hyphen)
 *   usesignallabs.com -> /company/signal-labs-cix
 *   visualping.io     -> /company/9480446          (a bare numeric id)
 *
 * Four of seven would have been wrong by derivation, and a wrong match here
 * publishes another company's announcements as your competitor's.
 *
 * Cached as 'none' when the footer has no link, so a site that simply does not
 * link LinkedIn is not refetched on every run. Setting the URL by hand
 * overwrites that.
 */
export async function discoverLinkedinUrl(comp: Competitor): Promise<string | null> {
  const cached = await getSource(comp.id, 'linkedin', 'url');
  if (cached) return cached === 'none' ? null : cached;

  const res = await smartFetch(`https://${comp.domain}`);
  if (res.status !== 200) return null;
  const found = res.html.match(/https?:\/\/(?:[a-z]{0,3}\.)?linkedin\.com\/company\/([A-Za-z0-9_-]+)/i);
  if (!found) {
    await setSource(comp.id, 'linkedin', 'url', 'none');
    return null;
  }
  // Normalise: locale subdomains (ca./uk./lb.) are the same page.
  const url = `https://www.linkedin.com/company/${found[1]}`;
  await setSource(comp.id, 'linkedin', 'url', url);
  return url;
}

interface LiPost {
  // Field names verified against a live run of harvestapi/linkedin-company-posts.
  // The alternates are kept so swapping actors does not silently yield zero rows,
  // which is exactly what happened when this mapped `urn`/`text`/`postedAtISO`:
  // the actor returned posts and every one was dropped.
  id?: string;
  urn?: string;
  shareUrn?: string;
  linkedinUrl?: string;
  url?: string;
  content?: string;
  text?: string;
  postedAt?: { date?: string; timestamp?: number };
  postedAtISO?: string;
  type?: string;
  engagement?: Record<string, unknown>;
  author?: { name?: string; linkedinUrl?: string };
}

export async function collectLinkedinPosts(comp: Competitor): Promise<string> {
  if (!comp.track_linkedin) {
    await recordRun(comp.id, 'linkedin_posts', true, 0, 'not enabled for this competitor');
    return 'not tracked';
  }
  if (!hasVendor()) {
    await recordRun(comp.id, 'linkedin_posts', true, 0, 'deferred: set APIFY_TOKEN + APIFY_LINKEDIN_ACTOR (licensed vendor)');
    return 'deferred (needs vendor)';
  }
  const actor = process.env.APIFY_LINKEDIN_ACTOR ?? '';

  const target = await discoverLinkedinUrl(comp);
  if (!target) {
    await recordRun(comp.id, 'linkedin_posts', true, 0, 'no LinkedIn link found on their site — set one with scripts/set-source.mjs');
    return 'needs LinkedIn URL';
  }

  const bare = comp.domain.replace(/^www\./, '');
  const input = buildActorInput(
    'APIFY_LINKEDIN_INPUT',
    { company: comp.name, domain: bare, slug: comp.slug, url: target },
    {
      targetUrls: [target],
      maxPosts: Number(process.env.APIFY_MAX_POSTS ?? 25),
      // A briefing cares about what they said recently. Without this the actor
      // walks back through years of posts and bills for all of them.
      postedLimit: 'month',
      includeReposts: false,
    },
  );
  const rows = await runApifyActor<LiPost>(actor, input);
  if (rows === null) {
    await recordRun(comp.id, 'linkedin_posts', false, 0, 'vendor run failed / actor unset');
    return 'FAILED (vendor)';
  }

  const items = [];
  for (const r of rows) {
    const body = r.content ?? r.text;
    if (!body) continue;
    const url = r.linkedinUrl ?? r.url;
    const id = r.id ?? r.shareUrn ?? r.urn ?? url ?? body.slice(0, 40);
    const payload: Record<string, unknown> = {};
    if (r.engagement) payload.engagement = r.engagement;
    if (r.type) payload.type = r.type;
    if (r.author?.name) payload.author = r.author.name;
    items.push({
      externalId: `li:${id}`,
      title: `LinkedIn post: ${body.slice(0, 140)}`,
      url,
      publishedAt: r.postedAt?.date ?? r.postedAtISO,
      payload,
    });
  }

  const { added, fresh } = await ingestItems(comp.id, 'linkedin_posts', items);
  await recordRun(comp.id, 'linkedin_posts', true, added, `${rows.length} posts via vendor`);
  return `+${added} (${fresh} pending) — ${rows.length} posts`;
}
