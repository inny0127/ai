// ───────────────── 주인공: 선물상자(=혜택) — 시대별 화풍 ─────────────────
function giftParts(s) {
  const P = () => new Path2D();
  const body = P(); body.rect(-.5 * s, -.18 * s, s, .68 * s);
  const lid = P(); lid.rect(-.56 * s, -.36 * s, 1.12 * s, .18 * s);
  const rib = P(); rib.rect(-.085 * s, -.36 * s, .17 * s, .86 * s);
  const bowL = P(); bowL.ellipse(-.21 * s, -.5 * s, .21 * s, .12 * s, -.35, 0, TAU);
  const bowR = P(); bowR.ellipse(.21 * s, -.5 * s, .21 * s, .12 * s, .35, 0, TAU);
  const knot = P(); knot.ellipse(0, -.43 * s, .09 * s, .08 * s, 0, 0, TAU);
  return { body, lid, rib, bowL, bowR, knot };
}
function giftSilhouette(ctx, g) { for (const k of ['bowL', 'bowR', 'lid', 'body', 'knot']) ctx.fill(g[k]); }

// 쪼아 새긴(암각화) 점 선
function peckLine(ctx, pts, o = {}) {
  const R = rng(o.seed || 1), r = o.r || 3.2, gap = o.gap || 5.5, jit = o.jit || 1.6;
  ctx.beginPath();
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / gap));
    for (let k = 0; k < n; k++) {
      const u = k / n, x = x0 + (x1 - x0) * u + (R() - .5) * 2 * jit, y = y0 + (y1 - y0) * u + (R() - .5) * 2 * jit;
      const q = r * (.55 + R() * .75);
      ctx.moveTo(x + q, y); ctx.arc(x, y, q, 0, TAU);
    }
  }
  ctx.fillStyle = o.color || '#efd6ad'; ctx.fill();
}
const ellPts = (cx, cy, rx, ry, rot = 0, n = 36, a0 = 0, a1 = TAU) => {
  const out = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + (a1 - a0) * i / n, x = rx * Math.cos(a), y = ry * Math.sin(a);
    out.push([cx + x * Math.cos(rot) - y * Math.sin(rot), cy + x * Math.sin(rot) + y * Math.cos(rot)]);
  }
  return out;
};
const rectPts = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];

let DOT_PAT = null;
function dotPattern(ctx) {
  if (!DOT_PAT) {
    const c = mkCanvas(10, 10), g = c.getContext('2d');
    g.fillStyle = '#111'; g.beginPath(); g.arc(5, 5, 2.9, 0, TAU); g.fill();
    DOT_PAT = c;
  }
  return ctx.createPattern(DOT_PAT, 'repeat');
}

// 조각보 보따리 (조선 민화 화풍)
function drawBojagi(ctx, s, t) {
  const body = new Path2D();
  body.moveTo(-.48 * s, -.12 * s);
  body.bezierCurveTo(-.58 * s, .2 * s, -.52 * s, .5 * s, -.3 * s, .52 * s);
  body.lineTo(.3 * s, .52 * s);
  body.bezierCurveTo(.52 * s, .5 * s, .58 * s, .2 * s, .48 * s, -.12 * s);
  body.bezierCurveTo(.25 * s, -.28 * s, -.25 * s, -.28 * s, -.48 * s, -.12 * s);
  const wig = Math.sin(t * 9) * .03 * s;
  const earL = new Path2D();
  earL.moveTo(-.12 * s, -.24 * s); earL.quadraticCurveTo(-.4 * s, -.55 * s + wig, -.46 * s, -.62 * s + wig);
  earL.quadraticCurveTo(-.25 * s, -.5 * s, -.02 * s, -.3 * s); earL.closePath();
  const earR = new Path2D();
  earR.moveTo(.12 * s, -.24 * s); earR.quadraticCurveTo(.4 * s, -.55 * s - wig, .46 * s, -.62 * s - wig);
  earR.quadraticCurveTo(.25 * s, -.5 * s, .02 * s, -.3 * s); earR.closePath();
  const knot = new Path2D(); knot.ellipse(0, -.28 * s, .12 * s, .09 * s, 0, 0, TAU);
  const pal = ['#c8102e', '#1f3f8f', '#e8b829', '#f4efe6', '#2b6e4f', '#d96aa7', '#1a1a1a', '#e86a2a'];
  const R = rng(55);
  ctx.save(); ctx.clip(body);
  const cols = [-.62, -.3, -.05, .22, .62], rows = [-.3, -.02, .22, .55];
  for (let i = 0; i < cols.length - 1; i++) for (let j = 0; j < rows.length - 1; j++) {
    const x0 = cols[i] * s + (R() - .5) * .06 * s, x1 = cols[i + 1] * s, y0 = rows[j] * s, y1 = rows[j + 1] * s + (R() - .5) * .05 * s;
    ctx.fillStyle = pal[Math.floor(R() * pal.length)];
    ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    ctx.strokeStyle = 'rgba(40,25,10,.85)'; ctx.lineWidth = .012 * s; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
  }
  ctx.restore();
  ctx.lineJoin = 'round';
  ctx.fillStyle = '#c8102e'; ctx.fill(earL); ctx.fillStyle = '#1f3f8f'; ctx.fill(earR);
  ctx.fillStyle = '#e8b829'; ctx.fill(knot);
  ctx.strokeStyle = '#1b130c'; ctx.lineWidth = .032 * s;
  for (const p of [body, earL, earR, knot]) ctx.stroke(p);
}

