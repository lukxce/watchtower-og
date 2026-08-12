// App store (spec §4.9): iTunes Search software, verified by sellerUrl against
// the competitor domain — never name-matched. Version bumps surface as items.
import { ingestItems, recordRun, jsonFetch, type Competitor } from '@/db/queries';

export async function collectAppstore(comp: Competitor): Promise<string> {
  const bare = comp.domain.replace(/^www\./, '');
  const r = (await jsonFetch(`https://itunes.apple.com/search?term=${encodeURIComponent(comp.name)}&entity=software&limit=20`)) as {
    results?: {
      trackId?: number;
      trackName?: string;
      version?: string;
      sellerUrl?: string;
      trackViewUrl?: string;
      currentVersionReleaseDate?: string;
      releaseNotes?: string;
    }[];
  } | null;
  if (!r?.results) {
    await recordRun(comp.id, 'appstore', false, 0, 'itunes search failed');
    return 'FAILED (itunes)';
  }
  const own = r.results.filter((a) => a.sellerUrl && a.sellerUrl.toLowerCase().includes(bare));
  const { added, fresh } = await ingestItems(
    comp.id,
    'appstore',
    own
      .filter((a) => a.trackId && a.trackName)
      .map((a) => ({
        externalId: `app:${a.trackId}:v${a.version ?? '?'}`,
        title: `iOS app release: ${a.trackName} v${a.version ?? '?'}`,
        url: a.trackViewUrl,
        publishedAt: a.currentVersionReleaseDate,
        payload: { releaseNotes: a.releaseNotes?.slice(0, 1000) },
      })),
  );
  await recordRun(comp.id, 'appstore', true, added, `${own.length} apps matched by seller domain`);
  return `+${added} (${fresh} pending) — ${own.length} apps`;
}
