"""Las escenas del video y la línea de tiempo que arma con los datos de la invitación.

Cada escena se arma solo si hay datos para ella (como las plantillas web ocultan las secciones vacías), y los textos
cambian según el tipo de evento y si invitan una o dos personas.
"""

import calendar
import datetime
import math
import random

import cairo

from drawing import (C, Photo, arc_pts, arch_path, arch_pts, card, church, clamp, clock, draw_text, ease_back,
                     ease_in_out, ease_out, fill_pts, flourish, flower, gift, glasses, heart_pts, prog, rings, sprig,
                     star, stroke_partial, text_width, twinkle)

MONTHS = ['ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO', 'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE',
          'NOVIEMBRE', 'DICIEMBRE']
WEEKDAYS = ['LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO', 'DOMINGO']

KICKERS = {
    'wedding': 'NUESTRA BODA', 'xv': 'MIS XV AÑOS', 'birthday': 'MI CUMPLEAÑOS', 'baptism': 'MI BAUTIZO',
    'gender_reveal': 'REVELACIÓN DE GÉNERO', 'baby_shower': 'BABY SHOWER',
}
QUOTES = {
    'wedding': '«Dos almas, un solo corazón»', 'xv': '«Un sueño hecho realidad»',
    'birthday': '«Un año más para celebrar»', 'baptism': '«Un regalo de Dios»',
    'gender_reveal': '«Muy pronto lo sabremos»', 'baby_shower': '«Un pequeño milagro en camino»',
}
# Encabezado de cada grupo de honor: (antesala, título con "nuestros", título con "mis")
HONOR_TITLES = {
    'parents': ('Con la bendición de', 'NUESTROS PADRES', 'MIS PADRES'),
    'godparents': ('Y con el cariño de', 'NUESTROS PADRINOS', 'MIS PADRINOS'),
    'grandparents': ('Con el amor de', 'LOS ABUELOS', 'LOS ABUELOS'),
    'hosts': ('Organizan con cariño', 'LOS ANFITRIONES', 'LOS ANFITRIONES'),
}


class Event:
    """Los datos del video, ya normalizados (ver InvitationVideoService::data en Laravel)."""

    def __init__(self, data):
        self.kind = data.get('kind') or 'wedding'
        self.names = [n.strip() for n in data.get('names') or [] if n and n.strip()] or ['']
        self.age = data.get('age')
        self.date = datetime.date.fromisoformat(data['date']) if data.get('date') else None
        self.time = data.get('time')
        self.honor = [(h['key'], [g for g in h.get('groups', []) if g.get('names')]) for h in data.get('honor', [])]
        self.honor = [(key, groups) for key, groups in self.honor if groups]
        self.venues = [v for v in data.get('venues') or [] if v.get('name')]
        self.photos = [Photo(p) for p in data.get('photos') or []]
        # Una boda siempre habla en plural; los demás, según cuántos nombres invitan
        self.plural = self.kind == 'wedding' or len(self.names) > 1

    @property
    def couple(self):
        return len(self.names) > 1

    def invite_lines(self):
        verb = 'Te invitamos' if self.plural else 'Te invito'
        return {
            'wedding': ('Te invitamos a celebrar', 'el día más feliz de nuestras vidas'),
            'xv': ('Te invito a celebrar', 'mis quince años'),
            'birthday': ('Te invito a celebrar', f'mis {self.age} años' if self.age else 'mi cumpleaños'),
            'baptism': ('Te invito a celebrar', 'mi bautizo'),
            'gender_reveal': (f'{verb} a descubrir', 'si es niño o niña'),
            'baby_shower': (f'{verb} a celebrar', 'la llegada de nuestro bebé' if self.plural else 'la llegada de mi bebé'),
        }.get(self.kind, (f'{verb} a celebrar', ''))

    def names_line(self):
        return ' & '.join(self.names)


# ---------------------------------------------------------------- escenas


