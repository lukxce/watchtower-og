// One-off capture of real product screenshots for the marketing site hero.
// Not part of the app build — run manually: node scripts/screenshot.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = 'public/screenshots';
mkdirSync(OUT, { recursive: true });

const shots = [
  { path: '/overview', file: 'overview.png', ready: '.gx-chart', clip: { x: 0, y: 0, width: 1440, height: 900 } },
  { path: '/feed', file: 'feed.png', ready: '.timeline', clip: { x: 0, y: 0, width: 1440, height: 860 } },
  { path: '/battlecards', file: 'battlecards.png', ready: '.bc', clip: { x: 0, y: 0, width: 1440, height: 880 } },
  { path: '/admin', file: 'admin.png', clip: { x: 0, y: 0, width: 1440, height: 700 } },
  { path: '/radar', file: 'radar.png', clip: { x: 0, y: 0, width: 1440, height: 860 } },
  { path: '/mentions', file: 'mentions.png', clip: { x: 0, y: 0, width: 1440, height: 860 } },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 2 });
// Shoot the PUBLIC DEMO workspace (Watchtower vs its own market), not the
// dev/Hypefy one — the marketing site should show our industry, not a
// borrowed example set. Requires the dev server to be pointed at a database
// where demo-workspace is populated.
await ctx.addCookies([{ name: 'wt_demo', value: '1', domain: 'localhost', path: '/' }]);
const page = await ctx.newPage();

// A dev server compiles on first hit, so "networkidle" can resolve against a
// still-blank page (and its HMR socket never idles at all). Wait for real
// content instead, and retry once — a cold compile used to yield an 80kb
// screenshot of an empty sheet.
async function shoot(s, attempt = 1) {
  try {
    await page.goto(`http://localhost:3000${s.path}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('.topbar-in', { timeout: 60000 });
    await page.waitForSelector(s.ready ?? 'main', { timeout: 60000 });
    await page.waitForLoadState('load').catch(() => {});
    await page.waitForTimeout(1200); // fonts + the chart's mount pass
    // The demo banner is how a visitor knows they are in the demo; it has no
    // business inside a marketing screenshot of the product.
    await page.addStyleTag({ content: '.demo-banner{display:none !important}' });
    await page.screenshot({ path: `${OUT}/${s.file}`, clip: s.clip });
    console.log('saved', s.file);
  } catch (e) {
    if (attempt < 3) {
      console.log(`retry ${s.file} (${e.message.split('\n')[0]})`);
      await page.waitForTimeout(2500);
      return shoot(s, attempt + 1);
    }
    console.log('FAILED', s.file, e.message.split('\n')[0]);
  }
}

for (const s of shots) await shoot(s);

await browser.close();
