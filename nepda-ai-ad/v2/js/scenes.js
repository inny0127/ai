// ───────────────────── 타임라인 / 카메라 / 장면 ─────────────────────
// 0~2s 인트로(갤러리) → 2~16s 시대 1~7 (각 2초) → 16~17.5 2026 성장/균열
// → 17.5 폭발 → 18/18.5/19 넾·다·세일 → 20~26 엔딩(공식 KV)
const PITCH = 1100, PX0 = 60, PY0 = 250;
const ERA_T0 = i => 2 + 2 * i;
const BOUNDS = [4, 6, 8, 10, 12, 14, 16];
const TR = .35;
const SIZES = [110, 140, 170, 205, 245, 290, 340, 400];
const GAUGE = ['×1', '×3', '×10', '×50', '×200', '×1,000', '×10,000'];
const GFILL = [.06, .15, .27, .4, .54, .68, .82, .9];
const T_BOOM = 17.5, T_NEOP = 18, T_DA = 18.5, T_SEIL = 19, T_OUT = 20;

const camF = t => BOUNDS.reduce((s, b) => s + E.inOut(prog(t, b - TR, b + TR)), 0);
const camX = t => camF(t) * PITCH;
function heroScreen(t) {
  return { x: 540 + 42 * Math.sin(TAU * t / 3.1), y: PY0 + 560 + 26 * Math.sin(TAU * t * .8), rot: .07 * Math.sin(TAU * t * .9) };
}
function heroSize(t) {
  const f = camF(t), i = Math.min(6, Math.floor(f)), u = f - i;
  let s = lerp(SIZES[i], SIZES[Math.min(7, i + 1)], u);
  s *= 1 + .035 * Math.max(0, Math.sin(TAU * t * 2)) ** 8;          // 비트마다 살짝 펄스
  if (t > 16.4) s *= 1 + .3 * E.outElastic(prog(t, 16.5, 16.95)) + .38 * E.outElastic(prog(t, 17.0, 17.4));
  return s;
}

// 화면 흔들림
const HITS = [[6.25, 7, .2], [16.5, 12, .25], [17.0, 18, .3], [T_BOOM, 46, .55], [T_NEOP, 26, .3], [T_DA, 26, .3], [T_SEIL, 34, .35], [21.5, 10, .2]];
function shake(t) {
  let dx = 0, dy = 0;
  for (const [h, a, d] of HITS) if (t >= h && t < h + d) {
    const p = (t - h) / d, k = a * (1 - p) ** 2;
    dx += k * Math.sin(t * 190 + h); dy += k * Math.cos(t * 233 + h * 3);
  }
  if (t > 17.0 && t < T_BOOM) { const r = rng(Math.floor(t * 60)); const k = 6 + 16 * prog(t, 17, T_BOOM); dx += (r() - .5) * k; dy += (r() - .5) * k; }
  return [dx, dy, Math.hypot(dx, dy)];
}

// ── 공통 배경/오버레이 ──
function galleryBg() {
  return pixelTex('gallery', W, H, (x, y, o) => {
    const v = fbm(NOISE, x / 300, y / 300, 3), f = NOISE(x / 1.3 + 50, y / 1.3);
    const vig = 1 - .12 * Math.pow(Math.hypot((x - W / 2) / W, (y - H / 2) / H) * 1.5, 2);
    const c = (.97 + .04 * (v - .5) + .025 * (f - .5)) * vig;
    o[0] = 239 * c; o[1] = 233 * c; o[2] = 220 * c;
  });
}
const GRAINS = [0, 1, 2].map(i => {
  const c = mkCanvas(540, 960), g = c.getContext('2d'), im = g.createImageData(540, 960), r = rng(90 + i);
  for (let k = 0; k < im.data.length; k += 4) { const v = r() * 255; im.data[k] = im.data[k + 1] = im.data[k + 2] = v; im.data[k + 3] = 255; }
  g.putImageData(im, 0, 0); return c;
});
function overlays(ctx, t, strength = 1) {
  ctx.save();
  ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = .07 * strength;
  ctx.drawImage(GRAINS[Math.floor(t * FPS) % 3], 0, 0, W, H);
  ctx.restore();
}

