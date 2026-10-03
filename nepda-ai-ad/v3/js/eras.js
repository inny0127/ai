// ───────────── 네이버 쇼핑 연혁 8장면 — 각 장면은 '그해의 디자인 트렌드'로 ─────────────
// 각 era.draw(ctx, lt, hero, t): ctx = 960x1200 패널, lt = 장면 로컬 시간, t = 전역 시간
// 사실 출처: 네이버 보도자료(지식쇼핑 2003.10.10 / 샵N 2012.3.23 / 네이버페이 2015.6.25 /
// 멤버십 2020.6.1 / 넾다세일 2026.6.19), 언론 보도(스토어팜 2014.6 / 스마트스토어 2018.2 /
// 쇼핑라이브 2020.7.30 / 네이버플러스 스토어 2025.3.12 / 넾다세일 1조 2025.11.12)

// ── 공용 헬퍼 ──
function starburst(ctx, x, y, r1, r2, n, rot) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) { const a = rot + i / (n * 2) * TAU, r = i % 2 ? r1 : r2; i ? ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)) : ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a)); }
  ctx.closePath();
}
function longShadow(ctx, drawShape, len, col) {
  ctx.save(); ctx.fillStyle = col;
  for (let i = 2; i < len; i += 5) { ctx.save(); ctx.translate(i, i); drawShape(); ctx.restore(); }
  ctx.restore();
}
const LO = mkCanvas(240, 300), LX = LO.getContext('2d');
function bevel(c, x, y, w, h, inset, face = '#c0c0c0') {
  c.fillStyle = face; c.fillRect(x, y, w, h);
  c.fillStyle = inset ? '#404040' : '#ffffff'; c.fillRect(x, y, w, 1); c.fillRect(x, y, 1, h);
  c.fillStyle = inset ? '#ffffff' : '#404040'; c.fillRect(x, y + h - 1, w, 1); c.fillRect(x + w - 1, y, 1, h);
}
function ptext(c, s, x, y, col, o = {}) {
  c.font = `${o.size || 11}px ${o.bold ? 'GalmuriB' : 'Galmuri'}`; c.textBaseline = 'top'; c.textAlign = o.align || 'left'; c.letterSpacing = '0px';
  c.fillStyle = col; c.fillText(s, Math.round(x), Math.round(y));
}
const CURSOR = ['k.........', 'kk........', 'kwk.......', 'kwwk......', 'kwwwk.....', 'kwwwwk....', 'kwwwwwk...', 'kwwwwwwk..', 'kwwwwkkkk.', 'kwkwwk....', 'kk.kwwk...', 'k...kwwk..', '.....kk...'];
function glassCard(ctx, x, y, w, h, r = 28, a = .1) {
  ctx.save();
  ctx.fillStyle = `rgba(255,255,255,${a})`; rr(ctx, x, y, w, h, r); ctx.fill();
  const g = ctx.createLinearGradient(x, y, x, y + h); g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,.32)'; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
}
function sparkle(ctx, x, y, r, col) {
  ctx.fillStyle = col; ctx.beginPath();
  ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
}

// ── 01 2003 지식쇼핑 — 2000년대 웹 (픽셀) ───────────────
const ROWS03 = [['가 쇼핑몰', 312000], ['나 마트', 298000], ['다 디지털', 305000], ['라 전자몰', 289000], ['마 닷컴', 301000]];
const ERA_2003 = {
  style: 'pixel',
  draw(ctx, lt, hero, t) {
    const c = LX; c.imageSmoothingEnabled = false;
    const dg = c.createLinearGradient(0, 0, 0, 300); dg.addColorStop(0, '#3a6ea5'); dg.addColorStop(1, '#1d4f86');
    c.fillStyle = dg; c.fillRect(0, 0, 240, 300);
    bevel(c, 6, 8, 228, 270, false);
    const tg = c.createLinearGradient(9, 0, 231, 0); tg.addColorStop(0, '#0a246a'); tg.addColorStop(1, '#5d8fd0');
    c.fillStyle = tg; c.fillRect(9, 11, 222, 14);
    ptext(c, '지식쇼핑 - 웹 브라우저', 13, 12, '#fff', { bold: true });
    [0, 1, 2].forEach(i => bevel(c, 186 + i * 15, 13, 13, 11, false));
    ptext(c, '_', 189, 10, '#000'); c.strokeStyle = '#000'; c.strokeRect(205.5, 15.5, 6, 6); ptext(c, 'x', 219, 12, '#000', { bold: true });
    ptext(c, '파일 편집 보기 즐겨찾기', 12, 27, '#000');
    c.fillStyle = '#fff'; c.fillRect(10, 40, 220, 234);
    ptext(c, '지식쇼핑', 16, 44, '#1fa83a', { size: 22, bold: true });
    ptext(c, '가격비교·안전구매', 226, 52, '#666', { align: 'right' });
    bevel(c, 14, 72, 160, 17, true, '#fff');
    ptext(c, '디지털카메라' + (Math.floor(t * 3) % 2 ? '|' : ''), 18, 75, '#000');
    bevel(c, 178, 72, 48, 17, false); ptext(c, '검색', 202, 75, '#000', { align: 'center', bold: true });
    // 정렬 버튼
    const pressed = lt > .42 && lt < .55;
    bevel(c, 14, 94, 50, 15, false); ptext(c, '인기순', 39, 96, '#000', { align: 'center' });
    bevel(c, 68, 94, 68, 15, pressed, lt > .5 ? '#ffe680' : '#c0c0c0'); ptext(c, '최저가순▼', 102 + (pressed ? 1 : 0), 96 + (pressed ? 1 : 0), '#c00000', { align: 'center', bold: true });
    // 가격비교 표 — 최저가순으로 재정렬
    c.fillStyle = '#e8e8e8'; c.fillRect(14, 113, 212, 14);
    ptext(c, '쇼핑몰', 18, 115, '#333', { bold: true }); ptext(c, '가격', 222, 115, '#333', { bold: true, align: 'right' });
    const sorted = ROWS03.map((r, i) => i).sort((a, b) => ROWS03[a][1] - ROWS03[b][1]);
    const e = E.inOut(prog(lt, .52, .85));
    ROWS03.forEach(([name, price], i) => {
      const r = lerp(i, sorted.indexOf(i), e), y = Math.round(129 + r * 17);
      const best = e > .99 && sorted[0] === i;
      c.fillStyle = best ? '#fff3a0' : (i % 2 ? '#fafafa' : '#fff'); c.fillRect(14, y, 212, 16);
      c.fillStyle = '#ddd'; c.fillRect(14, y + 16, 212, 1);
      ptext(c, name, 18, y + 3, '#003399');
      ptext(c, price.toLocaleString('en-US') + '원', 222, y + 3, best ? '#d00000' : '#000', { align: 'right', bold: best });
      if (best && Math.floor(t * 5) % 2) { c.fillStyle = '#ff0000'; c.fillRect(96, y + 2, 40, 12); ptext(c, '최저가!', 116, y + 3, '#ffff00', { align: 'center', bold: true }); }
    });
    // 전광판
    c.fillStyle = '#000'; c.fillRect(14, 218, 212, 15);
    c.save(); c.beginPath(); c.rect(14, 218, 212, 15); c.clip();
    const mq = '★ 200여 개 쇼핑몰 가격을 한 번에!  ★ 쇼핑 지식 12만 건  ★ 안전구매  ';
    c.font = '11px Galmuri'; const mw = c.measureText(mq).width, mx = 226 - ((t * 50) % mw);
    ptext(c, mq, mx, 220, '#ffea00'); ptext(c, mq, mx + mw, 220, '#ffea00');
    c.restore();
    c.fillStyle = '#1fa83a'; c.beginPath(); c.arc(30, 254, 12, 0, TAU); c.fill(); ptext(c, '안전', 30, 245, '#fff', { align: 'center', bold: true }); ptext(c, '구매', 30, 255, '#fff', { align: 'center', bold: true });
    ptext(c, '배송 확인 후 결제 대금 지급', 48, 249, '#555');
    bevel(c, 0, 282, 240, 18, false); bevel(c, 2, 284, 42, 14, false); ptext(c, '시작', 10, 285, '#000', { bold: true });
    bevel(c, 172, 284, 66, 14, true); ptext(c, '2003.10.10', 176, 285, '#000');
    if (hero) {
      const k = Math.max(2, Math.round(hero.s / 4 / 16));
      drawPixelSprite(c, PIX_GIFT, PIX_PAL, hero.x / 4, hero.y / 4, k);
      const sp = Math.floor(t * 6) % 2; c.fillStyle = '#fff';
      [[-1, -1], [1, -.3], [-.7, .8]].forEach(([ax, ay], i) => {
        if ((sp + i) % 2) { const px = Math.round(hero.x / 4 + ax * hero.s / 6.5), py = Math.round(hero.y / 4 + ay * hero.s / 7); c.fillRect(px - 1, py - 4, 2, 9); c.fillRect(px - 4, py - 1, 9, 2); }
      });
    }
    const cu = E.inOut(prog(lt, .1, .42));
    drawPixelSprite(c, CURSOR, { k: '#000', w: '#fff' }, lerp(200, 104, cu) + 5, lerp(250, 103, cu) + 6, 1);
    ctx.imageSmoothingEnabled = false; ctx.drawImage(LO, 0, 0, 240, 300, 0, 0, PW, PH); ctx.imageSmoothingEnabled = true;
  },
};

