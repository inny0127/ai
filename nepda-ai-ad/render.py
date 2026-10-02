"""
넾다세일 AI 광고제 출품작 — "장바구니 폭발" (9:16, 20초)

Claude(생성형 AI)가 콘셉트·카피·디자인·모션·사운드를 코드로 생성한 영상.
공식 키비주얼(KV 가이드.psd)의 로고/배너/컬러를 그대로 사용한다.

사용법:  python3 render.py            -> out/nepda_ai_ad_9x16.mp4
         python3 render.py --stills   -> out/stills/*.png (스토리보드용 정지컷)
"""
import math
import os
import random
import subprocess
import sys
from functools import lru_cache

import aggdraw
import numpy as np
from PIL import Image, ImageDraw, ImageFont

from audio import build_audio

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "assets")
OUT = os.path.join(HERE, "out")

W, H = 1080, 1920
FPS = 30
DUR = 20.0
CX, CY = W // 2, H // 2

# KV 가이드 컬러
WHITE = (255, 255, 255)
GREEN = (0, 245, 80)      # #00F550
PURPLE = (145, 98, 255)   # #9162FF
BLACK = (0, 0, 0)
DARK = (34, 34, 34)       # KV 가이드 배경 #222222

F_BHS = os.path.join(ASSETS, "fonts", "BlackHanSans.ttf")
F_PB = os.path.join(ASSETS, "fonts", "Pretendard-Black.otf")
F_PXB = os.path.join(ASSETS, "fonts", "Pretendard-ExtraBold.otf")
F_PSB = os.path.join(ASSETS, "fonts", "Pretendard-SemiBold.otf")


# ---------------------------------------------------------------- easing
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def prog(t, t0, t1):
    return clamp((t - t0) / (t1 - t0))


def ease_out_cubic(x):
    return 1 - (1 - x) ** 3


def ease_in_cubic(x):
    return x ** 3


def ease_in_out(x):
    return 3 * x * x - 2 * x * x * x


def ease_out_back(x, s=2.2):
    x -= 1
    return x * x * ((s + 1) * x + s) + 1


def slam(t, t0, dur=0.22, start=2.4):
    """도장 찍듯 크게 -> 1.0 으로 꽂히는 스케일."""
    p = prog(t, t0, t0 + dur)
    if p <= 0:
        return 0.0
    return start + (1 - start) * ease_out_cubic(p) - 0.08 * math.sin(p * math.pi) * (p < 1)


def pop(t, t0, dur=0.3):
    p = prog(t, t0, t0 + dur)
    return 0.0 if p <= 0 else ease_out_back(p)


# ---------------------------------------------------------------- assets
def load_rgba(name):
    return Image.open(os.path.join(ASSETS, name)).convert("RGBA")


LOGO = load_rgba("logo_hi.png")            # 4224x1280 (공식 로고 벡터 렌더)
NEOP = load_rgba("glyph_neop.png")          # 로고 중 '넾'
DA = load_rgba("glyph_da.png")              # 로고 중 '다'
SEIL = load_rgba("glyph_seil.png")          # 로고 중 '세일'
# 로고 좌표계에서 각 조각의 좌상단 위치
NEOP_OFF, DA_OFF, SEIL_OFF = (0, 47), (1212, 208), (2117, 0)
KV = load_rgba("kv_banner.png")             # 공식 KV 배너 2185x617


@lru_cache(maxsize=None)
def font(path, size):
    return ImageFont.truetype(path, size)


