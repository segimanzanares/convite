// Captura las secciones de una demo para el video "Lo que hay dentro de una invitación":
// centra cada sección en una pantalla de celular, espera sus animaciones, la captura y guarda su rectángulo
// (en px CSS de la pantalla de 390 × 844) para que el video haga zoom justo sobre ella.
//   node capture-secciones.mjs boda-floral   -> secciones/boda-floral/*.png + data.js
// Sitio local en BASE (por omisión http://localhost:8000).
import { chromium } from 'playwright-core';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE ?? 'http://localhost:8000';
const slug = process.argv[2] ?? 'boda-floral';
const dir = `secciones/${slug}`;
rmSync(dir, { recursive: true, force: true });
mkdirSync(dir, { recursive: true });

// Cada sección: cómo encontrarla en la página (se evalúa en el navegador) y cuántas capturas seguidas, a 1 s.
// `clicks` nombra el botón de la sección que se toca antes de cada captura (null: ninguno).
const TARGETS = {
  musica: { find: `document.querySelector('button[aria-label*="música" i]')`, shots: 1, scroll: 0 },
  cuenta: { find: `[...document.querySelectorAll('section')].find((s) => /cuenta regresiva/i.test(s.innerText))`, shots: 4 },
  mapa: { find: `(() => { let e = document.querySelector('iframe'); while (e.parentElement && e.getBoundingClientRect().height < 520) e = e.parentElement; return e; })()`, shots: 1 },
  galeria: { find: `[...document.querySelectorAll('section')].find((s) => /nuestra historia/i.test(s.innerText))`, shots: 1 },
  confirmar: { find: `(() => { const h = [...document.querySelectorAll('h1,h2,h3')].find((x) => /confirm|asistencia|rsvp/i.test(x.innerText)); let e = h; while (e && e.parentElement && e.getBoundingClientRect().height < 560) e = e.parentElement; return e; })()`, shots: 1 },
  deseos: {
    find: `(() => { const h = [...document.querySelectorAll('#deseos h2, #deseos h3, #deseos p')].find((x) => /^libro de firmas$/i.test(x.innerText.trim())); let e = h; while (e.parentElement && e.getBoundingClientRect().height < 560) e = e.parentElement; return e; })()`,
    shots: 3, clicks: [null, /^abrir$/i, /siguiente/i],
  },
};

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-MX' });
// Consentimiento ya rechazado: el aviso de cookies no aparece en las capturas
await ctx.addInitScript(() => localStorage.setItem('cookie_consent', 'denied'));
const page = await ctx.newPage();
await page.goto(`${BASE}/i/${slug}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
const data = { slug, sections: {} };
await page.screenshot({ path: `${dir}/portada.png` });
const open = page.getByRole('button', { name: /abrir|r[oó]mp|toca|entrar|descubr|despeg|ver /i });
const opened = (await open.count()) && await open.first().click({ timeout: 4000 }).then(() => true, () => false);
if (!opened) await page.mouse.click(195, 480);
await page.waitForTimeout(6000);
await page.screenshot({ path: `${dir}/inicio.png` });

for (const [name, target] of Object.entries(TARGETS)) {
  // Recorre la página hasta la sección para que sus animaciones de entrada se disparen como al hacer scroll
  const top = await page.evaluate(({ find, scroll, align }) => {
    const el = eval(find);
    const r = el.getBoundingClientRect();
    const y = r.top + scrollY;
    return scroll ?? (align === 'top' || r.height > innerHeight * 0.9 ? y - 70 : y + r.height / 2 - innerHeight / 2);
  }, target);
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), Math.max(0, top - 300));
  await page.waitForTimeout(400);
  await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), Math.max(0, top));
  await page.waitForTimeout(1800);
  const rect = await page.evaluate(({ find }) => {
    const r = eval(find).getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  }, target);
  const files = [];
  for (let i = 0; i < target.shots; i++) {
    const click = target.clicks?.[i];
    if (click) {
      // force: el botón tiene una animación continua y Playwright nunca lo da por "estable"
      await page.locator('#deseos').getByRole('button', { name: click }).first().click({ timeout: 3000, force: true });
      await page.waitForTimeout(1600);
    } else if (i) await page.waitForTimeout(1000);
    const file = `${name}-${i}.png`;
    await page.screenshot({ path: `${dir}/${file}` });
    files.push(file);
  }
  data.sections[name] = { rect, files };
  console.log(name, JSON.stringify(rect));
}
writeFileSync(`${dir}/data.js`, `window.SECCIONES = ${JSON.stringify(data)};\n`);
await browser.close();