// ── 02 2012 샵N — 스큐어모피즘 ─────────────────────────
function woodBg() {
  return cached('wood', PW, PH, (ctx) => {
    const R = rng(12);
    for (let x = 0; x < PW; x += 120) {
      const base = [139 + R() * 25, 90 + R() * 15, 50 + R() * 10];
      const g = ctx.createLinearGradient(x, 0, x + 120, 0);
      g.addColorStop(0, `rgb(${base[0] - 15},${base[1] - 12},${base[2] - 8})`); g.addColorStop(.5, `rgb(${base})`); g.addColorStop(1, `rgb(${base[0] - 22},${base[1] - 16},${base[2] - 10})`);
      ctx.fillStyle = g; ctx.fillRect(x, 0, 120, PH);
      ctx.strokeStyle = 'rgba(60,30,10,.25)'; ctx.lineWidth = 1.5;
      for (let k = 0; k < 14; k++) {
        const xx = x + 8 + R() * 104, ph = R() * 10; ctx.beginPath();
        for (let y = 0; y <= PH; y += 20) ctx.lineTo(xx + Math.sin(y / 90 + ph) * 6 + Math.sin(y / 23 + ph) * 1.5, y);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(40,20,5,.7)'; ctx.fillRect(x, 0, 3, PH);
      ctx.fillStyle = 'rgba(255,220,180,.12)'; ctx.fillRect(x + 3, 0, 2, PH);
    }
    const v = ctx.createRadialGradient(PW / 2, PH / 2, 300, PW / 2, PH / 2, 900); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(20,8,0,.55)');
    ctx.fillStyle = v; ctx.fillRect(0, 0, PW, PH);
  });
}
function leather() {
  return cached('leather', 880, 190, (ctx) => {
    ctx.drawImage(pixelTex('leatherpx', 880, 190, (x, y, o) => { const v = NOISE(x / 3, y / 3) * .5 + NOISE(x / 11 + 9, y / 11) * .5; const c = .75 + .35 * v; o[0] = 92 * c; o[1] = 58 * c; o[2] = 40 * c; }), 0, 0);
  });
}
const ERA_2012 = {
  style: 'glossy',
  draw(ctx, lt, hero, t) {
    ctx.drawImage(woodBg(), 0, 0);
    // 가죽 배너 + 스티치 + 금박
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
    rr(ctx, 40, 40, 880, 190, 22); ctx.fillStyle = '#5b3a29'; ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, 40, 40, 880, 190, 22); ctx.clip(); ctx.drawImage(leather(), 40, 40);
    const hl = ctx.createLinearGradient(0, 40, 0, 230); hl.addColorStop(0, 'rgba(255,255,255,.18)'); hl.addColorStop(.5, 'rgba(255,255,255,0)'); hl.addColorStop(1, 'rgba(0,0,0,.25)');
    ctx.fillStyle = hl; ctx.fillRect(40, 40, 880, 190); ctx.restore();
    ctx.setLineDash([14, 10]); ctx.strokeStyle = '#e8cfa0'; ctx.lineWidth = 4; rr(ctx, 58, 58, 844, 154, 14); ctx.stroke(); ctx.setLineDash([]);
    const gold = ctx.createLinearGradient(0, 95, 0, 175); gold.addColorStop(0, '#fff3c4'); gold.addColorStop(.5, '#d9a93a'); gold.addColorStop(1, '#8a6113');
    text(ctx, '나만의 상점, 오늘 오픈', 480, 138, { font: 'Gowun', size: 70, color: 'rgba(0,0,0,.5)' });
    text(ctx, '나만의 상점, 오늘 오픈', 480, 134, { font: 'Gowun', size: 70, color: gold });
    // 가게
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14;
    ctx.fillStyle = '#efe4cf'; ctx.fillRect(150, 300, 660, 680); ctx.restore();
    ctx.fillStyle = 'rgba(150,120,80,.15)'; for (let y = 320; y < 980; y += 28) ctx.fillRect(150, y, 660, 2);
    // 차양 (광택 스트라이프)
    for (let i = 0; i < 12; i++) { ctx.fillStyle = i % 2 ? '#fff6ee' : '#d33a2c'; ctx.fillRect(130 + i * 58.3, 300, 58.3, 130); }
    for (let i = 0; i < 12; i++) { ctx.fillStyle = i % 2 ? '#fff6ee' : '#d33a2c'; ctx.beginPath(); ctx.arc(130 + i * 58.3 + 29, 430, 29, 0, Math.PI); ctx.fill(); }
    const ag = ctx.createLinearGradient(0, 300, 0, 460); ag.addColorStop(0, 'rgba(255,255,255,.45)'); ag.addColorStop(.45, 'rgba(255,255,255,.05)'); ag.addColorStop(1, 'rgba(0,0,0,.18)');
    ctx.fillStyle = ag; ctx.fillRect(130, 300, 700, 160);
    // 진열창
    const wg = ctx.createLinearGradient(190, 490, 450, 820); wg.addColorStop(0, '#bfe3f5'); wg.addColorStop(1, '#5d9cc2');
    ctx.fillStyle = '#6b4423'; ctx.fillRect(180, 480, 280, 330); ctx.fillStyle = wg; ctx.fillRect(194, 494, 252, 302);
    [['#f1c40f', 220, 700], ['#e74c3c', 290, 690], ['#3498db', 360, 705], ['#9b59b6', 250, 610], ['#2ecc71', 340, 615]].forEach(([col, x, y]) => {
      const g = ctx.createLinearGradient(0, y - 40, 0, y + 40); g.addColorStop(0, '#fff'); g.addColorStop(.25, col); g.addColorStop(1, 'rgba(0,0,0,.6)');
      ctx.fillStyle = g; rr(ctx, x, y - 40, 60, 70, 8); ctx.fill();
    });
    ctx.fillStyle = '#7a5532'; ctx.fillRect(194, 760, 252, 12); ctx.fillRect(194, 660, 252, 10);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(194, 494); ctx.lineTo(300, 494); ctx.lineTo(194, 640); ctx.fill();
    // 문 + OPEN 표지판 (흔들림)
    const dg = ctx.createLinearGradient(520, 0, 760, 0); dg.addColorStop(0, '#5a3418'); dg.addColorStop(.5, '#7b4a24'); dg.addColorStop(1, '#4a2a12');
    ctx.fillStyle = dg; ctx.fillRect(520, 480, 240, 500);
    ctx.fillStyle = 'rgba(190,225,245,.85)'; rr(ctx, 550, 510, 180, 210, 10); ctx.fill();
    const kg = ctx.createRadialGradient(735, 760, 2, 740, 765, 16); kg.addColorStop(0, '#fff6c0'); kg.addColorStop(1, '#a87b12');
    ctx.fillStyle = kg; ctx.beginPath(); ctx.arc(740, 765, 14, 0, TAU); ctx.fill();
    const sw = .22 * Math.sin(t * 3.4);
    ctx.save(); ctx.translate(640, 530); ctx.rotate(sw);
    ctx.strokeStyle = '#555'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-60, 70); ctx.moveTo(0, 0); ctx.lineTo(60, 70); ctx.stroke();
    ctx.fillStyle = '#b5652a'; rr(ctx, -95, 66, 190, 80, 12); ctx.fill(); ctx.strokeStyle = '#5a2d0c'; ctx.lineWidth = 4; ctx.stroke();
    text(ctx, 'OPEN', 0, 108, { font: 'PretBlk', size: 52, color: '#fff7e0', stroke: '#5a2d0c', sw: 6 });
    ctx.restore();
    // 광택 버튼 '상점 개설하기'
    const pr = lt > .72 && lt < .9, by = 1040 + (pr ? 5 : 0);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = pr ? 8 : 20; ctx.shadowOffsetY = pr ? 3 : 10;
    const bg = ctx.createLinearGradient(0, by, 0, by + 110); bg.addColorStop(0, pr ? '#2a7fd9' : '#5ab0ff'); bg.addColorStop(1, '#0a4fa8');
    ctx.fillStyle = bg; rr(ctx, 230, by, 500, 110, 55); ctx.fill(); ctx.restore();
    const bh = ctx.createLinearGradient(0, by, 0, by + 55); bh.addColorStop(0, 'rgba(255,255,255,.65)'); bh.addColorStop(1, 'rgba(255,255,255,.08)');
    ctx.fillStyle = bh; rr(ctx, 246, by + 6, 468, 50, 25); ctx.fill();
    text(ctx, '상점 개설하기', 480, by + 58, { font: 'PretXB', size: 50, color: 'rgba(0,0,0,.35)' });
    text(ctx, '상점 개설하기', 480, by + 55, { font: 'PretXB', size: 50, color: '#fff' });
    if (lt > .88) for (let i = 0; i < 6; i++) {
      const u = prog(lt, .88, 1.4), a = i / 6 * TAU + .3;
      if (u > 0 && u < 1) sparkle(ctx, 480 + Math.cos(a) * (280 + 80 * u), by + 55 + Math.sin(a) * (70 + 40 * u), 22 * Math.sin(u * Math.PI), '#ffe680');
    }
    if (hero) drawHero(ctx, 'glossy', hero);
  },
};

