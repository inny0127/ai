// ───────────────────────── 8개의 시대 패널 ─────────────────────────
// 각 era.draw(ctx, lt, hero, t): ctx = 960x1200 패널, lt = 그 시대의 로컬 시간(초), t = 전역 시간
// hero = {x,y,s,rot,t} (패널 좌표) 또는 null

// ── 01 암각화 ────────────────────────────────────────────
function rockBg() {
  return cached('rock', PW, PH, (ctx) => {
    const N2 = makeNoise(21);
    ctx.drawImage(pixelTex('rockpx', PW, PH, (x, y, o) => {
      const v = fbm(NOISE, x / 260, y / 260, 5), f = fbm(N2, x / 7, y / 7, 2);
      const strata = Math.sin((y + 90 * v) / 36) * .5 + .5;
      const c = .66 + .6 * (v - .5) + .14 * (f - .5) + .07 * strata;
      o[0] = 150 * c + 8; o[1] = 98 * c + 4; o[2] = 64 * c;
    }), 0, 0);
    const R = rng(4);
    for (let k = 0; k < 11; k++) {
      let x = R() * PW, y = R() * PH, a = R() * TAU;
      const pts = [[x, y]];
      for (let i = 0; i < 70; i++) { a += (R() - .5) * .7; x += Math.cos(a) * 11; y += Math.sin(a) * 11; pts.push([x, y]); }
      for (const [col, off, lw] of [['rgba(255,225,190,.10)', 1.5, 2], ['rgba(28,16,8,.55)', 0, 1.2 + R() * 2.4]]) {
        ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath();
        pts.forEach(([px, py], i) => i ? ctx.lineTo(px + off, py + off) : ctx.moveTo(px + off, py + off)); ctx.stroke();
      }
    }
    const v = ctx.createRadialGradient(PW / 2, PH / 2, 300, PW / 2, PH / 2, 900);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(20,8,0,.55)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, PW, PH);
  });
}
function peckFill(ctx, path, bx, by, bw, bh, n, seed, r = 3) {
  const R = rng(seed); ctx.beginPath();
  for (let i = 0; i < n; i++) {
    const x = bx + R() * bw, y = by + R() * bh;
    if (ctx.isPointInPath(path, x, y)) { const q = r * (.5 + R() * .8); ctx.moveTo(x + q, y); ctx.arc(x, y, q, 0, TAU); }
  }
  ctx.fillStyle = '#efd6ad'; ctx.fill();
}
function rockCarvings() {
  return cached('carv', PW, PH, (ctx) => {
    // 해
    peckLine(ctx, ellPts(800, 150, 56, 56), { seed: 1 });
    for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; peckLine(ctx, [[800 + 74 * Math.cos(a), 150 + 74 * Math.sin(a)], [800 + 112 * Math.cos(a), 150 + 112 * Math.sin(a)]], { seed: 2 + i }); }
    peckLine(ctx, ellPts(800, 150, 24, 24), { seed: 30 });
    // 고래 (반구대 암각화 모티프)
    const whale = (cx, cy, rx, ry, dir, seed) => {
      const p = new Path2D(); p.ellipse(cx, cy, rx, ry, 0, 0, TAU);
      peckFill(ctx, p, cx - rx, cy - ry, rx * 2, ry * 2, rx * ry * .05, seed, 3.2);
      peckLine(ctx, ellPts(cx, cy, rx, ry), { seed: seed + 1 });
      const tx = cx - dir * rx;
      peckLine(ctx, [[tx, cy], [tx - dir * 60, cy - 38], [tx - dir * 42, cy], [tx - dir * 60, cy + 38], [tx, cy]], { seed: seed + 2 });
      peckLine(ctx, [[cx + dir * rx * .5, cy - ry], [cx + dir * rx * .45, cy - ry - 40], [cx + dir * rx * .3, cy - ry - 60]], { seed: seed + 3 });
      peckLine(ctx, [[cx + dir * rx * .5, cy - ry], [cx + dir * rx * .62, cy - ry - 52]], { seed: seed + 4 });
    };
    whale(330, 215, 150, 52, 1, 40); whale(610, 345, 90, 32, -1, 50);
    // 소용돌이
    const sp = []; for (let i = 0; i < 90; i++) { const a = i * .2, r = 4 + i * .9; sp.push([130 + r * Math.cos(a), 560 + r * Math.sin(a)]); }
    peckLine(ctx, sp, { seed: 60 });
    // 사슴
    const dx = 800, dy = 620;
    const deer = new Path2D(); deer.ellipse(dx, dy, 70, 30, 0, 0, TAU);
    peckFill(ctx, deer, dx - 70, dy - 30, 140, 60, 200, 70, 3);
    peckLine(ctx, [[dx + 60, dy - 10], [dx + 90, dy - 60], [dx + 112, dy - 58]], { seed: 71 });
    peckLine(ctx, [[dx + 92, dy - 62], [dx + 80, dy - 110], [dx + 60, dy - 130]], { seed: 72 });
    peckLine(ctx, [[dx + 84, dy - 94], [dx + 108, dy - 128]], { seed: 73 });
    for (const lx of [-50, -30, 30, 50]) peckLine(ctx, [[dx + lx, dy + 20], [dx + lx + (lx > 0 ? 6 : -6), dy + 88]], { seed: 74 + lx });
    // 사냥꾼
    const hx = 140, hy = 790;
    peckLine(ctx, ellPts(hx, hy - 70, 15, 15), { seed: 80 });
    peckLine(ctx, [[hx, hy - 55], [hx, hy], [hx - 22, hy + 52]], { seed: 81 }); peckLine(ctx, [[hx, hy], [hx + 22, hy + 52]], { seed: 82 });
    peckLine(ctx, [[hx, hy - 40], [hx + 46, hy - 46]], { seed: 83 });
    peckLine(ctx, ellPts(hx + 52, hy - 46, 16, 46, 0, 20, -Math.PI / 2, Math.PI / 2), { seed: 84 });
    // 물고기 떼
    for (let i = 0; i < 4; i++) {
      const fx = 520 + i * 70, fy = 120 + (i % 2) * 30;
      peckLine(ctx, ellPts(fx, fy, 24, 10), { seed: 90 + i, r: 2.4 });
      peckLine(ctx, [[fx - 24, fy], [fx - 38, fy - 10], [fx - 38, fy + 10], [fx - 24, fy]], { seed: 95 + i, r: 2.4 });
    }
  });
}
function stickMan(ctx, x, y, armA, seed) {
  peckLine(ctx, ellPts(x, y - 118, 20, 20), { seed });
  peckLine(ctx, [[x, y - 96], [x, y - 20]], { seed: seed + 1 });
  peckLine(ctx, [[x, y - 20], [x - 32, y + 60]], { seed: seed + 2 }); peckLine(ctx, [[x, y - 20], [x + 32, y + 60]], { seed: seed + 3 });
  const hand = [x + 70 * Math.cos(armA), y - 80 + 70 * Math.sin(armA)];
  peckLine(ctx, [[x, y - 80], hand], { seed: seed + 4 });
  peckLine(ctx, [[x, y - 80], [x - 50 * Math.cos(armA) * .6, y - 40]], { seed: seed + 5 });
  return hand;
}
function drawFish(ctx, x, y, seed, sc = 1) {
  peckLine(ctx, ellPts(x, y, 30 * sc, 13 * sc), { seed, r: 2.8 });
  peckLine(ctx, [[x - 30 * sc, y], [x - 48 * sc, y - 14 * sc], [x - 48 * sc, y + 14 * sc], [x - 30 * sc, y]], { seed: seed + 1, r: 2.8 });
}
function drawShell(ctx, x, y, seed) {
  peckLine(ctx, ellPts(x, y, 26, 26, 0, 20, Math.PI, TAU), { seed, r: 2.8 });
  peckLine(ctx, [[x - 26, y], [x + 26, y]], { seed: seed + 1, r: 2.8 });
  for (let i = -2; i <= 2; i++) peckLine(ctx, [[x, y + 4], [x + i * 11, y - 22]], { seed: seed + 3 + i, r: 2.2 });
}
const ERA_PETRO = {
  style: 'peck',
  draw(ctx, lt, hero, t) {
    ctx.drawImage(rockBg(), 0, 0);
    ctx.drawImage(rockCarvings(), 0, 0);
    const f = Math.floor(t * 8), seed = 300 + (f % 3) * 50;
    const sw = E.inOut(prog(lt, .55, 1.25));
    const a1 = -.5 + .25 * Math.sin(f * 1.3), a2 = Math.PI + .5 - .25 * Math.sin(f * 1.1);
    const hA = stickMan(ctx, 290, 1010, a1, seed), hB = stickMan(ctx, 680, 1010, a2, seed + 10);
    // 물물교환: 물고기 ⇄ 조개
    const arc = (p, q, u, hgt) => [lerp(p[0], q[0], u), lerp(p[1], q[1], u) - Math.sin(u * Math.PI) * hgt];
    const fp = arc(hA, hB, sw, 120), sp = arc(hB, hA, sw, -60);
    drawFish(ctx, fp[0] + 10, fp[1] - 6, seed + 30);
    drawShell(ctx, sp[0], sp[1] - 4, seed + 40);
    peckLine(ctx, [[400, 1080], [580, 1080], [556, 1064]], { seed: seed + 50 });
    peckLine(ctx, [[580, 1112], [400, 1112], [424, 1128]], { seed: seed + 51 });
    if (hero) drawHero(ctx, 'peck', hero);
    const fl = .5 + .5 * n1(t * 5);
    const g = ctx.createRadialGradient(480, 560, 60, 480, 560, 820);
    g.addColorStop(0, `rgba(255,170,70,${.14 + .1 * fl})`); g.addColorStop(.6, 'rgba(120,50,0,.05)'); g.addColorStop(1, 'rgba(0,0,0,.3)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, PW, PH);
  },
};

// ── 02 민화 장터 ─────────────────────────────────────────
function hanjiBg() {
  return cached('hanji', PW, PH, (ctx) => {
    const N2 = makeNoise(33);
    ctx.drawImage(pixelTex('hanjipx', PW, PH, (x, y, o) => {
      const v = fbm(N2, x / 90, y / 90, 4), f = N2(x / 2.2, y / 2.2);
      const c = .95 + .07 * (v - .5) + .04 * (f - .5);
      o[0] = 238 * c; o[1] = 222 * c; o[2] = 186 * c;
    }), 0, 0);
    const R = rng(9);
    for (let i = 0; i < 900; i++) {
      const x = R() * PW, y = R() * PH, a = R() * TAU, L = 10 + R() * 40;
      ctx.strokeStyle = R() < .5 ? 'rgba(255,250,235,.35)' : 'rgba(150,120,70,.12)'; ctx.lineWidth = .6 + R();
      ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + Math.cos(a + 1) * L * .5, y + Math.sin(a + 1) * L * .5, x + Math.cos(a) * L, y + Math.sin(a) * L); ctx.stroke();
    }
    for (let i = 0; i < 7; i++) {
      const x = R() * PW, y = R() * PH, r = 60 + R() * 160;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(150,100,40,.10)'); g.addColorStop(1, 'rgba(150,100,40,0)');
      ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }
  });
}
function minhwaScene() {
  return cached('minhwa', PW, PH, (ctx) => {
    ctx.drawImage(hanjiBg(), 0, 0);
    const ink = '#22170f';
    // 청록 산수
    const mount = (base, peaks, c1, c2) => {
      const p = new Path2D(); p.moveTo(0, base);
      peaks.forEach(([x, y, w]) => { p.lineTo(x - w, base); p.quadraticCurveTo(x - w * .5, y - 10, x, y); p.quadraticCurveTo(x + w * .5, y - 10, x + w, base); });
      p.lineTo(PW, base); p.lineTo(PW, base + 40); p.lineTo(0, base + 40); p.closePath();
      const g = ctx.createLinearGradient(0, base - 260, 0, base); g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.fill(p); ctx.strokeStyle = ink; ctx.lineWidth = 3; ctx.stroke(p);
      const R = rng(base);
      ctx.strokeStyle = 'rgba(20,40,30,.5)'; ctx.lineWidth = 2;
      peaks.forEach(([x, y, w]) => { for (let i = 0; i < 9; i++) { const xx = x + (R() - .5) * w * .9, yy = y + 30 + R() * (base - y - 40); ctx.beginPath(); ctx.moveTo(xx, yy); ctx.lineTo(xx + 6, yy + 18); ctx.stroke(); } });
    };
    mount(380, [[520, 120, 120], [700, 170, 110], [860, 110, 120]], '#1f5f58', '#a7cdb0');
    mount(470, [[430, 260, 130], [640, 300, 120], [880, 250, 130]], '#2f7a62', '#c7dfbf');
    // 오색 구름
    const cloud = (cx, cy, sc) => {
      ctx.save(); ctx.translate(cx, cy); ctx.scale(sc, sc);
      const p = new Path2D();
      [[0, 0, 40], [44, -12, 34], [84, 4, 30], [-40, 8, 30], [20, 22, 30], [60, 24, 26]].forEach(([x, y, r]) => p.ellipse(x, y, r, r * .8, 0, 0, TAU));
      ctx.fillStyle = '#f7f2e6'; ctx.fill(p); ctx.strokeStyle = ink; ctx.lineWidth = 2.5; ctx.stroke(p);
      ctx.beginPath(); ctx.arc(-6, 2, 14, Math.PI * .2, Math.PI * 1.6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(110, 10); ctx.bezierCurveTo(150, 0, 170, 30, 210, 18); ctx.stroke();
      ctx.restore();
    };
    cloud(600, 90, 1); cloud(800, 300, .8);
    // 소나무
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3b2617'; ctx.lineWidth = 50;
    ctx.beginPath(); ctx.moveTo(170, 1200); ctx.bezierCurveTo(250, 900, 80, 700, 210, 300); ctx.stroke();
    ctx.lineWidth = 18;
    [[200, 560, 330, 440], [180, 700, 60, 600], [210, 380, 300, 300], [190, 450, 70, 420]].forEach(([a, b, c, d]) => { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo((a + c) / 2, b - 50, c, d); ctx.stroke(); });
    const R = rng(77);
    ctx.strokeStyle = 'rgba(240,200,150,.25)'; ctx.lineWidth = 3;
    for (let i = 0; i < 40; i++) { const y = 320 + R() * 860, x = 160 + 40 * Math.sin(y / 120) + R() * 20; ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI); ctx.stroke(); }
    [[90, 410], [330, 430], [250, 290], [60, 590], [210, 230], [350, 290]].forEach(([cx, cy]) => {
      ctx.fillStyle = '#2d5e47'; ctx.beginPath(); ctx.ellipse(cx, cy, 100, 40, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#143726'; ctx.lineWidth = 2.6;
      for (let i = 0; i < 60; i++) { const a = Math.PI + (i / 60) * Math.PI, x = cx + (R() - .5) * 150, y = cy + 14; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.cos(a) * 44, y + Math.sin(a) * 44); ctx.stroke(); }
    });
    // 모란
    [[850, 1010, 46], [930, 1110, 40], [760, 1120, 34]].forEach(([x, y, r]) => {
      ctx.fillStyle = '#3d7a3a';
      for (let i = 0; i < 5; i++) { const a = i / 5 * TAU + .3; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * r * 1.4, y + Math.sin(a) * r * 1.1 + 20, r * .8, r * .35, a, 0, TAU); ctx.fill(); }
      for (let k = 3; k > 0; k--) { ctx.fillStyle = ['#b3123a', '#e04a6b', '#f7a1b5'][3 - k]; ctx.beginPath(); for (let i = 0; i < 9; i++) { const a = i / 9 * TAU; ctx.ellipse(x + Math.cos(a) * r * k * .3, y + Math.sin(a) * r * k * .26, r * k * .32, r * k * .24, a, 0, TAU); } ctx.fill(); }
      ctx.fillStyle = '#f5c518'; ctx.beginPath(); ctx.arc(x, y, r * .18, 0, TAU); ctx.fill();
    });
    // 장터 차양(초가)
    ctx.fillStyle = '#c9a24e'; ctx.strokeStyle = ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(300, 820); ctx.lineTo(790, 820); ctx.lineTo(740, 880); ctx.lineTo(350, 880); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(110,80,25,.8)'; ctx.lineWidth = 2;
    for (let x = 310; x < 780; x += 11) { ctx.beginPath(); ctx.moveTo(x, 822); ctx.lineTo(x + (x - 545) * .1, 878); ctx.stroke(); }
    ctx.fillStyle = '#5a3b22'; ctx.fillRect(362, 880, 14, 300); ctx.fillRect(714, 880, 14, 300);
    ctx.fillStyle = '#7a5532'; ctx.fillRect(390, 1040, 310, 24); ctx.strokeStyle = ink; ctx.strokeRect(390, 1040, 310, 24);
    // 소쿠리
    const basket = (x, y, w) => {
      ctx.fillStyle = '#b88a4a'; ctx.beginPath(); ctx.ellipse(x, y, w, 26, 0, 0, Math.PI); ctx.lineTo(x - w, y); ctx.fill();
      ctx.strokeStyle = 'rgba(70,45,15,.9)'; ctx.lineWidth = 1.6;
      for (let i = -w; i < w; i += 9) { ctx.beginPath(); ctx.moveTo(x + i, y); ctx.lineTo(x + i * .9, y + 24); ctx.stroke(); }
      ctx.lineWidth = 3; ctx.strokeStyle = ink; ctx.beginPath(); ctx.ellipse(x, y, w, 9, 0, 0, TAU); ctx.stroke();
    };
    basket(470, 1036, 70); basket(625, 1036, 62);
    const persimmon = (x, y) => {
      ctx.fillStyle = '#e8641a'; ctx.beginPath(); ctx.arc(x, y, 17, 0, TAU); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = 'rgba(255,220,150,.6)'; ctx.beginPath(); ctx.arc(x - 6, y - 6, 5, 0, TAU); ctx.fill();
      ctx.fillStyle = '#2d5e2a'; ctx.fillRect(x - 6, y - 19, 12, 5);
    };
    [[440, 1020], [474, 1018], [508, 1022], [456, 994], [490, 994], [474, 970]].forEach(([x, y]) => persimmon(x, y));
    [[605, 1022], [640, 1022]].forEach(([x, y]) => persimmon(x, y));
    window.__persimmon = persimmon;
    // 장사꾼 (갓, 도포)
    ctx.fillStyle = '#f7f3ea'; ctx.strokeStyle = ink; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(300, 960); ctx.lineTo(352, 960); ctx.lineTo(380, 1190); ctx.lineTo(268, 1190); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(326, 962); ctx.lineTo(326, 1190); ctx.stroke();
    ctx.fillStyle = '#f2d3a8'; ctx.beginPath(); ctx.arc(326, 932, 25, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(326, 912, 62, 11, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.roundRect(306, 872, 40, 40, [14, 14, 0, 0]); ctx.fill();
    ctx.strokeStyle = '#111'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(306, 935); ctx.quadraticCurveTo(326, 975, 346, 935); ctx.stroke();
    // 손님 (한복)
    ctx.strokeStyle = ink; ctx.lineWidth = 3;
    ctx.fillStyle = '#c8102e'; ctx.beginPath(); ctx.moveTo(740, 1010); ctx.lineTo(810, 1010); ctx.lineTo(845, 1190); ctx.lineTo(705, 1190); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#f2c53d'; ctx.beginPath(); ctx.moveTo(748, 955); ctx.lineTo(802, 955); ctx.lineTo(815, 1014); ctx.lineTo(735, 1014); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#c8102e'; ctx.fillRect(770, 975, 10, 40);
    ctx.fillStyle = '#f2d3a8'; ctx.beginPath(); ctx.arc(775, 925, 24, 0, TAU); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#1b130c'; ctx.beginPath(); ctx.arc(775, 915, 25, Math.PI, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(800, 930, 13, 0, TAU); ctx.fill();
    // 세로 글씨 + 낙관
    vtext(ctx, '장터의', 890, 520, 66, { font: 'Brush', size: 74, color: '#1b130c' });
    vtext(ctx, '인심', 820, 560, 66, { font: 'Brush', size: 74, color: '#1b130c' });
    ctx.fillStyle = '#b5161b'; ctx.beginPath(); ctx.roundRect(852, 742, 76, 76, 6); ctx.fill();
    text(ctx, '덤', 890, 782, { font: 'SongMyung', size: 54, color: '#f7efe0' });
    // 단청 테두리
    const band = ['#b5161b', '#1f6f4a', '#1f3f8f', '#e8b829'];
    for (let i = 0; i < PW; i += 24) { ctx.fillStyle = band[(i / 24) % 4]; ctx.fillRect(i, 0, 24, 12); ctx.fillRect(i, PH - 12, 24, 12); }
    for (let j = 0; j < PH; j += 24) { ctx.fillStyle = band[(j / 24) % 4]; ctx.fillRect(0, j, 12, 24); ctx.fillRect(PW - 12, j, 12, 24); }
  });
}
const ERA_MINHWA = {
  style: 'bojagi',
  draw(ctx, lt, hero, t) {
    ctx.drawImage(minhwaScene(), 0, 0);
    minhwaScene(); const persimmon = window.__persimmon;
    // 까치 (소나무 가지 위, 깡총)
    const hop = Math.max(0, Math.sin(t * 7)) * 14, bx = 300, by = 230 - hop;
    ctx.save(); ctx.translate(bx, by); ctx.rotate(-.15);
    ctx.fillStyle = '#16233d'; ctx.beginPath(); ctx.moveTo(-30, 4); ctx.lineTo(-110, 34); ctx.lineTo(-104, 18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(0, 0, 44, 22, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(6, 8, 24, 11, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(40, -14, 15, 0, TAU); ctx.fill();
    ctx.fillStyle = '#e8b829'; ctx.beginPath(); ctx.moveTo(52, -16); ctx.lineTo(70, -12); ctx.lineTo(52, -9); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(44, -17, 3, 0, TAU); ctx.fill();
    const wa = Math.sin(t * 22) * .5 * (hop > 2 ? 1 : .15);
    ctx.save(); ctx.rotate(-.3 + wa); ctx.fillStyle = '#1f3f8f'; ctx.beginPath(); ctx.ellipse(-8, -10, 32, 12, -.2, 0, TAU); ctx.fill(); ctx.restore();
    ctx.restore();
    // 장사꾼이 감 하나 '덤'으로 얹어줌
    const u = E.inOut(prog(lt, .4, 1.0));
    const px = lerp(474, 622, u), py = lerp(970, 994, u) - Math.sin(u * Math.PI) * 120;
    ctx.strokeStyle = '#22170f'; ctx.lineWidth = 16; ctx.lineCap = 'round';
    const hx = lt < 1.05 ? px : 560, hy = lt < 1.05 ? py + 18 : 1000;
    ctx.strokeStyle = '#f7f3ea'; ctx.beginPath(); ctx.moveTo(350, 985); ctx.lineTo(hx - 14, hy); ctx.stroke();
    ctx.strokeStyle = '#22170f'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(350, 977); ctx.lineTo(hx - 14, hy - 8); ctx.stroke();
    persimmon(px, py);
    const dp = pop(t, (t - lt) + 1.0, .3);
    if (dp > 0) {
      ctx.save(); ctx.translate(560, 840); ctx.scale(dp, dp); ctx.rotate(-.12);
      text(ctx, '덤!', 0, 0, { font: 'Brush', size: 120, color: '#b5161b' });
      ctx.restore();
    }
    if (hero) drawHero(ctx, 'bojagi', hero);
  },
};

// ── 03 1977 신문 광고 ───────────────────────────────────
function halftoneImg() {
  return cached('htimg', 360, 360, (ctx) => {
    const src = mkCanvas(360, 360), g = src.getContext('2d');
    const gr = g.createRadialGradient(180, 140, 20, 180, 180, 240); gr.addColorStop(0, '#fff'); gr.addColorStop(1, '#666');
    g.fillStyle = gr; g.fillRect(0, 0, 360, 360);
    const box = (x, y, s, shade) => {
      g.fillStyle = shade; g.fillRect(x - s / 2, y - s * .3, s, s * .7);
      g.fillStyle = '#000'; g.fillRect(x - s * .08, y - s * .45, s * .16, s * .85);
      g.fillStyle = '#444'; g.fillRect(x - s * .55, y - s * .45, s * 1.1, s * .17);
    };
    box(120, 250, 150, '#8a8a8a'); box(250, 260, 130, '#b0b0b0'); box(185, 140, 120, '#9a9a9a');
    const d = g.getImageData(0, 0, 360, 360).data;
    ctx.fillStyle = '#e9dfc5'; ctx.beginPath(); ctx.arc(180, 180, 176, 0, TAU); ctx.fill(); ctx.save(); ctx.clip();
    ctx.fillStyle = '#151515';
    for (let y = 4; y < 360; y += 8) for (let x = 4 + ((y / 8) % 2) * 4; x < 360; x += 8) {
      const l = d[(y * 360 + x) * 4] / 255, r = (1 - l) * 4.6;
      if (r > .3) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
    }
    ctx.restore(); ctx.strokeStyle = '#111'; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(180, 180, 176, 0, TAU); ctx.stroke();
  });
}
function newsBg() {
  return cached('news', PW, PH, (ctx) => {
    const N2 = makeNoise(44);
    ctx.drawImage(pixelTex('newspx', PW, PH, (x, y, o) => {
      const e = Math.min(x, y, PW - x, PH - y) / 140, edge = 1 - Math.min(1, e);
      const v = fbm(N2, x / 60, y / 60, 3), f = N2(x / 1.7, y / 1.7);
      o[0] = 233 - 18 * edge + 10 * (v - .5) + 10 * (f - .5); o[1] = 223 - 30 * edge + 10 * (v - .5) + 10 * (f - .5); o[2] = 196 - 55 * edge + 8 * (v - .5) + 10 * (f - .5);
    }), 0, 0);
    ctx.fillStyle = '#1a1a1a';
    text(ctx, '第 10,026 號', 40, 50, { font: 'NotoSerifBlk', size: 24, align: 'left', color: '#222' });
    text(ctx, '1977年 10月 26日 (水曜日)', PW - 40, 50, { font: 'NotoSerifBlk', size: 24, align: 'right', color: '#222' });
    text(ctx, '經 濟', PW / 2, 50, { font: 'NotoSerifBlk', size: 30, color: '#222' });
    ctx.fillRect(30, 76, PW - 60, 4); ctx.fillRect(30, 84, PW - 60, 1.5);
    const R = rng(12), syl = '가나다라마바사아자차카타파하경제시장물가상회백화점가을추석선물대매출特價品目國民生活商街';
    ctx.globalAlpha = .55;
    for (let y = 1110; y < 1185; y += 22) {
      let s = ''; for (let i = 0; i < 46; i++) s += R() < .14 ? ' ' : syl[Math.floor(R() * syl.length)];
      text(ctx, s, 40, y, { font: 'NotoSerifBlk', size: 17, align: 'left', color: '#333' });
    }
    ctx.globalAlpha = 1;
    // 광고 박스
    ctx.strokeStyle = '#111'; ctx.lineWidth = 10; ctx.strokeRect(40, 108, 880, 980); ctx.lineWidth = 2; ctx.strokeRect(58, 126, 844, 944);
    text(ctx, '秋季 바겐세일', PW / 2, 412, { font: 'MyeongjoXB', size: 84, color: '#111', ls: 4 });
    [...'全品目特價'].forEach((ch, i) => {
      const x = 170 + i * 155; ctx.strokeStyle = '#111'; ctx.lineWidth = 5; ctx.strokeRect(x - 58, 478, 116, 116);
      text(ctx, ch, x, 538, { font: 'NotoSerifBlk', size: 84, color: '#111' });
    });
    ctx.drawImage(halftoneImg(), 70, 630, 330, 330);
    const items = [['선 물 세 트', '3,500', '1,900'], ['양 말 묶 음', '800', '450'], ['내 의 한 벌', '2,200', '1,300']];
    items.forEach(([n, a, b], i) => {
      const y = 690 + i * 100;
      text(ctx, n, 440, y, { font: 'MyeongjoXB', size: 40, align: 'left', color: '#111' });
      text(ctx, `定價 ${a}원`, 890, y - 4, { font: 'MyeongjoXB', size: 28, align: 'right', color: '#444' });
      ctx.fillStyle = '#111'; ctx.fillRect(760, y - 6, 130, 3);
      text(ctx, `特價 ${b}원`, 890, y + 36, { font: 'NotoSerifBlk', size: 38, align: 'right', color: '#111' });
      ctx.setLineDash([3, 6]); ctx.strokeStyle = '#555'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(640, y); ctx.lineTo(700, y); ctx.stroke(); ctx.setLineDash([]);
    });
    ctx.fillStyle = '#111'; ctx.fillRect(58, 975, 844, 95);
    text(ctx, '10月 26日 부터 11月 8日 까지', PW / 2, 1010, { font: 'NotoSerifBlk', size: 46, color: '#efe6cf', ls: 2 });
    text(ctx, '惠 澤 商 會   ·   서울 종로 네거리', PW / 2, 1050, { font: 'MyeongjoXB', size: 24, color: '#cfc6af' });
    ctx.fillStyle = 'rgba(80,60,30,.12)'; ctx.fillRect(0, 598, PW, 3); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(0, 601, PW, 2);
  });
}
function starburst(ctx, x, y, r1, r2, n, rot) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) { const a = rot + i / (n * 2) * TAU, r = i % 2 ? r1 : r2; i ? ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)) : ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a)); }
  ctx.closePath();
}
const ERA_NEWS = {
  style: 'halftone',
  draw(ctx, lt, hero, t) {
    ctx.drawImage(newsBg(), 0, 0);
    // 헤더 '大賣出' — 도장처럼 꽝
    ctx.fillStyle = '#111'; ctx.fillRect(58, 126, 844, 220);
    const k = lt < .25 ? 0 : slam(lt, .25, .16, 1.7);
    if (k > 0) {
      ctx.save(); ctx.translate(PW / 2, 236); ctx.scale(k, k);
      text(ctx, '大賣出', 0, 0, { font: 'NotoSerifBlk', size: 168, color: '#efe6cf', ls: 30 });
      ctx.restore();
    }
    text(ctx, '惠澤商會 創業記念', PW / 2, 150, { font: 'MyeongjoXB', size: 22, color: '#bdb39b', ls: 6 });
    // '限定' 스타버스트
    const sp = 1 + .06 * Math.sin(t * Math.PI * 4);
    ctx.save(); ctx.translate(800, 300); ctx.scale(sp, sp);
    starburst(ctx, 0, 0, 70, 104, 18, t * .6); ctx.fillStyle = '#efe6cf'; ctx.fill(); ctx.strokeStyle = '#111'; ctx.lineWidth = 6; ctx.stroke();
    text(ctx, '限定', 0, 0, { font: 'NotoSerifBlk', size: 50, color: '#111' });
    ctx.restore();
    // 날짜를 가리키는 화살표
    const bob = Math.sin(t * Math.PI * 4) * 10;
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.moveTo(108 + bob, 1012); ctx.lineTo(80 + bob, 990); ctx.lineTo(80 + bob, 1034); ctx.fill();
    ctx.beginPath(); ctx.moveTo(852 - bob, 1012); ctx.lineTo(880 - bob, 990); ctx.lineTo(880 - bob, 1034); ctx.fill();
    if (hero) drawHero(ctx, 'halftone', hero);
  },
};

