#!/usr/bin/env python3
"""Demo de invitación de boda en vídeo (1080x1920, 30 fps, ~43 s).

Todo se dibuja con código: pycairo para los cuadros (textos animados, ilustraciones
de línea, flores, pétalos) y un sintetizador sencillo en Python puro para la música.
ffmpeg une los cuadros y el audio en un MP4.

Uso (desde la raíz del proyecto):
    python3 videos/invitation/render.py                       # vídeo completo -> output/boda-demo.mp4
    python3 videos/invitation/render.py --stills 3,9,16       # sólo cuadros PNG en esos segundos
    python3 videos/invitation/render.py --photo ruta/foto.jpg # otra foto de los novios

Todo lo generado (vídeo, audio, cuadros, caché de fuentes) va a output/, ignorado por git.
"""

import argparse
import array
import math
import multiprocessing as mp
import os
import random
import subprocess
import sys
import wave

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
OUT = os.path.join(HERE, 'output')
FONT_DIR = os.path.join(ROOT, 'resources', 'fonts', 'pdf')
DEFAULT_PHOTO = os.path.expanduser('~/Imágenes/novios.jpg')
os.makedirs(OUT, exist_ok=True)

# Cormorant Garamond y Great Vibes vienen en el repo; fontconfig los encuentra con esta config.
_conf = os.path.join(OUT, 'fonts.conf')
with open(_conf, 'w') as fh:
    fh.write(
        '<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig>'
        '<include ignore_missing="yes">/etc/fonts/fonts.conf</include>'
        f'<dir>{FONT_DIR}</dir><cachedir>{OUT}/.fccache</cachedir></fontconfig>'
    )
os.environ['FONTCONFIG_FILE'] = _conf

import cairo  # noqa: E402
from PIL import Image  # noqa: E402

W, H = 1080, 1920
FPS = 30
DURATION = 43.0

# ---------------------------------------------------------------- contenido
CONTENT = {
    'bride': 'Mariana',
    'groom': 'Alejandro',
    'parents': [
        ('PADRES DE LA NOVIA', ['Guadalupe Ríos de López', 'Fernando López Medina']),
        ('PADRES DEL NOVIO', ['Rosa María Hernández', 'Jorge Pérez Castillo']),
    ],
    'godparents': [
        ('PADRINOS DE VELACIÓN', 'Claudia y Arturo Mendoza'),
        ('PADRINOS DE ANILLOS', 'Sofía y Daniel Ortega'),
        ('PADRINOS DE LAZO', 'Patricia y Luis Navarro'),
    ],
    'weekday': 'SÁBADO', 'day': 12, 'month': 'JUNIO', 'year': '2027',
    'time': 'A las 15:00 horas',
    'venues': [
        ('CEREMONIA RELIGIOSA', 'Parroquia de San Rafael Arcángel',
         ['Calle de los Laureles 214', 'Barrio de San Rafael, Villa del Mar'], '15:00 HRS', 'church'),
        ('RECEPCIÓN & BANQUETE', 'Hacienda Los Almendros',
         ['Camino Real a La Ensenada km 3', 'Col. Las Palmas, Villa del Mar'], '16:00 HRS', 'glasses'),
    ],
}

