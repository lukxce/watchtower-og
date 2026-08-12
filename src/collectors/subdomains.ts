// Subdomain watch via certificate-transparency logs. Two independent CT
// sources so a flaky one never produces a false "no subdomains": crt.sh first
// (retry w/ backoff), then certspotter's free API as fallback. New hostnames
// reveal unreleased products (beta.*, ai.*) weeks before launch.
import { plainFetch, sleep } from '@/lib/fetchLadder';
import { jsonFetch, ingestItems, recordRun, type Competitor } from '@/db/queries';

async function viaCrtSh(bare: string): Promise<Set<string> | null> {
  let res = await plainFetch(`https://crt.sh/?q=%25.${bare}&output=json`, 60000);
  for (let a = 0; a < 3 && res.status !== 200; a++) {
    await sleep(4000 * (a + 1));
    res = await plainFetch(`https://crt.sh/?q=%25.${bare}&output=json`, 60000);
  }
  if (res.status !== 200) return null;
  try {
    const rows = JSON.parse(res.html) as { name_value?: string }[];
    const hosts = new Set<string>();
    for (const r of rows) for (const n of String(r.name_value ?? '').split('\n')) addHost(hosts, n, bare);
    return hosts;
  } catch {
    return null;
  }
}

async function viaCertspotter(bare: string): Promise<Set<string> | null> {
  const data = (await jsonFetch(
    `https://api.certspotter.com/v1/issuances?domain=${bare}&include_subdomains=true&expand=dns_names`,
    30000,
  )) as { dns_names?: string[] }[] | null;
  if (!Array.isArray(data)) return null;
  const hosts = new Set<string>();
  for (const iss of data) for (const n of iss.dns_names ?? []) addHost(hosts, n, bare);
  return hosts;
}

function addHost(set: Set<string>, raw: string, bare: string) {
  const h = raw.trim().toLowerCase();
  if (!h || h.startsWith('*.')) return;
  if (h === bare || h.endsWith(`.${bare}`)) set.add(h);
}

export async function collectSubdomains(comp: Competitor): Promise<string> {
  const bare = comp.domain.replace(/^www\./, '');
  let hosts = await viaCrtSh(bare);
  let via = 'crt.sh';
  if (!hosts) {
    hosts = await viaCertspotter(bare);
    via = 'certspotter';
  }
  if (!hosts) {
    await recordRun(comp.id, 'subdomains', false, 0, 'both crt.sh and certspotter failed');
    return 'FAILED (both CT sources)';
  }
  const { added, fresh } = await ingestItems(
    comp.id,
    'subdomains',
    [...hosts].map((h) => ({ externalId: h, title: `Subdomain observed: ${h}`, url: `https://${h}` })),
  );
  await recordRun(comp.id, 'subdomains', true, added, `${hosts.size} hosts via ${via}`);
  return `+${added} (${fresh} pending) — ${hosts.size} hosts via ${via}`;
}
