// Línea de tiempo del video "Scroll satisfactorio" (≈15 s) con la grabación de xv-disco (capture-scroll.mjs).
// La grabación va a 1x hasta el toque, a 3x mientras se abre y a 2x durante el scroll.
// window.SFX lista los efectos de sonido que build.sh mezcla con sfx.mjs.
const REC = window.REC;
const SFX = [];
const tl = gsap.timeline({ paused: true });
const COLORS = ['#ff4fd8', '#3ee6ff', '#8b5cff', '#dfa33f'];

let seed = 5;
const rnd = (a = 0, b = 1) => { seed = (seed * 16807) % 2147483647; return a + (b - a) * (seed / 2147483647); };
const $ = (s) => document.querySelector(s);

// ---------- Tiempo del video -> tiempo de la grabación ----------
const TAP_V = 1.0;
const knots = [[0, REC.tap - TAP_V], [TAP_V + 0.4, REC.tap + 0.4]];
knots.push([knots[1][0] + (REC.scroll - knots[1][1]) / 3, REC.scroll]);
knots.push([knots[2][0] + (REC.end - REC.scroll) / 2, REC.end]);
const SCROLL_V = [knots[2][0], knots[3][0]];
const END_V = SCROLL_V[1] - 0.1;
const DURATION = +(END_V + 1.5).toFixed(2);
const recTime = (v) => {
  for (let i = 1; i < knots.length; i++) {
    const [v0, r0] = knots[i - 1], [v1, r1] = knots[i];
    if (v <= v1) return r0 + (v - v0) * (r1 - r0) / (v1 - v0);
  }
  return REC.end + (v - knots.at(-1)[0]);
};
const frameAt = (r) => {
  const f = REC.frames;
  let lo = 0, hi = f.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (f[mid].t <= r) lo = mid; else hi = mid - 1; }
  return f[lo].file;
};

// ---------- Fondo: reflectores y destellos ----------
const beams = $('#beams');
[[150, '#ff4fd8'], [420, '#3ee6ff'], [700, '#8b5cff'], [960, '#ff4fd8']].forEach(([x, c], i) => {
  const b = document.createElement('div');
  b.className = 'beam';
  b.style.cssText = `left:${x}px;--c:${c}`;
  beams.append(b);
  tl.fromTo(b, { rotation: i % 2 ? 28 : -28 }, { rotation: i % 2 ? -22 : 22, duration: rnd(1.8, 2.6), ease: 'sine.inOut', yoyo: true, repeat: 9 }, 0);
});
const dots = $('#dots');
for (let i = 0; i < 40; i++) {
  const d = document.createElement('i');
  d.style.cssText = `--c:${COLORS[i % 4]};left:${rnd(10, 1070)}px;top:${rnd(10, 1900)}px`;
  dots.append(d);
  const t = rnd(0, 1.2);
  tl.fromTo(d, { opacity: 0, scale: 0.3 }, { opacity: rnd(0.4, 0.9), scale: rnd(0.8, 1.6), duration: rnd(0.4, 0.8), ease: 'sine.inOut', yoyo: true, repeat: 15 }, t);
}

