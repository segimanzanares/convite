// Genera las imágenes de las publicaciones 16, 19 y 20 de "Publicaciones para ganar alcance",
// y la del servicio de video semblanza.
//   node publicaciones/build.mjs            -> todas
//   node publicaciones/build.mjs 16 20      -> solo esas
//   node publicaciones/build.mjs semblanza  -> la del video semblanza
//   node publicaciones/build.mjs comentario -> la de comentarios en grupos de Facebook
// Usa las capturas de video/shots y las fuentes y logos de video/assets.
import { chromium } from '../video/node_modules/playwright-core/index.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const VIDEO = join(HERE, '..', 'video');
const shot = (name) => pathToFileURL(join(VIDEO, 'shots', `${name}.png`)).href;
const asset = (name) => pathToFileURL(join(VIDEO, 'assets', name)).href;
const demoPhoto = (path) => pathToFileURL(join(HERE, '..', '..', 'public', 'invitations', path)).href;

const CSS = `
@font-face { font-family: Geist; font-weight: 400; src: url(${asset('fonts/geist-400-normal.woff2')}); }
@font-face { font-family: Geist; font-weight: 500; src: url(${asset('fonts/geist-500-normal.woff2')}); }
@font-face { font-family: Geist; font-weight: 600; src: url(${asset('fonts/geist-600-normal.woff2')}); }
@font-face { font-family: Cormorant; font-weight: 600; src: url(${asset('fonts/cormorant-garamond-600-normal.woff2')}); }
@font-face { font-family: GreatVibes; src: url(${asset('fonts/great-vibes-400-normal.woff2')}); }
:root { --ink:#2a1a2b; --plum:#4a2c4c; --ivory:#fffdf9; --cream:#f8f1e6; --gold:#dfa33f; --gold-pale:#f7e9cc; --gold-deep:#b97a1f; --rose:#b84c74; --muted:#6d5a6e; }
* { box-sizing:border-box; margin:0; padding:0; }
html, body { width:var(--w); height:var(--h); overflow:hidden; }
body { font-family:Geist,'Noto Color Emoji',sans-serif; color:var(--ink); background:var(--ivory); -webkit-font-smoothing:antialiased; }
.emo { font-family:'Noto Color Emoji'; }
.slide { position:relative; width:var(--w); height:var(--h); overflow:hidden; }
.light { background: radial-gradient(90% 60% at 80% 10%, #fff 0%, var(--ivory) 45%, var(--cream) 100%); }
.dark { background: radial-gradient(110% 70% at 50% 25%, #5a3a5c 0%, var(--plum) 35%, var(--ink) 100%); color:var(--ivory); }
.frame { position:absolute; inset:34px; border:2px solid rgba(223,163,63,.55); border-radius:28px; pointer-events:none; }
.frame::after { content:''; position:absolute; inset:10px; border:1px solid rgba(223,163,63,.28); border-radius:20px; }
.serif { font-family:Cormorant,serif; font-weight:600; letter-spacing:-.01em; }
.script { font-family:GreatVibes,cursive; font-weight:400; }
.eyebrow { font-size:26px; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:var(--gold-deep); }
.dark .eyebrow { color:var(--gold); }
.logo { position:absolute; height:74px; }
.count { position:absolute; top:78px; right:84px; font-size:24px; font-weight:500; letter-spacing:.12em; color:var(--muted); }
.dark .count { color:rgba(255,253,249,.6); }

/* Celular */
.phone { position:absolute; width:var(--pw); aspect-ratio:390/844; border-radius:calc(var(--pw) * .14); background:#1b1119; padding:calc(var(--pw) * .035);
  box-shadow: 0 40px 80px -20px rgba(42,26,43,.45), 0 12px 30px rgba(42,26,43,.2), inset 0 0 0 2px #3b2a3a; }
.phone img.scr { width:100%; height:100%; object-fit:cover; object-position:top; border-radius:calc(var(--pw) * .11); display:block; }
.phone::before { content:''; position:absolute; top:calc(var(--pw) * .055); left:50%; transform:translateX(-50%); width:28%; height:calc(var(--pw) * .06); background:#1b1119; border-radius:99px; z-index:2; }

.badge { display:inline-flex; align-items:center; justify-content:center; width:96px; height:96px; border-radius:50%; background:var(--ink); color:var(--gold); font-family:Geist,sans-serif; font-weight:600; font-size:48px; }
.pill { display:inline-flex; align-items:center; gap:14px; padding:20px 34px; border-radius:99px; font-size:30px; font-weight:600; }
.card { background:#fff; border-radius:26px; box-shadow:0 24px 50px -16px rgba(42,26,43,.35); }
.crop { background-repeat:no-repeat; }
`;

