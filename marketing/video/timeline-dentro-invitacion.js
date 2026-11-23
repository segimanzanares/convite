// Línea de tiempo del video "Lo que hay dentro de una invitación" (18 s) con las capturas de capture-secciones.mjs.
// Cada sección entra como si se hiciera scroll y la cámara hace zoom sobre ella con su nombre arriba.
// window.SFX lista los efectos de sonido que build.sh mezcla con sfx.mjs.
const DATA = window.SECCIONES;
const DIR = `secciones/${DATA.slug}/`;
const DURATION = 18.0;
const SFX = [];
const tl = gsap.timeline({ paused: true });
const COLORS = ['#b8566f', '#dd93ac', '#3f5a4a', '#dfa33f', '#e9b8c2'];

let seed = 3;
const rnd = (a = 0, b = 1) => { seed = (seed * 16807) % 2147483647; return a + (b - a) * (seed / 2147483647); };
const $ = (s) => document.querySelector(s);
const emo = (s) => s.replace(/(\p{Extended_Pictographic}️?)/gu, '<span class="emo">$1</span>');

// Pantalla del teléfono: 640 px de ancho, 18 px de marco; las capturas son de 390 × 844 px CSS
const PHONE = { left: 220, top: 520, pad: 18 };
const W = 604, H = 1307, K = W / 390;

// ---------- Escenas ----------
const SCENES = [
  { id: 'intro', files: ['portada.png', 'inicio.png'] },
  { id: 'musica', label: ['🎵 Su canción', 'Suena en cuanto la abren'], maxZoom: 1.7 },
  { id: 'cuenta', label: ['⏳ Cuenta regresiva', 'Avanza sola hasta el gran día'], files: ['cuenta-0.png'] },
  { id: 'mapa', label: ['📍 El mapa', 'Un toque y llegan sin perderse'], tap: [193, 300] },
  { id: 'galeria', label: ['📸 Su galería', 'Su historia, foto por foto'] },
  { id: 'confirmar', label: ['✅ Confirmación', 'Sin llamadas ni perseguir a nadie'], tap: [125, 394], minZoom: 1.35 },
  { id: 'deseos', label: ['💌 Libro de deseos', 'Cada invitado deja su mensaje'], minZoom: 1.15 },
];
const screen = $('#screen');
const lbl = $('#lbl');
const dots = $('#dots');
SCENES.forEach((s, n) => {
  s.files ??= DATA.sections[s.id].files;
  s.rect = DATA.sections[s.id]?.rect;
  s.el = document.createElement('div');
  s.el.className = 'shot';
  if (n === 0) s.el.style.visibility = 'visible';
  s.el.innerHTML = `<div class="cam">${s.files.map((f) => `<img src="${DIR}${f}">`).join('')}</div>`;
  screen.append(s.el);
  s.cam = s.el.firstChild;
  s.imgs = [...s.cam.children];
  if (s.label) {
    s.lb = document.createElement('div');
    s.lb.className = 'lb h';
    s.lb.innerHTML = `<small>${n} / ${SCENES.length - 1}</small><b>${emo(s.label[0])}</b><span class="sub">${s.label[1]}</span>`;
    lbl.append(s.lb);
    dots.append(document.createElement('i'));
  }
});

