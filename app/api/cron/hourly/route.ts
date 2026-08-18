// Hourly cron. Vercel fires this in UTC; the job itself decides which
// workspaces are due by looking at THEIR local time.
//
// Replaces the old `0 7 * * *` daily job, which ran at 07:00 UTC — 03:00 in
// New York, midnight in Los Angeles. "First light" has to mean first light
// where the customer is, or the whole premise is decoration.
import { NextRequest, NextResponse } from 'next/server';
import { runCollection } from '@/lib/orchestrator';
import { computeThreat, snapshotThreat } from '@/lib/threat';
import { authorize, tooSoon } from '@/lib/auth';
import { workspacesAtLocalHour, COLLECT_HOUR, DELIVER_HOUR } from '@/lib/schedule';
import { getDb } from '@/db/client';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  // On rejection, say WHICH condition failed — booleans only, never the
  // secret. A 401 with no detail is how this went undiagnosed for five days.
  const auth = authorize(req);
  if (!auth.ok) {
    return NextResponse.json({ error: 'unauthorized', ...auth.diagnostics }, { status: 401 });
  }
  // The vercel-cron header is forgeable (verified — curl set it and was let
  // in), so anything reached that way is rate-limited. A real bearer token
  // skips this.
  const gap = await tooSoon(auth.via);
  if (gap.blocked) {
    return NextResponse.json(
      { skipped: 'ran too recently', lastRunAt: gap.lastRunAt, authorizedVia: auth.via },
      { status: 429 },
    );
  }

  const now = new Date();

  const toCollect = await workspacesAtLocalHour(COLLECT_HOUR, now);
  const toDeliver = await workspacesAtLocalHour(DELIVER_HOUR, now);

  // Works on one cron a day as well as on twenty-four.
  //
  // On Vercel Pro this runs hourly: a workspace is collected at its local
  // 04:00 and delivered at 07:00, three hours apart, which is what you want
  // when collection is slow. On Hobby, where crons only fire once a day, the
  // single run lands on ONE of those hours and the other would never happen.
  //
  // So: if a workspace is due for delivery and has not been collected today,
  // collect it first. Self-correcting, needs no flag, and on the hourly
  // schedule it simply never triggers because 04:00 already did the work.
  const collectedToday = new Set(
    (await (await getDb()).query<{ org_id: string }>(
      `SELECT DISTINCT org_id FROM usage_daily
       WHERE meter = 'page_fetch' AND period = CURRENT_DATE AND units > 0`,
    )).map((r) => r.org_id),
  );
  for (const ws of toDeliver) {
    if (!collectedToday.has(ws.orgId) && !toCollect.some((c) => c.orgId === ws.orgId)) {
      toCollect.push(ws);
    }
  }

  // Tier-2 page capture is a Monday job — but Monday in the workspace's own
  // timezone, not UTC, or a Sydney workspace gets it on Sunday afternoon.
  const collected: { orgId: string; timezone: string; lines: unknown }[] = [];
  for (const ws of toCollect) {
    const localDay = new Intl.DateTimeFormat('en-GB', { timeZone: ws.timezone, weekday: 'short' }).format(now);
    const lines = await runCollection(ws.orgId, { tier2: localDay === 'Mon' });
    await snapshotThreat(ws.orgId);
    await computeThreat(ws.orgId);
    collected.push({ orgId: ws.orgId, timezone: ws.timezone, lines });
  }

  // Digest delivery lands here once email exists (docs/ROADMAP.md 1.4). Until
  // then the due list is still reported, so the schedule can be verified
  // before anything is actually sent.
  const delivered = toDeliver.map((w) => ({ orgId: w.orgId, timezone: w.timezone }));

  return NextResponse.json({
    authorizedVia: auth.via,
    ranAt: now.toISOString(),
    utcHour: now.getUTCHours(),
    collected: collected.length,
    dueForDigest: delivered.length,
    collectedWorkspaces: collected,
    digestWorkspaces: delivered,
  });
}
