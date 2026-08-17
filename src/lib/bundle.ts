// Signal bundling — 10 ads observed on the same day is ONE thing that
// happened, not ten cards; the same funding story covered by five outlets is
// ONE story with five citations, not five signals. Bundles are computed at
// read time from the same rows the feed already fetches — nothing is thrown
// away, the members stay listed inside the bundle.
//
// Every bundle carries a `sub` that RECAPS its members — which platforms the
// ads run on and how long they've been up, which departments are hiring and
// where, what the webinars are actually called. The card has to answer the
// question on its own; opening "See all" is for checking the work, not for
// finding out what happened.
import { cleanTitle } from '@/lib/signalText';

export interface BundleRow {
  id: number;
  channel: string;
  category: string | null;
  score: number | null;
  title: string;
  url: string | null;
  created_at: string;
  published_at: string | null;
  name: string;
  slug: string;
}

export interface Bundle {
  kind: 'ads' | 'jobs' | 'news' | 'events' | 'pages' | 'single';
  rows: BundleRow[];
  headline: string;
  sub?: string;
  category: string;
  name: string;
  slug: string;
  score: number;
  when: string; // ISO — event date for dated bundles, observed date otherwise
}

const localDay = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const PLATFORM: [RegExp, string][] = [
  [/^LinkedIn ad/i, 'LinkedIn'],
  [/^Google ad|ads_google/i, 'Google'],
  [/^Meta ad/i, 'Meta'],
];

function platformOf(row: BundleRow): string {
  for (const [re, p] of PLATFORM) if (re.test(row.title)) return p;
  if (row.channel === 'ads_google') return 'Google';
  if (row.channel === 'ads_linkedin') return 'LinkedIn';
  if (row.channel === 'ads_meta') return 'Meta';
  return 'other';
}

// "LinkedIn ad (Video Ad) — X" → "Video Ad"
function formatOf(title: string): string | null {
  const m = title.match(/\(([^)]+)\)/);
  return m ? m[1] : null;
}

const STOP = new Set(['the', 'a', 'an', 'in', 'of', 'to', 'for', 'and', 'with', 'its', 'is', 'on', 'as', 'at', 'by', 'from']);
function sigWords(title: string): Set<string> {
  // strip the " - Outlet" suffix Google News appends before comparing
  const core = title.replace(/\s[-–]\s[^-–]+$/, '').toLowerCase();
  return new Set(core.split(/[^a-z0-9$€.]+/).filter((w) => w.length > 2 && !STOP.has(w)));
}

function overlap(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  for (const w of a) if (b.has(w)) inter++;
  return inter / Math.max(1, Math.min(a.size, b.size));
}

function outletOf(title: string): string | null {
  const m = title.match(/\s[-–]\s([^-–]+)$/);
  return m ? m[1].trim() : null;
}

const maxScore = (rows: BundleRow[]) => Math.max(...rows.map((r) => r.score ?? 0));

// A recap has to fit on two lines. Long webinar titles are trimmed at a word
// boundary rather than being allowed to eat the whole card.
const clip = (s: string, n: number) =>
  s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n) > n * 0.6 ? s.lastIndexOf(' ', n) : n).trimEnd() + '…';

const list = (xs: string[], max: number, each = 44) =>
  xs.slice(0, max).map((x) => clip(x, each)).join(' · ') + (xs.length > max ? ` +${xs.length - max} more` : '');