# ---------------------------------------------------------------- paleta
def hexc(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


IVORY = hexc('fdfaf4')
PAPER_EDGE = hexc('f1e8d6')
GOLD = hexc('c9a84c')
GOLD_DEEP = hexc('a07830')
GOLD_LIGHT = hexc('e8d08a')
INK = hexc('2c1f0a')
INK_SOFT = hexc('5e4a2e')
SAGE = hexc('8b9e7a')
SAGE_DARK = hexc('617052')
SAGE_LIGHT = hexc('b5c2a6')
BLUSH = hexc('d8aaa4')
BLUSH_LIGHT = hexc('f1d9d3')
BLUSH_DEEP = hexc('b07a74')
WHITE = (1, 1, 1)

FONTS = {
    'serif': ('Cormorant Garamond', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL),
    'italic': ('Cormorant Garamond', cairo.FONT_SLANT_ITALIC, cairo.FONT_WEIGHT_NORMAL),
    'semibold': ('Cormorant Garamond', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD),
    'script': ('Great Vibes', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL),
}


# ---------------------------------------------------------------- easing
def clamp(x, a=0.0, b=1.0):
    return a if x < a else b if x > b else x


def prog(t, a, b):
    return clamp((t - a) / (b - a))


def ease_out(x):
    return 1 - (1 - x) ** 3


def ease_in_out(x):
    return 4 * x ** 3 if x < 0.5 else 1 - (-2 * x + 2) ** 3 / 2


def ease_back(x):
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2


# ---------------------------------------------------------------- texto
def set_font(ctx, font, size):
    fam, slant, weight = FONTS[font]
    ctx.select_font_face(fam, slant, weight)
    ctx.set_font_size(size)


def gold_pattern(x0, y0, x1, y1, shine=0.5):
    g = cairo.LinearGradient(x0, y0, x1, y1)
    g.add_color_stop_rgb(0, *GOLD_DEEP)
    g.add_color_stop_rgb(clamp(shine - 0.22), *GOLD)
    g.add_color_stop_rgb(clamp(shine), *GOLD_LIGHT)
    g.add_color_stop_rgb(clamp(shine + 0.22), *GOLD)
    g.add_color_stop_rgb(1, *GOLD_DEEP)
    return g


def draw_text(ctx, s, x, y, size, font='serif', color=INK, p=1.0, mode='fade', align='center',
              tracking=0.0, rise=28, max_width=None, alpha=1.0, gold=False, shine=0.5):
    """Texto animado. mode: fade (aparece y sube), letters (letra por letra), wipe (se escribe)."""
    if p <= 0:
        return
    set_font(ctx, font, size)
    adv = [ctx.text_extents(ch).x_advance for ch in s]
    width = sum(adv) + tracking * (len(s) - 1)
    if max_width and width > max_width:
        k = max_width / width
        size *= k
        tracking *= k
        set_font(ctx, font, size)
        adv = [ctx.text_extents(ch).x_advance for ch in s]
        width = sum(adv) + tracking * (len(s) - 1)
    x0 = x - width / 2 if align == 'center' else x if align == 'left' else x - width

    if mode == 'letters':
        n = len(s)
        cx = x0
        for i, ch in enumerate(s):
            start = 0.6 * i / max(1, n - 1)
            cp = ease_out(prog(p, start, start + 0.4))
            if cp > 0 and ch != ' ':
                ctx.move_to(cx, y + (1 - cp) * rise)
                ctx.set_source_rgba(*color, alpha * cp)
                ctx.show_text(ch)
            cx += adv[i] + tracking
        return

    e = ease_out(p) if mode == 'fade' else 1.0
    dy = (1 - e) * rise if mode == 'fade' else (1 - ease_out(p)) * rise * 0.4
    ctx.push_group()
    cx = x0
    for i, ch in enumerate(s):
        ctx.move_to(cx, y + dy)
        ctx.text_path(ch)
        cx += adv[i] + tracking
    if gold:
        ctx.set_source(gold_pattern(x0, y - size * 0.8, x0 + width, y + size * 0.2, shine))
    else:
        ctx.set_source_rgb(*color)
    ctx.fill()
    ctx.pop_group_to_source()
    if mode == 'wipe':
        feather = 120
        edge = x0 - feather + (width + 2 * feather) * ease_in_out(p)
        m = cairo.LinearGradient(edge - feather, 0, edge, 0)
        m.add_color_stop_rgba(0, 0, 0, 0, alpha)
        m.add_color_stop_rgba(1, 0, 0, 0, 0)
        ctx.mask(m)
    else:
        ctx.paint_with_alpha(alpha * e)


# ---------------------------------------------------------------- trazos
def dist(a, b):
    return math.hypot(b[0] - a[0], b[1] - a[1])


def bezier(p0, p1, p2, p3, n=32):
    pts = []
    for i in range(n + 1):
        u = i / n
        m = 1 - u
        pts.append((m ** 3 * p0[0] + 3 * m * m * u * p1[0] + 3 * m * u * u * p2[0] + u ** 3 * p3[0],
                    m ** 3 * p0[1] + 3 * m * m * u * p1[1] + 3 * m * u * u * p2[1] + u ** 3 * p3[1]))
    return pts


def arc_pts(cx, cy, r, a0, a1, n=48):
    return [(cx + r * math.cos(a0 + (a1 - a0) * i / n), cy + r * math.sin(a0 + (a1 - a0) * i / n))
            for i in range(n + 1)]


def stroke_partial(ctx, polylines, p, width, color, alpha=1.0):
    """Dibuja las polilíneas en orden hasta la fracción p de su largo total (efecto de trazo a mano)."""
    p = clamp(p)
    if p <= 0:
        return
    lengths = [sum(dist(a, b) for a, b in zip(pl, pl[1:])) for pl in polylines]
    budget = sum(lengths) * p
    ctx.set_line_width(width)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    ctx.set_source_rgba(*color, alpha)
    for pl in polylines:
        if budget <= 0:
            break
        ctx.move_to(*pl[0])
        for a, b in zip(pl, pl[1:]):
            d = dist(a, b)
            if d <= budget:
                ctx.line_to(*b)
                budget -= d
            else:
                f = budget / d
                ctx.line_to(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f)
                budget = 0
                break
        ctx.stroke()


def rounded_rect(ctx, x, y, w, h, r):
    ctx.new_sub_path()
    ctx.arc(x + w - r, y + r, r, -math.pi / 2, 0)
    ctx.arc(x + w - r, y + h - r, r, 0, math.pi / 2)
    ctx.arc(x + r, y + h - r, r, math.pi / 2, math.pi)
    ctx.arc(x + r, y + r, r, math.pi, 3 * math.pi / 2)
    ctx.close_path()


# ---------------------------------------------------------------- ilustraciones
def flourish(ctx, cx, cy, half, p, color=GOLD, width=2.2):
    """Línea dorada que crece desde el centro y remata en espirales."""
    if p <= 0:
        return
    for side in (1, -1):
        ex = cx + side * half * 0.82
        pts = [(cx + side * 16, cy), (ex, cy)]
        turns = 1.35
        r0 = half * 0.08
        steps = 40
        for i in range(1, steps + 1):
            u = i / steps
            th = math.pi / 2 - u * turns * 2 * math.pi
            r = r0 * (1 - 0.7 * u)
            pts.append((ex + side * r * math.cos(th), cy - r0 + r * math.sin(th)))
        stroke_partial(ctx, [pts], ease_in_out(p), width, color)
    s = 9 * ease_back(prog(p, 0.0, 0.4))
    if s > 0:
        ctx.move_to(cx, cy - s)
        ctx.line_to(cx + s * 0.7, cy)
        ctx.line_to(cx, cy + s)
        ctx.line_to(cx - s * 0.7, cy)
        ctx.close_path()
        ctx.set_source_rgb(*color)
        ctx.fill()


def leaf(ctx, x, y, ang, size, color, alpha=0.92):
    if size <= 0.5:
        return
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(ang)
    ctx.scale(size, size)
    ctx.move_to(0, 0)
    ctx.curve_to(0.3, -0.38, 0.72, -0.3, 1, 0)
    ctx.curve_to(0.72, 0.3, 0.3, 0.38, 0, 0)
    ctx.set_source_rgba(*color, alpha)
    ctx.fill()
    ctx.move_to(0.06, 0)
    ctx.line_to(0.82, 0)
    ctx.set_line_width(0.045)
    ctx.set_source_rgba(1, 1, 1, 0.35 * alpha)
    ctx.stroke()
    ctx.restore()


def flower(ctx, x, y, r, p, rot=0.0, petal=BLUSH, inner=BLUSH_LIGHT, alpha=1.0):
    p = clamp(p)
    if p <= 0:
        return
    s = ease_back(p)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot - (1 - p) * 1.2)
    ctx.scale(s, s)
    for layer, (col, rr, off) in enumerate(((petal, r, 0.0), (inner, r * 0.62, math.pi / 5))):
        for i in range(5):
            ctx.save()
            ctx.rotate(off + i * 2 * math.pi / 5)
            ctx.move_to(0, 0)
            ctx.curve_to(-rr * 0.55, -rr * 0.3, -rr * 0.5, -rr * 1.0, 0, -rr)
            ctx.curve_to(rr * 0.5, -rr * 1.0, rr * 0.55, -rr * 0.3, 0, 0)
            ctx.set_source_rgba(*col, 0.96 * alpha)
            ctx.fill_preserve()
            ctx.set_source_rgba(*BLUSH_DEEP, 0.35 * alpha)
            ctx.set_line_width(max(0.8, r * 0.04))
            ctx.stroke()
            ctx.restore()
    ctx.arc(0, 0, r * 0.17, 0, 2 * math.pi)
    ctx.set_source_rgba(*GOLD, alpha)
    ctx.fill()
    for i in range(6):
        a = i * math.pi / 3 + 0.3
        ctx.arc(math.cos(a) * r * 0.3, math.sin(a) * r * 0.3, r * 0.05, 0, 2 * math.pi)
        ctx.set_source_rgba(*GOLD_DEEP, alpha)
        ctx.fill()
    ctx.restore()


