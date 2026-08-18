// Page tiering — which pages get re-checked how often, and which changes are
// worth telling the customer about.
//
// The rule that keeps this cheap: we do NOT re-monitor a whole blog. Most
// pages are only interesting the moment they appear.
//
//   Tier 1  re-fetched DAILY    — pricing, plans, home, product, platform.
//                                 A change here is a business event.
//   Tier 2  re-fetched WEEKLY   — customers, case studies, integrations,
//                                 partners, about, /compare, /vs-*, AND any
//                                 blog post that names us or a tracked rival.
//   Tier 3  fetched ONCE, on publication — everything else, the blog archive
//                                 included. We care THAT they published, not
//                                 whether they later fixed a typo.
//
// A tier-3 page earns promotion to tier 2 by naming someone: the one fetch we
// do on publication is also the mention scan. That promotion is the whole
// trick — it means the competitive content gets watched properly while the
// other 900 posts cost one fetch each, ever.
import { LOCALE } from '@/lib/sitemap';

export type Tier = 1 | 2 | 3;

const T1 = [/^\/$/, /^\/pricing/, /^\/plans?$/, /^\/products?(\/|$)/, /^\/platform/, /^\/features?(\/|$)/, /^\/solutions?(\/|$)/, /^\/services(\/|$)/];
const T2 = [/^\/customers?(\/|$)/, /^\/case-?stud/, /^\/success-stor/, /^\/integrations?(\/|$)/, /^\/partners?(\/|$)/, /^\/about/, /^\/company/, /^\/team/, /^\/compare/, /^\/why-/, /(^|\/)vs-/, /-vs-/, /^\/security/, /^\/changelog/, /^\/releases?(\/|$)/, /^\/whats-new/];

/** Pages whose only job is to list other pages — never worth monitoring. */
const INDEXY = /^\/(blog|news|resources|library|guides|articles|posts|tags?|category|categories|author|page)(\/(page\/)?\d*)?$/;

export function pathOf(url: string): string | null {
  try {
    return (new URL(url).pathname.toLowerCase().replace(/\/+$/, '') || '/');
  } catch {
    return null;
  }
}

/** Baseline tier from the URL alone, before any content is seen. */
export function baseTier(url: string): Tier {
  const p = pathOf(url);
  if (p === null) return 3;
  if (LOCALE.test(p)) return 3;       // translations follow the original
  if (INDEXY.test(p)) return 3;
  if (T1.some((r) => r.test(p))) return 1;
  if (T2.some((r) => r.test(p))) return 2;
  return 3;
}

/**
 * After the single on-publication fetch, a tier-3 page is promoted to tier 2
 * if it names us or any tracked competitor — that is competitive content and
 * it will be edited.
 *
 * Names are matched on a word boundary so "Klue" doesn't match "clue" and a
 * short brand doesn't match inside an unrelated word.
 */
export function promoteOnContent(currentTier: Tier, text: string, names: string[]): { tier: Tier; named: string[] } {
  if (currentTier < 3) return { tier: currentTier, named: [] };
  const named: string[] = [];
  for (const n of names) {
    if (n.length < 3) continue;
    const re = new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(text)) named.push(n);
  }
  return { tier: named.length > 0 ? 2 : 3, named };
}

/** How often each tier is re-checked. Tier 3 is never re-fetched. */
export const CADENCE_HOURS: Record<Tier, number | null> = {
  1: 24,
  2: 24 * 7,
  3: null, // fetch once, on publication
};

// ---------------------------------------------------------------------------
// What is worth showing as a signal
// ---------------------------------------------------------------------------

/**
 * A newly published page is not automatically news. "They posted a blog" is
 * the kind of card that trains people to ignore the feed — the exact failure
 * "the beacon is earned" exists to prevent.
 *
 * A new page is surfaced only when it is one of:
 *   - a tier 1 or tier 2 page (pricing, product, a comparison page…)
 *   - any page that names us or a tracked competitor
 *   - a page whose kind is inherently an event (changelog, release, launch)
 *
 * Everything else is recorded — it still counts toward publishing cadence and
 * is searchable — but it does not get a card.
 */
const EVENTFUL = /\/(changelog|releases?|whats-new|launch|announcing|introducing)(\/|$)/;

export function isNewPageWorthSurfacing(url: string, tier: Tier, named: string[]): boolean {
  if (tier <= 2) return true;
  if (named.length > 0) return true;
  const p = pathOf(url);
  return p !== null && EVENTFUL.test(p);
}

/**
 * A CHANGE to an existing page is surfaced on a stricter rule than a new page:
 * tier 1 always (a pricing edit is always news), tier 2 only when it names
 * someone. A tier 3 page is never re-fetched, so it cannot produce a change.
 */
export function isChangeWorthSurfacing(tier: Tier): boolean {
  // Tier 1 and 2 are already the curated set — anything that reached tier 2
  // is either structurally important or names someone, so a change to it is
  // worth a card. Tier 3 is never re-fetched and so cannot produce a change.
  return tier <= 2;
}