// "Job opening: Senior Enterprise Account Executive (Sales, Seattle)"
// The ATS boards give department and location in the parenthetical, which is
// the part that actually says something: three Sales roles in one city is a
// territory push, three Engineering roles is a build.
const SENIOR = /\b(senior|staff|principal|lead|head of|director|vp|chief|founding)\b/i;
function jobsRecap(group: BundleRow[]): string {
  const depts = new Map<string, number>();
  const places = new Set<string>();
  let senior = 0;
  for (const r of group) {
    const body = r.title.replace(/^Job (opening|posting):\s*/i, '');
    if (SENIOR.test(body)) senior++;
    const paren = body.match(/\(([^)]+)\)\s*$/)?.[1];
    if (!paren) continue;
    const [dept, ...rest] = paren.split(',').map((x) => x.trim());
    if (dept) depts.set(dept, (depts.get(dept) ?? 0) + 1);
    if (rest.length) places.add(rest.join(', '));
  }
  const bits: string[] = [];
  if (depts.size) {
    bits.push([...depts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([d, n]) => `${n} ${d}`).join(', '));
  } else {
    // No structured department (the parenthetical held only a location) — name
    // the roles instead, without the trailing "(The USA (Remote))".
    bits.push(list(group.map((r) => r.title.replace(/^Job (opening|posting):\s*/i, '').replace(/\s*\(.*\)\s*$/, '')), 3, 38));
  }
  if (places.size) bits.push(list([...places], 3));
  if (senior >= 2) bits.push(`${senior} senior+`);
  return bits.join(' · ');
}

// Hostnames that are never a buildout, whatever a row's stored status says.
// The classifier runs at collection time, so rows captured before a veto was
// added keep their old verdict — "www.kompyte.com" was still being rendered as
// "Kompyte looks to be building something new (www)". Deliberately a hard
// noise list and nothing more: "v2" and "beta" are arguable and stay.
const NEVER_BUILDOUT = /^(www\d*|ftp|webmail|cpanel|whm|autodiscover|autoconfig|mail|smtp|mx\d*|ns\d*)$/i;
function isNoiseSubdomain(title: string): boolean {
  const host = title.replace(/^Subdomain observed:\s*/i, '').trim();
  const labels = host.split('.');
  if (labels.length <= 2) return true; // the apex itself is not a discovery
  return NEVER_BUILDOUT.test(labels[0]);
}

// "New page published: modash.io/de/pricing" → "/de/pricing". Locale copies of
// the same page are one publication, not eight.
function pathOf(title: string): string {
  const body = title.replace(/^New page published:\s*/i, '');
  const slash = body.indexOf('/');
  return slash === -1 ? body : body.slice(slash);
}
const LOCALE = /^\/([a-z]{2}(-[a-z]{2})?)(?=\/)/i;
const deLocale = (p: string) => p.replace(LOCALE, '');