def sprig(ctx, x, y, ang, length, p, bend=0.16, leaves=7, leaf_size=36, side=1, blossom=0.0,
          leaf_color=SAGE, alpha=1.0):
    """Rama que crece: tallo trazado y hojas que brotan a su paso."""
    p = clamp(p)
    if p <= 0:
        return
    ca, sa = math.cos(ang), math.sin(ang)
    b = bend * length * side
    local = bezier((0, 0), (length * 0.33, -b), (length * 0.66, -b * 0.9), (length, -b * 0.3), 40)
    pts = [(x + px * ca - py * sa, y + px * sa + py * ca) for px, py in local]
    ps = ease_in_out(clamp(p / 0.8))
    stroke_partial(ctx, [pts], ps, 3.0, SAGE_DARK, 0.9 * alpha)
    for k in range(leaves):
        f = 0.14 + 0.8 * k / leaves
        lp = clamp((ps - f) / 0.2)
        if lp <= 0:
            continue
        i = int(f * 40)
        a, c = pts[i], pts[i + 1]
        tang = math.atan2(c[1] - a[1], c[0] - a[0])
        sgn = 1 if k % 2 == 0 else -1
        col = leaf_color if k % 3 else SAGE_LIGHT
        leaf(ctx, a[0], a[1], tang + sgn * 0.8, leaf_size * (1 - 0.45 * f) * ease_back(lp), col, 0.92 * alpha)
    if ps > 0.9:
        a, c = pts[-2], pts[-1]
        leaf(ctx, c[0], c[1], math.atan2(c[1] - a[1], c[0] - a[0]),
             leaf_size * 0.55 * ease_back(prog(ps, 0.9, 1.0)), leaf_color, 0.92 * alpha)
    if blossom:
        flower(ctx, pts[-1][0], pts[-1][1], blossom, prog(p, 0.75, 1.0), rot=ang, alpha=alpha)


def star(ctx, x, y, s, alpha, color=GOLD_LIGHT):
    if alpha <= 0.01 or s <= 0:
        return
    ctx.move_to(x, y - s)
    for (dx, dy) in ((0.16, -0.16), (1, 0), (0.16, 0.16), (0, 1), (-0.16, 0.16), (-1, 0), (-0.16, -0.16), (0, -1)):
        ctx.line_to(x + dx * s, y + dy * s)
    ctx.set_source_rgba(*color, alpha)
    ctx.fill()


def twinkle(ctx, x, y, s, t, phase, start=0.0):
    if t < start:
        return
    a = max(0.0, math.sin((t - start) * 2.4 + phase)) ** 3
    star(ctx, x, y, s * (0.6 + 0.4 * a), a * clamp((t - start) / 0.6))


def heart_pts(cx, cy, s, n=80):
    pts = []
    for i in range(n + 1):
        th = math.pi * 2 * i / n
        x = 16 * math.sin(th) ** 3
        y = -(13 * math.cos(th) - 5 * math.cos(2 * th) - 2 * math.cos(3 * th) - math.cos(4 * th))
        pts.append((cx + x * s / 16, cy + y * s / 16))
    return pts


def fill_pts(ctx, pts, color, alpha):
    ctx.move_to(*pts[0])
    for q in pts[1:]:
        ctx.line_to(*q)
    ctx.close_path()
    ctx.set_source_rgba(*color, alpha)
    ctx.fill()


def church(cx, cy, s):
    T = lambda pts: [(cx + x * s, cy + y * s) for x, y in pts]  # noqa: E731
    out = [T([(-0.62, 0), (0.62, 0)]),
           T([(-0.45, 0), (-0.45, -0.36), (-0.16, -0.5), (-0.16, -0.72), (0, -0.95),
              (0.16, -0.72), (0.16, -0.5), (0.45, -0.36), (0.45, 0)]),
           T([(0, -0.95), (0, -1.1)]), T([(-0.055, -1.04), (0.055, -1.04)])]
    door = [(-0.085, 0), (-0.085, -0.16)] + [(0.085 * math.cos(a), -0.16 + 0.085 * math.sin(a))
                                              for a in [math.pi + i * math.pi / 16 for i in range(17)]] + [(0.085, 0)]
    out.append(T(door))
    out.append(T([(0.05 * math.cos(a), -0.61 + 0.05 * math.sin(a)) for a in [i * math.pi / 12 for i in range(25)]]))
    for wx in (-0.3, 0.3):
        win = [(wx - 0.04, -0.08), (wx - 0.04, -0.2)] + \
              [(wx + 0.04 * math.cos(a), -0.2 + 0.04 * math.sin(a)) for a in [math.pi + i * math.pi / 10 for i in range(11)]] + \
              [(wx + 0.04, -0.08), (wx - 0.04, -0.08)]
        out.append(T(win))
    return out


def glasses(cx, cy, s):
    flute = [[(-0.12, 0), (0.12, 0)], [(0, 0), (0, -0.36)],
             [(0, -0.36)] + [(x, y) for x, y in bezier((0, -0.36), (-0.11, -0.4), (-0.12, -0.6), (-0.115, -0.86), 12)] +
             [(0.115, -0.86)] + [(x, y) for x, y in bezier((0.115, -0.86), (0.12, -0.6), (0.11, -0.4), (0, -0.36), 12)],
             [(-0.105, -0.7), (0.105, -0.7)]]
    out = []
    for side, rot in ((-1, 0.18), (1, -0.18)):
        bx = cx + side * 0.26 * s
        c, sn = math.cos(rot), math.sin(rot)
        for pl in flute:
            out.append([(bx + (x * c - y * sn) * s, cy + (x * sn + y * c) * s) for x, y in pl])
    return out


def pin(ctx, x, y, s, color=GOLD_DEEP, alpha=1.0):
    ctx.save()
    ctx.translate(x, y)
    ctx.move_to(0, 0)
    ctx.curve_to(-s * 0.15, -s * 0.35, -s * 0.5, -s * 0.55, -s * 0.5, -s * 0.9)
    ctx.arc(0, -s * 0.9, s * 0.5, math.pi, 2 * math.pi)
    ctx.curve_to(s * 0.5, -s * 0.55, s * 0.15, -s * 0.35, 0, 0)
    ctx.set_source_rgba(*color, alpha)
    ctx.fill()
    ctx.arc(0, -s * 0.9, s * 0.2, 0, 2 * math.pi)
    ctx.set_source_rgba(*IVORY, alpha)
    ctx.fill()
    ctx.restore()


def clock(ctx, x, y, r, p, t):
    stroke_partial(ctx, [arc_pts(x, y, r, -math.pi / 2, 3 * math.pi / 2, 40)], ease_in_out(p), 2.4, GOLD_DEEP)
    if p > 0.6:
        a = clamp((p - 0.6) / 0.4)
        m = -math.pi / 2 + a * 2 * math.pi
        ctx.set_source_rgba(*GOLD_DEEP, a)
        ctx.set_line_width(2.2)
        ctx.move_to(x, y)
        ctx.line_to(x + math.cos(m) * r * 0.7, y + math.sin(m) * r * 0.7)
        ctx.move_to(x, y)
        ctx.line_to(x + math.cos(m / 12 - 0.9) * r * 0.45, y + math.sin(m / 12 - 0.9) * r * 0.45)
        ctx.stroke()


