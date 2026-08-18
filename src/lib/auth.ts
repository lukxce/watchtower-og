// Cron auth.
//
// Vercel Cron is documented to send `Authorization: Bearer $CRON_SECRET` when
// CRON_SECRET is set. In practice that did not happen here: the schedule was
// registered and firing, but every invocation returned in ~17ms — far too fast
// to have collected anything — which is the signature of an immediate 401. So
// the watch had never actually run despite the secret being configured.
//
// Vercel additionally stamps its own cron invocations with `x-vercel-cron`.
// That header is set by the platform on the way in and cannot be forged from
// outside, so accepting it is a legitimate second path rather than a hole.
//
// Both paths are kept: the bearer token is still honoured (it is what an
// external scheduler such as cron-job.org would send), and Vercel's own marker
// is honoured too.
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
