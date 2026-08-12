// Product Hunt (community). Official GraphQL API v2 — search posts by the
// competitor's website/name. Needs PRODUCTHUNT_TOKEN (free developer token);
// defers cleanly without it.
import { ingestItems, recordRun, type Competitor } from '@/db/queries';

export async function collectProductHunt(comp: Competitor): Promise<string> {
  const token = process.env.PRODUCTHUNT_TOKEN;
  if (!token) {
    await recordRun(comp.id, 'producthunt', true, 0, 'deferred: set PRODUCTHUNT_TOKEN (free)');
    return 'deferred (needs PRODUCTHUNT_TOKEN)';
  }
  const query = `query($q:String!){ posts(first:15, order:NEWEST){ edges { node { id name tagline url createdAt website } } } }`;
  // PH search isn't a first-class arg on posts; we filter client-side by name/domain.
  try {
    const res = await fetch('https://api.producthunt.com/v2/api/graphql', {
      method: 'POST',
      headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
      body: JSON.stringify({ query, variables: { q: comp.name } }),
    });
    if (!res.ok) {
      await recordRun(comp.id, 'producthunt', false, 0, `HTTP ${res.status}`);
      return `FAILED (HTTP ${res.status})`;
    }
    const json = (await res.json()) as { data?: { posts?: { edges?: { node: { id: string; name: string; tagline?: string; url: string; createdAt: string; website?: string } }[] } } };
    const bare = comp.domain.replace(/^www\./, '');
    const brand = comp.name.toLowerCase();
    const nodes = (json.data?.posts?.edges ?? [])
      .map((e) => e.node)
      .filter((n) => n.name.toLowerCase().includes(brand) || (n.website ?? '').includes(bare));
    const { added, fresh } = await ingestItems(
      comp.id,
      'producthunt',
      nodes.map((n) => ({ externalId: `ph:${n.id}`, title: `Product Hunt launch: ${n.name} — ${n.tagline ?? ''}`.trim(), url: n.url, publishedAt: n.createdAt })),
    );
    await recordRun(comp.id, 'producthunt', true, added);
    return `+${added} (${fresh} pending)`;
  } catch (e) {
    await recordRun(comp.id, 'producthunt', false, 0, e instanceof Error ? e.message : String(e));
    return 'FAILED (fetch)';
  }
}
