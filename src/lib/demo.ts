// Public demo mode. A visitor can browse the whole real product — Overview,
// Feed, Battlecards, Radar, Industry, Mentions — with no account, by hitting
// /demo. That sets a cookie; middleware.ts then lets them past the auth gate
// and tenant.ts pins them to the Hypefy demo workspace.
//
// Two deliberate limits, both enforced elsewhere rather than by trust:
//   1. The org is hardcoded here, so a demo visitor can never resolve to a
//      real customer's workspace no matter what they send.
//   2. resolveOrgId() (the API-route path) does NOT honour this cookie, so
//      every mutation — add competitor, feedback, run collection — fails
//      closed with a 401 in demo mode. Browsing works; writing does not.
import { cookies } from 'next/headers';

// Its own workspace, NOT the dev/Hypefy one: /demo is world-readable and the
// dev workspace holds a real company's private competitive analysis. This one
// is Watchtower tracking its own market (see scripts/seed-demo.ts).
export const DEMO_ORG_ID = 'demo-workspace';
export const DEMO_COOKIE = 'wt_demo';

export async function isDemo(): Promise<boolean> {
  const store = await cookies();
  return store.get(DEMO_COOKIE)?.value === '1';
}
