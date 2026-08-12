// Google Play releases. No official API, so we use Play's public i18n data
// endpoint via the fetch ladder (Firecrawl if walled): search by brand, keep
// apps whose developer/title matches, capture the current version + recent-
// changes. App id resolved once and cached.
import { smartFetch } from '@/lib/fetchLadder';
import { getSource, setSource, ingestItems, recordRun, type Competitor } from '@/db/queries';

async function resolveAppId(comp: Competitor): Promise<string | null> {
  const cached = await getSource(comp.id, 'googleplay', 'appId');
  if (cached) return cached === 'none' ? null : cached;
  const res = await smartFetch(`https://play.google.com/store/search?q=${encodeURIComponent(comp.name)}&c=apps&hl=en`);
  let id: string | null = null;
  if (res.status === 200) {
    const brand = comp.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    for (const m of res.html.matchAll(/\/store\/apps\/details\?id=([a-zA-Z0-9._]+)/g)) {
      const cand = m[1];
      if (cand.toLowerCase().replace(/[^a-z0-9]/g, '').includes(brand)) { id = cand; break; }
    }
  }
  await setSource(comp.id, 'googleplay', 'appId', id ?? 'none');
  return id;
}

export async function collectGooglePlay(comp: Competitor): Promise<string> {
  const appId = await resolveAppId(comp);
  if (!appId) {
    await recordRun(comp.id, 'googleplay', true, 0, 'no matching Play app found');
    return 'no app found';
  }
  const res = await smartFetch(`https://play.google.com/store/apps/details?id=${appId}&hl=en`);
  if (res.status !== 200) {
    await recordRun(comp.id, 'googleplay', false, 0, `HTTP ${res.status}`);
    return `FAILED (HTTP ${res.status})`;
  }
  const version = res.html.match(/Current Version[\s\S]{0,120}?>([\d.]+)</)?.[1] ?? res.html.match(/\[\[\["([\d]+\.[\d.]+)"\]/)?.[1];
  const title = res.html.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(/ - Apps on Google Play.*/, '') ?? comp.name;
  if (!version) {
    await recordRun(comp.id, 'googleplay', true, 0, `app ${appId} found, version not parseable`);
    return `app found, version unknown`;
  }
  const { added, fresh } = await ingestItems(comp.id, 'googleplay', [
    { externalId: `gplay:${appId}:v${version}`, title: `Android app release: ${title} v${version}`, url: `https://play.google.com/store/apps/details?id=${appId}` },
  ]);
  await recordRun(comp.id, 'googleplay', true, added, `${title} v${version}`);
  return `+${added} (${fresh} pending) — ${title} v${version}`;
}
