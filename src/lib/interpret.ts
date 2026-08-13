// Signal interpretation — "the tower reads, you decide" (BRAND.md law #1).
// Raw collector titles record WHAT WE OBSERVED ("Subdomain observed: x") and
// stay in the database as the citation. What the customer reads is the
// CONCLUSION in plain language, with the observation kept underneath as the
// how-we-know line. Deterministic templates only: nothing is inferred beyond
// what the observation supports.
//
// synthesizeSignal() layers cross-referencing on top of that base read: one
// signal in isolation ("Grin looks to be building something new") is a data
// point; read alongside what's already known about that competitor — a real
// pricing/business-model move in the news, the battlecard's authored read —
// it can become a conclusion. The upgrade only fires under a narrow,
// deterministic rule (never "this feels related"); everything else still
// gets a "what else we know" panel when real connected material exists, and
// falls back to the plain base read otherwise. No forced connections —
// BRAND.md law #3, no false fires.
import type { CompetitorContext } from '@/lib/connect';

// Same family as connect.ts's MODEL_MOVE — kept local since this one tests a
// news item's own title rather than classifying it for the context map.
const MODEL_MOVE_TITLE = /self-serve|self serve|month-to-month|no[- ]demo|free tier|freemium|repric|pricing model|business model|enterprise-only|instant access/i;

export interface ContextItem {
  label: string;
  text: string;
  url?: string;
}

export interface Interpreted {
  headline: string;
  howWeKnow?: string;
  context?: ContextItem[];
}

export function interpretSignal(channel: string, title: string, competitor: string): Interpreted {
  if (channel === 'subdomains') {
    const host = title.replace(/^Subdomain observed:\s*/, '');
    const label = host.split('.')[0];
    return {
      headline: `${competitor} looks to be building something new (“${label}”)`,
      howWeKnow: `new hostname ${host} appeared on the public certificate log — names like this usually go up before a launch`,
    };
  }
  if (channel === 'techstack') {
    return { headline: title.replace(/^Tech(nology)? (stack )?/i, `${competitor} added to their stack: `), howWeKnow: 'detected from their public site' };
  }
  // Channels whose titles are already human statements (news, jobs, events,
  // reviews, app releases…) pass through untouched.
  return { headline: title };
}

function monthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function contextPanel(ctx: CompetitorContext, requireSubstantive: boolean, ownTitle: string): ContextItem[] | undefined {
  const items: ContextItem[] = [];
  if (ctx.positioning) items.push({ label: 'Battlecard read', text: ctx.positioning });
  // A news item citing itself as "other context we have" is circular — drop
  // any move that IS the signal currently being interpreted.
  const otherMoves = ctx.moves.filter((m) => m.title !== ownTitle);
  if (otherMoves.length) {
    items.push({
      label: 'Recent corporate moves',
      text: otherMoves.slice(0, 3).map((m) => `${m.title} (${monthYear(m.date)})`).join(' · '),
      url: otherMoves[0].url ?? undefined,
    });
  }
  if (requireSubstantive && items.length < 2) return undefined; // don't clutter every card with a one-line panel
  return items.length ? items : undefined;
}

// Channels where "what else we know" is earned context rather than filler —
// strategic-signal channels, not routine technical detections. Showing the
// same battlecard blurb under a "WordPress detected" techstack card isn't a
// connection, it's decoration; BRAND.md law #2 says loud treatment (and this
// panel is loud — brand-tinted, always visible) has to be earned per-card.
const CONTEXT_ELIGIBLE = new Set(['subdomains', 'news', 'website', 'sitemap', 'appstore', 'events']);

// Given the base interpretation and the competitor's batched context (see
// connect.ts), decide whether a genuine cross-signal connection exists and,
// if so, fold it into the headline/how-we-know. Two directions, mirroring
// the two halves of the GRIN case: a fresh buildout hostname reads very
// differently next to a real pricing/self-serve move (subdomains → news),
// and a pricing/model headline reads very differently next to a fresh
// buildout hostname in the same window (news → subdomains).
export function synthesizeSignal(base: Interpreted, channel: string, title: string, ctx: CompetitorContext | undefined): Interpreted {
  if (!ctx || !CONTEXT_ELIGIBLE.has(channel)) return base;

  if (channel === 'subdomains' && ctx.modelMoves.length > 0) {
    const move = ctx.modelMoves[0];
    return {
      headline: `${base.headline} — and it's not isolated: ${move.title} (${monthYear(move.date)})`,
      howWeKnow: base.howWeKnow ? `${base.howWeKnow}; connected to a real move already on file: ${move.title}` : move.title,
      context: contextPanel(ctx, false, title),
    };
  }
  if (channel === 'news' && MODEL_MOVE_TITLE.test(title) && ctx.siblingBuildouts.length > 0) {
    return {
      ...base,
      headline: `${base.headline} — worth reading next to a fresh buildout hostname (${ctx.siblingBuildouts[0]}) spotted in the same window`,
      context: contextPanel(ctx, false, title),
    };
  }

  // No deterministic connection for this channel — return the base read,
  // still attaching a context panel if there's genuinely enough to show.
  return { ...base, context: contextPanel(ctx, true, title) };
}
