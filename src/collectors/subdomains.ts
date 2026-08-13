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

// Judgment layer: a subdomain is only a signal if it hints at something being
// BUILT or MARKETED. email.x.com is sending infrastructure, not strategy —
// record it (so the history is complete) but keep it out of the feed.
// launch.x.com / beta.x.com / pricepilot.x.com are the ones worth surfacing.
const INFRA_LABEL =
  /^(e?mail\d*|smtp\d*|mta\d*|mx\d*|pop3?|imap|webmail|exchange|owa|autodiscover|autoconfig|lyncdiscover|msoid|sip|enterpriseregistration|enterpriseenrollment|ns\d*|dns\d*|spf|dkim\d*|_?dmarc|bounces?|unsub(scribe)?|links?|clicks?|track(ing)?|em\d+|u\d+|url\d+|cdn\d*|static\d*|assets?|img|images?|fonts?|media|vpn|remote|sso|okta|auth|login|id|identity|accounts?|status|uptime|www\d*|m|calendar|meet|barracuda|mimecast|zixgateway\d*|selector\d*|k\d+|s\d+|mailer|newsletter|mandrill|sendgrid|postmark|mailgun|krs|gateway|proxy|firewall|mdm|helpdesk-?mail)$/;

function isInfra(host: string, bare: string): boolean {
  if (host === bare) return true; // the apex itself isn't a discovery
  const sub = host.slice(0, -(bare.length + 1)); // strip ".bare"
  // classify on the leftmost label; nested infra (link.e.x.com) counts too
  return sub.split('.').some((label) => INFRA_LABEL.test(label));
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
  const items = [...hosts].map((h) => {
    const infra = isInfra(h, bare);
    return {
      externalId: h,
      title: `Subdomain observed: ${h}`,
      url: `https://${h}`,
      payload: { infra },
      archive: infra,
    };
  });
  const notable = items.filter((i) => !i.archive).length;
  const { added, fresh } = await ingestItems(comp.id, 'subdomains', items);
  await recordRun(comp.id, 'subdomains', true, added, `${hosts.size} hosts via ${via} (${notable} notable, rest infra)`);
  return `+${added} (${fresh} pending) — ${hosts.size} hosts via ${via}, ${notable} notable`;
}
