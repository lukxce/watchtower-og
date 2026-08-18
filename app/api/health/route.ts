// Deployment health: which capabilities are actually configured in THIS
// environment, as booleans. Never values.
//
// This exists because local .env.local and Vercel's environment are different
// places, and reading the former to reason about the latter produced three
// wrong conclusions in one evening — including "/admin is ungated" when it was
// locked, and a cron that looked healthy for five days while collecting
// nothing. A 401 with no detail is indistinguishable from a system that works.
//
// Guarded by the same token as the cron so it cannot be used to fingerprint the
// deployment from outside.
import { NextRequest, NextResponse } from 'next/server';
import { authorize } from '@/lib/auth';
import { getDb } from '@/db/client';

export const dynamic = 'force-dynamic';

const has = (v?: string) => Boolean(v && v.length > 0);

export async function GET(req: NextRequest) {
  const auth = authorize(req);
  if (!auth.ok) return NextResponse.json({ error: 'unauthorized', ...auth.diagnostics }, { status: 401 });

  const env = process.env;
  const capabilities = {
    reasoning_claude: has(env.ANTHROPIC_API_KEY),
    database: has(env.DATABASE_URL),
    auth_clerk: has(env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) && has(env.CLERK_SECRET_KEY),
    cron_secret: has(env.CRON_SECRET),
    admin_allowlist: has(env.PLATFORM_ADMIN_EMAILS),
    walled_pages_firecrawl: has(env.FIRECRAWL_API_KEY),
    ads_meta: has(env.META_ADS_TOKEN),
    reddit: has(env.REDDIT_CLIENT_ID) && has(env.REDDIT_CLIENT_SECRET),
    producthunt: has(env.PRODUCTHUNT_TOKEN),
    vendor_apify: has(env.APIFY_TOKEN),
    seo_dataforseo: has(env.DATAFORSEO_LOGIN) && has(env.DATAFORSEO_PASSWORD),
    newsletters_inbound: has(env.NEWSLETTER_INBOX) && has(env.INBOUND_TOKEN),
    billing_stripe: has(env.STRIPE_SECRET_KEY),
  };

  // Is the watch actually standing? Config being present proves nothing —
  // this is what a working system looks like from the data side.
  let collection: Record<string, unknown> = {};
  try {
    const db = await getDb();
    const [runs] = await db.query<{ last: string | null; today: string }>(
      `SELECT to_char(max(run_at), 'YYYY-MM-DD HH24:MI') AS last,
              count(*) FILTER (WHERE run_at::date = CURRENT_DATE)::text AS today
       FROM collection_runs`,
    );
    const [pages] = await db.query<{ pages: string; snaps: string; changes: string }>(
      `SELECT (SELECT count(*)::text FROM pages) AS pages,
              (SELECT count(*)::text FROM snapshots) AS snaps,
              (SELECT count(*)::text FROM changes) AS changes`,
    );
    collection = {
      lastRunAt: runs?.last ?? null,
      runsToday: Number(runs?.today ?? 0),
      monitoredPages: Number(pages?.pages ?? 0),
      snapshots: Number(pages?.snaps ?? 0),
      changesDetected: Number(pages?.changes ?? 0),
    };
  } catch (e) {
    collection = { error: e instanceof Error ? e.message : String(e) };
  }

  const missingCritical = Object.entries({
    reasoning_claude: capabilities.reasoning_claude,
    database: capabilities.database,
    cron_secret: capabilities.cron_secret,
  })
    .filter(([, ok]) => !ok)
    .map(([k]) => k);

  return NextResponse.json({
    environment: env.VERCEL_ENV ?? 'local',
    capabilities,
    collection,
    missingCritical,
    healthy: missingCritical.length === 0,
  });
}
