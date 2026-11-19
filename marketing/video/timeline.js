// Línea de tiempo del short. Todo depende solo de `t`, así que render.mjs puede
// pedir cualquier fotograma con window.seek(t). Los tiempos salen de la locución.
const DURATION = 76.05;
const tl = gsap.timeline({ paused: true });
const COLORS = ['#dfa33f', '#d97a4e', '#b84c74', '#4b93a4', '#ecc077', '#dd93ac'];

// Aleatorio con semilla: cada render produce exactamente lo mismo
let seed = 7;
const rnd = (a = 0, b = 1) => { seed = (seed * 16807) % 2147483647; return a + (b - a) * (seed / 2147483647); };

// ---------- Ayudantes ----------
const pop = (el, t, o = {}) => tl.fromTo(el,
  { autoAlpha: 0, scale: o.from ?? 0.3, rotation: o.rot ?? -8 },
  { autoAlpha: 1, scale: 1, rotation: o.to ?? 0, duration: o.d ?? 0.45, ease: 'back.out(2.2)' }, t);
const rise = (el, t, o = {}) => tl.fromTo(el,
  { autoAlpha: 0, y: o.y ?? 90, x: o.x ?? 0 },
  { autoAlpha: 1, y: 0, x: 0, duration: o.d ?? 0.5, ease: 'power3.out' }, t);
const out = (el, t, o = {}) => tl.to(el,
  { autoAlpha: 0, y: o.y ?? -70, scale: o.s ?? 1, duration: o.d ?? 0.3, ease: 'power2.in' }, t);
const fade = (from, to, t, d = 0.6) => {
  tl.fromTo(to, { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: d, ease: 'power2.out' }, t);
  if (from) tl.set(from, { autoAlpha: 0 }, t + d);
};
const tap = (el, t, x, y) => tl.fromTo(el,
  { left: x, top: y, scale: 0.3, opacity: 1 }, { scale: 2.4, opacity: 0, duration: 0.7, ease: 'power2.out' }, t);
const wiggle = (el, t, until, amp = 3) => tl.fromTo(el,
  { rotation: -amp }, { rotation: amp, duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil((until - t) / 0.9) }, t);

// Entrada de escena con cortinilla; la anterior se oculta al terminar
const WIPES = {
  circle: ['circle(0% at 50% 55%)', 'circle(125% at 50% 55%)'],
  up: ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  left: ['inset(0% 0% 0% 100%)', 'inset(0% 0% 0% 0%)'],
  down: ['inset(0% 0% 100% 0%)', 'inset(0% 0% 0% 0%)'],
};
let prev = null;
const scene = (id, t, wipe) => {
  const el = document.getElementById(id);
  // Triángulos de papel picado flotando al fondo
  for (let i = 0; i < 7; i++) {
    const d = document.createElement('div');
    d.className = 'deco';
    d.style.cssText = `--c:${COLORS[i % COLORS.length]};left:${rnd(20, 1010)}px;top:${rnd(40, 1840)}px;transform:rotate(${rnd(-40, 40)}deg) scale(${rnd(0.6, 1.5)})`;
    el.prepend(d);
    tl.to(d, { y: rnd(-90, 90), x: rnd(-40, 40), rotation: '+=' + rnd(-50, 50), duration: rnd(2.5, 4), ease: 'sine.inOut', yoyo: true, repeat: 30 }, 0);
  }
  if (!wipe) { tl.set(el, { autoAlpha: 1 }, t); }
  else {
    const [a, b] = WIPES[wipe];
    tl.set(el, { autoAlpha: 1 }, t - 0.25);
    tl.fromTo(el, { clipPath: a }, { clipPath: b, duration: 0.55, ease: 'power3.inOut' }, t - 0.25);
    if (prev) tl.set(prev, { autoAlpha: 0 }, t + 0.32);
  }
  prev = el;
};

// ---------- 1 · Gancho (0 – 6.5) ----------
scene('sc1', 0);
pop('#s1a', 0.02, { d: 0.35 });
pop('#s1b', 0.54, { from: 2.2, rot: 10, d: 0.4 });
pop('#s1c', 1.1);
tl.to('#s1b', { scale: 1.12, duration: 0.14, yoyo: true, repeat: 1 }, 1.54);
tl.to('#s1hook', { y: -400, scale: 0.45, duration: 0.5, ease: 'power3.inOut' }, 2.0);
tl.fromTo('#s1wa', { autoAlpha: 0, x: -500, rotation: -18 }, { autoAlpha: 1, x: 0, rotation: -4, duration: 0.55, ease: 'back.out(1.4)' }, 2.25);
wiggle('#s1wa', 2.9, 6.4, -1.5);
rise('#s1t1', 3.0);
pop('#s1t2', 4.3, { rot: 4 });
rise('#s1t3', 5.4, { y: 50 });

