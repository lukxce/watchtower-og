// Per-workspace scheduling.
//
// Vercel crons fire in UTC. The old schedule was `0 7 * * *`, which is 07:00
// UTC — 09:00 in Belgrade, but **03:00 in New York and midnight in Los
// Angeles**. A product whose central promise is a briefing at first light was
// delivering it to US customers in the middle of the night.
//
// The fix is to stop thinking of it as one daily job and split it in two:
//
//   COLLECT  runs at the workspace's local 04:00 — unattended, just needs to
//            finish before anyone looks
//   DELIVER  runs at the workspace's local 07:00 — the first-light moment,
//            the digest, the thing the customer actually experiences
//
// A single hourly cron then asks, for each workspace, "is it 4am or 7am where
// you are?" That is one cheap query an hour rather than a scheduler.
import { getDb } from '@/db/client';

export const COLLECT_HOUR = 4;
export const DELIVER_HOUR = 7;

/**
 * Fallback when a workspace has never told us where it is.
 *
 * This is load-bearing in a way that is easy to miss: the hourly cron only
 * acts on workspaces whose LOCAL hour is 4 or 7. A workspace defaulting to UTC
 * under a cron that fires at 05:00 UTC matches neither, and would silently do
 * nothing — a broken schedule that looks configured. Any change to the cron
 * hour in vercel.json has to be checked against this default, or against every
 * workspace's real timezone.
 */
export const DEFAULT_TZ = 'UTC';

/**
 * The hour (0–23) it currently is in `tz`. Invalid or unknown zones fall back
 * to UTC rather than throwing — a bad timezone string must never be able to
 * stop the watch for every other workspace.
 */
export function localHour(tz: string, now: Date = new Date()): number {
  try {
    return Number(
      new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', hour12: false }).format(now),
    );
  } catch {
    return now.getUTCHours();
  }
}

/** Is `tz` a timezone Node actually recognises? Used to validate user input. */
export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-GB', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export interface DueWorkspace {
  orgId: string;
  timezone: string;
  localHour: number;
}

/**
 * Every workspace for which it is currently `hour` o'clock locally.
 *
 * Deliberately computed in JS rather than SQL: Postgres would need the full
 * IANA tz database loaded and the set of workspaces is small. Revisit if this
 * ever scans more than a few thousand rows.
 */
export async function workspacesAtLocalHour(hour: number, now: Date = new Date()): Promise<DueWorkspace[]> {
  const db = await getDb();
  const rows = await db.query<{ org_id: string; timezone: string | null }>(
    `SELECT DISTINCT c.org_id, s.timezone
     FROM competitors c
     LEFT JOIN org_settings s ON s.org_id = c.org_id`,
  );
  const out: DueWorkspace[] = [];
  for (const r of rows) {
    const tz = r.timezone ?? DEFAULT_TZ;
    const h = localHour(tz, now);
    if (h === hour) out.push({ orgId: r.org_id, timezone: tz, localHour: h });
  }
  return out;
}

/** Persist a workspace's timezone. Rejects anything Node cannot resolve. */
export async function setTimeZone(orgId: string, tz: string): Promise<boolean> {
  if (!isValidTimeZone(tz)) return false;
  const db = await getDb();
  await db.query(
    `INSERT INTO org_settings (org_id, brand_name, timezone) VALUES ($1, '', $2)
     ON CONFLICT (org_id) DO UPDATE SET timezone = $2, updated_at = now()`,
    [orgId, tz],
  );
  return true;
}

export async function getTimeZone(orgId: string): Promise<string> {
  const db = await getDb();
  const rows = await db.query<{ timezone: string | null }>(
    'SELECT timezone FROM org_settings WHERE org_id = $1',
    [orgId],
  );
  return rows[0]?.timezone ?? DEFAULT_TZ;
}
