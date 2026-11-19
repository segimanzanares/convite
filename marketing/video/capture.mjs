// Captura pantallas móviles de las invitaciones demo de Convite (servidas en local).
import { chromium } from 'playwright-core';
const BASE = process.env.BASE ?? 'http://127.0.0.1:8123';
const slugs = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'chrome' });
for (const slug of slugs) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'es-MX' });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/i/${slug}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // Cierra el aviso de cookies (sin aceptar analíticas) antes de capturar
  const reject = page.getByRole('button', { name: /rechazar/i });
  const dismiss = () => reject.first().click({ timeout: 1500 }).catch(() => {});
  await dismiss();
  await page.waitForTimeout(600);
  await page.screenshot({ path: `shots/${slug}-00.png` });
  // Abre la invitación: botón de la portada o, si es un sobre, un toque al centro
  const open = page.getByRole('button', { name: /abrir|r[oó]mp|toca|entrar|descubr|despeg|ver /i });
  const opened = (await open.count()) && await open.first().click({ timeout: 4000 }).then(() => true, () => false);
  if (!opened) await page.mouse.click(195, 480);
  await page.waitForTimeout(3000);
  await dismiss();
  await page.waitForTimeout(1500);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 1;
  for (let y = 0; y < total - 400 && i <= 14; y += 760, i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), y);
    await page.waitForTimeout(1300);
    await page.screenshot({ path: `shots/${slug}-${String(i).padStart(2, '0')}.png` });
  }
  console.log(slug, total, i - 1);
  await ctx.close();
}
await browser.close();
