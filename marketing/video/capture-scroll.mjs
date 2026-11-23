// Graba una demo de principio a fin como lo haría una grabación de pantalla del celular:
// abre la invitación y la recorre con un scroll suave, guardando cada fotograma que pinta Chrome.
//   node capture-scroll.mjs xv-disco   -> scroll/xv-disco/f00000.jpg … + frames.json / frames.js (segundo de cada uno)
// Sitio local en BASE (por omisión http://localhost:8000). SCROLL_SECONDS ajusta la duración del recorrido.
import { chromium } from 'playwright-core';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:8000';
const SCROLL_SECONDS = Number(process.env.SCROLL_SECONDS ?? 22);
const slug = process.argv[2] ?? 'xv-disco';
const dir = `scroll/${slug}`;
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-MX' });
// Consentimiento ya rechazado: el aviso de cookies no aparece en la grabación
await ctx.addInitScript(() => localStorage.setItem('cookie_consent', 'denied'));
const page = await ctx.newPage();
await page.goto(`${BASE}/i/${slug}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
// Cierra el aviso de cookies sin aceptar analíticas
await page.getByRole('button', { name: /rechazar/i }).first().click({ timeout: 1500 }).catch(() => {});
await page.waitForTimeout(800);

const cdp = await ctx.newCDPSession(page);
const frames = [];
let t0 = null;
cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
  cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  t0 ??= metadata.timestamp;
  const file = `f${String(frames.length).padStart(5, '0')}.jpg`;
  writeFileSync(`${dir}/${file}`, Buffer.from(data, 'base64'));
  frames.push({ t: +(metadata.timestamp - t0).toFixed(4), file });
});
await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });

// Un pequeño movimiento mantiene llegando fotogramas mientras se espera
const idle = async (ms) => {
  const end = Date.now() + ms;
  while (Date.now() < end) { await page.evaluate(() => new Promise(requestAnimationFrame)); }
};
await idle(1200);
const marks = { tap: frames.at(-1)?.t ?? 0 };
const open = page.getByRole('button', { name: /abrir|r[oó]mp|toca|entrar|descubr|despeg|ver /i });
const opened = (await open.count()) && await open.first().click({ timeout: 4000 }).then(() => true, () => false);
if (!opened) await page.mouse.click(195, 480);
await idle(3800);
await page.getByRole('button', { name: /rechazar/i }).first().click({ timeout: 500 }).catch(() => {});
marks.scroll = frames.at(-1).t;
// Scroll de arriba abajo con aceleración y frenado suaves
await page.evaluate((secs) => new Promise((done) => {
  const max = document.documentElement.scrollHeight - innerHeight;
  const start = performance.now();
  const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const step = (now) => {
    const x = Math.min(1, (now - start) / (secs * 1000));
    // Casi lineal en el centro: arranca y frena suave, pero no se detiene a medio camino
    window.scrollTo({ top: max * (0.75 * x + 0.25 * ease(x)), behavior: 'instant' });
    if (x < 1) requestAnimationFrame(step); else done();
  };
  requestAnimationFrame(step);
}), SCROLL_SECONDS);
marks.end = frames.at(-1).t;
await idle(1500);
await cdp.send('Page.stopScreencast');
await page.waitForTimeout(300);
const data = JSON.stringify({ slug, ...marks, frames });
writeFileSync(`${dir}/frames.json`, data);
// La página del video la carga como script (file:// no permite fetch)
writeFileSync(`${dir}/frames.js`, `window.REC = ${data};\n`);
const span = frames.at(-1).t;
console.log(`${slug}: ${frames.length} fotogramas en ${span.toFixed(1)} s (${(frames.length / span).toFixed(1)} fps)`, marks);
await browser.close();
