// The browser is the only thing that reliably knows where the customer is.
// `Intl.DateTimeFormat().resolvedOptions().timeZone` returns a proper IANA
// name, so we take it once and let them override it in settings later.
import { NextRequest, NextResponse } from 'next/server';
import { resolveOrgId } from '@/lib/tenant';
import { setTimeZone, getTimeZone, DEFAULT_TZ } from '@/lib/schedule';

export async function POST(req: NextRequest) {
  const orgId = await resolveOrgId();
  if (!orgId) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { timezone } = (await req.json().catch(() => ({}))) as { timezone?: string };
  if (!timezone) return NextResponse.json({ error: 'timezone required' }, { status: 400 });

  // Only ever set this automatically once. If the workspace has already been
  // given a timezone — by an earlier visit or by hand in settings — a browser
  // in an airport lounge must not silently move everyone's briefing.
  const current = await getTimeZone(orgId);
  if (current !== DEFAULT_TZ) return NextResponse.json({ timezone: current, changed: false });

  const ok = await setTimeZone(orgId, timezone);
  return ok
    ? NextResponse.json({ timezone, changed: true })
    : NextResponse.json({ error: 'invalid timezone' }, { status: 400 });
}
