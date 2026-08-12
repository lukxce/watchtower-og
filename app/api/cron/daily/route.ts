// Daily cron (Vercel `crons` in vercel.json → 07:00). Runs website tier-1 +
// tier-2 on Mondays, all stream channels, then recomputes the Threat Index.
import { NextRequest, NextResponse } from 'next/server';
import { runCollection } from '@/lib/orchestrator';
import { computeThreat, snapshotThreat } from '@/lib/threat';
import { authorized } from '@/lib/auth';
import { distinctOrgIds } from '@/db/queries';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

// Runs every workspace's crawl sequentially. Fine for a handful of tenants;
// once there are enough workspaces to blow the serverless timeout, split this
// into one invocation per workspace (mirrors the per-competitor chunking plan
// in the handoff §5E) rather than trying to parallelize inside one function.
export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const tier2 = new Date().getUTCDay() === 1; // Monday
  const orgIds = await distinctOrgIds();
  const results: { orgId: string; lines: Awaited<ReturnType<typeof runCollection>> }[] = [];
  for (const orgId of orgIds) {
    const lines = await runCollection(orgId, { tier2 });
    await snapshotThreat(orgId);
    await computeThreat(orgId);
    results.push({ orgId, lines });
  }
  return NextResponse.json({ ranAt: new Date().toISOString(), tier2, workspaces: orgIds.length, results });
}