def rings(ctx, cx, cy, r, p, t):
    if p <= 0:
        return
    for j, ox in enumerate((-0.45 * r, 0.45 * r)):
        a0 = -math.pi / 2 + j * math.pi
        pts = arc_pts(cx + ox, cy, r, a0, a0 + 2 * math.pi, 90)
        q = clamp(p * 1.4 - j * 0.4)
        stroke_partial(ctx, [pts], ease_in_out(q), 6, GOLD)
        stroke_partial(ctx, [pts], ease_in_out(q), 1.6, GOLD_LIGHT)
    d = ease_back(prog(p, 0.75, 1.0))
    if d > 0:
        x, y = cx - 0.45 * r, cy - r - 4
        ctx.move_to(x, y - 18 * d)
        ctx.line_to(x + 13 * d, y - 6 * d)
        ctx.line_to(x, y + 6 * d)
        ctx.line_to(x - 13 * d, y - 6 * d)
        ctx.close_path()
        ctx.set_source_rgb(*GOLD_LIGHT)
        ctx.fill_preserve()
        ctx.set_source_rgb(*GOLD_DEEP)
        ctx.set_line_width(1.5)
        ctx.stroke()
        twinkle(ctx, x + 18, y - 22, 16, t, 0.0)


def arch_path(ctx, x, y, w, h):
    r = w / 2
    ctx.move_to(x, y + h)
    ctx.line_to(x, y + r)
    ctx.arc(x + r, y + r, r, math.pi, 2 * math.pi)
    ctx.line_to(x + w, y + h)
    ctx.close_path()


def arch_pts(x, y, w, h):
    r = w / 2
    return [(x + w / 2, y + h), (x, y + h), (x, y + r)] + arc_pts(x + r, y + r, r, math.pi, 2 * math.pi, 60) + \
           [(x + w, y + h), (x + w / 2, y + h)]


def card(ctx, x, y, w, h, alpha):
    for i in range(8):
        rounded_rect(ctx, x - i * 2, y + 10 - i * 1.5, w + i * 4, h + i * 3, 30 + i * 2)
        ctx.set_source_rgba(0.35, 0.25, 0.1, 0.012 * alpha)
        ctx.fill()
    rounded_rect(ctx, x, y, w, h, 28)
    ctx.set_source_rgba(1, 1, 1, 0.9 * alpha)
    ctx.fill_preserve()
    ctx.set_source_rgba(*GOLD, 0.55 * alpha)
    ctx.set_line_width(1.6)
    ctx.stroke()
    rounded_rect(ctx, x + 12, y + 12, w - 24, h - 24, 20)
    ctx.set_source_rgba(*GOLD, 0.25 * alpha)
    ctx.set_line_width(1)
    ctx.stroke()


# ---------------------------------------------------------------- foto
class Photo:
    def __init__(self, path):
        im = Image.open(path).convert('RGB')
        im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
        self.w, self.h = im.size
        self._buf = bytearray(im.convert('RGBA').tobytes('raw', 'BGRA'))
        self.surface = cairo.ImageSurface.create_for_data(self._buf, cairo.FORMAT_ARGB32, self.w, self.h)

    def paint_cover(self, ctx, x, y, w, h, zoom=1.0, fx=0.5, fy=0.4):
        s = max(w / self.w, h / self.h) * zoom
        ctx.save()
        ctx.translate(x + (w - self.w * s) * fx, y + (h - self.h * s) * fy)
        ctx.scale(s, s)
        ctx.set_source_surface(self.surface, 0, 0)
        ctx.get_source().set_filter(cairo.FILTER_GOOD)
        ctx.paint()
        ctx.restore()

    def paint_focus(self, ctx, cx, cy, width, fx, fy):
        s = width / self.w
        ctx.save()
        ctx.translate(cx - fx * self.w * s, cy - fy * self.h * s)
        ctx.scale(s, s)
        ctx.set_source_surface(self.surface, 0, 0)
        ctx.get_source().set_filter(cairo.FILTER_GOOD)
        ctx.paint()
        ctx.restore()


# ---------------------------------------------------------------- capas fijas
def make_background():
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surf)
    g = cairo.RadialGradient(W / 2, H * 0.45, 150, W / 2, H * 0.5, 1250)
    g.add_color_stop_rgb(0, *IVORY)
    g.add_color_stop_rgb(1, *PAPER_EDGE)
    ctx.set_source(g)
    ctx.paint()
    rng = random.Random(3)
    for _ in range(2600):  # grano de papel muy sutil
        ctx.arc(rng.uniform(0, W), rng.uniform(0, H), rng.uniform(0.6, 1.6), 0, 2 * math.pi)
        ctx.set_source_rgba(*GOLD_DEEP, rng.uniform(0.02, 0.06))
        ctx.fill()
    return surf


def frame_border(ctx, p):
    for inset, width, alpha in ((40, 2.4, 0.9), (54, 1.0, 0.55)):
        x0, y0, x1, y1 = inset, inset, W - inset, H - inset
        right = [(W / 2, y0), (x1, y0), (x1, y1), (W / 2, y1)]
        left = [(W / 2, y0), (x0, y0), (x0, y1), (W / 2, y1)]
        stroke_partial(ctx, [right], ease_in_out(p), width, GOLD, alpha)
        stroke_partial(ctx, [left], ease_in_out(p), width, GOLD, alpha)


def corner_set(ctx, p):
    """Ramo de esquina en coordenadas de la esquina superior izquierda."""
    sprig(ctx, 74, 92, 0.12, 280, prog(p, 0.0, 0.85), side=-1, leaves=7, leaf_size=34)
    sprig(ctx, 92, 74, math.pi / 2 - 0.12, 280, prog(p, 0.1, 0.95), side=1, leaves=7, leaf_size=34)
    sprig(ctx, 86, 86, math.pi / 4, 170, prog(p, 0.2, 1.0), side=1, leaves=5, leaf_size=28, blossom=0)
    flower(ctx, 236, 214, 22, prog(p, 0.55, 0.9), rot=0.4, petal=BLUSH_LIGHT, inner=WHITE)
    flower(ctx, 92, 92, 40, prog(p, 0.35, 0.8), rot=0.2)
    flower(ctx, 168, 120, 20, prog(p, 0.5, 0.95), rot=1.0, petal=BLUSH_LIGHT, inner=WHITE)
    flower(ctx, 120, 170, 16, prog(p, 0.6, 1.0), rot=2.0)


CORNERS = ((1, 1, 0, 0), (-1, 1, W, 0), (1, -1, 0, H), (-1, -1, W, H))


def decorations(ctx, t):
    frame_border(ctx, prog(t, 0.0, 1.8))
    for sx, sy, tx, ty in CORNERS:
        ctx.save()
        ctx.translate(tx, ty)
        ctx.scale(sx, sy)
        corner_set(ctx, prog(t, 0.6, 3.2))
        ctx.restore()


rng = random.Random(11)
PETALS = [dict(x=rng.uniform(0, W), y=rng.uniform(-H, H), vy=rng.uniform(55, 110), sway=rng.uniform(20, 60),
               ph=rng.uniform(0, 6.28), spin=rng.uniform(-1.2, 1.2), size=rng.uniform(16, 30),
               col=rng.choice((BLUSH, BLUSH_LIGHT, BLUSH_LIGHT, GOLD_LIGHT)), flip=rng.uniform(1.0, 2.6))
          for _ in range(16)]
