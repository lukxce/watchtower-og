// Historical backfill — real, dated, sourced events researched from public
// record (funding, executive moves, partnerships, launches, major press) for
// each tracked competitor, spanning back to Oct 2024. This is NOT synthetic
// data: every title/date/URL below was found by a live web-research pass and
// is traceable to a real article. Run: ORG_ID=<org> npm run backfill
//
// What this deliberately does NOT do: fabricate a smooth historical
// Threat-Index trend line. Reconstructing per-dimension scores at past dates
// would require either real historical snapshots of ads/jobs/subdomains we
// never captured, or inventing numbers — the second violates the product's
// own "no false fires" rule. So this backfill adds real history to the news
// channel (which Radar and the feed both read), and leaves the Threat Index
// trend to accumulate honestly from here.
import { getDb } from '../src/db/client';
import { ingestItems, recordRun } from '../src/db/queries';
import { scoreUnscored } from '../src/lib/score';

const ORG_ID = process.env.ORG_ID ?? 'dev-workspace';

interface Event {
  title: string;
  url: string;
  date: string; // ISO date
  category: 'funding' | 'product_launch' | 'executive_move' | 'partnership' | 'major_press' | 'pricing_change' | 'acquisition';
}

const EVENTS: Record<string, Event[]> = {
  upfluence: [
    {
      title: 'Co-CEO Vivien Garnès: "the revenue era has arrived" — AI co-pilot Jaice, plans for a programmatic ad product and an agent-based creator negotiation system later in 2026',
      url: 'https://www.netinfluencer.com/upfluence-co-ceo-says-influencer-marketing-revenue-era-has-arrived/',
      date: '2026-05-04',
      category: 'major_press',
    },
    {
      title: 'Upfluence publishes Q1 2026 Creator Intelligence report: 47,515 creator applications analyzed across 730 brands',
      url: 'https://data.upfluence.com/',
      date: '2026-04-15',
      category: 'major_press',
    },
  ],
  creatoriq: [
    {
      title: 'Senthil Kumaran (formerly CTO at Digital Turbine, prior Meta Reality Labs) appointed CreatorIQ Chief Technology Officer',
      url: 'https://www.creatoriq.com/press/releases/creatoriq-appoints-senthil-kumaran-chief-technology-officer',
      date: '2026-03-23',
      category: 'executive_move',
    },
    {
      title: 'Sprinklr and CreatorIQ announce strategic partnership feeding the Creator Graph into Sprinklr’s enterprise social reporting',
      url: 'https://www.businesswire.com/news/home/20260331523647/en/Sprinklr-and-CreatorIQ-Announce-Strategic-Partnership-to-Unify-Creator-Organic-and-Paid-Social-Media',
      date: '2026-03-31',
      category: 'partnership',
    },
    {
      title: 'CreativeX and CreatorIQ launch an industry-first integration applying AI brand-suitability scoring to creator content, with Nestlé as lead adopter',
      url: 'https://www.creatoriq.com/press/releases/creativex-creatoriq-nestle-integration-unifies-creator-and-paid-media-ecosystems',
      date: '2026-04-30',
      category: 'partnership',
    },
    {
      title: 'Dentsu and CreatorIQ announce a partnership integrating dentsu.Audiences with CreatorIQ’s creator-selection platform',
      url: 'https://www.businesswire.com/news/home/20260624108480/en/Dentsu-and-CreatorIQ-Announce-Partnership-to-Close-Gap-Between-Media-Audience-Targeting-and-Creator-Selection',
      date: '2026-06-24',
      category: 'partnership',
    },
    {
      title: 'CreatorIQ report finds creator content is now 44% of paid-media creative on average; creator ad spend hit $37B in 2025',
      url: 'https://www.businesswire.com/news/home/20260610300574/en/Creator-Content-Now-Powers-44-of-Paid-Media-Creative-as-the-Traditional-Marketing-Funnel-Compresses-CreatorIQ-Report-Finds',
      date: '2026-06-10',
      category: 'major_press',
    },
    {
      title: 'CreatorIQ data shows #FIFA World Cup creator content generated roughly $2B in estimated media value',
      url: 'https://www.forbes.com/sites/ianshepherd/2026/07/16/the-creators-who-are-quietly-running-the-2026-world-cup/',
      date: '2026-07-16',
      category: 'major_press',
    },
    {
      title: 'CreatorIQ study finds a growing "authenticity gap": reach still predicts creator pay more than engagement',
      url: 'https://www.businesswire.com/news/home/20260811188612/en/CreatorIQ-Study-Reveals-a-Growing-Authenticity-Gap-Brands-Value-Engagement-but-the-Market-Still-Rewards-Reach',
      date: '2026-08-11',
      category: 'major_press',
    },
  ],
  grin: [
    {
      title: 'GRIN opens instant self-serve access with a 30-day free trial and month-to-month billing, ending its enterprise-only sales model',
      url: 'https://www.businesswire.com/news/home/20260127539452/en/GRIN-Opens-Instant-Self-Serve-Access-to-Its-Creator-Marketing-Platform',
      date: '2026-01-27',
      category: 'pricing_change',
    },
  ],
  modash: [
    {
      title: 'Modash raises a $12M Series A led by henQ, with Change Ventures participating',
      url: 'https://techcrunch.com/2024/10/30/modash-is-flipping-the-influencer-marketing-script-by-connecting-brands-with-the-long-tail-of-creators/',
      date: '2024-10-30',
      category: 'funding',
    },
    {
      title: 'Modash acquires Promoty, an Estonian creator-relationship-management startup, expanding into creator CRM/workflow tools for Shopify brands',
      url: 'https://www.finsmes.com/2025/01/modash-acquires-promoty.html',
      date: '2025-01-21',
      category: 'acquisition',
    },
  ],
  thecirqle: [
    {
      title: 'Ernst Rustenhoven (formerly of Slingshot Ventures) joins The Cirqle as Chief Strategy Officer',
      url: 'https://www.netinfluencer.com/ernst-rustenhoven-joins-the-cirqle-as-cso-betting-creator-marketings-defining-moment-has-arrived/',
      date: '2026-04-02',
      category: 'executive_move',
    },
    {
      title: 'The Cirqle launches an MCP integration letting brands run creator-marketing workflows via natural-language prompts in Claude, ChatGPT, Gemini, or Copilot',
      url: 'https://thecirqle.com/blog-post/the-cirqle-now-agentic',
      date: '2026-05-27',
      category: 'product_launch',
    },
    {
      title: 'Follow-up coverage: The Cirqle’s MCP beta processed 50,000+ queries; CSO says automation without attribution "amplifies your mistakes"',
      url: 'https://www.netinfluencer.com/the-cirqle-bets-the-real-automation-in-creator-marketing-is-budget-decisions-not-busywork/',
      date: '2026-07-03',
      category: 'major_press',
    },
  ],
};

async function main() {
  const db = await getDb();
  let totalAdded = 0;
  for (const [slug, events] of Object.entries(EVENTS)) {
    const rows = await db.query<{ id: number }>('SELECT id FROM competitors WHERE org_id = $1 AND slug = $2', [ORG_ID, slug]);
    if (rows.length === 0) {
      console.log(`skip ${slug} — not tracked in ${ORG_ID}`);
      continue;
    }
    const competitorId = rows[0].id;
    const { added } = await ingestItems(
      competitorId,
      'news',
      events.map((e) => ({
        externalId: `backfill:${e.url}`,
        title: e.title,
        url: e.url,
        publishedAt: e.date,
        payload: { backfilled: true, category_hint: e.category, source_note: 'Public-record research, backfilled Aug 2026' },
      })),
    );
    await recordRun(competitorId, 'news', true, added, `historical backfill: ${added} real dated events from public-record research`);
    console.log(`${slug}: +${added} historical events`);
    totalAdded += added;
  }
  console.log(`\nScoring ${totalAdded} backfilled events...`);
  const scored = await scoreUnscored(1000);
  console.log(`Scored ${scored} items. Done.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
