// Funding & M&A — without Crunchbase.
//
// Crunchbase's API is not on any published plan: Pro ($49/mo) is search and
// export only, Business ($199/mo) still is not the API, and API access needs
// an Enterprise or Applications licence that is quote-only. Embedding their
// data in a product we SELL falls under Data Licensing, which is a separate
// and more expensive contract again. For a channel whose question is "did they
// just raise?", that is an absurd price.
//
// Two free sources answer that question, and one of them answers it earlier:
//
//   1. SEC EDGAR Form D — a US company filing a private placement must do so
//      within 15 days of the first sale. That can land BEFORE the press
//      release, which Crunchbase cannot do. Free, authoritative, no key.
//
//   2. Google News RSS with funding language — announced rounds are always
//      press-released, because announcing is the entire point. Already wired,
//      keyless.
//
// What we give up is structured history: full round lists, investor names,
// valuations as data rather than prose. Crunchbase is a database; this is an
// event stream. A briefing needs the event.
//
// Both sources need entity disambiguation. EDGAR full-text search matches the
// term anywhere in a filing, so "Gong" returns China Jo-Jo Drugstores; news
// returns "Gong cha acquired by Bain Capital", a bubble tea chain. Neither is
// filtered by default and both would be false fires.
import { ingestItems, recordRun, type Competitor } from '@/db/queries';
import { fetchGoogleNewsRss } from '@/lib/googleNews';

// The SEC asks for a descriptive User-Agent identifying the requester.
const SEC_UA = 'Watchtower competitive-intelligence (contact via watchtower-og.vercel.app)';

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

/**
 * Does an EDGAR filer name refer to this competitor?
 *
 * EXACT match after stripping corporate suffixes, and nothing looser. A
 * prefix match let through every one of these for "Crayon": Crayon Software
 * Experts LLC (a Norwegian IT reseller), Bold Crayon Corp, Crayon Interface
 * Inc — none of them the competitor. A shared first word is not an identity.
 *
 * This still cannot separate two companies with genuinely identical names, so
 * the signal title always prints the filer verbatim and the reader can judge.
 * That is the honest limit of what EDGAR alone supports.
 */
const SUFFIX = /(incorporated|inc|llc|ltd|limited|corp(oration)?|company|co|plc|gmbh|holdings?|group|labs?|technologies|technology|software|systems)$/;
function filerMatches(filer: string, comp: Competitor): boolean {
  let f = norm(filer);
  const n = norm(comp.name);
  if (n.length < 3) return false;
  for (let i = 0; i < 3; i++) f = f.replace(SUFFIX, ''); // "gongioltd" -> "gongio"
  return f === n;
}

interface Filing {
  title: string;
  url: string;
  date: string;
}

async function edgarFormD(comp: Competitor): Promise<Filing[]> {
  const url = `https://efts.sec.gov/LATEST/search-index?q=%22${encodeURIComponent(comp.name)}%22&forms=D`;
  let json: unknown;
  try {
    const res = await fetch(url, { headers: { 'user-agent': SEC_UA, accept: 'application/json' } });
    if (!res.ok) return [];
    json = await res.json();
  } catch {
    return [];
  }
  const hits =
    (json as { hits?: { hits?: { _id?: string; _source?: { display_names?: string[]; file_date?: string } }[] } })
      ?.hits?.hits ?? [];

  const out: Filing[] = [];
  for (const h of hits) {
    const display = h._source?.display_names?.[0] ?? '';
    const filer = display.replace(/\s*\(CIK\s*\d+\)\s*$/i, '').trim();
    if (!filerMatches(filer, comp)) continue; // a term match is not an entity match
    const date = h._source?.file_date;
    const id = h._id ?? '';
    const cik = display.match(/CIK\s*(\d+)/i)?.[1];
    const accession = id.split(':')[0];
    if (!date || !cik || !accession) continue;
    out.push({
      title: `Form D filed with the SEC on ${date} — ${filer} registered a private securities offering`,
      url: `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${accession.replace(/-/g, '')}/`,
      date,
    });
  }
  return out;
}

// Words that make a headline about money rather than merely mentioning it.
const MONEY = /\b(raise[sd]?|raising|funding|funded|round|series\s+[a-f]\b|seed|pre-seed|valuation|valued at|acquires?|acquired|acquisition|merger|ipo|investment|invests?|backs?|led by)\b/i;

