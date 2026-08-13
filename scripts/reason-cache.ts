// Reasoning cache, Claude-in-session style — same pattern as
// scripts/battlecards.ts: no ANTHROPIC_API_KEY needed because the reasoning
// step is done by Claude Code, once, directly against the real signal +
// context data (src/lib/connect.ts's CompetitorContext), following the exact
// grounding rules in src/lib/reason.ts's SYSTEM prompt — only stated facts,
// no invented causality, hedge honestly when a connection is temporal-only
// rather than confirmed. A snapshot for the testing period: doesn't reason
// about signals that appear after this was written. Re-run (with fresh
// entries authored) whenever you want the cache refreshed, or set
// ANTHROPIC_API_KEY for a live, always-current loop instead.
import { getDb } from '../src/db/client';

interface Entry {
  streamItemId: number;
  headline: string;
  howWeKnow?: string;
  context?: { label: string; text: string }[];
}

const ENTRIES: Entry[] = [
  // Grin — launch.grin.co, connected to the real Jan 2026 self-serve/pricing-model switch.
  {
    streamItemId: 560,
    headline: `Grin looks to be building something new ("launch") — and this reads like the self-serve funnel: GRIN opened instant self-serve access with a 30-day free trial and month-to-month billing in January 2026, ending its enterprise-only sales model.`,
    howWeKnow: `new hostname launch.grin.co appeared on the public certificate log; GRIN's own Jan 27, 2026 press release (Business Wire) announced the self-serve launch — a hostname named "launch" appearing in that window is very likely the landing page for it.`,
    context: [
      { label: 'Battlecard read', text: `Established brand in defensive repositioning — split into "GRIN Classic" vs "GRIN AI" ("Gia"), and opened self-serve access with month-to-month billing in January 2026. Threat Index 54.` },
      { label: 'Recent corporate moves', text: 'GRIN opens instant self-serve access with a 30-day free trial and month-to-month billing, ending its enterprise-only sales model (Jan 2026)' },
    ],
  },
  // Grin — the reverse direction: the news item itself, pointed back at the subdomain.
  {
    streamItemId: 1891,
    headline: `GRIN opens instant self-serve access with a 30-day free trial and month-to-month billing, ending its enterprise-only sales model — worth reading next to launch.grin.co, a new hostname that appeared on their certificate log in the same stretch and looks like the landing page for this rollout.`,
    howWeKnow: `GRIN's own Jan 27, 2026 press release (Business Wire); launch.grin.co appeared on the public certificate log in the same window.`,
    context: [
      { label: 'Battlecard read', text: `Established brand in defensive repositioning — split into "GRIN Classic" vs "GRIN AI" ("Gia"), and opened self-serve access with month-to-month billing in January 2026. Threat Index 54.` },
      { label: 'Buildout to watch', text: 'launch.grin.co — new hostname on the public certificate log' },
    ],
  },
  // The Cirqle — two subdomains, connected to the real May 2026 MCP/agentic launch + April CSO hire.
  {
    streamItemId: 1685,
    headline: `The Cirqle looks to be building something new ("clients-alpha") — likely tied to their agentic push: in May 2026 they shipped an MCP integration letting brands run creator-marketing workflows via natural-language prompts in Claude, ChatGPT, Gemini, or Copilot, right after a new Chief Strategy Officer joined in April 2026. A client-facing "alpha" surface fits a company actively building that out.`,
    howWeKnow: `new hostname clients-alpha.thecirqle.com on the certificate log, alongside The Cirqle's own May 27, 2026 blog post announcing the MCP integration and an April 2026 CSO hire — both real and dated in the same window.`,
    context: [
      { label: 'Battlecard read', text: `Small, ambitious Dutch challenger — "Agentic Creator Performance Platform", Claude/MCP-native, performance-marketing framing. New CSO (April 2026) and a real MCP/agentic product launch (May 2026) mark its most active stretch on record. Threat Index 41.` },
      { label: 'Recent corporate moves', text: 'The Cirqle launches an MCP integration (May 2026) · Ernst Rustenhoven joins as CSO (Apr 2026) · MCP beta processed 50,000+ queries (Jul 2026 follow-up)' },
    ],
  },
  {
    streamItemId: 1664,
    headline: `The Cirqle looks to be building something new ("influencers-beta") — same active stretch as their MCP/agentic launch: a natural-language creator-workflow product shipped in May 2026, with July follow-up coverage reporting 50,000+ beta queries processed. An "influencers" surface in beta fits a company actively expanding that product line.`,
    howWeKnow: `new hostname influencers-beta.thecirqle.com on the certificate log, alongside The Cirqle's own May 27, 2026 MCP announcement and July 3, 2026 follow-up coverage of the beta's usage — both real and dated in the same window.`,
    context: [
      { label: 'Battlecard read', text: `Small, ambitious Dutch challenger — "Agentic Creator Performance Platform", Claude/MCP-native, performance-marketing framing. New CSO (April 2026) and a real MCP/agentic product launch (May 2026) mark its most active stretch on record. Threat Index 41.` },
      { label: 'Recent corporate moves', text: 'The Cirqle launches an MCP integration (May 2026) · MCP beta processed 50,000+ queries, CSO says automation without attribution "amplifies your mistakes" (Jul 2026)' },
    ],
  },
  // The Cirqle — reverse direction: the MCP launch news item, pointed back at both subdomains.
  {
    streamItemId: 1895,
    headline: `The Cirqle launches an MCP integration letting brands run creator-marketing workflows via natural-language prompts in Claude, ChatGPT, Gemini, or Copilot — worth reading next to two fresh buildout hostnames, clients-alpha.thecirqle.com and influencers-beta.thecirqle.com, that appeared on their certificate log in the same stretch and look like the surfaces this product ships through.`,
    howWeKnow: `The Cirqle's own May 27, 2026 blog post; two new hostnames (clients-alpha, influencers-beta) appeared on the public certificate log in the same window.`,
    context: [
      { label: 'Battlecard read', text: `Small, ambitious Dutch challenger — "Agentic Creator Performance Platform", Claude/MCP-native, performance-marketing framing. New CSO (April 2026) and a real MCP/agentic product launch (May 2026) mark its most active stretch on record. Threat Index 41.` },
      { label: 'Buildouts to watch', text: 'clients-alpha.thecirqle.com, influencers-beta.thecirqle.com — both on the public certificate log' },
    ],
  },
  // Hypefy — two subdomains, temporal-only connection to the real Series A. No battlecard exists
  // for Hypefy (added via the UI, not in the authored STRATEGY set) — honestly hedged rather than
  // asserting what the funding is earmarked for, since that specific fact isn't on file.
  {
    streamItemId: 1765,
    headline: `Hypefy looks to be building something new ("ai-agent") — worth reading alongside their $7.2M Series A, which closed in early July 2026 just weeks before this hostname appeared. We don't have confirmation of what the funding is earmarked for, but the timing lines up with new product buildout.`,
    howWeKnow: `new hostname ai-agent.hypefy.ai on the public certificate log, roughly 4–5 weeks after Hypefy's Series A closed (reported Jun 30 – Jul 6, 2026 across FinSMEs, SeeNews, Tech.eu, Net Influencer, and The Recursive).`,
    context: [
      { label: 'Recent corporate moves', text: 'Hypefy AI raises $7.2M in Series A funding (Jul 2026) — reported by 5 outlets in the same week' },
    ],
  },
  {
    streamItemId: 1769,
    headline: `Hypefy looks to be building something new ("launch") — same window as their $7.2M Series A, which closed just weeks earlier. A "launch" hostname appearing shortly after a funding round is a common pre-announcement pattern, though we don't have confirmation of what's launching.`,
    howWeKnow: `new hostname launch.hypefy.ai on the public certificate log, roughly 4–5 weeks after Hypefy's Series A closed (reported Jun 30 – Jul 6, 2026 across FinSMEs, SeeNews, Tech.eu, Net Influencer, and The Recursive).`,
    context: [
      { label: 'Recent corporate moves', text: 'Hypefy AI raises $7.2M in Series A funding (Jul 2026) — reported by 5 outlets in the same week' },
    ],
  },
];

async function main() {
  const db = await getDb();
  for (const e of ENTRIES) {
    await db.query(
      `INSERT INTO reasoning_cache (stream_item_id, headline, how_we_know, context)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (stream_item_id) DO UPDATE SET headline = EXCLUDED.headline, how_we_know = EXCLUDED.how_we_know,
         context = EXCLUDED.context, generated_at = now()`,
      [e.streamItemId, e.headline, e.howWeKnow ?? null, e.context ? JSON.stringify(e.context) : null],
    );
    console.log('cached reasoning for stream_item', e.streamItemId);
  }
  console.log(`done — ${ENTRIES.length} entries cached.`);
  process.exit(0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
