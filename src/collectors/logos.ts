// Customer logos (spec §4.9): mine alt-text from homepage/customers/case-study
// pages, gated on social-proof context. Additions = wins, disappearances = churn.
import { smartFetch } from '@/lib/fetchLadder';
import { convert } from 'html-to-text';
import { ingestItems, recordRun, type Competitor } from '@/db/queries';

const PROOF = /(trusted by|customers|brands|case stud|success stor|loved by|powering|join \d)/i;

function extractLogos(html: string): string[] {
  const names = new Set<string>();
  for (const m of html.matchAll(/alt="([^"]{2,40}?)(?:\s+logo)?"/gi)) {
    const raw = m[1].trim();
    if (/logo|icon|customer|brand/i.test(m[0]) && /^[A-Z0-9][\w&.' -]{1,38}$/.test(raw)) names.add(raw);
  }
  return [...names];
}

export async function collectLogos(comp: Competitor): Promise<string> {
  const pages = [`https://${comp.domain}/`, `https://${comp.domain}/customers`, `https://${comp.domain}/case-studies`];
  const found = new Set<string>();
  let anyOk = false;
  for (const url of pages) {
    const res = await smartFetch(url);
    if (res.status !== 200) continue;
    anyOk = true;
    if (!PROOF.test(convert(res.html, { wordwrap: false }))) continue;
    for (const n of extractLogos(res.html)) found.add(n);
  }
  if (!anyOk) {
    await recordRun(comp.id, 'logos', false, 0, 'no customer pages reachable');
    return 'FAILED (no pages)';
  }
  const { added, fresh } = await ingestItems(
    comp.id,
    'logos',
    [...found].map((name) => ({ externalId: `logo:${name.toLowerCase()}`, title: `Customer/brand shown: ${name}` })),
  );
  await recordRun(comp.id, 'logos', true, added, `${found.size} customer names visible`);
  return `+${added} (${fresh} pending) — ${found.size} names`;
}
