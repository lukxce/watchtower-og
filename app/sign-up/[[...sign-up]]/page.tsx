import { SignUp } from '@clerk/nextjs';
import { clerkConfigured } from '@/lib/tenant';

export const dynamic = 'force-dynamic';

export default function SignUpPage() {
  if (!clerkConfigured) {
    return (
      <main className="auth-shell">
        <div className="auth-head">
          <h1>Auth isn&apos;t configured</h1>
          <p>Set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY to enable sign-up. Locally you&apos;re already in the default workspace — go to <a href="/feed">/feed</a>.</p>
        </div>
      </main>
    );
  }
  return (
    <main className="auth-shell">
      <SignUp />
    </main>
  );
}