def scene_intro(ctx, lt, ev):
    draw_text(ctx, KICKERS.get(ev.kind, ''), 540, 620, 36, 'semibold', C.primary_text, prog(lt, 0.7, 1.9), 'letters',
              tracking=12, max_width=860)
    flourish(ctx, 540, 672, 150, prog(lt, 1.3, 2.3))
    if ev.couple:
        draw_text(ctx, ev.names[0], 540, 900, 190, 'script', p=prog(lt, 1.6, 3.0), mode='wipe', accent=True,
                  shine=0.2 + 0.6 * prog(lt, 2.5, 6.0), max_width=880)
        draw_text(ctx, '&', 540, 1035, 96, 'italic', C.primary, prog(lt, 2.6, 3.4), rise=0)
        draw_text(ctx, ev.names[1], 540, 1215, 190, 'script', p=prog(lt, 3.0, 4.4), mode='wipe', accent=True,
                  shine=0.2 + 0.6 * prog(lt, 3.5, 6.5), max_width=880)
    else:
        draw_text(ctx, ev.names[0], 540, 1080, 230, 'script', p=prog(lt, 1.8, 3.6), mode='wipe', accent=True,
                  shine=0.2 + 0.6 * prog(lt, 2.8, 6.5), max_width=880)
    flourish(ctx, 540, 1320, 230, prog(lt, 3.9, 5.0))
    first, second = ev.invite_lines()
    draw_text(ctx, first, 540, 1430, 54, 'italic', C.ink_soft, prog(lt, 4.3, 5.1), max_width=880)
    draw_text(ctx, second, 540, 1500, 54, 'italic', C.ink_soft, prog(lt, 4.5, 5.3), max_width=880)
    for i, (x, y) in enumerate(((270, 760), (830, 820), (230, 1110), (860, 1150), (760, 700))):
        twinkle(ctx, x, y, 18, lt, i * 1.3, start=2.0)


def scene_photo(ctx, lt, ev):
    photo = ev.photos[0]
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
    stroke_partial(ctx, [arch_pts(x - 16, y - 16, w + 32, h + 32)], ease_in_out(prog(lt, 0.4, 2.2)), 3, C.primary)
    stroke_partial(ctx, [arch_pts(x - 30, y - 30, w + 60, h + 60)], ease_in_out(prog(lt, 0.8, 2.6)), 1.2, C.primary,
                   0.7)
    by = y + h + 10
    for sx in (1, -1):
        ctx.save()
        ctx.translate(540 - sx * (w / 2 + 10), by)
        ctx.scale(sx, 1)
        sprig(ctx, 0, 0, -math.pi / 2 - 0.25, 230, prog(lt, 1.2, 2.8), side=1, leaves=6, leaf_size=32)
        sprig(ctx, 0, 0, -0.15, 200, prog(lt, 1.4, 3.0), side=1, leaves=5, leaf_size=30)
        flower(ctx, 0, 0, 44, prog(lt, 1.6, 2.4), rot=0.3)
        flower(ctx, 52, -40, 24, prog(lt, 1.9, 2.7), rot=1.3, light=True)
        flower(ctx, -30, -62, 18, prog(lt, 2.1, 2.9), rot=2.1)
        ctx.restore()
    draw_text(ctx, ev.names_line(), 540, 1530, 112, 'script', p=prog(lt, 2.0, 3.6), mode='wipe', accent=True,
              shine=0.2 + 0.6 * prog(lt, 3.0, 7.0), max_width=840)
    draw_text(ctx, QUOTES.get(ev.kind, ''), 540, 1630, 50, 'italic', C.ink_soft, prog(lt, 3.2, 4.0))
    for i, (sx, sy) in enumerate(((190, 300), (900, 360), (150, 820), (930, 900))):
        twinkle(ctx, sx, sy, 20, lt, i * 1.7, start=2.0)


