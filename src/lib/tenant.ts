// Tenant resolution. Every competitor/signal/battlecard row is scoped to a
// workspace (org_id). In production that's a Clerk organization id; locally,
// when Clerk isn't configured (no publishable key in .env), everything falls
// back to a single 'dev-workspace' so `npm run dev` keeps working with zero
// setup — matching the rest of this repo's "zero config locally" convention.
import { redirect } from 'next/navigation';
import { getViewAsOrg } from './adminAuth';
import { DEMO_ORG_ID, isDemo } from './demo';

export const DEV_ORG_ID = 'dev-workspace';
export const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

// Server Components / route handlers: resolve the current workspace or bounce
// to sign-in / the org picker. Use this at the top of every (app) page. A
// platform admin impersonating a workspace (see adminAuth.ts) overrides
// everything else — that's the whole point of "view as".
export async function requireOrgId(): Promise<string> {
  const viewAs = await getViewAsOrg();
  if (viewAs) return viewAs;
  // Public demo (see lib/demo.ts): pinned to one hardcoded workspace, so a
  // demo visitor can never resolve to a real customer's data.
  if (await isDemo()) return DEMO_ORG_ID;
  if (!clerkConfigured) return DEV_ORG_ID;
  const { auth } = await import('@clerk/nextjs/server');
  const { userId, orgId, orgSlug } = await auth();
  if (!userId) redirect('/sign-in');
  if (!orgId) redirect('/select-org');
  // Fire-and-forget: registers the workspace (or bumps last_seen_at) so it
  // shows up under /admin/workspaces even with zero competitors added yet.
  // Never blocks or fails the page on a write hiccup. Dynamically imported,
  // same reason as the Clerk import above: this file is pulled in by the
  // ROOT layout (every page, including the public marketing site and
  // sign-in/up), and a static import of '@/db/queries' would drag the whole
  // DB client (PGlite + postgres + node:path) into every single page's
  // module graph even when it's never called. That regression is what broke
  // the site the first time this landed — keep this import dynamic.
  import('@/db/queries')
    .then((m) => m.touchWorkspace(orgId, orgSlug ?? null))
    .catch(() => {});
  return orgId;
}

// API routes: same resolution, but returns null instead of redirecting so the
// caller can respond with 401/400 JSON.
// NOTE: deliberately does NOT honour demo mode. This is the path API routes
// use, so a demo visitor gets null here and every mutation 401s. Read-only
// browsing is the whole grant.
export async function resolveOrgId(): Promise<string | null> {
  const viewAs = await getViewAsOrg();
  if (viewAs) return viewAs;
  if (!clerkConfigured) return DEV_ORG_ID;
  const { auth } = await import('@clerk/nextjs/server');
  const { orgId } = await auth();
  return orgId ?? null;
}
