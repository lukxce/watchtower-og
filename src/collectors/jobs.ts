// Jobs (spec §4.4): careers-page ATS-link scan (verified), then name-verified
// slug probing (Greenhouse/Workable only — Lever/Ashby expose no company name,
// never slug-guess them). ATS infra path segments are never board tokens.
import { smartFetch } from '@/lib/fetchLadder';
import { ingestItems, recordRun, getSource, setSource, jsonFetch, type Competitor } from '@/db/queries';

type AtsKind = 'greenhouse' | 'lever' | 'ashby' | 'workable';
interface Ats {
  kind: AtsKind;
  slug: string;
}

const ATS_LINK = /(?:boards\.greenhouse\.io|job-boards\.greenhouse\.io|jobs\.lever\.co|jobs\.ashbyhq\.com|apply\.workable\.com)\/(?:embed\/job_board\?for=)?([A-Za-z0-9_-]+)/g;
const ATS_STOPWORDS = new Set(['embed', 'job_board', 'jobs', 'js', 'v1', 'boards', 'api', 'widget']);

function kindOf(url: string): AtsKind | null {
  if (url.includes('greenhouse.io')) return 'greenhouse';
  if (url.includes('lever.co')) return 'lever';
  if (url.includes('ashbyhq.com')) return 'ashby';
  if (url.includes('workable.com')) return 'workable';
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
  const r = (await jsonFetch(`https://apply.workable.com/api/v1/widget/accounts/${ats.slug}?details=false`)) as {
    jobs?: { shortcode: string; title: string; url?: string; department?: string; location?: { city?: string } }[];
  } | null;
  if (!r?.jobs) return null;
  return r.jobs.map((j) => ({ id: j.shortcode, title: j.title, url: j.url, meta: [j.department, j.location?.city].filter(Boolean).join(', ') }));
}

async function probeAts(comp: Competitor): Promise<Ats | null> {
  for (const path of ['/careers', '/jobs', '/company/careers', '/about/careers']) {
    const res = await smartFetch(`https://${comp.domain}${path}`);
    if (res.status !== 200) continue;
    for (const m of res.html.matchAll(ATS_LINK)) {
      const kind = kindOf(m[0]);
      if (kind && m[1] && !ATS_STOPWORDS.has(m[1].toLowerCase())) {
        const jobs = await fetchJobs({ kind, slug: m[1] });
        if (jobs !== null) return { kind, slug: m[1] };
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
  const candidates = [...new Set([comp.slug, comp.name.toLowerCase().replace(/[^a-z0-9]/g, ''), comp.domain.replace(/^www\./, '').split('.')[0]])];
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
