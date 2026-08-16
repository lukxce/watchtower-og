import { NextResponse } from 'next/server';
import { DEMO_COOKIE } from '@/lib/demo';

export const dynamic = 'force-dynamic';

export function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/', req.url));
  res.cookies.set(DEMO_COOKIE, '', { path: '/', maxAge: 0 });
  return res;
}