// Bundle a page of feed rows. Order of output follows the order bundles
// first appear in the input (which the caller already sorted).
export function bundleRows(input: BundleRow[]): Bundle[] {
  const out: Bundle[] = [];
  const used = new Set<number>();

  // Collector titles are the citation and stay in the database untouched; what
  // the feed renders is the readable form. Rows that clean to nothing were
  // never signals (an image filename, a bare date off a calendar widget).
  const rows: BundleRow[] = [];
  for (const r of input) {
    if (r.channel === 'subdomains' && isNoiseSubdomain(r.title)) continue;
    const clean = cleanTitle(r.channel, r.title);
    if (clean) rows.push(clean === r.title ? r : { ...r, title: clean });
  }

  // --- ads: one bundle per competitor per observed day ---
  const adGroups = new Map<string, BundleRow[]>();
  for (const r of rows) {
    if (!r.channel.startsWith('ads_')) continue;
    const key = `${r.slug}|${localDay(r.created_at)}`;
    if (!adGroups.has(key)) adGroups.set(key, []);
    adGroups.get(key)!.push(r);
  }
  const adBundleByRow = new Map<number, Bundle>();
  for (const group of adGroups.values()) {
    const byPlatform = new Map<string, number>();
    const byFormat = new Map<string, number>();
    for (const r of group) {
      byPlatform.set(platformOf(r), (byPlatform.get(platformOf(r)) ?? 0) + 1);
      const f = formatOf(r.title);
      if (f) byFormat.set(f, (byFormat.get(f) ?? 0) + 1);
    }
    const platforms = [...byPlatform.entries()].map(([p, n]) => `${n} ${p}`).join(' · ');
    const formats = [...byFormat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([f, n]) => `${n}× ${f.toLowerCase()}`).join(', ');
    // Google's transparency centre stamps each creative with a start date, so
    // we can say how long the campaign has been up rather than just how many
    // creatives there are. LinkedIn gives no such date; absent it, we say
    // nothing rather than guessing.
    const since = group
      .map((r) => r.title.match(/running since (\d{4}-\d{2}-\d{2})/)?.[1])
      .filter(Boolean)
      .sort() as string[];
    const oldest = since[0]
      ? `oldest live since ${new Date(since[0]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
      : null;
    const b: Bundle = {
      kind: 'ads',
      rows: group,
      headline: `${group[0].name}: ${group.length} new ad${group.length > 1 ? 's' : ''} observed`,
      sub: [platforms, formats, oldest].filter(Boolean).join(' · '),
      category: 'Ads',
      name: group[0].name,
      slug: group[0].slug,
      score: maxScore(group),
      when: group[0].created_at,
    };
    for (const r of group) adBundleByRow.set(r.id, b);
  }

  // --- jobs: one bundle per competitor per observed day (3+ roles) ---
  const jobGroups = new Map<string, BundleRow[]>();
  for (const r of rows) {
    if (r.channel !== 'jobs') continue;
    const key = `${r.slug}|${localDay(r.created_at)}`;
    if (!jobGroups.has(key)) jobGroups.set(key, []);
    jobGroups.get(key)!.push(r);
  }
  const jobBundleByRow = new Map<number, Bundle>();
  for (const group of jobGroups.values()) {
    if (group.length < 3) continue;
    const titles = jobsRecap(group);
    const b: Bundle = {
      kind: 'jobs',
      rows: group,
      headline: `${group[0].name}: ${group.length} open roles visible`,
      sub: titles,
      category: 'Hiring',
      name: group[0].name,
      slug: group[0].slug,
      score: maxScore(group),
      when: group[0].created_at,
    };
    for (const r of group) jobBundleByRow.set(r.id, b);
  }

  // --- events: one bundle per competitor per observed day, and the recap
  //     NAMES the webinars. A card reading "4 events staged" with the titles
  //     hidden behind a disclosure is the exact thing we are trying not to be.
  const evGroups = new Map<string, BundleRow[]>();
  for (const r of rows) {
    if (r.channel !== 'events') continue;
    const key = `${r.slug}|${localDay(r.created_at)}`;
    if (!evGroups.has(key)) evGroups.set(key, []);
    evGroups.get(key)!.push(r);
  }
  const evBundleByRow = new Map<number, Bundle>();
  for (const group of evGroups.values()) {
    if (group.length < 2) continue;
    const names = group.map((r) => r.title.replace(/^Event\/webinar:\s*/i, ''));
    const b: Bundle = {
      kind: 'events',
      rows: group,
      headline: `${group[0].name}: ${group.length} events & webinars staged`,
      sub: list(names, 3, 38),
      category: 'Events',
      name: group[0].name,
      slug: group[0].slug,
      score: maxScore(group),
      when: group[0].created_at,
    };
    for (const r of group) evBundleByRow.set(r.id, b);
  }

  // --- pages: sitemap publications, with locale copies collapsed. Eight
  //     translations of one pricing page is one publication. ---
  const pgGroups = new Map<string, BundleRow[]>();
  for (const r of rows) {
    if (r.channel !== 'sitemap') continue;
    const key = `${r.slug}|${localDay(r.created_at)}`;
    if (!pgGroups.has(key)) pgGroups.set(key, []);
    pgGroups.get(key)!.push(r);
  }
  const pgBundleByRow = new Map<number, Bundle>();
  for (const group of pgGroups.values()) {
    if (group.length < 2) continue;
    const paths = [...new Set(group.map((r) => deLocale(pathOf(r.title))))].filter(Boolean);
    const locales = group.length - paths.length;
    // Programmatic SEO: dozens of pages under one directory, generated from a
    // list. Listing three of them says nothing — naming the pattern does.
    const dirs = new Map<string, number>();
    for (const p of paths) {
      const dir = p.split('/').slice(0, 2).join('/') || '/';
      dirs.set(dir, (dirs.get(dir) ?? 0) + 1);
    }
    const [topDir, topN] = [...dirs.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['', 0];
    const pseo = topN >= 10 && topN / paths.length >= 0.6;
    const b: Bundle = {
      kind: 'pages',
      rows: group,
      headline: pseo
        ? `${group[0].name} pushed ${paths.length} pages into ${topDir}/ — a programmatic SEO build`
        : `${group[0].name} published ${paths.length} new page${paths.length === 1 ? '' : 's'}`,
      sub: pseo
        ? [`${topN} under ${topDir}/, templated from a list`, `e.g. ${clip(paths[0], 46)}`, locales > 0 ? `+${locales} locale copies` : null].filter(Boolean).join(' · ')
        : [list(paths, 3, 40), locales > 0 ? `+${locales} locale copies` : null].filter(Boolean).join(' · '),
      category: 'Product',
      name: group[0].name,
      slug: group[0].slug,
      score: maxScore(group),
      when: group[0].created_at,
    };
    for (const r of group) pgBundleByRow.set(r.id, b);
  }

  // --- news: cluster near-duplicate stories per competitor (one story, N outlets) ---
  const newsByComp = new Map<string, BundleRow[]>();
  for (const r of rows) {
    if (r.channel !== 'news') continue;
    if (!newsByComp.has(r.slug)) newsByComp.set(r.slug, []);
    newsByComp.get(r.slug)!.push(r);
  }
  const newsBundleByRow = new Map<number, Bundle>();
  for (const list of newsByComp.values()) {
    const clusters: BundleRow[][] = [];
    for (const r of list) {
      const sig = sigWords(r.title);
      let placed = false;
      for (const cl of clusters) {
        const seedSig = sigWords(cl[0].title);
        const dtDays = Math.abs(new Date(r.published_at ?? r.created_at).getTime() - new Date(cl[0].published_at ?? cl[0].created_at).getTime()) / 86400000;
        if (dtDays <= 14 && overlap(sig, seedSig) >= 0.5) {
          cl.push(r);
          placed = true;
          break;
        }
      }
      if (!placed) clusters.push([r]);
    }
    for (const cl of clusters) {
      if (cl.length < 2) continue;
      // shortest core title reads cleanest as the canonical headline
      const core = [...cl].sort((a, b) => a.title.length - b.title.length)[0];
      const outlets = [...new Set(cl.map((r) => outletOf(r.title)).filter(Boolean))] as string[];
      const b: Bundle = {
        kind: 'news',
        rows: cl,
        headline: `${core.title.replace(/\s[-–]\s[^-–]+$/, '')} — covered by ${cl.length} outlets`,
        sub: outlets.slice(0, 5).join(' · '),
        category: 'News',
        name: core.name,
        slug: core.slug,
        score: maxScore(cl),
        when: core.published_at ?? core.created_at,
      };
      for (const r of cl) newsBundleByRow.set(r.id, b);
    }
  }

  // --- assemble in input order ---
  for (const r of rows) {
    if (used.has(r.id)) continue;
    const b =
      adBundleByRow.get(r.id) ??
      jobBundleByRow.get(r.id) ??
      evBundleByRow.get(r.id) ??
      pgBundleByRow.get(r.id) ??
      newsBundleByRow.get(r.id);
    if (b) {
      for (const m of b.rows) used.add(m.id);
      out.push(b);
    } else {
      used.add(r.id);
      out.push({
        kind: 'single',
        rows: [r],
        headline: r.title,
        category: r.category ?? r.channel,
        name: r.name,
        slug: r.slug,
        score: r.score ?? 0,
        when: r.published_at ?? r.created_at,
      });
    }
  }
  return out;
}
