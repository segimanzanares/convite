"""Dibujo con pycairo: paleta del tema, texto animado, trazos y las ilustraciones (flores, ramas, íconos de línea).

Los colores se leen de C al dibujar, así que apply_theme() cambia toda la paleta sin tocar las funciones.
"""

import json
import math
import os
import random
from types import SimpleNamespace

import cairo
from PIL import Image

W, H = 1080, 1920
HERE = os.path.dirname(os.path.abspath(__file__))

# ---------------------------------------------------------------- tema


def hexc(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def mix(a, b, k):
    return tuple(x + (y - x) * k for x, y in zip(a, b))


WHITE = (1.0, 1.0, 1.0)
BLACK = (0.0, 0.0, 0.0)
C = SimpleNamespace()


def theme_names():
    return sorted(f[:-5] for f in os.listdir(os.path.join(HERE, 'themes')) if f.endswith('.json'))


def apply_theme(name, primary=None):
    """Carga themes/<name>.json en C. primary (hex) reemplaza el color principal del tema y sus tonos."""
    with open(os.path.join(HERE, 'themes', f'{name}.json')) as fh:
        theme = json.load(fh)
    for key, value in theme.items():
        if isinstance(value, str) and value.startswith('#'):
            setattr(C, key, hexc(value))
        else:
            setattr(C, key, value)
    if primary:
        base = hexc(primary)
        C.primary = base
        C.primary_deep = mix(base, BLACK, 0.25)
        C.primary_light = mix(base, WHITE, 0.45)
        C.primary_text = C.primary_light if C.dark else C.primary_deep


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
FONTS = {
    'serif': ('Cormorant Garamond', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL),
    'italic': ('Cormorant Garamond', cairo.FONT_SLANT_ITALIC, cairo.FONT_WEIGHT_NORMAL),
    'semibold': ('Cormorant Garamond', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD),
    'script': ('Great Vibes', cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL),
}


def set_font(ctx, font, size):
    fam, slant, weight = FONTS[font]
    ctx.select_font_face(fam, slant, weight)
    ctx.set_font_size(size)


def text_width(ctx, s, font, size, tracking=0.0):
    set_font(ctx, font, size)
    return sum(ctx.text_extents(ch).x_advance for ch in s) + tracking * (len(s) - 1)


def accent_pattern(x0, y0, x1, y1, shine=0.5):
    """Degradado metálico del color principal, con un brillo que se mueve con shine."""
    g = cairo.LinearGradient(x0, y0, x1, y1)
    g.add_color_stop_rgb(0, *C.primary_deep)
    g.add_color_stop_rgb(clamp(shine - 0.22), *C.primary)
    g.add_color_stop_rgb(clamp(shine), *C.primary_light)
    g.add_color_stop_rgb(clamp(shine + 0.22), *C.primary)
    g.add_color_stop_rgb(1, *C.primary_deep)
    return g


def draw_text(ctx, s, x, y, size, font='serif', color=None, p=1.0, mode='fade', align='center',
              tracking=0.0, rise=28, max_width=None, alpha=1.0, accent=False, shine=0.5):
    """Texto animado. mode: fade (aparece y sube), letters (letra por letra), wipe (se escribe)."""
    if p <= 0 or not s:
        return
    color = color or C.ink
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
    if accent:
        ctx.set_source(accent_pattern(x0, y - size * 0.8, x0 + width, y + size * 0.2, shine))
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


def flourish(ctx, cx, cy, half, p, width=2.2):
    """Línea que crece desde el centro y remata en espirales."""
    if p <= 0:
        return
    for side in (1, -1):
        ex = cx + side * half * 0.82
        pts = [(cx + side * 16, cy), (ex, cy)]
        r0 = half * 0.08
        for i in range(1, 41):
            u = i / 40
            th = math.pi / 2 - u * 1.35 * 2 * math.pi
            r = r0 * (1 - 0.7 * u)
            pts.append((ex + side * r * math.cos(th), cy - r0 + r * math.sin(th)))
        stroke_partial(ctx, [pts], ease_in_out(p), width, C.primary)
    s = 9 * ease_back(prog(p, 0.0, 0.4))
    if s > 0:
        ctx.move_to(cx, cy - s)
        ctx.line_to(cx + s * 0.7, cy)
        ctx.line_to(cx, cy + s)
        ctx.line_to(cx - s * 0.7, cy)
        ctx.close_path()
        ctx.set_source_rgb(*C.primary)
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


def flower(ctx, x, y, r, p, rot=0.0, light=False, alpha=1.0):
    """Flor de cinco pétalos que brota girando. light usa los tonos claros del tema."""
    p = clamp(p)
    if p <= 0:
        return
    petal, inner = (C.flower_light, C.flower_center) if light else (C.flower, C.flower_light)
    s = ease_back(p)
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(rot - (1 - p) * 1.2)
    ctx.scale(s, s)
    for col, rr, off in ((petal, r, 0.0), (inner, r * 0.62, math.pi / 5)):
        for i in range(5):
            ctx.save()
            ctx.rotate(off + i * 2 * math.pi / 5)
            ctx.move_to(0, 0)
            ctx.curve_to(-rr * 0.55, -rr * 0.3, -rr * 0.5, -rr * 1.0, 0, -rr)
            ctx.curve_to(rr * 0.5, -rr * 1.0, rr * 0.55, -rr * 0.3, 0, 0)
            ctx.set_source_rgba(*col, 0.96 * alpha)
            ctx.fill_preserve()
            ctx.set_source_rgba(*C.flower_deep, 0.35 * alpha)
            ctx.set_line_width(max(0.8, r * 0.04))
            ctx.stroke()
            ctx.restore()
    ctx.arc(0, 0, r * 0.17, 0, 2 * math.pi)
    ctx.set_source_rgba(*C.primary, alpha)
    ctx.fill()
    for i in range(6):
        a = i * math.pi / 3 + 0.3
        ctx.arc(math.cos(a) * r * 0.3, math.sin(a) * r * 0.3, r * 0.05, 0, 2 * math.pi)
        ctx.set_source_rgba(*C.primary_deep, alpha)
        ctx.fill()
    ctx.restore()


def sprig(ctx, x, y, ang, length, p, bend=0.16, leaves=7, leaf_size=36, side=1):
    """Rama que crece: tallo trazado y hojas que brotan a su paso."""
    p = clamp(p)
    if p <= 0:
        return
    ca, sa = math.cos(ang), math.sin(ang)
    b = bend * length * side
    local = bezier((0, 0), (length * 0.33, -b), (length * 0.66, -b * 0.9), (length, -b * 0.3), 40)
    pts = [(x + px * ca - py * sa, y + px * sa + py * ca) for px, py in local]
    ps = ease_in_out(clamp(p / 0.8))
    stroke_partial(ctx, [pts], ps, 3.0, C.leaf_dark, 0.9)
    for k in range(leaves):
        f = 0.14 + 0.8 * k / leaves
        lp = clamp((ps - f) / 0.2)
        if lp <= 0:
            continue
        i = int(f * 40)
        a, c = pts[i], pts[i + 1]
        tang = math.atan2(c[1] - a[1], c[0] - a[0])
        sgn = 1 if k % 2 == 0 else -1
        leaf(ctx, a[0], a[1], tang + sgn * 0.8, leaf_size * (1 - 0.45 * f) * ease_back(lp),
             C.leaf if k % 3 else C.leaf_light)
    if ps > 0.9:
        a, c = pts[-2], pts[-1]
        leaf(ctx, c[0], c[1], math.atan2(c[1] - a[1], c[0] - a[0]),
             leaf_size * 0.55 * ease_back(prog(ps, 0.9, 1.0)), C.leaf)


def star(ctx, x, y, s, alpha, color=None):
    if alpha <= 0.01 or s <= 0:
        return
    ctx.move_to(x, y - s)
    for (dx, dy) in ((0.16, -0.16), (1, 0), (0.16, 0.16), (0, 1), (-0.16, 0.16), (-1, 0), (-0.16, -0.16), (0, -1)):
        ctx.line_to(x + dx * s, y + dy * s)
    ctx.set_source_rgba(*(color or C.primary_light), alpha)
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
    def tf(pts):
        return [(cx + x * s, cy + y * s) for x, y in pts]

    out = [tf([(-0.62, 0), (0.62, 0)]),
           tf([(-0.45, 0), (-0.45, -0.36), (-0.16, -0.5), (-0.16, -0.72), (0, -0.95),
               (0.16, -0.72), (0.16, -0.5), (0.45, -0.36), (0.45, 0)]),
           tf([(0, -0.95), (0, -1.1)]), tf([(-0.055, -1.04), (0.055, -1.04)])]
    door = [(-0.085, 0), (-0.085, -0.16)] + [(0.085 * math.cos(a), -0.16 + 0.085 * math.sin(a))
                                              for a in [math.pi + i * math.pi / 16 for i in range(17)]] + [(0.085, 0)]
    out.append(tf(door))
    out.append(tf([(0.05 * math.cos(a), -0.61 + 0.05 * math.sin(a)) for a in [i * math.pi / 12 for i in range(25)]]))
    for wx in (-0.3, 0.3):
        out.append(tf([(wx - 0.04, -0.08), (wx - 0.04, -0.2)] +
                      [(wx + 0.04 * math.cos(a), -0.2 + 0.04 * math.sin(a))
                       for a in [math.pi + i * math.pi / 10 for i in range(11)]] +
                      [(wx + 0.04, -0.08), (wx - 0.04, -0.08)]))
    return out


def glasses(cx, cy, s):
    flute = [[(-0.12, 0), (0.12, 0)], [(0, 0), (0, -0.36)],
             bezier((0, -0.36), (-0.11, -0.4), (-0.12, -0.6), (-0.115, -0.86), 12) +
             bezier((0.115, -0.86), (0.12, -0.6), (0.11, -0.4), (0, -0.36), 12),
             [(-0.105, -0.7), (0.105, -0.7)]]
    out = []
    for side, rot in ((-1, 0.18), (1, -0.18)):
        bx = cx + side * 0.26 * s
        c, sn = math.cos(rot), math.sin(rot)
        for pl in flute:
            out.append([(bx + (x * c - y * sn) * s, cy + (x * sn + y * c) * s) for x, y in pl])
    return out


def gift(cx, cy, s):
    """Caja de regalo con moño, para lugares de fiesta que no son ceremonia ni banquete."""
    def tf(pts):
        return [(cx + x * s, cy + y * s) for x, y in pts]

    return [tf([(-0.42, 0), (-0.42, -0.5), (0.42, -0.5), (0.42, 0), (-0.42, 0)]),
            tf([(-0.48, -0.5), (-0.48, -0.66), (0.48, -0.66), (0.48, -0.5)]),
            tf([(0, 0), (0, -0.66)]),
            tf(bezier((0, -0.66), (-0.3, -0.95), (-0.42, -0.7), (0, -0.66), 16)),
            tf(bezier((0, -0.66), (0.3, -0.95), (0.42, -0.7), (0, -0.66), 16))]


def clock(ctx, x, y, r, p):
    stroke_partial(ctx, [arc_pts(x, y, r, -math.pi / 2, 3 * math.pi / 2, 40)], ease_in_out(p), 2.4, C.primary_text)
    if p > 0.6:
        a = clamp((p - 0.6) / 0.4)
        m = -math.pi / 2 + a * 2 * math.pi
        ctx.set_source_rgba(*C.primary_text, a)
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
        stroke_partial(ctx, [pts], ease_in_out(q), 6, C.primary)
        stroke_partial(ctx, [pts], ease_in_out(q), 1.6, C.primary_light)
    d = ease_back(prog(p, 0.75, 1.0))
    if d > 0:
        x, y = cx - 0.45 * r, cy - r - 4
        ctx.move_to(x, y - 18 * d)
        ctx.line_to(x + 13 * d, y - 6 * d)
        ctx.line_to(x, y + 6 * d)
        ctx.line_to(x - 13 * d, y - 6 * d)
        ctx.close_path()
        ctx.set_source_rgb(*C.primary_light)
        ctx.fill_preserve()
        ctx.set_source_rgb(*C.primary_deep)
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
        ctx.set_source_rgba(0.1, 0.07, 0.03, 0.014 * alpha)
        ctx.fill()
    rounded_rect(ctx, x, y, w, h, 28)
    ctx.set_source_rgba(*C.card, C.card_alpha * alpha)
    ctx.fill_preserve()
    ctx.set_source_rgba(*C.primary, 0.55 * alpha)
    ctx.set_line_width(1.6)
    ctx.stroke()
    rounded_rect(ctx, x + 12, y + 12, w - 24, h - 24, 20)
    ctx.set_source_rgba(*C.primary, 0.25 * alpha)
    ctx.set_line_width(1)
    ctx.stroke()


# ---------------------------------------------------------------- foto


class Photo:
    def __init__(self, path):
        im = Image.open(path)
        im.draft('RGB', (2400, 2400))  # JPEG grandes: decodifica ya reducida
        im = im.convert('RGB')
        # Las fotos chicas se amplían para que el zoom no se vea pixeleado; las grandes se limitan
        scale = min(2.0, 1600 / max(im.width, im.height))
        im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
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


# ---------------------------------------------------------------- capas fijas


def make_background():
    surf = cairo.ImageSurface(cairo.FORMAT_ARGB32, W, H)
    ctx = cairo.Context(surf)
    g = cairo.RadialGradient(W / 2, H * 0.45, 150, W / 2, H * 0.5, 1250)
    g.add_color_stop_rgb(0, *C.background)
    g.add_color_stop_rgb(1, *C.paper_edge)
    ctx.set_source(g)
    ctx.paint()
    rng = random.Random(3)
    for _ in range(2600):  # grano de papel muy sutil
        ctx.arc(rng.uniform(0, W), rng.uniform(0, H), rng.uniform(0.6, 1.6), 0, 2 * math.pi)
        ctx.set_source_rgba(*C.primary_deep, rng.uniform(0.3, 1.0) * C.grain_alpha)
        ctx.fill()
    return surf


def frame_border(ctx, p):
    for inset, width, alpha in ((40, 2.4, 0.9), (54, 1.0, 0.55)):
        x0, y0, x1, y1 = inset, inset, W - inset, H - inset
        right = [(W / 2, y0), (x1, y0), (x1, y1), (W / 2, y1)]
        left = [(W / 2, y0), (x0, y0), (x0, y1), (W / 2, y1)]
        stroke_partial(ctx, [right], ease_in_out(p), width, C.primary, alpha)
        stroke_partial(ctx, [left], ease_in_out(p), width, C.primary, alpha)


def corner_set(ctx, p):
    """Ramo de esquina en coordenadas de la esquina superior izquierda."""
    sprig(ctx, 74, 92, 0.12, 280, prog(p, 0.0, 0.85), side=-1, leaves=7, leaf_size=34)
    sprig(ctx, 92, 74, math.pi / 2 - 0.12, 280, prog(p, 0.1, 0.95), side=1, leaves=7, leaf_size=34)
    sprig(ctx, 86, 86, math.pi / 4, 170, prog(p, 0.2, 1.0), side=1, leaves=5, leaf_size=28)
    flower(ctx, 236, 214, 22, prog(p, 0.55, 0.9), rot=0.4, light=True)
    flower(ctx, 92, 92, 40, prog(p, 0.35, 0.8), rot=0.2)
    flower(ctx, 168, 120, 20, prog(p, 0.5, 0.95), rot=1.0, light=True)
    flower(ctx, 120, 170, 16, prog(p, 0.6, 1.0), rot=2.0)


CORNERS = ((1, 1, 0, 0), (-1, 1, W, 0), (1, -1, 0, H), (-1, -1, W, H))
DECORATIONS_DONE = 3.3


def decorations(ctx, t):
    frame_border(ctx, prog(t, 0.0, 1.8))
    for sx, sy, tx, ty in CORNERS:
        ctx.save()
        ctx.translate(tx, ty)
        ctx.scale(sx, sy)
        corner_set(ctx, prog(t, 0.6, 3.2))
        ctx.restore()


_rng = random.Random(11)
PETALS = [dict(x=_rng.uniform(0, W), y=_rng.uniform(-H, H), vy=_rng.uniform(55, 110), sway=_rng.uniform(20, 60),
               ph=_rng.uniform(0, 6.28), spin=_rng.uniform(-1.2, 1.2), size=_rng.uniform(16, 30),
               tone=_rng.choice(('flower', 'flower_light', 'flower_light', 'primary_light')), flip=_rng.uniform(1.0, 2.6))
          for _ in range(16)]
DUST = [dict(x=_rng.uniform(60, W - 60), y=_rng.uniform(60, H - 60), r=_rng.uniform(1.5, 3.8),
             ph=_rng.uniform(0, 6.28), sp=_rng.uniform(0.8, 2.0), vy=_rng.uniform(6, 18)) for _ in range(46)]


def draw_dust(ctx, t):
    for d in DUST:
        a = (0.5 + 0.5 * math.sin(t * d['sp'] + d['ph'])) * 0.55 * clamp(t / 1.5)
        ctx.arc(d['x'], (d['y'] - d['vy'] * t) % H, d['r'], 0, 2 * math.pi)
        ctx.set_source_rgba(*C.primary_light, a)
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
        ctx.set_source_rgba(*getattr(C, pt['tone']), 0.75 * fade)
        ctx.fill()
        ctx.restore()
