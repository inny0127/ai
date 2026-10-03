// ───────────── 부트스트랩: 데이터 준비 → 3D 장면 → 프레임 캡처 ─────────────
import * as D from './design.js';
import { Mosaic, W, H } from './scene.js';
import { drawOverlay } from './overlay.js';

const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
const load = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

async function init() {
  await Promise.all(['PretBlk', 'PretXB', 'PretSB', 'Gowun'].map(f => document.fonts.load(`40px ${f}`, '가나다0123')));
  const [logo, kv] = await Promise.all([load('img/logo_hi.png'), load('img/kv_banner.png')]);
  const A = mk(D.DW, D.DH); D.drawImageA(A.getContext('2d'), logo);
  const B = mk(D.DW, D.DH); D.drawImageB(B.getContext('2d'), logo);
  const ta = D.sampleTiles(A, D.PALETTES.A), tb = D.sampleTiles(B, D.PALETTES.B);
  const rib = new Uint8Array(D.N * 3);
  for (let k = 0; k < D.N; k++) rib.set(D.ribbonFor([ta.rgb[k * 3], ta.rgb[k * 3 + 1], ta.rgb[k * 3 + 2]]), k * 3);
  // 첫 상자: 검정 광택 + 초록 리본 (훅)
  const sch = D.buildSchedule(ta.idx, ta.pal);
  const groundTex = D.groundTexture(logo);
  const detailTex = mk(512, 512); {
    const g = detailTex.getContext('2d'), im = g.createImageData(512, 512), n1 = D.makeNoise(77), n2 = D.makeNoise(78);
    for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
      const v = .55 * D.fbm(n1, x / 24, y / 24, 4) + .45 * n2(x / 2.5, y / 2.5), o = (y * 512 + x) * 4;
      const c = Math.max(0, Math.min(255, v * 255)); im.data[o] = im.data[o + 1] = im.data[o + 2] = c; im.data[o + 3] = 255;
    }
    g.putImageData(im, 0, 0);
  }
  const mosaic = new Mosaic(document.getElementById('gl'), { colA: ta.rgb, colB: tb.rgb, rib, sch, groundTex, detailTex });
  const out = document.getElementById('out'), octx = out.getContext('2d', { willReadFrequently: true });
  const landSorted = Float32Array.from(sch.order, k => sch.tLand[k]);
  const landedAt = t => { let lo = 0, hi = landSorted.length; while (lo < hi) { const m = (lo + hi) >> 1; if (landSorted[m] <= t) lo = m + 1; else hi = m; } return lo; };
  window.renderFrame = t => {
    mosaic.render(t);
    octx.drawImage(document.getElementById('gl'), 0, 0);
    drawOverlay(octx, t, { landed: landedAt(t), total: D.N, kv });
  };
  window.renderAt = t => {
    window.renderFrame(t);
    const d = octx.getImageData(0, 0, W, H).data;
    let s = ''; for (let i = 0; i < d.length; i += 0x8000) s += String.fromCharCode.apply(null, d.subarray(i, i + 0x8000));
    return btoa(s);
  };
  window.renderPNG = t => { window.renderFrame(t); return out.toDataURL('image/png'); };
  window.audioB64 = async () => {
    const { renderAudio } = await import('./audio.js');
    const u = new Uint8Array(await renderAudio(sch));
    let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return btoa(s);
  };
  window.SCH = sch;
  window.READY = true;
}
init().catch(e => { console.error('init failed', e.stack || e); window.INIT_ERROR = String(e); });