DUST = [dict(x=rng.uniform(60, W - 60), y=rng.uniform(60, H - 60), r=rng.uniform(1.5, 3.8),
             ph=rng.uniform(0, 6.28), sp=rng.uniform(0.8, 2.0), vy=rng.uniform(6, 18)) for _ in range(46)]


def draw_dust(ctx, t):
    for d in DUST:
        a = (0.5 + 0.5 * math.sin(t * d['sp'] + d['ph'])) * 0.55 * clamp(t / 1.5)
        y = (d['y'] - d['vy'] * t) % H
        ctx.arc(d['x'], y, d['r'], 0, 2 * math.pi)
        ctx.set_source_rgba(*GOLD_LIGHT, a)
        ctx.fill()


def draw_petals(ctx, t):
    fade = clamp((t - 1.5) / 2.0)
    if fade <= 0:
        return
    for pt in PETALS:
        y = (pt['y'] + pt['vy'] * t) % (H + 200) - 100
        x = pt['x'] + math.sin(t * 0.9 + pt['ph']) * pt['sway']
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(pt['ph'] + t * pt['spin'])
        ctx.scale(1, 0.25 + abs(math.cos(t * pt['flip'] + pt['ph'])) * 0.75)
        s = pt['size']
        ctx.move_to(-s / 2, 0)
        ctx.curve_to(-s * 0.3, -s * 0.45, s * 0.3, -s * 0.5, s / 2, 0)
        ctx.curve_to(s * 0.25, s * 0.35, -s * 0.25, s * 0.35, -s / 2, 0)
        ctx.set_source_rgba(*pt['col'], 0.75 * fade)
        ctx.fill()
        ctx.restore()


# ---------------------------------------------------------------- escenas
def scene_intro(ctx, lt, photo):
    draw_text(ctx, 'NUESTRA BODA', 540, 620, 36, 'semibold', GOLD_DEEP, prog(lt, 0.7, 1.9), 'letters', tracking=12)
    flourish(ctx, 540, 672, 150, prog(lt, 1.3, 2.3))
    draw_text(ctx, CONTENT['bride'], 540, 900, 190, 'script', p=prog(lt, 1.6, 3.0), mode='wipe', gold=True,
              shine=0.2 + 0.6 * prog(lt, 2.5, 6.0))
    draw_text(ctx, '&', 540, 1035, 96, 'italic', GOLD, prog(lt, 2.6, 3.4), rise=0)
    draw_text(ctx, CONTENT['groom'], 540, 1215, 190, 'script', p=prog(lt, 3.0, 4.4), mode='wipe', gold=True,
              shine=0.2 + 0.6 * prog(lt, 3.5, 6.5))
    flourish(ctx, 540, 1320, 230, prog(lt, 3.9, 5.0))
    draw_text(ctx, 'Te invitamos a celebrar', 540, 1430, 54, 'italic', INK_SOFT, prog(lt, 4.3, 5.1))
    draw_text(ctx, 'el día más feliz de nuestras vidas', 540, 1500, 54, 'italic', INK_SOFT, prog(lt, 4.5, 5.3))
    for i, (x, y) in enumerate(((270, 760), (830, 820), (230, 1110), (860, 1150), (760, 700))):
        twinkle(ctx, x, y, 18, lt, i * 1.3, start=2.0)


def scene_photo(ctx, lt, photo):
    x, y, w, h = 170, 230, 740, 1080
    reveal = ease_in_out(prog(lt, 0.1, 1.6))
    if reveal > 0:
        ctx.save()
        arch_path(ctx, x, y, w, h)
        ctx.clip()
        ctx.arc(x + w / 2, y + h * 0.42, 40 + reveal * 900, 0, 2 * math.pi)
        ctx.clip()
        photo.paint_cover(ctx, x, y, w, h, zoom=1.16 - 0.12 * ease_out(prog(lt, 0, 7.5)), fx=0.5, fy=0.3)
        g = cairo.LinearGradient(0, y + h * 0.7, 0, y + h)  # leve viñeta inferior
        g.add_color_stop_rgba(0, 0, 0, 0, 0)
        g.add_color_stop_rgba(1, 0.17, 0.12, 0.04, 0.25)
        ctx.set_source(g)
        ctx.paint()
        ctx.restore()
    stroke_partial(ctx, [arch_pts(x - 16, y - 16, w + 32, h + 32)], ease_in_out(prog(lt, 0.4, 2.2)), 3, GOLD)
    stroke_partial(ctx, [arch_pts(x - 30, y - 30, w + 60, h + 60)], ease_in_out(prog(lt, 0.8, 2.6)), 1.2, GOLD, 0.7)
    by = y + h + 10
    for sx in (1, -1):
        bx = 540 - sx * (w / 2 + 10)
        ctx.save()
        ctx.translate(bx, by)
        ctx.scale(sx, 1)
        sprig(ctx, 0, 0, -math.pi / 2 - 0.25, 230, prog(lt, 1.2, 2.8), side=1, leaves=6, leaf_size=32)
        sprig(ctx, 0, 0, -0.15, 200, prog(lt, 1.4, 3.0), side=1, leaves=5, leaf_size=30)
        flower(ctx, 0, 0, 44, prog(lt, 1.6, 2.4), rot=0.3)
        flower(ctx, 52, -40, 24, prog(lt, 1.9, 2.7), rot=1.3, petal=BLUSH_LIGHT, inner=WHITE)
        flower(ctx, -30, -62, 18, prog(lt, 2.1, 2.9), rot=2.1)
        ctx.restore()
    draw_text(ctx, f"{CONTENT['bride']} & {CONTENT['groom']}", 540, 1530, 112, 'script', p=prog(lt, 2.0, 3.6),
              mode='wipe', gold=True, shine=0.2 + 0.6 * prog(lt, 3.0, 7.0), max_width=840)
    draw_text(ctx, '«Dos almas, un solo corazón»', 540, 1630, 50, 'italic', INK_SOFT, prog(lt, 3.2, 4.0))
    for i, (sx, sy) in enumerate(((190, 300), (900, 360), (150, 820), (930, 900))):
        twinkle(ctx, sx, sy, 20, lt, i * 1.7, start=2.0)


