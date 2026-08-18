// Jobs (spec §4.4): careers-page ATS-link scan (verified), then name-verified
// slug probing (Greenhouse/Workable only — Lever/Ashby expose no company name,
// never slug-guess them). ATS infra path segments are never board tokens.
import { smartFetch } from '@/lib/fetchLadder';
import { ingestItems, recordRun, getSource, setSource, jsonFetch, type Competitor } from '@/db/queries';

type AtsKind = 'greenhouse' | 'lever' | 'ashby' | 'workable' | 'smartrecruiters' | 'breezy';
interface Ats {
  kind: AtsKind;
  slug: string;
}

const ATS_LINK =
  /(?:boards\.greenhouse\.io|job-boards\.greenhouse\.io|jobs\.lever\.co|jobs\.ashbyhq\.com|apply\.workable\.com|jobs\.smartrecruiters\.com|careers\.smartrecruiters\.com)\/(?:embed\/job_board\?for=)?([A-Za-z0-9_-]+)|([A-Za-z0-9_-]+)\.breezy\.hr/g;
const ATS_STOPWORDS = new Set(['embed', 'job_board', 'jobs', 'js', 'v1', 'boards', 'api', 'widget']);

function kindOf(url: string): AtsKind | null {
  if (url.includes('greenhouse.io')) return 'greenhouse';
  if (url.includes('lever.co')) return 'lever';
  if (url.includes('ashbyhq.com')) return 'ashby';
  if (url.includes('workable.com')) return 'workable';
  if (url.includes('smartrecruiters.com')) return 'smartrecruiters';
  if (url.includes('breezy.hr')) return 'breezy';
  return null;
}

const similar = (a: string, b: string) => {
  const na = a.toLowerCase().replace(/[^a-z0-9]/g, '');
  const nb = b.toLowerCase().replace(/[^a-z0-9]/g, '');
  return na.includes(nb) || nb.includes(na);
};

interface JobItem {
  id: string;
  title: string;
  url?: string;
  meta?: string;
}

async function fetchJobs(ats: Ats): Promise<JobItem[] | null> {
  if (ats.kind === 'greenhouse') {
    const r = (await jsonFetch(`https://boards-api.greenhouse.io/v1/boards/${ats.slug}/jobs`)) as {
      jobs?: { id: number; title: string; absolute_url?: string; location?: { name?: string } }[];
    } | null;
    if (!r?.jobs) return null;
    return r.jobs.map((j) => ({ id: String(j.id), title: j.title, url: j.absolute_url, meta: j.location?.name }));
  }
  if (ats.kind === 'lever') {
    const r = (await jsonFetch(`https://api.lever.co/v0/postings/${ats.slug}?mode=json`)) as
      | { id: string; text: string; hostedUrl?: string; categories?: { team?: string; location?: string } }[]
      | null;
    if (!Array.isArray(r)) return null;
    return r.map((j) => ({ id: j.id, title: j.text, url: j.hostedUrl, meta: [j.categories?.team, j.categories?.location].filter(Boolean).join(', ') }));
  }
  if (ats.kind === 'ashby') {
    const r = (await jsonFetch(`https://api.ashbyhq.com/posting-api/job-board/${ats.slug}`)) as {
      jobs?: { id: string; title: string; jobUrl?: string; location?: string; department?: string }[];
    } | null;
    if (!r?.jobs) return null;
    return r.jobs.map((j) => ({ id: j.id, title: j.title, url: j.jobUrl, meta: [j.department, j.location].filter(Boolean).join(', ') }));
  }
  if (ats.kind === 'smartrecruiters') {
    // Public postings API, no key. Verified live: 241ms. Note the slug is
    // CASE-SENSITIVE — "Visa" returns postings, "visa" returns zero — so a
    // zero count here is not proof the company isn't on SmartRecruiters.
    const r = (await jsonFetch(`https://api.smartrecruiters.com/v1/companies/${ats.slug}/postings`)) as {
      totalFound?: number;
      content?: {
        id: string;
        name: string;
        department?: { label?: string };
        function?: { label?: string };
        location?: { fullLocation?: string; city?: string; remote?: boolean };
      }[];
    } | null;
    if (!r?.content) return null;
    return r.content.map((j) => ({
      id: j.id,
      title: j.name,
      // `ref` on the payload is the API URL, not a page a human can open.
      url: `https://jobs.smartrecruiters.com/${ats.slug}/${j.id}`,
      meta: [j.function?.label ?? j.department?.label, j.location?.remote ? 'Remote' : j.location?.fullLocation ?? j.location?.city]
        .filter(Boolean)
        .join(', '),
    }));
  }
  if (ats.kind === 'breezy') {
    // Verified live: 327ms, returns a bare array and a public url per posting.
    const r = (await jsonFetch(`https://${ats.slug}.breezy.hr/json`)) as
      | { id: string; name: string; url?: string; department?: string; location?: { name?: string; city?: string; is_remote?: boolean } }[]
      | null;
    if (!Array.isArray(r)) return null;
    return r.map((j) => ({
      id: j.id,
      title: j.name,
      url: j.url,
      meta: [j.department, j.location?.is_remote ? 'Remote' : j.location?.name ?? j.location?.city].filter(Boolean).join(', '),
    }));
  }
  const r = (await jsonFetch(`https://apply.workable.com/api/v1/widget/accounts/${ats.slug}?details=false`)) as {
    jobs?: { shortcode: string; title: string; url?: string; department?: string; location?: { city?: string } }[];
  } | null;
  if (!r?.jobs) return null;
  return r.jobs.map((j) => ({ id: j.shortcode, title: j.title, url: j.url, meta: [j.department, j.location?.city].filter(Boolean).join(', ') }));
}