@lru_cache(maxsize=256)
def text_img(s, path, size, fill=BLACK, stroke=0, stroke_fill=WHITE, tracking=0):
    f = font(path, size)
    pad = stroke + 20
    if tracking:
        widths = [f.getbbox(ch)[2] - f.getbbox(ch)[0] if ch != " " else size // 3 for ch in s]
        tw = sum(widths) + tracking * (len(s) - 1)
    else:
        bb = f.getbbox(s, stroke_width=stroke)
        tw = bb[2] - bb[0]
    th = int(size * 1.45)
    img = Image.new("RGBA", (tw + pad * 2, th + pad * 2), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    if tracking:
        x = pad
        for ch, w in zip(s, widths):
            bb = f.getbbox(ch)
            d.text((x - bb[0], pad), ch, font=f, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)
            x += w + tracking
    else:
        bb = f.getbbox(s, stroke_width=stroke)
        d.text((pad - bb[0], pad), s, font=f, fill=fill, stroke_width=stroke, stroke_fill=stroke_fill)
    return img.crop(img.getbbox())


def place(canvas, img, cx, cy, scale=1.0, rot=0.0, alpha=1.0, sx=None):
    """img 를 (cx,cy) 중심에 스케일/회전/알파 적용해 합성."""
    if scale <= 0.001 or alpha <= 0.001:
        return
    sxv = scale if sx is None else sx
    w = max(1, int(img.width * sxv))
    h = max(1, int(img.height * scale))
    im = img.resize((w, h), Image.LANCZOS if scale < 1 else Image.BICUBIC)
    if rot:
        im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
    if alpha < 1:
        a = im.getchannel("A").point(lambda v: int(v * alpha))
        im.putalpha(a)
    x = int(cx - im.width / 2)
    y = int(cy - im.height / 2)
    # alpha_composite 는 음수 좌표를 허용하지 않으므로 잘라서 붙인다
    sx0, sy0 = max(0, -x), max(0, -y)
    ex, ey = min(im.width, canvas.width - x), min(im.height, canvas.height - y)
    if ex <= sx0 or ey <= sy0:
        return
    canvas.alpha_composite(im.crop((sx0, sy0, ex, ey)), (x + sx0, y + sy0))


# ---------------------------------------------------------------- shapes
def poly(d, pts, fill=None, outline=None, width=0):
    flat = [c for p in pts for c in p]
    pen = aggdraw.Pen(outline, width) if outline and width else None
    brush = aggdraw.Brush(fill) if fill else None
    d.polygon(flat, pen, brush) if pen else d.polygon(flat, brush)


def circle_pts(cx, cy, r, n=48, rx=None):
    rx = r if rx is None else rx
    return [(cx + rx * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n)) for i in range(n)]


def rrect_pts(x0, y0, x1, y1, r, n=8):
    pts = []
    for (cx, cy, a0) in [(x1 - r, y0 + r, -90), (x1 - r, y1 - r, 0), (x0 + r, y1 - r, 90), (x0 + r, y0 + r, 180)]:
        for i in range(n + 1):
            a = math.radians(a0 + 90 * i / n)
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    return pts


SPIKE_RNG = random.Random(7)
SPIKES = []
for i in range(14):
    SPIKES.append(dict(
        ang=i * 360 / 14 + SPIKE_RNG.uniform(-8, 8),
        half=SPIKE_RNG.uniform(5.5, 9.5),
        tip=SPIKE_RNG.uniform(0.0, 0.35),
        color=[GREEN, PURPLE, BLACK][i % 3] if i % 3 != 2 else (GREEN if i % 2 else PURPLE),
        notch=SPIKE_RNG.uniform(0.35, 0.6),
    ))


def burst_bg(canvas, t, cx=CX, cy=CY, base=WHITE, inner=360, intro=None, rot_speed=6.0, colors=(GREEN, PURPLE)):
    """KV 스타일 '폭발' 배경: 화면 바깥에서 중심을 향해 꽂히는 번개형 스파이크 + 검정 외곽선."""
    d = aggdraw.Draw(canvas)
    poly(d, [(0, 0), (W, 0), (W, H), (0, H)], fill=base)
    k = 1.0 if intro is None else ease_out_cubic(prog(t, intro, intro + 0.35))
    breathe = 1 + 0.04 * math.sin(t * 2 * math.pi * 2)  # 120bpm 에 맞춰 숨쉬기
    R = 1700
    for i, s in enumerate(SPIKES):
        a = math.radians(s["ang"] + t * rot_speed)
        hw = math.radians(s["half"])
        r_tip = inner * (1 + s["tip"]) * breathe
        r_tip = R - (R - r_tip) * k
        col = colors[i % len(colors)]

        def P(r, ang):
            return (cx + r * math.cos(ang), cy + r * math.sin(ang))

        # 번개처럼 한 번 꺾인 스파이크
        rn = r_tip + (R - r_tip) * s["notch"]
        outer = [P(r_tip - 30, a), P(R, a - hw - 0.05), P(rn, a - hw * 0.15), P(R, a + hw + 0.05)]
        shape = [P(r_tip, a), P(R, a - hw), P(rn + 40, a - hw * 0.05), P(R, a + hw)]
        poly(d, outer, fill=BLACK)
        poly(d, shape, fill=col)
    d.flush()


def halftone(canvas, color=(255, 255, 255), alpha=22, step=36, phase=0.0):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = aggdraw.Draw(layer)
    b = aggdraw.Brush(color + (alpha,))
    for y in range(0, H + step, step):
        for x in range(0, W + step, step):
            off = step / 2 if (y // step) % 2 else 0
            r = 3 + 5 * (y / H)
            d.ellipse((x + off - r, y - r + phase, x + off + r, y + r + phase), b)
    d.flush()
    canvas.alpha_composite(layer)


# ---------------------------------------------------------------- icons
@lru_cache(maxsize=None)
def icon(kind, size=360):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = aggdraw.Draw(im)
    s = size / 100.0
    k = 4.2 * s  # 외곽선 두께
    S = lambda pts: [(x * s, y * s) for x, y in pts]

    if kind == "shirt":
        pts = S([(30, 12), (42, 12), (50, 20), (58, 12), (70, 12), (92, 30), (82, 44), (72, 38), (72, 90), (28, 90), (28, 38), (18, 44), (8, 30)])
        poly(d, pts, fill=PURPLE, outline=BLACK, width=k)
        poly(d, S([(42, 12), (50, 24), (58, 12)]), fill=WHITE, outline=BLACK, width=k * 0.7)
    elif kind == "lipstick":
        poly(d, S([(34, 52), (66, 52), (66, 92), (34, 92)]), fill=BLACK, outline=BLACK, width=k)
        poly(d, S([(38, 52), (62, 52), (62, 36), (38, 36)]), fill=WHITE, outline=BLACK, width=k)
        poly(d, S([(41, 36), (59, 36), (59, 14), (41, 24)]), fill=PURPLE, outline=BLACK, width=k)
        poly(d, S([(38, 66), (62, 66), (62, 70), (38, 70)]), fill=GREEN)
    elif kind == "phone":
        poly(d, [(x * s, y * s) for x, y in rrect_pts(26, 6, 74, 94, 9)], fill=BLACK, outline=BLACK, width=k)
        poly(d, [(x * s, y * s) for x, y in rrect_pts(31, 14, 69, 84, 3)], fill=GREEN)
        poly(d, [(x * s, y * s) for x, y in circle_pts(50, 89, 2.4)], fill=WHITE)
        poly(d, S([(40, 40), (60, 50), (40, 60)]), fill=WHITE, outline=BLACK, width=k * 0.6)
    elif kind == "mug":
        poly(d, [(x * s, y * s) for x, y in circle_pts(70, 54, 15, rx=14)], fill=None, outline=BLACK, width=k * 2.1)
        poly(d, S([(18, 28), (72, 28), (68, 90), (22, 90)]), fill=WHITE, outline=BLACK, width=k)
        poly(d, S([(21, 46), (70, 46), (69, 60), (22, 60)]), fill=PURPLE)
        for i in range(3):
            x = 32 + i * 13
            poly(d, S([(x, 22), (x + 4, 22), (x + 7, 8), (x + 3, 8)]), fill=BLACK)
    elif kind == "apple":
        poly(d, [(x * s, y * s) for x, y in circle_pts(50, 58, 34, rx=37)], fill=GREEN, outline=BLACK, width=k)
        poly(d, S([(48, 26), (53, 26), (56, 8), (51, 8)]), fill=BLACK)
        poly(d, S([(56, 22), (72, 10), (80, 16), (64, 26)]), fill=PURPLE, outline=BLACK, width=k * 0.7)
        poly(d, [(x * s, y * s) for x, y in circle_pts(36, 46, 6, rx=5)], fill=WHITE)
    elif kind == "coupon":
        pts = S([(6, 26), (94, 26), (94, 42), (88, 50), (94, 58), (94, 74), (6, 74), (6, 58), (12, 50), (6, 42)])
        poly(d, pts, fill=PURPLE, outline=BLACK, width=k)
        for i in range(5):
            y = 31 + i * 9
            poly(d, S([(68, y), (70, y), (70, y + 5), (68, y + 5)]), fill=WHITE)
    elif kind == "gift":
        poly(d, S([(14, 40), (86, 40), (86, 92), (14, 92)]), fill=GREEN, outline=BLACK, width=k)
        poly(d, S([(8, 28), (92, 28), (92, 44), (8, 44)]), fill=GREEN, outline=BLACK, width=k)
        poly(d, S([(43, 28), (57, 28), (57, 92), (43, 92)]), fill=PURPLE, outline=BLACK, width=k * 0.7)
        poly(d, S([(50, 28), (30, 8), (22, 18), (34, 28)]), fill=PURPLE, outline=BLACK, width=k * 0.7)
        poly(d, S([(50, 28), (70, 8), (78, 18), (66, 28)]), fill=PURPLE, outline=BLACK, width=k * 0.7)
    elif kind == "bag":
        poly(d, [(x * s, y * s) for x, y in circle_pts(50, 34, 18, rx=16)], fill=None, outline=BLACK, width=k * 1.6)
        poly(d, S([(16, 34), (84, 34), (90, 92), (10, 92)]), fill=WHITE, outline=BLACK, width=k)
        poly(d, S([(16, 34), (84, 34), (85, 44), (15, 44)]), fill=PURPLE)
    elif kind == "tag":
        pts = S([(30, 10), (90, 10), (90, 70), (50, 92), (10, 70), (10, 30)])
        poly(d, S([(10, 30), (30, 10), (90, 10), (90, 70), (70, 90), (10, 90)]), fill=GREEN, outline=BLACK, width=k)
        poly(d, [(x * s, y * s) for x, y in circle_pts(26, 26, 6)], fill=WHITE, outline=BLACK, width=k * 0.6)
    elif kind == "cart":
        # 장바구니 카트
        poly(d, S([(4, 14), (18, 14), (24, 24), (94, 24), (84, 62), (30, 62), (32, 70), (86, 70), (86, 78), (26, 78), (14, 22), (4, 22)]),
             fill=WHITE, outline=WHITE, width=k * 0.4)
        poly(d, [(x * s, y * s) for x, y in circle_pts(34, 88, 7)], fill=WHITE)
        poly(d, [(x * s, y * s) for x, y in circle_pts(78, 88, 7)], fill=WHITE)
    d.flush()

    # 텍스트 장식
    dr = ImageDraw.Draw(im)
    if kind == "coupon":
        f = font(F_BHS, int(30 * s))
        dr.text((35 * s, 50 * s), "%", font=f, fill=WHITE, anchor="mm", stroke_width=int(2 * s), stroke_fill=BLACK)
    if kind == "tag":
        f = font(F_BHS, int(17 * s))
        dr.text((52 * s, 58 * s), "SALE", font=f, fill=BLACK, anchor="mm")
    return im


# ---------------------------------------------------------------- scenes
def shake_offset(t, hits, amp=26, decay=0.25):
    dx = dy = 0.0
    for h in hits:
        if h <= t < h + decay:
            p = (t - h) / decay
            a = amp * (1 - p) ** 2
            dx += a * math.sin(t * 173.0 + h)
            dy += a * math.cos(t * 211.0 + h * 3)
    return dx, dy


HITS = [3.0, 4.0, 4.5, 6.5, 7.0, 7.5, 8.0, 12.5, 15.0]


def scene_hook(c, t):
    """0~3s: 장바구니에 담아만 두고 고민 중?"""
    d = aggdraw.Draw(c)
    poly(d, [(0, 0), (W, 0), (W, H), (0, H)], fill=(17, 17, 17))
    d.flush()
    halftone(c, alpha=14, phase=(t * 30) % 36)

    # 카트 + 담긴 물건들 (고민하는 듯 좌우로 흔들림)
    wob = math.sin(t * 2 * math.pi * 1.0) * 6 * (1 + t)
    cy = 640
    items = [("shirt", -150, -70, 210, -12), ("phone", 0, -100, 200, 6), ("gift", 150, -60, 200, 10)]
    for i, (k, ox, oy, sz, r) in enumerate(items):
        tt = 0.15 + i * 0.12
        sc = pop(t, tt, 0.35)
        bob = math.sin(t * 6 + i) * 8
        place(c, icon(k), CX + ox + wob * 0.6, cy + oy - 40 + bob, scale=sc * sz / 360, rot=r + wob * 0.5)
    place(c, icon("cart", 520), CX + 30, cy + 120, scale=pop(t, 0.0, 0.35), rot=wob * 0.4)

    # 카피
    lines = [("장바구니에", WHITE, 0.45), ("담아만 두고", GREEN, 0.75), ("아직 고민 중?", WHITE, 1.15)]
    for i, (s, col, t0) in enumerate(lines):
        p = ease_out_cubic(prog(t, t0, t0 + 0.25))
        if p <= 0:
            continue
        img = text_img(s, F_PB, 118, fill=col)
        place(c, img, CX, 1130 + i * 165 + (1 - p) * 60, alpha=p)

    # '고민' 표시: 물음표가 점점 많아짐
    qs = int(clamp((t - 1.6) / 0.25, 0, 5))
    rng = random.Random(3)
    for i in range(qs):
        x = rng.randint(140, 940)
        y = rng.randint(220, 420)
        place(c, text_img("?", F_BHS, 150, fill=PURPLE if i % 2 else GREEN), x, y,
              scale=pop(t, 1.6 + i * 0.25, 0.25), rot=rng.uniform(-25, 25))

    # 장면 전환 직전 화이트 플래시
    if t > 2.85:
        f = prog(t, 2.85, 3.0)
        c.alpha_composite(Image.new("RGBA", (W, H), (255, 255, 255, int(255 * f))))


def scene_boom(c, t):
    """3~5.5s: 쾅! 거대한 혜택이 찾아온다!"""
    burst_bg(c, t, intro=3.0, inner=420)
    # 쾅!
    if t < 4.0:
        sc = slam(t, 3.0, 0.2, 3.0)
        a = 1 - prog(t, 3.75, 4.0)
        place(c, text_img("쾅!", F_BHS, 380, fill=WHITE, stroke=22, stroke_fill=BLACK), CX, CY, scale=sc, rot=-8, alpha=a)
    else:
        g = slam(t, 4.0, 0.22, 2.6)
        place(c, text_img("거대한", F_BHS, 300, fill=BLACK, stroke=16, stroke_fill=WHITE), CX, CY - 150,
              scale=g * (1 + 0.05 * prog(t, 4.2, 5.5)), rot=-4)
        h = slam(t, 4.5, 0.22, 2.6)
        sub = text_img("혜택이 찾아온다!", F_BHS, 130, fill=WHITE)
        band = Image.new("RGBA", (sub.width + 90, sub.height + 60), BLACK + (255,))
        band.alpha_composite(sub, (45, 30))
        place(c, band, CX, CY + 140, scale=h, rot=-4)
    if t < 3.08:  # 임팩트 플래시
        c.alpha_composite(Image.new("RGBA", (W, H), (255, 255, 255, int(255 * (1 - prog(t, 3.0, 3.08))))))


def logo_parts(cx, cy, width):
    """'넾' / '다' / '세일' 조각을 공식 로고와 똑같이 맞물리게 놓기 위한 중심 좌표."""
    s = width / LOGO.width
    x0 = cx - LOGO.width * s / 2
    y0 = cy - LOGO.height * s / 2
    centers = [(x0 + (o[0] + g.width / 2) * s, y0 + (o[1] + g.height / 2) * s)
               for g, o in ((NEOP, NEOP_OFF), (DA, DA_OFF), (SEIL, SEIL_OFF))]
    return s, centers


def scene_name(c, t):
    """5.5~10s: 네이버플러스 → 넾 / 다 / 세일 → 공식 로고"""
    burst_bg(c, t, inner=470, rot_speed=-5, colors=(PURPLE, GREEN))
    LW = 940
    s, (n_c, d_c, l_c) = logo_parts(CX, CY - 40, LW)

    # 1) '네이버플러스' 등장 -> 6.0~6.5 가로로 압축되며 '넾'으로
    if t < 6.5:
        sc = slam(t, 5.5, 0.2, 2.2)
        squeeze = ease_in_cubic(prog(t, 6.0, 6.45))
        img = text_img("네이버플러스", F_BHS, 165, fill=BLACK, stroke=12, stroke_fill=WHITE)
        sx = sc * (1 - 0.78 * squeeze)
        place(c, img, CX, CY - 40, scale=sc * (1 + 0.25 * squeeze), sx=sx)
        stt = text_img("스토어", F_BHS, 110, fill=BLACK)
        st = Image.new("RGBA", (stt.width + 70, stt.height + 44), GREEN + (255,))
        ImageDraw.Draw(st).rectangle((0, 0, st.width - 1, st.height - 1), outline=BLACK, width=8)
        st.alpha_composite(stt, (35, 22))
        place(c, st, CX, CY + 150, scale=slam(t, 5.75, 0.2, 2.0), alpha=1 - squeeze)
        # 압축 효과선
        if squeeze > 0:
            d = aggdraw.Draw(c)
            for k in (-1, 1):
                for j in range(3):
                    y = CY - 120 + j * 80
                    xa = CX + k * (520 - 260 * squeeze)
                    poly(d, [(xa, y - 6), (xa + k * 140, y - 2), (xa + k * 140, y + 2), (xa, y + 6)], fill=BLACK)
            d.flush()
    else:
        # 2) '넾' (공식 로고 글리프) 가운데에 꽝 -> 7.0 에 제자리로 이동
        slide = ease_out_cubic(prog(t, 6.88, 7.02))
        nx = CX + (n_c[0] - CX) * slide
        if t < 7.02:
            place(c, NEOP, nx, n_c[1], scale=s * slam(t, 6.5, 0.18, 1.8) * (1.35 - 0.35 * slide))
        else:
            place(c, NEOP, n_c[0], n_c[1], scale=s)
        # '넾 = 네이버플러스' 설명 꼬리표
        if t < 8.0:
            a = prog(t, 6.6, 6.75) * (1 - prog(t, 7.85, 8.0))
            tag = text_img("넾 = 네이버플러스", F_PXB, 64, fill=WHITE)
            pad = Image.new("RGBA", (tag.width + 60, tag.height + 36), BLACK + (255,))
            pad.alpha_composite(tag, (30, 18))
            place(c, pad, CX, CY - 400, scale=pop(t, 6.6, 0.25), alpha=a, rot=-3)
        # 3) '다' 7.0, '세일' 7.5 꽝
        if 7.0 <= t < 8.0:
            place(c, DA, d_c[0], d_c[1], scale=s * slam(t, 7.0, 0.18, 1.9))
        if 7.5 <= t < 8.0:
            place(c, SEIL, l_c[0], l_c[1], scale=s * slam(t, 7.5, 0.18, 1.6))

    # 4) 8.0 공식 로고 + 서브카피 + 배지
    if t >= 8.0:
        k = slam(t, 8.0, 0.2, 1.25)
        flash = 1 - prog(t, 8.0, 8.1)
        # 흰 판 위 로고(로고 판 뒤에 검정 드롭섀도)
        place(c, LOGO, CX, CY - 40, scale=s * k * (1 + 0.03 * math.sin((t - 8) * math.pi * 4)))
        sub = text_img("거대한 혜택이 찾아온다!", F_PB, 76, fill=WHITE)
        band = Image.new("RGBA", (sub.width + 80, sub.height + 44), BLACK + (255,))
        band.alpha_composite(sub, (40, 22))
        place(c, band, CX, CY + 260, scale=pop(t, 8.25, 0.3), rot=-3)
        badge = text_img("N+ 스토어", F_PB, 60, fill=BLACK)
        bd = Image.new("RGBA", (badge.width + 56, badge.height + 34), GREEN + (255,))
        ImageDraw.Draw(bd).rectangle((0, 0, bd.width - 1, bd.height - 1), outline=BLACK, width=8)
        bd.alpha_composite(badge, (28, 17))
        place(c, bd, CX, CY - 330, scale=pop(t, 8.45, 0.3), rot=4)
        if flash > 0:
            c.alpha_composite(Image.new("RGBA", (W, H), (255, 255, 255, int(220 * flash))))


CATS = [("패션도", "shirt", 10.0), ("뷰티도", "lipstick", 10.5), ("디지털도", "phone", 11.0),
        ("리빙도", "mug", 11.5), ("식품도", "apple", 12.0)]

PART_RNG = random.Random(11)
PARTICLES = []
for i in range(46):
    PARTICLES.append(dict(
        kind=PART_RNG.choice(["coupon", "gift", "bag", "tag", "coupon", "gift"]),
        ang=PART_RNG.uniform(0, 2 * math.pi),
        spd=PART_RNG.uniform(420, 1300),
        spin=PART_RNG.uniform(-260, 260),
        t0=12.5 + PART_RNG.uniform(0, 1.6),
        size=PART_RNG.uniform(120, 260),
    ))


def scene_cats(c, t):
    """10~15s: 패션도 뷰티도 디지털도 리빙도 식품도 → 다~ 세일!"""
    if t < 12.5:
        idx = max(i for i, (_, _, t0) in enumerate(CATS) if t >= t0)
        bgc = [GREEN, PURPLE, GREEN, PURPLE, GREEN][idx]
        spikes = (PURPLE, WHITE) if bgc == GREEN else (GREEN, WHITE)
        burst_bg(c, t, base=bgc, inner=520, rot_speed=14, colors=spikes)
        word, ic, t0 = CATS[idx]
        place(c, icon(ic, 520), CX, CY - 250, scale=pop(t, t0, 0.22), rot=-6 + 12 * (idx % 2))
        place(c, text_img(word, F_BHS, 210, fill=WHITE, stroke=16, stroke_fill=BLACK), CX, CY + 230,
              scale=slam(t, t0, 0.14, 1.7), rot=-3)
        # 진행 표시 (5칸)
        d = aggdraw.Draw(c)
        for i in range(5):
            x = CX - 250 + i * 110
            poly(d, rrect_pts(x - 40, 1600, x + 40, 1624, 12), fill=BLACK if i <= idx else WHITE, outline=BLACK, width=6)
        d.flush()
    else:
        burst_bg(c, t, base=WHITE, inner=430, rot_speed=20, colors=(GREEN, PURPLE))
        # 혜택 아이템 폭발 (화면 앞으로 쏟아짐)
        for p in PARTICLES:
            if t < p["t0"]:
                continue
            dt = t - p["t0"]
            r = p["spd"] * (dt ** 0.8)
            x = CX + math.cos(p["ang"]) * r
            y = CY + math.sin(p["ang"]) * r + 220 * dt * dt
            sz = p["size"] * (0.4 + 0.9 * min(1, dt * 1.5))
            place(c, icon(p["kind"]), x, y, scale=sz / 360, rot=p["spin"] * dt)
        place(c, text_img("다~", F_BHS, 420, fill=BLACK, stroke=20, stroke_fill=WHITE), CX, CY - 160,
              scale=slam(t, 12.5, 0.2, 2.6) * (1 + 0.04 * math.sin(t * 4 * math.pi)), rot=-5)
        place(c, text_img("세일!", F_BHS, 330, fill=GREEN, stroke=20, stroke_fill=BLACK), CX, CY + 230,
              scale=slam(t, 12.85, 0.2, 2.2), rot=-5)


CORNER = [  # 엔드카드 장식 스파이크 (화면 모서리에서 꽂힘)
    ((0, 0), 35, GREEN), ((W, 0), 145, PURPLE), ((0, H), -35, PURPLE), ((W, H), -145, GREEN),
]


def scene_end(c, t):
    """15~20s: 공식 KV 배너 + 기간 + CTA"""
    d = aggdraw.Draw(c)
    poly(d, [(0, 0), (W, 0), (W, H), (0, H)], fill=DARK)
    k = ease_out_cubic(prog(t, 15.0, 15.4))
    for (ox, oy), ang, col in CORNER:
        a = math.radians(ang)
        L = 420 * k * (1 + 0.04 * math.sin(t * 4 * math.pi))
        tip = (ox + L * math.cos(a), oy + L * math.sin(a))
        b1 = (ox + 110 * math.cos(a + math.pi / 2), oy + 110 * math.sin(a + math.pi / 2))
        b2 = (ox + 110 * math.cos(a - math.pi / 2), oy + 110 * math.sin(a - math.pi / 2))
        poly(d, [tip, b1, b2], fill=col)
    d.flush()

    # 헤드라인 (훅의 '장바구니'를 회수)
    h1 = text_img("이제 장바구니를", F_PB, 96, fill=WHITE)
    h2 = text_img("비울 시간!", F_PB, 132, fill=GREEN)
    place(c, h1, CX, 470, alpha=prog(t, 15.35, 15.6), scale=pop(t, 15.35, 0.3))
    place(c, h2, CX, 610, scale=slam(t, 15.6, 0.2, 1.8), rot=-2)

    # 공식 KV 배너 (필수 사용) — 위에서 떨어지며 꽂힘, 흰 테두리 카드
    drop = ease_out_back(prog(t, 15.0, 15.45), 1.6)
    by = -400 + (CY + 30 + 400) * drop
    card = Image.new("RGBA", (KV.width + 48, KV.height + 48), WHITE + (255,))
    card.alpha_composite(KV, (24, 24))
    shadow = Image.new("RGBA", card.size, BLACK + (255,))
    zoom = 1 + 0.025 * prog(t, 15.5, 20.0)
    sc = (W + 40) / card.width * zoom
    place(c, shadow, CX + 18, by + 18, scale=sc, rot=2)
    place(c, card, CX, by, scale=sc, rot=2)

    # 기간 + 장소
    p1 = pop(t, 16.0, 0.3)
    date = text_img("10.26 ~ 11.8", F_PB, 128, fill=WHITE, tracking=2)
    place(c, date, CX, 1350, scale=p1)
    where = text_img("네이버플러스 스토어에서 만나요", F_PXB, 64, fill=BLACK)
    pill = Image.new("RGBA", (where.width + 90, where.height + 50), (0, 0, 0, 0))
    ImageDraw.Draw(pill).rounded_rectangle((0, 0, pill.width - 1, pill.height - 1), radius=pill.height // 2, fill=GREEN)
    pill.alpha_composite(where, (45, 25))
    place(c, pill, CX, 1510, scale=pop(t, 16.4, 0.3) * (1 + 0.035 * max(0, math.sin((t - 16.4) * 4 * math.pi))))
    place(c, text_img("#넾다세일", F_PXB, 56, fill=PURPLE), CX, 1650, alpha=prog(t, 16.8, 17.1))
    place(c, text_img("AI로 제작된 영상입니다", F_PSB, 30, fill=(150, 150, 150)), CX, 1840, alpha=prog(t, 16.8, 17.1))


def render_frame(t):
    c = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    if t < 3.0:
        scene_hook(c, t)
    elif t < 5.5:
        scene_boom(c, t)
    elif t < 10.0:
        scene_name(c, t)
    elif t < 15.0:
        scene_cats(c, t)
    else:
        scene_end(c, t)

    # 임팩트 카메라 셰이크 + 펀치 줌
    dx, dy = shake_offset(t, HITS)
    punch = 0.0
    for h in HITS:
        if h <= t < h + 0.18:
            punch = max(punch, 0.035 * (1 - (t - h) / 0.18))
    if dx or dy or punch:
        z = 1.0 + punch + (0.03 if (dx or dy) else 0)
        c = c.transform((W, H), Image.AFFINE,
                        (1 / z, 0, (W - W / z) / 2 - dx / z, 0, 1 / z, (H - H / z) / 2 - dy / z),
                        resample=Image.BILINEAR)
    return c.convert("RGB")


def main():
    os.makedirs(OUT, exist_ok=True)
    if "--stills" in sys.argv:
        sd = os.path.join(OUT, "stills")
        os.makedirs(sd, exist_ok=True)
        for t in [0.3, 1.0, 2.4, 3.3, 4.9, 5.7, 6.3, 6.8, 7.6, 9.0, 10.2, 11.2, 12.2, 13.4, 15.2, 17.5, 19.9]:
            render_frame(t).save(os.path.join(sd, f"t{t:05.2f}.png"))
            print("still", t)
        return

    wav = os.path.join(OUT, "audio.wav")
    build_audio(wav, DUR)
    mp4 = os.path.join(OUT, "nepda_ai_ad_9x16.mp4")
    cmd = ["ffmpeg", "-y", "-loglevel", "error",
           "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
           "-i", wav,
           "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-pix_fmt", "yuv420p", "-profile:v", "high",
           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-shortest", mp4]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    n = int(DUR * FPS)
    for i in range(n):
        proc.stdin.write(render_frame(i / FPS).tobytes())
        if i % 60 == 0:
            print(f"frame {i}/{n}", flush=True)
    proc.stdin.close()
    proc.wait()
    print("done:", mp4)


if __name__ == "__main__":
    main()