def honor_header(ctx, lt, kicker, title, heart):
    if heart:
        hp = prog(lt, 0.1, 1.3)
        pts = heart_pts(540, 430, 46)
        if hp >= 1:
            fill_pts(ctx, pts, C.flower, 0.6 * prog(lt, 1.3, 1.9))
        stroke_partial(ctx, [pts], ease_in_out(hp), 3, C.primary)
    else:
        flower(ctx, 540, 425, 44, prog(lt, 0.1, 1.0), rot=0.2)
        flower(ctx, 470, 455, 24, prog(lt, 0.35, 1.2), rot=1.2, light=True)
        flower(ctx, 610, 455, 24, prog(lt, 0.5, 1.3), rot=2.2, light=True)
        sprig(ctx, 500, 440, math.pi + 0.15, 150, prog(lt, 0.3, 1.5), side=-1, leaves=5, leaf_size=26)
        sprig(ctx, 580, 440, -0.15, 150, prog(lt, 0.3, 1.5), side=1, leaves=5, leaf_size=26)
    draw_text(ctx, kicker, 540, 575, 56, 'italic', C.ink_soft, prog(lt, 0.4, 1.2))
    draw_text(ctx, title, 540, 655, 50, 'semibold', C.primary_text, prog(lt, 0.7, 1.9), 'letters', tracking=10,
              max_width=880)
    flourish(ctx, 540, 710, 210, prog(lt, 1.2, 2.1))


ROLE_TO_NAME = 85   # del rol al primer nombre
NAME_STEP = 75      # entre nombres de un grupo
GROUP_GAP = 150     # entre grupos (con un adorno en medio)
HONOR_TOP, HONOR_BOTTOM = 820, 1760


def group_height(group):
    return ROLE_TO_NAME + NAME_STEP * (len(group['names']) - 1)


def chunk_groups(groups):
    """Reparte los grupos en pantallas que caben entre el encabezado y el pie."""
    pages, page, height = [], [], 0
    for g in groups:
        extra = group_height(g) + (GROUP_GAP if page else 0)
        if page and height + extra > HONOR_BOTTOM - HONOR_TOP - 60:
            pages.append(page)
            page, height = [], 0
            extra = group_height(g)
        page.append(g)
        height += extra
    if page:
        pages.append(page)
    return pages


def make_scene_honor(key, groups, heart):
    kicker, plural_title, single_title = HONOR_TITLES.get(key, ('', '', ''))

    def scene(ctx, lt, ev):
        honor_header(ctx, lt, kicker, plural_title if ev.plural else single_title, heart)
        total = sum(group_height(g) for g in groups) + GROUP_GAP * (len(groups) - 1)
        y = HONOR_TOP + max(40, (HONOR_BOTTOM - HONOR_TOP - total) / 2)
        step = min(1.2, 3.0 / len(groups))
        for gi, g in enumerate(groups):
            t0 = 1.6 + gi * step
            draw_text(ctx, (g.get('role') or '').upper(), 540, y, 30, 'semibold', C.primary, prog(lt, t0, t0 + 0.9),
                      'letters', tracking=8, max_width=880)
            for ni, name in enumerate(g['names']):
                draw_text(ctx, name, 540, y + ROLE_TO_NAME + ni * NAME_STEP, 60, 'serif', C.ink,
                          prog(lt, t0 + 0.3 + ni * 0.2, t0 + 1.1 + ni * 0.2), max_width=880)
            y += group_height(g)
            if gi < len(groups) - 1:
                d = ease_back(prog(lt, t0 + 0.7, t0 + 1.1))
                if d > 0:
                    star(ctx, 540, y + GROUP_GAP / 2 + 10, 9 * d, 1.0, C.primary)
                y += GROUP_GAP
        for i, (x, yy) in enumerate(((240, 430), (840, 430), (190, 1620), (890, 1600))):
            twinkle(ctx, x, yy, 16, lt, i * 1.4, start=1.0)

    return scene


