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
import { ingestItems, recordRun, getSource, type Competitor } from '@/db/queries';

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

  const target = await getSource(comp.id, 'linkedin', 'url');
  if (!target) {
    await recordRun(comp.id, 'linkedin_posts', true, 0, 'needs the LinkedIn company URL — the slug cannot be derived from a domain safely');
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
