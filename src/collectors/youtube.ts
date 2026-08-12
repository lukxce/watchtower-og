// YouTube (spec §4.5): resolve channel id once from the handle page (multiple
// id patterns, og:title verification, SOCS consent cookie), then poll RSS.
import { UA } from '@/lib/fetchLadder';
import { parseFeed } from '@/lib/feeds';
import { ingestItems, recordRun, getSource, setSource, type Competitor } from '@/db/queries';

async function ytGet(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { headers: { 'user-agent': UA, cookie: 'SOCS=CAI' }, redirect: 'follow' });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function resolveChannel(comp: Competitor): Promise<string | null> {
  const brand = comp.name.split(/\s+/)[0].toLowerCase();
  const candidates = [
    ...new Set([comp.youtube_handle, comp.slug, comp.name.toLowerCase().replace(/[^a-z0-9]/g, '')].filter(Boolean)),
  ] as string[];
  for (const h of candidates) {
    const html = await ytGet(`https://www.youtube.com/@${h}`);
    if (!html) continue;
    const id = html.match(/(?:externalId|channelId|browseId|browse_id)"\s*:\s*"(UC[0-9A-Za-z_-]{22})"/)?.[1];
    if (!id) continue;
    const og = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ?? '';
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';
    if (og.toLowerCase().includes(brand) || canonical.toLowerCase().includes(brand) || h.toLowerCase().includes(brand)) {
      return id;
    }
  }
  return null;
}

export async function collectYouTube(comp: Competitor): Promise<string> {
  let channelId = await getSource(comp.id, 'youtube', 'channelId');
  if (channelId === 'none') return 'skipped (channel not resolved at setup)';
  if (!channelId) {
    channelId = await resolveChannel(comp);
    await setSource(comp.id, 'youtube', 'channelId', channelId ?? 'none');
    if (!channelId) {
      await recordRun(comp.id, 'youtube', false, 0, 'channel not resolved — set youtube_handle in registry');
      return 'channel not resolved';
    }
  }
  const xml = await ytGet(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
  if (!xml) {
    await recordRun(comp.id, 'youtube', false, 0, 'feed fetch failed');
    return 'FAILED (feed fetch)';
  }
  const entries = parseFeed(xml);
  if (!entries) {
    await recordRun(comp.id, 'youtube', false, 0, 'unparseable feed');
    return 'FAILED (unparseable)';
  }
  const { added, fresh } = await ingestItems(
    comp.id,
    'youtube',
    entries.map((e) => ({ externalId: e.id, title: `New video: ${e.title}`, url: e.url, publishedAt: e.publishedAt })),
  );
  await recordRun(comp.id, 'youtube', true, added);
  return `+${added} (${fresh} pending)`;
}