// ---------- 1 · Gancho, toque y recorrido ----------
tl.fromTo('#hook', { scale: 1.1 }, { scale: 1, duration: 0.5, ease: 'power2.out' }, 0);
tl.fromTo('#ph', { scale: 0.94, y: 40 }, { scale: 1, y: 0, duration: 0.6, ease: 'power3.out' }, 0);
// Toque en "Entrar a la fiesta"
tl.fromTo('#rip', { left: 340, top: 705, scale: 0.3, opacity: 1 },
  { scale: 2.2, opacity: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, TAP_V - 0.05);
tl.to('#ph', { scale: 0.985, duration: 0.1, yoyo: true, repeat: 1 }, TAP_V - 0.05);
SFX.push([TAP_V - 0.05, 'tap'], [TAP_V + 0.2, 'whoosh']);
// Mientras corre el scroll: velocidad, barra de avance y notas musicales
tl.fromTo('#speed', { autoAlpha: 0, scale: 0.3, rotation: -12 }, { autoAlpha: 1, scale: 1, rotation: 6, duration: 0.4, ease: 'back.out(2.4)' }, knots[1][0]);
tl.to('#speed', { scale: 1.1, duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: 15 }, knots[1][0] + 0.4);
SFX.push([knots[1][0], 'pop']);
tl.fromTo('#track', { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'power3.out' }, SCROLL_V[0] - 0.4);
tl.fromTo('#fill', { scaleY: 0 }, { scaleY: 1, duration: SCROLL_V[1] - SCROLL_V[0], ease: 'none' }, SCROLL_V[0]);
tl.fromTo('#ball', { y: 0, rotation: 0 }, { y: 1050, rotation: 720, duration: SCROLL_V[1] - SCROLL_V[0], ease: 'none' }, SCROLL_V[0]);
tl.to('#ph', { y: -12, rotation: 0.8, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: 7 }, SCROLL_V[0]);
const notes = $('#notes');
for (let i = 0; i < 18; i++) {
  const s = document.createElement('span');
  const left = i % 2 === 0;
  s.textContent = ['🎵', '🎶', '✨'][i % 3];
  s.style.cssText = `left:${left ? rnd(40, 150) : rnd(860, 940)}px;top:${rnd(1200, 1700)}px`;
  notes.append(s);
  const t = knots[1][0] + i * 0.62;
  tl.fromTo(s, { opacity: 0, y: 0, scale: 0.4, rotation: rnd(-25, 25) },
    { opacity: 1, y: -rnd(300, 520), scale: rnd(0.9, 1.3), rotation: rnd(-25, 25), duration: 1.8, ease: 'sine.out' }, t);
  tl.to(s, { opacity: 0, duration: 0.5 }, t + 1.3);
}
const out = (el, t) => tl.to(el, { autoAlpha: 0, duration: 0.25 }, t);
out(['#speed', '#track'], SCROLL_V[1] - 0.4);

// ---------- 2 · Cierre ----------
tl.set('#sc2', { autoAlpha: 1 }, END_V);
tl.fromTo('#sc2', { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(120% at 50% 50%)', duration: 0.55, ease: 'power3.inOut' }, END_V);
tl.set('#sc1', { autoAlpha: 0 }, END_V + 0.6);
SFX.push([END_V, 'whoosh']);
const rise = (el, t) => tl.fromTo(el, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, t);
rise('#e0', END_V + 0.25);
tl.fromTo('#e1', { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, END_V + 0.45);
rise('#e2', END_V + 0.6);
rise('#e3', END_V + 0.75);
tl.fromTo('#e4', { autoAlpha: 0, scale: 0.4, rotation: -4 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2)' }, END_V + 0.9);
SFX.push([END_V + 0.9, 'ding']);

tl.set({}, {}, DURATION);
window.DURATION = DURATION;
const img = $('#rec');
window.seek = (t) => {
  const v = Math.min(t, DURATION);
  tl.seek(v, false);
  const src = `scroll/${REC.slug}/${frameAt(recTime(v))}`;
  if (img.getAttribute('src') === src) return Promise.resolve();
  img.src = src;
  return img.decode().catch(() => {});
};
window.ready = document.fonts.ready
  .then(() => Promise.all([...document.images].filter((i) => i.src).map((i) => i.decode().catch(() => {}))))
  .then(() => { SFX.sort((a, b) => a[0] - b[0]); window.SFX = SFX; return window.seek(0); })
  .then(() => true);
// Vista previa manual: abre scroll-xv.html#play
if (location.hash === '#play') {
  window.ready.then(() => {
    const start = performance.now();
    const loop = (now) => { const t = (now - start) / 1000; window.seek(t); if (t < DURATION) requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  });
}