/** Recorte de una captura: x0..x1, y0..y1 en fracción de la imagen (390 × 844 pt). */
function crop(name, [x0, x1], [y0, y1], style = '') {
  const w = x1 - x0, h = y1 - y0;
  const ratio = (w * 390) / (h * 844);
  return `<div class="crop" style="aspect-ratio:${ratio};background-image:url(${shot(name)});background-size:${100 / w}% ${100 / h}%;background-position:${(x0 / (1 - w || 1)) * 100}% ${(y0 / (1 - h || 1)) * 100}%;${style}"></div>`;
}

const phone = (name, style, pw = 420, pos = 'top') =>
  `<div class="phone" style="--pw:${pw}px;${style}"><img class="scr" src="${shot(name)}" style="object-position:${pos}"></div>`;

function qr(seed = 7) {
  let s = seed; const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const N = 25, finder = (x, y) => (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9);
  let cells = '';
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (!finder(x, y) && rnd() > 0.5) cells += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  const eye = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
  return `<svg viewBox="-1 -1 ${N + 2} ${N + 2}" fill="#2a1a2b" shape-rendering="crispEdges" style="width:100%;display:block;background:#fff">${cells}${eye(0, 0)}${eye(N - 7, 0)}${eye(0, N - 7)}</svg>`;
}

const LOGO_DARK = asset('logo-negativo.png');
const LOGO_LIGHT = asset('logo-horizontal.png');

// ---------------------------------------------------------------- 16
function feature16(n, title, body, visual, extra = '') {
  return `<div class="slide light"><div class="frame"></div>
    <div class="count">${n + 1} / 7</div>
    <div style="position:absolute;left:96px;top:0;bottom:0;width:440px;display:flex;flex-direction:column;justify-content:center;gap:34px">
      <span class="badge">${n}</span>
      <h2 class="serif" style="font-size:78px;line-height:.98">${title}</h2>
      <p style="font-size:32px;line-height:1.38;color:var(--muted);font-weight:500">${body}</p>
    </div>
    ${visual}${extra}
  </div>`;
}

