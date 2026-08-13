// Hiring roundup: six near-identical "Job opening: …" rows tell an operator
// less than one line — "25 open roles, 9 technical, biggest concentration in
// Customer Success." One card per competitor on the Overview; the full list
// stays behind the Hiring filter. Departments come from the "(Dept, Location)"
// suffix the ATS collectors emit; roles without one are counted, not guessed.
import { getDb } from '@/db/client';

export interface HiringRoundup {
  competitorId: number;
  name: string;
  slug: string;
  total: number;
  technical: number;
  topDept: { name: string; n: number } | null;
  read: string;
}

const TECHNICAL = /engineer|developer|architect|\bai\b|\bml\b|data|devops|sre|security|platform/i;

export async function hiringRoundup(orgId: string): Promise<HiringRoundup[]> {
  const db = await getDb();
  const rows = await db.query<{ competitor_id: number; name: string; slug: string; title: string }>(
    `SELECT si.competitor_id, c.name, c.slug, si.title
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE c.org_id = $1 AND si.channel = 'jobs' AND si.status IN ('pending','signaled')`,
    [orgId],
  );
  const byComp = new Map<number, { name: string; slug: string; titles: string[] }>();
  for (const r of rows) {
    if (!byComp.has(r.competitor_id)) byComp.set(r.competitor_id, { name: r.name, slug: r.slug, titles: [] });
    byComp.get(r.competitor_id)!.titles.push(r.title);
  }
  const out: HiringRoundup[] = [];
  for (const [competitorId, v] of byComp) {
    const total = v.titles.length;
    const technical = v.titles.filter((t) => TECHNICAL.test(t)).length;
    const depts = new Map<string, number>();
    for (const t of v.titles) {
      const m = t.match(/\(([^,()]+),[^()]*\)\s*$/);
      if (m) depts.set(m[1].trim(), (depts.get(m[1].trim()) ?? 0) + 1);
    }
    const top = [...depts.entries()].sort((a, b) => b[1] - a[1])[0];
    const topDept = top ? { name: top[0], n: top[1] } : null;
    const bits = [`${total} open role${total > 1 ? 's' : ''}`];
    if (technical > 0) bits.push(`${technical} technical`);
    if (topDept && topDept.n >= 2) bits.push(`biggest concentration: ${topDept.name} (${topDept.n})`);
    out.push({ competitorId, name: v.name, slug: v.slug, total, technical, topDept, read: bits.join(' · ') });
  }
  return out.sort((a, b) => b.total - a.total);
}
