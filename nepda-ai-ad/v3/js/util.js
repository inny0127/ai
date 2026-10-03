// ───────────────────────── 공통 유틸 ─────────────────────────
const W = 1080, H = 1920, FPS = 60, DUR = 26;
const PW = 960, PH = 1200;            // 시대 패널 크기
const TAU = Math.PI * 2;

const C = {                           // 넾다세일 KV 컬러
  white: '#FFFFFF', green: '#00F550', purple: '#9162FF', black: '#000000', dark: '#222222',
  cream: '#EFE9DC',
};

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const E = {
  inOut: x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2,
  out: x => 1 - Math.pow(1 - x, 3),
  in: x => x * x * x,
  outQuint: x => 1 - Math.pow(1 - x, 5),
  outExpo: x => x >= 1 ? 1 : 1 - Math.pow(2, -10 * x),
  inExpo: x => x <= 0 ? 0 : Math.pow(2, 10 * x - 10),
  outBack: (x, s = 1.9) => { const c = s + 1; return 1 + c * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); },
  outElastic: x => x <= 0 ? 0 : x >= 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * TAU / 3) + 1,
  inOutSine: x => -(Math.cos(Math.PI * x) - 1) / 2,
};
// 도장 찍듯 큰 스케일에서 1로 꽂힘
function slam(t, t0, dur = .2, from = 2.2) {
  const p = prog(t, t0, t0 + dur);
  if (t < t0) return 0;
  return lerp(from, 1, E.outQuint(p)) - .06 * Math.sin(p * Math.PI);
}
function pop(t, t0, dur = .35) { return t < t0 ? 0 : E.outBack(prog(t, t0, t0 + dur)); }

function rng(seed) {
  return function () {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
function makeNoise(seed) {
  const r = rng(seed), N = 256, g = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) g[i] = r();
  const sm = t => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    const x0 = xi & 255, x1 = (xi + 1) & 255, y0 = (yi & 255) * N, y1 = ((yi + 1) & 255) * N;
    const a = g[y0 + x0], b = g[y0 + x1], c = g[y1 + x0], d = g[y1 + x1];
    const u = sm(xf), v = sm(yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}
function fbm(n, x, y, o = 4) {
  let s = 0, a = .5, f = 1, norm = 0;
  for (let i = 0; i < o; i++) { s += a * n(x * f, y * f); norm += a; a *= .5; f *= 2.03; }
  return s / norm;
}
const NOISE = makeNoise(7);
const n1 = t => NOISE(t, 3.7) * 2 - 1;     // 1D 노이즈(-1..1)

function mkCanvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
const CACHE = new Map();
function cached(key, w, h, fn) {
  let c = CACHE.get(key);
  if (!c) { c = mkCanvas(w, h); fn(c.getContext('2d'), w, h); CACHE.set(key, c); }
  return c;
}
function pixelTex(key, w, h, fn) {
  return cached(key, w, h, (ctx) => {
    const im = ctx.createImageData(w, h), d = im.data, out = [0, 0, 0, 255];
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      out[3] = 255; fn(x, y, out);
      const i = (y * w + x) * 4; d[i] = out[0]; d[i + 1] = out[1]; d[i + 2] = out[2]; d[i + 3] = out[3];
    }
    ctx.putImageData(im, 0, 0);
  });
}

// 텍스트
function font(ctx, fam, size, weight = '') { ctx.font = `${weight} ${size}px ${fam}`; }
function text(ctx, s, x, y, o = {}) {
  ctx.save();
  font(ctx, o.font || 'PretBlk', o.size || 40);
  ctx.textAlign = o.align || 'center';
  ctx.textBaseline = o.base || 'middle';
  ctx.letterSpacing = (o.ls || 0) + 'px';
  if (o.alpha !== undefined) ctx.globalAlpha *= o.alpha;
  if (o.stroke) {
    ctx.lineJoin = 'round'; ctx.miterLimit = 2;
    ctx.strokeStyle = o.stroke; ctx.lineWidth = o.sw || 8; ctx.strokeText(s, x, y);
  }
  if (o.color !== null) { ctx.fillStyle = o.color || '#000'; ctx.fillText(s, x, y); }
  ctx.restore();
}
function vtext(ctx, s, x, y, step, o = {}) {      // 세로쓰기
  [...s].forEach((ch, i) => text(ctx, ch, x, y + i * step, o));
}
function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }

// 장면 공통: 이미지 로드
const IMG = {};
function loadImg(name, src) {
  return new Promise((res, rej) => { const im = new Image(); im.onload = () => { IMG[name] = im; res(); }; im.onerror = rej; im.src = src; });
}