// ── 패널 렌더 ──
const PCS = ERAS.map(() => mkCanvas(PW, PH));
function renderEra(i, t, heroOn = true) {
  const c = PCS[i], g = c.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  const lt = t - ERA_T0(i);
  let hero = null;
  if (heroOn) {
    const hs = heroScreen(t), s = heroSize(t), sx = PX0 + i * PITCH - camX(t);
    const lx = hs.x - sx, ly = hs.y - PY0;
    if (lx > -s * 1.6 && lx < PW + s * 1.6) hero = { x: lx, y: ly, s, rot: hs.rot, t };
  }
  ERAS[i].draw(g, lt, hero, t);
  return c;
}
function panelFrame(ctx, img, x, y, w, h, blur = 0) {
  ctx.save();
  ctx.shadowColor = 'rgba(40,30,15,.32)'; ctx.shadowBlur = 46; ctx.shadowOffsetY = 20;
  ctx.fillStyle = '#ddd'; ctx.fillRect(x, y, w, h);
  ctx.restore();
  if (blur > 2) {
    const n = Math.min(10, Math.ceil(blur / 3));
    for (let k = 0; k < n; k++) {
      ctx.globalAlpha = 1 / (k + 1);
      ctx.drawImage(img, x + (k / (n - 1) - .5) * blur, y, w, h);
    }
    ctx.globalAlpha = 1;
  } else ctx.drawImage(img, x, y, w, h);
  ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.lineWidth = 1.5; ctx.strokeRect(x, y, w, h);
}
function caption(ctx, i, x, y, alpha = 1) {
  const [n, ti, sub] = ERAS[i].cap;
  ctx.save(); ctx.globalAlpha = alpha;
  text(ctx, n, x, y, { font: 'Gowun', size: 50, color: '#b8322a', align: 'left' });
  text(ctx, ti, x + 84, y, { font: 'SongMyung', size: 50, color: '#1d1a16', align: 'left', ls: 8 });
  text(ctx, sub, x, y + 58, { font: 'PretSB', size: 32, color: '#6f665a', align: 'left' });
  ctx.restore();
}

// ── HUD ──
function hudTop(ctx, t, alpha) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha;
  const f = camF(t), idx = Math.min(7, Math.round(f));
  text(ctx, '혜택의 진화', 60, 92, { font: 'Gowun', size: 54, color: '#1d1a16', align: 'left' });
  text(ctx, `${String(idx + 1).padStart(2, '0')} / 08`, 1020, 92, { font: 'Gowun', size: 46, color: '#b8322a', align: 'right' });
  const y = 168, x0 = 80, x1 = 1000, step = (x1 - x0) / 7;
  ctx.strokeStyle = 'rgba(29,26,22,.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
  ctx.strokeStyle = '#1d1a16'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + step * f, y); ctx.stroke();
  ERAS.forEach((e, i) => {
    const x = x0 + i * step, on = f >= i - .02;
    ctx.fillStyle = on ? '#1d1a16' : '#efe9dc'; ctx.strokeStyle = '#1d1a16'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, 8, 0, TAU); ctx.fill(); ctx.stroke();
    text(ctx, e.yr, x, y + 32, { font: 'PretSB', size: 22, color: on ? '#1d1a16' : '#9a9184' });
  });
  const mx = x0 + step * f;
  ctx.fillStyle = '#b8322a'; ctx.beginPath(); ctx.arc(mx, y, 13, 0, TAU); ctx.fill();
  ctx.restore();
}
function gaugeValue(t) {
  const f = camF(t);
  if (t < 16.35) return null;
  if (t < 17.0) { const r = rng(Math.floor(t * 30)); return '×' + Math.floor(10000 + r() * 9e7 * prog(t, 16.35, 17)).toLocaleString('en-US'); }
  return '측정 불가!!';
}
function hudGauge(ctx, t, alpha, forceMax = false) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha;
  const y = 1690, x0 = 60, x1 = 1020;
  text(ctx, '혜택 크기', x0, y, { font: 'PretXB', size: 38, color: '#3a332a', align: 'left' });
  const f = camF(t);
  let fill = forceMax ? 1.2 : lerp(GFILL[Math.floor(f)], GFILL[Math.min(7, Math.floor(f) + 1)], f - Math.floor(f));
  if (!forceMax && t > 16.35) fill = lerp(.9, 1.2, E.out(prog(t, 16.35, 17.0)));
  // 값 (슬롯처럼 굴러감)
  const special = forceMax ? '측정 불가!!' : gaugeValue(t);
  ctx.save(); ctx.beginPath(); ctx.rect(560, y - 50, 470, 100); ctx.clip();
  if (special) {
    const isMax = special.startsWith('측정');
    const k = isMax && !forceMax ? slam(t, 17.0, .2, 1.8) : 1;
    ctx.translate(1020, y); ctx.scale(k, k);
    if (isMax) { const bl = Math.floor(t * 8) % 2; text(ctx, special, 0, 0, { font: 'PretBlk', size: 66, color: bl ? '#000' : C.purple, align: 'right' }); }
    else text(ctx, special, 0, 0, { font: 'PretBlk', size: 66, color: '#1d1a16', align: 'right' });
  } else {
    const i = Math.floor(f), u = E.outBack(clamp((f - i) * 1.15), 1.3);
    text(ctx, GAUGE[i], 1020, y - u * 90, { font: 'PretBlk', size: 66, color: '#1d1a16', align: 'right' });
    if (i < 6) text(ctx, GAUGE[i + 1], 1020, y + 90 - u * 90, { font: 'PretBlk', size: 66, color: '#1d1a16', align: 'right' });
  }
  ctx.restore();
  const by = 1760, bh = 38;
  ctx.fillStyle = 'rgba(29,26,22,.10)'; rr(ctx, x0, by, x1 - x0, bh, 19); ctx.fill();
  const fw = (x1 - x0) * fill;
  const over = fill > 1;
  ctx.save();
  if (!over) { rr(ctx, x0, by, x1 - x0, bh, 19); ctx.clip(); }
  const grd = ctx.createLinearGradient(x0, 0, x0 + Math.max(10, fw), 0);
  grd.addColorStop(0, '#1d1a16'); grd.addColorStop(1, over ? (Math.floor(t * 8) % 2 ? C.purple : C.green) : '#1d1a16');
  ctx.fillStyle = grd; rr(ctx, x0, by, over ? W + 40 - x0 : fw, bh, 19); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.18)';
  for (let x = x0 - 40 + (t * 120) % 40; x < x0 + fw; x += 40) { ctx.beginPath(); ctx.moveTo(x, by + bh); ctx.lineTo(x + 18, by); ctx.lineTo(x + 34, by); ctx.lineTo(x + 16, by + bh); ctx.fill(); }
  ctx.restore();
  for (let i = 1; i < 10; i++) { ctx.fillStyle = 'rgba(29,26,22,.25)'; ctx.fillRect(x0 + (x1 - x0) * i / 10, by + bh + 6, 2, 10); }
  ctx.restore();
}