// ── 04 1986 실크스크린 백화점 포스터 ─────────────────────
function grainTex(key, w, h, seed, col, dens) {
  return cached(key, w, h, (ctx) => {
    const R = rng(seed); ctx.fillStyle = col;
    for (let i = 0; i < w * h * dens; i++) ctx.fillRect(R() * w, R() * h, 1 + R() * 1.6, 1 + R() * 1.6);
  });
}
const ERA_POSTER = {
  style: 'riso',
  draw(ctx, lt, hero, t) {
    const V = '#e8432c', CR = '#f6e7c8', NV = '#1d2a5b', MU = '#f2b134', TE = '#2a9d8f';
    const j = Math.floor(t * 12), jx = (rng(j)() - .5) * 3, jy = (rng(j + 9)() - .5) * 3;
    ctx.fillStyle = V; ctx.fillRect(0, 0, PW, PH);
    ctx.save(); ctx.translate(480, 560); ctx.rotate(t * .25);
    ctx.fillStyle = CR;
    for (let i = 0; i < 24; i += 2) { const a0 = i / 24 * TAU, a1 = (i + 1) / 24 * TAU; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 1500, a0, a1); ctx.fill(); }
    ctx.restore();
    ctx.fillStyle = NV; ctx.beginPath(); ctx.arc(480, 560, 336, 0, TAU); ctx.fill();
    ctx.fillStyle = CR; ctx.beginPath(); ctx.arc(480 + jx, 560 + jy, 304, 0, TAU); ctx.fill();
    ctx.strokeStyle = MU; ctx.lineWidth = 10; ctx.setLineDash([18, 14]); ctx.beginPath(); ctx.arc(480, 560, 270, t, t + TAU); ctx.stroke(); ctx.setLineDash([]);
    // 멤피스 장식
    ctx.lineCap = 'round'; ctx.lineWidth = 14;
    [[60, 220, MU], [700, 870, TE], [640, 190, TE]].forEach(([x, y, c], i) => {
      ctx.strokeStyle = c; ctx.beginPath();
      for (let k = 0; k <= 40; k++) { const xx = x + k * 5.5, yy = y + Math.sin(k * .45 + t * 6 + i) * 18; k ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
      ctx.stroke();
    });
    [[130, 880, 60, MU], [860, 420, 48, TE], [110, 470, 40, NV]].forEach(([x, y, r, c], i) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(t * (i % 2 ? -1.4 : 1.1) + i); ctx.fillStyle = c;
      ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(r * .87, r * .5); ctx.lineTo(-r * .87, r * .5); ctx.fill(); ctx.restore();
    });
    ctx.fillStyle = CR;
    for (let a = 0; a < 6; a++) for (let b = 0; b < 4; b++) { ctx.beginPath(); ctx.arc(760 + a * 26, 80 + b * 26, 5, 0, TAU); ctx.fill(); }
    ctx.fillStyle = NV; ctx.fillRect(0, 0, PW, 150);
    text(ctx, "'86 가을 정기", 50, 80, { font: 'DoHyeon', size: 76, color: CR, align: 'left' });
    text(ctx, '惠澤百貨店', PW - 50, 80, { font: 'NotoSerifBlk', size: 44, color: MU, align: 'right' });
    // 미스레지스트레이션 큰 글씨
    const by = 980 + Math.sin(t * Math.PI * 2) * 4;
    ctx.globalCompositeOperation = 'multiply';
    text(ctx, '대바겐세일', 480 + 10, by + 8, { font: 'BHS', size: 196, color: TE });
    ctx.globalCompositeOperation = 'source-over';
    text(ctx, '대바겐세일', 480 + jx, by + jy, { font: 'BHS', size: 196, color: NV });
    ctx.fillStyle = MU; ctx.fillRect(0, 1090, PW, 110);
    text(ctx, '10月 26日 — 11月 8日', 480, 1145, { font: 'DoHyeon', size: 70, color: NV });
    if (hero) drawHero(ctx, 'riso', hero);
    ctx.globalAlpha = .55; ctx.drawImage(grainTex('grainA', PW, PH, 5, 'rgba(255,245,220,.9)', .05), 0, 0); ctx.globalAlpha = 1;
    ctx.globalAlpha = .22; ctx.drawImage(grainTex('grainB', PW, PH, 6, 'rgba(60,20,10,.8)', .03), 0, 0); ctx.globalAlpha = 1;
  },
};

