// LinkedIn company posts. No official API — licensed vendor only (Apify-class).
// Needs APIFY_TOKEN + APIFY_LINKEDIN_ACTOR; defers cleanly. Gray source: gate
// to paid tiers and always degrade gracefully.
import { hasVendor, runApifyActor } from '@/lib/vendor';
import { ingestItems, recordRun, type Competitor } from '@/db/queries';

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
  const rows = await runApifyActor<{ urn?: string; text?: string; postedAtISO?: string; url?: string }>(actor, {
    company: comp.name,
    identifier: comp.domain,
    maxPosts: 25,
  });
  if (rows === null) {
    await recordRun(comp.id, 'linkedin_posts', false, 0, 'vendor run failed / actor unset');
    return 'FAILED (vendor)';
  }
  const { added, fresh } = await ingestItems(
    comp.id,
    'linkedin_posts',
    rows.filter((r) => r.text).map((r) => ({
      externalId: `li:${r.urn ?? r.url ?? r.text!.slice(0, 40)}`,
      title: `LinkedIn post: ${r.text!.slice(0, 140)}`,
      url: r.url,
      publishedAt: r.postedAtISO,
    })),
  );
  await recordRun(comp.id, 'linkedin_posts', true, added, `${rows.length} posts via vendor`);
  return `+${added} (${fresh} pending) — ${rows.length} posts`;
}