def honor_header(ctx, lt, kicker, title, icon):
    if icon == 'heart':
        hp = prog(lt, 0.1, 1.3)
        pts = heart_pts(540, 430, 46)
        if hp >= 1:
            fill_pts(ctx, pts, BLUSH, 0.6 * prog(lt, 1.3, 1.9))
        stroke_partial(ctx, [pts], ease_in_out(hp), 3, GOLD)
    else:
        flower(ctx, 540, 425, 44, prog(lt, 0.1, 1.0), rot=0.2)
        flower(ctx, 470, 455, 24, prog(lt, 0.35, 1.2), rot=1.2, petal=BLUSH_LIGHT, inner=WHITE)
        flower(ctx, 610, 455, 24, prog(lt, 0.5, 1.3), rot=2.2, petal=BLUSH_LIGHT, inner=WHITE)
        sprig(ctx, 500, 440, math.pi + 0.15, 150, prog(lt, 0.3, 1.5), side=-1, leaves=5, leaf_size=26)
        sprig(ctx, 580, 440, -0.15, 150, prog(lt, 0.3, 1.5), side=1, leaves=5, leaf_size=26)
    draw_text(ctx, kicker, 540, 575, 56, 'italic', INK_SOFT, prog(lt, 0.4, 1.2))
    draw_text(ctx, title, 540, 655, 50, 'semibold', GOLD_DEEP, prog(lt, 0.7, 1.9), 'letters', tracking=10)
    flourish(ctx, 540, 710, 210, prog(lt, 1.2, 2.1))


def scene_parents(ctx, lt, photo):
    honor_header(ctx, lt, 'Con la bendición de', 'NUESTROS PADRES', 'heart')
    y = 920
    for gi, (role, names) in enumerate(CONTENT['parents']):
        t0 = 1.6 + gi * 1.2
        draw_text(ctx, role, 540, y, 30, 'semibold', GOLD, prog(lt, t0, t0 + 0.9), 'letters', tracking=8)
        for ni, name in enumerate(names):
            draw_text(ctx, name, 540, y + 85 + ni * 75, 62, 'serif', INK, prog(lt, t0 + 0.3 + ni * 0.25, t0 + 1.1 + ni * 0.25))
        if gi == 0:
            flower(ctx, 540, y + 250, 16, prog(lt, t0 + 0.8, t0 + 1.4), petal=BLUSH_LIGHT, inner=WHITE)
            stroke_partial(ctx, [[(470, y + 250), (380, y + 250)]], prog(lt, t0 + 0.9, t0 + 1.5), 1.4, GOLD, 0.8)
            stroke_partial(ctx, [[(610, y + 250), (700, y + 250)]], prog(lt, t0 + 0.9, t0 + 1.5), 1.4, GOLD, 0.8)
        y += 400
    for i, (x, yy) in enumerate(((240, 430), (840, 430), (190, 1600), (890, 1580))):
        twinkle(ctx, x, yy, 16, lt, i * 1.4, start=1.0)


def scene_godparents(ctx, lt, photo):
    honor_header(ctx, lt, 'Y con el cariño de', 'NUESTROS PADRINOS', 'flowers')
    for gi, (role, name) in enumerate(CONTENT['godparents']):
        t0 = 1.6 + gi * 0.8
        y = 920 + gi * 280
        draw_text(ctx, role, 540, y, 30, 'semibold', GOLD, prog(lt, t0, t0 + 0.9), 'letters', tracking=8)
        draw_text(ctx, name, 540, y + 85, 62, 'serif', INK, prog(lt, t0 + 0.3, t0 + 1.1))
        if gi < 2:
            d = ease_back(prog(lt, t0 + 0.7, t0 + 1.1))
            if d > 0:
                star(ctx, 540, y + 160, 9 * d, 1.0, GOLD)
    for i, (x, yy) in enumerate(((230, 900), (850, 1100), (210, 1450), (870, 1660))):
        twinkle(ctx, x, yy, 16, lt, i * 1.4, start=1.0)


def scene_date(ctx, lt, photo):
    draw_text(ctx, 'Reserva la fecha', 540, 470, 130, 'script', p=prog(lt, 0.2, 1.6), mode='wipe', gold=True,
              shine=0.2 + 0.6 * prog(lt, 1.0, 5.0))
    rings(ctx, 540, 640, 58, prog(lt, 0.8, 2.2), lt)
    draw_text(ctx, CONTENT['month'], 540, 880, 50, 'semibold', GOLD_DEEP, prog(lt, 1.4, 2.4), 'letters', tracking=18)
    lp = ease_in_out(prog(lt, 1.6, 2.4))
    for x0, x1 in ((130, 390), (690, 950)):
        for yy in (950, 1060):
            mid = (x0 + x1) / 2
            stroke_partial(ctx, [[(mid, yy), (x0, yy)]], lp, 1.8, GOLD)
            stroke_partial(ctx, [[(mid, yy), (x1, yy)]], lp, 1.8, GOLD)
    draw_text(ctx, CONTENT['weekday'], 260, 1022, 40, 'semibold', INK, prog(lt, 2.0, 2.8), tracking=8)
    draw_text(ctx, CONTENT['year'], 820, 1022, 40, 'semibold', INK, prog(lt, 2.0, 2.8), tracking=8)
    cp = prog(lt, 1.8, 2.9)
    if cp > 0:
        day = 1 + int(round((CONTENT['day'] - 1) * ease_out(cp)))
        draw_text(ctx, str(day), 540, 1090, 250, 'serif', p=clamp(cp * 3), gold=True, rise=0,
                  shine=0.2 + 0.6 * prog(lt, 2.5, 6.0))
    draw_text(ctx, CONTENT['time'], 540, 1225, 58, 'italic', INK_SOFT, prog(lt, 2.8, 3.6))

    # calendario de junio 2027 (el 1 cae en martes)
    cx0, col, top, row = 300, 80, 1370, 62
    hp = prog(lt, 3.0, 3.8)
    for i, d in enumerate('DLMMJVS'):
        draw_text(ctx, d, cx0 + i * col, top, 30, 'semibold', GOLD_DEEP, hp, rise=10)
    stroke_partial(ctx, [[(cx0 - 40, top + 22), (cx0 + 6 * col + 40, top + 22)]], hp, 1.2, GOLD, 0.7)
    for day in range(1, 31):
        idx = day + 1  # martes = 2
        r, c = divmod(idx, 7)
        x, y = cx0 + c * col, top + 70 + r * row
        dp = prog(lt, 3.2 + day * 0.03, 3.8 + day * 0.03)
        color = GOLD_DEEP if day == CONTENT['day'] else INK_SOFT
        draw_text(ctx, str(day), x, y, 36, 'semibold' if day == CONTENT['day'] else 'serif', color, dp, rise=12)
        if day == CONTENT['day']:
            # círculo a mano alrededor del 12 y un corazón
            pts = [(x + 38 * math.cos(a) * (1 + 0.04 * math.sin(3 * a)), y - 12 + 34 * math.sin(a))
                   for a in [-2.2 + i * (2 * math.pi + 0.5) / 60 for i in range(61)]]
            stroke_partial(ctx, [pts], ease_in_out(prog(lt, 4.3, 5.1)), 3, BLUSH_DEEP)
            hp2 = ease_back(prog(lt, 4.9, 5.4))
            if hp2 > 0:
                fill_pts(ctx, heart_pts(x + 36, y - 46, 14 * hp2), BLUSH_DEEP, 0.95)