const PIX_GIFT = [
  '..kkk......kkk..',
  '.kyyyk....kyyyk.',
  '.kyYYyk..kyYYyk.',
  '..kyYYykkyYYyk..',
  '...kkyyyyyykk...',
  'kkkkkkkyykkkkkkk',
  'kwrrrrryyrrrrrrk',
  'kRRRRRRyyRRRRRRk',
  'kkkkkkkyykkkkkkk',
  '.kwrrrryyrrrrrk.',
  '.krrrrryyrrrrrk.',
  '.krrrrryyrrrrrk.',
  '.krrrrryyrrrrRk.',
  '.kRRRRRyYRRRRRk.',
  '.kRRRRRyYRRRRRk.',
  '.kkkkkkkkkkkkkk.',
];
const PIX_PAL = { k: '#000000', r: '#e0303a', R: '#9a1e27', y: '#ffd23f', Y: '#c99a10', w: '#ffffff' };
function drawPixelSprite(ctx, rows, pal, x, y, k) {
  const ox = Math.round(x - rows[0].length * k / 2), oy = Math.round(y - rows.length * k / 2);
  rows.forEach((row, j) => [...row].forEach((ch, i) => {
    if (pal[ch]) { ctx.fillStyle = pal[ch]; ctx.fillRect(ox + i * k, oy + j * k, k, k); }
  }));
}

