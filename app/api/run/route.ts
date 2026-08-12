// Manual trigger: POST /api/run  { "channels": ["news"], "tier2": false }
// Runs a subset (or all) on demand — the "open Claude, say run it" equivalent.
import { NextRequest, NextResponse } from 'next/server';
import { runCollection } from '@/lib/orchestrator';
import { computeThreat } from '@/lib/threat';
import { authorized } from '@/lib/auth';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { channels?: string[]; tier2?: boolean };
  const lines = await runCollection({ channels: body.channels, tier2: body.tier2 });
  const threat = await computeThreat();
  return NextResponse.json({ ranAt: new Date().toISOString(), lines, threat });
}
