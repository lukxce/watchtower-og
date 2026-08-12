// Daily cron (Vercel `crons` in vercel.json → 07:00). Runs website tier-1 +
// tier-2 on Mondays, all stream channels, then recomputes the Threat Index.
import { NextRequest, NextResponse } from 'next/server';
import { runCollection } from '@/lib/orchestrator';
import { computeThreat, snapshotThreat } from '@/lib/threat';
import { authorized } from '@/lib/auth';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const tier2 = new Date().getUTCDay() === 1; // Monday
  const lines = await runCollection({ tier2 });
  await snapshotThreat();
  const threat = await computeThreat();
  return NextResponse.json({ ranAt: new Date().toISOString(), tier2, lines, threat });
}
