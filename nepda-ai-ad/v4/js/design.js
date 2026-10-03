// ───────────── 모자이크 설계: 상자 82,944개가 그릴 두 장의 그림 ─────────────
// A = 상자 뚜껑(겉)이 그리는 넾다세일 KV,  B = 뚜껑이 날아간 뒤 상자 속이 그리는 날짜
export const NX = 216, NY = 384, N = NX * NY;      // 5px/타일 기준 1080x1920 설계
export const DW = 1080, DH = 1920;
export const GREEN = '#00F550', PURPLE = '#9162FF';

export function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
export function makeNoise(seed) {
  const r = rng(seed), S = 256, g = new Float32Array(S * S);
  for (let i = 0; i < S * S; i++) g[i] = r();
  const sm = t => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const x0 = xi & 255, x1 = (xi + 1) & 255, y0 = (yi & 255) * S, y1 = ((yi + 1) & 255) * S;
    const a = g[y0 + x0], b = g[y0 + x1], c = g[y1 + x0], d = g[y1 + x1], u = sm(xf), v = sm(yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}
export function fbm(n, x, y, o = 4) { let s = 0, a = .5, f = 1, k = 0; for (let i = 0; i < o; i++) { s += a * n(x * f, y * f); k += a; a *= .5; f *= 2.03; } return s / k; }

const TAU = Math.PI * 2;
function mk(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }

// KV 스타일 폭발 스파이크 (검정 외곽선 + 초록/보라)
const SPIKES = (() => {
  const R = rng(17), out = [];
  for (let i = 0; i < 15; i++) out.push({ ang: i / 15 * TAU + (R() - .5) * .35, half: .09 + R() * .07, tip: R() * .35, notch: .35 + R() * .3, kink: (R() - .5) * .5 });
  return out;
})();
export function spikePolys(cx, cy, inner, R = 2400, rot = -.25, cols = [GREEN, PURPLE]) {
  return SPIKES.map((s, i) => {
    const a = s.ang + rot, rTip = inner * (1 + s.tip), rn = rTip + (R - rTip) * s.notch, hw = s.half;
    const P = (r, aa) => [cx + r * Math.cos(aa), cy + r * Math.sin(aa)];
    return {
      shape: [P(rTip, a), P(R, a - hw), P(rn + 50, a - hw * .1 + s.kink * .05), P(rn, a + hw * .35), P(R, a + hw)],
      outer: [P(rTip - 40, a), P(R, a - hw - .05), P(rn + 30, a - hw * .1 - .035 + s.kink * .05), P(rn - 24, a + hw * .35 + .025), P(R, a + hw + .05)],
      col: cols[i % cols.length],
    };
  });
}
function fillPoly(ctx, pts, col) { ctx.fillStyle = col; ctx.beginPath(); pts.forEach(([x, y], j) => j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); }

export const LOGO_BOX = { cx: 540, cy: 760, w: 940 };
export function drawImageA(ctx, logo) {
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, DW, DH);
  for (const p of spikePolys(540, 850, 470)) { fillPoly(ctx, p.outer, '#000'); fillPoly(ctx, p.shape, p.col); }
  const { cx, cy, w } = LOGO_BOX, h = w * logo.height / logo.width;
  ctx.drawImage(logo, cx - w / 2, cy - h / 2, w, h);
  ctx.fillStyle = '#000'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '84px PretBlk'; ctx.fillText('거대한 혜택이 찾아온다!', 540, 1030);
  ctx.font = '70px PretXB'; ctx.fillText('10.26.~ 11.8.', 540, 1135);
}
export function drawImageB(ctx, logo) {
  ctx.fillStyle = GREEN; ctx.fillRect(0, 0, DW, DH);
  for (const p of spikePolys(540, 960, 560, 2400, .12, ['#ffffff', PURPLE])) { fillPoly(ctx, p.outer, '#000'); fillPoly(ctx, p.shape, p.col); }
  ctx.fillStyle = GREEN; ctx.beginPath(); ctx.ellipse(540, 930, 520, 760, 0, 0, TAU); ctx.fill();
  const w = 760, h = w * logo.height / logo.width;
  ctx.drawImage(logo, 540 - w / 2, 330 - h / 2, w, h);
  ctx.fillStyle = '#000'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '340px PretBlk'; ctx.fillText('10.26', 540, 760);
  ctx.font = '340px PretBlk'; ctx.fillText('~11.8', 520, 1090);
  ctx.fillStyle = PURPLE; ctx.beginPath(); ctx.roundRect(110, 1340, 860, 150, 75); ctx.fill();
  ctx.lineWidth = 12; ctx.strokeStyle = '#000'; ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.font = '88px PretBlk'; ctx.fillText('네이버플러스 스토어', 540, 1418);
  ctx.fillStyle = '#000'; ctx.font = '76px PretXB'; ctx.fillText('#넾다세일', 540, 1620);
}