// ── 03 2014 스토어팜 — 플랫 일러스트 농장 ─────────────────
const SPROUTS = [[200, 860, 'shirt'], [400, 870, 'mug'], [600, 860, 'bag'], [800, 875, 'book'], [290, 1030, 'mug'], [500, 1040, 'shirt'], [700, 1030, 'book'], [890, 1045, 'bag']];
function flatItem(ctx, kind) {
  ctx.lineJoin = 'round'; ctx.strokeStyle = '#2d3436'; ctx.lineWidth = 5;
  if (kind === 'shirt') { ctx.fillStyle = '#0984e3'; ctx.beginPath(); ctx.moveTo(-22, -34); ctx.lineTo(-8, -34); ctx.lineTo(0, -26); ctx.lineTo(8, -34); ctx.lineTo(22, -34); ctx.lineTo(44, -14); ctx.lineTo(32, -2); ctx.lineTo(24, -10); ctx.lineTo(24, 34); ctx.lineTo(-24, 34); ctx.lineTo(-24, -10); ctx.lineTo(-32, -2); ctx.lineTo(-44, -14); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  else if (kind === 'mug') { ctx.fillStyle = '#fdcb6e'; ctx.beginPath(); ctx.arc(28, 0, 14, -Math.PI / 2, Math.PI / 2); ctx.lineWidth = 8; ctx.stroke(); ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-26, -30, 54, 64, 8); ctx.fill(); ctx.stroke(); }
  else if (kind === 'bag') { ctx.fillStyle = '#e84393'; ctx.beginPath(); ctx.arc(0, -18, 16, Math.PI, TAU); ctx.lineWidth = 6; ctx.stroke(); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-30, -18); ctx.lineTo(30, -18); ctx.lineTo(36, 34); ctx.lineTo(-36, 34); ctx.closePath(); ctx.fill(); ctx.stroke(); }
  else { ctx.fillStyle = '#00b894'; ctx.beginPath(); ctx.roundRect(-28, -34, 56, 68, 4); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fillRect(-18, -20, 36, 6); ctx.fillRect(-18, -8, 26, 6); }
}
const ERA_2014 = {
  style: 'flat2',
  draw(ctx, lt, hero, t) {
    const sky = ctx.createLinearGradient(0, 0, 0, 700); sky.addColorStop(0, '#74d3e8'); sky.addColorStop(1, '#dff9fb');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, PW, PH);
    ctx.save(); ctx.translate(800, 170); ctx.rotate(t * .3); ctx.fillStyle = '#ffeaa7';
    for (let i = 0; i < 12; i++) { ctx.rotate(TAU / 12); ctx.beginPath(); ctx.moveTo(-14, -90); ctx.lineTo(14, -90); ctx.lineTo(0, -130); ctx.fill(); }
    ctx.restore();
    ctx.fillStyle = '#fdcb6e'; ctx.beginPath(); ctx.arc(800, 170, 72, 0, TAU); ctx.fill();
    [[150, 160, 1], [520, 110, .8], [380, 260, .6]].forEach(([x, y, s], i) => {
      const xx = ((x + t * 25 * (i + 1)) % 1100) - 70;
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(xx, y, 40 * s, 0, TAU); ctx.arc(xx + 44 * s, y - 18 * s, 50 * s, 0, TAU); ctx.arc(xx + 96 * s, y, 38 * s, 0, TAU); ctx.fill(); ctx.fillRect(xx, y, 96 * s, 38 * s);
    });
    ctx.fillStyle = '#00b894'; ctx.beginPath(); ctx.ellipse(240, 760, 520, 230, 0, Math.PI, TAU); ctx.fill();
    ctx.fillStyle = '#55efc4'; ctx.beginPath(); ctx.ellipse(760, 790, 560, 220, 0, Math.PI, TAU); ctx.fill();
    // 헛간 '스토어'
    ctx.fillStyle = '#d63031'; ctx.fillRect(700, 560, 200, 200);
    ctx.fillStyle = '#2d3436'; ctx.beginPath(); ctx.moveTo(680, 570); ctx.lineTo(800, 470); ctx.lineTo(920, 570); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.strokeRect(750, 650, 100, 110); ctx.beginPath(); ctx.moveTo(750, 650); ctx.lineTo(850, 760); ctx.moveTo(850, 650); ctx.lineTo(750, 760); ctx.stroke();
    ctx.fillStyle = '#fff'; rr(ctx, 730, 586, 140, 44, 8); ctx.fill();
    text(ctx, '스토어', 800, 609, { font: 'Jua', size: 34, color: '#d63031' });
    // 밭
    ctx.fillStyle = '#c97b4a'; ctx.fillRect(0, 760, PW, 440);
    ctx.fillStyle = '#a8653a'; for (let i = 0; i < 4; i++) ctx.fillRect(0, 800 + i * 110, PW, 34);
    // 팻말
    ctx.fillStyle = '#8b5a2b'; ctx.fillRect(140, 600, 18, 170);
    ctx.fillStyle = '#e1b382'; rr(ctx, 40, 560, 300, 110, 12); ctx.fill(); ctx.strokeStyle = '#8b5a2b'; ctx.lineWidth = 6; ctx.stroke();
    text(ctx, '누구나', 190, 592, { font: 'Jua', size: 36, color: '#5a3418' });
    text(ctx, '무료로 입점!', 190, 638, { font: 'Jua', size: 40, color: '#d63031' });
    // 새싹 → 상품
    SPROUTS.forEach(([x, y, kind], i) => {
      const t0 = .05 + i * .07, g = E.out(prog(lt, t0, t0 + .3)), pp = pop(lt, t0 + .3, .35);
      if (g <= 0) return;
      ctx.strokeStyle = '#27ae60'; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 50 * g); ctx.stroke();
      ctx.fillStyle = '#2ecc71';
      ctx.beginPath(); ctx.ellipse(x - 20 * g, y - 50 * g, 22 * g, 11 * g, -.5, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.ellipse(x + 20 * g, y - 50 * g, 22 * g, 11 * g, .5, 0, TAU); ctx.fill();
      if (pp > 0) { ctx.save(); ctx.translate(x, y - 110 + Math.sin(t * 5 + i) * 4); ctx.scale(pp, pp); flatItem(ctx, kind); ctx.restore(); }
    });
    if (hero) drawHero(ctx, 'flat2', hero);
  },
};