// ── 인트로 (0~2s) ──
const CELL = { w: 225, h: 281, gap: 20, x0: 60, y0: 650 };
function cellRect(i) { return [CELL.x0 + (i % 4) * (CELL.w + CELL.gap), CELL.y0 + Math.floor(i / 4) * (CELL.h + CELL.gap + 46), CELL.w, CELL.h]; }
function mysteryCard() {
  return cached('mystery', PW, PH, (g) => {
    g.fillStyle = '#fff'; g.fillRect(0, 0, PW, PH);
    drawSpikes(g, 480, 600, 470, 0, { R: 1300 });
    g.fillStyle = '#fff'; g.beginPath(); g.arc(480, 600, 330, 0, TAU); g.fill();
    text(g, '?', 480, 640, { font: 'BHS', size: 520, color: '#000' });
    text(g, '2026', 480, 1080, { font: 'BHS', size: 110, color: '#000' });
  });
}
function drawIntro(ctx, t) {
  ctx.drawImage(galleryBg(), 0, 0);
  const K = PW / CELL.w, e = E.inOut(prog(t, 1.25, 2.0));
  const k = Math.exp(e * Math.log(K)), u = (k - 1) / (K - 1);
  const r0 = cellRect(0), tlx = lerp(r0[0], PX0, u), tly = lerp(r0[1], PY0, u);
  ctx.save();
  ctx.translate(tlx, tly); ctx.scale(k, k); ctx.translate(-r0[0], -r0[1]);
  // 타이틀
  const ta = E.out(prog(t, 0, .35));
  ctx.save(); ctx.globalAlpha = ta; ctx.translate(0, (1 - ta) * 30);
  text(ctx, '기원전 5000년  →  2026년', 540, 250, { font: 'SongMyung', size: 42, color: '#8a7f6f' });
  text(ctx, '혜택의 진화', 540, 380, { font: 'Gowun', size: 158, color: '#1d1a16' });
  ctx.fillStyle = '#b8322a'; ctx.fillRect(500, 485, 80, 4);
  text(ctx, '8개의 시대 · 8개의 화풍', 540, 545, { font: 'PretSB', size: 34, color: '#8a7f6f' });
  ctx.restore();
  for (let i = 0; i < 8; i++) {
    const [x, y, w, h] = cellRect(i), p = pop(t, .12 + .055 * i, .32);
    if (p <= 0) continue;
    ctx.save(); ctx.translate(x + w / 2, y + h / 2); ctx.scale(lerp(.8, 1, p), lerp(.8, 1, p)); ctx.globalAlpha = clamp(p); ctx.translate(-(x + w / 2), -(y + h / 2));
    const img = i < 7 ? renderEraThumb(i, t) : mysteryCard();
    panelFrame(ctx, img, x, y, w, h);
    const [n, ti] = ERAS[i].cap;
    text(ctx, n, x, y + h + 26, { font: 'Gowun', size: 24, color: '#b8322a', align: 'left' });
    text(ctx, i < 7 ? ti : '???', x + 40, y + h + 26, { font: 'SongMyung', size: 24, color: '#1d1a16', align: 'left' });
    ctx.restore();
  }
  const c1 = E.out(prog(t, .62, .9)), c2 = E.out(prog(t, .85, 1.1));
  text(ctx, '혜택은 계속 커져왔다.', 540, 1360, { font: 'SongMyung', size: 66, color: '#1d1a16', alpha: c1 });
  text(ctx, '그리고 2026년,', 540, 1450, { font: 'SongMyung', size: 54, color: '#b8322a', alpha: c2 });
  ctx.restore();
}
function renderEraThumb(i, t) {
  // 썸네일 속 주인공은 패널 로컬 좌표 그대로 (줌인 끝나면 2초 시점 화면과 동일)
  const c = PCS[i], g = c.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over';
  const hs = heroScreen(t), s = i === 0 ? heroSize(2.0) : SIZES[i];
  ERAS[i].draw(g, .9 + (t % 1) * .2, { x: hs.x - PX0, y: hs.y - PY0, s, rot: hs.rot, t }, t);
  return c;
}

