# 「그것이 온다」 사운드 디자인 합성: 거대한 발소리(쿵), 브아아암, 긴장 드론, 정적, 뾰옹, 엔드 징글
#   python3 synth.py '<json>'  →  audio/comes_sfx.wav
import json, sys, os
import numpy as np
from scipy.io import wavfile
from scipy.signal import butter, sosfilt, fftconvolve

SR = 48000
C = json.loads(sys.argv[1])
OUT = sys.argv[2] if len(sys.argv) > 2 else os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audio')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(11)
total, end0 = C['total'], C['end0']
N = int((total + 0.5) * SR)
mix = np.zeros((N, 2))

def lp(x, f, o=4): return sosfilt(butter(o, f / (SR / 2), 'low', output='sos'), x)
def hp(x, f, o=2): return sosfilt(butter(o, f / (SR / 2), 'high', output='sos'), x)
def bp(x, a, b): return sosfilt(butter(2, [a / (SR / 2), b / (SR / 2)], 'band', output='sos'), x)
def tt(d): return np.arange(int(d * SR)) / SR
def st(x, w=0.0): return np.stack([x * (1 - w), x * (1 + w)], 1)
def put(x, at, g=1.0):
    i = int(at * SR)
    if i >= N: return
    if x.ndim == 1: x = st(x)
    x = x[:N - i]; mix[i:i + len(x)] += x * g

# 큰 공간 잔향 (도시에 울리는 느낌)
ir_t = tt(2.6); IR = rng.standard_normal(len(ir_t)) * np.exp(-ir_t / 0.7); IR = lp(IR, 3000); IR /= np.abs(IR).sum() / 40
def verb(x, wet=0.35): y = fftconvolve(x, IR)[:len(x) + len(IR) - 1]; x = np.pad(x, (0, len(y) - len(x))); return x * (1 - wet) + y * wet

def thump(g=1.0):
    t = tt(2.2)
    f = 34 + 40 * np.exp(-t * 14)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 2.2)
    body = np.sin(2 * np.pi * 72 * t) * np.exp(-t * 7) * 0.5
    crack = lp(rng.standard_normal(len(t)), 900) * np.exp(-t * 9) * 0.6
    debris = bp(rng.standard_normal(len(t)), 1500, 6000) * np.exp(-(t - 0.25).clip(0) * 4) * (t > 0.2) * 0.08
    x = np.tanh((sub + body + crack) * 1.8) * 0.8 + debris
    return verb(x, 0.3) * g

def braam(g=1.0, d=3.2):
    t = tt(d)
    x = np.zeros(len(t))
    for f0 in (55, 55 * 1.498, 110, 110 * 1.189):
        for det in (-0.25, 0, 0.3):
            ph = 2 * np.pi * (f0 + det) * t
            x += 2 * ((ph / (2 * np.pi)) % 1) - 1
    x /= 12
    env = np.minimum(1, t / 0.08) * np.exp(-t / 1.6)
    lo, hi = lp(x, 350), lp(x, 2600)
    y = lo + (hi - lo) * np.exp(-t / 0.45)          # 처음엔 밝게 찢어지다 어둡게 가라앉음
    y = np.tanh(y * 3) * env
    return verb(y + thump(0.6)[:len(y)] * 0.6, 0.35) * g

def boing(g=1.0):
    t = tt(0.45); f = 300 * (1 + 2.2 * (t / 0.45) ** 0.5)
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, t / 0.005) * np.exp(-t * 7) * (1 + 0.35 * np.sin(2 * np.pi * 24 * t))
    return x * 0.7 * g

def bell(f, d=1.4):
    t = tt(d); return (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 5)) * np.exp(-t * 2.2) * np.minimum(1, t / 0.003)

def meteor(g=1.0):
    # 대기권 진입: 멀리서 다가오는 굉음 + 쉬이익 (도플러처럼 음높이가 올라감)
    t = tt(2.4); n = rng.standard_normal(len(t))
    roar = lp(n, 500) * (t / 2.4) ** 1.5
    hiss = bp(n, 2000, 7000) * np.minimum(1, t / 1.2) * 0.25
    tone = np.sin(2 * np.pi * np.cumsum(60 + 140 * (t / 2.4) ** 2) / SR) * (t / 2.4) * 0.5
    x = (roar * 1.4 + hiss + tone) * np.minimum(1, (2.4 - t) / 0.05)
    return verb(np.tanh(x * 1.5), 0.25) * g

