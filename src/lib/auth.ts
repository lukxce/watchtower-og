// Cron/run auth: Vercel Cron sends `Authorization: Bearer $CRON_SECRET` when
// CRON_SECRET is set as an env var. If unset (local dev) we allow the call.
import { NextRequest } from 'next/server';

export function authorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // local dev
  return req.headers.get('authorization') === `Bearer ${secret}`;
}
