// Generate battlecards locally, Claude-in-session style (no API key needed —
// the LLM step is done by Claude Code now). Live quantitative facts (ad counts,
// open roles, threat) are pulled from the DB so they stay current; the
// strategic read is authored from the full competitive analysis, including
// the researched historical events (funding, executive moves, partnerships,
// launches) backfilled by `npm run backfill`. Each card carries three angles
// — sales, marketing, product — because a rep, a marketer, and a PM need
// different things from the same intelligence (see Klue/Signal Labs pattern:
// "each team gets a different card from the same intelligence").
// In production this same output is produced automatically by the Claude API
// on a schedule.
import { getDb } from '../src/db/client';
import { competitorStats, adCount } from '../src/lib/competitorStats';

const ORG_ID = process.env.ORG_ID ?? 'dev-workspace';

interface Angle {
  focus: string;
  points: string[];
  action: string;
}
interface Card {
  positioning: string;
  strengths: string[];
  vulnerabilities: string[];
  howToWin: string[];
  keyQuestion: string;
  angles: { sales: Angle; marketing: Angle; product: Angle };
}

// Strategic read per competitor (authored from the session's verified
// findings, including researched real historical events).
const STRATEGY: Record<string, (n: { meta: string; google: string; linkedin: string; jobs: number; threat: number | null }) => Card> = {
  creatoriq: (n) => ({
    positioning: `Enterprise heavyweight — "The Creator Graph", governance & measurement for global brands and agencies. Moving further up-market on the back of a new CTO and Dentsu/Sprinklr/CreativeX partnerships. Pricing is demo-gated. Threat Index ${n.threat}.`,
    strengths: [
      `Aggressively scaling GTM — ${n.jobs} open roles, heavily enterprise sales/CS/implementation.`,
      `Three enterprise partnerships landed in Q1–Q2 2026 alone: Sprinklr (social reporting), CreativeX/Nestlé (brand-suitability scoring), Dentsu (audience data) — a real moat at holdco scale.`,
      `New CTO Senthil Kumaran (ex-Digital Turbine, Meta Reality Labs) hired March 2026 to lead AI/engineering strategy.`,
      `Heavy paid presence where enterprise buyers are: ~${n.google} Google ads, ${n.linkedin} LinkedIn ads (0 on Meta — deliberate).`,
    ],
    vulnerabilities: [
      `Weight is a liability downmarket: demo-gated pricing + implementation managers = long time-to-value.`,
      `Rebuilding the org around "Enterprise" titles — smaller/mid-market accounts will feel deprioritized.`,
      `Not on the agentic/self-serve thesis — slower to the AI-native buyer than Grin or The Cirqle.`,
    ],
    howToWin: [
      `Compete on speed-to-value and transparent pricing, not feature parity.`,
      `Target mid-market accounts that need to launch in days, not a quarter.`,
      `Walk away early from RFPs shaped by agency/holdco requirements — that's their fortress.`,
    ],
    keyQuestion: `"How many weeks from signing until your first campaign is actually live — and who runs the implementation?"`,
    angles: {
      sales: {
        focus: 'Compete on speed-to-value against an incumbent that just added real enterprise credibility.',
        points: [
          'They’ll cite the Dentsu and Sprinklr partnerships as proof of trust — reframe: those integrations solve THEIR complexity problem, not the buyer’s speed problem.',
          'New CTO (ex-Digital Turbine/Meta) signals an AI/platform push — expect roadmap promises in competitive deals; ask for shipped dates, not vision.',
          `${n.jobs} open technical roles plus three new integrations to support means implementation bandwidth is stretched — push for a written timeline commitment.`,
        ],
        action: 'In every competitive deal, ask prospects for CreatorIQ’s actual implementation timeline from a recent reference customer, not the sales deck’s.',
      },
      marketing: {
        focus: 'Counter-position against "The Creator Graph" enterprise narrative with a speed and transparency story.',
        points: [
          'Their July FIFA World Cup report and August authenticity-gap study are thought-leadership plays aimed at brand marketers — match the data cadence or cede the "we understand the creator economy" narrative.',
          'The CreativeX/Nestlé and Dentsu placements are getting real press (BusinessWire, Digiday) — assume prospects have seen these; have a one-pager ready.',
          'Their own monthly product-release roundups are a credibility signal — track them, don’t let "we ship every month" go unanswered.',
        ],
        action: 'Draft a rebuttal one-pager for the Dentsu/Sprinklr partnerships before the next competitive RFP cycle.',
      },
      product: {
        focus: 'Track what the new CTO actually ships — that’s the real roadmap signal, not the press releases.',
        points: [
          'Kumaran’s background (ad-tech infrastructure, Meta Reality Labs) points at AI/ML investment — watch job postings for ML/data-engineering titles as the leading indicator.',
          'Sprinklr and CreativeX integrations are API-surface expansions — check whether similar integration requests are coming from our own customers.',
          'BenchmarkIQ dashboard overhaul plus a monthly release cadence show a real, shipping product org — don’t underestimate their velocity.',
        ],
        action: 'Set a monthly check of CreatorIQ’s release-roundup page against our own roadmap for feature-parity gaps.',
      },
    },
  }),
  upfluence: (n) => ({
    positioning: `Mid-market volume play — "first agentic influencer platform, powered by Jaice AI". Consolidation + ROI messaging ("drop the spreadsheets"). Serves ~3,500 brands, profitable without outside capital. Threat Index ${n.threat}.`,
    strengths: [
      `Heaviest advertiser in the set by far: ${n.meta} Meta + ~${n.google} Google + ${n.linkedin} LinkedIn ads, all on the "AI co-pilot / autopilot" message.`,
      `Co-CEO publicly previewing a programmatic ad product and an agent-based creator-negotiation system for "later in 2026".`,
      `Broad product: marketplace, payments, affiliate (Amazon/Shopify), API + MCP.`,
      `Published a Q1 2026 report analyzing 47,515 creator applications across 730 brands — real content-marketing muscle.`,
    ],
    vulnerabilities: [
      `Zero open roles against ~500 running ads — buying growth without visibly staffing to support it. Post-sale strain is the likely pressure point.`,
      `"Autopilot / 8 hours of work in 8 minutes" sets expectations reality often can't meet — buyer's remorse is a switch trigger.`,
      `Volume/SMB positioning underserves buyers wanting white-glove treatment.`,
    ],
    howToWin: [
      `Sell against the autopilot overpromise — show realistic, human-in-the-loop workflow.`,
      `Ask their references about support responsiveness and CSM coverage.`,
      `Target customers who bought the AI promise and hit its limits.`,
    ],
    keyQuestion: `"What's their current support SLA, and how many CSMs have they added this year?" (their public job board shows zero hiring.)`,
    angles: {
      sales: {
        focus: 'Their AI-autopilot promise is the wedge — sell against the overpromise, not the price.',
        points: [
          'The co-CEO’s May 2026 interview confirms a coming programmatic ad product and an agent-based negotiation/payout system — get ahead of this in deals now, before it ships.',
          `Heaviest advertiser in the set (${n.meta} Meta + ~${n.google} Google ads) but zero open roles — support capacity is the real pressure point; ask prospects who left Upfluence why.`,
          'They claim profitability without outside capital — a capital-efficiency story to acknowledge, not dismiss.',
        ],
        action: 'Build a "what happens when Jaice gets it wrong" discovery question — the co-CEO interview itself hinges the roadmap on trusting an AI agent with negotiation.',
      },
      marketing: {
        focus: 'Counter the "revenue era has arrived" / Jaice AI narrative directly.',
        points: [
          'Their Q1 2026 Creator Intelligence report (47,515 applications, 730 brands) is a data-driven content play — match it or lose the "we have the real data" argument.',
          '"Drop the spreadsheets" + "AI co-pilot" messaging targets ops-heavy buyers; lead with verifiability instead of automation for the same buyer.',
        ],
        action: 'Publish a direct comparison piece on AI-assisted vs. AI-autonomous creator management, timed against their next Jaice update.',
      },
      product: {
        focus: 'Their MCP/API work and the planned agent-based negotiation system are the features to track.',
        points: [
          'Programmatic ad product and agent-based negotiation are roadmap items as of May 2026, not shipped — a real window to ship first.',
          'Marketplace + payments + affiliate (Amazon/Shopify) breadth suggests a platform strategy, not a point solution.',
        ],
        action: 'Flag agent-based negotiation as a build-or-watch decision at the next roadmap review.',
      },
    },
  }),
  grin: (n) => ({
    positioning: `Established brand in defensive repositioning — split into "GRIN Classic" vs "GRIN AI" ("Gia"), and opened self-serve access with month-to-month billing in January 2026. Threat Index ${n.threat}.`,
    strengths: [
      `Strong incumbent brand and installed base; end-to-end creator management + gifting/affiliate.`,
      `"Gia" AI agent trained on $1B+ in partnerships; active YouTube presence and an iOS app.`,
      `Self-serve launch (Jan 27, 2026) directly targets the same accessible-pricing buyer we do — a real strategic pivot, not a tweak.`,
    ],
    vulnerabilities: [
      `"Top GRIN Alternatives" articles dominate their news — real, high-intent shopping demand from their own customers.`,
      `Thin momentum otherwise: only ${n.jobs} open roles (junior sales), ~${n.google} Google ads, ${n.linkedin} LinkedIn ads.`,
      `The Classic-vs-AI split plus the self-serve launch reads as an admission the enterprise-only model capped out — migration ambiguity for existing accounts.`,
    ],
    howToWin: [
      `Build a dedicated "switching from Grin" motion: migration guide, import tooling, first-call question set.`,
      `Bid on "GRIN alternatives" — the demand is proven and they can't defend it.`,
      `Probe the Classic→AI migration in discovery — support and plan continuity are soft spots.`,
    ],
    keyQuestion: `"When you moved to GRIN AI, what happened to your Classic plan, data, and support response times?"`,
    angles: {
      sales: {
        focus: 'They just removed their biggest sales friction — expect them in more competitive deals, priced lower.',
        points: [
          'Jan 27, 2026: GRIN opened self-serve with a 30-day free trial and month-to-month billing, ending the enterprise-only, demo-gated model.',
          'CEO Ryan Debenham’s own quote — "shouldn’t require enterprise budgets" — is a direct admission their old positioning was too heavy for the buyer they now want.',
          `Thin momentum otherwise (${n.jobs} open roles, modest ad spend) — the self-serve move may be a genuine strategy shift, not just pricing.`,
        ],
        action: 'Update the pricing-comparison section of every rep’s deck immediately — "they’re demo-gated" stopped being true in January 2026.',
      },
      marketing: {
        focus: '"Switching from Grin" is now a live opportunity — go after the self-serve messaging directly.',
        points: [
          'Quote their own CEO’s self-serve announcement back in comparison content — it validates the exact positioning we already run.',
          '"Top GRIN Alternatives" content already ranks organically — that demand exists and is provable, not assumed.',
        ],
        action: 'Build a "switching from Grin" landing page that cites their own self-serve launch as proof the market wanted this.',
      },
      product: {
        focus: 'Track the Classic vs AI (Gia) split for migration friction and feature-tier signals.',
        points: [
          'The self-serve launch is a packaging/billing change, not yet a product rebuild — watch whether Gia AI features reach the self-serve tier.',
          'No further product announcements beyond self-serve access in this window — feature velocity looks slower than CreatorIQ or The Cirqle.',
        ],
        action: 'Monitor whether Grin’s self-serve tier gains Gia AI features — that would signal real platform consolidation, not just a pricing experiment.',
      },
    },
  }),
  modash: (n) => ({
    positioning: `Product-led, data-first challenger — API-first ("build AI-powered influencer tools"), EMEA-centered (Estonia). Raised a $12M Series A (Oct 2024) and acquired creator-CRM startup Promoty (Jan 2025) to move beyond discovery into workflow. Threat Index ${n.threat}.`,
    strengths: [
      `Compounding on product + content: ${n.jobs} open roles weighted to engineering/data, and the largest SEO footprint in the set (3,500+ pages).`,
      `Capital-efficient acquisition: ~${n.google} Google + ${n.linkedin} LinkedIn ads (no Meta) — search-intent + B2B.`,
      `Strong discovery/data quality; Discovery + Raw APIs, now paired with Promoty's CRM/workflow tools for Shopify brands.`,
    ],
    vulnerabilities: [
      `Thin brand relative to product — wins on data quality and price, not relationships.`,
      `EMEA-centric; US presence and enterprise-grade support are open questions.`,
    ],
    howToWin: [
      `Sell breadth-of-workflow and service against their tool-depth.`,
      `Emphasize US coverage, relationship management, and hands-on onboarding.`,
    ],
    keyQuestion: `"Who's your dedicated point of contact in your timezone when a campaign breaks mid-flight?"`,
    angles: {
      sales: {
        focus: 'API-first, data-led — compete on service depth, not data quality.',
        points: [
          'A $12M Series A (Oct 2024) plus the Promoty acquisition (Jan 2025, creator-CRM for Shopify brands) show deliberate expansion from discovery tool into full workflow — treat them as a growing threat, not a point solution.',
          'EMEA-centered (Estonia); US enterprise support depth is a genuinely open question worth probing.',
        ],
        action: 'Ask prospects evaluating Modash who their point of contact is during US business hours — timezone coverage is a real, provable gap.',
      },
      marketing: {
        focus: 'They win on product-led content and SEO footprint — match with our own comparison and API content rather than ceding that ground.',
        points: [
          'The Promoty acquisition gives them a real e-commerce/DTC CRM angle now, not just discovery — our messaging needs to account for a different company than the 2024 version.',
        ],
        action: 'Build API/developer-facing comparison content — that’s Modash’s home turf and where our content is currently thinnest.',
      },
      product: {
        focus: 'The Promoty acquisition is the real signal — they’re building a workflow layer on top of discovery.',
        points: [
          'Watch for Promoty’s CRM/workflow features getting integrated into the core Modash product — that’s the expansion path to track.',
          'Continued investment in the developer-facing Influencer Marketing API suggests a platform strategy, not just a search tool.',
        ],
        action: 'Track Modash’s product pages for Promoty-branded feature integration as the signal the acquisition is actually landing.',
      },
    },
  }),
  thecirqle: (n) => ({
    positioning: `Small, ambitious Dutch challenger — "Agentic Creator Performance Platform", Claude/MCP-native, performance-marketing framing ("see creator ROAS before collab"). New CSO (April 2026) and a real MCP/agentic product launch (May 2026) mark its most active stretch on record. Threat Index ${n.threat}.`,
    strengths: [
      `Sharpest AI-native product bet in the set: an MCP integration (May 2026) letting brands run campaigns via natural-language prompts in Claude, ChatGPT, Gemini, or Copilot — 50,000+ beta queries processed.`,
      `Chief Strategy Officer Ernst Rustenhoven joined as a former customer, running restricted-category campaigns — direct buyer empathy in their positioning.`,
      `Punches above its weight on Meta: ${n.meta} active ads targeting DTC performance teams (Loop Earplugs, Zelesta, Matt Sleeps as social proof).`,
    ],
    vulnerabilities: [
      `Smallest footprint — no public job board, tiny team = capacity risk for any sizeable brand.`,
      `Named customers are mid-size DTC; no enterprise logos to reference.`,
      `Thin outside Meta (~${n.google} Google, ${n.linkedin} LinkedIn ads).`,
    ],
    howToWin: [
      `Sell scale-readiness, reliability, and enterprise track record.`,
      `Probe team size and support capacity for larger programs.`,
    ],
    keyQuestion: `"How many people would be supporting our account, and what's your largest customer by spend today?"`,
    angles: {
      sales: {
        focus: 'New CSO plus a real agentic launch — their most active stretch on record. Sell against "automation without attribution".',
        points: [
          'CSO Ernst Rustenhoven (joined April 2026) came in as a customer first — expect sharper, buyer-informed competitive positioning from them going forward.',
          'The MCP/agentic launch (May 2026) is genuinely novel and independently confirmed by our own subdomain detection (agent-api, autopilot.* hostnames appeared the same window).',
          'Their own CSO’s quote — automation without good attribution "amplifies your mistakes" — is a live objection-handling opening if their attribution story is thin in a deal.',
        ],
        action: 'Ask for a specific example of their MCP product catching (not just automating) a bad budget decision — the CSO’s own words set that bar.',
      },
      marketing: {
        focus: 'They’re leaning hard into "agentic" as a category claim — match it credibly or reframe around verifiability instead of automation.',
        points: [
          '50,000+ MCP beta queries and cited ROAS results (Secret Sales 16.8x, Lookfantastic 11x) are real, specific proof points prospects will have seen.',
          'Smallest team in the set running this credibly is itself a data point about focus — don’t underestimate a small, sharp competitor.',
        ],
        action: 'Track their MCP/agentic messaging for overreach — the CSO’s own "automation amplifies mistakes" framing is directly reusable in our own content.',
      },
      product: {
        focus: 'Our own subdomain detection already caught this launch before the press did — the clearest validation of the buildout-detection approach.',
        points: [
          'We flagged agent-api.sandbox and autopilot.prod/sandbox hostnames; the real MCP/agentic launch (confirmed via press) followed within weeks.',
          'The MCP integration pulls live data from Meta, TikTok, and Shopify — a real technical integration, not a thin wrapper.',
        ],
        action: 'Use The Cirqle as the internal case study for validating buildout-hostname + corporate-moves detection in Radar — our best real-world proof point to date.',
      },
    },
  }),
};

async function main() {
  const db = await getDb();
  const stats = await competitorStats(ORG_ID);
  for (const s of stats) {
    const gen = STRATEGY[s.slug];
    if (!gen) continue;
    const card = gen({
      meta: adCount(s.adNote.meta),
      google: adCount(s.adNote.google),
      linkedin: adCount(s.adNote.linkedin),
      jobs: s.jobs,
      threat: s.threat,
    });
    await db.query(
      `INSERT INTO battlecards (competitor_id, content) VALUES ($1, $2)
       ON CONFLICT (competitor_id) DO UPDATE SET content = EXCLUDED.content, generated_at = now()`,
      [s.id, JSON.stringify(card)],
    );
    console.log('battlecard:', s.name);
  }
  console.log('done — ', stats.length, 'competitors.');
  process.exit(0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