// Encuadre que lleva el rectángulo (px CSS de la captura) al centro, sin dejar ver fuera de la captura
const frame = (rect, maxZoom = 1.7, minZoom = 1.45) => {
  const top = Math.max(0, rect.y), bottom = Math.min(844, rect.y + rect.h);
  const rw = rect.w * K, rh = (bottom - top) * K;
  const scale = Math.max(minZoom, Math.min(maxZoom, (0.94 * W) / rw, (0.9 * H) / rh));
  const cx = (rect.x + rect.w / 2) * K, cy = ((top + bottom) / 2) * K;
  const x = Math.min(0, Math.max(W - scale * W, W / 2 - scale * cx));
  const y = Math.min(0, Math.max(H - scale * H, H / 2 - scale * cy));
  return { x, y, scale };
};
// Un punto de la captura (px CSS) en coordenadas del teléfono, con el encuadre dado
const onPhone = ([px, py], f) => [PHONE.pad + f.x + f.scale * px * K, PHONE.pad + f.y + f.scale * py * K];
const tap = (t, [x, y]) => {
  tl.fromTo('#rip', { left: x, top: y, scale: 0.3, opacity: 1 },
    { scale: 2.2, opacity: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, t);
  SFX.push([t, 'tap']);
};
const showImg = (s, i, t, how = 'fade') => {
  const img = s.imgs[i];
  if (how === 'slide') tl.fromTo(img, { autoAlpha: 0, xPercent: 30 }, { autoAlpha: 1, xPercent: 0, duration: 0.35, ease: 'power3.out' }, t);
  else tl.fromTo(img, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'power2.out' }, t);
};

let prev = null, prevLb = $('#hook');
const enter = (s, t, d) => {
  tl.set(s.el, { visibility: 'visible' }, t);
  if (prev) {
    tl.fromTo(s.el, { yPercent: 100 }, { yPercent: 0, duration: 0.45, ease: 'power3.inOut' }, t);
    tl.to(prev.el, { yPercent: -30, duration: 0.45, ease: 'power3.inOut' }, t);
    tl.set(prev.el, { visibility: 'hidden' }, t + 0.46);
    SFX.push([t, 'whoosh']);
  }
  if (s.lb) {
    tl.to(prevLb, { autoAlpha: 0, y: -50, duration: 0.25, ease: 'power2.in' }, t);
    tl.fromTo(s.lb, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }, t + 0.15);
    tl.fromTo(s.lb.querySelector('b'), { scale: 0.85 }, { scale: 1, duration: 0.5, ease: 'back.out(2.5)' }, t + 0.15);
    SFX.push([t + 0.2, 'pop']);
    prevLb = s.lb;
    const n = SCENES.indexOf(s) - 1;
    tl.set([...dots.children], { backgroundColor: '#d9b7bf', scale: 1 }, t + 0.15);
    tl.set(dots.children[n], { backgroundColor: '#b8566f', scale: 1.3 }, t + 0.15);
  }
  let f = null;
  if (s.rect) {
    f = frame(s.rect, s.maxZoom, s.minZoom);
    tl.fromTo(s.cam, { x: 0, y: 0, scale: 1 }, { ...f, duration: 0.7, ease: 'power2.inOut', immediateRender: false }, t + 0.5);
    tl.to(s.cam, { x: 0, y: 0, scale: 1, duration: 0.35, ease: 'power2.in' }, t + d - 0.4);
  }
  prev = s;
  return f;
};

// ---------- Gancho (0 – 2) ----------
const [intro, musica, cuenta, mapa, galeria, confirmar, deseos] = SCENES;
enter(intro, 0, 2);
tl.fromTo('#hook', { scale: 1.08 }, { scale: 1, duration: 0.5, ease: 'power2.out' }, 0);
tl.fromTo('#ph', { y: 60 }, { y: 0, duration: 0.5, ease: 'power3.out' }, 0);
tap(0.85, onPhone([195, 470], { x: 0, y: 0, scale: 1 }));
showImg(intro, 1, 1.05);
tl.fromTo(intro.cam, { scale: 1 }, { scale: 1.04, duration: 0.9, ease: 'sine.out' }, 1.05);
tl.fromTo('#dots', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 1.9);

// ---------- Secciones ----------
const fMus = enter(musica, 2.0, 2.2);
// Notas que salen del botón de música
const fx = $('#fx');
const [bx, by] = onPhone([195, 808], fMus);
for (let i = 0; i < 9; i++) {
  const s = document.createElement('span');
  s.textContent = ['🎵', '🎶', '🎼'][i % 3];
  s.style.cssText = `left:${PHONE.left + bx - 42}px;top:${PHONE.top + by - 60}px`;
  fx.append(s);
  const t = 2.9 + i * 0.13;
  tl.fromTo(s, { opacity: 0, x: 0, y: 0, scale: 0.4 },
    { opacity: 1, x: rnd(-260, 260), y: -rnd(260, 520), scale: rnd(0.9, 1.4), rotation: rnd(-30, 30), duration: 0.9, ease: 'power2.out' }, t);
  tl.to(s, { opacity: 0, duration: 0.3 }, t + 0.7);
}
SFX.push([2.9, 'ding']);

