// Channels whose target page cannot be derived from a domain.
//
// Most channels resolve themselves: a sitemap is at /sitemap.xml, an iTunes
// lookup takes a seller name, a CT log takes the domain. These three do not,
// and each fails differently:
//
//   glassdoor  keyed by an internal employer id — /Klue-Reviews-E2919580.htm.
//              Nothing in the domain produces 2919580.
//   gartner    the URL encodes market AND vendor AND product, e.g.
//              /reviews/market/competitive-and-market-intelligence-tools-…/
//              vendor/klue/product/klue/reviews.
//   linkedin   /company/<slug>, where the slug is NOT the domain. Measured:
//              crayon.co → crayon-co, grin.co → grin-inc-, usesignallabs.com →
//              signal-labs-cix, visualping.io → 9480446. Four of seven real
//              cases would have been wrong by derivation.
//
// LinkedIn is discovered automatically from the competitor's own footer, which
// covered 8 of 10; the other two link it nowhere. So even the "automatic" one
// needs a manual path, and until now that path was a script on a maintainer's
// laptop — meaning a customer could not fix their own workspace.
//
// Shared by the API route, the settings UI and the collectors so the three
// cannot drift apart on what counts as a valid URL.

export interface ManualSource {
  channel: string;
  label: string;
  /** What the user is being asked for, in their words. */
  help: string;
  placeholder: string;
  /** Where to find it, when it is not obvious. */
  findIt: string;
  /** True when we try to resolve it ourselves before asking. */
  autoDiscovered?: boolean;
  pattern: RegExp;
}

export const MANUAL_SOURCES: ManualSource[] = [
  {
    channel: 'linkedin',
    label: 'LinkedIn company page',
    help: 'Their LinkedIn company page — we read posts from it.',
    placeholder: 'https://www.linkedin.com/company/…',
    findIt: 'Usually linked in the footer of their website. We check there first.',
    autoDiscovered: true,
    pattern: /^https?:\/\/([a-z]{0,3}\.)?linkedin\.com\/company\/[A-Za-z0-9_-]+\/?$/i,
  },
  {
    channel: 'glassdoor',
    label: 'Glassdoor employer page',
    help: 'Their Glassdoor Reviews page — employee sentiment and rating trend.',
    placeholder: 'https://www.glassdoor.com/Reviews/Acme-Reviews-E123456.htm',
    findIt: 'Search Glassdoor for the company and copy the Reviews tab URL. It must contain the E‑number.',
    pattern: /^https?:\/\/([a-z]{2,3}\.)?glassdoor\.[a-z.]+\/.*-E\d+\.htm/i,
  },
  {
    channel: 'gartner',
    label: 'Gartner Peer Insights product page',
    help: 'Their Gartner Peer Insights product page — the enterprise buyer voice.',
    placeholder: 'https://www.gartner.com/reviews/market/…/vendor/…/product/…',
    findIt: 'Search Gartner Peer Insights for the product and copy the URL. Many smaller vendors are not listed at all.',
    pattern: /^https?:\/\/(www\.)?gartner\.com\/reviews\/market\/[^/]+\/vendor\/[^/]+\/product\/[^/]+/i,
  },
];

export function manualSource(channel: string): ManualSource | undefined {
  return MANUAL_SOURCES.find((s) => s.channel === channel);
}

/**
 * Is this a URL we can accept for that channel?
 *
 * Deliberately strict. A Glassdoor *company* page without the E-number, or a
 * LinkedIn *profile* rather than a company, both look right to a person and
 * return nothing from the vendor — which then reads as "this competitor has no
 * reviews" rather than "you pasted the wrong page".
 */
export function validateSourceUrl(channel: string, url: string): string | null {
  const spec = manualSource(channel);
  if (!spec) return 'unknown channel';
  if (!spec.pattern.test(url.trim())) return `That doesn’t look like a ${spec.label.toLowerCase()}.`;
  return null;
}