const P16 = [
  // 1 · Portada
  `<div class="slide dark"><div class="frame"></div>
    <div style="position:absolute;top:120px;left:96px;right:96px">
      <div class="eyebrow">Papel vs. digital</div>
      <h1 class="serif" style="font-size:104px;line-height:.95;margin-top:30px"><span style="color:var(--gold)">5 cosas</span> que una invitación digital hace y una de papel no</h1>
    </div>
    <div class="card" style="position:absolute;left:120px;top:770px;width:360px;height:470px;transform:rotate(-8deg);background:var(--gold-pale);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;border:10px solid #fff;box-shadow:0 30px 60px -10px rgba(0,0,0,.5)">
      <div style="font-size:20px;letter-spacing:.3em;color:var(--gold-deep);font-weight:600">NOS CASAMOS</div>
      <div class="script" style="font-size:74px;color:var(--ink);line-height:1">Ana<br>&amp; Luis</div>
      <div style="width:120px;height:2px;background:var(--gold)"></div>
      <div style="font-size:20px;letter-spacing:.2em;color:var(--muted)">13 · 01 · 2027</div>
    </div>
    ${phone('boda-clasica-01', 'right:150px;top:640px;transform:rotate(5deg)', 250)}
    <div class="pill" style="position:absolute;right:96px;bottom:96px;background:var(--gold);color:var(--ink)">Desliza →</div>
  </div>`,
  feature16(1, 'Suena su canción', 'La abren y empieza la música que eligieron.',
    phone('boda-floral-01', 'right:90px;top:170px', 400),
    `<div class="card" style="position:absolute;right:400px;top:960px;padding:24px 30px;display:flex;align-items:center;gap:18px;font-size:28px;font-weight:600"><span class="emo" style="font-size:44px">🎵</span>Su canción</div>`),
  feature16(2, 'Te lleva a la fiesta', 'Un toque al mapa y el GPS hace el resto. Nadie vuelve a preguntar “¿dónde queda?”',
    phone('boda-clasica-04', 'right:90px;top:170px', 400),
    `<div class="card" style="position:absolute;right:400px;top:240px;padding:24px 30px;display:flex;align-items:center;gap:18px;font-size:28px;font-weight:600"><span class="emo" style="font-size:44px">📍</span>Cómo llegar</div>`),
  feature16(3, 'Cuenta los días contigo', 'La cuenta regresiva avanza sola hasta el gran día.',
    phone('xv-aurora-08', 'right:90px;top:170px', 400),
    `<div class="card" style="position:absolute;right:400px;top:980px;padding:24px 30px;display:flex;align-items:center;gap:18px;font-size:28px;font-weight:600"><span class="emo" style="font-size:44px">⏳</span>En vivo</div>`),
  feature16(4, 'Confirman con un toque', 'Sin llamadas ni perseguir a nadie: en tu panel ves quién viene.',
    phone('xv-aurora-12', 'right:90px;top:170px', 400),
    `<div class="card" style="position:absolute;right:380px;top:1010px;padding:24px 30px;width:420px;font-size:26px">
       <div style="font-size:20px;letter-spacing:.16em;color:var(--muted);font-weight:600">TU PANEL</div>
       <div style="display:flex;justify-content:space-between;margin-top:12px;font-weight:600"><span>Familia Pérez</span><span style="color:#2f8f5b">✓ 4 lugares</span></div>
       <div style="display:flex;justify-content:space-between;margin-top:8px;font-weight:600"><span>Tía Lupita</span><span style="color:#2f8f5b">✓ 2 lugares</span></div>
     </div>`),
  // 5 · Galería en vivo (ilustración con fotos de las demos)
  feature16(5, 'Junta las fotos de todos', 'Escanean un QR, suben sus fotos y salen en la pantalla del salón.',
    `<div style="position:absolute;right:84px;top:250px;width:470px;padding:18px;background:#1b1119;border-radius:22px;box-shadow:0 40px 80px -20px rgba(42,26,43,.5)">
       <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
         ${crop('boda-clasica-09', [0.2, 0.82], [0.46, 0.746], 'border-radius:10px')}
         ${crop('boda-floral-09', [0.2, 0.82], [0.14, 0.426], 'border-radius:10px')}
         ${crop('boda-moderna-01', [0.19, 0.81], [0.6, 0.886], 'border-radius:10px')}
         ${crop('xv-aurora-02', [0.2, 0.82], [0.07, 0.356], 'border-radius:10px')}
       </div>
       <div style="text-align:center;color:var(--gold-pale);font-size:20px;letter-spacing:.2em;margin-top:14px;font-weight:600">PANTALLA DEL SALÓN</div>
     </div>
     <div style="position:absolute;right:360px;top:960px;width:240px;padding:18px;background:#fff;border-radius:22px;box-shadow:0 24px 50px -16px rgba(42,26,43,.4);transform:rotate(-5deg)">
       ${qr(11)}
       <div style="text-align:center;font-size:20px;font-weight:600;margin-top:10px;letter-spacing:.08em">ESCANEA Y SUBE TU FOTO</div>
     </div>
     <div class="emo" style="position:absolute;right:150px;top:1050px;font-size:110px;transform:rotate(10deg)">📸</div>`),
  // 7 · Cierre
  `<div class="slide dark"><div class="frame"></div>
    <div style="position:absolute;top:190px;left:96px;right:96px;text-align:center">
      <div class="script" style="font-size:96px;color:var(--gold);line-height:1">y el papel…</div>
      <h2 class="serif" style="font-size:96px;line-height:1;margin-top:20px">mejor guárdalo para el recuerdo</h2>
    </div>
    <div style="position:absolute;top:620px;left:150px;right:150px;display:flex;flex-wrap:wrap;justify-content:center;gap:20px">
      ${['🎵 Música', '📍 Mapa', '⏳ Cuenta regresiva', '✅ Confirmación', '📸 Galería'].map((t) =>
        `<span class="pill" style="border:2px solid rgba(223,163,63,.6);color:var(--ivory);padding:16px 28px">${t.replace(/^(\S+)/, '<span class="emo">$1</span>')}</span>`).join('')}
    </div>
    <div style="position:absolute;top:900px;left:96px;right:96px;text-align:center;font-size:40px;line-height:1.35;font-weight:500">
      ¿Cuál te gustó más?<br><span style="color:var(--gold)">Cuéntanos en comentarios</span> <span class="emo">👇</span>
    </div>
    <img class="logo" src="${LOGO_DARK}" style="left:50%;transform:translateX(-50%);bottom:110px;height:110px">
  </div>`,
];

