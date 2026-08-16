// Gates the internal app behind auth once Clerk is configured. Marketing
// pages (/, /pricing, /contact, /blog, sign-in/up) stay public; everything
// under the (app) route group requires a signed-in user with an active
// workspace (org). Without Clerk keys set, this is a no-op passthrough so
// `npm run dev` keeps working with zero setup — same convention as the DB
// (PGlite locally, Neon in prod).
import { NextResponse } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { DEMO_COOKIE } from '@/lib/demo';

const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const isProtectedRoute = createRouteMatcher([
  '/overview(.*)', '/feed(.*)', '/radar(.*)', '/competitors(.*)', '/compare(.*)', '/battlecards(.*)', '/ask(.*)', '/reports(.*)', '/alerts(.*)', '/admin(.*)', '/newsletters(.*)', '/industry(.*)',
]);

export default clerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      if (!isProtectedRoute(req)) return;
      // Public demo: browsing the real app with no account. tenant.ts pins
      // these requests to the demo workspace, and resolveOrgId() refuses
      // them, so every API mutation still fails closed.
      if (req.cookies.get(DEMO_COOKIE)?.value === '1') return;
      const { userId, orgId } = await auth();
      if (!userId) {
        const signIn = new URL('/sign-in', req.url);
        signIn.searchParams.set('redirect_url', req.url);
        return NextResponse.redirect(signIn);
      }
      if (!orgId) return NextResponse.redirect(new URL('/select-org', req.url));
    })
  : function passthrough() {
      return NextResponse.next();
    };

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