def scene_date(ctx, lt, ev):
    d = ev.date
    draw_text(ctx, 'Reserva la fecha', 540, 470, 130, 'script', p=prog(lt, 0.2, 1.6), mode='wipe', accent=True,
              shine=0.2 + 0.6 * prog(lt, 1.0, 5.0))
    if ev.kind == 'wedding':
        rings(ctx, 540, 640, 58, prog(lt, 0.8, 2.2), lt)
    else:
        flower(ctx, 540, 640, 50, prog(lt, 0.8, 1.6), rot=0.3)
        for i, (x, y) in enumerate(((470, 610), (610, 610))):
            flower(ctx, x, y, 24, prog(lt, 1.0 + i * 0.2, 1.8 + i * 0.2), rot=1 + i, light=True)
    draw_text(ctx, MONTHS[d.month - 1], 540, 880, 50, 'semibold', C.primary_text, prog(lt, 1.4, 2.4), 'letters',
              tracking=18)
    lp = ease_in_out(prog(lt, 1.6, 2.4))
    for x0, x1 in ((130, 390), (690, 950)):
        for yy in (950, 1060):
            mid = (x0 + x1) / 2
            stroke_partial(ctx, [[(mid, yy), (x0, yy)]], lp, 1.8, C.primary)
            stroke_partial(ctx, [[(mid, yy), (x1, yy)]], lp, 1.8, C.primary)
    draw_text(ctx, WEEKDAYS[d.weekday()], 260, 1022, 40, 'semibold', C.ink, prog(lt, 2.0, 2.8), tracking=8,
              max_width=250)
    draw_text(ctx, str(d.year), 820, 1022, 40, 'semibold', C.ink, prog(lt, 2.0, 2.8), tracking=8)
    cp = prog(lt, 1.8, 2.9)
    if cp > 0:
        day = 1 + int(round((d.day - 1) * ease_out(cp)))
        draw_text(ctx, str(day), 540, 1090, 250, 'serif', p=clamp(cp * 3), accent=True, rise=0,
                  shine=0.2 + 0.6 * prog(lt, 2.5, 6.0))
    if ev.time:
        draw_text(ctx, f'A las {ev.time} horas', 540, 1225, 58, 'italic', C.ink_soft, prog(lt, 2.8, 3.6))

    # Calendario del mes con el día marcado
    cx0, col, top, row = 300, 80, 1350, 62
    hp = prog(lt, 3.0, 3.8)
    for i, letter in enumerate('DLMMJVS'):
        draw_text(ctx, letter, cx0 + i * col, top, 30, 'semibold', C.primary_text, hp, rise=10)
    stroke_partial(ctx, [[(cx0 - 40, top + 22), (cx0 + 6 * col + 40, top + 22)]], hp, 1.2, C.primary, 0.7)
    first = (datetime.date(d.year, d.month, 1).weekday() + 1) % 7  # domingo = 0
    days = calendar.monthrange(d.year, d.month)[1]
    for day in range(1, days + 1):
        r, c = divmod(first + day - 1, 7)
        x, y = cx0 + c * col, top + 70 + r * row
        dp = prog(lt, 3.2 + day * 0.03, 3.8 + day * 0.03)
        marked = day == d.day
        draw_text(ctx, str(day), x, y, 36, 'semibold' if marked else 'serif', C.primary_text if marked else C.ink_soft,
                  dp, rise=12)
        if marked:
            pts = [(x + 38 * math.cos(a) * (1 + 0.04 * math.sin(3 * a)), y - 12 + 34 * math.sin(a))
                   for a in [-2.2 + i * (2 * math.pi + 0.5) / 60 for i in range(61)]]
            stroke_partial(ctx, [pts], ease_in_out(prog(lt, 4.3, 5.1)), 3, C.flower_deep)
            hp2 = ease_back(prog(lt, 4.9, 5.4))
            if hp2 > 0:
                fill_pts(ctx, heart_pts(x + 36, y - 46, 14 * hp2), C.flower_deep, 0.95)