// ── 04 2015 네이버페이 — 롱섀도 플랫 ──────────────────────
const ERA_2015 = {
  style: 'flat',
  draw(ctx, lt, hero, t) {
    ctx.fillStyle = '#1abc9c'; ctx.fillRect(0, 0, PW, PH);
    ctx.fillStyle = '#48c9b0'; ctx.beginPath(); ctx.arc(860, 150, 280, 0, TAU); ctx.fill(); ctx.beginPath(); ctx.arc(80, 1080, 260, 0, TAU); ctx.fill();
    text(ctx, '출시 100일, 결제', 480, 80, { font: 'PretXB', size: 44, color: '#fff' });
    const n = Math.round(3000 * E.outExpo(prog(lt, .1, 1.1)));
    longShadow(ctx, () => text(ctx, `${n.toLocaleString('en-US')}만 건`, 480, 170, { font: 'PretBlk', size: 104, color: 'rgba(0,80,65,1)' }), 60, 'rgba(0,80,65,.04)');
    text(ctx, `${n.toLocaleString('en-US')}만 건`, 480, 170, { font: 'PretBlk', size: 104, color: '#fff' });
    // 카드가 폰으로
    [0, 1, 2].forEach(i => {
      const u = E.inOut(prog(lt, .05 + i * .1, .5 + i * .1)); if (u >= 1) return;
      const x = lerp(-100, 470, u), y = lerp(440 + i * 120, 760, u), sc = lerp(1, .3, u);
      ctx.save(); ctx.translate(x, y); ctx.scale(sc, sc); ctx.rotate(-.2 + i * .1);
      longShadow(ctx, () => { rr(ctx, -90, -56, 180, 112, 14); ctx.fill(); }, 70, 'rgba(0,80,65,.05)');
      ctx.fillStyle = ['#f1c40f', '#e74c3c', '#9b59b6'][i]; rr(ctx, -90, -56, 180, 112, 14); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fillRect(-90, -30, 180, 22); ctx.fillStyle = '#fff'; ctx.fillRect(-70, 20, 60, 12);
      ctx.restore();
    });
    // 폰
    const px = 300, py = 300;
    longShadow(ctx, () => { rr(ctx, px, py, 360, 780, 50); ctx.fill(); }, 220, 'rgba(0,80,65,.022)');
    ctx.fillStyle = '#34495e'; rr(ctx, px, py, 360, 780, 50); ctx.fill();
    ctx.fillStyle = '#fff'; rr(ctx, px + 20, py + 70, 320, 620, 6); ctx.fill();
    ctx.strokeStyle = '#7f8c8d'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(px + 180, py + 735, 22, 0, TAU); ctx.stroke();
    const sx = px + 20, sy = py + 70;
    ctx.fillStyle = '#ecf0f1'; ctx.fillRect(sx, sy, 320, 60);
    text(ctx, '주문 / 결제', sx + 160, sy + 32, { font: 'PretXB', size: 28, color: '#2c3e50' });
    const done = E.out(prog(lt, .66, .9));
    if (done <= 0) {
      ctx.fillStyle = '#f39c12'; rr(ctx, sx + 20, sy + 90, 90, 90, 10); ctx.fill();
      text(ctx, '가을 니트', sx + 130, sy + 118, { font: 'PretXB', size: 28, color: '#2c3e50', align: 'left' });
      text(ctx, '29,800원', sx + 130, sy + 156, { font: 'PretSB', size: 26, color: '#7f8c8d', align: 'left' });
      ctx.fillStyle = '#ecf0f1'; ctx.fillRect(sx + 20, sy + 400, 280, 3);
      text(ctx, '총 결제금액', sx + 20, sy + 440, { font: 'PretSB', size: 26, color: '#7f8c8d', align: 'left' });
      text(ctx, '29,800원', sx + 300, sy + 440, { font: 'PretBlk', size: 34, color: '#e74c3c', align: 'right' });
      const tap = lt > .55 && lt < .66;
      ctx.fillStyle = tap ? '#27ae60' : '#2ecc71'; rr(ctx, sx + 20, sy + 500, 280, 90, 14); ctx.fill();
      text(ctx, '네이버페이로 결제', sx + 160, sy + 546, { font: 'PretXB', size: 30, color: '#fff' });
      const rp = prog(lt, .55, .75);
      if (rp > 0 && rp < 1) { ctx.fillStyle = `rgba(255,255,255,${.5 * (1 - rp)})`; ctx.beginPath(); ctx.arc(sx + 160, sy + 545, 20 + 160 * rp, 0, TAU); ctx.fill(); }
    } else {
      ctx.fillStyle = '#2ecc71'; ctx.beginPath(); ctx.arc(sx + 160, sy + 430, 100 * E.outBack(done), 0, TAU); ctx.fill();
      const ck = prog(lt, .75, .95);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
      const p1 = [sx + 115, sy + 432], p2 = [sx + 150, sy + 468], p3 = [sx + 212, sy + 396];
      ctx.moveTo(...p1);
      if (ck < .4) ctx.lineTo(lerp(p1[0], p2[0], ck / .4), lerp(p1[1], p2[1], ck / .4)); else { ctx.lineTo(...p2); ctx.lineTo(lerp(p2[0], p3[0], (ck - .4) / .6), lerp(p2[1], p3[1], (ck - .4) / .6)); }
      ctx.stroke();
      text(ctx, '결제 완료!', sx + 160, sy + 580, { font: 'PretBlk', size: 44, color: '#2c3e50', alpha: done });
    }
    if (hero) drawHero(ctx, 'flat', hero);
  },
};

