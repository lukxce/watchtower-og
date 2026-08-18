// The brain — ONE whole-picture read per competitor, not per-signal
// commentary. (Per-signal synthesis was tried and rejected: it buried the
// feed in text and reasoned about each signal in isolation.) A read
// considers everything on file together — corporate moves, buildout
// hostnames, hiring, product changes, the battlecard — and says what's
// actually happening at that company. Reads render on Battlecards and
// Competitors; the Feed stays plain signals.
//
// Two generation paths, same as battlecards: Claude-in-session by hand
// (scripts/reads.ts, no API key needed) or live via llmCompetitorRead when
// ANTHROPIC_API_KEY is set. Both land in competitor_reasoning.
import { getDb } from '@/db/client';
import { claudeJSON } from '@/lib/claude';
import type { CompetitorContext } from '@/lib/connect';

export interface FeedbackExample {
  situation: string;
  whatWasSaid: string;
  note: string | null;
}

// Recent admin corrections, across every workspace — the "teach it" loop.
// Only the admin's own generalized judgment crosses workspace boundaries,
// never raw customer/competitor data.
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

export interface CompetitorRead {
  hook: string;
  narrative: string;
  evidence: { label: string; text: string }[];
  generatedAt: string;
}

export async function getCompetitorReads(orgId: string): Promise<Map<string, CompetitorRead>> {
  const db = await getDb();
  const rows = await db.query<{ slug: string; hook: string; narrative: string; evidence: unknown; generated_at: string }>(
    `SELECT c.slug, r.hook, r.narrative, r.evidence, r.generated_at
     FROM competitor_reasoning r JOIN competitors c ON c.id = r.competitor_id WHERE c.org_id = $1`,
    [orgId],
  );
  const map = new Map<string, CompetitorRead>();
  for (const r of rows) {
    const evidence = typeof r.evidence === 'string' ? JSON.parse(r.evidence) : r.evidence;
    map.set(r.slug, { hook: r.hook, narrative: r.narrative, evidence: evidence ?? [], generatedAt: r.generated_at });
  }
  return map;
}

const SYSTEM = `You are the intelligence analyst inside Fortress HQ, a competitive-intelligence product. Given EVERYTHING on file about one competitor — corporate moves, new buildout hostnames, hiring, product-page changes, the authored battlecard — write the single read a busy operator needs: what is actually happening at this company, considered as a whole.

Hard rules, non-negotiable:
- Only state facts present in the JSON. Never invent a number, date, name, or event.
- Reason about the WHOLE picture — how the facts fit together — not one signal at a time.
- Where the facts confirm each other (their own press + a matching hostname), be confident. Where the link is only timing, say so honestly. No false fires.
- Operator voice: short, direct, no hedging filler. 3–4 sentences maximum.
- If corrections from a human reviewer are provided, treat them as binding judgment.

Reply ONLY with JSON: {"hook": string (max 8 words, the one-line takeaway), "narrative": string (the read, 3-4 sentences), "evidence": [{"label": string, "text": string}] (max 3, the dated facts that carry the read)}.`;

// Live path — used when ANTHROPIC_API_KEY is set (e.g. the daily cron
// regenerating reads after each crawl). Returns null without a key so the
// cached in-session reads simply stay current until the next hand refresh.
export async function llmCompetitorRead(
  competitor: string,
  ctx: CompetitorContext,
  feedback: FeedbackExample[],
): Promise<{ hook: string; narrative: string; evidence: { label: string; text: string }[] } | null> {
  const payload = {
    competitor,
    onFile: {
      corporateMoves: ctx.moves.slice(0, 8).map((m) => ({ title: m.title, date: m.date })),
      modelOrPricingShiftMoves: ctx.modelMoves.map((m) => m.title),
      buildoutHostnames: ctx.siblingBuildouts,
      technicalRolesOpen: ctx.hireCluster,
      productPageChanges: ctx.productChanges,
      battlecardPositioning: ctx.positioning ?? null,
    },
    priorCorrectionsFromReviewer: feedback,
  };
  const result = await claudeJSON<{ hook?: string; narrative?: string; evidence?: { label?: string; text?: string }[] }>(
    SYSTEM,
    JSON.stringify(payload),
    700,
  );
  if (!result || !result.hook?.trim() || !result.narrative?.trim()) return null;
  const evidence = (result.evidence ?? [])
    .filter((e): e is { label: string; text: string } => !!e.label && !!e.text)
    .slice(0, 3);
  return { hook: result.hook.trim(), narrative: result.narrative.trim(), evidence };
}