def scene_venues(ctx, lt, photo):
    draw_text(ctx, 'Te esperamos en', 540, 300, 104, 'script', p=prog(lt, 0.1, 1.3), mode='wipe', gold=True,
              shine=0.2 + 0.6 * prog(lt, 0.8, 5.0))
    for vi, (tag, name, address, time, icon) in enumerate(CONTENT['venues']):
        t0 = 0.4 + vi * 1.0
        cp = ease_out(prog(lt, t0, t0 + 0.9))
        if cp <= 0:
            continue
        top = 380 + vi * 660
        ctx.save()
        ctx.translate((1 - cp) * (-90 if vi == 0 else 90), 0)
        card(ctx, 110, top, 860, 610, cp)
        ip = prog(lt, t0 + 0.4, t0 + 1.9)
        if icon == 'church':
            stroke_partial(ctx, church(540, top + 215, 165), ease_in_out(ip), 2.6, GOLD_DEEP)
        else:
            stroke_partial(ctx, glasses(540, top + 215, 200), ease_in_out(ip), 2.6, GOLD_DEEP)
            if ip >= 1:
                for k in range(5):
                    bp = ((lt * 0.8 + k * 0.23) % 1.0)
                    for sx in (-1, 1):
                        ctx.arc(540 + sx * (55 + 6 * math.sin(k)), top + 120 - bp * 30 + k * 4, 2.6, 0, 2 * math.pi)
                        ctx.set_source_rgba(*GOLD, 0.6 * (1 - bp))
                        ctx.fill()
                twinkle(ctx, 540, top + 25, 20, lt, 0.5)
        draw_text(ctx, tag, 540, top + 290, 30, 'semibold', GOLD, prog(lt, t0 + 0.6, t0 + 1.5), 'letters', tracking=8)
        draw_text(ctx, name, 540, top + 370, 60, 'semibold', INK, prog(lt, t0 + 0.8, t0 + 1.6), max_width=780)
        for li, line in enumerate(address):
            draw_text(ctx, line, 540, top + 440 + li * 52, 44, 'italic', INK_SOFT,
                      prog(lt, t0 + 1.0 + li * 0.15, t0 + 1.8 + li * 0.15), max_width=760)
        tp = prog(lt, t0 + 1.3, t0 + 2.1)
        set_font(ctx, 'semibold', 38)
        tw = sum(ctx.text_extents(ch).x_advance for ch in time) + 6 * (len(time) - 1)
        draw_text(ctx, time, 540 + 22, top + 565, 38, 'semibold', GOLD_DEEP, tp, tracking=6)
        if tp > 0:
            clock(ctx, 540 + 22 - tw / 2 - 32, top + 552, 17, prog(lt, t0 + 1.3, t0 + 2.2), lt)
        ctx.restore()
    flourish(ctx, 540, 1770, 200, prog(lt, 2.8, 3.8))


def scene_closing(ctx, lt, photo):
    cx, cy, r = 540, 600, 255
    sp = ease_back(prog(lt, 0.1, 1.1))
    if sp > 0:
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(sp, sp)
        ctx.translate(-cx, -cy)
        ctx.arc(cx, cy, r, 0, 2 * math.pi)
        ctx.clip()
        photo.paint_focus(ctx, cx, cy + 40, 860 + 60 * prog(lt, 0, 5), 0.53, 0.36)
        ctx.restore()
    ring = arc_pts(cx, cy, r + 16, math.pi / 2, math.pi / 2 + 2 * math.pi, 120)
    stroke_partial(ctx, [ring], ease_in_out(prog(lt, 0.3, 1.6)), 3, GOLD)
    ring2 = arc_pts(cx, cy, r + 30, -math.pi / 2, 3 * math.pi / 2, 120)
    stroke_partial(ctx, [ring2], ease_in_out(prog(lt, 0.5, 1.8)), 1.2, GOLD, 0.7)
    for sx in (1, -1):
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(sx, 1)
        bx, by = r * math.cos(0.95), r * math.sin(0.95)
        sprig(ctx, bx, by, -0.75, 190, prog(lt, 0.9, 2.3), side=-1, leaves=6, leaf_size=30)
        sprig(ctx, bx, by, 0.6, 150, prog(lt, 1.0, 2.4), side=1, leaves=5, leaf_size=28)
        flower(ctx, bx, by, 40, prog(lt, 1.0, 1.8), rot=0.5)
        flower(ctx, bx + 46, by - 30, 22, prog(lt, 1.2, 2.0), rot=1.5, petal=BLUSH_LIGHT, inner=WHITE)
        ctx.restore()
    draw_text(ctx, '¡Te esperamos!', 540, 1090, 150, 'script', p=prog(lt, 0.9, 2.3), mode='wipe', gold=True,
              shine=0.2 + 0.6 * prog(lt, 1.8, 5.0))
    draw_text(ctx, f"{CONTENT['bride'].upper()} & {CONTENT['groom'].upper()}", 540, 1200, 42, 'semibold',
              GOLD_DEEP, prog(lt, 1.6, 2.7), 'letters', tracking=10)
    draw_text(ctx, f"{CONTENT['day']} · 06 · {CONTENT['year']}", 540, 1280, 52, 'serif', INK_SOFT, prog(lt, 2.1, 2.9),
              tracking=4)
    flourish(ctx, 540, 1345, 170, prog(lt, 2.3, 3.2))
    rngh = random.Random(5)
    for k in range(9):
        st = 1.8 + k * 0.35
        if lt < st:
            continue
        u = (lt - st) / 3.2
        if u > 1:
            continue
        x = rngh.uniform(180, 900) + math.sin(lt * 2 + k) * 18
        y = 1700 - u * 520
        fill_pts(ctx, heart_pts(x, y, rngh.uniform(10, 18)), BLUSH_DEEP if k % 2 else BLUSH, 0.8 * math.sin(math.pi * u))
    draw_text(ctx, 'Hecho con cariño en', 540, 1700, 34, 'italic', INK_SOFT, prog(lt, 2.8, 3.5))
    draw_text(ctx, 'Convite', 540, 1785, 78, 'script', GOLD_DEEP, prog(lt, 3.0, 3.8))


# (inicio, fin, función). Cada escena aparece y desaparece con un fundido de 0.5 s.
SCENES = [
    (0.0, 6.6, scene_intro),
    (6.4, 13.4, scene_photo),
    (13.2, 19.6, scene_parents),
    (19.4, 25.6, scene_godparents),
    (25.4, 32.0, scene_date),
    (31.8, 38.2, scene_venues),
    (38.0, DURATION + 1, scene_closing),
]
FADE = 0.5

# ---------------------------------------------------------------- render
_state = {}


def _init():
    _state['bg'] = make_background()
    _state['photo'] = Photo(os.environ.get('CONVITE_VIDEO_PHOTO', DEFAULT_PHOTO))
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    decorations(cairo.Context(surf), 10.0)
    _state['deco'] = surf


