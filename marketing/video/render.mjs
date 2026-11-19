// Renderiza index.html fotograma a fotograma con Chrome sin interfaz.
//   node render.mjs                -> todos los fotogramas en frames/ (4 procesos en paralelo)
//   node render.mjs --stills 3,12  -> solo capturas sueltas en stills/ (segundos)
//   PAGE=index-corto.html FRAMES=frames-corto node render.mjs  -> renderiza la versión corta
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const FPS = 30, WORKERS = 4;
const PAGE = process.env.PAGE ?? 'index.html';
const FRAMES = process.env.FRAMES ?? 'frames';
const url = pathToFileURL(PAGE).href;
const args = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome' });

async function open() {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto(url);
  await page.evaluate(() => window.ready);
  return page;
}

if (args[0] === '--stills') {
  mkdirSync('stills', { recursive: true });
  const page = await open();
  for (const t of args[1].split(',').map(Number)) {
    await page.evaluate((t) => window.seek(t), t);
    await page.screenshot({ path: `stills/t${t.toFixed(2).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 80 });
  }
} else {
  mkdirSync(FRAMES, { recursive: true });
  const page0 = await open();
  const total = Math.ceil((await page0.evaluate(() => window.DURATION)) * FPS);
  await page0.close();
  let next = 0;
  await Promise.all(Array.from({ length: WORKERS }, async () => {
    const page = await open();
    while (next < total) {
      const f = next++;
      await page.evaluate((t) => window.seek(t), f / FPS);
      await page.screenshot({ path: `${FRAMES}/f${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 95 });
      if (f % 300 === 0) console.log(`${f}/${total}`);
    }
  }));
  console.log('fotogramas:', total);
}
await browser.close();
