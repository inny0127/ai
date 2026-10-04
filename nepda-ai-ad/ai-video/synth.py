# ElevenLabs 키가 없을 때 쓰는 임시 음악·효과음 합성 (numpy)
#   python3 synth.py '{"t0":[0,2.5,...],"end0":19,"total":24}'
import json, sys, os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, lfilter

SR = 48000
TL = json.loads(sys.argv[1])
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audio')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)

def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)

def note(f, dur, kind='pluck', vol=0.3):
    n = int(dur * SR); t = np.arange(n) / SR
    if kind == 'pluck':
        s = sum(np.sin(2 * np.pi * f * h * t) / h ** 1.3 for h in range(1, 7)) * env(n, 0.003, 0.16)
    elif kind == 'bell':
        s = (np.sin(2 * np.pi * f * t) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6)) * env(n, 0.002, 0.6)
    elif kind == 'bass':
        s = np.tanh(2.2 * np.sin(2 * np.pi * f * t)) * env(n, 0.005, 0.25)
    else:  # pad
        s = sum(np.sin(2 * np.pi * f * (1 + dt) * t) for dt in (-0.004, 0, 0.005)) / 3
        s *= np.minimum(1, t / 0.4) * np.minimum(1, (dur - t) / 0.3).clip(0)
    return s * vol

def kick(vol=0.9):
    n = int(0.35 * SR); t = np.arange(n) / SR
    f = 50 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * vol

def bp(x, lo, hi):
    b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)

def clap(vol=0.45):
    n = int(0.2 * SR); e = env(n, 0.001, 0.05)
    for k in (0.008, 0.017): e[int(k * SR):] += env(n - int(k * SR), 0.001, 0.04)
    return bp(rng.standard_normal(n), 900, 4000) * e * vol

def hat(vol=0.12):
    n = int(0.05 * SR); return bp(rng.standard_normal(n), 6000, 15000) * env(n, 0.001, 0.012) * vol

def put(buf, s, at):
    i = int(at * SR)
    if i >= len(buf): return
    s = s[:len(buf) - i]; buf[i:i + len(s)] += s if s.ndim == 2 else np.stack([s, s], 1)

def pan(s, p):
    return np.stack([s * (1 - p) ** 0.5, s * (1 + p) ** 0.5], 1) / 2 ** 0.5

midi = lambda m: 440 * 2 ** ((m - 69) / 12)

# --- BGM: 120BPM 경쾌한 플럭 → 지구 컷에서 우주 패드 → 엔드카드 드롭 + 4음 징글
total, end0, starts = TL['total'], TL['end0'], TL['t0']
earth0 = starts[-1]
bgm = np.zeros((int((total + 1.5) * SR), 2))
beat = 0.5
chords = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]  # C G Am F
t = 0.0; k = 0
while t < earth0 - 0.01:
    bar = int(t / 2) % 4; ch = chords[bar]
    lvl = 0.55 + 0.45 * t / earth0                                  # 컷마다 조금씩 커짐
    if k % 2 == 0: put(bgm, kick(0.75 * lvl), t)
    if k % 4 == 2: put(bgm, clap(0.4 * lvl), t)
    put(bgm, pan(hat(0.1 * lvl), 0.3), t + beat / 2)
    if k % 2 == 0: put(bgm, note(midi(ch[0] - 24), 0.45, 'bass', 0.32 * lvl), t)
    for j, m in enumerate(ch):
        put(bgm, pan(note(midi(m + 12), 0.35, 'pluck', 0.12 * lvl), (j - 1) * 0.5), t + (0.25 if k % 2 else 0) + j * 0.02)
    t += beat; k += 1
# 우주 컷 직전 라이저
rn = int(1.2 * SR); rt = np.arange(rn) / SR
riser = bp(rng.standard_normal(rn), 400, 9000) * (rt / 1.2) ** 2 * 0.25
put(bgm, riser, earth0 - 1.2)
# 우주: 저음 붐 + 넓은 패드
put(bgm, kick(1.0), earth0); put(bgm, note(36.7, 2.5, 'bass', 0.5), earth0)
for j, m in enumerate([48, 55, 60, 64, 67]):
    put(bgm, pan(note(midi(m), end0 - earth0 + 0.3, 'pad', 0.08), (j - 2) * 0.35), earth0)
# 엔드카드: 드롭
t = end0; k = 0
while t < total - 1.6:
    ch = chords[(k // 4) % 4]
    if k % 2 == 0: put(bgm, kick(0.95), t)
    if k % 4 == 2: put(bgm, clap(0.5), t)
    put(bgm, pan(hat(0.13), -0.3), t + beat / 2)
    put(bgm, note(midi(ch[0] - 24), 0.45, 'bass', 0.4), t)
    for j, m in enumerate(ch): put(bgm, pan(note(midi(m + 12), 0.4, 'pluck', 0.14), (j - 1) * 0.6), t + j * 0.015)
    t += beat; k += 1
# 4음 브랜드 징글
for j, m in enumerate([72, 76, 79, 84]):
    put(bgm, pan(note(midi(m), 1.6 if j == 3 else 0.5, 'bell', 0.3), (j - 1.5) * 0.3), total - 1.6 + j * 0.16)
bgm = bgm[:int(total * SR)]
bgm[-int(0.4 * SR):] *= np.linspace(1, 0, int(0.4 * SR))[:, None]

def save(name, s):
    s = s / max(1e-6, np.abs(s).max()) * 0.89
    wavfile.write(os.path.join(OUT, name), SR, (s * 32767).astype(np.int16))

save('synth_bgm.wav', bgm)
# 뾰옹↗ (컷마다 편집에서 음정을 올려 씀)
n = int(0.28 * SR); tt = np.arange(n) / SR
f = 380 * (1 + 1.6 * (tt / 0.28) ** 0.6)
save('synth_boing.wav', np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, 0.004, 0.12) * (1 + 0.3 * np.sin(2 * np.pi * 28 * tt)))
# 로고 쾅
n = int(1.2 * SR); tt = np.arange(n) / SR
slam = kick(1.0); slam = np.pad(slam, (0, n - len(slam)))
slam += bp(rng.standard_normal(n), 120, 5000) * np.exp(-tt * 7) * 0.5
save('synth_slam.wav', slam)
print('synth ok')
