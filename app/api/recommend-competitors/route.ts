// Onboarding: recommend competitors from the workspace's own description of
// itself (or just a link). Claude does the reasoning when ANTHROPIC_API_KEY
// is set; without it we say so honestly ({available: false}) instead of
// returning a canned list dressed up as intelligence — recommendations that
// don't consider who YOU are would be exactly the generic noise this
// product exists to avoid.
import { NextRequest, NextResponse } from 'next/server';
import { resolveOrgId } from '@/lib/tenant';
import { claudeJSON } from '@/lib/claude';

const SYSTEM = `You recommend competitors for a company to track in a competitive-intelligence tool. Given how the company describes itself (and/or its website URL), return the 5-8 most direct competitors a team like theirs should watch. Prefer companies at a similar buyer/segment, then category leaders they will be compared against in deals. Reply ONLY as a JSON array of {"name": string, "domain": string (bare domain, no protocol), "reason": string (one short sentence, specific to the described company)}. Only real companies you are confident exist.`;

export async function POST(req: NextRequest) {
  const orgId = await resolveOrgId();
  if (!orgId) return NextResponse.json({ error: 'sign in required' }, { status: 401 });

  const body = (await req.json().catch(() => ({}))) as { description?: string; url?: string };
  const description = (body.description ?? '').trim().slice(0, 1500);
  const url = (body.url ?? '').trim().slice(0, 300);
  if (!description && !url) return NextResponse.json({ error: 'describe yourself or give a link' }, { status: 400 });

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ available: false, reason: 'AI recommendations need ANTHROPIC_API_KEY — add competitors manually for now, they baseline on the next crawl.' });
  }
  const recs = await claudeJSON<{ name: string; domain: string; reason: string }[]>(
    SYSTEM,
    JSON.stringify({ description: description || null, url: url || null }),
    900,
  );
  if (!recs) return NextResponse.json({ available: false, reason: 'recommendation call failed — try again or add manually.' });
  const clean = recs.filter((r) => r.name && /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(r.domain ?? '')).slice(0, 8);
  return NextResponse.json({ available: true, recommendations: clean });
}
