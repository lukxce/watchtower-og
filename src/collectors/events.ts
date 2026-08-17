// Events & webinars (spec §4.9): pull event/webinar titles from their events
// pages. Field-marketing focus + messaging themes.
import { smartFetch } from '@/lib/fetchLadder';
import { convert } from 'html-to-text';
import { ingestItems, recordRun, type Competitor } from '@/db/queries';
import { cleanTitle } from '@/lib/signalText';

const PATHS = ['/events', '/webinars', '/resources/events', '/resources/webinars', '/events-webinars', '/company/events'];
const EVENTY = /(webinar|workshop|summit|conference|masterclass|panel|live|fireside|roundtable|meetup|expo|\b202[6-9]\b)/i;
// Footer/legal boilerplate false-positives: a copyright line ("© 2026 ... Inc.")
// matches EVENTY on the bare year alone. Exclude anything that reads like
// site furniture rather than an actual event/webinar title.
const BOILERPLATE = /copyright|all rights reserved|vat id|\biban\b|privacy policy|terms of (service|use)|cookie/i;

export async function collectEvents(comp: Competitor): Promise<string> {
  const titles = new Set<string>();
  let anyOk = false;
  for (const p of PATHS) {
    const res = await smartFetch(`https://${comp.domain}${p}`);
    if (res.status !== 200) continue;
    anyOk = true;
    // Default html-to-text renders an image as its alt text followed by the
    // src, and a link as "text [href]" — which is how a HubSpot cover image
    // ended up stored as an event called "cover images for Webinar (11)".
    const lines = convert(res.html, {
      wordwrap: false,
      selectors: [
        { selector: 'img', format: 'skip' },
        { selector: 'a', options: { ignoreHref: true } },
      ],
    })
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length >= 12 && l.length <= 120 && EVENTY.test(l) && !BOILERPLATE.test(l));
    for (const l of lines.slice(0, 40)) titles.add(l);
  }
  if (!anyOk) {
    await recordRun(comp.id, 'events', false, 0, 'no events/webinars pages found');
    return 'no events page';
  }
  const { added, fresh } = await ingestItems(
    comp.id,
    'events',
    [...titles]
      .map((t) => ({ raw: t, clean: cleanTitle('events', `Event/webinar: ${t}`) }))
      .filter((x): x is { raw: string; clean: string } => x.clean !== null)
      .map((x) => ({
        externalId: `event:${x.raw.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 60)}`,
        title: x.clean,
      })),
  );
  await recordRun(comp.id, 'events', true, added, `${titles.size} titles`);
  return `+${added} (${fresh} pending) — ${titles.size} titles`;
}
