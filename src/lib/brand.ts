// Workspace's own identity — who "we" are. Nothing is guessed: a workspace
// has no brand configured until someone sets it, and every feature that
// depends on it (Mentions, personalized "How {brand} wins" on battlecards,
// competitor recommendations at onboarding) says so honestly instead of
// pretending. description/competencies exist so generation steps can write
// literally how THIS company wins, not abstract advice.
import { getDb } from '@/db/client';

export interface BrandSettings {
  configured: boolean;
  brandName: string;
  brandDomain: string | null;
  aliases: string[];
  description: string | null;
  competencies: string | null;
}

const EMPTY: BrandSettings = { configured: false, brandName: '', brandDomain: null, aliases: [], description: null, competencies: null };

export async function getBrandSettings(orgId: string): Promise<BrandSettings> {
  const db = await getDb();
  const rows = await db.query<{ brand_name: string; brand_domain: string | null; aliases: string[] | string; description: string | null; competencies: string | null }>(
    'SELECT brand_name, brand_domain, aliases, description, competencies FROM org_settings WHERE org_id = $1',
    [orgId],
  );
  const r = rows[0];
  if (!r) return EMPTY;
  const aliases = typeof r.aliases === 'string' ? JSON.parse(r.aliases) : r.aliases;
  return {
    configured: true,
    brandName: r.brand_name,
    brandDomain: r.brand_domain,
    aliases: aliases ?? [],
    description: r.description,
    competencies: r.competencies,
  };
}

export async function setBrandSettings(
  orgId: string,
  brandName: string,
  brandDomain: string | null,
  aliases: string[],
  description?: string | null,
  competencies?: string | null,
): Promise<void> {
  const db = await getDb();
  await db.query(
    `INSERT INTO org_settings (org_id, brand_name, brand_domain, aliases, description, competencies, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, now())
     ON CONFLICT (org_id) DO UPDATE SET brand_name = EXCLUDED.brand_name, brand_domain = EXCLUDED.brand_domain,
       aliases = EXCLUDED.aliases, description = COALESCE(EXCLUDED.description, org_settings.description),
       competencies = COALESCE(EXCLUDED.competencies, org_settings.competencies), updated_at = now()`,
    [orgId, brandName, brandDomain, JSON.stringify(aliases), description ?? null, competencies ?? null],
  );
}