// 타일 팔레트 (실제 모자이크처럼 한정된 색)
const PAL_A = ['#f4f3ef', '#d9d8d3', '#a3a29e', '#5c5c5a', '#141414', GREEN, '#00b43c', '#a3f7bd', PURPLE, '#6a43d6', '#cdb9ff'];
const PAL_B = ['#f4f3ef', '#c9c8c3', '#141414', '#4a4a48', GREEN, '#00b43c', '#86f5aa', PURPLE, '#6a43d6', '#c4adff', '#ffffff'];
function hex2rgb(h) { const v = parseInt(h.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; }
function quantize(rgb, pal) {
  let best = 0, bd = 1e9;
  pal.forEach((p, i) => { const dr = rgb[0] - p[0], dg = rgb[1] - p[1], db = rgb[2] - p[2]; const d = dr * dr * .3 + dg * dg * .59 + db * db * .11; if (d < bd) { bd = d; best = i; } });
  return best;
}
// 설계 캔버스 → 타일 색 (5x5 평균 → 팔레트 양자화)
export function sampleTiles(canvas, palHex) {
  const pal = palHex.map(hex2rgb), d = canvas.getContext('2d').getImageData(0, 0, DW, DH).data;
  const idx = new Uint8Array(N), rgb = new Uint8Array(N * 3);
  const sx = DW / NX, sy = DH / NY;
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    let r = 0, g = 0, b = 0, n = 0;
    for (let y = Math.floor(j * sy); y < Math.floor((j + 1) * sy); y++) for (let x = Math.floor(i * sx); x < Math.floor((i + 1) * sx); x++) {
      const o = (y * DW + x) * 4; r += d[o]; g += d[o + 1]; b += d[o + 2]; n++;
    }
    const k = j * NX + i, q = quantize([r / n, g / n, b / n], pal);
    idx[k] = q; rgb.set(pal[q], k * 3);
  }
  return { idx, rgb, pal };
}
export const PALETTES = { A: PAL_A, B: PAL_B };

// 리본 색: 타일 색에 따라 KV 보색
export function ribbonFor(rgb) {
  const [r, g, b] = rgb, lum = (r * .3 + g * .59 + b * .11) / 255;
  if (g > 180 && r < 120 && b < 140) return hex2rgb(PURPLE);          // 초록 → 보라 리본
  if (b > 180 && r > 100 && g < 160) return hex2rgb(GREEN);           // 보라 → 초록 리본
  if (lum < .3) return hex2rgb(GREEN);                                 // 검정 → 초록 리본
  if (lum > .8) return hex2rgb(PURPLE);                                // 흰색 → 보라 리본
  return [235, 235, 230];
}

// 성장 순서 + 시간표
export const T_POP = 13.5;
const COUNT_KEYS = [[.55, 1], [1.15, 2], [1.6, 3], [1.95, 4], [2.25, 6], [2.6, 10], [3.2, 30], [4.0, 120], [5.0, 600], [6.0, 2500], [7.0, 8000], [8.0, 20000], [9.0, 38000], [10.0, 58000], [10.8, 74000], [11.4, N]];
export function countAt(t) {
  if (t < COUNT_KEYS[0][0]) return 0;
  for (let s = 0; s < COUNT_KEYS.length - 1; s++) {
    const [t0, c0] = COUNT_KEYS[s], [t1, c1] = COUNT_KEYS[s + 1];
    if (t < t1) return Math.floor(Math.exp(Math.log(c0) + (Math.log(c1) - Math.log(c0)) * (t - t0) / (t1 - t0)));
  }
  return N;
}
function landTime(k) {
  const c = k + 1;
  for (let s = 0; s < COUNT_KEYS.length - 1; s++) {
    const [t0, c0] = COUNT_KEYS[s], [t1, c1] = COUNT_KEYS[s + 1];
    if (c <= c1) return c0 === c1 ? t0 : t0 + (Math.log(c) - Math.log(c0)) / (Math.log(c1) - Math.log(c0)) * (t1 - t0);
  }
  return COUNT_KEYS[COUNT_KEYS.length - 1][0];
}
export function buildSchedule(idxA, palA) {
  // 시작점: 로고 '넾' 근처의 검정 타일
  const lum = k => { const p = palA[idxA[k]]; return (p[0] * .3 + p[1] * .59 + p[2] * .11) / 255; };
  let seed = 0, best = 1e9;
  const cx = 70, cy = 150;
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const k = j * NX + i; if (lum(k) > .2) continue;
    const d = (i - cx) ** 2 + (j - cy) ** 2; if (d < best) { best = d; seed = k; }
  }
  const si = seed % NX, sj = Math.floor(seed / NX), nz = makeNoise(5), R = rng(99);
  const keys = new Float32Array(N);
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const k = j * NX + i, dx = i - si, dy = j - sj, d = Math.hypot(dx, dy);
    const ang = Math.atan2(dy, dx);
    const wob = 1 + .45 * (fbm(nz, i / 14, j / 14, 3) - .5) + .15 * Math.sin(ang * 5 + d / 9);
    let v = d * wob + R() * 1.6;
    if (lum(k) < .2) v *= .82;                       // 로고(검정)가 먼저 드러나도록
    keys[k] = v;
  }
  keys[seed] = -1;
  const order = Array.from({ length: N }, (_, k) => k).sort((a, b) => keys[a] - keys[b]);
  const tLand = new Float32Array(N), tFall = new Float32Array(N), h0 = new Float32Array(N), rank = new Int32Array(N);
  order.forEach((k, r) => {
    rank[k] = r; tLand[k] = landTime(r);
    tFall[k] = .42 + .12 * R();
    h0[k] = (4.5 + 11 * Math.min(1, Math.max(0, (tLand[k] - 2) / 7)) ** 1.4) * (.8 + .4 * R());
  });
  tFall[order[0]] = tLand[order[0]] + .02; h0[order[0]] = 1.0;          // 0초부터 화면 안에서 낙하
  // 뚜껑 펑: 로고 중심에서 퍼지는 파동
  const pcx = 108, pcy = 152, tPop = new Float32Array(N);
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const k = j * NX + i; tPop[k] = T_POP + 1.6 * Math.pow(Math.hypot(i - pcx, j - pcy) / 256, .7) + .04 * R();
  }
  return { seed, si, sj, order, rank, tLand, tFall, h0, tPop };
}

