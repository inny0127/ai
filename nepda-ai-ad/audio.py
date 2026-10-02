"""
배경음악/효과음을 numpy 로 직접 합성한다 (외부 음원 0% → 저작권 이슈 없음).
120 BPM, 영상 컷/임팩트 타이밍에 정확히 맞춘다.
"""
import wave

import numpy as np
from scipy.signal import butter, lfilter

SR = 44100
BPM = 120
BEAT = 60 / BPM
RNG = np.random.default_rng(42)


def _env(n, attack=0.002, decay=0.2):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-6), 0, 1)
    return a * np.exp(-t / decay)


def _filt(x, kind, f):
    if isinstance(f, (list, tuple)):
        b, a = butter(2, [f[0] / (SR / 2), f[1] / (SR / 2)], btype="band")
    else:
        b, a = butter(2, f / (SR / 2), btype=kind)
    return lfilter(b, a, x)


def _add(buf, x, t, gain=1.0):
    i = int(t * SR)
    if i >= len(buf):
        return
    x = x[: len(buf) - i]
    buf[i:i + len(x)] += x * gain


def kick(dur=0.35, f0=160, f1=45):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.04)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * _env(n, 0.001, 0.14) + 0.3 * RNG.standard_normal(n) * _env(n, 0.0005, 0.004)


def clap():
    n = int(0.25 * SR)
    noise = _filt(RNG.standard_normal(n), "band", (900, 4000))
    e = np.zeros(n)
    for k, o in enumerate([0, 0.011, 0.022]):
        i = int(o * SR)
        e[i:] += _env(n - i, 0.0005, 0.012 if k < 2 else 0.09)
    return noise * e * 0.9


def hat(open_=False):
    n = int((0.18 if open_ else 0.05) * SR)
    return _filt(RNG.standard_normal(n), "high", 7000) * _env(n, 0.0005, 0.06 if open_ else 0.015)


def saw(freq, dur, detune=0.006):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    for d in (-detune, 0, detune):
        out += 2 * ((t * freq * (1 + d)) % 1) - 1
    return out / 3


def bass_note(freq, dur):
    x = saw(freq, dur, 0.003) + 0.6 * np.sin(2 * np.pi * freq * np.arange(int(dur * SR)) / SR)
    return _filt(x, "low", 420) * _env(len(x), 0.004, dur * 0.6)


def stab(freqs, dur=0.35):
    x = sum(saw(f, dur) for f in freqs) / len(freqs)
    return _filt(x, "low", 3800) * _env(len(x), 0.003, 0.12)


def boom(dur=1.4):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 32 + 70 * np.exp(-t / 0.12)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * _env(n, 0.001, 0.5)
    nz = _filt(RNG.standard_normal(n), "low", 1800) * _env(n, 0.001, 0.18)
    return np.tanh(1.8 * (sub + 0.7 * nz))


def crash(dur=1.6):
    n = int(dur * SR)
    return _filt(RNG.standard_normal(n), "high", 4500) * _env(n, 0.001, 0.5) * 0.5


def snap():
    n = int(0.12 * SR)
    return _filt(RNG.standard_normal(n), "band", (1200, 6000)) * _env(n, 0.0005, 0.03)


def whoosh(dur, up=True):
    n = int(dur * SR)
    x = RNG.standard_normal(n)
    out = np.zeros(n)
    seg = 512
    for i in range(0, n, seg):
        p = i / n if up else 1 - i / n
        fc = 300 + 7000 * p ** 2
        out[i:i + seg] = _filt(x[max(0, i - 2048):i + seg], "band", (fc * 0.7, min(fc * 1.4, 20000)))[-len(out[i:i + seg]):]
    amp = np.linspace(0, 1, n) ** 2 if up else np.linspace(1, 0, n) ** 2
    return out * amp


def tick(freq):
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * t) * _env(n, 0.0005, 0.012)


def blip(f0, f1, dur=0.12):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = f0 + (f1 - f0) * (t / dur)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * _env(n, 0.001, 0.07)


def ting(freq):
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * freq * t) + 0.4 * np.sin(2 * np.pi * freq * 2.76 * t)) * _env(n, 0.001, 0.09)


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 180 * (8 ** (t / dur))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return (0.5 * tone + 0.8 * whoosh(dur, True)) * (t / dur) ** 1.5


def pad(freqs, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * f * t) for f in freqs) / len(freqs)
    trem = 0.75 + 0.25 * np.sin(2 * np.pi * 4 * t)
    return x * trem * np.clip(t / 0.4, 0, 1)


NOTE = {"A1": 55.0, "F1": 43.65, "C2": 65.41, "G1": 49.0,
        "A3": 220.0, "C4": 261.63, "E4": 329.63, "F3": 174.61, "G3": 196.0, "B3": 246.94, "D4": 293.66}
CHORDS = [("A1", ["A3", "C4", "E4"]), ("F1", ["F3", "A3", "C4"]), ("C2", ["G3", "C4", "E4"]), ("G1", ["G3", "B3", "D4"])]