// ---------------------------------------------------------------- 19
const GROUPS = [
  { title: 'Bodas', emo: '💍', line: 'Del dorado elegante al minimalismo', items: [['Clásica', 'boda-clasica-01'], ['Floral', 'boda-floral-01'], ['Moderna', 'boda-moderna-01'], ['Serena', 'boda-serena-01']] },
  { title: 'XV años', emo: '👑', line: 'Una para cada estilo de quinceañera', items: [['Aurora', 'xv-aurora-01'], ['Celestial', 'xv-celestial-01'], ['Disco', 'xv-disco-01'], ['Jardín', 'xv-jardin-01']] },
  { title: 'Bautizos', emo: '🕊️', line: 'Tiernas, sencillas y llenas de luz', items: [['Celeste', 'bautizo-celeste-01'], ['Luz', 'bautizo-luz-01'], ['Nube', 'bautizo-nube-01'], ['Olivo', 'bautizo-olivo-01']] },
  { title: 'Cumpleaños', emo: '🎂', line: 'Para festejar a cualquier edad', items: [['Confeti', 'cumpleanos-confeti-01'], ['Floral', 'cumpleanos-floral-01'], ['Grafito', 'cumpleanos-grafito-01'], ['Reserva', 'cumpleanos-reserva-01']] },
  { title: 'Fiestas infantiles', emo: '🎈', line: 'Su tema favorito, en una invitación', items: [['Dino', 'infantil-dino-01'], ['Dulce', 'infantil-dulce-01'], ['Espacial', 'infantil-espacial-01'], ['Unicornio', 'infantil-unicornio-01']] },
  { title: 'Revelación de género', emo: '🍼', line: '¿Niño o niña? La respuesta, en la fiesta', items: [['Dulce', 'revelacion-dulce-01'], ['Estrellas', 'revelacion-estrellas-01'], ['Globos', 'revelacion-globos-01'], ['Osito', 'revelacion-osito-01']] },
];
const POS = { 'boda-moderna-01': 'top', 'cumpleanos-confeti-01': 'top', 'cumpleanos-grafito-01': 'top', 'infantil-dino-01': 'top', 'xv-aurora-01': 'center 8%', 'bautizo-nube-01': 'center 45%', 'boda-clasica-01': 'center 45%', 'revelacion-dulce-01': 'center 12%' };
const ALL = GROUPS.flatMap((g) => g.items.map((i) => i[1]));
/** Las portadas alternando grupos, para que el collage muestre todos los tipos de evento. */
const MIXED = [0, 1, 2, 3].flatMap((i) => GROUPS.map((g) => g.items[i][1]));
const FAVS = ['boda-clasica-01', 'xv-disco-01', 'bautizo-nube-01', 'cumpleanos-reserva-01', 'infantil-espacial-01', 'revelacion-osito-01'];
/** Abanico de 6 celulares: posición, giro y capa de cada uno. */
const fan = (left, step, pw, dy = 0) => FAVS.map((s, i) => phone(s, `left:${left + i * step}px;top:${[60, 25, 0, 0, 25, 60][i] + dy}px;transform:rotate(${(i - 2.5) * 4}deg);z-index:${[1, 2, 3, 3, 2, 1][i]}`, pw)).join('');

