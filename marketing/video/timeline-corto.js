// Línea de tiempo de la versión corta (voz2.mp3, 41.6 s). Igual que timeline.js:
// todo depende solo de `t`, y los tiempos salen de la locución.
// La duración pasa un poco de la voz para dejar respirar el cierre.
const DURATION = 43.0;
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
    tl.to(d, { y: rnd(-90, 90), x: rnd(-40, 40), rotation: '+=' + rnd(-50, 50), duration: rnd(2.5, 4), ease: 'sine.inOut', yoyo: true, repeat: 20 }, 0);
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

// ---------- 1 · Gancho (0 – 5.2) ----------
scene('sc1', 0);
pop('#s1a', 0.02, { d: 0.35 });
pop('#s1b', 0.5, { from: 2.2, rot: 10, d: 0.4 });
tl.to('#s1b', { scale: 1.12, duration: 0.14, yoyo: true, repeat: 1 }, 0.9);
tl.to('#s1hook', { y: -400, scale: 0.45, duration: 0.45, ease: 'power3.inOut' }, 1.15);
tl.fromTo('#s1wa', { autoAlpha: 0, x: -500, rotation: -18 }, { autoAlpha: 1, x: 0, rotation: -4, duration: 0.5, ease: 'back.out(1.4)' }, 1.3);
wiggle('#s1wa', 1.8, 5.0, -1.5);
rise('#s1t1', 1.25);
pop('#s1t2', 2.6, { rot: 4 });
rise('#s1t3', 4.0, { y: 50 });

// ---------- 2 · PDF y tía Lupita (5.2 – 12.0) ----------
scene('sc2', 5.2, 'circle');
rise('#s2pdf', 5.3, { y: 300 });
wiggle('#s2pdf', 5.8, 7.2, 2);
pop('#s2pix', 5.55, { rot: 8, to: -3 });
pop('#s2views', 6.18, { rot: -8, to: 2 });
out(['#s2pdf', '#s2pix', '#s2views'], 7.05, { y: -200, d: 0.3 });
rise('#s2chat', 7.4, { y: 200 });
pop('#s2b1', 9.15, { rot: 0, from: 0.2, d: 0.35 });
pop('#s2b3', 10.14, { rot: 0, from: 0.2, d: 0.35 });
pop('#s2fp', 11.1, { from: 0.1, rot: -30 });

// ---------- 3 · Existe Convite (12.0 – 17.5) ----------
scene('sc3', 12.0, 'up');
rise('#s3a', 12.1, { y: 60, d: 0.6 });
pop('#s3logo', 13.0, { from: 0.5, rot: 0, d: 0.6 });
const burst = document.getElementById('s3burst');
for (let i = 0; i < 26; i++) {
  const p = document.createElement('i');
  p.style.setProperty('--c', COLORS[i % COLORS.length]);
  burst.append(p);
  const ang = rnd(0, Math.PI * 2), dist = rnd(380, 760);
  tl.fromTo(p, { x: 0, y: 0, opacity: 1, scale: 0.4, rotation: 0 },
    { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist * 0.8, opacity: 0, scale: rnd(0.8, 1.6), rotation: rnd(-360, 360), duration: rnd(0.9, 1.4), ease: 'power2.out' }, 13.03);
}
rise('#s3word', 13.38, { y: 40, d: 0.45 });
rise('#s3b', 14.5, { y: 40 });
rise('#s3c', 15.75, { y: 60 });
tl.fromTo('#s3c mark', { scale: 1 }, { scale: 1.35, duration: 0.16, yoyo: true, repeat: 1 }, 16.04);

// ---------- 4 · Demo en el teléfono (17.5 – 22.8) ----------
scene('sc4', 17.5, 'circle');
pop('#s4t', 17.5);
tl.fromTo('#s4phone', { autoAlpha: 0, y: 1300, rotation: 10 }, { autoAlpha: 1, y: 0, rotation: 0, duration: 0.6, ease: 'power3.out' }, 17.45);
tl.to('#s4phone', { y: -18, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: 3 }, 18.1);
const caps = [['#s4c1', 17.68], ['#s4c2', 19.2], ['#s4c4', 20.44]];
caps.forEach(([el, t], i) => { pop(el, t, { rot: 0, from: 0.6, d: 0.35 }); if (caps[i + 1]) out(el, caps[i + 1][1] - 0.22, { y: -40, d: 0.2 }); });
tap('#s4rip', 17.95, 260, 560);
fade('#s4i0', '#s4i1', 18.3, 0.7);
const notes = document.getElementById('s4notes');
['🎵', '🎶', '🎵', '🎶', '🎵', '🎶'].forEach((n, i) => {
  const s = document.createElement('span'); s.textContent = n; notes.append(s);
  const side = i % 2 ? 1 : -1;
  tl.fromTo(s, { left: 215 + side * 250, top: 560 + rnd(-200, 200), opacity: 0, scale: 0.5, x: 0, y: 0 },
    { x: side * rnd(40, 110), y: -rnd(260, 420), opacity: 1, scale: 1.2, rotation: side * 20, duration: 0.7, ease: 'power1.out' }, 19.2 + i * 0.14);
  tl.to(s, { opacity: 0, y: '-=120', duration: 0.5 }, 19.9 + i * 0.14);
});
fade('#s4i1', '#s4i3', 20.44, 0.6);

