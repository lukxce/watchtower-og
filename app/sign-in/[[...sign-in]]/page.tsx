import { SignIn } from '@clerk/nextjs';
import { clerkConfigured } from '@/lib/tenant';

export const dynamic = 'force-dynamic';

export default function SignInPage() {
  if (!clerkConfigured) {
    return (
      <main className="auth-shell">
        <div className="auth-head">
          <h1>Auth isn&apos;t configured</h1>
          <p>Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to enable sign-in. Locally you&apos;re already in the default workspace — go to <a href="/feed">/feed</a>.</p>
        </div>
      </main>
    );
  }
  return (
    <main className="auth-shell">
      <SignIn fallbackRedirectUrl="/overview" />
    </main>
  );
}
