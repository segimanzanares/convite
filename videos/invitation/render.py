#!/usr/bin/env python3
"""Invitación en video (1080x1920, 30 fps) hecha con código a partir de los datos de una invitación.

Todo se dibuja con pycairo (textos animados, ilustraciones de línea, flores, pétalos); la música es la canción de la
invitación o, sin ella, una melodía sintetizada en Python. ffmpeg une los cuadros y el audio en un MP4. La duración
depende de las escenas que tengan datos (unos 40 s para una boda con padres, padrinos, fecha y dos lugares).

Laravel lo ejecuta desde el job RenderInvitationVideo con los datos de InvitationVideoService. A mano, desde la raíz
del proyecto:
    python3 videos/invitation/render.py                          # datos de ejemplo -> output/video.mp4
    python3 videos/invitation/render.py --data datos.json --theme noche --out output/boda.mp4
    python3 videos/invitation/render.py --stills 3,9,16          # sólo cuadros PNG en esos segundos

Requiere ffmpeg, pycairo y Pillow. Lo generado a mano va a output/, ignorado por git.
"""

import argparse
import json
import multiprocessing as mp
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(HERE, 'output')
FONT_DIR = os.path.join(ROOT, 'resources', 'fonts', 'pdf')
SAMPLE = os.path.join(HERE, 'sample.json')
FPS = 30


def configure_fonts():
    """Cormorant Garamond y Great Vibes vienen en el repo; fontconfig las encuentra con esta config. Se lee al dibujar
    el primer texto, así que basta con definirla antes."""
    cache = os.environ.get('CONVITE_VIDEO_CACHE') or OUT
    os.makedirs(cache, exist_ok=True)
    conf = os.path.join(cache, 'fonts.conf')
    with open(conf, 'w') as fh:
        fh.write('<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig>'
                 '<include ignore_missing="yes">/etc/fonts/fonts.conf</include>'
                 f'<dir>{FONT_DIR}</dir><cachedir>{cache}/fontconfig</cachedir></fontconfig>')
    os.environ['FONTCONFIG_FILE'] = conf


configure_fonts()

import cairo  # noqa: E402

import drawing  # noqa: E402
import music  # noqa: E402
from scenes import Event, timeline  # noqa: E402

FADE = 0.5
_state = {}


def load_data(path):
    with open(path) as fh:
        data = json.load(fh)
    base = os.path.dirname(os.path.abspath(path))

    def resolve(p):
        p = os.path.expanduser(p)
        return p if os.path.isabs(p) else os.path.join(base, p)

    data['photos'] = [resolve(p) for p in data.get('photos') or [] if os.path.isfile(resolve(p))]
    data['music'] = resolve(data['music']) if data.get('music') and os.path.isfile(resolve(data['music'])) else None
    return data


def setup(data_path, theme):
    """Prepara el estado de un proceso: tema, datos, escenas y las capas fijas."""
    data = load_data(data_path)
    drawing.apply_theme(theme, data.get('primary'))
    ev = Event(data)
    scenes, duration = timeline(ev)
    deco = cairo.ImageSurface(cairo.FORMAT_ARGB32, drawing.W, drawing.H)
    drawing.decorations(cairo.Context(deco), 10.0)
    _state.update(data=data, event=ev, scenes=scenes, duration=duration, bg=drawing.make_background(), deco=deco)
    return _state


def render(t):
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, drawing.W, drawing.H)
    ctx = cairo.Context(surf)
    ctx.set_source_surface(_state['bg'])
    ctx.paint()
    drawing.draw_dust(ctx, t)
    if t >= drawing.DECORATIONS_DONE:
        ctx.set_source_surface(_state['deco'])
        ctx.paint()
    else:
        drawing.decorations(ctx, t)
    scenes = _state['scenes']
    for i, (a, b, fn) in enumerate(scenes):
        last = i == len(scenes) - 1
        if not (a <= t < b or (last and t >= a)):
            continue
        fin = 1.0 if i == 0 else drawing.ease_in_out(drawing.prog(t, a, a + FADE))
        fout = 1.0 if last else drawing.ease_in_out(1 - drawing.prog(t, b - FADE, b))
        if fin * fout <= 0:
            continue
        ctx.save()
        ctx.push_group()
        ctx.translate(0, (1 - fout) * -30)
        fn(ctx, t - a, _state['event'])
        ctx.pop_group_to_source()
        ctx.paint_with_alpha(fin * fout)
        ctx.restore()
    drawing.draw_petals(ctx, t)
    surf.flush()
    return surf


def render_bytes(frame):
    return bytes(render(frame / FPS).get_data())


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--data', default=SAMPLE, help='JSON con los datos de la invitación')
    ap.add_argument('--theme', default='clasico', choices=drawing.theme_names())
    ap.add_argument('--out', default=os.path.join(OUT, 'video.mp4'))
    ap.add_argument('--stills', help='segundos separados por coma; guarda PNG junto a --out en lugar del video')
    ap.add_argument('--workers', type=int, default=max(1, (os.cpu_count() or 2) - 1))
    args = ap.parse_args()

    state = setup(args.data, args.theme)
    out_dir = os.path.dirname(os.path.abspath(args.out))
    os.makedirs(out_dir, exist_ok=True)

    if args.stills:
        stills = os.path.join(out_dir, 'stills')
        os.makedirs(stills, exist_ok=True)
        for s in args.stills.split(','):
            t = float(s)
            render(t).write_to_png(os.path.join(stills, f'{t:05.1f}.png'))
        print(f'Duración: {state["duration"]} s')
        return

    duration = state['duration']
    frames = int(duration * FPS)
    song = state['data']['music']
    if song:
        audio = ['-i', song]
        fade = f'afade=t=in:d=0.4,afade=t=out:st={duration - 2.5:.2f}:d=2.5'
    else:
        wav = os.path.splitext(os.path.abspath(args.out))[0] + '.wav'
        music.synth(wav, duration)
        audio = ['-i', wav]
        fade = 'anull'
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgra',
           '-s', f'{drawing.W}x{drawing.H}', '-r', str(FPS), '-i', '-', *audio,
           '-map', '0:v', '-map', '1:a', '-af', fade, '-t', f'{duration:.2f}',
           '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p',
           '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', args.out]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with mp.Pool(args.workers, initializer=setup, initargs=(args.data, args.theme)) as pool:
        for i, data in enumerate(pool.imap(render_bytes, range(frames), chunksize=4)):
            proc.stdin.write(data)
            if i % 90 == 0:
                print(f'cuadro {i}/{frames}', flush=True)
    proc.stdin.close()
    code = proc.wait()
    if not song:
        os.remove(wav)
    sys.exit(code)


if __name__ == '__main__':
    main()