// ---------- 5 · Confirmar con un toque (22.8 – 27.3) ----------
scene('sc5', 22.8, 'left');
pop('#s5t', 22.9);
rise('#s5phone', 23.0, { y: 500, d: 0.55 });
pop('#s5one', 24.3, { rot: 10, to: 6 });
tap('#s5rip', 24.55, 150, 765);
pop('#s5ok', 24.75, { from: 0.6, rot: 0, d: 0.3 });
out('#s5one', 25.15, { y: 0, s: 0.5, d: 0.2 });
tl.to('#s5phone', { scale: 0.88, y: -60, duration: 0.35, ease: 'power2.inOut' }, 25.15);
[['#s5n1', 25.38], ['#s5n2', 26.24]].forEach(([el, t], i) =>
  tl.fromTo(el, { autoAlpha: 0, x: i % 2 ? 700 : -700 }, { autoAlpha: 1, x: 0, duration: 0.4, ease: 'back.out(1.5)' }, t));

// ---------- 6 · Pase con QR (27.3 – 31.3) ----------
scene('sc6', 27.35, 'circle');
pop('#s6t', 27.4, { from: 2, rot: 6, to: -2, d: 0.35 });
tl.fromTo('#s6pass', { autoAlpha: 0, rotationY: 90, y: 80 }, { autoAlpha: 1, rotationY: 0, y: 0, duration: 0.55, ease: 'back.out(1.6)', transformPerspective: 1400 }, 28.05);
tl.fromTo('#s6scan', { top: 0, opacity: 1 }, { top: 316, duration: 0.4, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 29.75);
tl.set('#s6scan', { opacity: 0 }, 30.55);
pop('#s6door', 29.55, { rot: -6, to: -2 });
pop('#s6arr', 30.55, { rot: 0, from: 0.5, d: 0.3 });

// QR decorativo (no codifica nada): patrón fijo con sus tres esquinas
(() => {
  const N = 25; let cells = '';
  const finder = (x, y) => x < 7 && y < 7 || x >= N - 7 && y < 7 || x < 7 && y >= N - 7;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!finder(x, y) && rnd() > 0.52) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  const eye = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
  document.getElementById('s6qr').insertAdjacentHTML('afterbegin',
    `<svg viewBox="0 0 ${N} ${N}" fill="#2a1a2b" shape-rendering="crispEdges">${cells}${eye(0, 0)}${eye(N - 7, 0)}${eye(0, N - 7)}</svg>`);
})();

// ---------- 7 · Categorías (31.3 – 34.9) ----------
scene('sc7', 31.35, 'down');
const kinds = [31.42, 32.14, 33.1, 33.96];
kinds.forEach((t, i) => {
  pop(`#s7l${i}`, t, { rot: 0, from: 0.6, d: 0.3 });
  tl.fromTo(`#s7p${i}`, { autoAlpha: 0, x: 900, rotation: 14 }, { autoAlpha: 1, x: 0, rotation: i % 2 ? 3 : -3, duration: 0.4, ease: 'power3.out' }, t);
  if (kinds[i + 1]) {
    out(`#s7l${i}`, kinds[i + 1] - 0.16, { y: -40, d: 0.14 });
    tl.to(`#s7p${i}`, { x: -900, rotation: -14, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, kinds[i + 1] - 0.1);
  }
});

// ---------- 8 · Entrega (34.9 – 37.8) ----------
scene('sc8', 34.9, 'circle');
rise('#s8a', 34.95, { y: 40, d: 0.3 });
pop('#s8b', 35.4, { from: 2, rot: 6, d: 0.4 });
rise('#s8d', 36.55, { y: 60 });
tl.fromTo('#s8phone', { autoAlpha: 0, y: 700 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 36.7);
const sp = document.getElementById('s8sp');
for (let i = 0; i < 9; i++) {
  const s = document.createElement('span'); s.textContent = '✨'; sp.append(s);
  tl.fromTo(s, { left: rnd(60, 930), top: rnd(900, 1750), opacity: 0, scale: 0.2 },
    { opacity: 1, scale: rnd(0.8, 1.5), duration: 0.3, yoyo: true, repeat: 1, ease: 'sine.inOut' }, 36.8 + i * 0.1);
}

// ---------- 10 · Cierre (37.85 – fin) ----------
scene('sc10', 37.85, 'circle');
pop('#s10logo', 37.9, { from: 0.5, rot: 0, d: 0.55 });
rise('#s10word', 38.3, { y: 40, d: 0.45 });
pop('#s10cta', 38.8, { rot: -4 });
tl.to('#s10cta', { scale: 1.07, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 7 }, 39.3);
rise('#s10tag', 39.1);
[[-330, -9, 60], [0, 0, 0], [330, 9, 60]].forEach(([x, r, y], i) =>
  tl.fromTo(`#s10p${i}`, { autoAlpha: 0, x, y: 900, rotation: r }, { autoAlpha: 1, y, duration: 0.8, ease: 'back.out(1.2)' }, 38.2 + [0.15, 0, 0.3][i]));
tl.set('#s10p1', { zIndex: 2 }, 0);
const conf = document.getElementById('s10conf');
for (let i = 0; i < 70; i++) {
  const c = document.createElement('i');
  c.style.cssText = `--c:${COLORS[i % COLORS.length]};left:${rnd(0, 1060)}px`;
  conf.append(c);
  tl.fromTo(c, { y: 0, rotation: rnd(0, 360), rotationX: 0 },
    { y: 2100, x: rnd(-160, 160), rotation: rnd(360, 1080), rotationX: rnd(360, 1440), duration: rnd(2.6, 4.2), ease: 'none' }, 37.85 + rnd(0, 2.2));
}

tl.set({}, {}, DURATION);
window.DURATION = DURATION;
window.seek = (t) => { tl.seek(Math.min(t, DURATION), false); };
window.ready = document.fonts.ready.then(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {})))).then(() => { window.seek(0); return true; });
// Vista previa manual: abre index-corto.html#play para verlo correr en el navegador
if (location.hash === '#play') window.ready.then(() => tl.play(0));
