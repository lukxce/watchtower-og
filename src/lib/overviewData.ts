// Shared data loader for the Overview page and its design-beta variants
// (app/(app)/overview-beta/*). One source of real data, several skins —
// so the four visual directions are judged on the same numbers, not mocks.
import { getDb } from '@/db/client';
import { computeThreat, type ThreatRow } from '@/lib/threat';
import { CHANNELS } from '@/lib/channels';
import { getCompetitorReads, type CompetitorRead } from '@/lib/reason';
import { computeRadar, type RadarForecast } from '@/lib/radar';
import { bundleRows, type Bundle, type BundleRow } from '@/lib/bundle';
import { findBrandMentions, type BrandMentions } from '@/lib/mentions';
import { industryNews, type IndustryItem } from '@/lib/industryNews';

export function greeting(): string {
  const h = new Date().getHours();
  if (h < 5) return 'Working late';
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function bucketOf(category: string | null): 'product' | 'gtm' | 'market' {
  if (category === 'Product' || category === 'Pricing') return 'product';
  if (category === 'Ads' || category === 'Hiring' || category === 'Marketing') return 'gtm';
  return 'market';
}

export function ago(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const h = Math.floor(d / 3600000);
  if (h < 24) return `${Math.max(1, h)}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export interface Week { key: string; label: string; nice: string; product: number; gtm: number; market: number }

export interface OverviewData {
  compCount: number;
  threat: ThreatRow[];
  focusComp: ThreatRow | null;
  weeks: Week[];
  maxWeek: number;
  thisWeekTotal: number;
  chartTotal: number;
  monthTicks: { idx: number; label: string }[];
  highlights: Bundle[];
  reads: Map<string, CompetitorRead>;
  railCards: (ThreatRow & { read: CompetitorRead })[];
  topRadar: RadarForecast | undefined;
  mentions: BrandMentions;
  mWeeks: { key: string; n: number }[];
  mMax: number;
  mTotal: number;
  pulse: IndustryItem[];
  battlecardCount: number;
  activeChannels: number;
  totalChannels: number;
}

const WEEKS = 26;
const M_WEEKS = 12;

export async function getOverviewData(orgId: string, focus?: string): Promise<OverviewData> {
  const db = await getDb();
  const threat = await computeThreat(orgId);
  const focusComp = focus ? threat.find((t) => t.slug === focus) ?? null : null;

  const chartParams: unknown[] = [orgId];
  let chartFocusClause = '';
  if (focusComp) {
    chartParams.push(focusComp.slug);
    chartFocusClause = ` AND c.slug = $${chartParams.length}`;
  }
  const weekRows = await db.query<{ wk: string; category: string | null; n: number }>(
    `SELECT date_trunc('week', si.published_at)::date::text AS wk, si.category, COUNT(*)::int AS n
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE c.org_id = $1 AND si.status IN ('pending','signaled')
       AND si.published_at IS NOT NULL AND si.published_at >= now() - interval '${WEEKS * 7} days'${chartFocusClause}
     GROUP BY 1, 2`,
    chartParams,
  );

  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const localKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const weeks: Week[] = [];
  for (let i = WEEKS - 1; i >= 0; i--) {
    const d = new Date(monday);
    d.setDate(monday.getDate() - i * 7);
    weeks.push({
      key: localKey(d),
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      nice: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      product: 0,
      gtm: 0,
      market: 0,
    });
  }
  const byKey = new Map(weeks.map((w) => [w.key, w]));
  for (const r of weekRows) {
    const w = byKey.get(r.wk);
    if (w) w[bucketOf(r.category)] += r.n;
  }
  const maxWeek = Math.max(1, ...weeks.map((w) => w.product + w.gtm + w.market));
  const thisWeek = weeks[weeks.length - 1];
  const thisWeekTotal = thisWeek.product + thisWeek.gtm + thisWeek.market;
  const chartTotal = weeks.reduce((s, w) => s + w.product + w.gtm + w.market, 0);

  const monthTicks: { idx: number; label: string }[] = [];
  let lastMonth = '';
  weeks.forEach((w, idx) => {
    if (w.label !== lastMonth) {
      monthTicks.push({ idx, label: w.label });
      lastMonth = w.label;
    }
  });

  const hlRows = await db.query<BundleRow>(
    `SELECT si.id, si.channel, si.category, si.score, si.title, si.url, si.created_at, si.published_at, c.name, c.slug
     FROM stream_items si JOIN competitors c ON c.id = si.competitor_id
     WHERE c.org_id = $1 AND si.status IN ('pending','signaled')
       AND COALESCE(si.published_at, si.created_at) >= now() - interval '60 days'
     ORDER BY si.score DESC NULLS LAST, si.created_at DESC LIMIT 400`,
    [orgId],
  );
  const highlights = bundleRows(hlRows)
    .filter((b) => b.rows.length >= 2 || b.score >= 80)
    .sort((a, b) => b.rows.length * 12 + b.score - (a.rows.length * 12 + a.score))
    .slice(0, 8);

  const reads = await getCompetitorReads(orgId);
  const radar = await computeRadar(orgId);
  const topRadar = radar[0];
  const mentions = await findBrandMentions(orgId);
  const pulse = await industryNews(orgId, 5);

  const mWeeks: { key: string; n: number }[] = [];
  for (let i = M_WEEKS - 1; i >= 0; i--) {
    const d = new Date(monday);
    d.setDate(monday.getDate() - i * 7);
    mWeeks.push({ key: localKey(d), n: 0 });
  }
  const mByKey = new Map(mWeeks.map((w) => [w.key, w]));
  const mentionDates = [
    ...(mentions.news.map((n) => n.publishedAt).filter(Boolean) as string[]),
    ...mentions.signalMentions.map((s) => s.at),
  ];
  for (const iso of mentionDates) {
    const d = new Date(iso);
    const wd = new Date(d);
    wd.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const w = mByKey.get(localKey(wd));
    if (w) w.n++;
  }
  const mMax = Math.max(1, ...mWeeks.map((w) => w.n));
  const mTotal = mWeeks.reduce((s, w) => s + w.n, 0);

  const compCount = threat.length;
  const battlecardCount = Number(
    (await db.query<{ n: string }>(
      'SELECT COUNT(*)::text n FROM battlecards b JOIN competitors c ON c.id = b.competitor_id WHERE c.org_id = $1',
      [orgId],
    ))[0]?.n ?? 0,
  );
  const activeChannels = CHANNELS.filter((c) => c.status === 'active').length;

  const railCards = threat
    .filter((t) => reads.has(t.slug))
    .slice(0, 3)
    .map((t) => ({ ...t, read: reads.get(t.slug)! }));

  return {
    compCount, threat, focusComp, weeks, maxWeek, thisWeekTotal, chartTotal, monthTicks,
    highlights, reads, railCards, topRadar, mentions, mWeeks, mMax, mTotal, pulse,
    battlecardCount, activeChannels, totalChannels: CHANNELS.length,
  };
}

export const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