// ── 시대 스트립 (2~17.5s) ──
const CRACKS = (() => {
  const R = rng(3), out = [];
  [[0, .2], [1, .7], [.3, 0], [.8, 1], [0, .85], [1, .15], [.6, 0], [.15, 1]].forEach(([u, v]) => {
    let x = u * PW, y = v * PH, a = Math.atan2(560 - y, 480 - x); const pts = [[x, y]];
    for (let i = 0; i < 26; i++) { a += (R() - .5) * 1.1; x += Math.cos(a) * 26; y += Math.sin(a) * 26; pts.push([x, y]); }
    out.push(pts);
  });
  return out;
})();
function stripZoom(t) { return 1 + .14 * E.in(prog(t, 16.9, T_BOOM)); }
function drawStrip(ctx, t) {
  ctx.drawImage(galleryBg(), 0, 0);
  const cx = camX(t), v = (camX(t + 1 / 240) - camX(t - 1 / 240)) * 120, blur = Math.abs(v) / 120;
  const hs = heroScreen(t), z = stripZoom(t);
  ctx.save();
  if (z > 1) { ctx.translate(hs.x, hs.y); ctx.scale(z, z); ctx.translate(-hs.x, -hs.y); }
  for (let i = 0; i < 8; i++) {
    const sx = PX0 + i * PITCH - cx;
    if (sx > W + 40 || sx + PW < -40) continue;
    const heroIn = !(i === 7 && t >= 16.35);
    const img = renderEra(i, t, heroIn);
    panelFrame(ctx, img, sx, PY0, PW, PH, blur);
    caption(ctx, i, sx, PY0 + PH + 70, 1);
    if (i === 7 && t > 16.9) {                    // 액자 균열
      const p = E.out(prog(t, 16.95, T_BOOM));
      ctx.save(); ctx.beginPath(); ctx.rect(sx, PY0, PW, PH); ctx.clip(); ctx.translate(sx, PY0);
      CRACKS.forEach((pts, j) => {
        const n = Math.floor(pts.length * clamp(p * 1.4 - j * .05));
        if (n < 2) return;
        for (const [col, lw, o] of [['#fff', 9, 2], ['#000', 5, 0]]) {
          ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.lineJoin = 'miter'; ctx.beginPath();
          for (let k = 0; k < n; k++) k ? ctx.lineTo(pts[k][0] + o, pts[k][1] + o) : ctx.moveTo(pts[k][0] + o, pts[k][1] + o);
          ctx.stroke();
        }
      });
      ctx.restore();
    }
  }
  if (t >= 16.35) heroBreakout(ctx, t);
  ctx.restore();
}
function heroBreakout(ctx, t) {
  const hs = heroScreen(t), s = heroSize(t);
  let x = hs.x, y = hs.y, sq = 1;
  for (const h of [16.5, 17.0]) if (t > h && t < h + .3) sq += .14 * Math.sin((t - h) / .3 * Math.PI) * (1 - (t - h) / .3);
  if (t > 17.0) { const r = rng(Math.floor(t * 60) + 5), k = 8 + 26 * prog(t, 17, T_BOOM); x += (r() - .5) * k; y += (r() - .5) * k; }
  const ray = prog(t, 16.95, T_BOOM);
  if (ray > 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(t * .9);
    for (let i = 0; i < 16; i++) {
      ctx.fillStyle = i % 2 ? `rgba(0,245,80,${.75 * ray})` : `rgba(145,98,255,${.75 * ray})`;
      const a = i / 16 * TAU, w = .07 + .05 * Math.sin(t * 9 + i);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 400 + 1400 * ray, a - w, a + w); ctx.fill();
    }
    ctx.restore();
  }
  ctx.save(); ctx.translate(x, y); ctx.scale(sq, 2 - sq); ctx.translate(-x, -y);
  drawHero(ctx, 'kv', { x, y, s, rot: hs.rot, t });
  ctx.restore();
  if (ray > .3) {                                     // 틈새로 새는 빛
    ctx.save(); ctx.globalAlpha = (ray - .3) / .7;
    ctx.fillStyle = '#fff'; ctx.fillRect(x - s * .56, y - s * .2 - 3 + Math.sin(t * 40) * 3, s * 1.12, 8);
    ctx.restore();
  }
}

