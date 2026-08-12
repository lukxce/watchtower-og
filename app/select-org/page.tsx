import { OrganizationList } from '@clerk/nextjs';
import { clerkConfigured } from '@/lib/tenant';

export const dynamic = 'force-dynamic';

// A signed-in user with no active workspace lands here — create a new
// workspace or switch into one they already belong to.
export default function SelectOrgPage() {
  if (!clerkConfigured) {
    return (
      <main className="auth-shell">
        <div className="auth-head">
          <h1>Auth isn&apos;t configured</h1>
          <p>Set Clerk keys to enable workspaces. Locally you&apos;re already in the default workspace — go to <a href="/feed">/feed</a>.</p>
        </div>
      </main>
    );
  }
  return (
    <main className="auth-shell">
      <div className="auth-head">
        <h1>Choose a workspace</h1>
        <p>Every competitor set, signal, and battlecard lives inside a workspace.</p>
      </div>
      <OrganizationList afterSelectOrganizationUrl="/feed" afterCreateOrganizationUrl="/feed" hidePersonal />
    </main>
  );
}