/**
 * Is this headline confidently about OUR competitor, or could it be another
 * company of the same name?
 *
 * "Crayon" is the hard case and it is worth stating plainly: crayon.co is a
 * competitive-intelligence company; Crayon Group is a Norwegian IT reseller
 * that SoftwareOne bought for $1.4bn. Both produce funding headlines reading
 * "…Crayon…". No amount of regex separates them, because the headline simply
 * does not say which Crayon it means.
 *
 * So instead of guessing, ambiguous items are HELD and counted. A funding card
 * attributed to the wrong company is the worst kind of false fire — specific,
 * confident and wrong — and "we found 6 we could not attribute" is a true
 * statement we are allowed to make.
 */
function confidence(title: string, comp: Competitor): 'confident' | 'ambiguous' {
  const name = comp.name;
  const esc = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Followed by another word that is not one of its own legal suffixes:
  // "Crayon Group", "Crayon Data", "Crayon-Data", "Gong cha".
  const compound = new RegExp(`\\b${esc}[\\s-]+([A-Za-z][a-z]+)\\b`);
  const m = title.match(compound);
  if (m && !/^(inc|ltd|llc|corp|co|software|technologies|ai|labs?|has|is|to|in|for|the|and|announces?|raises?|closes?|doubles?|acquires?|adds?|hits?|launches?|expands?|names?|appoints?|reports?|sees?|plans?|says?|posts?|revenue)$/i.test(m[1])) {
    return 'ambiguous';
  }

  // Someone else is doing the acquiring: "SoftwareOne to acquire Crayon in
  // $1.4 billion merger". Genuinely important IF it is our competitor — and
  // unverifiable from the headline when the name is shared.
  const acquiredBy = new RegExp(`\\b([A-Z][A-Za-z]+)\\s+(?:to\\s+)?(?:acquires?|acquired|buys?|bought)\\s+${esc}\\b`);
  const a = title.match(acquiredBy);
  if (a && norm(a[1]) !== norm(name)) return 'ambiguous';

  // The passive form the first pass missed: "SoftwareOne completes mega
  // billion-dollar acquisition OF Crayon", "merger with Crayon".
  const passive = new RegExp(`\\b([A-Z][A-Za-z]+)\\b[^.]*\\b(?:acquisition|merger|takeover|buyout)\\s+(?:of|with)\\s+${esc}\\b`);
  const p2 = title.match(passive);
  if (p2 && norm(p2[1]) !== norm(name)) return 'ambiguous';

  return 'confident';
}

async function fundingNews(comp: Competitor): Promise<{ confident: Filing[]; ambiguous: Filing[] }> {
  const items = await fetchGoogleNewsRss(
    `"${comp.name}" (raises OR funding OR "Series A" OR "Series B" OR "Series C" OR acquired OR acquisition OR valuation)`,
    15,
  );
  const domainWord = comp.domain.replace(/^www\./, '').split('.')[0].toLowerCase();
  const confident: Filing[] = [];
  const ambiguous: Filing[] = [];
  for (const i of items) {
    if (!MONEY.test(i.title)) continue; // a money event, not a passing mention
    const hay = `${i.title} ${i.url}`.toLowerCase();
    if (!hay.includes(comp.name.toLowerCase()) && !hay.includes(domainWord)) continue;
    const f = { title: i.title, url: i.url, date: i.publishedAt ?? '' };
    (confidence(i.title, comp) === 'confident' ? confident : ambiguous).push(f);
  }
  return { confident, ambiguous };
}

export async function collectFunding(comp: Competitor): Promise<string> {
  const [filings, news] = await Promise.all([edgarFormD(comp), fundingNews(comp)]);

  const items = [
    ...filings.map((f) => ({ externalId: `formd:${f.url}`, title: f.title, url: f.url, publishedAt: f.date })),
    ...news.confident.map((n) => ({
      externalId: `fundnews:${n.url}`,
      title: n.title,
      url: n.url,
      publishedAt: n.date || undefined,
    })),
  ];

  const { added, fresh } = await ingestItems(comp.id, 'funding', items);
  const held = news.ambiguous.length;
  const note =
    `${filings.length} SEC Form D · ${news.confident.length} news` +
    (held ? ` · ${held} held (name shared with another company)` : '');
  await recordRun(comp.id, 'funding', true, added, note);
  return items.length === 0 ? `no funding events (${note})` : `+${added} (${fresh} pending) — ${note}`;
}
