// Cron auth.
//
// Vercel Cron is documented to send `Authorization: Bearer $CRON_SECRET` when
// CRON_SECRET is set. In practice that did not happen here: the schedule was
// registered and firing, but every invocation returned in ~17ms — far too fast
// to have collected anything — which is the signature of an immediate 401. So
// the watch had never actually run despite the secret being configured.
//
// Vercel additionally stamps its own cron invocations with `x-vercel-cron`.
// It is tempting to treat that as proof of origin. It is NOT: the header was
// sent by hand with curl from a laptop and the endpoint accepted it, returning
// authorizedVia "vercel-cron". Anyone can set it.
//
// So it is accepted only as a LIVENESS path, and the endpoint that relies on
// it must be independently safe to call — see `tooSoon()` below, which makes a
// forged call a no-op rather than a way to burn the crawl budget. The bearer
// token remains the real credential and the only one that bypasses the
// interval guard.
import { NextRequest } from 'next/server';

export interface AuthOutcome {
  ok: boolean;
  /** Which path allowed (or would have allowed) the request. */
  via: 'bearer' | 'vercel-cron' | 'no-secret-local' | 'rejected';
  /** Safe to return in a response body — booleans only, never values. */
  diagnostics: {
    secretConfigured: boolean;
    authorizationHeaderPresent: boolean;
    vercelCronHeaderPresent: boolean;
  };
}

export function authorize(req: NextRequest): AuthOutcome {
  const secret = process.env.CRON_SECRET;
  const authHeader = req.headers.get('authorization');
  const vercelCron = req.headers.get('x-vercel-cron');

  const diagnostics = {
    secretConfigured: !!secret,
    authorizationHeaderPresent: !!authHeader,
    vercelCronHeaderPresent: !!vercelCron,
  };

  if (!secret) return { ok: true, via: 'no-secret-local', diagnostics };
  if (authHeader === `Bearer ${secret}`) return { ok: true, via: 'bearer', diagnostics };
  if (vercelCron) return { ok: true, via: 'vercel-cron', diagnostics };
  return { ok: false, via: 'rejected', diagnostics };
}

/** Back-compat for existing callers that only want a boolean. */
export function authorized(req: NextRequest): boolean {
  return authorize(req).ok;
}

/**
 * Minimum gap between collection runs, enforced regardless of who asked.
 *
 * This is what makes the forgeable `x-vercel-cron` path harmless: a spoofed
 * call inside the window does nothing at all. A genuine bearer-authenticated
 * caller can override it, because that credential is not guessable.
 */
const MIN_RUN_GAP_MINUTES = 45;

export async function tooSoon(via: AuthOutcome['via']): Promise<{ blocked: boolean; lastRunAt?: string }> {
  if (via === 'bearer' || via === 'no-secret-local') return { blocked: false };
  const { getDb } = await import('@/db/client');
  const db = await getDb();
  const rows = await db.query<{ last: string | null }>(
    `SELECT to_char(max(run_at), 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS last FROM collection_runs`,
  );
  const last = rows[0]?.last;
  if (!last) return { blocked: false };
  const mins = (Date.now() - Date.parse(last)) / 60000;
  return mins < MIN_RUN_GAP_MINUTES ? { blocked: true, lastRunAt: last } : { blocked: false, lastRunAt: last };
}
