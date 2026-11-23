// Arma la pista de efectos de un video a partir de window.SFX ([segundo, tipo]) de su página.
// Los sonidos se sintetizan con ffmpeg, sin archivos de audio externos.
//   PAGE=chat-imposible.html node sfx.mjs salida/sfx.wav
import { chromium } from 'playwright-core';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const PAGE = process.env.PAGE ?? 'chat-imposible.html';
const OUT = process.argv[2] ?? 'salida/sfx.wav';

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto(pathToFileURL(PAGE).href);
await page.evaluate(() => window.ready);
const { cues, duration } = await page.evaluate(() => ({ cues: window.SFX, duration: window.DURATION }));
await browser.close();

// Cada sonido: expresión de aevalsrc y duración en segundos
const SOUNDS = {
  pop: ['0.5*sin(2*PI*(620+380*exp(-40*t))*t)*exp(-28*t)', 0.16],
  pop2: ['0.35*sin(2*PI*(520+260*exp(-40*t))*t)*exp(-24*t)', 0.18],
  send: ['0.45*sin(2*PI*(420*t+900*t*t))*exp(-12*t)*(1-exp(-200*t))', 0.28],
  tap: ['0.4*sin(2*PI*1600*t)*exp(-90*t)', 0.06],
  ding: ['0.25*(sin(2*PI*1318.5*t)+0.6*sin(2*PI*1975.5*t))*exp(-6*t)*(1-exp(-300*t))', 0.8],
  whoosh: ['0.35*(random(0)*2-1)*sin(PI*t/0.45)', 0.45],
};
const dir = mkdtempSync(join(tmpdir(), 'sfx-'));
const ff = (...args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args]);
for (const [name, [expr, d]] of Object.entries(SOUNDS)) {
  const filter = name === 'whoosh' ? ['-af', 'bandpass=f=1200:width_type=o:w=2,volume=4'] : [];
  ff('-f', 'lavfi', '-i', `aevalsrc=${expr}:s=44100:d=${d}`, ...filter, '-ac', '2', join(dir, `${name}.wav`));
}

const inputs = cues.flatMap(([, type]) => ['-i', join(dir, `${type}.wav`)]);
const delays = cues.map(([t], i) => `[${i}:a]adelay=${Math.round(t * 1000)}:all=1[a${i}]`).join(';');
const mix = cues.map((_, i) => `[a${i}]`).join('') +
  `amix=inputs=${cues.length}:normalize=0,apad,atrim=0:${duration},alimiter=limit=0.9[out]`;
ff(...inputs, '-filter_complex', `${delays};${mix}`, '-map', '[out]', OUT);
rmSync(dir, { recursive: true });
console.log(`efectos: ${cues.length} -> ${OUT}`);
