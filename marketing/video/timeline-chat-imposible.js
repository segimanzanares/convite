// Línea de tiempo del video "El chat imposible" (12 s). Como timeline.js: todo depende solo de `t`.
// window.SFX lista los efectos de sonido (segundo y tipo) que build.sh mezcla con sfx.mjs.
const DURATION = 12.0;
// Dominio que se muestra en la vista previa del enlace
const DOMAIN = 'convite.smsoluciones.online';
const tl = gsap.timeline({ paused: true });
const SFX = [];
const COLORS = ['#dfa33f', '#d97a4e', '#b84c74', '#4b93a4', '#ecc077', '#dd93ac'];

let seed = 11;
const rnd = (a = 0, b = 1) => { seed = (seed * 16807) % 2147483647; return a + (b - a) * (seed / 2147483647); };
const $ = (s) => document.querySelector(s);

const pop = (el, t, o = {}) => tl.fromTo(el,
  { autoAlpha: 0, scale: o.from ?? 0.3, rotation: o.rot ?? 0 },
  { autoAlpha: 1, scale: 1, rotation: o.to ?? 0, duration: o.d ?? 0.35, ease: 'back.out(2)' }, t);
const rise = (el, t, o = {}) => tl.fromTo(el,
  { autoAlpha: 0, y: o.y ?? 60 }, { autoAlpha: 1, y: 0, duration: o.d ?? 0.4, ease: 'power3.out' }, t);