def build_audio(path, dur):
    music = np.zeros(int(dur * SR) + SR)
    sfx = np.zeros_like(music)

    # --- 0~3s 훅: 시계 초침(고민) + 낮은 패드 + 라이저
    for i in range(6):
        _add(sfx, tick(1900 if i % 2 == 0 else 1400), i * BEAT, 0.5)
    _add(music, pad([110, 164.8], 2.95), 0.0, 0.18)
    _add(sfx, riser(1.1), 1.85, 0.45)

    # --- 3~19s 그루브 (120 BPM, 1마디 = 2초, Am-F-C-G)
    start, end = 3.0, 19.0
    b = 0
    t = start
    while t < end - 1e-6:
        bar = int((t - start) / (4 * BEAT))
        root, chord = CHORDS[bar % 4]
        beat_in_bar = b % 4
        light = 5.5 <= t < 6.5  # 네이버플러스 등장~압축 구간은 살짝 비움
        _add(music, kick(), t, 0.95)
        if beat_in_bar in (1, 3):
            _add(music, clap(), t, 0.55)
        if not light:
            _add(music, hat(), t + BEAT / 2, 0.35)
            _add(music, hat(), t + BEAT * 0.75, 0.15)
        for k in range(2):  # 8분음표 베이스 (옥타브 펌핑)
            f = NOTE[root] * (2 if k == 1 else 1)
            _add(music, bass_note(f, BEAT / 2 * 0.95), t + k * BEAT / 2, 0.55)
        if beat_in_bar == 0 and t >= 8.0:
            _add(music, stab([NOTE[n] * 2 for n in chord], 0.3), t, 0.22)
            _add(music, stab([NOTE[n] * 2 for n in chord], 0.2), t + BEAT * 1.5, 0.16)
        b += 1
        t = start + b * BEAT

    # --- 임팩트 / 효과음 (영상 HITS 와 동일한 타이밍)
    _add(sfx, boom(), 3.0, 0.9)
    _add(sfx, crash(), 3.0, 0.6)
    for h in (4.0, 4.5):
        _add(sfx, snap(), h, 0.7)
        _add(sfx, stab([NOTE["A3"] * 2, NOTE["C4"] * 2, NOTE["E4"] * 2], 0.25), h, 0.3)
    _add(sfx, snap(), 5.5, 0.7)
    _add(sfx, whoosh(0.5, True), 5.95, 0.5)  # 네이버플러스 → 넾 압축
    _add(sfx, blip(1400, 300, 0.18), 6.42, 0.45)
    for h, f in ((6.5, 440), (7.0, 554), (7.5, 659)):
        _add(sfx, kick(0.3, 200, 60), h, 0.6)
        _add(sfx, snap(), h, 0.7)
        _add(sfx, stab([f, f * 1.5], 0.22), h, 0.25)
    _add(sfx, whoosh(0.4, True), 7.6, 0.4)
    _add(sfx, boom(1.2), 8.0, 0.75)
    _add(sfx, crash(), 8.0, 0.55)
    for i, h in enumerate((10.0, 10.5, 11.0, 11.5, 12.0)):
        _add(sfx, blip(500 + i * 120, 1300 + i * 200), h, 0.45)
    _add(sfx, riser(0.45), 12.05, 0.35)
    _add(sfx, boom(1.3), 12.5, 0.8)
    _add(sfx, crash(), 12.5, 0.55)
    _add(sfx, snap(), 12.85, 0.6)
    rng = np.random.default_rng(5)
    for k in range(22):  # 쿠폰/혜택 쏟아지는 '띠링'
        _add(sfx, ting(rng.choice([1760, 2093, 2349, 2637, 3136])), 12.5 + rng.uniform(0, 2.2), 0.16)
    _add(sfx, whoosh(0.35, True), 14.62, 0.4)
    _add(sfx, boom(1.0), 15.0, 0.6)
    _add(sfx, crash(), 15.0, 0.45)
    _add(sfx, blip(700, 1600), 15.6, 0.35)
    _add(sfx, blip(600, 1200), 16.0, 0.35)
    _add(sfx, ting(2637), 16.4, 0.3)
    _add(sfx, ting(3136), 16.55, 0.3)
    # 엔딩 코드 (A sus → A)
    end_chord = sum(saw(f, 1.0) for f in (220, 277.18, 329.63, 440)) / 4
    end_chord = _filt(end_chord, "low", 2600) * _env(len(end_chord), 0.004, 0.45)
    _add(music, end_chord, 19.0, 0.4)
    _add(music, kick(), 19.0, 0.9)
    _add(sfx, crash(1.0), 19.0, 0.35)

    # 사이드체인 느낌: 킥마다 음악을 살짝 눌러 펌핑
    n = len(music)
    duck = np.ones(n)
    tt = 3.0
    while tt < 19.0:
        i = int(tt * SR)
        L = int(0.22 * SR)
        duck[i:i + L] = np.minimum(duck[i:i + L], 0.55 + 0.45 * np.linspace(0, 1, L) ** 0.6)
        tt += BEAT
    mix = music * duck * 0.8 + sfx

    mix = mix[: int(dur * SR)]
    fade = int(0.25 * SR)
    mix[-fade:] *= np.linspace(1, 0, fade)
    mix = np.tanh(1.2 * mix / (np.max(np.abs(mix)) + 1e-9))
    mix = mix / np.max(np.abs(mix)) * 0.89  # 약 -1 dBFS
    pcm = (mix * 32767).astype(np.int16)
    stereo = np.stack([pcm, pcm], axis=1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(stereo.tobytes())
    return path