enter(cuenta, 4.2, 2.2);
const fMapa = enter(mapa, 6.4, 2.2);
tap(7.5, onPhone(mapa.tap, fMapa));
enter(galeria, 8.6, 2.2);
const fConf = enter(confirmar, 10.8, 2.2);
tap(11.8, onPhone(confirmar.tap, fConf));
SFX.push([12.0, 'ding']);

// Libro de deseos: portada, se abre y pasa de hoja
const fDes = enter(deseos, 13.0, 3.3);
tap(14.0, onPhone([300, 545], fDes));
showImg(deseos, 1, 14.2);
tap(15.05, onPhone([297, 535], fDes));
showImg(deseos, 2, 15.2, 'slide');
for (let i = 0; i < 7; i++) {
  const s = document.createElement('span');
  s.textContent = ['💌', '💖', '✨'][i % 3];
  s.style.cssText = `left:${rnd(60, 160) + (i % 2) * 820}px;top:${rnd(900, 1500)}px`;
  fx.append(s);
  const t = 14.3 + i * 0.16;
  tl.fromTo(s, { opacity: 0, scale: 0.3, y: 0 }, { opacity: 1, scale: rnd(0.9, 1.3), y: -rnd(120, 260), duration: 0.8, ease: 'power2.out' }, t);
  tl.to(s, { opacity: 0, duration: 0.3 }, t + 0.8);
}

// ---------- Cierre (16.3 – 18) ----------
const END = 16.3;
tl.set('#sc2', { autoAlpha: 1 }, END);
tl.fromTo('#sc2', { clipPath: 'circle(0% at 50% 55%)' }, { clipPath: 'circle(120% at 50% 55%)', duration: 0.55, ease: 'power3.inOut' }, END);
tl.set('#sc1', { autoAlpha: 0 }, END + 0.6);
SFX.push([END, 'whoosh']);
const rise = (el, t) => tl.fromTo(el, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' }, t);
rise('#e0', END + 0.25);
tl.fromTo('#e1', { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, END + 0.45);
rise('#e2', END + 0.6);
rise('#e3', END + 0.75);
tl.fromTo('#e4', { autoAlpha: 0, scale: 0.4, rotation: -4 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'back.out(2)' }, END + 0.9);
SFX.push([END + 0.9, 'ding']);

// Papel picado al fondo
for (const sc of ['#sc1', '#sc2']) {
  for (let i = 0; i < 7; i++) {
    const d = document.createElement('div');
    d.className = 'deco';
    d.style.cssText = `--c:${COLORS[i % COLORS.length]};left:${rnd(20, 1010)}px;top:${rnd(40, 1840)}px;transform:rotate(${rnd(-40, 40)}deg) scale(${rnd(0.6, 1.4)})`;
    $(sc).prepend(d);
    tl.to(d, { y: rnd(-90, 90), x: rnd(-40, 40), rotation: '+=' + rnd(-50, 50), duration: rnd(2.5, 4), ease: 'sine.inOut', yoyo: true, repeat: 7 }, 0);
  }
}

tl.set({}, {}, DURATION);
window.DURATION = DURATION;
window.seek = (t) => { tl.seek(Math.min(t, DURATION), false); };
window.ready = document.fonts.ready
  .then(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))))
  .then(() => { SFX.sort((a, b) => a[0] - b[0]); window.SFX = SFX; window.seek(0); return true; });
// Vista previa manual: abre dentro-invitacion.html#play
if (location.hash === '#play') window.ready.then(() => tl.play(0));
