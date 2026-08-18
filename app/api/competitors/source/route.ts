// Read and set the per-competitor pages that cannot be derived (Glassdoor
// employer id, Gartner product URL, LinkedIn company slug).
//
// This existed only as `scripts/set-source.mjs` — a script run against the
// database from a maintainer's laptop. That is fine for seeded demo data and
// unusable for a customer: when auto-discovery failed, their channel said
// "needs LinkedIn URL" forever and they had no way to answer it.
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db/client';
import { resolveOrgId } from '@/lib/tenant';
import { MANUAL_SOURCES, validateSourceUrl } from '@/lib/manualSources';

export const dynamic = 'force-dynamic';

/** Every competitor in the workspace with the state of each manual source. */
export async function GET() {
  const orgId = await resolveOrgId();
  if (!orgId) return NextResponse.json({ error: 'sign in required' }, { status: 401 });

  const db = await getDb();
  const comps = await db.query<{ id: number; name: string; slug: string }>(
    'SELECT id, name, slug FROM competitors WHERE org_id = $1 ORDER BY name',
    [orgId],
  );
  const rows = await db.query<{ competitor_id: number; channel: string; value: string }>(
    `SELECT competitor_id, channel, value FROM sources
     WHERE kind = 'url' AND competitor_id = ANY($1::int[])`,
    [comps.map((c) => c.id)],
  );

  return NextResponse.json({
    channels: MANUAL_SOURCES.map(({ channel, label, help, placeholder, findIt, autoDiscovered }) => ({
      channel, label, help, placeholder, findIt, autoDiscovered: !!autoDiscovered,
    })),
    competitors: comps.map((c) => ({
      ...c,
      sources: Object.fromEntries(
        MANUAL_SOURCES.map((s) => {
          const hit = rows.find((r) => r.competitor_id === c.id && r.channel === s.channel);
          // 'none' is what auto-discovery writes when it looked and found
          // nothing. Surfacing it as "not set" is right — the user can still
          // supply one — but it must not read as "we never tried".
          return [s.channel, hit && hit.value !== 'none' ? hit.value : null];
        }),
      ),
    })),
  });
}

export async function POST(req: NextRequest) {
  const orgId = await resolveOrgId();
  if (!orgId) return NextResponse.json({ error: 'sign in required' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { competitorId?: number; channel?: string; url?: string };
  const { competitorId, channel } = body;
  const url = (body.url ?? '').trim();
  if (!competitorId || !channel) {
    return NextResponse.json({ error: 'competitorId and channel are required' }, { status: 400 });
  }

  // Scope the write to this workspace explicitly. Without this check any
  // signed-in user could point another tenant's competitor at a page of their
  // choosing, which would then be collected and shown as that tenant's data.
  const db = await getDb();
  const owned = await db.query<{ id: number }>(
    'SELECT id FROM competitors WHERE id = $1 AND org_id = $2',
    [competitorId, orgId],
  );
  if (owned.length === 0) return NextResponse.json({ error: 'no such competitor' }, { status: 404 });

  // Empty clears it, so a wrong paste can be undone.
  if (!url) {
    await db.query('DELETE FROM sources WHERE competitor_id = $1 AND channel = $2 AND kind = $3', [
      competitorId, channel, 'url',
    ]);
    return NextResponse.json({ ok: true, url: null });
  }

  const bad = validateSourceUrl(channel, url);
  if (bad) return NextResponse.json({ error: bad }, { status: 400 });

  await db.query(
    `INSERT INTO sources (competitor_id, channel, kind, value) VALUES ($1, $2, 'url', $3)
     ON CONFLICT (competitor_id, channel, kind) DO UPDATE SET value = EXCLUDED.value`,
    [competitorId, channel, url],
  );
  return NextResponse.json({ ok: true, url });
}
