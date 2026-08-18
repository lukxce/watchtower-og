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
  // ---- demo workspace (Fortress HQ's own market) ----
  klue: (n) => ({
    positioning: `The funded category leader in "competitive enablement" — sold to product marketing, delivered to sales through CRM. Named the category, then raised $62M to own it. Pricing is quote-only. Threat Index ${n.threat}.`,
    strengths: [
      `Best-capitalised in the set: $4M at launch, $15M Series A, then a $62M round, all on their own press record.`,
      `255 hostnames observed on the certificate log, dominated by per-pull-request preview environments — the fingerprint of a large, continuously shipping engineering org.`,
      `Deep social proof: 39 events and 26 customer logos captured — they show up where product marketers gather.`,
      `Does not need to buy the category: only ~${n.google} Google ads and ${n.linkedin} on LinkedIn.`,
    ],
    vulnerabilities: [
      `Quote-only pricing means every evaluation starts with a call — dead weight against a buyer who wants to try it this afternoon.`,
      `Built for a dedicated product-marketing function; teams without one inherit the overhead of a tool designed for someone else's job.`,
      `Enterprise weight cuts both ways: heavier onboarding, longer time to first useful briefing.`,
    ],
    howToWin: [
      `Race them to first value: signals inside the hour against a scheduled call and an onboarding plan.`,
      `Target teams with no dedicated competitive-intelligence headcount — Klue assumes that person exists.`,
      `Publish the price. Their strongest deals are the ones where the buyer never sees a number until late.`,
    ],
    keyQuestion: `"Who on your team would own the tool day to day, and what happens to it in the quarter they get busy?"`,
    angles: {
      sales: {
        focus: 'Speed and self-serve against a quote-gated leader.',
        points: [
          `They will lead with category leadership and the $62M raise — reframe funding as overhead the buyer pays for.`,
          `Ask the prospect how long Klue's evaluation took to get to a price. That gap is the pitch.`,
          `Klue assumes a product-marketing owner. Where that role is missing, the tool goes quiet after month two.`,
        ],
        action: 'In any deal where Klue is present, ask the prospect for their time-to-first-briefing, not their feature list.',
      },
      marketing: {
        focus: 'Counter-position published pricing against quote-only.',
        points: [
          `They own the "competitive enablement" phrase — do not fight for it, sell "actionable intelligence" instead.`,
          `Their 39 events and 26 logos mean the product-marketing audience is already theirs; win the teams without that function.`,
          `Their paid presence is small, so category search is uncontested — that is cheap ground for us.`,
        ],
        action: 'Build the comparison page around pricing transparency and time-to-value, not feature parity.',
      },
      product: {
        focus: 'Watch shipping velocity, which the hostnames expose.',
        points: [
          `255 preview hostnames means many parallel branches in flight — assume fast iteration and do not bet on a feature gap staying open.`,
          `Their artifact is the battlecard delivered into CRM; CRM delivery is the parity item that matters, not more dashboards.`,
          `Win-loss is part of their pitch — decide deliberately whether that is a gap we close or concede.`,
        ],
        action: 'Track their preview-hostname volume monthly as a proxy for release velocity.',
      },
    },
  }),
  crayon: (n) => ({
    positioning: `Established incumbent that has gone quiet on paid and is buying distribution instead — most notably by putting competitive intelligence inside Glean, where revenue teams already search. Threat Index ${n.threat}.`,
    strengths: [
      `Incumbent trust and a long customer history in the category.`,
      `The Glean integration reaches the revenue team inside a tool they already have open, which beats any ad for intent.`,
      `Sustained podcast and content presence — 23 podcast mentions captured.`,
    ],
    vulnerabilities: [
      `Near-invisible in paid: ${n.google} Google ads and ${n.linkedin} LinkedIn ad. Whatever the reason, the category's search demand is going somewhere else.`,
      `Distribution through a partner means the relationship with the buyer is mediated by that partner.`,
      `An integration announcement is not a product direction until more follow it.`,
    ],
    howToWin: [
      `Own the paid and organic category search they have vacated.`,
      `Sell the direct relationship: our briefing is ours end to end, not a surface inside someone else's search box.`,
      `Ask where the citation lives — a summary inside a partner tool is not the same as evidence you can audit.`,
    ],
    keyQuestion: `"When their tool tells you something, can you click through to the page it came from and the time it was captured?"`,
    angles: {
      sales: {
        focus: 'Sell auditable evidence against summarised answers.',
        points: [
          `Their newest reach is through Glean — ask whether the buyer actually uses Glean, because outside it that advantage is zero.`,
          `Incumbency will be the trust argument; counter with what the buyer can verify themselves.`,
          `They are not spending on paid, so the prospect likely arrived through content or an analyst list, not a demo request.`,
        ],
        action: 'Ask every prospect evaluating Crayon whether they can trace one claim back to its source page and capture time.',
      },
      marketing: {
        focus: 'Take the category search they are not defending.',
        points: [
          `Zero Google ads from an incumbent is an open lane on category keywords.`,
          `Match their content cadence on podcasts, where they are genuinely present.`,
          `Watch for further AI-tool integrations; a second and third would confirm a distribution strategy worth answering.`,
        ],
        action: 'Bid the category terms Crayon has left uncontested and measure cost per signup against content.',
      },
      product: {
        focus: 'Treat embedded distribution as a real pattern to evaluate.',
        points: [
          `Being answerable inside the tools buyers already use is a genuine threat to a standalone dashboard.`,
          `Our equivalent is already half-built: Ask the Tower plus cited evidence is the answer surface.`,
          `Decide whether we ever want to be embedded, or whether owning the artifact end to end is the position.`,
        ],
        action: 'Evaluate whether Ask the Tower should be reachable from outside the app, and what that would cost.',
      },
    },
  }),
  kompyte: (n) => ({
    positioning: `No longer an independent competitor: absorbed into Semrush and now sold as part of that suite. You are not competing with Kompyte's roadmap, you are competing with Semrush's bundle and its installed seats. Threat Index ${n.threat}.`,
    strengths: [
      `Distribution through Semrush's existing customer base, which dwarfs anything a standalone CI tool reaches.`,
      `Bundling makes it a line item rather than a new purchase — often the easiest budget to approve.`,
      `Still actively partnering under the new owner, most recently with IcebergIQ.`,
    ],
    vulnerabilities: [
      `Every visible sign of independence is gone: kompyte.com/careers 404s, and there is no advertiser account on Google or LinkedIn — the spend runs under Semrush.`,
      `Acquired products compete for roadmap attention inside a much larger suite.`,
      `The buyer is now an SEO/marketing-suite buyer, not necessarily the competitive-intelligence owner.`,
    ],
    howToWin: [
      `Sell depth against breadth: a suite module is rarely the best tool in its own category.`,
      `Target teams that do not already own Semrush, where the bundle advantage is worth nothing.`,
      `Ask what has actually shipped in Kompyte since the acquisition.`,
    ],
    keyQuestion: `"Are you buying this because it is the best competitive intelligence you evaluated, or because it was already in the contract?"`,
    angles: {
      sales: {
        focus: 'Depth against a bundled module.',
        points: [
          `If the prospect already pays for Semrush, expect price to be near-zero — do not fight on cost, fight on the quality of the read.`,
          `If they do not use Semrush, the bundle is irrelevant and Kompyte is just a smaller product.`,
          `Post-acquisition roadmap uncertainty is a fair, checkable question to raise.`,
        ],
        action: 'Qualify early on whether the account already owns Semrush; it changes the entire deal.',
      },
      marketing: {
        focus: 'Position against suite-module compromise.',
        points: [
          `"Kompyte by Semrush" is now the brand — the comparison page should address the suite, not the standalone product.`,
          `They still hold real event and podcast presence (36 events, 11 podcast mentions captured).`,
          `The best-of-breed argument is strongest with buyers who have been burned by a suite module before.`,
        ],
        action: 'Write the comparison against "Semrush bundle" rather than against Kompyte alone.',
      },
      product: {
        focus: 'Watch whether the acquisition slows shipping.',
        points: [
          `Absorbed products typically slow down; confirm with their changelog rather than assuming it.`,
          `The IcebergIQ partnership suggests they are still moving, so do not write them off.`,
          `Their distribution advantage is real and not something we can copy — compete on the artifact quality instead.`,
        ],
        action: 'Check the Kompyte changelog quarterly for genuine post-acquisition releases.',
      },
    },
  }),
  visualping: (n) => ({
    positioning: `The bottom-up threat: consumer-grade page-change monitoring moving upward into competitive intelligence. Cheap, self-serve, and it sets the buyer's price anchor before they ever reach a real CI vendor. Threat Index ${n.threat}.`,
    strengths: [
      `Genuine self-serve motion with real consumer awareness — press coverage for tracking delivery slots and vaccine appointments.`,
      `Shipping AI features at the extension level: one-click AI monitoring and action recording in Chrome.`,
      `Most aggressive advertiser in the set for its size (~${n.google} Google ads).`,
      `47 hostnames observed — real infrastructure behind a product that looks like a utility.`,
    ],
    vulnerabilities: [
      `Detection without interpretation: it tells you a page changed, not what the change means or what to do about it.`,
      `No competitor-level synthesis — every alert stands alone, which is exactly the pile of alerts buyers complain about.`,
      `Consumer heritage undercuts it in a serious enterprise evaluation.`,
    ],
    howToWin: [
      `Draw the line between a change alert and a briefing — that is the whole product difference, so make it explicit.`,
      `Expect it as the incumbent "we already do this for free" objection and answer it with a bundled read.`,
      `Do not compete on price against a freemium utility; compete on what happens after the alert fires.`,
    ],
    keyQuestion: `"When their tool tells you a pricing page changed, who on your team works out what it means and what you do next?"`,
    angles: {
      sales: {
        focus: 'Beat the "we already monitor pages for free" objection.',
        points: [
          `Visualping is very often the incumbent, not another vendor — the real competitor is their existing free setup.`,
          `Ask how many alerts they get a week and how many they actually read. That number sells the bundling.`,
          `They are watching pages; nobody is watching ads, hiring, or the certificate log.`,
        ],
        action: 'Ask every prospect what they use today; when it is Visualping, pivot the demo to bundling and the read.',
      },
      marketing: {
        focus: 'Reframe the category above change detection.',
        points: [
          `They are buying category search aggressively for their size — expect overlap on monitoring keywords.`,
          `Their consumer press is an asset for awareness and a liability in enterprise trust; use the second half.`,
          `"One card per thing that happened, not one alert per detection" is the line that separates us.`,
        ],
        action: 'Target "website change monitoring" search intent with a page about why detection alone fails.',
      },
      product: {
        focus: 'Respect their velocity at the edges.',
        points: [
          `AI monitoring in a browser extension is a low-friction wedge; ease of setup is a genuine advantage.`,
          `Our moat is synthesis, not detection — detection is commoditised and they prove it.`,
          `Watch whether they add per-competitor synthesis; that would be the move that puts them in our category properly.`,
        ],
        action: 'Set a quarterly check for whether Visualping ships competitor-level summarisation.',
      },
    },
  }),
  'signal-labs': (n) => ({
    positioning: `The closest competitor in the set. Signal Labs CIx sells source-linked citations on every claim, battlecards, and an ask-the-AI chat — our three commitments. Free tier tracks one competitor; Team is custom-priced on a call. Threat Index ${n.threat}.`,
    strengths: [
      `A genuinely usable free tier: one living competitor page, one battlecard a month, three seats — it converts by being real, not a trial.`,
      `Same evidence promise we make: source-linked citations on every claim, on every plan.`,
      `API and MCP access on Team, which is a developer-credible surface most CI vendors lack.`,
      `Already running ~${n.google} Google ads despite being early.`,
    ],
    vulnerabilities: [
      `Team pricing is custom and quoted on a 30-minute call — their own page concedes the friction by promising you will know the price before the trial starts.`,
      `Work-email-only signup blocks the casual evaluator who would otherwise self-serve.`,
      `Too young to have coverage: zero qualifying news articles found, so there is no third-party validation for a buyer to lean on.`,
      `The free tier caps at one competitor, which is below the point where the product becomes useful.`,
    ],
    howToWin: [
      `Publish the number. They gate Team pricing on a call; we do not, and that is the sharpest difference in the whole set.`,
      `Sell the full competitive set from day one — one competitor is not competitive intelligence.`,
      `Match them on citations, then beat them on breadth: certificate logs, ad libraries and review sites they do not appear to cover.`,
    ],
    keyQuestion: `"How many competitors do you actually need to watch — and what does it cost once you go past the first one?"`,
    angles: {
      sales: {
        focus: 'Attack the pricing call, not the product.',
        points: [
          `Their product claims mirror ours, so a feature fight is a draw — the buying motion is where we win.`,
          `Their own pricing page admits the call is friction. Quote it back: we publish the price, no call required.`,
          `Free covers one competitor. Ask the prospect how many they actually track; the answer disqualifies the free tier.`,
        ],
        action: 'When Signal Labs is in the deal, make time-to-price the comparison, not features.',
      },
      marketing: {
        focus: 'Own the transparency ground before they take it.',
        points: [
          `They are bidding category terms already — expect direct paid overlap and rising costs.`,
          `They have no press coverage yet, so search and their own site are the whole story; our published pricing page is a real differentiator in that comparison.`,
          `Their "Battle Rooms" and "Ask CIx" naming is close to ours — keep our language distinct.`,
        ],
        action: 'Keep the pricing page the highest-converting page on the site; it is the wedge against them.',
      },
      product: {
        focus: 'The closest roadmap in the set — track it deliberately.',
        points: [
          `Same promise on citations means parity claims will be made; our advantage has to be demonstrable breadth of channels.`,
          `API and MCP access on Team is a real gap in our offering if developer buyers matter.`,
          `Watch their docs and changelog — with no press, that is the only reliable read on what they ship.`,
        ],
        action: 'Monitor usesignallabs.com/docs and /pricing weekly; it is the only real signal source they have.',
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
