// Workspace's own brand identity. Nothing is guessed here — a workspace has
// no brand configured until someone sets it, and the mentions module says so
// honestly instead of pretending to know who "we" are.
import { getDb } from '@/db/client';

export interface BrandSettings {
  configured: boolean;
  brandName: string;
  brandDomain: string | null;
  aliases: string[];
}

const EMPTY: BrandSettings = { configured: false, brandName: '', brandDomain: null, aliases: [] };

export async function getBrandSettings(orgId: string): Promise<BrandSettings> {
  const db = await getDb();
  const rows = await db.query<{ brand_name: string; brand_domain: string | null; aliases: string[] | string }>(
    'SELECT brand_name, brand_domain, aliases FROM org_settings WHERE org_id = $1',
    [orgId],
  );
  const r = rows[0];
  if (!r) return EMPTY;
  const aliases = typeof r.aliases === 'string' ? JSON.parse(r.aliases) : r.aliases;
  return { configured: true, brandName: r.brand_name, brandDomain: r.brand_domain, aliases: aliases ?? [] };
}

export async function setBrandSettings(orgId: string, brandName: string, brandDomain: string | null, aliases: string[]): Promise<void> {
  const db = await getDb();
  await db.query(
    `INSERT INTO org_settings (org_id, brand_name, brand_domain, aliases, updated_at)
     VALUES ($1, $2, $3, $4, now())
     ON CONFLICT (org_id) DO UPDATE SET brand_name = EXCLUDED.brand_name, brand_domain = EXCLUDED.brand_domain,
       aliases = EXCLUDED.aliases, updated_at = now()`,
    [orgId, brandName, brandDomain, JSON.stringify(aliases)],
  );
}
