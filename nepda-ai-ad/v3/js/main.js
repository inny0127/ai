// ───────────────────────── 부트스트랩 ─────────────────────────
const CV = document.getElementById('c'), CTX = CV.getContext('2d');
const FAMS = ['BHS', 'PretBlk', 'PretXB', 'PretB', 'PretSB', 'SongMyung', 'Brush', 'MyeongjoXB', 'NotoSerifBlk', 'DoHyeon', 'Jua', 'Galmuri', 'GalmuriB', 'Gowun', 'YeonSung'];
async function init() {
  await Promise.all(FAMS.map(f => document.fonts.load(`40px ${f}`, '가나다大賣出A1☎★')));
  await Promise.all([
    loadImg('logo', 'img/logo_hi.png'), loadImg('neop', 'img/glyph_neop.png'), loadImg('da', 'img/glyph_da.png'),
    loadImg('seil', 'img/glyph_seil.png'), loadImg('kv', 'img/kv_banner.png'),
  ]);
  drawFrame(CTX, 0);
  window.READY = true;
}
window.renderAt = t => { drawFrame(CTX, t); };
window.audioB64 = async () => {
  const u = new Uint8Array(await renderAudio());
  let bin = ''; for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
  return btoa(bin);
};
init().then(async () => {
  if (!location.search.includes('preview')) return;
  document.body.classList.add('preview');
  const ac = new AudioContext(), buf = await ac.decodeAudioData(await renderAudio());
  const start = () => {
    const src = ac.createBufferSource(); src.buffer = buf; src.connect(ac.destination);
    const t0 = ac.currentTime; src.start();
    const loop = () => { const t = ac.currentTime - t0; if (t < DUR) { drawFrame(CTX, t); requestAnimationFrame(loop); } else start(); };
    loop();
  };
  document.body.addEventListener('click', () => { ac.resume(); start(); }, { once: true });
  drawFrame(CTX, 0.9);
});
