// Set or clear the platform-admin "view as workspace" cookie. Plain GET
// links (not a form) on purpose — this is a same-origin admin-only nav
// action, not user data submission.
import { NextRequest, NextResponse } from 'next/server';
import { isPlatformAdmin, VIEW_AS_COOKIE } from '@/lib/adminAuth';

export async function GET(req: NextRequest) {
  if (!(await isPlatformAdmin())) return NextResponse.json({ error: 'not authorized' }, { status: 403 });

  const url = new URL(req.url);
  const org = url.searchParams.get('org');
  const clear = url.searchParams.get('clear');

  if (clear) {
    const res = NextResponse.redirect(new URL('/admin/workspaces', req.url));
    res.cookies.delete(VIEW_AS_COOKIE);
    return res;
  }
  if (!org) return NextResponse.json({ error: 'org is required' }, { status: 400 });

  const res = NextResponse.redirect(new URL('/overview', req.url));
  res.cookies.set(VIEW_AS_COOKIE, org, { httpOnly: true, sameSite: 'lax', path: '/' });
  return res;
}