// ── 피날레 (17.5~20s) ──
let SNAP = null;
function panelSnapshot() {
  if (SNAP) return SNAP;
  SNAP = mkCanvas(W, H);
  const g = SNAP.getContext('2d');
  g.fillStyle = 'rgba(0,0,0,0)';
  const t = T_BOOM - 1 / 120;
  const save = g; drawStripInto(save, t);
  return SNAP;
}
function drawStripInto(g, t) { drawStrip(g, t); }
const SHARDS = (() => {
  const R = rng(8), out = [], nx = 6, ny = 8, pts = [];
  for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) {
    const ex = i === 0 || i === nx, ey = j === 0 || j === ny;
    pts.push([i / nx * W + (ex ? 0 : (R() - .5) * 120), j / ny * H + (ey ? 0 : (R() - .5) * 160)]);
  }
  const P = (i, j) => pts[j * (nx + 1) + i];
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1);
    for (const tri of (R() < .5 ? [[a, b, c], [a, c, d]] : [[a, b, d], [b, c, d]])) {
      const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3, cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
      out.push({ tri, cx, cy, spd: 900 + R() * 1800, spin: (R() - .5) * 9, jit: (R() - .5) * .6, grow: .3 + R() * .8 });
    }
  }
  return out;
})();
const PARTS = (() => {
  const R = rng(19), out = [], kinds = ['coupon', 'gift', 'conf', 'conf', 'pct', 'star', 'conf', 'coupon'];
  for (let i = 0; i < 110; i++) out.push({
    kind: kinds[Math.floor(R() * kinds.length)], a: R() * TAU, spd: 700 + R() * 2600, spin: (R() - .5) * 14, t0: T_BOOM + R() * .25,
    size: 30 + R() * 70, col: [C.green, C.purple, '#000', C.green][Math.floor(R() * 4)], z: R(),
  });
  return out;
})();
function drawPart(ctx, p, x, y, sc, rot, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  const s = p.size;
  if (p.kind === 'coupon') {
    ctx.fillStyle = '#000'; rr(ctx, -s + 5, -s * .55 + 6, s * 2, s * 1.1, 8); ctx.fill();
    ctx.fillStyle = C.purple; rr(ctx, -s, -s * .55, s * 2, s * 1.1, 8); ctx.fill();
    ctx.strokeStyle = '#000'; ctx.lineWidth = 5; ctx.stroke();
    text(ctx, '%', -s * .2, 2, { font: 'BHS', size: s * .9, color: '#fff' });
    ctx.setLineDash([6, 6]); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(s * .45, -s * .45); ctx.lineTo(s * .45, s * .45); ctx.stroke(); ctx.setLineDash([]);
  } else if (p.kind === 'gift') {
    drawHero(ctx, 'kv', { x: 0, y: 0, s: s * 1.4, rot: 0, t });
  } else if (p.kind === 'pct') {
    text(ctx, '%', 0, 0, { font: 'BHS', size: s * 2, color: p.col === '#000' ? C.green : p.col, stroke: '#000', sw: 10 });
  } else if (p.kind === 'star') {
    starburst(ctx, 0, 0, s * .4, s, 5, 0); ctx.fillStyle = C.green; ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 5; ctx.stroke();
  } else {
    ctx.fillStyle = p.col; ctx.fillRect(-s * .5, -s * .2, s, s * .4);
  }
  ctx.restore();
}
function logoGeom(cx, cy, width) {
  const s = width / IMG.logo.width, x0 = cx - IMG.logo.width * s / 2, y0 = cy - IMG.logo.height * s / 2;
  const piece = (im, ox, oy) => [x0 + (ox + im.width / 2) * s, y0 + (oy + im.height / 2) * s];
  return { s, neop: piece(IMG.neop, 0, 47), da: piece(IMG.da, 1212, 208), seil: piece(IMG.seil, 2117, 0) };
}
function placeImg(ctx, im, cx, cy, sc, rot = 0) {
  if (sc <= 0) return;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(sc, sc); ctx.drawImage(im, -im.width / 2, -im.height / 2); ctx.restore();
}
function ring(ctx, t, t0, x, y) {
  const p = prog(t, t0, t0 + .45); if (p <= 0 || p >= 1) return;
  ctx.strokeStyle = '#000'; ctx.lineWidth = 34 * (1 - p); ctx.beginPath(); ctx.arc(x, y, 80 + 620 * E.out(p), 0, TAU); ctx.stroke();
}
function drawFinale(ctx, t) {
  ctx.fillStyle = '#fff'; ctx.fillRect(-60, -60, W + 120, H + 120);
  drawSpikes(ctx, 540, 900, 500, t, { intro: E.outExpo(prog(t, T_BOOM, T_BOOM + .3)), R: 2400, rot: .1 });
  const hs = heroScreen(T_BOOM);
  // 파편
  const sp = prog(t, T_BOOM, T_BOOM + 1.0);
  if (sp < 1) {
    const snap = panelSnapshot(), u = t - T_BOOM;
    SHARDS.forEach(s => {
      const dx = s.cx - hs.x, dy = s.cy - hs.y, L = Math.hypot(dx, dy) || 1;
      const a = Math.atan2(dy, dx) + s.jit, d = s.spd * (1 - Math.exp(-2.6 * u)) / 2.6;
      const px = s.cx + Math.cos(a) * d, py = s.cy + Math.sin(a) * d + 700 * u * u, sc = 1 + s.grow * u;
      ctx.save(); ctx.globalAlpha = 1 - E.in(sp);
      ctx.translate(px, py); ctx.rotate(s.spin * u); ctx.scale(sc, sc); ctx.translate(-s.cx, -s.cy);
      ctx.beginPath(); ctx.moveTo(...s.tri[0]); ctx.lineTo(...s.tri[1]); ctx.lineTo(...s.tri[2]); ctx.closePath();
      ctx.save(); ctx.clip(); ctx.drawImage(snap, 0, 0); ctx.restore();
      ctx.strokeStyle = '#000'; ctx.lineWidth = 3; ctx.stroke();
      ctx.restore();
    });
  }
  // 혜택 파티클
  PARTS.forEach(p => {
    if (t < p.t0) return;
    const u = t - p.t0, k = 1.9, d = p.spd * (1 - Math.exp(-k * u)) / k;
    const x = hs.x + Math.cos(p.a) * d, y = hs.y + Math.sin(p.a) * d + 260 * u * u;
    const sc = (.5 + .9 * Math.min(1, u * 2)) * (.7 + p.z * .6);
    if (y < H + 200) drawPart(ctx, p, x, y, sc, p.spin * u, t);
  });
  // 펑!
  if (t < T_NEOP + .1) {
    const k = slam(t, T_BOOM + .02, .18, 2.6), a = 1 - prog(t, T_NEOP - .12, T_NEOP + .05);
    ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 880); ctx.rotate(-.18); ctx.scale(k, k);
    text(ctx, '펑!!', 0, 0, { font: 'BHS', size: 320, color: '#fff', stroke: '#000', sw: 30 });
    ctx.restore();
  }
  // 넾 · 다 · 세일 → 공식 로고
  const L = logoGeom(540, 880, 940), bob = t > T_SEIL + .3 ? 1 + .025 * Math.sin((t - T_SEIL) * TAU * 2) : 1;
  ctx.save(); ctx.translate(540, 880); ctx.scale(bob, bob); ctx.translate(-540, -880);
  placeImg(ctx, IMG.neop, L.neop[0], L.neop[1], L.s * slam(t, T_NEOP, .18, 2.0));
  placeImg(ctx, IMG.da, L.da[0], L.da[1], L.s * slam(t, T_DA, .18, 2.0));
  placeImg(ctx, IMG.seil, L.seil[0], L.seil[1], L.s * slam(t, T_SEIL, .18, 1.7));
  ctx.restore();
  ring(ctx, t, T_NEOP, L.neop[0], L.neop[1]); ring(ctx, t, T_DA, L.da[0], L.da[1]); ring(ctx, t, T_SEIL, L.seil[0], L.seil[1]);
  const bp = pop(t, T_SEIL + .2, .3);
  if (bp > 0) {
    ctx.save(); ctx.translate(540, 650); ctx.rotate(.06); ctx.scale(bp, bp);
    ctx.fillStyle = C.green; rr(ctx, -150, -44, 300, 88, 8); ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 9; ctx.stroke();
    text(ctx, 'N+ 스토어', 0, 3, { font: 'PretBlk', size: 52, color: '#000' });
    ctx.restore();
  }
  const bd = pop(t, T_SEIL + .3, .35);
  if (bd > 0) {
    ctx.save(); ctx.translate(540, 1130); ctx.rotate(-.05); ctx.scale(bd, bd);
    ctx.fillStyle = '#000'; ctx.fillRect(-420, -66, 840, 132);
    text(ctx, '거대한 혜택이 찾아온다!', 0, 4, { font: 'PretBlk', size: 74, color: '#fff' });
    ctx.restore();
  }
  const fl = 1 - prog(t, T_BOOM, T_BOOM + .14);
  if (fl > 0) { ctx.fillStyle = `rgba(255,255,255,${fl})`; ctx.fillRect(-60, -60, W + 120, H + 120); }
}

