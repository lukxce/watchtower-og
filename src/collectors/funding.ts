// Funding & M&A. Official Crunchbase API — resolve the org by domain once
// (cached in sources), then pull funding rounds / acquisitions. Needs
// CRUNCHBASE_API_KEY; defers cleanly (funding also surfaces via the news
// channel, so this is additive structured data, not the only path).
import { getSource, setSource, ingestItems, recordRun, type Competitor } from '@/db/queries';

const CB = 'https://api.crunchbase.com/api/v4';

async function resolveOrg(comp: Competitor, key: string): Promise<string | null> {
  const cached = await getSource(comp.id, 'funding', 'org');
  if (cached) return cached === 'none' ? null : cached;
  const bare = comp.domain.replace(/^www\./, '');
  try {
    const res = await fetch(`${CB}/searches/organizations?user_key=${key}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        field_ids: ['identifier', 'website_url'],
        query: [{ type: 'predicate', field_id: 'website_url', operator_id: 'domain_eq', values: [bare] }],
        limit: 1,
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { entities?: { properties?: { identifier?: { permalink?: string } } }[] };
    const permalink = json.entities?.[0]?.properties?.identifier?.permalink ?? null;
    await setSource(comp.id, 'funding', 'org', permalink ?? 'none');
    return permalink;
  } catch {
    return null;
  }
}

export async function collectFunding(comp: Competitor): Promise<string> {
  const key = process.env.CRUNCHBASE_API_KEY;
  if (!key) {
    await recordRun(comp.id, 'funding', true, 0, 'deferred: set CRUNCHBASE_API_KEY (funding also flows via News)');
    return 'deferred (needs CRUNCHBASE_API_KEY)';
  }
  const org = await resolveOrg(comp, key);
  if (!org) {
    await recordRun(comp.id, 'funding', true, 0, 'no Crunchbase org matched by domain');
    return 'no org matched';
  }
  try {
    const res = await fetch(
      `${CB}/entities/organizations/${org}/cards/raised_funding_rounds?user_key=${key}&card_field_ids=identifier,announced_on,money_raised,investment_type`,
    );
    if (!res.ok) {
      await recordRun(comp.id, 'funding', false, 0, `HTTP ${res.status}`);
      return `FAILED (HTTP ${res.status})`;
    }
    const json = (await res.json()) as { cards?: { raised_funding_rounds?: { properties?: { identifier?: { value?: string; uuid?: string }; announced_on?: { value?: string }; money_raised?: { value_usd?: number }; investment_type?: string } }[] } };
    const rounds = json.cards?.raised_funding_rounds ?? [];
    const { added, fresh } = await ingestItems(
      comp.id,
      'funding',
      rounds.map((r) => {
        const p = r.properties ?? {};
        const usd = p.money_raised?.value_usd;
        return {
          externalId: `cb:${p.identifier?.uuid ?? p.identifier?.value ?? Math.random()}`,
          title: `Funding: ${p.investment_type ?? 'round'}${usd ? ` — $${(usd / 1e6).toFixed(1)}M` : ''}`,
          url: `https://www.crunchbase.com/organization/${org}`,
          publishedAt: p.announced_on?.value,
        };
      }),
    );
    await recordRun(comp.id, 'funding', true, added, `${rounds.length} rounds`);
    return `+${added} (${fresh} pending) — ${rounds.length} rounds`;
  } catch (e) {
    await recordRun(comp.id, 'funding', false, 0, e instanceof Error ? e.message : String(e));
    return 'FAILED (fetch)';
  }
}
