// Set the workspace's own brand identity — what the Mentions module watches
// for. Minimal on purpose, same tone as /api/competitors: name in, row
// upserted, the next page load reflects it (mention search runs live, no
// "analyzing…" theater).
import { NextRequest, NextResponse } from 'next/server';
import { resolveOrgId } from '@/lib/tenant';
import { setBrandSettings } from '@/lib/brand';

export async function POST(req: NextRequest) {
  const orgId = await resolveOrgId();
  if (!orgId) return NextResponse.json({ error: 'sign in required' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { brandName?: string; brandDomain?: string; aliases?: string; description?: string; competencies?: string };
  const brandName = (body.brandName ?? '').trim();
  if (!brandName) return NextResponse.json({ error: 'brand name is required' }, { status: 400 });
  const brandDomain = (body.brandDomain ?? '').trim().replace(/^https?:\/\//, '').split('/')[0] || null;
  const aliases = (body.aliases ?? '')
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)
    .slice(0, 5);
  const description = (body.description ?? '').trim().slice(0, 1000) || null;
  const competencies = (body.competencies ?? '').trim().slice(0, 500) || null;

  await setBrandSettings(orgId, brandName, brandDomain, aliases, description, competencies);
  return NextResponse.json({ ok: true });
}
