// Platform-admin identity and cross-tenant "view as" — lets the person who
// runs Watchtower (not a customer) see across every workspace, impersonate
// one to see exactly what that client sees, and leave feedback that teaches
// the LLM reasoning layer (interpretation_feedback, src/lib/reason.ts).
// Deliberately separate from Clerk's per-workspace org membership: a
// platform admin usually isn't a member of any customer's org at all — this
// is a superset capability, not a role inside one workspace.
import { cookies } from 'next/headers';

const ADMIN_EMAILS = (process.env.PLATFORM_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

// In local dev (no Clerk configured) there's only ever one workspace and no
// real users to distinguish — same "zero config locally" convention as the
// rest of tenant.ts, so admin tools just work without an allowlist to set up
// first. In production, only emails in PLATFORM_ADMIN_EMAILS qualify.
export async function isPlatformAdmin(): Promise<boolean> {
  if (!clerkConfigured) return true;
  if (ADMIN_EMAILS.length === 0) return false;
  const { currentUser } = await import('@clerk/nextjs/server');
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  return !!email && ADMIN_EMAILS.includes(email);
}

export const VIEW_AS_COOKIE = 'admin_view_org';

// The workspace a platform admin is currently impersonating, if any. Only
// ever returns non-null for an actual admin — a customer setting this cookie
// themselves (it's not signed, just a plain value) gets nothing back because
// isPlatformAdmin() gates it first.
export async function getViewAsOrg(): Promise<string | null> {
  if (!(await isPlatformAdmin())) return null;
  const store = await cookies();
  return store.get(VIEW_AS_COOKIE)?.value || null;
}