// ---------- 2 · PDF y tía Lupita (6.6 – 16.7) ----------
scene('sc2', 6.62, 'circle');
pop('#s2stamp', 6.72, { from: 3, rot: -22, to: -7, d: 0.3 });
tl.to('#s2stamp', { y: -520, scale: 0.55, duration: 0.4, ease: 'power3.inOut' }, 7.5);
rise('#s2pdf', 7.75, { y: 300 });
wiggle('#s2pdf', 8.3, 10.6, 2);
pop('#s2pix', 8.38, { rot: 8, to: -3 });
pop('#s2views', 9.2, { rot: -8, to: 2 });
out(['#s2pdf', '#s2pix', '#s2views', '#s2stamp'], 10.4, { y: -200, d: 0.35 });
rise('#s2chat', 10.75, { y: 200 });
pop('#s2b1', 12.3, { rot: 0, from: 0.2, d: 0.35 });
pop('#s2b2', 13.5, { rot: 0, from: 0.2, d: 0.35 });
pop('#s2b3', 14.4, { rot: 0, from: 0.2, d: 0.35 });
pop('#s2fp', 15.6, { from: 0.1, rot: -30 });

// ---------- 3 · Existe Convite (16.9 – 21.9) ----------
scene('sc3', 16.85, 'up');
rise('#s3a', 16.95, { y: 60, d: 0.6 });
pop('#s3logo', 17.72, { from: 0.5, rot: 0, d: 0.6 });
const burst = document.getElementById('s3burst');
for (let i = 0; i < 26; i++) {
  const p = document.createElement('i');
  p.style.setProperty('--c', COLORS[i % COLORS.length]);
  burst.append(p);
  const ang = rnd(0, Math.PI * 2), dist = rnd(380, 760);
  tl.fromTo(p, { x: 0, y: 0, opacity: 1, scale: 0.4, rotation: 0 },
    { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist * 0.8, opacity: 0, scale: rnd(0.8, 1.6), rotation: rnd(-360, 360), duration: rnd(0.9, 1.4), ease: 'power2.out' }, 17.75);
}
rise('#s3word', 18.14, { y: 40, d: 0.45 });
rise('#s3b', 19.24, { y: 40 });
rise('#s3c', 20.5, { y: 60 });
tl.fromTo('#s3c mark', { scale: 1 }, { scale: 1.35, duration: 0.16, yoyo: true, repeat: 1 }, 20.75);

// ---------- 4 · Demo en el teléfono (21.9 – 31.2) ----------
scene('sc4', 21.9, 'circle');
pop('#s4t', 22.0);
tl.fromTo('#s4phone', { autoAlpha: 0, y: 1300, rotation: 10 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.8, ease: 'power3.out' }, 22.7);
tl.to('#s4phone', { y: -18, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: 5 }, 23.6);
const caps = [['#s4c0', 23.9], ['#s4c1', 25.3], ['#s4c2', 26.8], ['#s4c3', 28.05], ['#s4c4', 29.4]];
caps.forEach(([el, t], i) => { pop(el, t, { rot: 0, from: 0.6, d: 0.35 }); if (caps[i + 1]) out(el, caps[i + 1][1] - 0.22, { y: -40, d: 0.2 }); });
tap('#s4rip', 24.5, 260, 560);
fade('#s4i0', '#s4i1', 25.35, 0.8);
const notes = document.getElementById('s4notes');
['🎵', '🎶', '🎵', '🎶', '🎵', '🎶'].forEach((n, i) => {
  const s = document.createElement('span'); s.textContent = n; notes.append(s);
  const side = i % 2 ? 1 : -1;
  tl.fromTo(s, { left: 215 + side * 250, top: 560 + rnd(-200, 200), opacity: 0, scale: 0.5, x: 0, y: 0 },
    { x: side * rnd(40, 110), y: -rnd(260, 420), opacity: 1, scale: 1.2, rotation: side * 20, duration: 0.7, ease: 'power1.out' }, 26.8 + i * 0.16);
  tl.to(s, { opacity: 0, y: '-=120', duration: 0.5 }, 27.5 + i * 0.16);
});
fade('#s4i1', '#s4i2', 28.05, 0.6);
fade('#s4i2', '#s4i3', 29.4, 0.6);