def venue_icon(venue):
    """Iglesia para ceremonias, copas para recepciones y banquetes, regalo para lo demás."""
    text = f"{venue.get('icon') or ''} {venue.get('tag') or ''} {venue.get('name') or ''}".lower()
    if any(k in text for k in ('⛪', 'ceremonia', 'misa', 'iglesia', 'parroquia', 'templo', 'capilla', 'catedral')):
        return church
    if any(k in text for k in ('🥂', '🍽', 'recepci', 'banquete', 'salón', 'salon', 'hacienda', 'fiesta', 'jardín')):
        return glasses
    return gift


def make_scene_venues(venues, first_page):
    def scene(ctx, lt, ev):
        if first_page:
            draw_text(ctx, 'Te esperamos en', 540, 300, 104, 'script', p=prog(lt, 0.1, 1.3), mode='wipe', accent=True,
                      shine=0.2 + 0.6 * prog(lt, 0.8, 5.0))
        tops = [380, 1040] if len(venues) == 2 else [700]
        for vi, (venue, top) in enumerate(zip(venues, tops)):
            t0 = 0.4 + vi * 1.0
            cp = ease_out(prog(lt, t0, t0 + 0.9))
            if cp <= 0:
                continue
            ctx.save()
            ctx.translate((1 - cp) * (-90 if vi == 0 else 90), 0)
            card(ctx, 110, top, 860, 610, cp)
            icon = venue_icon(venue)
            stroke_partial(ctx, icon(540, top + 215, 165 if icon is church else 190),
                           ease_in_out(prog(lt, t0 + 0.4, t0 + 1.9)), 2.6, C.primary_text)
            if icon is glasses and lt > t0 + 1.9:
                for k in range(5):
                    bp = (lt * 0.8 + k * 0.23) % 1.0
                    for sx in (-1, 1):
                        ctx.arc(540 + sx * (55 + 6 * math.sin(k)), top + 120 - bp * 30 + k * 4, 2.6, 0, 2 * math.pi)
                        ctx.set_source_rgba(*C.primary, 0.6 * (1 - bp))
                        ctx.fill()
                twinkle(ctx, 540, top + 25, 20, lt, 0.5)
            draw_text(ctx, (venue.get('tag') or '').upper(), 540, top + 290, 30, 'semibold', C.primary,
                      prog(lt, t0 + 0.6, t0 + 1.5), 'letters', tracking=8, max_width=760)
            draw_text(ctx, venue['name'], 540, top + 370, 60, 'semibold', C.ink, prog(lt, t0 + 0.8, t0 + 1.6),
                      max_width=780)
            for li, line in enumerate([a for a in venue.get('address_lines') or [] if a][:2]):
                draw_text(ctx, line, 540, top + 440 + li * 52, 44, 'italic', C.ink_soft,
                          prog(lt, t0 + 1.0 + li * 0.15, t0 + 1.8 + li * 0.15), max_width=760)
            time = (venue.get('time') or '').upper()
            if time:
                tp = prog(lt, t0 + 1.3, t0 + 2.1)
                tw = text_width(ctx, time, 'semibold', 38, 6)
                draw_text(ctx, time, 540 + 22, top + 565, 38, 'semibold', C.primary_text, tp, tracking=6)
                if tp > 0:
                    clock(ctx, 540 + 22 - tw / 2 - 32, top + 552, 17, prog(lt, t0 + 1.3, t0 + 2.2))
            ctx.restore()
        if len(venues) == 2:
            flourish(ctx, 540, 1770, 200, prog(lt, 2.8, 3.8))

    return scene