function drawHero(ctx, style, h) {
  const { x, y, s, rot, t } = h;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  const g = giftParts(s);
  if (style === 'peck') {
    const seed = 100 + Math.floor(t * 8) * 7, col = '#f3dcb3';
    const o = { seed, r: Math.max(2.4, s * .022), gap: Math.max(4, s * .04), jit: s * .012, color: col };
    peckLine(ctx, rectPts(-.5 * s, -.18 * s, s, .68 * s), o);
    peckLine(ctx, rectPts(-.56 * s, -.36 * s, 1.12 * s, .18 * s), { ...o, seed: seed + 1 });
    peckLine(ctx, [[-.08 * s, -.36 * s], [-.08 * s, .5 * s]], { ...o, seed: seed + 2 });
    peckLine(ctx, [[.08 * s, -.36 * s], [.08 * s, .5 * s]], { ...o, seed: seed + 3 });
    peckLine(ctx, ellPts(-.21 * s, -.5 * s, .21 * s, .12 * s, -.35), { ...o, seed: seed + 4 });
    peckLine(ctx, ellPts(.21 * s, -.5 * s, .21 * s, .12 * s, .35), { ...o, seed: seed + 5 });
    for (let i = 0; i < 4; i++) {            // 몸통 빗금
      const xx = -.42 * s + i * .1 * s;
      peckLine(ctx, [[xx, .44 * s], [xx + .12 * s, -.12 * s]], { ...o, r: o.r * .7, seed: seed + 10 + i });
    }
    for (let i = 0; i < 3; i++) {            // 움직임 선
      const yy = (-.15 + i * .25) * s;
      peckLine(ctx, [[-1.15 * s + i * .1 * s, yy], [-.72 * s, yy]], { ...o, seed: seed + 20 + i });
    }
  } else if (style === 'bojagi') {
    ctx.strokeStyle = 'rgba(30,20,10,.55)'; ctx.lineWidth = .02 * s; ctx.lineCap = 'round';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath(); const yy = (-.1 + i * .22) * s;
      ctx.moveTo(-1.05 * s, yy); ctx.quadraticCurveTo(-.85 * s, yy - .06 * s, -.68 * s, yy); ctx.stroke();
    }
    drawBojagi(ctx, s, t);
  } else if (style === 'halftone') {
    ctx.fillStyle = '#e8dcc0'; giftSilhouette(ctx, g);
    ctx.fillStyle = dotPattern(ctx); ctx.fill(g.body); ctx.fill(g.bowL); ctx.fill(g.bowR);
    ctx.globalAlpha = .55; ctx.fill(g.lid); ctx.globalAlpha = 1;
    ctx.fillStyle = '#111'; ctx.fill(g.rib); ctx.fill(g.knot);
    ctx.strokeStyle = '#111'; ctx.lineWidth = .03 * s;
    for (const k of ['body', 'lid', 'bowL', 'bowR']) ctx.stroke(g[k]);
    ctx.lineWidth = .02 * s;
    for (let i = 0; i < 3; i++) { ctx.beginPath(); const yy = (-.15 + i * .25) * s; ctx.moveTo(-1.1 * s, yy); ctx.lineTo(-.7 * s, yy); ctx.stroke(); }
  } else if (style === 'riso') {
    ctx.globalCompositeOperation = 'multiply';
    ctx.save(); ctx.translate(.03 * s, .025 * s); ctx.fillStyle = '#ffe800'; giftSilhouette(ctx, g); ctx.restore();
    ctx.save(); ctx.translate(-.02 * s, 0); ctx.fillStyle = '#ff48b0';
    ctx.fill(g.rib); ctx.fill(g.bowL); ctx.fill(g.bowR); ctx.fill(g.lid); ctx.restore();
    ctx.save(); ctx.translate(.012 * s, -.018 * s); ctx.strokeStyle = '#0078bf'; ctx.lineWidth = .04 * s; ctx.lineJoin = 'round';
    for (const k of ['body', 'lid', 'bowL', 'bowR', 'knot']) ctx.stroke(g[k]);
    ctx.fillStyle = '#0078bf';
    for (let i = 0; i < 3; i++) ctx.fillRect(-1.15 * s + i * .08 * s, (-.17 + i * .25) * s, .4 * s, .04 * s);
    ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
  } else if (style === 'crt') {
    ctx.shadowColor = '#ff4d7a'; ctx.shadowBlur = .25 * s;
    ctx.fillStyle = '#ff2d55'; ctx.fill(g.body); ctx.shadowBlur = 0;
    ctx.fillStyle = '#ff7a95'; ctx.fill(g.lid);
    ctx.fillStyle = '#ffd54a'; ctx.fill(g.rib); ctx.fill(g.bowL); ctx.fill(g.bowR); ctx.fill(g.knot);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-.44 * s, -.12 * s, .1 * s, .55 * s);
    ctx.globalCompositeOperation = 'lighter'; ctx.lineWidth = .02 * s;
    ctx.strokeStyle = 'rgba(0,255,255,.55)'; ctx.save(); ctx.translate(.025 * s, 0); for (const k of ['body', 'lid', 'bowL', 'bowR']) ctx.stroke(g[k]); ctx.restore();
    ctx.strokeStyle = 'rgba(255,0,60,.55)'; ctx.save(); ctx.translate(-.025 * s, 0); for (const k of ['body', 'lid', 'bowL', 'bowR']) ctx.stroke(g[k]); ctx.restore();
    ctx.globalCompositeOperation = 'source-over';
    // 반짝이 (상품 조명)
    for (let i = 0; i < 3; i++) {
      const ph = (t * 1.7 + i * .33) % 1, a = Math.sin(ph * Math.PI);
      const px = [-.4, .45, .1][i] * s, py = [-.55, -.1, .35][i] * s, L = .16 * s * a;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath(); ctx.moveTo(px, py - L); ctx.lineTo(px + L * .18, py); ctx.lineTo(px, py + L); ctx.lineTo(px - L * .18, py); ctx.fill();
      ctx.beginPath(); ctx.moveTo(px - L, py); ctx.lineTo(px, py + L * .18); ctx.lineTo(px + L, py); ctx.lineTo(px, py - L * .18); ctx.fill();
    }
  } else if (style === 'flat') {
    ctx.save(); ctx.rotate(-rot);                 // 긴 그림자는 회전과 무관하게 45도
    ctx.fillStyle = 'rgba(0,60,55,.04)';
    for (let i = 4; i < s * 1.4; i += 6) { ctx.save(); ctx.translate(i, i); ctx.rotate(rot); giftSilhouette(ctx, g); ctx.restore(); }
    ctx.restore();
    ctx.fillStyle = '#ff6b6b'; ctx.fill(g.body);
    ctx.fillStyle = 'rgba(0,0,0,.09)'; ctx.fillRect(0, -.18 * s, .5 * s, .68 * s);
    ctx.fillStyle = '#ff8e8e'; ctx.fill(g.lid);
    ctx.fillStyle = '#ffd166'; ctx.fill(g.rib); ctx.fill(g.bowL); ctx.fill(g.bowR);
    ctx.fillStyle = '#f4b942'; ctx.fill(g.knot);
  } else if (style === 'glossy') {               // 2012 스큐어모피즘
    ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = .12 * s; ctx.shadowOffsetY = .06 * s;
    const bg = ctx.createLinearGradient(0, -.18 * s, 0, .5 * s); bg.addColorStop(0, '#f05a4a'); bg.addColorStop(1, '#9c1f14');
    ctx.fillStyle = bg; ctx.fill(g.body); ctx.shadowColor = 'transparent';
    const lg = ctx.createLinearGradient(0, -.36 * s, 0, -.18 * s); lg.addColorStop(0, '#ff8a7a'); lg.addColorStop(1, '#c8392b');
    ctx.fillStyle = lg; ctx.fill(g.lid);
    const rb = ctx.createLinearGradient(-.085 * s, 0, .085 * s, 0); rb.addColorStop(0, '#c99a1a'); rb.addColorStop(.45, '#fff2b0'); rb.addColorStop(1, '#b8860b');
    ctx.fillStyle = rb; ctx.fill(g.rib);
    const bw = ctx.createLinearGradient(0, -.62 * s, 0, -.38 * s); bw.addColorStop(0, '#fff2b0'); bw.addColorStop(1, '#c99a1a');
    ctx.fillStyle = bw; ctx.fill(g.bowL); ctx.fill(g.bowR); ctx.fill(g.knot);
    ctx.save(); ctx.clip(g.body);
    const gl = ctx.createLinearGradient(0, -.18 * s, 0, .16 * s); gl.addColorStop(0, 'rgba(255,255,255,.55)'); gl.addColorStop(1, 'rgba(255,255,255,.05)');
    ctx.fillStyle = gl; ctx.beginPath(); ctx.ellipse(0, -.18 * s, .62 * s, .32 * s, 0, 0, Math.PI); ctx.fill(); ctx.restore();
    ctx.strokeStyle = 'rgba(60,10,5,.8)'; ctx.lineWidth = .014 * s; for (const k of ['body', 'lid', 'bowL', 'bowR']) ctx.stroke(g[k]);
    ctx.setLineDash([.03 * s, .022 * s]); ctx.strokeStyle = 'rgba(255,230,200,.7)'; ctx.lineWidth = .008 * s;
    ctx.strokeRect(-.46 * s, -.14 * s, .92 * s, .6 * s); ctx.setLineDash([]);
  } else if (style === 'flat2') {                // 2014 플랫 일러스트
    ctx.lineJoin = 'round'; ctx.strokeStyle = '#2d3436'; ctx.lineWidth = .035 * s;
    ctx.fillStyle = '#e17055'; ctx.fill(g.body); ctx.fillStyle = '#fab1a0'; ctx.fill(g.lid);
    ctx.fillStyle = '#ffeaa7'; ctx.fill(g.rib); ctx.fill(g.bowL); ctx.fill(g.bowR); ctx.fill(g.knot);
    for (const k of ['body', 'lid', 'rib', 'bowL', 'bowR', 'knot']) ctx.stroke(g[k]);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(-.42 * s, -.1 * s, .08 * s, .5 * s);
  } else if (style === 'material') {             // 2018 머티리얼
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.28)'; ctx.shadowBlur = .16 * s; ctx.shadowOffsetY = .08 * s;
    ctx.fillStyle = '#ff4081'; giftSilhouette(ctx, g); ctx.restore();
    ctx.fillStyle = '#ff4081'; ctx.fill(g.body); ctx.fillStyle = '#f50057'; ctx.fill(g.lid);
    ctx.fillStyle = '#ffffff'; ctx.fill(g.rib); ctx.fillStyle = '#ffd740'; ctx.fill(g.bowL); ctx.fill(g.bowR); ctx.fill(g.knot);
    ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.fillRect(-.5 * s, -.18 * s, s, .05 * s);
  } else if (style === 'neon') {                 // 2020 네온
    const fl = .85 + .15 * Math.sin(t * 37) * Math.sin(t * 11);
    ctx.fillStyle = 'rgba(40,0,60,.55)'; giftSilhouette(ctx, g);
    ctx.lineJoin = 'round';
    for (const [col, lw, bl] of [['rgba(255,61,242,.35)', .07, .3], ['#ff3df2', .025, .12], ['#ffe6fd', .01, 0]]) {
      ctx.shadowColor = '#ff3df2'; ctx.shadowBlur = bl * s * fl; ctx.strokeStyle = col; ctx.lineWidth = lw * s;
      ctx.stroke(g.body); ctx.stroke(g.lid);
    }
    for (const [col, lw, bl] of [['rgba(45,226,255,.35)', .06, .3], ['#2de2ff', .022, .12], ['#e6fbff', .009, 0]]) {
      ctx.shadowColor = '#2de2ff'; ctx.shadowBlur = bl * s * fl; ctx.strokeStyle = col; ctx.lineWidth = lw * s;
      ctx.stroke(g.rib); ctx.stroke(g.bowL); ctx.stroke(g.bowR);
    }
    ctx.shadowColor = 'transparent';
  } else if (style === 'glass') {                // 2025 글래스모피즘
    const gg = ctx.createLinearGradient(-.5 * s, -.6 * s, .5 * s, .5 * s);
    gg.addColorStop(0, 'rgba(255,255,255,.42)'); gg.addColorStop(1, 'rgba(255,255,255,.08)');
    ctx.fillStyle = gg; ctx.fill(g.body); ctx.fill(g.lid);
    ctx.fillStyle = 'rgba(0,245,80,.55)'; ctx.fill(g.rib);
    ctx.fillStyle = 'rgba(145,98,255,.7)'; ctx.fill(g.bowL); ctx.fill(g.bowR); ctx.fill(g.knot);
    ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = .012 * s; for (const k of ['body', 'lid', 'bowL', 'bowR']) ctx.stroke(g[k]);
    ctx.save(); ctx.clip(g.body);
    const sh = ((t * .5) % 1.6 - .3) * s * 2;
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(sh - .5 * s, -.2 * s); ctx.lineTo(sh - .3 * s, -.2 * s); ctx.lineTo(sh - .7 * s, .55 * s); ctx.lineTo(sh - .9 * s, .55 * s); ctx.fill();
    ctx.restore();
    ctx.shadowColor = 'rgba(145,98,255,.8)'; ctx.shadowBlur = .2 * s; ctx.strokeStyle = 'rgba(255,255,255,.25)'; ctx.lineWidth = .005 * s; ctx.stroke(g.body); ctx.shadowColor = 'transparent';
  } else if (style === 'kv') {
    ctx.save(); ctx.translate(.05 * s, .06 * s); ctx.fillStyle = '#000'; giftSilhouette(ctx, g); ctx.restore();
    ctx.fillStyle = C.green; ctx.fill(g.body); ctx.fill(g.lid);
    ctx.fillStyle = C.purple; ctx.fill(g.rib); ctx.fill(g.bowL); ctx.fill(g.bowR); ctx.fill(g.knot);
    ctx.strokeStyle = '#000'; ctx.lineWidth = .045 * s; ctx.lineJoin = 'round';
    for (const k of ['body', 'lid', 'rib', 'bowL', 'bowR', 'knot']) ctx.stroke(g[k]);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = .035 * s; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-.44 * s, -.08 * s); ctx.lineTo(-.44 * s, .1 * s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-.48 * s, -.27 * s); ctx.lineTo(-.3 * s, -.27 * s); ctx.stroke();
  }
  ctx.restore();
}
