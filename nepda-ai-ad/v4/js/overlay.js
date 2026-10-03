// ───────────── 2D 오버레이: 카운터 · 자막 · 엔딩 카드 ─────────────
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const prog = (t, a, b) => clamp((t - a) / (b - a));
const eOut = x => 1 - Math.pow(1 - x, 3);
const eBack = (x, s = 1.7) => { const c = s + 1; return 1 + c * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2); };
const GREEN = '#00F550', PURPLE = '#9162FF';

function txt(ctx, s, x, y, o = {}) {
  ctx.save();
  ctx.font = `${o.size || 40}px ${o.font || 'PretBlk'}`;
  ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  ctx.globalAlpha *= o.alpha ?? 1;
  if (o.glow) { ctx.shadowColor = o.glow; ctx.shadowBlur = o.glowBlur || 18; }
  if (o.stroke) { ctx.lineJoin = 'round'; ctx.strokeStyle = o.stroke; ctx.lineWidth = o.sw || 8; ctx.strokeText(s, x, y); }
  ctx.fillStyle = o.color || '#111'; ctx.fillText(s, x, y);
  ctx.restore();
}
function caption(ctx, t, t0, t1, s) {
  const a = prog(t, t0, t0 + .3) * (1 - prog(t, t1 - .3, t1));
  if (a <= 0) return;
  const y = 1690 + (1 - eOut(prog(t, t0, t0 + .35))) * 24;
  txt(ctx, s, 540, y, { size: 74, color: '#121212', alpha: a, glow: 'rgba(255,255,255,.95)', glowBlur: 26 });
  txt(ctx, s, 540, y, { size: 74, color: '#121212', alpha: a });
}

export function drawOverlay(ctx, t, info) {
  const { landed, total, kv } = info;
  // 카운터: 혜택 N개
  const ca = prog(t, .5, .8) * (1 - prog(t, 13.3, 13.55));
  if (ca > 0) {
    ctx.save(); ctx.globalAlpha = ca;
    txt(ctx, '혜택', 66, 132, { size: 42, font: 'PretXB', align: 'left', color: '#121212', glow: 'rgba(255,255,255,.9)' });
    const n = landed.toLocaleString('en-US') + '개';
    txt(ctx, n, 62, 210, { size: 104, align: 'left', color: '#121212', glow: 'rgba(255,255,255,.95)', glowBlur: 24 });
    txt(ctx, n, 62, 210, { size: 104, align: 'left', color: '#121212' });
    ctx.restore();
  }
  caption(ctx, t, .95, 2.9, '혜택 하나.');
  caption(ctx, t, 3.4, 6.1, '쓰면 쓸수록');
  caption(ctx, t, 6.1, 9.6, '커지는 혜택');
  caption(ctx, t, 10.4, 13.3, `${total.toLocaleString('en-US')}개의 혜택이 모이면`);
  caption(ctx, t, 15.9, 20.5, '10월 26일, 혜택이 열린다');

  // 엔딩 카드
  if (t > 20.7) {
    const k = eBack(prog(t, 20.8, 21.25)), w = 980, h = w * kv.height / kv.width, cy = 720;
    if (k > 0) {
      ctx.save(); ctx.translate(540, cy); ctx.scale(k, k); ctx.rotate(-.015);
      ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 50; ctx.shadowOffsetY = 20;
      ctx.fillStyle = '#fff'; ctx.fillRect(-w / 2 - 14, -h / 2 - 14, w + 28, h + 28);
      ctx.shadowColor = 'transparent'; ctx.drawImage(kv, -w / 2, -h / 2, w, h);
      for (const s0 of [21.6, 23.6]) {
        const p = prog(t, s0, s0 + .7); if (p <= 0 || p >= 1) continue;
        ctx.save(); ctx.beginPath(); ctx.rect(-w / 2, -h / 2, w, h); ctx.clip();
        const x = -w + 2 * w * p, g = ctx.createLinearGradient(x - 110, 0, x + 110, 0);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.transform(1, 0, -.4, 1, 0, 0); ctx.fillRect(x - 110, -h, 220, h * 2); ctx.restore();
      }
      ctx.restore();
    }
    txt(ctx, '네이버플러스 스토어', 540, cy - h / 2 - 90, { size: 46, font: 'PretXB', color: '#fff', alpha: prog(t, 21.0, 21.3) });
    const dk = t < 21.35 ? 0 : 1 + (2.2 - 1) * (1 - eOut(prog(t, 21.35, 21.55))), beat = t > 24 ? 1 + .06 * Math.max(0, 1 - (t - 24) / .35) : 1;
    if (dk > 0) { ctx.save(); ctx.translate(540, 1110); ctx.scale(dk * beat, dk * beat); txt(ctx, '10.26 ~ 11.8', 0, 0, { size: 168, color: '#fff' }); ctx.restore(); }
    const pp = eBack(prog(t, 21.7, 22.05));
    if (pp > 0) {
      const pulse = 1 + .03 * Math.max(0, Math.sin((t - 21.7) * Math.PI * 2));
      ctx.save(); ctx.translate(540, 1300); ctx.scale(pp * pulse, pp * pulse);
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.roundRect(-416, -54, 840, 124, 62); ctx.fill();
      ctx.fillStyle = GREEN; ctx.beginPath(); ctx.roundRect(-420, -62, 840, 124, 62); ctx.fill();
      txt(ctx, '네이버플러스 스토어에서 만나요', 0, 2, { size: 52, font: 'PretXB', color: '#000' });
      ctx.restore();
    }
    txt(ctx, '#넾다세일', 540, 1450, { size: 52, font: 'PretXB', color: '#cbb6ff', alpha: prog(t, 22.0, 22.3) });
    txt(ctx, `상자 ${total.toLocaleString('en-US')}개를 코드로 하나씩 놓아 만든 AI 영상입니다`, 540, 1840, { size: 26, font: 'PretSB', color: 'rgba(255,255,255,.7)', alpha: prog(t, 22.2, 22.5) });
  }
}
