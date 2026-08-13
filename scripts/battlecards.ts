// Generate battlecards locally, Claude-in-session style (no API key needed —
// the LLM step is done by Claude Code now). Live quantitative facts (ad counts,
// open roles, threat) are pulled from the DB so they stay current; the
// strategic read is authored from the full competitive analysis. In production
// this same output is produced automatically by the Claude API on a schedule.
import { getDb } from '../src/db/client';
import { competitorStats, adCount } from '../src/lib/competitorStats';

const ORG_ID = process.env.ORG_ID ?? 'dev-workspace';

interface Card {
  positioning: string;
  strengths: string[];
  vulnerabilities: string[];
  howToWin: string[];
  keyQuestion: string;
}

// Strategic read per competitor (authored from the session's verified findings).
const STRATEGY: Record<string, (n: { meta: string; google: string; linkedin: string; jobs: number; threat: number | null }) => Card> = {
  creatoriq: (n) => ({
    positioning: `Enterprise heavyweight — "The Creator Graph", governance & measurement for global brands and agencies. Moving further up-market on the back of a Dentsu partnership. Pricing is demo-gated. Threat Index ${n.threat}.`,
    strengths: [
      `Aggressively scaling GTM — ${n.jobs} open roles, heavily enterprise sales/CS/implementation.`,
      `Dentsu partnership fuses creator selection with agency media buying — a moat at holdco scale.`,
      `Heavy paid presence where enterprise buyers are: ~${n.google} Google ads, ${n.linkedin} LinkedIn ads (0 on Meta — deliberate).`,
      `Enterprise governance, SafeIQ/Trust, dedicated implementation team.`,
    ],
    vulnerabilities: [
      `Weight is a liability downmarket: demo-gated pricing + implementation managers = long time-to-value.`,
      `Rebuilding the org around "Enterprise" titles — smaller/mid-market accounts will feel deprioritized.`,
      `Not on the agentic/self-serve thesis — slower to the AI-native buyer.`,
    ],
    howToWin: [
      `Compete on speed-to-value and transparent pricing, not feature parity.`,
      `Target mid-market accounts that need to launch in days, not a quarter.`,
      `Walk away early from RFPs shaped by agency/holdco requirements — that's their fortress.`,
    ],
    keyQuestion: `"How many weeks from signing until your first campaign is actually live — and who runs the implementation?"`,
  }),
  upfluence: (n) => ({
    positioning: `Mid-market volume play — "first agentic influencer platform, powered by Jaice AI". Consolidation + ROI messaging ("drop the spreadsheets"). Serves ~3,500 brands. Threat Index ${n.threat}.`,
    strengths: [
      `Heaviest advertiser in the set by far: ${n.meta} Meta + ~${n.google} Google + ${n.linkedin} LinkedIn ads, all on the "AI co-pilot / autopilot" message.`,
      `Dominates "best platform" listicles; co-CEO pushing a "revenue era" narrative in press/podcasts.`,
      `Broad product: marketplace, payments, affiliate (Amazon/Shopify), API + MCP.`,
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
  }),
  grin: (n) => ({
    positioning: `Established brand in defensive repositioning — just split into "GRIN Classic" vs "GRIN AI" ("Gia") and launched self-serve access. Threat Index ${n.threat}.`,
    strengths: [
      `Strong incumbent brand and installed base; end-to-end creator management + gifting/affiliate.`,
      `"Gia" AI agent trained on $1B+ in partnerships; active YouTube presence and an iOS app.`,
    ],
    vulnerabilities: [
      `"Top GRIN Alternatives" articles dominate their news — real, high-intent shopping demand from their own customers.`,
      `Thin momentum: only ${n.jobs} open roles (junior sales), ~${n.google} Google ads, ${n.linkedin} LinkedIn ads.`,
      `The Classic-vs-AI split + self-serve launch reads as an admission the enterprise-only model capped out — migration ambiguity for existing accounts.`,
    ],
    howToWin: [
      `Build a dedicated "switching from Grin" motion: migration guide, import tooling, first-call question set.`,
      `Bid on "GRIN alternatives" — the demand is proven and they can't defend it.`,
      `Probe the Classic→AI migration in discovery — support and plan continuity are soft spots.`,
    ],
    keyQuestion: `"When you moved to GRIN AI, what happened to your Classic plan, data, and support response times?"`,
  }),
  modash: (n) => ({
    positioning: `Product-led, data-first challenger — API-first ("build AI-powered influencer tools"), EMEA-centered (Estonia). Threat Index ${n.threat}.`,
    strengths: [
      `Compounding on product + content: ${n.jobs} open roles weighted to engineering/data, and the largest SEO footprint in the set (3,500+ pages).`,
      `Capital-efficient acquisition: ~${n.google} Google + ${n.linkedin} LinkedIn ads (no Meta) — search-intent + B2B.`,
      `Strong discovery/data quality; Discovery + Raw APIs.`,
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
  }),
  thecirqle: (n) => ({
    positioning: `Small, ambitious Dutch challenger — "Agentic Creator Performance Platform", Claude/MCP-native, performance-marketing framing ("see creator ROAS before collab"). Threat Index ${n.threat}.`,
    strengths: [
      `Sharpest AI-native product bet: agentic + Claude integration + ROAS forecasting.`,
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