def kick(v=0.9):
    t = tt(0.35); f = 50 + 110 * np.exp(-t * 28)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9) * v
def clap(v=0.4):
    t = tt(0.2); e = np.exp(-t / 0.05) * np.minimum(1, t / 0.001)
    return bp(rng.standard_normal(len(t)), 900, 4000) * e * v
def pluck(f, d=0.35, v=0.12):
    t = tt(d); return sum(np.sin(2 * np.pi * f * h * t) / h ** 1.3 for h in range(1, 7)) * np.exp(-t / 0.16) * np.minimum(1, t / 0.003) * v

# 신나는 비트 (선물 파도 공개부터 엔드카드까지)
if C.get('music'):
    m0 = C['music']['start']; beat = 60 / C['music'].get('bpm', 124)
    midi = lambda m: 440 * 2 ** ((m - 69) / 12)
    chords = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]
    t0, k = m0, 0
    while t0 < total - 1.8:
        ch = chords[(k // 4) % 4]
        if k % 2 == 0: put(kick(0.8), t0)
        if k % 4 == 2: put(clap(0.45), t0)
        put(st(bp(rng.standard_normal(int(0.04 * SR)), 6000, 15000) * 0.08, 0.3), t0 + beat / 2)
        put(st(np.tanh(2 * np.sin(2 * np.pi * midi(ch[0] - 24) * tt(0.4))) * np.exp(-tt(0.4) / 0.25) * 0.3), t0)
        for j, mm in enumerate(ch): put(st(pluck(midi(mm + 12)), (j - 1) * 0.5), t0 + (beat / 2 if k % 2 else 0) + j * 0.015)
        t0 += beat; k += 1

# 긴장 드론: 서서히 커지다 지정 시각에 뚝
a, b = C['drone'] if C.get('drone') else (0, 0.01)
t = tt(b - a)
dr = sum(np.sin(2 * np.pi * f * t + p) for f, p in ((41, 0), (41.6, 1), (61.7, 2), (82.4, .5))) / 4
dr += lp(rng.standard_normal(len(t)), 220) * 0.6
dr *= (0.25 + 0.75 * (t / (b - a)) ** 1.2) * 0.45 * np.minimum(1, (b - a - t) / 0.03)
put(st(dr, 0.1), a)

# 첫 '쿵' 직후 귀가 먹먹해지는 이명 (영화식 충격 표현)
if C['events']:
    t = tt(2.6); ring = np.sin(2 * np.pi * 3150 * t) * np.minimum(1, t / 0.15) * np.exp(-t / 0.9) * 0.05
    put(st(ring, 0.3), C['events'][0]['t'] + 0.25)

for e in C['events']:
    k, g, at = e['type'], e.get('gain', 1), e['t']
    put({'thump': thump, 'braam': braam, 'boing': boing, 'meteor': meteor}[k](g), at)

# 엔드카드: 따뜻한 화음 + 4음 징글
t = tt(total - end0)
pad = sum(np.sin(2 * np.pi * f * t) for f in (261.6, 329.6, 392.0, 523.3)) / 4 * np.minimum(1, t / 0.05) * np.exp(-t / 2.5) * 0.25
put(st(pad, 0.2), end0)
for j, f in enumerate((523.3, 659.3, 784.0, 1046.5)):
    put(st(bell(f, 1.8 if j == 3 else 0.7) * 0.32, (j - 1.5) * 0.25), end0 + 1.1 + j * 0.17)

# 정적 구간은 완전히 무음 (앞 소리 잔향도 잘라냄)
for s0, s1 in C.get('silence', []):
    i0, i1 = int(s0 * SR), int(s1 * SR); fade = int(0.04 * SR)
    mix[i0:i0 + fade] *= np.linspace(1, 0, fade)[:, None]; mix[i0 + fade:i1] = 0
mix = mix[:int(total * SR)]
mix[-int(0.3 * SR):] *= np.linspace(1, 0, int(0.3 * SR))[:, None]
mix = mix / max(1e-6, np.abs(mix).max()) * 0.92
os.makedirs(OUT, exist_ok=True)
wavfile.write(os.path.join(OUT, 'comes_sfx.wav'), SR, (mix * 32767).astype(np.int16))
print('sfx ok', round(total, 2), 's')