// Careers pages are not reliably at /careers — but they are almost always
// linked from the homepage, usually in the footer. Harvest those links and try
// them alongside the guessed paths.
const CAREERISH = /(careers?|jobs|join-?us|work-with-us|we-?are-?hiring|hiring|life-at|opportunities)/i;

async function careersPaths(comp: Competitor): Promise<string[]> {
  const guesses = ['/careers', '/jobs', '/company/careers', '/about/careers', '/join-us', '/company/jobs'];
  const home = await smartFetch(`https://${comp.domain}/`);
  if (home.status !== 200) return guesses;
  const bare = comp.domain.replace(/^www\./, '');
  const found: string[] = [];
  for (const m of home.html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (!CAREERISH.test(href)) continue;
    try {
      const u = new URL(href, `https://${comp.domain}`);
      if (!u.hostname.endsWith(bare)) continue; // off-site links are handled by ATS_LINK
      if (u.pathname.length > 1 && !found.includes(u.pathname)) found.push(u.pathname);
    } catch {
      /* malformed href */
    }
  }
  return [...new Set([...found.slice(0, 4), ...guesses])];
}

async function probeAts(comp: Competitor): Promise<Ats | null> {
  for (const path of await careersPaths(comp)) {
    const res = await smartFetch(`https://${comp.domain}${path}`);
    if (res.status !== 200) continue;
    for (const m of res.html.matchAll(ATS_LINK)) {
      const kind = kindOf(m[0]);
      // Group 1 is the path-style slug (…greenhouse.io/SLUG); group 2 is the
      // subdomain style (SLUG.breezy.hr). Exactly one of them is set.
      const slug = m[1] ?? m[2];
      if (kind && slug && !ATS_STOPWORDS.has(slug.toLowerCase())) {
        const jobs = await fetchJobs({ kind, slug });
        if (jobs !== null && jobs.length > 0) return { kind, slug };
      }
    }
    const forMatch = res.html.match(/greenhouse\.io\/embed\/job_board\?for=([A-Za-z0-9_-]+)/i);
    if (forMatch && !ATS_STOPWORDS.has(forMatch[1].toLowerCase())) {
      const jobs = await fetchJobs({ kind: 'greenhouse', slug: forMatch[1] });
      if (jobs !== null) return { kind: 'greenhouse', slug: forMatch[1] };
    }
  }
  // Name-verified slug probing. Crucially this picks the board with the most
  // OPEN ROLES rather than the first name match: Crayon has a stale, empty
  // Greenhouse board called "Crayon" and a live Workable board with real
  // openings, and because Greenhouse was probed first the empty one won and
  // was then cached forever — the competitor showed "0 open" while their
  // careers page listed three. An empty board that merely shares a name
  // should never beat a populated one.
  // SmartRecruiters slugs are CASE-SENSITIVE ("Visa" works, "visa" returns 0),
  // so the competitor's own capitalisation is a candidate in its own right.
  const candidates = [...new Set([
    comp.slug,
    comp.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    comp.name.replace(/[^A-Za-z0-9]/g, ''),
    comp.domain.replace(/^www\./, '').split('.')[0],
  ])];
  let best: { ats: Ats; count: number } | null = null;
  for (const slug of candidates) {
    const gh = (await jsonFetch(`https://boards-api.greenhouse.io/v1/boards/${slug}`)) as { name?: string } | null;
    if (gh?.name && similar(gh.name, comp.name)) {
      const jobs = await fetchJobs({ kind: 'greenhouse', slug });
      if (jobs && (!best || jobs.length > best.count)) best = { ats: { kind: 'greenhouse', slug }, count: jobs.length };
    }
    const wk = (await jsonFetch(`https://apply.workable.com/api/v1/widget/accounts/${slug}`)) as { name?: string } | null;
    if (wk?.name && similar(wk.name, comp.name)) {
      const jobs = await fetchJobs({ kind: 'workable', slug });
      if (jobs && (!best || jobs.length > best.count)) best = { ats: { kind: 'workable', slug }, count: jobs.length };
    }
    // SmartRecruiters and Breezy both echo the company name in their payload,
    // so they can be name-verified the same way. Without these two the probe
    // missed real boards: gong.io has 9 open roles on SmartRecruiters and was
    // being reported as having no board at all.
    const sr = (await jsonFetch(`https://api.smartrecruiters.com/v1/companies/${slug}/postings`)) as
      | { totalFound?: number; content?: { company?: { name?: string } }[] }
      | null;
    const srName = sr?.content?.[0]?.company?.name;
    if (srName && similar(srName, comp.name)) {
      const jobs = await fetchJobs({ kind: 'smartrecruiters', slug });
      if (jobs && (!best || jobs.length > best.count)) best = { ats: { kind: 'smartrecruiters', slug }, count: jobs.length };
    }
    const bz = (await jsonFetch(`https://${slug}.breezy.hr/json`)) as { company?: { name?: string } }[] | null;
    const bzName = Array.isArray(bz) ? bz[0]?.company?.name : undefined;
    if (bzName && similar(bzName, comp.name)) {
      const jobs = await fetchJobs({ kind: 'breezy', slug });
      if (jobs && (!best || jobs.length > best.count)) best = { ats: { kind: 'breezy', slug }, count: jobs.length };
    }
  }
  // Lever and Ashby return no company name, so they cannot be fuzzy-matched —
  // which is why the original probe skipped them entirely. But an EXACT match
  // on the domain label is strong evidence on its own (klue.com -> "klue"),
  // and requiring a non-empty board removes the remaining risk. Without this,
  // Klue's 10 open roles on Ashby were invisible and the competitor showed 0.
  const exact = comp.domain.replace(/^www\./, '').split('.')[0];
  for (const kind of ['ashby', 'lever'] as const) {
    const jobs = await fetchJobs({ kind, slug: exact });
    if (jobs && jobs.length > 0 && (!best || jobs.length > best.count)) {
      best = { ats: { kind, slug: exact }, count: jobs.length };
    }
  }

  if (best) return best.ats;
  return null;
}