const out = (el, t, o = {}) => tl.to(el, { autoAlpha: 0, y: o.y ?? -50, duration: o.d ?? 0.25, ease: 'power2.in' }, t);
const swap = (from, to, t) => { out(from, t); rise(to, t + 0.12); };
const tap = (t, x, y) => {
  tl.fromTo('#rip', { left: x, top: y, scale: 0.3, opacity: 1 }, { scale: 2.2, opacity: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, t);
  SFX.push([t, 'tap']);
};

// Papel picado al fondo
const sc1 = $('#sc1');
for (let i = 0; i < 8; i++) {
  const d = document.createElement('div');
  d.className = 'deco';
  d.style.cssText = `--c:${COLORS[i % COLORS.length]};left:${rnd(20, 1010)}px;top:${rnd(40, 1840)}px;transform:rotate(${rnd(-40, 40)}deg) scale(${rnd(0.6, 1.5)})`;
  sc1.prepend(d);
  tl.to(d, { y: rnd(-90, 90), x: rnd(-40, 40), rotation: '+=' + rnd(-50, 50), duration: rnd(2.5, 4), ease: 'sine.inOut', yoyo: true, repeat: 6 }, 0);
}

// ---------- Mensajes del grupo ----------
const WHO = {
  lupita: ['Tía Lupita', '#b84c74'], tono: ['Primo Toño', '#4b93a4'], abuela: ['Abuela Chela', '#b97a1f'],
  beto: ['Tío Beto', '#d97a4e'], mama: ['Mamá', '#7a4a9c'], vane: ['Prima Vane', '#1f9d6b'],
};
const MSGS = [
  [0.85, 'lupita', '¿A qué hora es?'],
  [1.3, 'tono', '¿Dónde queda? 📍'],
  [1.7, 'abuela', 'No se ve la foto, mijo 👓'],
  [2.05, 'beto', '¿Puedo llevar a mi primo?'],
  [2.4, 'mama', '¿La misa es antes o después?'],
  [2.7, 'vane', '¿Hay código de vestimenta? 👗'],
  [2.95, 'lupita', '¿¿a qué hora??'],
  [3.2, 'beto', '¿Y mi primo? 🙋‍♂️'],
  [3.4, 'tono', 'Mándenme la ubicación'],
  [3.6, 'abuela', '¿Qué día dijeron?'],
  [3.8, 'vane', '¿Dónde confirmo?'],
  [4.0, 'lupita', '¿¿¿A QUÉ HORA??? 😤', 'big'],
];
const box = $('#msgs');
const emo = (s) => s.replace(/(\p{Extended_Pictographic}(‍\p{Extended_Pictographic}|️|♂|♀)*)/gu, '<span class="emo">$1</span>');
const items = [{ t: 0.25, el: $('#m0') }];
for (const [t, who, text, cls] of MSGS) {
  const el = document.createElement('div');
  el.className = `m ${cls ?? ''}`;
  el.style.setProperty('--c', WHO[who][1]);
  el.innerHTML = `<i>${WHO[who][0]}</i>${emo(text)}`;
  box.append(el);
  items.push({ t, el, q: true });
}
const link = document.createElement('div');
link.className = 'm out link';
link.innerHTML = `<div class="lprev"><div class="img"><img src="shots/boda-serena-01.png"></div>
  <div class="txt"><b>Lucía &amp; Mateo</b><p>Nuestra boda · fecha, hora, mapa y confirmación</p><u>${DOMAIN}</u></div></div>
  <span class="url">${DOMAIN}<wbr>/i/lucia-mateo</span><span class="t">9:47 ✓✓</span>
  <div class="react h" id="react"><span class="emo">❤️😍🙌</span> 12</div>`;
box.append(link);
items.push({ t: 4.95, el: link, link: true });
const reply = document.createElement('div');
reply.className = 'm';
reply.style.marginTop = '34px';
reply.style.setProperty('--c', WHO.lupita[1]);
reply.innerHTML = `<i>Tía Lupita</i>Ya vi todo. ¡Ahí estaré! ${emo('😍')}`;
box.append(reply);
items.push({ t: 6.75, el: reply });

// El chat sube cuando el mensaje nuevo ya no cabe
const VIEW_H = 1420 - 36 - 190 - 130;
function layout() {
  for (const { t, el, q, link: isLink } of items) {
    const bottom = el.offsetTop + el.offsetHeight + 30;
    const shift = Math.min(0, VIEW_H - bottom - (isLink ? 40 : 0));
    tl.to(box, { y: shift, duration: 0.22, ease: 'power2.out' }, t);
    tl.fromTo(el, { autoAlpha: 0, scale: 0.5, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.28, ease: 'back.out(2)' }, t);
    SFX.push([t, el.classList.contains('out') ? 'send' : (q ? 'pop' : 'pop2')]);
  }
}

// ---------- 1 · Gancho y avalancha (0 – 4.8) ----------
tl.set('#sc1', { autoAlpha: 1 }, 0);
tl.fromTo('#h1', { scale: 1.08 }, { scale: 1, duration: 0.5, ease: 'power2.out' }, 0);
tl.fromTo('#ph', { y: 120 }, { y: 0, duration: 0.5, ease: 'power3.out' }, 0);
tl.set('#members', { autoAlpha: 0 }, 0.7);
tl.set('#typing', { autoAlpha: 1 }, 0.7);
const typers = ['Tía Lupita está', 'Primo Toño está', 'Tío Beto y 3 más están', 'Abuela Chela está', '5 personas están'];
typers.forEach((n, i) => tl.set('#typing', { textContent: `${n} escribiendo…` }, 0.7 + i * 0.75));
tl.set('#typing', { textContent: '5 personas están escribiendo…' }, 3.7);
// Signos de pregunta que van llenando la pantalla
const qm = $('#qm');
for (let i = 0; i < 16; i++) {
  const s = document.createElement('span');
  const side = i % 2 ? rnd(20, 120) : rnd(930, 1010);
  s.textContent = i % 3 ? '❓' : '🤔';
  s.style.cssText = `left:${side - 40}px;top:${rnd(520, 1700)}px`;
  qm.append(s);
  const t = 1.4 + i * 0.17;
  tl.fromTo(s, { opacity: 0, scale: 0.2, rotation: rnd(-40, 40) }, { opacity: 1, scale: rnd(0.8, 1.3), duration: 0.3, ease: 'back.out(3)' }, t);
  tl.to(s, { y: rnd(-60, 60), rotation: '+=' + rnd(-30, 30), duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: 1 }, t + 0.3);
  tl.to(s, { opacity: 0, scale: 0.2, duration: 0.25, ease: 'power2.in' }, 4.6 + rnd(0, 0.15));
}
// El teléfono tiembla con el último "¿A QUÉ HORA?"
tl.fromTo('#ph', { x: 0, rotation: 0 }, { keyframes: [
  { x: -14, rotation: -1.2, duration: 0.05 }, { x: 14, rotation: 1.2, duration: 0.05 }, { x: -10, rotation: -0.8, duration: 0.05 },
  { x: 10, rotation: 0.8, duration: 0.05 }, { x: -5, rotation: -0.3, duration: 0.05 }, { x: 0, rotation: 0, duration: 0.05 }] }, 4.05);
tl.fromTo('#h1', { scale: 1 }, { scale: 1.06, duration: 0.12, yoyo: true, repeat: 1 }, 4.05);

// ---------- 2 · El enlace y el silencio (4.8 – 7.3) ----------
swap('#h1', '#h2', 4.6);
tl.set('#typing', { autoAlpha: 0 }, 4.9);
tl.set('#members', { autoAlpha: 1 }, 4.9);
swap('#h2', '#h3', 5.7);
tl.to(items.filter((i) => i.q).map((i) => i.el), { opacity: 0.35, duration: 0.5 }, 5.7);
pop('#react', 6.15, { from: 0.2 });
SFX.push([6.15, 'pop2']);

// ---------- 3 · Se abre la invitación (7.3 – 10.3) ----------
tap(7.25, 390, 1000);
tl.to('#ph', { scale: 1.03, duration: 0.2, yoyo: true, repeat: 1, ease: 'power1.inOut' }, 7.25);
tl.set('#demo', { visibility: 'visible' }, 7.45);
tl.fromTo('#demo', { clipPath: 'circle(0% at 50% 60%)' }, { clipPath: 'circle(120% at 50% 60%)', duration: 0.45, ease: 'power3.inOut' }, 7.45);
swap('#h3', '#h4', 7.45);
SFX.push([7.45, 'whoosh']);
tap(8.05, 390, 1280);
tl.fromTo('#d1', { autoAlpha: 0, scale: 1.1 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power2.out' }, 8.2);
tl.fromTo('#d2', { autoAlpha: 0, yPercent: 100 }, { autoAlpha: 1, yPercent: 0, duration: 0.45, ease: 'power3.inOut' }, 8.85);
pop('#ok1', 9.0, { from: 0.4, rot: -6 });
SFX.push([9.0, 'ding']);
tl.fromTo('#d3', { autoAlpha: 0, yPercent: 100 }, { autoAlpha: 1, yPercent: 0, duration: 0.45, ease: 'power3.inOut' }, 9.55);
out('#ok1', 9.55, { y: -30, d: 0.2 });
pop('#ok2', 9.7, { from: 0.4, rot: 6 });
SFX.push([9.7, 'ding']);

// ---------- 4 · Cierre (10.3 – 12) ----------
tl.set('#sc2', { autoAlpha: 1 }, 10.2);
tl.fromTo('#sc2', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.5, ease: 'power3.inOut' }, 10.2);
tl.set('#sc1', { autoAlpha: 0 }, 10.75);
SFX.push([10.2, 'whoosh']);
pop('#e1', 10.45, { from: 0.5, d: 0.5 });
rise('#e2', 10.65, { y: 40 });
rise('#e3', 10.8, { y: 40 });
pop('#e4', 11.0, { from: 0.4, rot: -4 });
SFX.push([11.0, 'ding']);
rise('#e5', 11.2, { y: 40 });
tl.fromTo('#e4', { scale: 1 }, { scale: 1.08, duration: 0.18, yoyo: true, repeat: 1 }, 11.6);

tl.set({}, {}, DURATION);
window.DURATION = DURATION;
window.seek = (t) => { tl.seek(Math.min(t, DURATION), false); };
window.ready = document.fonts.ready
  .then(() => Promise.all([...document.images].map((i) => i.decode().catch(() => {}))))
  .then(() => { layout(); SFX.sort((a, b) => a[0] - b[0]); window.SFX = SFX; window.seek(0); return true; });
// Vista previa manual: abre chat-imposible.html#play
if (location.hash === '#play') window.ready.then(() => tl.play(0));