// ---------- 5 · Confirmar con un toque (31.3 – 38.8) ----------
scene('sc5', 31.3, 'left');
pop('#s5t', 31.4);
rise('#s5phone', 31.55, { y: 500, d: 0.6 });
pop('#s5one', 32.6, { rot: 10, to: 6 });
tap('#s5rip', 33.0, 150, 765);
pop('#s5ok', 33.72, { from: 0.6, rot: 0, d: 0.35 });
out('#s5one', 34.2, { y: 0, s: 0.5, d: 0.25 });
tl.to('#s5phone', { scale: 0.88, y: -60, duration: 0.4, ease: 'power2.inOut' }, 34.2);
[['#s5n1', 34.5], ['#s5n2', 35.24], ['#s5n3', 36.22]].forEach(([el, t], i) =>
  tl.fromTo(el, { autoAlpha: 0, x: i % 2 ? 700 : -700 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'back.out(1.5)' }, t));

// ---------- 6 · Enlace, pase QR y puerta (38.9 – 50.5) ----------
scene('sc6', 38.88, 'circle');
pop('#s6t', 38.95, { from: 2.4, rot: 8, to: -4, d: 0.35 });
tl.to('#s6t', { y: -640, scale: 0.6, rotation: 0, duration: 0.45, ease: 'power3.inOut' }, 39.65);
rise('#s6link', 39.95, { y: 200 });
tl.fromTo('#s6link code u', { backgroundColor: '#f7e9cc' }, { backgroundColor: '#dfa33f', color: '#2a1a2b', duration: 0.25, yoyo: true, repeat: 3 }, 41.2);
tl.fromTo('#s6pass', { autoAlpha: 0, rotationY: 90, y: 80 }, { autoAlpha: 1, rotationY: 0, y: 0, duration: 0.6, ease: 'back.out(1.6)', transformPerspective: 1400 }, 42.4);
out('#s6link', 44.45, { y: -120 });
tl.to('#s6pass', { y: -300, duration: 0.5, ease: 'power3.inOut' }, 44.6);
tl.fromTo('#s6scan', { top: 0, opacity: 1 }, { top: 316, duration: 0.5, ease: 'sine.inOut', yoyo: true, repeat: 2 }, 45.55);
tl.set('#s6scan', { opacity: 0 }, 47.05);
pop('#s6arr', 46.75, { rot: 0, from: 0.5, d: 0.3 });
rise('#s6list', 47.15, { y: 300 });
[['#s6r1', 47.8], ['#s6r2', 48.45], ['#s6r3', 49.3]].forEach(([el, t]) => rise(el, t, { y: 0, x: -80, d: 0.35 }));
tl.fromTo('#s6r3 b', { scale: 1 }, { scale: 1.3, duration: 0.18, yoyo: true, repeat: 1 }, 49.95);

// QR decorativo (no codifica nada): patrón fijo con sus tres esquinas
(() => {
  const N = 25; let cells = '';
  const finder = (x, y) => x < 7 && y < 7 || x >= N - 7 && y < 7 || x < 7 && y >= N - 7;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!finder(x, y) && rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  const eye = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
  document.getElementById('s6qr').insertAdjacentHTML('afterbegin',
    `<svg viewBox="0 0 ${N} ${N}" fill="#2a1a2b" shape-rendering="crispEdges">${cells}${eye(0, 0)}${eye(N - 7, 0)}${eye(0, N - 7)}</svg>`);
})();

// ---------- 7 · Categorías (50.5 – 59.0) ----------
scene('sc7', 50.45, 'down');
const kinds = [50.5, 51.72, 52.7, 53.56];
kinds.forEach((t, i) => {
  pop(`#s7l${i}`, t, { rot: 0, from: 0.6, d: 0.3 });
  tl.fromTo(`#s7p${i}`, { autoAlpha: 0, x: 900, rotation: 14 }, { autoAlpha: 1, x: 0, rotation: i % 2 ? 3 : -3, duration: 0.45, ease: 'power3.out' }, t);
  if (kinds[i + 1]) {
    out(`#s7l${i}`, kinds[i + 1] - 0.18, { y: -40, d: 0.16 });
    tl.to(`#s7p${i}`, { x: -900, rotation: -14, autoAlpha: 0, duration: 0.4, ease: 'power2.in' }, kinds[i + 1] - 0.12);
  }
});
out('#s7l3', 54.3, { y: -40, d: 0.2 });
[-342, -114, 114, 342].forEach((x, i) =>
  tl.to(`#s7p${i}`, { autoAlpha: 1, x, y: -330, scale: 0.46, rotation: (i - 1.5) * 5, duration: 0.6, ease: 'back.out(1.3)' }, 54.4 + i * 0.05));