export async function collectJobs(comp: Competitor): Promise<string> {
  const stored = await getSource(comp.id, 'jobs', 'ats');
  if (stored === 'none') return 'skipped (no ATS found at setup)';
  let ats: Ats | null = stored ? (JSON.parse(stored) as Ats) : null;
  if (!ats) {
    ats = await probeAts(comp);
    await setSource(comp.id, 'jobs', 'ats', ats ? JSON.stringify(ats) : 'none');
    if (!ats) {
      await recordRun(comp.id, 'jobs', false, 0, 'no ATS board found');
      return 'no ATS board found';
    }
  }
  const jobs = await fetchJobs(ats);
  if (jobs === null) {
    await recordRun(comp.id, 'jobs', false, 0, `${ats.kind}/${ats.slug} fetch failed`);
    return `FAILED (${ats.kind}/${ats.slug})`;
  }
  const { added, fresh } = await ingestItems(
    comp.id,
    'jobs',
    jobs.map((j) => ({
      externalId: `${ats.kind}:${j.id}`,
      title: `Job opening: ${j.title}${j.meta ? ` (${j.meta})` : ''}`,
      url: j.url,
      payload: { ats: ats.kind },
    })),
  );
  await recordRun(comp.id, 'jobs', true, added, `${ats.kind}/${ats.slug}, ${jobs.length} open roles`);
  return `+${added} (${fresh} pending) — ${jobs.length} open`;
}