// ── 05 1997 브라운관 TV 홈쇼핑 ───────────────────────────
const TV = { x: 110, y: 250, w: 600, h: 470 };     // 화면 영역
function tvRoom() {
  return cached('tvroom', PW, PH, (ctx) => {
    ctx.fillStyle = '#d9c9a3'; ctx.fillRect(0, 0, PW, PH);
    ctx.fillStyle = 'rgba(150,120,70,.22)';
    for (let y = 0; y < PH; y += 80) for (let x = (y / 80) % 2 * 40; x < PW; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, y - 22); ctx.quadraticCurveTo(x + 18, y, x, y + 22); ctx.quadraticCurveTo(x - 18, y, x, y - 22); ctx.fill();
      ctx.beginPath(); ctx.arc(x, y - 30, 4, 0, TAU); ctx.fill();
    }
    // 장식장
    const wg = ctx.createLinearGradient(0, 960, 0, PH); wg.addColorStop(0, '#7a4a26'); wg.addColorStop(1, '#4e2c14');
    ctx.fillStyle = wg; ctx.fillRect(0, 960, PW, 240);
    ctx.strokeStyle = 'rgba(40,20,5,.5)'; ctx.lineWidth = 2;
    for (let y = 975; y < PH; y += 14) { ctx.beginPath(); ctx.moveTo(0, y); for (let x = 0; x <= PW; x += 40) ctx.lineTo(x, y + Math.sin(x / 70 + y) * 3); ctx.stroke(); }
    ctx.fillStyle = '#3a200c'; ctx.fillRect(0, 960, PW, 14);
    // 안테나
    ctx.strokeStyle = '#999'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(420, 175); ctx.lineTo(260, 30); ctx.moveTo(440, 175); ctx.lineTo(600, 20); ctx.stroke();
    ctx.fillStyle = '#bbb'; ctx.beginPath(); ctx.arc(260, 30, 9, 0, TAU); ctx.arc(600, 20, 9, 0, TAU); ctx.fill();
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.ellipse(430, 180, 50, 16, 0, 0, TAU); ctx.fill();
    // TV 본체
    const bg = ctx.createLinearGradient(0, 180, 0, 900); bg.addColorStop(0, '#4a4a4a'); bg.addColorStop(1, '#1f1f1f');
    ctx.fillStyle = bg; rr(ctx, 50, 180, 860, 760, 46); ctx.fill();
    ctx.strokeStyle = '#666'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#0c0c0c'; rr(ctx, TV.x - 30, TV.y - 30, TV.w + 60, TV.h + 60, 50); ctx.fill();
    // 레이스 덮개
    ctx.fillStyle = '#f8f5ee';
    ctx.beginPath(); ctx.moveTo(220, 182); ctx.lineTo(720, 182);
    for (let i = 0; i <= 20; i++) { const x = 720 - i * 25; ctx.arc(x, 208, 13, 0, Math.PI); }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(180,170,150,.6)';
    for (let i = 0; i < 20; i++) { ctx.beginPath(); ctx.arc(232 + i * 25, 196, 4, 0, TAU); ctx.fill(); }
    // 스피커 + 다이얼
    ctx.fillStyle = '#151515'; rr(ctx, 760, 260, 110, 300, 14); ctx.fill();
    ctx.fillStyle = '#2c2c2c';
    for (let y = 278; y < 550; y += 12) for (let x = 776; x < 860; x += 12) { ctx.beginPath(); ctx.arc(x, y, 3.4, 0, TAU); ctx.fill(); }
    [[815, 620], [815, 720]].forEach(([x, y]) => {
      const g = ctx.createRadialGradient(x - 10, y - 10, 4, x, y, 40); g.addColorStop(0, '#888'); g.addColorStop(1, '#222');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 38, 0, TAU); ctx.fill();
      ctx.fillStyle = '#ddd'; ctx.fillRect(x - 3, y - 34, 6, 22);
    });
    text(ctx, 'COLOR TV', 815, 820, { font: 'PretB', size: 22, color: '#999', ls: 3 });
    ctx.fillStyle = '#c7a14a'; ctx.fillRect(100, 860, 120, 8);
    ctx.fillStyle = '#2a2a2a'; ctx.fillRect(110, 940, 40, 22); ctx.fillRect(810, 940, 40, 22);
    // 화분
    ctx.fillStyle = '#a0522d'; ctx.beginPath(); ctx.moveTo(40, 1000); ctx.lineTo(110, 1000); ctx.lineTo(100, 1090); ctx.lineTo(50, 1090); ctx.fill();
    ctx.fillStyle = '#2f6b3a';
    for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.ellipse(75 + (i - 3) * 14, 960 - Math.abs(i - 3) * -6, 12, 46, (i - 3) * .3, 0, TAU); ctx.fill(); }
  });
}
const ERA_CRT = {
  style: 'crt',
  draw(ctx, lt, hero, t) {
    ctx.drawImage(tvRoom(), 0, 0);
    ctx.save(); rr(ctx, TV.x, TV.y, TV.w, TV.h, 34); ctx.clip();
    const g = ctx.createLinearGradient(0, TV.y, 0, TV.y + TV.h); g.addColorStop(0, '#0a2a8f'); g.addColorStop(1, '#5a168c');
    ctx.fillStyle = g; ctx.fillRect(TV.x, TV.y, TV.w, TV.h);
    const sp = ctx.createRadialGradient(410, 470, 10, 410, 470, 300); sp.addColorStop(0, 'rgba(255,255,255,.35)'); sp.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = sp; ctx.fillRect(TV.x, TV.y, TV.w, TV.h);
    // 턴테이블
    ctx.fillStyle = '#ccc'; ctx.beginPath(); ctx.ellipse(410, 640, 190, 34, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#888'; ctx.beginPath(); ctx.ellipse(410, 652, 190, 34, 0, 0, Math.PI); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 3;
    for (let i = 0; i < 6; i++) { const a = t * 3 + i * 1.05; ctx.beginPath(); ctx.moveTo(410, 640); ctx.lineTo(410 + 190 * Math.cos(a), 640 + 34 * Math.sin(a)); ctx.stroke(); }
    const blink = Math.floor(t * 4) % 2;
    ctx.fillStyle = '#e8001c'; ctx.fillRect(TV.x + 20, TV.y + 20, 96, 40);
    text(ctx, '생방송', TV.x + 68, TV.y + 41, { font: 'Jua', size: 28, color: '#fff' });
    if (blink) text(ctx, '지금 바로 전화주세요!', 410, TV.y + 100, { font: 'Jua', size: 48, color: '#fff', stroke: '#e8001c', sw: 10 });
    text(ctx, '☎ 1026-1108', 410, TV.y + 162, { font: 'Jua', size: 56, color: '#ffe14d', stroke: '#200050', sw: 8 });
    const left = Math.max(3, 37 - Math.floor(prog(lt, .2, 1.8) * 34));
    text(ctx, `남은 수량 ${left}개`, TV.x + TV.w - 20, TV.y + 230, { font: 'Jua', size: 34, color: '#fff', align: 'right' });
    ctx.save(); ctx.translate(TV.x + TV.w - 90, TV.y + 320); ctx.rotate(.2 + Math.sin(t * 9) * .05);
    starburst(ctx, 0, 0, 52, 74, 14, 0); ctx.fillStyle = blink ? '#ffe14d' : '#ff2d2d'; ctx.fill();
    text(ctx, '주문', 0, -14, { font: 'Jua', size: 30, color: blink ? '#e8001c' : '#fff' }); text(ctx, '폭주', 0, 18, { font: 'Jua', size: 30, color: blink ? '#e8001c' : '#fff' });
    ctx.restore();
    ctx.fillStyle = '#ffd400'; ctx.fillRect(TV.x, TV.y + TV.h - 76, TV.w, 56);
    text(ctx, '★ 한정수량 특별구성 ★', 410, TV.y + TV.h - 47, { font: 'DoHyeon', size: 40, color: '#1a0a40' });
    ctx.restore();
    if (hero) drawHero(ctx, 'crt', hero);
    // 화면 효과: 스캔라인, VHS, 유리 반사
    ctx.save(); rr(ctx, TV.x, TV.y, TV.w, TV.h, 34); ctx.clip();
    const band = ((t * .7) % 1.3) * TV.h + TV.y - 60;
    ctx.drawImage(ctx.canvas, TV.x, band, TV.w, 26, TV.x + 9, band, TV.w, 26);
    ctx.fillStyle = 'rgba(0,0,0,.28)'; for (let y = TV.y; y < TV.y + TV.h; y += 4) ctx.fillRect(TV.x, y, TV.w, 1.6);
    ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(TV.x, band, TV.w, 26);
    text(ctx, '▶ PLAY', TV.x + 140, TV.y + 42, { font: 'GalmuriB', size: 30, color: '#fff', align: 'left', stroke: '#000', sw: 4 });
    text(ctx, '1997.10.26  PM 08:15', TV.x + 24, TV.y + TV.h - 100, { font: 'GalmuriB', size: 26, color: '#fff', align: 'left', stroke: '#000', sw: 4 });
    const vg = ctx.createRadialGradient(410, 485, 200, 410, 485, 430); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)');
    ctx.fillStyle = vg; ctx.fillRect(TV.x, TV.y, TV.w, TV.h);
    ctx.fillStyle = 'rgba(255,255,255,.07)'; ctx.beginPath(); ctx.moveTo(TV.x, TV.y); ctx.lineTo(TV.x + 330, TV.y); ctx.lineTo(TV.x + 120, TV.y + TV.h); ctx.lineTo(TV.x, TV.y + TV.h); ctx.fill();
    ctx.restore();
  },
};

