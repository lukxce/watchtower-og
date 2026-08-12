// Runs EVERY channel once for one competitor to confirm each executes and
// either collects or defers cleanly (no crashes). Server must be stopped.
import { allCompetitors } from '../src/db/queries';
import { CHANNELS } from '../src/lib/channels';
import { clearCaptureCache } from '../src/lib/fetchLadder';

async function main() {
  const comps = await allCompetitors();
  const c = comps.find((x) => x.slug === 'modash') ?? comps[0];
  console.log(`\nRunning all ${CHANNELS.length} channels for ${c.name}:\n`);
  clearCaptureCache();
  let ok = 0;
  let crash = 0;
  for (const ch of CHANNELS) {
    try {
      const r = await ch.run(c);
      console.log(`  ✅ ${ch.key.padEnd(15)} [${ch.status.padEnd(13)}] ${r}`);
      ok++;
    } catch (e) {
      console.log(`  ❌ ${ch.key.padEnd(15)} CRASHED: ${e instanceof Error ? e.message : String(e)}`);
      crash++;
    }
  }
  console.log(`\n${ok}/${CHANNELS.length} ran cleanly, ${crash} crashed.`);
  process.exit(crash ? 1 : 0);
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
