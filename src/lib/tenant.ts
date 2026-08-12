// Tenant resolution. Every competitor/signal/battlecard row is scoped to a
// workspace (org_id). In production that's a Clerk organization id; locally,
// when Clerk isn't configured (no publishable key in .env), everything falls
// back to a single 'dev-workspace' so `npm run dev` keeps working with zero
// setup — matching the rest of this repo's "zero config locally" convention.
import { redirect } from 'next/navigation';

export const DEV_ORG_ID = 'dev-workspace';
export const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

// Server Components / route handlers: resolve the current workspace or bounce
// to sign-in / the org picker. Use this at the top of every (app) page.
export async function requireOrgId(): Promise<string> {
  if (!clerkConfigured) return DEV_ORG_ID;
  const { auth } = await import('@clerk/nextjs/server');
  const { userId, orgId } = await auth();
  if (!userId) redirect('/sign-in');
  if (!orgId) redirect('/select-org');
  return orgId;
}

// API routes: same resolution, but returns null instead of redirecting so the
// caller can respond with 401/400 JSON.
export async function resolveOrgId(): Promise<string | null> {
  if (!clerkConfigured) return DEV_ORG_ID;
  const { auth } = await import('@clerk/nextjs/server');
  const { orgId } = await auth();
  return orgId ?? null;
}