// ── 06 2003 픽셀 인터넷 쇼핑몰 ───────────────────────────
const LO = mkCanvas(240, 300), LX = LO.getContext('2d');
function bevel(c, x, y, w, h, inset) {
  c.fillStyle = '#c0c0c0'; c.fillRect(x, y, w, h);
  c.fillStyle = inset ? '#404040' : '#ffffff'; c.fillRect(x, y, w, 1); c.fillRect(x, y, 1, h);
  c.fillStyle = inset ? '#ffffff' : '#404040'; c.fillRect(x, y + h - 1, w, 1); c.fillRect(x + w - 1, y, 1, h);
}
function ptext(c, s, x, y, col, o = {}) {
  c.font = `${o.size || 11}px ${o.bold ? 'GalmuriB' : 'Galmuri'}`; c.textBaseline = 'top'; c.textAlign = o.align || 'left'; c.letterSpacing = '0px';
  c.fillStyle = col; c.fillText(s, Math.round(x), Math.round(y));
}
const PIX_ICONS = {
  shirt: ['..kk....kk..', '.kbbk..kbbk.', 'kbbbbkkbbbbk', 'kbbbbbbbbbbk', '.kkbbbbbbkk.', '..kbbbbbbk..', '..kbbbbbbk..', '..kbbbbbbk..', '..kkkkkkkk..'],
  cd: ['...kkkkk...', '..kgggggk..', '.kggwwgggk.', 'kgggw.kgggk', 'kggg.k.gggk', 'kgggk.wgggk', '.kggggggwk.', '..kgggggk..', '...kkkkk...'],
  phone: ['.kkkkkk.', 'kwwwwwwk', 'kwccccwk', 'kwccccwk', 'kwccccwk', 'kwwwwwwk', 'kwkwkwwk', 'kwwwwwwk', '.kkkkkk.'],
};
const PIX_IPAL = { k: '#000', b: '#2b62d9', g: '#b8b8c8', w: '#fff', c: '#38c8e8' };
const CURSOR = ['k.........', 'kk........', 'kwk.......', 'kwwk......', 'kwwwk.....', 'kwwwwk....', 'kwwwwwk...', 'kwwwwwwk..', 'kwwwwkkkk.', 'kwkwwk....', 'kk.kwwk...', 'k...kwwk..', '.....kk...'];
const ERA_PIXEL = {
  style: 'pixel',
  draw(ctx, lt, hero, t) {
    const c = LX; c.imageSmoothingEnabled = false;
    c.fillStyle = '#008080'; c.fillRect(0, 0, 240, 300);
    c.fillStyle = '#007070'; for (let y = 0; y < 300; y += 2) for (let x = (y / 2) % 2; x < 240; x += 4) c.fillRect(x, y, 1, 1);
    bevel(c, 6, 8, 228, 268, false);
    const tg = c.createLinearGradient(9, 0, 231, 0); tg.addColorStop(0, '#000080'); tg.addColorStop(1, '#1084d0');
    c.fillStyle = tg; c.fillRect(9, 11, 222, 14);
    ptext(c, '혜택몰 - 웹 브라우저', 13, 12, '#fff', { bold: true });
    [0, 1, 2].forEach(i => { bevel(c, 186 + i * 15, 13, 13, 11, false); });
    ptext(c, '_', 189, 10, '#000'); c.fillStyle = '#000'; c.strokeStyle = '#000'; c.strokeRect(205.5, 15.5, 6, 6); ptext(c, 'x', 219, 12, '#000', { bold: true });
    ptext(c, '파일 편집 보기 즐겨찾기', 12, 28, '#000');
    ptext(c, '주소', 12, 43, '#000'); bevel(c, 36, 41, 194, 14, true); c.fillStyle = '#fff'; c.fillRect(37, 42, 192, 12);
    ptext(c, 'http://www.혜택몰.co.kr', 40, 43, '#000');
    c.fillStyle = '#fff'; c.fillRect(10, 58, 220, 214);
    // 배너
    const hg = c.createLinearGradient(10, 0, 230, 0); ['#ff3c3c', '#ffb800', '#3cd23c', '#3c8cff', '#c83cff'].forEach((col, i) => hg.addColorStop(i / 4, col));
    c.fillStyle = hg; c.fillRect(10, 58, 220, 30);
    ptext(c, '★혜택몰★', 18, 62, '#fff', { size: 22, bold: true });
    if (Math.floor(t * 4) % 2) { c.fillStyle = '#ff0000'; c.fillRect(178, 64, 44, 17); ptext(c, 'NEW!', 182, 67, '#ffff00', { bold: true }); }
    // 전광판
    c.fillStyle = '#000'; c.fillRect(10, 90, 220, 14);
    c.save(); c.beginPath(); c.rect(10, 90, 220, 14); c.clip();
    const mq = '★☆ 회원가입하면 쿠폰 3,000원 증정!! ☆★   ';
    c.font = '11px Galmuri'; const mw = c.measureText(mq).width; const mx = 230 - ((t * 45) % (mw + 0));
    ptext(c, mq, mx, 92, '#ffea00'); ptext(c, mq, mx + mw, 92, '#ffea00');
    c.restore();
    // 상품
    const prods = [['shirt', '티셔츠', '9,900원'], ['cd', '음반', '8,500원'], ['phone', '휴대폰', '99,000원']];
    prods.forEach(([ic, nm, pr], i) => {
      const x = 14 + i * 72;
      c.strokeStyle = '#999'; c.strokeRect(x + .5, 108.5, 68, 84);
      drawPixelSprite(c, PIX_ICONS[ic], PIX_IPAL, x + 34, 128, 2);
      ptext(c, nm, x + 34, 146, '#000', { align: 'center' });
      ptext(c, pr, x + 34, 158, '#d00000', { align: 'center', bold: true });
      const pressed = i === 1 && lt > .95 && lt < 1.12;
      bevel(c, x + 6, 174, 56, 15, pressed); ptext(c, '장바구니', x + 34 + (pressed ? 1 : 0), 176 + (pressed ? 1 : 0), '#000', { align: 'center' });
    });
    c.fillStyle = '#000'; c.fillRect(14, 198, 212, 15);
    ptext(c, '방문자 0001026  ·  축 오픈', 120, 200, '#3cff3c', { align: 'center' });
    for (let x = 10; x < 230; x += 8) { c.fillStyle = '#ffd400'; c.fillRect(x, 218, 4, 8); c.fillStyle = '#000'; c.fillRect(x + 4, 218, 4, 8); }
    ptext(c, '공사중! 더 많은 혜택 준비중', 120, 230, '#000', { align: 'center' });
    // 작업표시줄
    bevel(c, 0, 282, 240, 18, false); bevel(c, 2, 284, 42, 14, false); ptext(c, '시작', 10, 285, '#000', { bold: true });
    bevel(c, 186, 284, 52, 14, true); ptext(c, '10:26', 194, 285, '#000');
    // 팝업
    if (lt > 1.05) {
      const k = Math.min(1, (lt - 1.05) / .08);
      bevel(c, 40, 120, 160, 66, false);
      c.fillStyle = tg; c.fillRect(43, 123, 154, 13); ptext(c, '알림', 47, 124, '#fff', { bold: true });
      if (k >= 1) {
        c.fillStyle = '#ffd400'; c.beginPath(); c.arc(58, 150, 8, 0, TAU); c.fill(); ptext(c, '!', 56, 144, '#000', { bold: true });
        ptext(c, '쿠폰이 발급되었습니다!', 72, 144, '#000');
        bevel(c, 96, 164, 48, 16, false); ptext(c, '확인', 120, 166, '#000', { align: 'center' });
      }
    }
    if (hero) {
      const k = Math.max(2, Math.round(hero.s / 4 / 16));
      drawPixelSprite(c, PIX_GIFT, PIX_PAL, hero.x / 4, hero.y / 4, k);
      const sp = Math.floor(t * 6) % 2;
      c.fillStyle = '#fff';
      [[-1, -1], [1, -.3], [-.7, .8]].forEach(([ax, ay], i) => {
        if ((sp + i) % 2) { const px = Math.round(hero.x / 4 + ax * hero.s / 6.5), py = Math.round(hero.y / 4 + ay * hero.s / 7); c.fillRect(px - 1, py - 4, 2, 9); c.fillRect(px - 4, py - 1, 9, 2); }
      });
      c.fillStyle = 'rgba(255,255,255,.8)';
      for (let i = 0; i < 3; i++) c.fillRect(Math.round(hero.x / 4 - hero.s / 4 * .65 - 14 - i * 4), Math.round(hero.y / 4 - 6 + i * 6), 10, 2);
    }
    // 커서
    const cu = E.inOut(prog(lt, .35, .9));
    const cx = lerp(210, 14 + 72 + 40, cu), cy = lerp(260, 183, cu);
    drawPixelSprite(c, CURSOR, { k: '#000', w: '#fff' }, cx + 5, cy + 6, 1);
    ctx.imageSmoothingEnabled = false; ctx.drawImage(LO, 0, 0, 240, 300, 0, 0, PW, PH); ctx.imageSmoothingEnabled = true;
  },
};