// ── 엔딩 (20~26s) ──
const FIN = mkCanvas(W, H);
const KVF = { x: 40, y: 450, w: 1000, h: 1000 * 617 / 2185 };
const THUMBS = [];
function eraThumbs() {
  if (THUMBS.length) return THUMBS;
  for (let i = 0; i < 7; i++) {
    const c = mkCanvas(224, 280), g = c.getContext('2d');
    const src = mkCanvas(PW, PH), sg = src.getContext('2d');
    ERAS[i].draw(sg, 1.0, { x: 480, y: 560, s: SIZES[i] * 1.6, rot: 0, t: 3 }, 3);
    g.drawImage(src, 0, 0, 224, 280); THUMBS.push(c);
  }
  return THUMBS;
}
function drawOutro(ctx, t) {
  ctx.drawImage(galleryBg(), 0, 0);
  const tr = prog(t, T_OUT, T_OUT + .75);
  // 스포트라이트
  const sa = prog(t, T_OUT + .3, T_OUT + .9);
  if (sa > 0) {
    const g = ctx.createRadialGradient(540, 590, 50, 540, 590, 760);
    g.addColorStop(0, `rgba(255,252,240,${.9 * sa})`); g.addColorStop(1, 'rgba(255,252,240,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  text(ctx, '혜택의 진화', 540, 110, { font: 'Gowun', size: 66, color: '#1d1a16', alpha: prog(t, T_OUT + .4, T_OUT + .7) });
  text(ctx, '기원전부터 2026년까지', 540, 178, { font: 'SongMyung', size: 36, color: '#8a7f6f', alpha: prog(t, T_OUT + .5, T_OUT + .8) });
  const th = eraThumbs();
  th.forEach((c, i) => {
    const p = pop(t, T_OUT + .55 + i * .07, .3); if (p <= 0) return;
    const x = 88 + i * 132, y = 240;
    ctx.save(); ctx.translate(x + 56, y + 70); ctx.scale(p, p); ctx.translate(-(x + 56), -(y + 70));
    panelFrame(ctx, c, x, y, 112, 140);
    text(ctx, ERAS[i].yr, x + 56, y + 168, { font: 'PretSB', size: 22, color: '#8a7f6f' });
    ctx.restore();
  });
  const ap = prog(t, T_OUT + 1.1, T_OUT + 1.3);
  if (ap > 0) { ctx.fillStyle = `rgba(184,50,42,${ap})`; ctx.beginPath(); ctx.moveTo(522, 418); ctx.lineTo(558, 418); ctx.lineTo(540, 438); ctx.fill(); }
  // 피날레 → 카드로 줄어들고 뒤집혀 공식 KV 배너로
  if (tr < .55) {
    const e = E.inOut(clamp(tr / .55));
    const cw = lerp(W, 470, e), ch = lerp(H, 836, e), cx = 540, cy = lerp(960, KVF.y + KVF.h / 2, e);
    const flip = 1 - E.in(prog(tr, .38, .55));
    drawFinale(FIN.getContext('2d'), t);
    ctx.save(); ctx.translate(cx, cy); ctx.scale(flip, 1);
    ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 50 * e; ctx.shadowOffsetY = 20 * e;
    ctx.beginPath(); ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 30 * e); ctx.fillStyle = '#fff'; ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.clip(); ctx.drawImage(FIN, -cw / 2, -ch / 2, cw, ch);
    ctx.restore();
  } else {
    const flip = E.outBack(prog(tr, .55, .78), 1.4), sh = 1 + .015 * Math.sin(Math.max(0, t - 21) * TAU * .5);
    ctx.save(); ctx.translate(540, KVF.y + KVF.h / 2); ctx.scale(flip * sh, sh); ctx.rotate(-.012);
    ctx.shadowColor = 'rgba(40,30,15,.4)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 24;
    ctx.fillStyle = '#111'; ctx.fillRect(-KVF.w / 2 - 14, -KVF.h / 2 - 14, KVF.w + 28, KVF.h + 28);
    ctx.shadowColor = 'transparent';
    ctx.drawImage(IMG.kv, -KVF.w / 2, -KVF.h / 2, KVF.w, KVF.h);
    for (const s0 of [21.0, 23.0, 25.0]) {           // 광택
      const p = prog(t, s0, s0 + .7); if (p <= 0 || p >= 1) continue;
      ctx.save(); ctx.beginPath(); ctx.rect(-KVF.w / 2, -KVF.h / 2, KVF.w, KVF.h); ctx.clip();
      const x = lerp(-KVF.w, KVF.w, p);
      const g = ctx.createLinearGradient(x - 120, 0, x + 120, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.65)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.transform(1, 0, -.4, 1, 0, 0); ctx.fillRect(x - 120, -KVF.h, 240, KVF.h * 2);
      ctx.restore();
    }
    ctx.restore();
  }
  // 박물관 라벨 + 카피
  const la = E.out(prog(t, 21.1, 21.4));
  if (la > 0) {
    ctx.save(); ctx.globalAlpha = la; ctx.translate(0, (1 - la) * 20);
    ctx.fillStyle = '#fbf8f1'; ctx.shadowColor = 'rgba(0,0,0,.15)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 6;
    ctx.fillRect(620, 800, 400, 150); ctx.shadowColor = 'transparent';
    text(ctx, 'No. 08   넾다세일', 645, 840, { font: 'Gowun', size: 34, color: '#1d1a16', align: 'left' });
    text(ctx, '2026 · 혼합 매체 · 거대한 혜택', 645, 884, { font: 'PretSB', size: 23, color: '#6f665a', align: 'left' });
    text(ctx, '네이버플러스 스토어 소장', 645, 918, { font: 'PretSB', size: 23, color: '#6f665a', align: 'left' });
    text(ctx, '거대한 혜택이', 60, 838, { font: 'PretBlk', size: 64, color: '#1d1a16', align: 'left' });
    text(ctx, '찾아온다!', 60, 914, { font: 'PretBlk', size: 64, color: '#1d1a16', align: 'left' });
    ctx.restore();
  }
  const dk = slam(t, 21.5, .2, 2.0), beat = t > 24 ? 1 + .07 * Math.max(0, 1 - (t - 24) / .35) : 1;
  if (dk > 0) { ctx.save(); ctx.translate(540, 1150); ctx.scale(dk * beat, dk * beat); text(ctx, '10.26 ~ 11.8', 0, 0, { font: 'PretBlk', size: 170, color: '#000', ls: -2 }); ctx.restore(); }
  const pp = pop(t, 21.8, .35);
  if (pp > 0) {
    const pulse = 1 + .03 * Math.max(0, Math.sin((t - 21.8) * TAU));
    ctx.save(); ctx.translate(540, 1330); ctx.scale(pp * pulse, pp * pulse);
    ctx.fillStyle = '#000'; rr(ctx, -416, -62 + 8, 840, 124, 62); ctx.fill();
    ctx.fillStyle = C.green; rr(ctx, -420, -62, 840, 124, 62); ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.stroke();
    text(ctx, '네이버플러스 스토어에서 만나요', 0, 3, { font: 'PretXB', size: 52, color: '#000' });
    ctx.restore();
  }
  text(ctx, '#넾다세일', 540, 1475, { font: 'PretXB', size: 48, color: C.purple, alpha: prog(t, 22.0, 22.3) });
  hudGauge(ctx, t, prog(t, 22.2, 22.5), true);
  text(ctx, 'AI로 제작된 영상입니다', 540, 1870, { font: 'PretSB', size: 26, color: '#a59c8e', alpha: prog(t, 22.2, 22.5) });
}

// ── 프레임 ──
function drawFrame(ctx, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  const [dx, dy, amp] = shake(t);
  ctx.fillStyle = '#efe9dc'; ctx.fillRect(0, 0, W, H);
  ctx.save();
  if (amp > .01) { const z = 1 + Math.min(.05, amp * .0016); ctx.translate(W / 2 + dx, H / 2 + dy); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); }
  if (t < 2) {
    drawIntro(ctx, t);
    hudTop(ctx, t, prog(t, 1.75, 2.0)); hudGauge(ctx, t, prog(t, 1.75, 2.0));
  } else if (t < T_BOOM) {
    drawStrip(ctx, t);
    const ha = 1 - prog(t, 17.2, T_BOOM);
    hudTop(ctx, t, ha); hudGauge(ctx, t, Math.max(ha, t > 16.3 ? 1 : 0));
  } else if (t < T_OUT) {
    drawFinale(ctx, t);
  } else {
    drawOutro(ctx, t);
  }
  ctx.restore();
  overlays(ctx, t);
}
