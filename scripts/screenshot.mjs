// One-off capture of real product screenshots for the marketing site hero.
// Not part of the app build — run manually: node scripts/screenshot.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const OUT = 'public/screenshots';
mkdirSync(OUT, { recursive: true });

const shots = [
  { path: '/feed', file: 'feed.png', clip: { x: 0, y: 0, width: 1440, height: 860 } },
  { path: '/competitors', file: 'competitors.png', clip: { x: 0, y: 0, width: 1440, height: 900 } },
  { path: '/admin', file: 'admin.png', clip: { x: 0, y: 0, width: 1440, height: 700 } },
];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 2 });

for (const s of shots) {
  await page.goto(`http://localhost:3000${s.path}`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${OUT}/${s.file}`, clip: s.clip });
  console.log('saved', s.file);
}

await browser.close();