// ── 07 2014 플랫 UI 모바일 ───────────────────────────────
function longShadow(ctx, drawShape, len, col) {
  ctx.save(); ctx.fillStyle = col;
  for (let i = 2; i < len; i += 5) { ctx.save(); ctx.translate(i, i); drawShape(); ctx.restore(); }
  ctx.restore();
}
const ERA_FLAT = {
  style: 'flat',
  draw(ctx, lt, hero, t) {
    ctx.fillStyle = '#4ecdc4'; ctx.fillRect(0, 0, PW, PH);
    ctx.fillStyle = '#5fd6cd'; ctx.beginPath(); ctx.arc(120, 180, 260, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(880, 1060, 320, 0, TAU); ctx.fill();
    // 떠다니는 아이콘
    const icons = [[110, 600, '#ffe66d', 'tag'], [850, 300, '#ff6b6b', 'heart'], [120, 1000, '#ffffff', 'cart'], [860, 760, '#ffe66d', 'star']];
    icons.forEach(([x, y, col, kind], i) => {
      const yy = y + Math.sin(t * 2 + i) * 14;
      const shape = () => {
        ctx.beginPath();
        if (kind === 'heart') { ctx.moveTo(x, yy + 26); ctx.bezierCurveTo(x - 60, yy - 14, x - 26, yy - 50, x, yy - 18); ctx.bezierCurveTo(x + 26, yy - 50, x + 60, yy - 14, x, yy + 26); }
        else if (kind === 'star') { starburst(ctx, x, yy, 18, 44, 5, -Math.PI / 2); }
        else if (kind === 'tag') { ctx.moveTo(x - 40, yy - 30); ctx.lineTo(x + 20, yy - 30); ctx.lineTo(x + 50, yy); ctx.lineTo(x + 20, yy + 30); ctx.lineTo(x - 40, yy + 30); ctx.closePath(); }
        else { ctx.roundRect(x - 44, yy - 30, 88, 56, 10); }
        ctx.fill();
      };
      longShadow(ctx, shape, 90, 'rgba(0,80,75,.05)');
      ctx.fillStyle = col; shape();
    });
    // 폰
    const px = 230, py = 90, pw = 500, ph = 1020;
    longShadow(ctx, () => { rr(ctx, px, py, pw, ph, 70); ctx.fill(); }, 260, 'rgba(0,70,65,.022)');
    ctx.fillStyle = '#2d3436'; rr(ctx, px, py, pw, ph, 70); ctx.fill();
    ctx.fillStyle = '#fff'; rr(ctx, px + 22, py + 90, pw - 44, ph - 200, 6); ctx.fill();
    ctx.fillStyle = '#636e72'; rr(ctx, px + 200, py + 44, 100, 10, 5); ctx.fill();
    ctx.strokeStyle = '#636e72'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(px + pw / 2, py + ph - 56, 30, 0, TAU); ctx.stroke();
    const sx = px + 22, sy = py + 90, sw = pw - 44;
    ctx.fillStyle = '#ff6b6b'; ctx.fillRect(sx, sy, sw, 110);
    text(ctx, '쇼핑', sx + 30, sy + 62, { font: 'PretXB', size: 40, color: '#fff', align: 'left' });
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(sx + sw - 60, sy + 56, 16, 0, TAU); ctx.moveTo(sx + sw - 48, sy + 68); ctx.lineTo(sx + sw - 34, sy + 82); ctx.stroke();
    const cards = ['#ffe66d', '#a8e6cf', '#ffd3b6', '#dcedc1'];
    cards.forEach((col, i) => {
      const cx = sx + 20 + (i % 2) * 208, cy = sy + 135 + Math.floor(i / 2) * 290;
      ctx.fillStyle = '#f5f6fa'; rr(ctx, cx, cy, 196, 270, 12); ctx.fill();
      ctx.fillStyle = col; rr(ctx, cx, cy, 196, 180, [12, 12, 0, 0]); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.beginPath(); ctx.arc(cx + 98, cy + 90, 50, 0, TAU); ctx.fill();
      ctx.fillStyle = '#2d3436'; ctx.fillRect(cx + 14, cy + 200, 120, 14); ctx.fillStyle = '#ff6b6b'; ctx.fillRect(cx + 14, cy + 228, 80, 16);
      const liked = i === 1 && lt > .9;
      const hs = liked ? pop(lt, .9, .3) : 1;
      ctx.save(); ctx.translate(cx + 170, cy + 236); ctx.scale(hs, hs);
      ctx.fillStyle = liked ? '#ff6b6b' : '#b2bec3'; ctx.beginPath(); ctx.moveTo(0, 10); ctx.bezierCurveTo(-22, -6, -10, -20, 0, -8); ctx.bezierCurveTo(10, -20, 22, -6, 0, 10); ctx.fill();
      ctx.restore();
      if (liked) for (let k = 0; k < 3; k++) {
        const u = prog(lt, .95 + k * .12, 1.6 + k * .12); if (u <= 0 || u >= 1) continue;
        text(ctx, '+1', cx + 170 + (k - 1) * 22, cy + 210 - u * 120, { font: 'PretXB', size: 30, color: '#ff6b6b', alpha: 1 - u });
      }
    });
    ctx.fillStyle = '#f5f6fa'; ctx.fillRect(sx, sy + ph - 200 - 80, sw, 80);
    ['#ff6b6b', '#b2bec3', '#b2bec3', '#b2bec3'].forEach((col, i) => { ctx.fillStyle = col; rr(ctx, sx + 50 + i * 105, sy + ph - 260, 36, 36, 8); ctx.fill(); });
    // 푸시 알림
    const nd = E.outBack(prog(lt, .3, .62), 1.4), press = lt > 1.2 && lt < 1.35 ? .97 : 1;
    if (nd > 0) {
      const ny = lerp(-140, sy + 16, nd);
      ctx.save(); ctx.translate(sx + sw / 2, ny + 60); ctx.scale(press, press); ctx.translate(-(sx + sw / 2), -(ny + 60));
      ctx.fillStyle = 'rgba(0,0,0,.18)'; rr(ctx, sx + 10, ny + 8, sw - 20, 124, 22); ctx.fill();
      ctx.fillStyle = '#fff'; rr(ctx, sx + 10, ny, sw - 20, 124, 22); ctx.fill();
      ctx.fillStyle = '#ff6b6b'; rr(ctx, sx + 30, ny + 26, 72, 72, 18); ctx.fill();
      ctx.fillStyle = '#ffd166'; ctx.fillRect(sx + 46, ny + 52, 40, 32); ctx.fillStyle = '#fff'; ctx.fillRect(sx + 62, ny + 46, 8, 38); ctx.fillRect(sx + 42, ny + 46, 48, 10);
      text(ctx, '쿠폰이 도착했어요!', sx + 122, ny + 46, { font: 'PretXB', size: 32, color: '#2d3436', align: 'left' });
      text(ctx, '지금 바로 확인하세요 →', sx + 122, ny + 88, { font: 'PretSB', size: 24, color: '#636e72', align: 'left' });
      text(ctx, '지금', sx + sw - 34, ny + 30, { font: 'PretSB', size: 20, color: '#b2bec3', align: 'right' });
      ctx.restore();
      const rp = prog(lt, 1.2, 1.6);
      if (rp > 0 && rp < 1) { ctx.fillStyle = `rgba(255,107,107,${.35 * (1 - rp)})`; ctx.beginPath(); ctx.arc(sx + sw / 2, ny + 62, 20 + rp * 220, 0, TAU); ctx.fill(); }
    }
    if (hero) drawHero(ctx, 'flat', hero);
  },
};

// ── 08 2026 넾다세일 (KV) ────────────────────────────────
const SPIKES = (() => {
  const R = rng(17), out = [];
  for (let i = 0; i < 15; i++) out.push({ ang: i / 15 * TAU + (R() - .5) * .35, half: .09 + R() * .07, tip: R() * .35, notch: .35 + R() * .3, kink: (R() - .5) * .5 });
  return out;
})();
function drawSpikes(ctx, cx, cy, inner, t, o = {}) {
  const k = o.intro === undefined ? 1 : o.intro, R = o.R || 2200;
  const cols = o.colors || [C.green, C.purple];
  const breathe = 1 + .05 * Math.sin(t * TAU * 2);
  SPIKES.forEach((s, i) => {
    const a = s.ang + t * (o.rot || .08);
    const rTip = lerp(R, inner * (1 + s.tip) * breathe, k);
    const P = (r, aa) => [cx + r * Math.cos(aa), cy + r * Math.sin(aa)];
    const rn = rTip + (R - rTip) * s.notch, hw = s.half;
    const shape = [P(rTip, a), P(R, a - hw), P(rn + 50, a - hw * .1 + s.kink * .05), P(rn, a + hw * .35), P(R, a + hw)];
    const outer = [P(rTip - 34, a), P(R, a - hw - .045), P(rn + 30, a - hw * .1 - .03 + s.kink * .05), P(rn - 20, a + hw * .35 + .02), P(R, a + hw + .045)];
    ctx.fillStyle = '#000'; ctx.beginPath(); outer.forEach(([x, y], j) => j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.fill();
    ctx.fillStyle = cols[i % cols.length]; ctx.beginPath(); shape.forEach(([x, y], j) => j ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.fill();
  });
}
const ERA_KV = {
  style: 'kv',
  draw(ctx, lt, hero, t) {
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, PW, PH);
    drawSpikes(ctx, 480, 560, 420, t, { R: 1300 });
    ctx.fillStyle = 'rgba(145,98,255,.9)';
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8 - y; x++) { ctx.beginPath(); ctx.arc(30 + x * 22, PH - 30 - y * 22, 6 - y * .5, 0, TAU); ctx.fill(); }
    text(ctx, '2026', 40, 60, { font: 'BHS', size: 64, color: '#000', align: 'left' });
    if (hero) drawHero(ctx, 'kv', hero);
  },
};

const ERAS = [
  { ...ERA_PETRO, cap: ['01', '암각화', '기원전 · 물물교환, 혜택의 시작'], yr: '기원전' },
  { ...ERA_MINHWA, cap: ['02', '민화', '조선 · 장터 인심 "덤"'], yr: '조선' },
  { ...ERA_NEWS, cap: ['03', '신문 광고', '1977 · 대매출 바겐세일'], yr: "'77" },
  { ...ERA_POSTER, cap: ['04', '실크스크린', '1986 · 백화점 정기세일'], yr: "'86" },
  { ...ERA_CRT, cap: ['05', '브라운관', '1997 · TV 홈쇼핑 특가'], yr: "'97" },
  { ...ERA_PIXEL, cap: ['06', '픽셀', '2003 · 인터넷 쇼핑몰 쿠폰'], yr: "'03" },
  { ...ERA_FLAT, cap: ['07', '플랫 UI', '2014 · 모바일 앱 푸시'], yr: "'14" },
  { ...ERA_KV, cap: ['08', '넾다세일', '2026 · 거대한 혜택'], yr: '2026' },
];
