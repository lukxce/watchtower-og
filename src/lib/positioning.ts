// Market positioning map (Competitors page). The two axes and each
// competitor's placement are an authored editorial read, not something
// derived automatically from signals — the same convention already used for
// battlecard strategy text in scripts/battlecards.ts: live numbers stay
// computed, strategic judgment stays human and is labeled as such. Update
// coordinates by hand as the read on a competitor changes.
export interface PositionEntry {
  slug: string;
  x: number; // 0 = fully self-serve, 100 = fully managed/agency-led
  y: number; // 0 = SMB/creator-first, 100 = enterprise/brand-first
  note: string;
}

export const POSITIONING: PositionEntry[] = [
  { slug: 'upfluence', x: 58, y: 68, note: 'managed, enterprise brands' },
  { slug: 'creatoriq', x: 68, y: 88, note: 'most enterprise, most agency-managed' },
  { slug: 'grin', x: 28, y: 40, note: 'self-serve, DTC-first' },
  { slug: 'modash', x: 14, y: 20, note: 'self-serve, discovery entry point' },
  { slug: 'thecirqle', x: 54, y: 38, note: 'niche managed-affiliate, mid-market' },
];

export function positionOf(slug: string): PositionEntry | undefined {
  return POSITIONING.find((p) => p.slug === slug);
}
