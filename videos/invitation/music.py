"""Música instrumental para los videos sin canción: caja musical arpegiada sobre un fondo suave, en Python puro."""

import array
import math
import wave

SR = 44100
BAR = 60 / 72 * 4  # compás de 4/4 a 72 bpm

CHORDS = {'D': (50, (0, 4, 7)), 'A': (45, (0, 4, 7)), 'Bm': (47, (0, 3, 7)), 'G': (43, (0, 4, 7)),
          'Em': (52, (0, 3, 7))}
# (tiempo dentro del compás, nota midi)
MELODY = {
    'D': [(0, 78), (2, 76), (3, 74)], 'A': [(0, 73), (2, 76)], 'Bm': [(0, 74), (2, 78)],
    'G': [(0, 79), (2, 74), (3, 76)], 'Em': [(0, 79), (2, 76)],
}
CADENCE = ['Bm', 'G', 'Em', 'A', 'D']


def progression(bars):
    """I–V–vi–IV en ciclo, terminando con una cadencia que resuelve en el último compás."""
    if bars <= len(CADENCE):
        return CADENCE[-bars:]
    loop = ['D', 'A', 'Bm', 'G']
    body = [loop[i % 4] for i in range(bars - len(CADENCE))]
    return body + CADENCE


def wavetable(partials, size=4096):
    tab = array.array('d', [0.0] * size)
    for h, a in partials:
        for i in range(size):
            tab[i] += a * math.sin(2 * math.pi * h * i / size)
    peak = max(abs(v) for v in tab)
    return array.array('d', [v / peak for v in tab])


def synth(path, duration):
    n = int(SR * duration)
    buf = array.array('d', [0.0] * (n + SR * 12))
    bell = wavetable([(1, 1), (2, 0.32), (3, 0.14), (4, 0.06), (6, 0.03)])
    soft = wavetable([(1, 1), (2, 0.12), (3, 0.04)])
    size = len(bell)

    def note(start, midi, vel, decay):
        step = 440 * 2 ** ((midi - 69) / 12) * size / SR
        s0 = int(start * SR)
        env_k = math.exp(-1 / (decay * SR))
        env, ph, att = vel, 0.0, int(0.004 * SR)
        for i in range(int(decay * 4.5 * SR)):
            buf[s0 + i] += env * (i / att if i < att else 1.0) * bell[int(ph) & (size - 1)]
            ph += step
            env *= env_k

    def pad(start, midi, vel, dur):
        step = 440 * 2 ** ((midi - 69) / 12) * size / SR
        s0 = int(start * SR)
        att, rel_at, rel = 0.9 * SR, dur * SR, 1.2 * SR
        ph = 0.0
        for i in range(int((dur + 1.2) * SR)):
            a = min(1.0, i / att)
            if i > rel_at:
                a *= max(0.0, 1 - (i - rel_at) / rel)
            buf[s0 + i] += vel * a * soft[int(ph) & (size - 1)]
            ph += step

    bars = max(1, math.ceil(duration / BAR))
    eighth = BAR / 8
    chords = progression(bars)
    for bi, name in enumerate(chords):
        root, triad = CHORDS[name]
        t0 = bi * BAR
        last = bi == len(chords) - 1
        third = triad[1]
        pattern = [root, root + 7, root + 12, root + 12 + third, root + 19, root + 12 + third, root + 12, root + 7]
        for k, m in enumerate(pattern[:5] if last else pattern):
            note(t0 + k * eighth, m, 0.22 if k == 0 else 0.16, 0.7)
        hold = 2.5 if last else BAR
        for iv in triad:
            pad(t0, root + 12 + iv, 0.035, hold)
        pad(t0, root, 0.05, hold)
        if bi >= 2:
            if last:
                note(t0, 74, 0.32, 2.2)
                note(t0, 81, 0.18, 2.2)
            else:
                for beat, m in MELODY[name]:
                    note(t0 + beat * BAR / 4, m, 0.3, 1.3)

    # Eco sencillo, distinto en cada canal para dar amplitud
    left = array.array('d', buf[:n])
    right = array.array('d', buf[:n])
    for out, delays in ((left, (int(0.113 * SR), int(0.211 * SR))), (right, (int(0.157 * SR), int(0.263 * SR)))):
        for d in delays:
            for i in range(d, n):
                out[i] += 0.38 * out[i - d]
    peak = max(max(abs(v) for v in left), max(abs(v) for v in right)) or 1.0
    fade_out = int(2.5 * SR)
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
