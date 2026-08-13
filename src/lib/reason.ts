// LLM reasoning layer — the actual "brain" behind synthesizeSignal. Claude
// reasons over the real, retrieved facts for a competitor (connect.ts's
// CompetitorContext: real corporate moves, hiring, product changes, the
// battlecard read if one exists, sibling buildouts) and writes the connected
// narrative, instead of a fixed regex/template splicing two strings
// together. This is strictly grounded, not free generation: the prompt hands
// over every fact as data and forbids stating anything not present in it —
// same "never fabricate" law as everywhere else in this product, just with a
// much smarter writer sitting on top of the facts.
//
// Falls back to null (caller degrades to the deterministic rule-based
// synthesizeSignalRules) when ANTHROPIC_API_KEY isn't set, the call fails, or
// the response doesn't parse — same honest-degradation pattern as
// score.ts's llmScore/heuristicScore split.
//
// Without a key, getCachedReasoning() is checked first — reasoning done by
// Claude Code by hand against the real data (scripts/reason-cache.ts), same
// pattern as battlecards.ts's Claude-in-session generation. A snapshot for
// the testing period, not a live loop.
import { getDb } from '@/db/client';
import { claudeJSON } from '@/lib/claude';
import type { CompetitorContext } from '@/lib/connect';
import type { Interpreted } from '@/lib/interpret';

export async function getCachedReasoning(streamItemId: number): Promise<Interpreted | null> {
  const db = await getDb();
  const rows = await db.query<{ headline: string; how_we_know: string | null; context: unknown }>(
    'SELECT headline, how_we_know, context FROM reasoning_cache WHERE stream_item_id = $1',
    [streamItemId],
  );
  const r = rows[0];
  if (!r) return null;
  const context = typeof r.context === 'string' ? JSON.parse(r.context) : r.context;
  return { headline: r.headline, howWeKnow: r.how_we_know ?? undefined, context: context ?? undefined };
}

export interface FeedbackExample {
  situation: string;
  whatWasSaid: string;
  note: string | null;
}

// Recent admin corrections, across every workspace — this is the "teach you"
// loop: an admin marks a shown headline wrong (with an optional note) while
// viewing any workspace, and that judgment generalizes to how reasoning
// behaves for every workspace going forward. No customer/competitor data
// crosses workspaces this way, only the admin's own generalized correction.
const FEEDBACK_LIMIT = 8;
export async function getFeedbackExamples(): Promise<FeedbackExample[]> {
  const db = await getDb();
  const rows = await db.query<{ competitor_name: string; channel: string; signal_title: string; headline_shown: string; note: string | null }>(
    `SELECT competitor_name, channel, signal_title, headline_shown, note FROM interpretation_feedback
     WHERE verdict = 'incorrect' ORDER BY created_at DESC LIMIT $1`,
    [FEEDBACK_LIMIT],
  );
  return rows.map((r) => ({
    situation: `${r.competitor_name} · ${r.channel} · "${r.signal_title}"`,
    whatWasSaid: r.headline_shown,
    note: r.note,
  }));
}

const SYSTEM = `You are the reasoning layer inside Watchtower, a competitive-intelligence product. Your one job: given a single new signal about a competitor plus every real, dated fact already on file about that competitor, decide whether they genuinely connect — and if so, write the plain-language conclusion a busy operator would want.

Hard rules, non-negotiable:
- You may ONLY state facts present in the JSON you're given. Never invent a number, date, name, or event.
- A connection must be REAL and SPECIFIC — a shared theme, a timeline that lines up, an explicit narrative link. "They're both active" is not a connection.
- If nothing genuinely connects, say so — return the base headline essentially unchanged rather than forcing a link. A false connection is worse than no connection (this product's core promise is "no false fires").
- Write like an operator briefing a colleague, not like an AI — short, direct, no hedging filler, no "it's worth noting."
- "howWeKnow" must cite the actual sources (hostnames, dates, headline text) from the data — never a vague "based on analysis" type line.
- If corrections from a human reviewer are provided, treat them as binding judgment: don't repeat a mistake they flagged.

Reply ONLY with JSON: {"headline": string, "howWeKnow": string, "context": [{"label": string, "text": string}]} — context is optional connected material worth surfacing (omit or empty array if nothing substantive), max 3 items.`;

export async function llmSynthesize(
  base: Interpreted,
  channel: string,
  title: string,
  competitor: string,
  ctx: CompetitorContext,
  feedback: FeedbackExample[],
): Promise<Interpreted | null> {
  const payload = {
    signal: { competitor, channel, rawTitle: title, baseHeadline: base.headline },
    knownContext: {
      recentCorporateMoves: ctx.moves.slice(0, 6).map((m) => ({ title: m.title, date: m.date, url: m.url })),
      modelOrPricingShiftMoves: ctx.modelMoves.map((m) => m.title),
      hiringClusterSize: ctx.hireCluster,
      productPageChanges: ctx.productChanges,
      siblingBuildoutHostnames: ctx.siblingBuildouts,
      battlecardPositioning: ctx.positioning ?? null,
    },
    priorCorrectionsFromReviewer: feedback,
  };
  const result = await claudeJSON<{ headline?: string; howWeKnow?: string; context?: { label?: string; text?: string }[] }>(
    SYSTEM,
    JSON.stringify(payload),
    600,
  );
  if (!result || typeof result.headline !== 'string' || !result.headline.trim()) return null;
  const context = (result.context ?? [])
    .filter((c): c is { label: string; text: string } => !!c.label && !!c.text)
    .slice(0, 3);
  return {
    headline: result.headline.trim(),
    howWeKnow: typeof result.howWeKnow === 'string' && result.howWeKnow.trim() ? result.howWeKnow.trim() : base.howWeKnow,
    context: context.length ? context : undefined,
  };
}