// ── 05 2018 스마트스토어 — 머티리얼 디자인 ─────────────────
function mCard(ctx, x, y, w, h, z = 1) {
  ctx.save(); ctx.shadowColor = `rgba(0,0,0,${.12 + .06 * z})`; ctx.shadowBlur = 8 + 10 * z; ctx.shadowOffsetY = 3 + 4 * z;
  ctx.fillStyle = '#fff'; rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.restore();
}
const ERA_2018 = {
  style: 'material',
  draw(ctx, lt, hero, t) {
    ctx.fillStyle = '#eceff1'; ctx.fillRect(0, 0, PW, PH);
    ctx.fillStyle = '#303f9f'; ctx.fillRect(0, 0, PW, 40);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.3)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5; ctx.fillStyle = '#3f51b5'; ctx.fillRect(0, 40, PW, 120); ctx.restore();
    ctx.fillStyle = '#fff'; for (let i = 0; i < 3; i++) ctx.fillRect(44, 82 + i * 14, 40, 6);
    text(ctx, '내 스마트스토어', 120, 102, { font: 'PretXB', size: 44, color: '#fff', align: 'left' });
    // 방문자 카드
    mCard(ctx, 40, 200, 880, 170, 1);
    text(ctx, '오늘 방문자', 80, 248, { font: 'PretSB', size: 30, color: '#757575', align: 'left' });
    const v = Math.round(1284 * E.out(prog(lt, .05, .9)));
    text(ctx, v.toLocaleString('en-US'), 80, 318, { font: 'PretBlk', size: 74, color: '#212121', align: 'left' });
    ctx.strokeStyle = '#ff4081'; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.beginPath();
    const sp = [30, 42, 36, 55, 50, 68, 74, 90];
    sp.forEach((h, i) => { const u = prog(lt, .1 + i * .06, .2 + i * .06); const x = 560 + i * 46, y = 340 - h * 1.2 * u - 20; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
    ctx.stroke();
    // 양 옆 작은 카드
    mCard(ctx, 40, 410, 290, 250, .5); mCard(ctx, 630, 410, 290, 250, .5);
    ctx.fillStyle = '#3f51b5'; rr(ctx, 150, 440, 70, 110, 10); ctx.fill(); ctx.fillStyle = '#c5cae9'; ctx.fillRect(160, 456, 50, 78);
    text(ctx, '모바일 최적화', 185, 610, { font: 'PretXB', size: 30, color: '#212121' });
    ctx.fillStyle = '#ff4081'; ctx.beginPath(); ctx.arc(775, 495, 52, 0, TAU); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(775, 495, 28, 0, TAU); ctx.stroke(); ctx.beginPath(); ctx.arc(775, 495, 10, 0, TAU); ctx.fillStyle = '#fff'; ctx.fill();
    text(ctx, '타겟 마케팅', 775, 610, { font: 'PretXB', size: 30, color: '#212121' });
    // 통계 카드
    mCard(ctx, 40, 710, 880, 340, 1.5);
    text(ctx, '판매 통계', 80, 758, { font: 'PretXB', size: 32, color: '#212121', align: 'left' });
    const bars = [.35, .5, .42, .62, .58, .78, .95];
    bars.forEach((h, i) => {
      const u = E.outBack(prog(lt, .15 + i * .07, .5 + i * .07), 1.2), x = 110 + i * 112, bh = 220 * h * u;
      ctx.fillStyle = i === 6 ? '#ff4081' : '#7986cb'; rr(ctx, x, 1010 - bh, 64, Math.max(0, bh), [6, 6, 0, 0]); ctx.fill();
    });
    ctx.fillStyle = '#e0e0e0'; ctx.fillRect(80, 1012, 800, 3);
    ['통계', '타겟 마케팅', '모바일'].forEach((s, i) => {
      const x = 60 + i * 210; ctx.fillStyle = '#e0e0e0'; rr(ctx, x, 1090, i === 1 ? 210 : 140, 60, 30); ctx.fill();
      text(ctx, s, x + (i === 1 ? 105 : 70), 1121, { font: 'PretSB', size: 28, color: '#424242' });
    });
    // FAB
    const fr = lt > .9 ? E.outBack(prog(lt, .9, 1.2)) : 0;
    ctx.save(); ctx.translate(850, 1110); ctx.rotate(fr * Math.PI / 4);
    ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#ff4081'; ctx.beginPath(); ctx.arc(0, 0, 56, 0, TAU); ctx.fill(); ctx.shadowColor = 'transparent';
    ctx.fillStyle = '#fff'; ctx.fillRect(-24, -5, 48, 10); ctx.fillRect(-5, -24, 10, 48);
    ctx.restore();
    const rp = prog(lt, .9, 1.4);
    if (rp > 0 && rp < 1) { ctx.fillStyle = `rgba(255,64,129,${.25 * (1 - rp)})`; ctx.beginPath(); ctx.arc(850, 1110, 60 + 260 * rp, 0, TAU); ctx.fill(); }
    if (hero) drawHero(ctx, 'material', hero);
  },
};

// ── 06 2020 멤버십 + 쇼핑라이브 — 네온 그라디언트 ───────────
const CHAT = ['와 이 가격 실화?', '방금 구매 완료!', '적립까지 챙겼어요', '2개 담았어요 ㅎㅎ', '색상 더 보여주세요', '라이브 혜택 최고'];
function neonText(ctx, s, x, y, size, col, glow, font = 'PretBlk') {
  ctx.save(); ctx.shadowColor = glow;
  for (const b of [40, 18]) { ctx.shadowBlur = b; text(ctx, s, x, y, { font, size, color: col }); }
  ctx.restore(); text(ctx, s, x, y, { font, size, color: '#fff' });
}
const ERA_2020 = {
  style: 'neon',
  draw(ctx, lt, hero, t) {
    const g = ctx.createLinearGradient(0, 0, PW, PH); g.addColorStop(0, '#1a0533'); g.addColorStop(.6, '#4a0e6b'); g.addColorStop(1, '#8e1f8f');
    ctx.fillStyle = g; ctx.fillRect(0, 0, PW, PH);
    const R = rng(4);
    for (let i = 0; i < 14; i++) {
      const x = R() * PW, y = (R() * PH - t * (20 + R() * 30)) % PH, r = 20 + R() * 60;
      ctx.fillStyle = `rgba(255,${120 + R() * 100 | 0},255,${.05 + R() * .06})`; ctx.beginPath(); ctx.arc(x, (y + PH) % PH, r, 0, TAU); ctx.fill();
    }
    // 멤버십 적립 포인트 비
    for (let i = 0; i < 9; i++) {
      const x = 60 + R() * 840, sp = 140 + R() * 120, y = ((R() * PH + t * sp) % (PH + 100)) - 50, rot = t * 3 + i;
      ctx.save(); ctx.translate(x, y); ctx.scale(Math.cos(rot), 1);
      const cg = ctx.createRadialGradient(-8, -8, 2, 0, 0, 30); cg.addColorStop(0, '#fff6c0'); cg.addColorStop(1, '#d9a400');
      ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(0, 0, 28, 0, TAU); ctx.fill();
      text(ctx, 'P', 0, 2, { font: 'PretBlk', size: 32, color: '#8a6100' }); ctx.restore();
    }
    neonText(ctx, '쇼핑라이브', 480, 92, 76, '#ff3df2', '#ff3df2');
    // 라이브 화면
    const fx = 250, fy = 170, fw = 460, fh = 860;
    ctx.save(); ctx.shadowColor = '#ff3df2'; ctx.shadowBlur = 40;
    ctx.strokeStyle = '#ff9df8'; ctx.lineWidth = 6; rr(ctx, fx, fy, fw, fh, 40); ctx.stroke(); ctx.restore();
    ctx.save(); rr(ctx, fx, fy, fw, fh, 40); ctx.clip();
    const sg = ctx.createLinearGradient(0, fy, 0, fy + fh); sg.addColorStop(0, '#ffb4c8'); sg.addColorStop(1, '#ffd6a5');
    ctx.fillStyle = sg; ctx.fillRect(fx, fy, fw, fh);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.beginPath(); ctx.moveTo(fx + fw / 2 - 40, fy); ctx.lineTo(fx + fw / 2 + 40, fy); ctx.lineTo(fx + fw / 2 + 200, fy + 760); ctx.lineTo(fx + fw / 2 - 200, fy + 760); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(480, 820, 150, 34, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#f2e6ea'; ctx.fillRect(330, 820, 300, 130); ctx.beginPath(); ctx.ellipse(480, 950, 150, 34, 0, 0, TAU); ctx.fill();
    // LIVE 배지
    const bl = Math.floor(t * 2.5) % 2;
    ctx.fillStyle = '#ff1744'; rr(ctx, fx + 24, fy + 26, 110, 48, 24); ctx.fill();
    ctx.fillStyle = bl ? '#fff' : '#ffcdd2'; ctx.beginPath(); ctx.arc(fx + 50, fy + 50, 8, 0, TAU); ctx.fill();
    text(ctx, 'LIVE', fx + 92, fy + 51, { font: 'PretBlk', size: 28, color: '#fff' });
    ctx.fillStyle = 'rgba(0,0,0,.35)'; rr(ctx, fx + 144, fy + 26, 140, 48, 24); ctx.fill();
    text(ctx, '시청 1.2만', fx + 214, fy + 51, { font: 'PretXB', size: 24, color: '#fff' });
    // 채팅
    const scroll = (t * 1.6) % 1, base = Math.floor(t * 1.6);
    for (let k = 0; k < 4; k++) {
      const msg = CHAT[(base + k) % CHAT.length], y = fy + fh - 120 - (k + scroll) * 64, a = clamp(1 - (k + scroll) / 4);
      ctx.font = '26px PretSB'; const w = ctx.measureText(msg).width + 40;
      ctx.fillStyle = `rgba(0,0,0,${.35 * a})`; rr(ctx, fx + 20, y - 24, w, 48, 24); ctx.fill();
      text(ctx, msg, fx + 40, y, { font: 'PretSB', size: 26, color: '#fff', align: 'left', alpha: a });
    }
    ctx.restore();
    // 하트 스트림
    for (let i = 0; i < 12; i++) {
      const u = ((t * .9 + i / 12) % 1), x = fx + fw - 40 + Math.sin(u * 9 + i) * 30 + u * 60, y = fy + fh - 60 - u * 620, s = 18 + 10 * Math.sin(i);
      ctx.save(); ctx.globalAlpha = 1 - u; ctx.translate(x, y); ctx.scale(s / 20, s / 20);
      ctx.fillStyle = ['#ff3df2', '#2de2ff', '#ff6b9d', '#ffe14d'][i % 4]; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 12;
      ctx.beginPath(); ctx.moveTo(0, 12); ctx.bezierCurveTo(-26, -6, -12, -24, 0, -10); ctx.bezierCurveTo(12, -24, 26, -6, 0, 12); ctx.fill(); ctx.restore();
    }
    neonText(ctx, '멤버십 적립', 480, 1112, 60, '#2de2ff', '#2de2ff');
    if (hero) drawHero(ctx, 'neon', hero);
  },
};

// ── 07 2025.3 네이버플러스 스토어 — 글래스모피즘 + AI 오로라 ───
const ERA_2025A = {
  style: 'glass',
  draw(ctx, lt, hero, t) {
    ctx.fillStyle = '#070b1a'; ctx.fillRect(0, 0, PW, PH);
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    [[C.green, 260, 380, 420, .35], [C.purple, 720, 620, 480, .45], ['#2de2ff', 420, 980, 380, .25]].forEach(([col, x, y, r, a], i) => {
      const xx = x + 90 * Math.sin(t * .6 + i * 2), yy = y + 70 * Math.cos(t * .5 + i);
      const g = ctx.createRadialGradient(xx, yy, 0, xx, yy, r);
      g.addColorStop(0, col + Math.round(a * 255).toString(16).padStart(2, '0')); g.addColorStop(1, col + '00');
      ctx.fillStyle = g; ctx.fillRect(0, 0, PW, PH);
    });
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.05)'; for (let y = 20; y < PH; y += 40) for (let x = 20; x < PW; x += 40) ctx.fillRect(x, y, 2, 2);
    // AI 프롬프트
    glassCard(ctx, 60, 90, 840, 120, 60, .1);
    sparkle(ctx, 125, 150, 30, C.green); sparkle(ctx, 150, 128, 12, C.purple);
    const q = '가을 캠핑 준비물 추천해줘', n = Math.floor(q.length * prog(lt, .05, .5));
    text(ctx, q.slice(0, n) + (Math.floor(t * 3) % 2 && n < q.length + 1 ? '|' : ''), 190, 150, { font: 'PretSB', size: 40, color: '#fff', align: 'left' });
    text(ctx, '네이버플러스 스토어 · AI 맞춤 추천', 480, 262, { font: 'PretSB', size: 28, color: 'rgba(255,255,255,.65)' });
    // 추천 카드
    const items = [['텐트', 'tent'], ['랜턴', 'lantern'], ['캠핑 의자', 'chair']];
    items.forEach(([nm, ic], i) => {
      const u = E.outBack(prog(lt, .55 + i * .1, .95 + i * .1), 1.3); if (u <= 0) return;
      const x = 60 + i * 290, y = 770 + (1 - u) * 160;
      ctx.save(); ctx.globalAlpha = clamp(u);
      glassCard(ctx, x, y, 260, 310, 30, .1);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      const cx = x + 130, cy = y + 110;
      ctx.beginPath();
      if (ic === 'tent') { ctx.moveTo(cx - 70, cy + 50); ctx.lineTo(cx, cy - 55); ctx.lineTo(cx + 70, cy + 50); ctx.closePath(); ctx.moveTo(cx, cy - 55); ctx.lineTo(cx - 18, cy + 50); }
      else if (ic === 'lantern') { ctx.roundRect(cx - 32, cy - 30, 64, 80, 12); ctx.moveTo(cx - 20, cy - 30); ctx.arc(cx, cy - 30, 20, Math.PI, TAU); }
      else { ctx.moveTo(cx - 50, cy - 40); ctx.lineTo(cx - 40, cy + 10); ctx.lineTo(cx + 40, cy + 10); ctx.lineTo(cx + 50, cy - 40); ctx.moveTo(cx - 40, cy + 10); ctx.lineTo(cx - 55, cy + 55); ctx.moveTo(cx + 40, cy + 10); ctx.lineTo(cx + 55, cy + 55); }
      ctx.stroke();
      if (ic === 'lantern') { ctx.fillStyle = 'rgba(255,230,120,.8)'; ctx.beginPath(); ctx.arc(cx, cy + 10, 16, 0, TAU); ctx.fill(); }
      text(ctx, nm, cx, y + 215, { font: 'PretXB', size: 34, color: '#fff' });
      const tg = ctx.createLinearGradient(x + 60, 0, x + 200, 0); tg.addColorStop(0, C.green); tg.addColorStop(1, C.purple);
      ctx.fillStyle = tg; rr(ctx, x + 65, y + 245, 130, 42, 21); ctx.fill();
      text(ctx, 'AI 추천', cx, y + 267, { font: 'PretXB', size: 24, color: '#06101f' });
      ctx.restore();
      const sp = prog(lt, .75 + i * .1, 1.2 + i * .1);
      if (sp > 0 && sp < 1) sparkle(ctx, x + 230, y + 30, 26 * Math.sin(sp * Math.PI), '#fff');
    });
    for (let i = 0; i < 10; i++) { const r = rng(i + 3), x = r() * PW, y = 300 + r() * 420, a = Math.max(0, Math.sin(t * 3 + i * 1.7)); sparkle(ctx, x, y, 10 * a, `rgba(255,255,255,${a})`); }
    if (hero) drawHero(ctx, 'glass', hero);
  },
};

// ── 08 2025.10 첫 넾다세일 — KV ──────────────────────────
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
function wonKR(v) {
  if (v >= 1e12) return '1조 원';
  return Math.floor(v / 1e8).toLocaleString('en-US') + '억 원';
}
const ERA_NEP = {
  style: 'kv',
  draw(ctx, lt, hero, t) {
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, PW, PH);
    drawSpikes(ctx, 480, 560, 420, t, { R: 1300 });
    ctx.fillStyle = 'rgba(145,98,255,.9)';
    for (let y = 0; y < 6; y++) for (let x = 0; x < 6 - y; x++) { ctx.beginPath(); ctx.arc(30 + x * 22, 30 + y * 22, 6 - y * .7, 0, TAU); ctx.fill(); }
    text(ctx, '2025.10', 920, 60, { font: 'BHS', size: 56, color: '#000', align: 'right' });
    const lw = 300, lh = lw * IMG.logo.height / IMG.logo.width;
    ctx.fillStyle = '#fff'; rr(ctx, 480 - lw / 2 - 26, 112, lw + 52, lh + 70, 14); ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 6; ctx.stroke();
    text(ctx, '첫', 480, 135, { font: 'PretBlk', size: 30, color: '#000' });
    ctx.drawImage(IMG.logo, 480 - lw / 2, 154, lw, lh);
    // 누적 판매액 카운터 → 1조 원 돌파
    ctx.save(); ctx.translate(480, 1040); ctx.rotate(-.03);
    ctx.fillStyle = '#000'; ctx.fillRect(-412, -98, 840, 210); ctx.fillStyle = '#fff'; ctx.fillRect(-420, -106, 840, 210);
    ctx.strokeStyle = '#000'; ctx.lineWidth = 8; ctx.strokeRect(-420, -106, 840, 210);
    const next = lt >= .9;
    text(ctx, next ? '그리고 2026,' : '2주간 누적 판매액', -380, -58, { font: 'PretXB', size: 36, color: next ? '#b8322a' : '#000', align: 'left' });
    const v = 1e12 * E.outExpo(prog(lt, .02, .5)), hit = lt >= .5;
    const k = next ? slam(lt, .9, .18, 1.6) : hit ? slam(lt, .5, .18, 1.6) : 1;
    ctx.save(); ctx.translate(0, 34); ctx.scale(k, k);
    text(ctx, next ? '더 거대하게!' : hit ? '1조 원 돌파!' : wonKR(v), 0, 0, { font: 'PretBlk', size: 108, color: hit ? (next ? C.green : C.purple) : '#000', stroke: hit ? '#000' : null, sw: 10 });
    ctx.restore(); ctx.restore();
    if (hero) drawHero(ctx, 'kv', hero);
  },
};

const ERAS = [
  { ...ERA_2003, cap: ['01', '지식쇼핑', '2003.10 · 200여 개 쇼핑몰 가격을 한 번에'], yr: "'03" },
  { ...ERA_2012, cap: ['02', '샵N', '2012.3 · 판매자가 직접 여는 내 상점'], yr: "'12" },
  { ...ERA_2014, cap: ['03', '스토어팜', '2014.6 · 누구나 무료로 입점'], yr: "'14" },
  { ...ERA_2015, cap: ['04', '네이버페이', '2015.6 · 검색부터 결제까지 한 번에'], yr: "'15" },
  { ...ERA_2018, cap: ['05', '스마트스토어', '2018.2 · 데이터로 키우는 내 가게'], yr: "'18" },
  { ...ERA_2020, cap: ['06', '멤버십 · 쇼핑라이브', '2020 · 적립 혜택에 라이브 커머스까지'], yr: "'20" },
  { ...ERA_2025A, cap: ['07', '네이버플러스 스토어', '2025.3 · AI가 골라주는 쇼핑 앱'], yr: "'25.3" },
  { ...ERA_NEP, cap: ['08', '첫 넾다세일', '2025.10 · 2주 만에 누적 판매액 1조 원'], yr: "'25.10" },
];
