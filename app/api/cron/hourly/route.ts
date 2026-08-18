// Hourly cron. Vercel fires this in UTC; the job itself decides which
// workspaces are due by looking at THEIR local time.
//
// Replaces the old `0 7 * * *` daily job, which ran at 07:00 UTC — 03:00 in
// New York, midnight in Los Angeles. "First light" has to mean first light
// where the customer is, or the whole premise is decoration.
import { NextRequest, NextResponse } from 'next/server';
import { runCollection } from '@/lib/orchestrator';
import { computeThreat, snapshotThreat } from '@/lib/threat';
import { authorized } from '@/lib/auth';
import { workspacesAtLocalHour, COLLECT_HOUR, DELIVER_HOUR } from '@/lib/schedule';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const now = new Date();

  const toCollect = await workspacesAtLocalHour(COLLECT_HOUR, now);
  const toDeliver = await workspacesAtLocalHour(DELIVER_HOUR, now);

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
    ranAt: now.toISOString(),
    utcHour: now.getUTCHours(),
    collected: collected.length,
    dueForDigest: delivered.length,
    collectedWorkspaces: collected,
    digestWorkspaces: delivered,
  });
}
