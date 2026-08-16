import { NextResponse } from 'next/server';
import { DEMO_COOKIE } from '@/lib/demo';

// Public entry point to the demo: set the flag, then drop the visitor into
// the real Overview. Everything after this is the actual product.
export const dynamic = 'force-dynamic';

export function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/overview', req.url));
  res.cookies.set(DEMO_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 4, // a browsing session, not a standing grant
  });
  return res;
}
