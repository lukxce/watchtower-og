// Competitor reads, Claude-in-session style — same pattern as battlecards.ts:
// no ANTHROPIC_API_KEY needed because the reasoning is done by Claude Code,
// once, against EVERYTHING on file per competitor (corporate moves, buildout
// hostnames, hiring, ads, battlecard), following src/lib/reason.ts's SYSTEM
// rules: whole-picture, only stated facts, confident where their own press
// confirms the link, honest where the link is timing alone. Replaces the
// rejected per-signal reasoning cache. Run: npm run reads
// A snapshot — re-author + re-run after big crawls, or set ANTHROPIC_API_KEY
// for the live path (llmCompetitorRead) to take over.
import { getDb } from '../src/db/client';

const ORG_ID = process.env.ORG_ID ?? 'dev-workspace';

interface Read {
  hook: string;
  narrative: string;
  evidence: { label: string; text: string }[];
}

const READS: Record<string, Read> = {
  creatoriq: {
    hook: 'Locking down enterprise, leaving self-serve open',
    narrative: `CreatorIQ spent 2026 locking down the enterprise flank: Sprinklr partnership in March, the CreativeX/Nestlé brand-suitability integration in April, Dentsu audience-data integration in June — three holdco-scale moats in four months. A new CTO (Senthil Kumaran, ex-Digital Turbine and Meta Reality Labs, March 2026) plus the biggest hiring book in the set says the up-market push is funded and real. Nothing in their motion points at self-serve or agentic — the open flank is speed-to-value and transparent pricing, exactly where the rest of the set is racing.`,
    evidence: [
      { label: 'Partnerships', text: 'Sprinklr (Mar 2026) · CreativeX/Nestlé (Apr 2026) · Dentsu (Jun 2026)' },
      { label: 'Leadership', text: 'Senthil Kumaran appointed CTO, Mar 2026 — ex-Digital Turbine, Meta Reality Labs' },
      { label: 'Hiring', text: 'Largest open-roles book in the set, enterprise sales/CS/implementation-weighted' },
    ],
  },
  upfluence: {
    hook: 'Selling the AI story harder than staffing it',
    narrative: `Upfluence is selling the AI story harder than it's staffing it. Co-CEO Vivien Garnès went public in May 2026 with the "revenue era" pitch — Jaice AI today, a programmatic ad product and an agent-based creator-negotiation system promised for later in 2026. They're the heaviest advertiser in the set with zero open roles on their board: buying growth while betting the roadmap lands before support strain shows. Treat the agent-negotiation promise as a deadline — whoever ships it first owns that story.`,
    evidence: [
      { label: 'Roadmap on record', text: 'Co-CEO interview, May 2026: programmatic ads + agent-based negotiation "later in 2026"' },
      { label: 'Spend vs. staffing', text: 'Heaviest ad presence in the set · zero open roles visible' },
    ],
  },
  grin: {
    hook: 'Mid-transition: tearing out the old model',
    narrative: `Grin is midway through tearing out its business model. The January 27, 2026 self-serve launch (30-day free trial, month-to-month billing) ended enterprise-only sales, the product is now split "GRIN Classic" vs the Gia AI side, and launch.grin.co appearing on the certificate log looks like the rollout surface for exactly that. Hiring is thin and ad presence small — this is a transition under pressure, not an expansion. The window: migration friction for Classic customers, and "GRIN alternatives" search demand their own news feed proves is real.`,
    evidence: [
      { label: 'The switch', text: 'Self-serve access, 30-day trial, month-to-month — their own press release, Jan 27, 2026' },
      { label: 'Buildout', text: 'launch.grin.co on the public certificate log, same window as the rollout' },
      { label: 'Under pressure', text: 'Thin hiring and ads; "Top GRIN Alternatives" coverage dominates their news' },
    ],
  },
  modash: {
    hook: 'Quiet compounding: discovery to full workflow',
    narrative: `Modash keeps compounding quietly: a $12M Series A (Oct 2024), the Promoty acquisition (Jan 2025) bolting creator-CRM onto discovery, and an estimated $9.8M ARR per GetLatka (Aug 2026). Hiring stays engineering-weighted and the SEO footprint is the largest in the set — a product-led machine, not a sales-led one. The thing to watch is Promoty features landing in the core product: that's the discovery-to-workflow expansion actually happening, not just announced.`,
    evidence: [
      { label: 'Capital & M&A', text: '$12M Series A (Oct 2024) · Promoty acquisition (Jan 2025)' },
      { label: 'Scale estimate', text: '~$9.8M ARR per GetLatka, Aug 2026 (third-party, directional)' },
    ],
  },
  thecirqle: {
    hook: 'Smallest team, sharpest agentic bet',
    narrative: `The Cirqle is the smallest player making the sharpest bet. A CSO hire in April 2026, the MCP/agentic launch in May (creator campaigns run from Claude, ChatGPT, Gemini, or Copilot), 50,000+ beta queries by July — and our certificate-log watch caught clients-alpha and influencers-beta hostnames in the same stretch, which reads as them building out both sides of the marketplace. Capacity, not ambition, is the constraint: no public job board and only mid-size DTC logos to reference.`,
    evidence: [
      { label: 'The bet', text: 'MCP/agentic launch May 27, 2026 · 50,000+ beta queries by July' },
      { label: 'Confirmed by buildout', text: 'clients-alpha and influencers-beta hostnames appeared in the same window — our own detection' },
      { label: 'Leadership', text: 'Ernst Rustenhoven joined as CSO, Apr 2026 — a former customer' },
    ],
  },
  'hypefy-ai': {
    hook: 'Freshly funded, staging a launch',
    narrative: `Hypefy closed a $7.2M Series A in the first week of July 2026 (reported by five outlets), and within about five weeks two new hostnames went up: launch.hypefy.ai and ai-agent.hypefy.ai. There's no confirmation of what ships — but funded, a "launch" surface, an "ai-agent" surface, and an active ad presence together read like a launch being staged, likely agentic. The link between the round and the buildouts is timing, not their own statement; treat direction as probable, not confirmed.`,
    evidence: [
      { label: 'Funding', text: '$7.2M Series A, closed Jun 30 – Jul 6, 2026 (FinSMEs, SeeNews, Tech.eu, Net Influencer, The Recursive)' },
      { label: 'Buildouts', text: 'launch.hypefy.ai and ai-agent.hypefy.ai on the certificate log, ~5 weeks after the round' },
    ],
  },
  // ---- demo workspace (Fortress HQ's own market, ORG_ID=demo-workspace) ----
  klue: {
    hook: 'The funded category leader, and it shows in the infrastructure',
    narrative: `Klue is the best-capitalised competitor in the set and the crawl shows where the money went: 255 hostnames on the certificate log, most of them per-pull-request preview environments, which is the fingerprint of a large engineering org shipping continuously. Their own news trail runs $4M at launch, then a $15M Series A, then $62M to accelerate "competitive enablement" — they named the category and then funded owning it. Paid presence is modest (~11 Google ads, 6 on LinkedIn) because they do not need to buy the category. The opening is not their capability, it is their shape: enterprise-weighted, sold to product marketing teams, priced on a call.`,
    evidence: [
      { label: 'Funding trail', text: '$4M launch → $15M Series A → $62M raise, all from their own press coverage' },
      { label: 'Engineering scale', text: '255 hostnames observed, dominated by per-PR preview environments' },
      { label: 'Paid presence', text: '~11 Google ads via "Klue Labs Inc" · 6 LinkedIn ads' },
    ],
  },
  crayon: {
    hook: 'Buying distribution instead of buying attention',
    narrative: `Crayon is the quietest advertiser in the set: zero Google ads and a single LinkedIn ad, which for an incumbent of its size is a choice rather than a shortfall. What they are doing instead showed up in the news channel — integrating competitive intelligence into Glean, putting their content where AI workplace search already sits. That is a distribution bet: reach the revenue team inside the tool they already have open, rather than paying to interrupt them. Worth watching whether more such integrations follow; one is a deal, three would be a strategy.`,
    evidence: [
      { label: 'Distribution move', text: 'Crayon integrates competitive intelligence into Glean for revenue teams' },
      { label: 'Paid presence', text: '0 Google ads · 1 LinkedIn ad — near-silent for an incumbent' },
      { label: 'Caveat', text: 'One integration is a data point; the strategy read is not confirmed until more follow' },
    ],
  },
  kompyte: {
    hook: 'Absorbed into Semrush, and running on its distribution',
    narrative: `Kompyte no longer behaves like an independent company, and the collection makes that visible in a way a feature comparison would not: no careers page of its own (it 404s), and no advertiser account — zero ads on either platform, because acquisition means the spend runs under Semrush. Its own history is a small-cap trail (500 Startups demo day, a €400k round led by Rose Tech Ventures) that ends at the Semrush acquisition, after which the news becomes partnership announcements like IcebergIQ. The read: you are not competing with Kompyte's roadmap, you are competing with Semrush's bundle and its existing seats.`,
    evidence: [
      { label: 'Absorbed', text: 'kompyte.com/careers returns 404 · zero own ad accounts on Google or LinkedIn' },
      { label: 'Now positioned as', text: '"Kompyte by Semrush", latest news is the IcebergIQ partnership' },
      { label: 'Pre-acquisition trail', text: '500 Startups demo day · €400k round led by Rose Tech Ventures' },
    ],
  },
  visualping: {
    hook: 'Coming up from the bottom, not down from enterprise',
    narrative: `Visualping is the only competitor here that arrives from underneath. Its press history is consumer utility — people using it to catch delivery slots and vaccine appointments — and its product news is extension-level: one-click AI monitoring and action recording in Chrome. It is the most active advertiser in the set relative to size (~11 Google ads) and carries 47 hostnames. The threat is not that it wins enterprise CI evaluations; it is that it makes "just watch their pricing page" free and obvious, and anchors what buyers think change monitoring should cost before they ever reach a real CI vendor.`,
    evidence: [
      { label: 'Product direction', text: 'One-click AI monitoring and action recording shipped to the Chrome extension' },
      { label: 'Origin', text: 'Consumer utility press: delivery slots, COVID vaccine appointment tracking · $2M raise' },
      { label: 'Paid presence', text: '~11 Google ads via "Webmonitoring Technologies Inc."' },
    ],
  },
  'signal-labs': {
    hook: 'Closest to us on promise, furthest on pricing',
    narrative: `Signal Labs is the nearest competitor in the set and the overlap is not accidental: CIx sells source-linked citations on every claim, battlecards as the artifact, and an "Ask CIx" chat — the same three commitments we make. Their free tier is real (one living competitor page, one battlecard a month, three seats). The divergence is the buying motion: Team pricing is custom, scoped on a 30-minute call, and their own page concedes the friction by promising "you will know the price before the trial starts, not after it ends". They are too young to have news coverage — zero qualifying articles, which is an honest zero, not a collection gap — but they are already running ~10 Google ads.`,
    evidence: [
      { label: 'Same promise', text: 'Source-linked citations on every claim, battlecards, and an ask-the-AI chat (Ask CIx)' },
      { label: 'Pricing motion', text: 'Free = 1 competitor · Team = custom, quoted on a 30-minute call' },
      { label: 'Their own tell', text: '"You will know the price before the trial starts, not after it ends"' },
      { label: 'Coverage', text: '0 qualifying news articles — real for a company this young, not a miss' },
    ],
  },
};

async function main() {
  const db = await getDb();
  for (const [slug, read] of Object.entries(READS)) {
    const rows = await db.query<{ id: number }>('SELECT id FROM competitors WHERE org_id = $1 AND slug = $2', [ORG_ID, slug]);
    if (rows.length === 0) {
      console.log(`skip ${slug} — not tracked in ${ORG_ID}`);
      continue;
    }
    await db.query(
      `INSERT INTO competitor_reasoning (competitor_id, hook, narrative, evidence)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (competitor_id) DO UPDATE SET hook = EXCLUDED.hook, narrative = EXCLUDED.narrative,
         evidence = EXCLUDED.evidence, generated_at = now()`,
      [rows[0].id, read.hook, read.narrative, JSON.stringify(read.evidence)],
    );
    console.log('read:', slug);
  }
  console.log('done.');
  process.exit(0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