const P19 = [
  `<div class="slide dark">
    <div style="position:absolute;left:-180px;top:-160px;width:1440px;display:grid;grid-template-columns:repeat(5,1fr);gap:22px;transform:rotate(-9deg)">
      ${[...MIXED, ...MIXED.slice(0, 6)].map((s) => `<img src="${shot(s)}" style="width:100%;aspect-ratio:390/700;object-fit:cover;object-position:top;border-radius:20px;box-shadow:0 14px 30px rgba(0,0,0,.4)">`).join('')}
    </div>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(42,26,43,.35) 0%,rgba(42,26,43,.82) 38%,rgba(42,26,43,.82) 66%,rgba(42,26,43,.35) 100%)"></div>
    <div style="position:absolute;top:400px;left:90px;right:90px;text-align:center">
      <div class="eyebrow">Catálogo Convite</div>
      <h1 class="serif" style="font-size:128px;line-height:.95;margin-top:26px">Nuestras <span style="color:var(--gold)">24 plantillas</span> en un vistazo</h1>
      <div class="pill" style="margin-top:46px;background:var(--gold);color:var(--ink)">Guárdala y elige con calma <span class="emo">📌</span></div>
    </div>
  </div>`,
  ...GROUPS.map((g, gi) => `<div class="slide light"><div class="frame"></div>
    <div class="count">${gi + 2} / 8</div>
    <div style="position:absolute;top:90px;left:96px;right:96px">
      <h2 class="serif" style="font-size:${g.title.length > 16 ? 76 : 88}px;line-height:1;padding-right:110px">${g.title} <span class="emo" style="font-size:64px">${g.emo}</span></h2>
      <p style="font-size:30px;color:var(--muted);font-weight:500;margin-top:10px">${g.line}</p>
    </div>
    <div style="position:absolute;top:270px;left:0;right:0;display:grid;grid-template-columns:340px 340px;justify-content:center;gap:24px 60px">
      ${g.items.map(([name, s]) => `<div>
        <img src="${shot(s)}" style="width:340px;height:410px;object-fit:cover;object-position:${POS[s] ?? 'center 40%'};border-radius:24px;display:block;box-shadow:0 22px 44px -16px rgba(42,26,43,.45);border:6px solid #fff">
        <div class="serif" style="text-align:center;font-size:38px;margin-top:6px">${name}</div></div>`).join('')}
    </div>
  </div>`),
  `<div class="slide dark"><div class="frame"></div>
    <div style="position:absolute;top:150px;left:96px;right:96px;text-align:center">
      <h2 class="serif" style="font-size:120px;line-height:1">¿Cuál es <span style="color:var(--gold)">la tuya</span>?</h2>
      <p style="font-size:38px;font-weight:500;margin-top:24px">Escríbenos su nombre en comentarios <span class="emo">👇</span></p>
    </div>
    <div style="position:absolute;top:500px;left:0;right:0;height:520px">
      ${fan(70, 148, 190, -10)}
    </div>
    <p style="position:absolute;top:1060px;left:96px;right:96px;text-align:center;font-size:32px;color:var(--gold-pale);font-weight:500">Todas se adaptan con tus fotos, colores y textos</p>
    <img class="logo" src="${LOGO_DARK}" style="left:50%;transform:translateX(-50%);bottom:84px;height:92px">
  </div>`,
];

// ---------------------------------------------------------------- 20
function story(n, q, a, visual = '') {
  return `<div class="slide dark">
    <div style="position:absolute;top:250px;left:90px;right:90px">
      <div class="eyebrow">Preguntas frecuentes · ${n}/8</div>
      <h2 class="serif" style="font-size:110px;line-height:.98;margin-top:28px;color:var(--gold)">${q}</h2>
      <p style="font-size:44px;line-height:1.35;margin-top:36px;font-weight:500">${a}</p>
    </div>
    ${visual}
    <img class="logo" src="${LOGO_DARK}" style="left:90px;bottom:300px;height:64px;opacity:.85">
  </div>`;
}

const feat = (t) => `<div style="display:flex;align-items:center;gap:22px;font-size:36px;font-weight:500;padding:22px 0;border-bottom:1px solid rgba(223,163,63,.25)"><span style="color:var(--gold);font-size:40px">✓</span>${t}</div>`;

const calendar = () => {
  const days = Array.from({ length: 14 }, (_, i) => i + 1);
  const hl = new Set([4, 5, 8]), weekend = new Set([6, 7, 13, 14]);
  return `<div class="card" style="position:absolute;left:90px;right:90px;top:1000px;padding:36px;background:var(--ivory);color:var(--ink)">
    <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:12px;text-align:center;font-size:24px;font-weight:600;color:var(--muted)">
      ${['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d) => `<div>${d}</div>`).join('')}
      ${days.map((d) => `<div style="padding:18px 0;border-radius:14px;font-size:32px;${d === 1 ? 'background:var(--ink);color:var(--gold)' : hl.has(d) ? 'background:var(--gold-pale);color:var(--ink)' : weekend.has(d) ? 'color:#c9bdc9' : 'color:var(--ink)'}">${d}</div>`).join('')}
    </div>
    <div style="display:flex;gap:30px;margin-top:24px;font-size:24px;font-weight:600"><span><span style="display:inline-block;width:20px;height:20px;border-radius:5px;background:var(--ink);vertical-align:-3px"></span> Recibimos tus datos</span><span><span style="display:inline-block;width:20px;height:20px;border-radius:5px;background:var(--gold-pale);vertical-align:-3px"></span> Lista para revisar</span><span style="color:#b3a6b3">Fin de semana</span></div>
  </div>`;
};