// 바닥: 석고 + 붉은 분필 밑그림
export function groundTexture(logo, scale = 9.48) {
  const W = Math.round(NX * scale), H = Math.round(NY * scale), c = mk(W, H), g = c.getContext('2d');
  const im = g.createImageData(W, H), d = im.data, nz = makeNoise(31), nz2 = makeNoise(32);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const v = fbm(nz, x / 140, y / 140, 4), f = nz2(x / 3, y / 3);
    const k = .93 + .1 * (v - .5) + .05 * (f - .5), o = (y * W + x) * 4;
    d[o] = 222 * k; d[o + 1] = 210 * k; d[o + 2] = 190 * k; d[o + 3] = 255;
  }
  g.putImageData(im, 0, 0);
  const s = W / DW;
  g.save(); g.scale(s, s);
  // 연필 격자
  g.strokeStyle = 'rgba(90,80,70,.12)'; g.lineWidth = .6;
  for (let x = 0; x <= DW; x += 120) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, DH); g.stroke(); }
  for (let y = 0; y <= DH; y += 120) { g.beginPath(); g.moveTo(0, y); g.lineTo(DW, y); g.stroke(); }
  // 분필 밑그림: 스파이크 외곽 + 로고 외곽 + 글자 가이드
  const R = rng(8);
  const chalk = (pts, w = 1.1) => {
    for (let pass = 0; pass < 2; pass++) {
      g.strokeStyle = `rgba(170,92,78,${pass ? .1 : .3})`; g.lineWidth = w * (pass ? 2.6 : 1);
      g.beginPath(); pts.forEach(([x, y], j) => { const jx = x + (R() - .5) * 3, jy = y + (R() - .5) * 3; j ? g.lineTo(jx, jy) : g.moveTo(jx, jy); }); g.closePath(); g.stroke();
    }
  };
  for (const p of spikePolys(540, 850, 470)) chalk(p.shape);
  const lc = mk(DW, DH), lg = lc.getContext('2d');
  const { cx, cy, w } = LOGO_BOX, h = w * logo.height / logo.width;
  lg.drawImage(logo, cx - w / 2, cy - h / 2, w, h);
  const ld = lg.getImageData(0, 0, DW, DH).data;
  g.fillStyle = 'rgba(170,92,78,.3)';
  for (let y = 2; y < DH - 2; y += 1) for (let x = 2; x < DW - 2; x += 1) {
    const a = ld[(y * DW + x) * 4 + 3] > 128;
    if (!a) continue;
    if (ld[(y * DW + x + 1) * 4 + 3] < 128 || ld[(y * DW + x - 1) * 4 + 3] < 128 || ld[((y + 1) * DW + x) * 4 + 3] < 128 || ld[((y - 1) * DW + x) * 4 + 3] < 128) if (R() < .8) g.fillRect(x - .5, y - .5, 1.1, 1.1);
  }
  g.strokeStyle = 'rgba(178,84,70,.32)'; g.lineWidth = 1;
  [[990, 1075], [1085, 1180]].forEach(([a, b]) => { g.strokeRect(130, a, 820, b - a); });
  g.font = '34px Gowun'; g.fillStyle = 'rgba(178,74,62,.6)'; g.textAlign = 'left';
  g.fillText('넾다세일 — 82,944', 40, 60); g.fillText('10.26 ~ 11.8', 820, 1880);
  g.restore();
  return c;
}
