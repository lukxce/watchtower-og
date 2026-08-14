// Signal bundling — 10 ads observed on the same day is ONE thing that
// happened, not ten cards; the same funding story covered by five outlets is
// ONE story with five citations, not five signals. Bundles are computed at
// read time from the same rows the feed already fetches — nothing is thrown
// away, the members stay listed inside the bundle.
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
  kind: 'ads' | 'jobs' | 'news' | 'single';
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

// Bundle a page of feed rows. Order of output follows the order bundles
// first appear in the input (which the caller already sorted).
export function bundleRows(rows: BundleRow[]): Bundle[] {
  const out: Bundle[] = [];
  const used = new Set<number>();

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
    const b: Bundle = {
      kind: 'ads',
      rows: group,
      headline: `${group[0].name}: ${group.length} new ad${group.length > 1 ? 's' : ''} observed`,
      sub: `${platforms}${formats ? ` — ${formats}` : ''}`,
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
    const titles = group.slice(0, 3).map((r) => r.title.replace(/^Job posting:\s*/i, '')).join(' · ');
    const b: Bundle = {
      kind: 'jobs',
      rows: group,
      headline: `${group[0].name}: ${group.length} open roles visible`,
      sub: `${titles}${group.length > 3 ? ` +${group.length - 3} more` : ''}`,
      category: 'Hiring',
      name: group[0].name,
      slug: group[0].slug,
      score: maxScore(group),
      when: group[0].created_at,
    };
    for (const r of group) jobBundleByRow.set(r.id, b);
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
    const b = adBundleByRow.get(r.id) ?? jobBundleByRow.get(r.id) ?? newsBundleByRow.get(r.id);
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