const P20 = [
  `<div class="slide dark">
    <div style="position:absolute;top:360px;left:90px;right:90px;text-align:center">
      <img src="${LOGO_DARK}" style="height:120px">
      <h1 class="serif" style="font-size:150px;line-height:.95;margin-top:120px">¿Tienes <span style="color:var(--gold)">dudas</span>?</h1>
      <p style="font-size:46px;line-height:1.35;margin-top:40px;font-weight:500">Aquí están las que más nos hacen.</p>
      <div class="pill" style="margin-top:80px;background:var(--gold);color:var(--ink);font-size:36px">Toca para avanzar →</div>
    </div>
  </div>`,
  story(2, '¿Cuánto cuesta?', 'Desde <b style="color:var(--gold)">$499 pesos</b> por invitación, con un diseño del catálogo. Pago único, sin mensualidades.',
    `<div style="position:absolute;left:90px;right:90px;top:1060px;text-align:center">
       <div style="font-size:34px;letter-spacing:.2em;color:var(--gold-pale);font-weight:600">DESDE</div>
       <div class="serif" style="font-size:260px;line-height:1.15;margin:10px 0 30px;color:var(--gold)">$499</div>
       <div style="font-size:30px;letter-spacing:.2em;color:var(--gold-pale);font-weight:600">MXN · PAGO ÚNICO</div>
     </div>`),
  story(3, '¿Qué cambia entre planes?', 'Los más completos suman:',
    `<div style="position:absolute;left:90px;right:90px;top:820px">
       ${feat('Lista de invitados con enlaces personalizados')}${feat('Confirmaciones en línea en tu panel')}${feat('Pases de entrada con QR')}${feat('Galería en vivo en la pantalla del salón')}${feat('Un diseño exclusivo para tu evento')}
     </div>`),
  story(4, '¿En cuánto tiempo está lista?', 'De <b style="color:var(--gold)">3 a 5 días hábiles</b> después de recibir tus datos y fotos. ¿Tu fecha está cerca? Escríbenos.', calendar()),
  story(5, '¿Puedo pedir cambios?', 'Sí. Incluye <b style="color:var(--gold)">2 rondas de ajustes</b> antes de compartirla.',
    phone('boda-floral-02', 'left:50%;margin-left:-160px;top:850px', 320) +
    `<div class="card" style="position:absolute;right:110px;top:1000px;padding:22px 28px;color:var(--ink);font-size:28px;font-weight:600;transform:rotate(4deg)"><span class="emo">✏️</span> ¿Cambiamos la hora?</div>
     <div class="card" style="position:absolute;left:110px;top:1240px;padding:22px 28px;color:var(--ink);font-size:28px;font-weight:600;transform:rotate(-4deg)"><span class="emo">✅</span> Listo, ya quedó</div>`),
  story(6, '¿Cómo se la envío a mis invitados?', 'Recibes un enlace propio para mandar por WhatsApp, redes o correo. Ellos no instalan nada.',
    `<div style="position:absolute;left:90px;right:90px;top:1010px;padding:34px;border-radius:30px;background:#efe6da">
       <div style="margin-left:auto;width:560px;background:#d9f4cf;border-radius:22px 22px 6px 22px;padding:14px;box-shadow:0 2px 0 rgba(0,0,0,.08)">
         <div style="display:flex;gap:16px;background:rgba(255,255,255,.7);border-radius:14px;overflow:hidden">
           <img src="${shot('boda-clasica-01')}" style="width:150px;height:170px;object-fit:cover;object-position:center 30%">
           <div style="padding:16px 12px 0 0;color:var(--ink)"><div style="font-size:28px;font-weight:600">Mariana &amp; Alejandro</div><div style="font-size:22px;color:var(--muted);margin-top:6px">Nos casamos · 13 de enero de 2027</div></div>
         </div>
         <div style="font-size:26px;color:#2a6db0;padding:12px 6px 0;color:#1f6f8b">…/i/boda-clasica</div>
         <div style="font-size:22px;color:var(--muted);text-align:right">9:41 ✓✓</div>
       </div>
       <div style="width:420px;background:#fff;border-radius:22px 22px 22px 6px;padding:18px 24px;margin-top:22px;color:var(--ink);font-size:28px;font-weight:500">¡Qué bonita! Ya confirmé <span class="emo">🥹</span></div>
     </div>`),
  story(7, '¿Es solo para bodas?', 'No: también XV años, bautizos, cumpleaños, fiestas infantiles y revelaciones de género.',
    `<div style="position:absolute;left:0;right:0;top:930px;height:520px">
      ${fan(60, 150, 210)}
     </div>`),
  story(8, '¿Cómo pido la mía?', 'Escríbenos por WhatsApp, elige tu diseño y cuéntanos tu historia.',
    `<div style="position:absolute;left:90px;right:90px;top:1080px;height:200px;border:3px dashed rgba(223,163,63,.6);border-radius:30px;display:flex;align-items:center;justify-content:center;font-size:30px;color:var(--gold-pale);font-weight:500;text-align:center">Aquí va el sticker de enlace<br>a WhatsApp <span class="emo">👆</span></div>`),
];

