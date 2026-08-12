// Podcasts (spec §4.9): iTunes Search episodes; require the brand's most
// distinctive token in the metadata — never fuzzy matches.
import { ingestItems, recordRun, jsonFetch, type Competitor } from '@/db/queries';

export async function collectPodcasts(comp: Competitor): Promise<string> {
  const q = comp.queries?.podcast ?? comp.name;
  const token = comp.name
    .split(/\s+/)
    .sort((a, b) => b.length - a.length)[0]
    .toLowerCase();
  const r = (await jsonFetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=podcast&entity=podcastEpisode&limit=25`,
  )) as {
    results?: { trackId?: number; trackName?: string; collectionName?: string; releaseDate?: string; trackViewUrl?: string; description?: string }[];
  } | null;
  if (!r?.results) {
    await recordRun(comp.id, 'podcasts', false, 0, 'itunes search failed');
    return 'FAILED (itunes)';
  }
  const relevant = r.results.filter((e) =>
    `${e.trackName ?? ''} ${e.collectionName ?? ''} ${e.description ?? ''}`.toLowerCase().includes(token),
  );
  const { added, fresh } = await ingestItems(
    comp.id,
    'podcasts',
    relevant
      .filter((e) => e.trackId && e.trackName)
      .map((e) => ({
        externalId: String(e.trackId),
        title: `Podcast episode: ${e.trackName} (${e.collectionName ?? 'unknown show'})`,
        url: e.trackViewUrl,
        publishedAt: e.releaseDate,
      })),
  );
  await recordRun(comp.id, 'podcasts', true, added);
  return `+${added} (${fresh} pending) — ${relevant.length} relevant`;
}
