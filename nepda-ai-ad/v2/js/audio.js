// ─────────── 사운드트랙: Web Audio(OfflineAudioContext)로 전부 합성 ───────────
// 120 BPM. 시대마다 장르가 바뀌고(원시 북 → 국악 → 트로트 → 신스팝 → 홈쇼핑 징글 → 칩튠 → 트로피컬)
// 2026 에서 빌드업 → 드롭. 외부 음원/샘플 0%.
const m2f = m => 440 * Math.pow(2, (m - 69) / 12);
const CH = { Am: [57, 60, 64], C: [55, 60, 64], Dm: [57, 62, 65], F: [57, 60, 65], G: [55, 59, 62], E: [56, 59, 64] };
const ROOT = { Am: 45, C: 48, Dm: 50, F: 41, G: 43, E: 40 };
const MOTIF = [[0, 69, .45], [.5, 72, .45], [1, 74, .45], [1.5, 76, .9], [2.5, 79, .45], [3, 76, .9]];

async function renderAudio() {
  const SR = 48000, ac = new OfflineAudioContext(2, Math.ceil(DUR * SR), SR);
  const R = rng(2026);
  // ── 버스
  const master = ac.createGain(); master.gain.value = .78;
  const comp = ac.createDynamicsCompressor();
  comp.threshold.value = -18; comp.knee.value = 10; comp.ratio.value = 3; comp.attack.value = .005; comp.release.value = .2;
  const clip = ac.createWaveShaper(); clip.curve = tanhCurve(1.15); clip.oversample = '4x';
  master.connect(comp); comp.connect(clip); clip.connect(ac.destination);
  master.gain.setValueAtTime(.78, 25.3); master.gain.linearRampToValueAtTime(0, DUR);
  const duck = ac.createGain(); duck.connect(master);
  const musicLP = ac.createBiquadFilter(); musicLP.type = 'lowpass'; musicLP.frequency.value = 20000; musicLP.Q.value = .8; musicLP.connect(duck);
  const music = ac.createGain(); music.gain.value = .9; music.connect(musicLP);
  const drums = ac.createGain(); drums.gain.value = .95; drums.connect(master);
  const sfx = ac.createGain(); sfx.gain.value = .9; sfx.connect(master);
  const rev = ac.createConvolver(); rev.buffer = makeIR(ac, 2.8, 2.6);
  const revOut = ac.createGain(); revOut.gain.value = .5; rev.connect(revOut); revOut.connect(master);
  const send = ac.createGain(); send.connect(rev);

  const NB = ac.createBuffer(1, SR * 3, SR); { const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; }
  const noise = (t, dur) => { const s = ac.createBufferSource(); s.buffer = NB; s.start(t, R() * 1.5, dur + .05); return s; };
  const G = v => { const g = ac.createGain(); g.gain.value = v; return g; };
  const F = (type, f, Q = 1) => { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = Q; return b; };
  const pan = (p) => { const s = ac.createStereoPanner(); s.pan.value = p; return s; };
  function env(g, t, a, peak, d, hold = 0) {
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a);
    if (hold) g.gain.setValueAtTime(peak, t + a + hold);
    g.gain.exponentialRampToValueAtTime(1e-4, t + a + hold + d); g.gain.setValueAtTime(0, t + a + hold + d + .01);
  }
  function out(node, dest, p = 0, r = 0) {
    const pn = pan(p); node.connect(pn); pn.connect(dest);
    if (r) { const s = G(r); pn.connect(s); s.connect(send); }
  }
  function osc(type, f, t, dur) { const o = ac.createOscillator(); o.type = type; o.frequency.value = f; o.start(t); o.stop(t + dur + .05); return o; }

  // ── 드럼/타악
  function kick(t, v = 1, f0 = 150, f1 = 42, d = .42, dest = drums) {
    const o = osc('sine', f0, t, d + .1); o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + .11);
    const g = G(0); env(g, t, .002, v, d); o.connect(g); out(g, dest);
    const n = noise(t, .02), b = F('bandpass', 3500, .8), ng = G(0); env(ng, t, .001, v * .35, .015); n.connect(b); b.connect(ng); out(ng, dest);
    if (dest === drums && t >= 17.4) { duck.gain.setValueAtTime(.32, t); duck.gain.linearRampToValueAtTime(1, t + .24); }
  }
  function snare(t, v = .7, gated = false) {
    const n = noise(t, .4), hp = F('highpass', 900), lp = F('lowpass', gated ? 5200 : 12000), g = G(0);
    if (gated) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v * .55, t + .003); g.gain.exponentialRampToValueAtTime(v * .25, t + .2); g.gain.linearRampToValueAtTime(0, t + .23); }
    else env(g, t, .002, v, .16);
    n.connect(hp); hp.connect(lp); lp.connect(g); out(g, drums, 0, gated ? .35 : .15);
    const o = osc('triangle', 200, t, .12); o.frequency.exponentialRampToValueAtTime(150, t + .08);
    const og = G(0); env(og, t, .002, v * .6, .08); o.connect(og); out(og, drums);
  }
  function clap(t, v = .6) {
    const n = noise(t, .3), b = F('bandpass', 1400, 1.2), g = G(0);
    g.gain.setValueAtTime(0, t);
    [0, .011, .022].forEach(o => { g.gain.setValueAtTime(v, t + o); g.gain.exponentialRampToValueAtTime(v * .2, t + o + .009); });
    g.gain.setValueAtTime(v, t + .033); g.gain.exponentialRampToValueAtTime(1e-4, t + .2);
    n.connect(b); b.connect(g); out(g, drums, 0, .25);
  }
  function hat(t, v = .25, open = false, p = .15) {
    const n = noise(t, .3), hp = F('highpass', 8000), g = G(0); env(g, t, .001, v, open ? .2 : .035);
    n.connect(hp); hp.connect(g); out(g, drums, p);
  }
  function shaker(t, v = .18) { const n = noise(t, .12), b = F('bandpass', 6500, 2), g = G(0); env(g, t, .012, v, .06); n.connect(b); b.connect(g); out(g, drums, -.2); }
  function tom(t, f, v = .8) {
    const o = osc('sine', f * 1.7, t, .5); o.frequency.exponentialRampToValueAtTime(f, t + .18);
    const g = G(0); env(g, t, .003, v, .38); o.connect(g); out(g, drums, (f % 2) ? -.25 : .25, .2);
    const n = noise(t, .05), lp = F('lowpass', 1200), ng = G(0); env(ng, t, .001, v * .3, .04); n.connect(lp); lp.connect(ng); out(ng, drums);
  }
  // 장구: 덩(양면) / 덕(채편) / 쿵(북편)
  function kung(t, v = .9) { const o = osc('sine', 120, t, .5); o.frequency.exponentialRampToValueAtTime(68, t + .15); const g = G(0); env(g, t, .002, v, .35); o.connect(g); out(g, drums, -.3, .15); }
  function deok(t, v = .5) { const n = noise(t, .08), b = F('bandpass', 2600, 1.5), g = G(0); env(g, t, .001, v, .05); n.connect(b); b.connect(g); out(g, drums, .35, .2); const o = osc('triangle', 520, t, .06), og = G(0); env(og, t, .001, v * .4, .04); o.connect(og); out(og, drums, .35); }
  const dung = (t, v) => { kung(t, v); deok(t, v * .6); };
  function kkwaeng(t, v = .22) {
    [520, 1043, 1580, 2210, 3075, 3900].forEach((f, i) => { const o = osc('square', f, t, .7), g = G(0); env(g, t, .001, v / (i + 1.5), .45 - i * .04); const b = F('bandpass', f, 3); o.connect(b); b.connect(g); out(g, drums, .1, .3); });
  }
  // ── 음정 악기
  const KS = new Map();
  function ksBuf(f, dur = 2.2, decay = .996, bright = .5) {
    const key = f.toFixed(2) + bright; if (KS.has(key)) return KS.get(key);
    const N = Math.round(SR / f), len = Math.floor(SR * dur), b = ac.createBuffer(1, len, SR), d = b.getChannelData(0), r = rng(Math.round(f));
    let prev = 0; for (let i = 0; i < N; i++) { const w = r() * 2 - 1; prev = prev + bright * (w - prev); d[i] = prev; }
    for (let i = N; i < len; i++) d[i] = decay * .5 * (d[i - N] + d[i - N - 1 < 0 ? 0 : i - N - 1]);
    KS.set(key, b); return b;
  }
  function pluck(t, m, v = .5, p = 0, dest = music, bright = .5, r = .25) {
    const s = ac.createBufferSource(); s.buffer = ksBuf(m2f(m), 2.2, .996, bright); s.start(t);
    const g = G(v); s.connect(g); out(g, dest, p, r);
  }
  function voice(type, m, t, dur, v, o = {}) {
    const f = typeof m === 'number' && m < 140 ? m2f(m) : m;
    const os = osc(type, f, t, dur + (o.rel || .1));
    if (o.det) os.detune.value = o.det;
    if (o.vib) { const l = osc('sine', o.vib[0], t, dur + .2), lg = G(f * o.vib[1]); l.connect(lg); lg.connect(os.frequency); }
    let node = os;
    if (o.lp) { const b = F('lowpass', o.lp, o.q || 1); if (o.lpEnv) { b.frequency.setValueAtTime(o.lpEnv[0], t); b.frequency.exponentialRampToValueAtTime(o.lpEnv[1], t + o.lpEnv[2]); } node.connect(b); node = b; }
    const g = G(0); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + (o.a || .005));
    g.gain.setTargetAtTime(v * (o.sus ?? .6), t + (o.a || .005), o.d || .1);
    g.gain.setValueAtTime(v * (o.sus ?? .6), t + dur); g.gain.exponentialRampToValueAtTime(1e-4, t + dur + (o.rel || .1));
    node.connect(g); out(g, o.dest || music, o.p || 0, o.r || 0); return g;
  }
  function fm(t, m, dur, v, ratio = 3.5, index = 2, o = {}) {
    const f = m2f(m), c = osc('sine', f, t, dur + .6), mo = osc('sine', f * ratio, t, dur + .6), mg = G(0);
    mg.gain.setValueAtTime(f * index, t); mg.gain.exponentialRampToValueAtTime(f * index * .05 + 1, t + (o.md || .5));
    mo.connect(mg); mg.connect(c.frequency);
    const g = G(0); env(g, t, .003, v, dur + .4); c.connect(g); out(g, o.dest || music, o.p || 0, o.r ?? .3);
  }
  let PULSE = null;
  function pulseWave(duty) { const n = 32, re = new Float32Array(n), im = new Float32Array(n); for (let k = 1; k < n; k++) { re[k] = 2 / (k * Math.PI) * Math.sin(k * Math.PI * duty); } return ac.createPeriodicWave(re, im); }
  function chip(t, m, dur, v, duty = .25, p = 0) {
    PULSE = PULSE || { 25: pulseWave(.25), 12: pulseWave(.125) };
    const o = ac.createOscillator(); o.setPeriodicWave(duty === .25 ? PULSE[25] : PULSE[12]); o.frequency.value = m2f(m); o.start(t); o.stop(t + dur + .02);
    const g = G(0); g.gain.setValueAtTime(v, t); g.gain.setValueAtTime(v, t + dur - .01); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g); out(g, music, p);
  }
  function marimba(t, m, v = .5, p = 0) {
    const f = m2f(m);
    [[1, 1, .28], [4, .25, .06], [10, .06, .02]].forEach(([h, a, d]) => { const o = osc('sine', f * h, t, .5), g = G(0); env(g, t, .002, v * a, d); o.connect(g); out(g, music, p, .25); });
  }
  function supersaw(t, notes, dur, v = .16, dest = music) {
    notes.forEach((m, j) => [-24, -10, 0, 10, 24].forEach((det, k) => {
      voice('sawtooth', m, t, dur, v / 3, { det, lp: 5200, a: .008, sus: .8, d: .2, rel: .18, p: (k - 2) * .3, r: .25, dest });
    }));
  }
  function sub(t, m, dur, v = .6) {
    const o = osc('sine', m2f(m) * 1.4, t, dur + .1); o.frequency.exponentialRampToValueAtTime(m2f(m), t + .04);
    const sh = ac.createWaveShaper(); sh.curve = tanhCurve(2.2);
    const g = G(0); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .005); g.gain.setValueAtTime(v, t + dur - .03); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(sh); sh.connect(g); out(g, music);
  }
  // ── 효과음
  function boom(t, v = 1) {
    const o = osc('sine', 90, t, 1.8); o.frequency.exponentialRampToValueAtTime(27, t + 1.1);
    const sh = ac.createWaveShaper(); sh.curve = tanhCurve(2.5);
    const g = G(0); env(g, t, .003, v, 1.5); o.connect(sh); sh.connect(g); out(g, sfx, 0, .35);
    const n = noise(t, .8), lp = F('lowpass', 1400), ng = G(0); env(ng, t, .002, v * .7, .4); n.connect(lp); lp.connect(ng); out(ng, sfx, 0, .5);
  }
  function crash(t, v = .4, d = 1.8) {
    const n = noise(t, d + .2), hp = F('highpass', 4800), g = G(0); env(g, t, .002, v, d); n.connect(hp); hp.connect(g); out(g, sfx, .2, .4);
    const n2 = noise(t, d), b2 = F('bandpass', 9500, 2), g2 = G(0); env(g2, t, .002, v * .6, d * .7); n2.connect(b2); b2.connect(g2); out(g2, sfx, -.2, .3);
  }
  function revCym(tEnd, len, v = .35) {
    const t = tEnd - len, n = noise(t, len), hp = F('highpass', 3500), g = G(0);
    g.gain.setValueAtTime(1e-4, t); g.gain.exponentialRampToValueAtTime(v, tEnd - .01); g.gain.linearRampToValueAtTime(0, tEnd);
    n.connect(hp); hp.connect(g); out(g, sfx, 0, .3);
  }
  function riser(t0, t1, v = .3) {
    const n = noise(t0, t1 - t0), b = F('bandpass', 300, 3), g = G(0);
    b.frequency.setValueAtTime(300, t0); b.frequency.exponentialRampToValueAtTime(9000, t1);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t1 - .02); g.gain.linearRampToValueAtTime(0, t1);
    n.connect(b); b.connect(g); out(g, sfx, 0, .3);
    const o = osc('sawtooth', 110, t0, t1 - t0); o.frequency.exponentialRampToValueAtTime(1100, t1);
    const lp = F('lowpass', 2000), og = G(0); og.gain.setValueAtTime(0, t0); og.gain.linearRampToValueAtTime(v * .35, t1 - .02); og.gain.linearRampToValueAtTime(0, t1);
    o.connect(lp); lp.connect(og); out(og, sfx, 0, .3);
  }
  function whoosh(t, d = .6, v = .35, p0 = -.8, p1 = .8) {
    const n = noise(t, d), b = F('bandpass', 400, 1.6), g = G(0), pn = ac.createStereoPanner();
    b.frequency.setValueAtTime(400, t); b.frequency.exponentialRampToValueAtTime(3200, t + d * .5); b.frequency.exponentialRampToValueAtTime(500, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + d * .5); g.gain.linearRampToValueAtTime(0, t + d);
    pn.pan.setValueAtTime(p0, t); pn.pan.linearRampToValueAtTime(p1, t + d);
    n.connect(b); b.connect(g); g.connect(pn); pn.connect(sfx);
  }
  function blip(t, f0, f1, d = .08, v = .2, p = 0) { const o = osc('sine', f0, t, d); o.frequency.exponentialRampToValueAtTime(f1, t + d); const g = G(0); env(g, t, .002, v, d); o.connect(g); out(g, sfx, p, .15); }
  function ting(t, m, v = .12, p = 0) { fm(t, m, .15, v, 3.01, 1.2, { dest: sfx, p, r: .4, md: .2 }); }
  function vinyl(t0, t1, v = .08) {
    const len = Math.floor((t1 - t0) * SR), b = ac.createBuffer(1, len, SR), d = b.getChannelData(0), r = rng(77);
    for (let i = 0; i < len; i++) { d[i] = (r() * 2 - 1) * .08; if (r() < .0009) d[i] = (r() * 2 - 1) * 1.2; }
    const s = ac.createBufferSource(); s.buffer = b; s.start(t0); const lp = F('bandpass', 2500, .5), g = G(v);
    g.gain.setValueAtTime(v, t1 - .2); g.gain.linearRampToValueAtTime(0, t1);
    s.connect(lp); lp.connect(g); out(g, sfx);
  }
  function paper(t, v = .3) { for (let i = 0; i < 6; i++) { const tt = t + i * .035 + R() * .02, n = noise(tt, .06), b = F('bandpass', 2000 + R() * 3000, 1.5), g = G(0); env(g, tt, .002, v * (1 - i / 7), .03); n.connect(b); b.connect(g); out(g, sfx, (R() - .5)); } }
  function stat(t, d = .18, v = .25) { const n = noise(t, d), b = F('highpass', 1200), g = G(0); g.gain.setValueAtTime(v, t); g.gain.setValueAtTime(v, t + d - .02); g.gain.linearRampToValueAtTime(0, t + d); n.connect(b); b.connect(g); out(g, sfx); blip(t, 2400, 600, .03, .4); }
  function modem(t, d = .35, v = .1) { for (let k = 0; k < d / .03; k++) { const tt = t + k * .03; chip(tt, 84 + Math.floor(R() * 14), .028, v, .12, R() - .5); } }
  function click(t, v = .3) { const n = noise(t, .01), b = F('bandpass', 4000, 2), g = G(0); env(g, t, .0005, v, .008); n.connect(b); b.connect(g); out(g, sfx); }
  function thunk(t, v = .6) { kick(t, v * .8, 220, 80, .12, sfx); const n = noise(t, .1), b = F('bandpass', 800, 1), g = G(0); env(g, t, .001, v * .5, .07); n.connect(b); b.connect(g); out(g, sfx); }
  function kaching(t, v = .14) { [88, 93, 96].forEach((m, i) => ting(t + i * .03, m, v, .3)); const n = noise(t, .05), b = F('highpass', 6000), g = G(0); env(g, t, .001, v, .04); n.connect(b); b.connect(g); out(g, sfx, .3); }

  // ════════════════ 편곡 ════════════════
  // 0~2 인트로: 바이닐 + 오르골 모티프
  vinyl(0, 2.3, .09);
  MOTIF.forEach(([b, m, d]) => fm(.15 + b * .38, m + 12, d * .6, .09, 3.5, 1.1, { r: .5, p: .2 }));
  for (let i = 0; i < 8; i++) blip(.12 + .055 * i, 1200 + i * 120, 1800 + i * 160, .04, .07, (i % 4 - 1.5) * .3);
  riser(1.25, 2.0, .22); whoosh(1.3, .7, .25, -.3, .3);
  // 시대 전환마다 스테레오 휘익 + 혜택 커지는 '착'
  BOUNDS.forEach(b => { whoosh(b - .38, .76, .3); kaching(b + .2); });

  // 01 암각화 2~4: 북 + 피리 + 드론
  { const t0 = 2;
    voice('sine', 33, t0, 2, .22, { a: .3, sus: 1, rel: .3 }); voice('sine', 40, t0, 2, .12, { a: .3, sus: 1, rel: .3 });
    [0, .75, 1.5, 2, 2.75, 3.25, 3.5].forEach((b, i) => tom(t0 + b * .5, i % 3 ? 95 : 70, .75));
    for (let b = 0; b < 4; b += .5) shaker(t0 + b * .5 + .25, .14);
    MOTIF.forEach(([b, m, d]) => voice('sine', m, t0 + b * .5, d * .5, .16, { a: .06, sus: .85, d: .3, rel: .15, vib: [5.5, .007], r: .5, p: -.15 }));
    click(t0, .5); thunk(t0, .4);
  }
  // 02 민화 4~6: 장구 + 가야금 + 꽹과리
  { const t0 = 4;
    kkwaeng(t0, .16);
    dung(t0, .9); deok(t0 + .5, .5); deok(t0 + .62, .35); kung(t0 + .75, .7); dung(t0 + 1, .8); deok(t0 + 1.25, .45); deok(t0 + 1.5, .5); deok(t0 + 1.62, .35); kung(t0 + 1.75, .7);
    pluck(t0, 45, .45, -.3); pluck(t0 + 1, 52, .35, -.3);
    MOTIF.forEach(([b, m]) => pluck(t0 + b * .5, m, .5, .2, music, .6, .3));
    pluck(t0 + 1.75, 81, .35, .3); pluck(t0 + 1.875, 79, .3, .3);
  }
  // 03 신문 6~8: 트로트 쿵짝 + 아코디언
  { const t0 = 6;
    paper(t0 - .05, .35); boom(t0 + .25, .35); thunk(t0 + .25, .7);
    [['Dm', 0], ['Am', 1]].forEach(([c, h]) => {
      const tt = t0 + h;
      voice('triangle', ROOT[c], tt, .22, .5, { lp: 900 }); voice('triangle', ROOT[c] + 7, tt + .5, .22, .45, { lp: 900 });
      [.25, .75].forEach(o => CH[c].forEach(m => voice('square', m, tt + o, .12, .035, { lp: 2500 })));
    });
    [0, 1].forEach(b => kick(t0 + b, .8)); [.5, 1.5].forEach(b => snare(t0 + b, .5));
    for (let b = 0; b < 2; b += .5) { hat(t0 + b, .14); hat(t0 + b + .33, .1); }
    MOTIF.forEach(([b, m, d]) => { voice('sawtooth', m, t0 + b * .5, d * .5, .07, { lp: 2400, vib: [6, .006], a: .02, sus: .9, p: .15, r: .25 }); voice('square', m + 12, t0 + b * .5, d * .5, .025, { lp: 3000, det: 8, vib: [6, .006], a: .02, sus: .9 }); });
  }
  // 04 포스터 8~10: 80s 신스팝 (게이트 리버브 스네어, 옥타브 베이스, FM 벨)
  { const t0 = 8;
    thunk(t0, .5); click(t0 + .02, .4);
    kick(t0, .9); kick(t0 + 1.25, .8); snare(t0 + .5, .6, true); snare(t0 + 1.5, .6, true);
    for (let k = 0; k < 8; k++) hat(t0 + k * .25, .1);
    [['Am', 0], ['F', 1]].forEach(([c, h]) => {
      for (let k = 0; k < 4; k++) voice('sawtooth', ROOT[c] + (k % 2 ? 12 : 0), t0 + h + k * .25, .2, .16, { lp: 1200, lpEnv: [2600, 500, .18] });
      CH[c].forEach((m, i) => voice('sawtooth', m, t0 + h, .95, .035, { lp: 1800, a: .15, sus: 1, rel: .2, det: (i - 1) * 9, r: .3 }));
    });
    MOTIF.forEach(([b, m, d]) => fm(t0 + b * .5, m + 12, d * .5, .1, 1, 2.2, { r: .35, p: -.1 }));
  }
  // 05 브라운관 10~12: 홈쇼핑 징글
  { const t0 = 10;
    stat(t0 - .06, .14, .22);
    [84, 88, 91].forEach((m, i) => fm(t0 + .15 + i * .13, m, .3, .12, 1, 1.6, { r: .4 }));
    kick(t0, .8); kick(t0 + .75, .6); kick(t0 + 1, .8); snare(t0 + .5, .45); snare(t0 + 1.5, .45);
    for (let b = 0; b < 4; b++) { hat(t0 + b * .5 + .25, .16, true, -.2); shaker(t0 + b * .5, .1); }
    [['C', 0], ['G', 1]].forEach(([c, h]) => {
      [0, .375, .5, .875].forEach((o, i) => voice('sawtooth', ROOT[c] + (i === 2 ? 12 : 0), t0 + h + o, .1, .22, { lp: 900, lpEnv: [3000, 400, .08] }));
      [.25, .75].forEach(o => CH[c].forEach(m => fm(t0 + h + o, m + 12, .12, .045, 1, 1.2, { r: .2 })));
    });
    MOTIF.forEach(([b, m, d]) => fm(t0 + .25 + b * .45, m + 12, d * .4, .07, 2, 1.5, { r: .3 }));
  }
  // 06 픽셀 12~14: 칩튠 (+모뎀, 클릭, 띵)
  { const t0 = 12;
    modem(t0 - .05, .3, .05);
    [['Am', 0], ['F', 1]].forEach(([c, h]) => {
      for (let k = 0; k < 8; k++) chip(t0 + h + k * .125, CH[c][k % 3] + 12, .11, .045, .25, .25);
      for (let k = 0; k < 4; k++) voice('triangle', ROOT[c] + (k % 2 ? 12 : 0), t0 + h + k * .25, .2, .3, { sus: 1 });
    });
    [0, 1].forEach(b => { voice('triangle', 300, t0 + b, .06, .5, { sus: .2 }); }); [.5, 1.5].forEach(b => { const n = noise(t0 + b, .08), g = G(0); env(g, t0 + b, .001, .3, .06); n.connect(g); out(g, drums); });
    MOTIF.forEach(([b, m, d]) => chip(t0 + b * .5, m + 12, d * .45, .06, .12, -.2));
    click(t0 + .95, .45); click(t0 + 1.0, .3);
    fm(t0 + 1.05, 81, .3, .12, 1, 1, { dest: sfx, r: .3 }); fm(t0 + 1.12, 88, .4, .1, 1, 1, { dest: sfx, r: .3 });
  }
  // 07 플랫 14~16: 트로피컬 하우스 (+알림음, 탭)
  { const t0 = 14;
    marimba(t0 + .35, 88, .35, .2); marimba(t0 + .45, 95, .35, .2);
    click(t0 + 1.2, .4);
    for (let b = 0; b < 4; b++) kick(t0 + b * .5, .55, 120, 45, .3);
    [.5, 1.5].forEach(b => clap(t0 + b, .35));
    for (let k = 0; k < 16; k++) shaker(t0 + k * .125, k % 2 ? .08 : .13);
    [['C', 0], ['G', 1]].forEach(([c, h]) => {
      sub(t0 + h, ROOT[c], .45, .35); sub(t0 + h + .5, ROOT[c], .4, .3);
      [.25, .75].forEach(o => CH[c].forEach(m => marimba(t0 + h + o, m + 12, .12, -.15)));
    });
    MOTIF.forEach(([b, m]) => marimba(t0 + b * .5, m + 12, .3, .1));
  }
  // 2026 빌드업 16~17.5
  { kaching(16.0, .2);
    for (let k = 0; k < 8; k++) snare(16 + k * .125, .15 + k * .03);
    for (let k = 0; k < 8; k++) snare(17 + k * .0625 * .8, .35 + k * .04);
    riser(16.0, 17.42, .4);
    [16.5, 17.0].forEach(t => { boom(t, .55); kick(t, 1, 160, 40, .5); });
    for (let tt = 16.35; tt < 17; tt += 1 / 30) blip(tt, 3000 + R() * 2000, 2500, .015, .03, (R() - .5));
    supersaw(16.0, CH.F, .95, .07); supersaw(17.0, CH.G, .4, .1);
    voice('sawtooth', 52, 17.0, .38, .25, { lp: 600, det: 30, sus: 1 }); voice('sawtooth', 53, 17.0, .38, .25, { lp: 600, sus: 1 });
    revCym(17.5, 1.1, .4);
  }
  // 17.5 폭발 → 드롭
  boom(17.5, 1.0); crash(17.5, .55, 2.2); kick(17.5, 1.1);
  for (let k = 0; k < 18; k++) ting(17.5 + R() * 1.4, [93, 96, 98, 100, 103][Math.floor(R() * 5)], .07, R() * 1.6 - .8);
  const DROP = [[17.5, 'Am'], [18, 'Am'], [19, 'F'], [20, 'C'], [21, 'G'], [22, 'Am'], [23, 'F']];
  for (let b = 18; b < 24; b += .5) { kick(b, .95); hat(b + .25, .2, false, .2); }
  for (let b = 18.5; b < 24; b += 1) clap(b, .5);
  DROP.forEach(([t, c], i) => {
    const d = (DROP[i + 1] ? DROP[i + 1][0] : 24) - t;
    for (let o = 0; o < d - .01; o += .5) { supersaw(t + o + .25, CH[c].map(m => m + 12), .2, .12); sub(t + o, ROOT[c] - 12, .45, .5); }
  });
  [[T_NEOP, 76], [T_DA, 79], [T_SEIL, 81], [T_SEIL + .25, 84]].forEach(([t, m]) => {
    supersaw(t, [m, m + 12], .3, .2); snare(t, .45); crash(t, .18, .8); kick(t, .9);
  });
  // 20 엔딩: 카드 플립 → 필터 다운 → 21.5 CTA
  whoosh(20.0, .6, .4, .6, -.6); blip(20.42, 400, 1600, .12, .2);
  musicLP.frequency.setValueAtTime(20000, 20.0); musicLP.frequency.exponentialRampToValueAtTime(900, 20.4);
  musicLP.frequency.setValueAtTime(900, 21.2); musicLP.frequency.exponentialRampToValueAtTime(20000, 21.5);
  for (let i = 0; i < 7; i++) blip(20.55 + i * .07, 900 + i * 140, 1500 + i * 180, .05, .09, (i - 3) * .2);
  riser(20.8, 21.5, .25); boom(21.5, .6); crash(21.5, .3, 1.4);
  blip(21.8, 600, 1500, .1, .2); ting(21.85, 96, .12); ting(22.0, 100, .1);
  // 24 마무리 스탭
  supersaw(24, [57, 64, 69, 72, 76], 1.6, .2); sub(24, 33, 1.2, .55); boom(24, .7); crash(24, .4, 2); kick(24, 1);
  fm(24.02, 93, 1.2, .1, 3.5, 1.5, { r: .6 });

  const buf = await ac.startRendering();
  return encodeWAV(buf);
}
function tanhCurve(k) { const n = 2048, c = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i / (n - 1) * 2 - 1; c[i] = Math.tanh(k * x) / Math.tanh(k); } return c; }
function makeIR(ac, dur, decay) {
  const SR = ac.sampleRate, len = Math.floor(SR * dur), b = ac.createBuffer(2, len, SR), r = rng(5);
  for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (r() * 2 - 1) * Math.pow(1 - i / len, decay) * (i < SR * .01 ? i / (SR * .01) : 1); }
  return b;
}
function encodeWAV(buf) {
  const nCh = buf.numberOfChannels, len = buf.length, SR = buf.sampleRate, ab = new ArrayBuffer(44 + len * nCh * 2), v = new DataView(ab);
  const ws = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  ws(0, 'RIFF'); v.setUint32(4, 36 + len * nCh * 2, true); ws(8, 'WAVE'); ws(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
  v.setUint16(22, nCh, true); v.setUint32(24, SR, true); v.setUint32(28, SR * nCh * 2, true); v.setUint16(32, nCh * 2, true); v.setUint16(34, 16, true);
  ws(36, 'data'); v.setUint32(40, len * nCh * 2, true);
  const chans = [...Array(nCh)].map((_, c) => buf.getChannelData(c));
  let peak = 0; chans.forEach(d => { for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(d[i])); });
  const norm = peak > 0 ? .9 / peak : 1;
  let o = 44;
  for (let i = 0; i < len; i++) for (let c = 0; c < nCh; c++) { v.setInt16(o, Math.max(-1, Math.min(1, chans[c][i] * norm)) * 32767, true); o += 2; }
  return ab;
}