rise('#s7a', 54.6);
rise('#s7b', 55.95);
tl.to('.md7', { y: '-=16', duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 2, stagger: 0.12 }, 55.3);

// ---------- 8 · Entrega (59.1 – 66.2) ----------
scene('sc8', 59.08, 'circle');
rise('#s8a', 59.14, { y: 40, d: 0.3 });
pop('#s8b', 59.62, { from: 2, rot: 6, d: 0.4 });
tl.fromTo('#s8c', { autoAlpha: 0, x: -900, rotation: -10 }, { autoAlpha: 1, x: 0, rotation: -2, duration: 0.5, ease: 'back.out(1.4)' }, 60.9);
rise('#s8d', 62.7, { y: 60 });
tl.fromTo('#s8phone', { autoAlpha: 0, y: 700 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 63.0);
const sp = document.getElementById('s8sp');
for (let i = 0; i < 9; i++) {
  const s = document.createElement('span'); s.textContent = '✨'; sp.append(s);
  tl.fromTo(s, { left: rnd(60, 930), top: rnd(1000, 1750), opacity: 0, scale: 0.2 },
    { opacity: 1, scale: rnd(0.8, 1.5), duration: 0.35, yoyo: true, repeat: 3, ease: 'sine.inOut' }, 63.5 + i * 0.18);
}

// ---------- 9 · Suelta ese PDF (66.3 – 71.1) ----------
scene('sc9', 66.28, 'up');
pop('#s9t', 66.35, { rot: 0, from: 0.7 });
rise('#s9pdf', 66.8, { y: -200 });
rise('#s9bin', 67.0, { y: 300 });
wiggle('#s9pdf', 67.3, 70.1, 5);
rise('#s9slow', 68.1, { y: 0, x: -60, d: 0.9 });
tl.to('#s9pdf', { top: 1290, scale: 0.55, duration: 2.0, ease: 'sine.inOut' }, 68.1);
tl.to('#s9pdf', { top: 1420, scale: 0, autoAlpha: 0, duration: 0.25, ease: 'power2.in' }, 70.1);
tl.to('#s9bin', { scale: 1.2, duration: 0.14, yoyo: true, repeat: 1 }, 70.3);
out(['#s9t', '#s9slow'], 69.95, { d: 0.2 });
pop('#s9ok', 70.14, { from: 0.4, rot: -6 });

// ---------- 10 · Cierre (71.2 – fin) ----------
scene('sc10', 71.18, 'circle');
pop('#s10logo', 71.25, { from: 0.5, rot: 0, d: 0.6 });
rise('#s10word', 71.7, { y: 40, d: 0.45 });
pop('#s10cta', 72.4, { rot: -4 });
tl.to('#s10cta', { scale: 1.07, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 7 }, 72.9);
rise('#s10tag', 73.5);
[[-330, -9, 60], [0, 0, 0], [330, 9, 60]].forEach(([x, r, y], i) =>
  tl.fromTo(`#s10p${i}`, { autoAlpha: 0, x, y: 900, rotation: r }, { autoAlpha: 1, y, duration: 0.8, ease: 'back.out(1.2)' }, 71.6 + [0.15, 0, 0.3][i]));
tl.set('#s10p1', { zIndex: 2 }, 0);
const conf = document.getElementById('s10conf');
for (let i = 0; i < 70; i++) {
  const c = document.createElement('i');
  c.style.cssText = `--c:${COLORS[i % COLORS.length]};left:${rnd(0, 1060)}px`;
  conf.append(c);
  tl.fromTo(c, { y: 0, rotation: rnd(0, 360), rotationX: 0 },
    { y: 2100, x: rnd(-160, 160), rotation: rnd(360, 1080), rotationX: rnd(360, 1440), duration: rnd(2.6, 4.2), ease: 'none' }, 71.2 + rnd(0, 2.4));
}

tl.set({}, {}, DURATION);
window.DURATION = DURATION;
window.seek = (t) => { tl.seek(Math.min(t, DURATION), false); };
window.ready = document.fonts.ready.then(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {})))).then(() => { window.seek(0); return true; });
// Vista previa manual: abre index.html#play para verlo correr en el navegador
if (location.hash === '#play') window.ready.then(() => tl.play(0));
