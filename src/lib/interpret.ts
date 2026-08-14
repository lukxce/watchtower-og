// Signal interpretation — "the tower reads, you decide" (BRAND.md law #1).
// Raw collector titles record WHAT WE OBSERVED ("Subdomain observed: x") and
// stay in the database as the citation. What the customer reads is the
// CONCLUSION in plain language, with the observation kept underneath as the
// how-we-know line. Deterministic templates only: nothing is inferred beyond
// what the observation supports.
//
// Deliberately per-signal and terse. A feed card is JUST the signal — the
// whole-picture reasoning (connecting moves, buildouts, hiring into one
// story per competitor) lives in competitor reads (src/lib/reason.ts),
// rendered on Battlecards and Competitors, never as commentary under every
// feed card. That approach was tried and rejected: it buried the feed in
// text and reasoned about signals in isolation.
export interface Interpreted {
  headline: string;
  howWeKnow?: string;
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