def scene_closing(ctx, lt, ev):
    cx, cy, r = 540, 600, 255
    sp = ease_back(prog(lt, 0.1, 1.1))
    photo = ev.photos[-1] if ev.photos else None
    if photo and sp > 0:
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(sp, sp)
        ctx.translate(-cx, -cy)
        ctx.arc(cx, cy, r, 0, 2 * math.pi)
        ctx.clip()
        side = 2 * r * (1.25 + 0.06 * prog(lt, 0, 5))
        photo.paint_cover(ctx, cx - side / 2, cy - side / 2, side, side, fx=0.5, fy=0.3)
        ctx.restore()
    elif not photo:
        if ev.kind == 'wedding':
            rings(ctx, cx, cy, 120, prog(lt, 0.2, 1.8), lt)
        else:
            flower(ctx, cx, cy, 110, prog(lt, 0.1, 1.1), rot=0.3)
    ring = arc_pts(cx, cy, r + 16, math.pi / 2, math.pi / 2 + 2 * math.pi, 120)
    stroke_partial(ctx, [ring], ease_in_out(prog(lt, 0.3, 1.6)), 3, C.primary)
    ring2 = arc_pts(cx, cy, r + 30, -math.pi / 2, 3 * math.pi / 2, 120)
    stroke_partial(ctx, [ring2], ease_in_out(prog(lt, 0.5, 1.8)), 1.2, C.primary, 0.7)
    for sx in (1, -1):
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(sx, 1)
        bx, by = r * math.cos(0.95), r * math.sin(0.95)
        sprig(ctx, bx, by, -0.75, 190, prog(lt, 0.9, 2.3), side=-1, leaves=6, leaf_size=30)
        sprig(ctx, bx, by, 0.6, 150, prog(lt, 1.0, 2.4), side=1, leaves=5, leaf_size=28)
        flower(ctx, bx, by, 40, prog(lt, 1.0, 1.8), rot=0.5)
        flower(ctx, bx + 46, by - 30, 22, prog(lt, 1.2, 2.0), rot=1.5, light=True)
        ctx.restore()
    draw_text(ctx, '¡Te esperamos!', 540, 1090, 150, 'script', p=prog(lt, 0.9, 2.3), mode='wipe', accent=True,
              shine=0.2 + 0.6 * prog(lt, 1.8, 5.0))
    draw_text(ctx, ev.names_line().upper(), 540, 1200, 42, 'semibold', C.primary_text, prog(lt, 1.6, 2.7), 'letters',
              tracking=10, max_width=880)
    if ev.date:
        draw_text(ctx, f'{ev.date.day} · {ev.date.month:02d} · {ev.date.year}', 540, 1280, 52, 'serif', C.ink_soft,
                  prog(lt, 2.1, 2.9), tracking=4)
    flourish(ctx, 540, 1345, 170, prog(lt, 2.3, 3.2))
    rngh = random.Random(5)
    for k in range(9):
        st = 1.8 + k * 0.35
        x, size = rngh.uniform(180, 900), rngh.uniform(10, 18)
        u = (lt - st) / 3.2
        if 0 <= u <= 1:
            fill_pts(ctx, heart_pts(x + math.sin(lt * 2 + k) * 18, 1700 - u * 520, size),
                     C.flower_deep if k % 2 else C.flower, 0.8 * math.sin(math.pi * u))
    draw_text(ctx, 'Hecho con cariño en', 540, 1700, 34, 'italic', C.ink_soft, prog(lt, 2.8, 3.5))
    draw_text(ctx, 'Convite', 540, 1785, 78, 'script', C.primary_text, prog(lt, 3.0, 3.8))


# ---------------------------------------------------------------- línea de tiempo

OVERLAP = 0.2
CLOSING = 5.0


def timeline(ev):
    """Las escenas con datos, en orden: [(inicio, fin, escena)], y la duración total."""
    parts = [(6.6, scene_intro)]
    if ev.photos:
        parts.append((7.0, scene_photo))
    for hi, (key, groups) in enumerate(ev.honor):
        for pi, page in enumerate(chunk_groups(groups)):
            parts.append((5.2 + 0.6 * len(page), make_scene_honor(key, page, heart=hi == 0 and pi == 0)))
    if ev.date:
        parts.append((6.6, scene_date))
    for i in range(0, len(ev.venues), 2):
        parts.append((6.4, make_scene_venues(ev.venues[i:i + 2], first_page=i == 0)))
    parts.append((CLOSING, scene_closing))

    scenes, t = [], 0.0
    for duration, fn in parts:
        scenes.append((t, t + duration, fn))
        t += duration - OVERLAP
    total = round(scenes[-1][1], 2)
    return scenes, total