// ---------------------------------------------------------------- Video semblanza
const strip = (items) => `<div style="display:flex;gap:30px;justify-content:center">
  ${items.map((item, i) => `<div style="width:156px;padding:10px 10px 28px;background:#fff;border-radius:6px;box-shadow:0 16px 30px -10px rgba(0,0,0,.55);transform:rotate(${[-5, 3, -3, 4][i]}deg)">
    ${item.photo
      ? `<div style="width:100%;aspect-ratio:1;border-radius:3px;background:url(${demoPhoto(item.photo)}) ${item.pos} / ${item.size} no-repeat"></div>`
      : crop(item[0], item[1], item[2], 'width:100%;border-radius:3px')}</div>`).join('')}
</div>`;
const check = (emo, t) => `<div style="display:flex;align-items:center;gap:18px;font-size:27px;font-weight:500"><span class="emo" style="font-size:32px">${emo}</span>${t}</div>`;

const PSEMBLANZA = [
  `<div class="slide dark"><div class="frame"></div>
    <div style="position:absolute;top:92px;left:90px;right:90px;text-align:center">
      <div class="eyebrow">Nuevo · Video semblanza</div>
      <h1 class="serif" style="font-size:80px;line-height:.98;margin-top:20px">Su historia, <span style="color:var(--gold)">en la pantalla grande</span></h1>
    </div>
    <div style="position:absolute;top:330px;left:120px;right:120px;padding:14px;background:#120b12;border-radius:20px;box-shadow:0 40px 80px -20px rgba(0,0,0,.65),0 0 0 2px #3b2a3a">
      <div style="position:relative;border-radius:10px;overflow:hidden">
        ${crop('boda-moderna-01', [0.077, 0.923], [0.6, 0.82], 'width:100%;filter:saturate(1.05) contrast(1.03)')}
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(18,11,18,.75) 100%)"></div>
        <div class="script" style="position:absolute;left:0;right:0;bottom:70px;text-align:center;font-size:72px;color:#fff;text-shadow:0 4px 18px rgba(0,0,0,.6)">Así empezó todo…</div>
        <div style="position:absolute;left:28px;right:28px;bottom:26px;display:flex;align-items:center;gap:18px;color:#fff;font-size:20px;font-weight:600">
          <span style="font-size:22px">▶</span>
          <div style="flex:1;height:6px;border-radius:9px;background:rgba(255,255,255,.3)"><div style="width:38%;height:100%;border-radius:9px;background:var(--gold)"></div></div>
          <span>1:42 / 4:30</span>
        </div>
      </div>
    </div>
    <div class="card" style="position:absolute;right:150px;top:368px;padding:14px 22px;display:flex;align-items:center;gap:12px;font-size:26px;font-weight:600;color:var(--ink);transform:rotate(3deg)"><span class="emo" style="font-size:32px">🎵</span>Su canción</div>
    <div style="position:absolute;top:830px;left:0;right:0">${strip([
      ['boda-clasica-09', [0.2, 0.82], [0.46, 0.746]],
      { photo: 'boda-clasica/images/09.jpeg', size: '150%', pos: '75% 28%' },
      ['boda-serena-08', [0.18, 0.82], [0.6, 0.896]],
      ['boda-floral-09', [0.23, 0.82], [0.28, 0.552]],
    ])}</div>
    <div style="position:absolute;top:1018px;left:110px;display:flex;flex-direction:column;gap:10px">
      ${check('📸', 'Sus fotos con su canción')}${check('✍️', 'Textos y dedicatorias')}${check('🖥️', 'Listo para la pantalla del salón')}${check('⏱️', 'De 3 a 5 min · listo en 3 a 5 días')}
    </div>
    <div style="position:absolute;top:1026px;right:110px;text-align:right">
      <div style="font-size:22px;letter-spacing:.2em;color:var(--gold-pale);font-weight:600">DESDE</div>
      <div class="serif" style="font-size:104px;line-height:1;color:var(--gold)">$600</div>
      <div style="font-size:22px;letter-spacing:.2em;color:var(--gold-pale);font-weight:600">MXN</div>
    </div>
    <div style="position:absolute;bottom:66px;left:100px;right:100px;display:flex;align-items:center;justify-content:space-between;padding-top:20px;border-top:1px solid rgba(223,163,63,.3)">
      <img src="${LOGO_DARK}" style="height:56px">
      <span style="font-size:24px;font-weight:500;color:var(--gold-pale)">Bodas · XV años · Cumpleaños · Bautizos</span>
    </div>
  </div>`,
];

