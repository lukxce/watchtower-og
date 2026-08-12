// Orchestrates a collection run across competitors and channels, driven by the
// channel registry. Active channels run; deferred ones are recorded honestly so
// the dashboard coverage map is truthful. In production each channel maps onto
// an Inngest step (retries + concurrency caps); here it runs in-process so the
// same code works under a Vercel cron route and locally.
import { allCompetitors, recordRun } from '@/db/queries';
import { RUNNABLE_CHANNELS } from '@/lib/channels';
import { scoreUnscored } from '@/lib/score';
import { clearCaptureCache } from '@/lib/fetchLadder';

export interface RunLine {
  competitor: string;
  channel: string;
  result: string;
}

export async function runCollection(orgId: string, opts: { channels?: string[]; tier2?: boolean } = {}): Promise<RunLine[]> {
  const comps = await allCompetitors(orgId);
  const channels = opts.channels ? RUNNABLE_CHANNELS.filter((c) => opts.channels!.includes(c.key)) : RUNNABLE_CHANNELS;
  const out: RunLine[] = [];
  for (const comp of comps) {
    clearCaptureCache(); // fresh per competitor; site-derived channels share one capture
    for (const ch of channels) {
      try {
        const result = await ch.run(comp, opts.tier2);
        out.push({ competitor: comp.name, channel: ch.key, result });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        await recordRun(comp.id, ch.key, false, 0, `CRASHED: ${msg}`);
        out.push({ competitor: comp.name, channel: ch.key, result: `CRASHED: ${msg}` });
      }
    }
  }
  await scoreUnscored(); // fill Signal Scores on newly-captured items
  return out;
}
