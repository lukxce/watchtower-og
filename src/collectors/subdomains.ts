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

// Judgment layer, allowlist edition. First pass used an infra blocklist and
// the feed still drowned in cms-de.x.com / sentry.dev.x.com / api-foo.x.com —
// engineering plumbing, not strategy. A subdomain is only a signal when its
// name hints at something being BUILT or MARKETED (launch., beta., pricing.,
// autopilot., agent-api.…). Everything else is recorded but archived, so the
// history stays complete without burying the feed.
// BUILDOUT tells — names that hint something new is being built. These are
// the only hostnames that become customer-visible signals.
const BUILDOUT =
  /(^|[.-])(launch|beta|labs?|pilot|autopilot|copilot|agents?|ai|ml|alpha|next|early|new|v\d+)([.-]|$)/;

// WATCH SURFACES — marketing/commerce hostnames (webinars., events., lp.,
// pricing., academy.…). The hostname itself is OUR detection plumbing, not a
// customer-facing signal: the customer cares when a NEW webinar or pricing
// change appears there, not that the hostname exists. Recorded + tagged so
// future page-watch collectors can crawl them; never surfaced in the feed.
const WATCH_SURFACE =
  /(^|[.-])(try|get|go|start|onboard(ing)?|shop|store|checkout|price|pricing|plans?|academy|marketplace|events?|summit|webinars?|promo|offers?|campaigns?|lp|landing)([.-]|$)/;

// Vetos that override an allowlist hit, learned from real false positives:
// - env markers: autopilot.sandbox / autopilot.prod / agent-api.* are an
//   EXISTING product's engineering surface, not a new buildout
// - infra tokens: upflow-email.billing.* matched "billing" but is mail infra
// - stale years: events.sept2024.zurichroadshow.* — a certificate for a 2024
//   event page is history, not news
const VETO_ENV = /(^|[.-])(sandbox|prod|production|stag(e|ing)|dev|test|qa|uat|api|internal|preview\d*)([.-]|$)/;
const VETO_INFRA = /(^|[.-])(www\d*|ftp|webmail|cpanel|whm|autodiscover|autoconfig|e?mail|smtp|billing|invoic\w*|links?|clicks?|track\w*|bounces?|unsub\w*|cdn|static|sso|auth|login|okta|gateway|mx\d*|ns\d*)([.-]|$)/;

function hasStaleYear(sub: string): boolean {
  const years = sub.match(/20\d{2}/g);
  if (!years) return false;
  const current = new Date().getFullYear();
  return years.some((y) => Number(y) < current);
}

export type SubdomainClass = 'buildout' | 'watch_surface' | 'plumbing';

export function classifySubdomain(host: string, bare: string): SubdomainClass {
  if (host === bare) return 'plumbing'; // the apex itself isn't a discovery
  const sub = host.slice(0, -(bare.length + 1)); // strip ".bare"
  if (VETO_ENV.test(sub) || VETO_INFRA.test(sub) || hasStaleYear(sub)) return 'plumbing';
  if (BUILDOUT.test(sub)) return 'buildout';
  if (WATCH_SURFACE.test(sub)) return 'watch_surface';
  return 'plumbing';
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
    const cls = classifySubdomain(h, bare);
    return {
      externalId: h,
      title: `Subdomain observed: ${h}`,
      url: `https://${h}`,
      payload: { class: cls },
      archive: cls !== 'buildout',
    };
  });
  const buildouts = items.filter((i) => !i.archive).length;
  const surfaces = items.filter((i) => (i.payload as { class: string }).class === 'watch_surface').length;
  const { added, fresh } = await ingestItems(comp.id, 'subdomains', items);
  await recordRun(comp.id, 'subdomains', true, added, `${hosts.size} hosts via ${via} (${buildouts} buildout, ${surfaces} watch-surface, rest plumbing)`);
  return `+${added} (${fresh} pending) — ${hosts.size} hosts via ${via}, ${buildouts} buildout / ${surfaces} watch-surface`;
}