def render(t):
    if not _state:
        _init()
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surf)
    ctx.set_source_surface(_state['bg'])
    ctx.paint()
    draw_dust(ctx, t)
    if t >= 3.3:
        ctx.set_source_surface(_state['deco'])
        ctx.paint()
    else:
        decorations(ctx, t)
    for i, (a, b, fn) in enumerate(SCENES):
        if not (a <= t < b):
            continue
        fin = 1.0 if i == 0 else ease_in_out(prog(t, a, a + FADE))
        fout = 1.0 if i == len(SCENES) - 1 else ease_in_out(1 - prog(t, b - FADE, b))
        alpha = fin * fout
        if alpha <= 0:
            continue
        ctx.save()
        ctx.push_group()
        ctx.translate(0, (1 - fout) * -30)
        fn(ctx, t - a, _state['photo'])
        ctx.pop_group_to_source()
        ctx.paint_with_alpha(alpha)
        ctx.restore()
    draw_petals(ctx, t)
    if t > DURATION - 0.6:  # cierre suave a marfil
        ctx.set_source_rgba(*IVORY, prog(t, DURATION - 0.6, DURATION) * 0.0)
        ctx.paint()
    surf.flush()
    return surf


def render_bytes(frame):
    return bytes(render(frame / FPS).get_data())


# ---------------------------------------------------------------- música
SR = 44100


def wavetable(partials, size=4096):
    tab = array.array('d', [0.0] * size)
    for h, a in partials:
        for i in range(size):
            tab[i] += a * math.sin(2 * math.pi * h * i / size)
    peak = max(abs(v) for v in tab)
    return array.array('d', [v / peak for v in tab])


def synth_music(path, duration):
    n = int(SR * duration)
    buf = array.array('d', [0.0] * (n + SR * 12))
    bell = wavetable([(1, 1), (2, 0.32), (3, 0.14), (4, 0.06), (6, 0.03)])
    soft = wavetable([(1, 1), (2, 0.12), (3, 0.04)])
    size = len(bell)

    def note(start, midi, vel, decay, table, attack=0.004, length=None):
        f = 440 * 2 ** ((midi - 69) / 12)
        s0 = int(start * SR)
        ln = int((length or decay * 4.5) * SR)
        step = f * size / SR
        ph = 0.0
        env_k = math.exp(-1 / (decay * SR))
        env = vel
        att = max(1, int(attack * SR))
        for i in range(ln):
            a = env * (i / att if i < att else 1.0)
            buf[s0 + i] += a * table[int(ph) & (size - 1)]
            ph += step
            env *= env_k

    def pad(start, midi, vel, dur):
        f = 440 * 2 ** ((midi - 69) / 12)
        s0 = int(start * SR)
        ln = int((dur + 1.2) * SR)
        step = f * size / SR
        ph = 0.0
        att, rel_at = 0.9 * SR, dur * SR
        for i in range(ln):
            a = min(1.0, i / att)
            if i > rel_at:
                a *= max(0.0, 1 - (i - rel_at) / (1.2 * SR))
            buf[s0 + i] += vel * a * soft[int(ph) & (size - 1)]
            ph += step

    bar = 60 / 72 * 4
    eighth = bar / 8
    chords = {'D': (50, (0, 4, 7)), 'A': (45, (0, 4, 7)), 'Bm': (47, (0, 3, 7)), 'G': (43, (0, 4, 7)),
              'Em': (52, (0, 3, 7))}
    prog_ = ['D', 'A', 'Bm', 'G', 'D', 'A', 'Bm', 'G', 'Em', 'A', 'Bm', 'G', 'D']
    melody = {
        'D': [(0, 78, 2), (2, 76, 1), (3, 74, 1)], 'A': [(0, 73, 2), (2, 76, 2)],
        'Bm': [(0, 74, 2), (2, 78, 2)], 'G': [(0, 79, 2), (2, 74, 1), (3, 76, 1)],
        'Em': [(0, 79, 2), (2, 76, 2)],
    }
    for bi, ch in enumerate(prog_):
        root, tri = chords[ch]
        t0 = bi * bar
        last = bi == len(prog_) - 1
        third = tri[1]
        pattern = [root, root + 7, root + 12, root + 12 + third, root + 19, root + 12 + third, root + 12, root + 7]
        for k, m in enumerate(pattern if not last else pattern[:5]):
            note(t0 + k * eighth, m, 0.16 if k else 0.22, 0.7, bell)
        for iv in tri:
            pad(t0, root + 12 + iv, 0.035, bar if not last else 2.5)
        pad(t0, root, 0.05, bar if not last else 2.5)
        if bi >= 2:
            if last:
                note(t0, 74, 0.32, 2.2, bell)
                note(t0, 81, 0.18, 2.2, bell)
            else:
                for beat, m, _ in melody[ch]:
                    note(t0 + beat * bar / 4, m, 0.3, 1.3, bell)

    # eco/reverberación sencilla, estéreo
    left = array.array('d', buf[:n])
    right = array.array('d', buf[:n])
    for out, delays in ((left, (int(0.113 * SR), int(0.211 * SR))), (right, (int(0.157 * SR), int(0.263 * SR)))):
        for d in delays:
            for i in range(d, n):
                out[i] += 0.38 * out[i - d]
    peak = max(max(abs(v) for v in left), max(abs(v) for v in right))
    fade_out = int(2.5 * SR)
    frames = bytearray()
    pack = array.array('h', [0] * (2 * n))
    for i in range(n):
        g = 0.85 / peak * min(1.0, i / (0.2 * SR)) * min(1.0, (n - i) / fade_out)
        pack[2 * i] = int(left[i] * g * 32767)
        pack[2 * i + 1] = int(right[i] * g * 32767)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pack.tobytes())


# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--stills', help='segundos separados por coma; guarda PNG en lugar del vídeo')
    ap.add_argument('--out', default=os.path.join(OUT, 'boda-demo.mp4'))
    ap.add_argument('--photo', default=DEFAULT_PHOTO, help='foto de los novios')
    ap.add_argument('--workers', type=int, default=max(1, (os.cpu_count() or 2) - 4))
    args = ap.parse_args()
    os.environ['CONVITE_VIDEO_PHOTO'] = os.path.abspath(args.photo)  # también la leen los procesos hijos

    if args.stills:
        os.makedirs(os.path.join(OUT, 'stills'), exist_ok=True)
        for s in args.stills.split(','):
            t = float(s)
            render(t).write_to_png(os.path.join(OUT, 'stills', f'{t:05.1f}.png'))
        return

    wav = os.path.join(OUT, 'music.wav')
    print('Sintetizando música…', flush=True)
    synth_music(wav, DURATION)
    frames = int(DURATION * FPS)
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'bgra', '-s', f'{W}x{H}',
           '-r', str(FPS), '-i', '-', '-i', wav, '-c:v', 'libx264', '-preset', 'slow', '-crf', '18',
           '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', args.out]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    with mp.Pool(args.workers, initializer=_init) as pool:
        for i, data in enumerate(pool.imap(render_bytes, range(frames), chunksize=4)):
            proc.stdin.write(data)
            if i % 60 == 0:
                print(f'  cuadro {i}/{frames}', flush=True)
    proc.stdin.close()
    sys.exit(proc.wait())


if __name__ == '__main__':
    main()
