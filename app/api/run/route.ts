// Manual trigger: POST /api/run  { "channels": ["news"], "tier2": false }
// Runs a subset (or all) on demand — the "open Claude, say run it" equivalent.
import { NextRequest, NextResponse } from 'next/server';
import { runCollection } from '@/lib/orchestrator';
import { computeThreat } from '@/lib/threat';
import { authorized } from '@/lib/auth';
import { resolveOrgId } from '@/lib/tenant';

export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const body = (await req.json().catch(() => ({}))) as { channels?: string[]; tier2?: boolean; orgId?: string };
  // A CRON_SECRET-bearing caller (server-to-server) may target any workspace
  // explicitly; a logged-in dashboard user runs against their own session org.
  const orgId = body.orgId ?? (await resolveOrgId());
  if (!orgId) return NextResponse.json({ error: 'no workspace — pass orgId or sign in' }, { status: 400 });
  const lines = await runCollection(orgId, { channels: body.channels, tier2: body.tier2 });
  const threat = await computeThreat(orgId);
  return NextResponse.json({ ranAt: new Date().toISOString(), orgId, lines, threat });
}