// ---------------------------------------------------------------- Comentario en grupos
// Imagen cuadrada para responder en grupos de Facebook a quien pide recomendaciones.
const PCOMENTARIO = [
  `<div class="slide dark"><div class="frame" style="inset:26px"></div>
    <div style="position:absolute;top:84px;left:84px;width:560px">
      <div class="eyebrow" style="font-size:22px">¿Buscas invitaciones?</div>
      <h1 class="serif" style="font-size:84px;line-height:.96;margin-top:18px">Invitaciones <span style="color:var(--gold)">digitales</span> que enamoran</h1>
      <p style="font-size:26px;line-height:1.4;margin-top:22px;color:var(--gold-pale);font-weight:500">Bodas · XV años · Bautizos · Cumpleaños<br>Fiestas infantiles · Revelación de género</p>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:34px">
        ${check('🎵', 'Con su canción y sus fotos')}${check('📍', 'Mapa al salón con un toque')}${check('✅', 'Confirman asistencia en línea')}${check('📲', 'Se comparte por WhatsApp')}
      </div>
    </div>
    <div style="position:absolute;top:120px;right:30px;width:420px;height:640px">
      ${phone('xv-aurora-01', 'right:200px;top:110px;transform:rotate(-8deg);z-index:1', 210, 'center 8%')}
      ${phone('infantil-espacial-01', 'right:40px;top:140px;transform:rotate(8deg);z-index:1', 210)}
      ${phone('boda-clasica-01', 'right:100px;top:40px;z-index:2', 240, 'center 45%')}
    </div>
    <div style="position:absolute;left:84px;right:84px;bottom:150px;display:flex;align-items:flex-end;justify-content:space-between">
      <div>
        <div style="font-size:20px;letter-spacing:.2em;color:var(--gold-pale);font-weight:600">DESDE</div>
        <div class="serif" style="font-size:112px;line-height:.95;color:var(--gold)">$499 <span style="font-size:36px;font-family:Geist;font-weight:600;letter-spacing:.1em;color:var(--gold-pale)">MXN</span></div>
        <div style="font-size:22px;color:var(--gold-pale);font-weight:500;margin-top:14px">Pago único · lista en 3 a 5 días</div>
      </div>
      <div class="pill" style="background:var(--gold);color:var(--ink);font-size:30px;padding:22px 34px">Escríbenos por chat <span class="emo">💬</span></div>
    </div>
    <div style="position:absolute;bottom:62px;left:84px;right:84px;display:flex;align-items:center;justify-content:space-between;padding-top:18px;border-top:1px solid rgba(223,163,63,.3)">
      <img src="${LOGO_DARK}" style="height:50px">
    </div>
  </div>`,
];

// ---------------------------------------------------------------- render
const SETS = {
  16: { w: 1080, h: 1350, slides: P16, dir: '16-carrusel-digital-vs-papel' },
  19: { w: 1080, h: 1350, slides: P19, dir: '19-carrusel-24-plantillas' },
  20: { w: 1080, h: 1920, slides: P20, dir: '20-historias-preguntas' },
  semblanza: { w: 1080, h: 1350, slides: PSEMBLANZA, dir: 'video-semblanza' },
  comentario: { w: 1080, h: 1080, slides: PCOMENTARIO, dir: 'comentario-grupos' },
};
const wanted = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SETS);
const browser = await chromium.launch({ channel: 'chrome' });
for (const key of wanted) {
  const { w, h, slides, dir } = SETS[key];
  const out = join(HERE, dir);
  mkdirSync(join(HERE, '.html'), { recursive: true });
  mkdirSync(out, { recursive: true });
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const [i, body] of slides.entries()) {
    const file = join(HERE, '.html', `${key}-${i + 1}.html`);
    writeFileSync(file, `<!doctype html><meta charset="utf-8"><style>:root{--w:${w}px;--h:${h}px}${CSS}</style>${body}`);
    await page.goto(pathToFileURL(file).href);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: join(out, `${String(i + 1).padStart(2, '0')}.png`) });
  }
  await page.close();
  console.log(key, slides.length, out);
}
await browser.close();
