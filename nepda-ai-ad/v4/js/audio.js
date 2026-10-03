// ───────────── 사운드: 상자 82,944개의 착지음 + 뚜껑 82,944개의 '펑' + 음악 ─────────────
// 이벤트 사운드는 실제 착지/펑 시각(sch)에 샘플 단위로 맞춰 직접 합성하고,
// 음악은 OfflineAudioContext 로 합성한다. 외부 음원/샘플 0%.
import * as D from './design.js';
const DUR = 26, SR = 48000, BEAT = .5;
const m2f = m => 440 * Math.pow(2, (m - 69) / 12);
const PENTA = [57, 60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84, 86, 88, 91, 93];

export async function renderAudio(sch) {
  const L = Math.ceil(DUR * SR), R = D.rng(314);
  // ── 1) 이벤트 레이어: 착지 '톡', 덜컹, 펑 ──
  const evL = new Float32Array(L), evR = new Float32Array(L);
  const order = sch.order;
  const landSorted = Float32Array.from(order, k => sch.tLand[k]);
  const rateAt = t => { // 초당 착지 수
    const a = t - .15, b = t + .15;
    const lb = v => { let l = 0, h = landSorted.length; while (l < h) { const m = (l + h) >> 1; if (landSorted[m] <= v) l = m + 1; else h = m; } return l; };
    return (lb(b) - lb(a)) / .3;
  };
  function addTock(t, f, amp, pan, bright, dec = .045) {
    const i0 = Math.floor(t * SR); if (i0 < 0 || i0 >= L) return;
    const n = Math.min(L - i0, Math.floor(SR * Math.min(dec * 5, .3)) + 240);
    const gl = Math.cos((pan + 1) * Math.PI / 4) * amp, gr = Math.sin((pan + 1) * Math.PI / 4) * amp;
    const w = 2 * Math.PI * f / SR, c1 = Math.cos(w), s1 = Math.sin(w), c2 = Math.cos(w * 2.76), s2 = Math.sin(w * 2.76);
    let re1 = 1, im1 = 0, re2 = 1, im2 = 0, e1 = 1, e2 = 1, ec = 1, nz = 0;
    const k1 = Math.exp(-1 / (dec * SR)), k2 = Math.exp(-1 / (dec * .4 * SR)), kc = Math.exp(-1 / (.0025 * SR));
    for (let i = 0; i < n; i++) {
      nz = nz * .6 + (R() * 2 - 1) * .4;
      const v = (im1 * .8 * e1 + im2 * .25 * e2) + nz * ec * bright;
      let tr = re1 * c1 - im1 * s1; im1 = re1 * s1 + im1 * c1; re1 = tr;
      tr = re2 * c2 - im2 * s2; im2 = re2 * s2 + im2 * c2; re2 = tr;
      e1 *= k1; e2 *= k2; ec *= kc;
      evL[i0 + i] += v * gl; evR[i0 + i] += v * gr;
    }
  }
  // 첫 12개: 상승 멜로디 (혜택 하나, 둘, …) → 이후 밀도에 따라 확률적으로 골라 합성
  for (let r = 0; r < order.length; r++) {
    const k = order[r], t = sch.tLand[k], i = k % D.NX;
    const pan = (i / D.NX - .5) * 1.4;
    if (r < 12) { addTock(t, m2f(PENTA[Math.min(r + 2, PENTA.length - 1)]), r === 0 ? .55 : .42, pan * .5, .5, .09); continue; }
    const rate = rateAt(t), p = Math.min(1, 350 / rate);
    if (R() > p) continue;
    const amp = .3 / Math.sqrt(1 + p * rate / 5) * (.6 + .4 * R());
    const f = m2f(PENTA[Math.floor(R() * 12) + 2]) * (1 + (R() - .5) * .01);
    addTock(t, f, amp, pan, .35 + .3 * R(), .022 + .02 * R());
  }
  // 덜컹 (12.5~13.45): 미세 클릭 밀도 증가
  for (let t = 12.5; t < 13.45; t += 1 / 1400) {
    const d = (t - 12.5) / .95; if (R() > d * d) continue;
    addTock(t, 900 + R() * 2400, .05 + .07 * d, (R() - .5) * 1.6, .9, .006);
  }
  // 펑: 뚜껑 82,944개 — 가까운 파동은 크게, 먼 곳은 확률적으로
  for (let k = 0; k < D.N; k++) {
    const i = k % D.NX, j = Math.floor(k / D.NX), d = Math.hypot(i - 108, j - 152);
    const near = Math.exp(-d / 40), p = Math.min(1, .02 + .5 * near);
    if (R() > p) continue;
    addTock(sch.tPop[k], 260 + R() * 900, (.06 + .32 * near) * (.6 + .4 * R()), (i / D.NX - .5) * 1.6, 1.6, .01 + .012 * R());
  }

  // ── 2) 음악 (OfflineAudioContext) ──
  const ac = new OfflineAudioContext(2, L, SR);
  const master = ac.createGain(); master.gain.value = .8;
  const comp = ac.createDynamicsCompressor(); comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 3; comp.attack.value = .004; comp.release.value = .2;
  const clip = ac.createWaveShaper(); clip.curve = tanhCurve(1.1); clip.oversample = '4x';
  master.connect(comp); comp.connect(clip); clip.connect(ac.destination);
  master.gain.setValueAtTime(.8, 25.2); master.gain.linearRampToValueAtTime(0, DUR);
  const duck = ac.createGain(); duck.connect(master);
  const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 20000; lp.connect(duck);
  const music = ac.createGain(); music.connect(lp);
  const drums = ac.createGain(); drums.connect(master);
  const sfx = ac.createGain(); sfx.connect(master);
  const rev = ac.createConvolver(); rev.buffer = makeIR(ac, 3.2, 2.4); const revOut = ac.createGain(); revOut.gain.value = .55; rev.connect(revOut); revOut.connect(master);
  const send = ac.createGain(); send.connect(rev);
  const NB = ac.createBuffer(1, SR * 3, SR); { const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = R() * 2 - 1; }
  const noise = (t, dur) => { const s = ac.createBufferSource(); s.buffer = NB; s.start(t, R() * 1.5, dur + .05); return s; };
  const G = v => { const g = ac.createGain(); g.gain.value = v; return g; };
  const F = (type, f, Q = 1) => { const b = ac.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = Q; return b; };
  const out = (node, dest, p = 0, r = 0) => { const pn = ac.createStereoPanner(); pn.pan.value = p; node.connect(pn); pn.connect(dest); if (r) { const s = G(r); pn.connect(s); s.connect(send); } };
  const env = (g, t, a, peak, d) => { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(1e-4, t + a + d); g.gain.setValueAtTime(0, t + a + d + .01); };
  const osc = (type, f, t, dur) => { const o = ac.createOscillator(); o.type = type; o.frequency.value = f; o.start(t); o.stop(t + dur + .05); return o; };

  function kick(t, v = 1, f0 = 150, f1 = 42, d = .42) {
    const o = osc('sine', f0, t, d + .1); o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + .11);
    const g = G(0); env(g, t, .002, v, d); o.connect(g); out(g, drums);
    const n = noise(t, .02), b = F('bandpass', 3500, .8), ng = G(0); env(ng, t, .001, v * .3, .015); n.connect(b); b.connect(ng); out(ng, drums);
    if (t >= 13.4) { duck.gain.setValueAtTime(.35, t); duck.gain.linearRampToValueAtTime(1, t + .24); }
  }
  function clap(t, v = .5) {
    const n = noise(t, .3), b = F('bandpass', 1400, 1.2), g = G(0); g.gain.setValueAtTime(0, t);
    [0, .011, .022].forEach(o => { g.gain.setValueAtTime(v, t + o); g.gain.exponentialRampToValueAtTime(v * .2, t + o + .009); });
    g.gain.setValueAtTime(v, t + .033); g.gain.exponentialRampToValueAtTime(1e-4, t + .2); n.connect(b); b.connect(g); out(g, drums, 0, .25);
  }
  function hat(t, v = .2, open = false) { const n = noise(t, .3), h = F('highpass', 8000), g = G(0); env(g, t, .001, v, open ? .2 : .035); n.connect(h); h.connect(g); out(g, drums, .15); }
  function voice(type, m, t, dur, v, o = {}) {
    const f = m2f(m), os = osc(type, f, t, dur + (o.rel || .15)); if (o.det) os.detune.value = o.det;
    let node = os; if (o.lp) { const b = F('lowpass', o.lp, o.q || .8); node.connect(b); node = b; }
    const g = G(0); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + (o.a || .01)); g.gain.setValueAtTime(v, t + dur); g.gain.exponentialRampToValueAtTime(1e-4, t + dur + (o.rel || .15));
    node.connect(g); out(g, o.dest || music, o.p || 0, o.r || 0);
  }
  function supersaw(t, notes, dur, v = .12, a = .008) { notes.forEach(m => [-24, -10, 0, 10, 24].forEach((det, i) => voice('sawtooth', m, t, dur, v / 3, { det, lp: 5200, a, rel: .2, p: (i - 2) * .3, r: .25 }))); }
  function sub(t, m, dur, v = .5) {
    const o = osc('sine', m2f(m) * 1.3, t, dur + .1); o.frequency.exponentialRampToValueAtTime(m2f(m), t + .04);
    const g = G(0); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .006); g.gain.setValueAtTime(v, t + dur - .03); g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g); out(g, music);
  }
  function pad(t, notes, dur, v = .05) { notes.forEach((m, i) => [-8, 8].forEach(det => voice('sawtooth', m, t, dur, v, { det, lp: 1400, a: dur * .45, rel: .6, p: (i - 1) * .4 + det / 30, r: .6 }))); }
  function pluck(t, m, v = .1, p = 0) { const f = m2f(m); [[1, 1, .22], [2, .3, .08], [3, .12, .05]].forEach(([h, a, d]) => { const o = osc(h === 1 ? 'triangle' : 'sine', f * h, t, .5), g = G(0); env(g, t, .002, v * a, d); o.connect(g); out(g, music, p, .35); }); }
  function boom(t, v = 1) {
    const o = osc('sine', 90, t, 2); o.frequency.exponentialRampToValueAtTime(26, t + 1.2);
    const sh = ac.createWaveShaper(); sh.curve = tanhCurve(2.5); const g = G(0); env(g, t, .003, v, 1.6); o.connect(sh); sh.connect(g); out(g, sfx, 0, .4);
    const n = noise(t, .9), l = F('lowpass', 1300), ng = G(0); env(ng, t, .002, v * .7, .45); n.connect(l); l.connect(ng); out(ng, sfx, 0, .5);
  }
  function crash(t, v = .4, d = 2) { const n = noise(t, d + .2), h = F('highpass', 4800), g = G(0); env(g, t, .002, v, d); n.connect(h); h.connect(g); out(g, sfx, .2, .4); }
  function revCym(tEnd, len, v = .35) { const t = tEnd - len, n = noise(t, len), h = F('highpass', 3500), g = G(0); g.gain.setValueAtTime(1e-4, t); g.gain.exponentialRampToValueAtTime(v, tEnd - .01); g.gain.linearRampToValueAtTime(0, tEnd); n.connect(h); h.connect(g); out(g, sfx, 0, .3); }
  function riser(t0, t1, v = .3) {
    const n = noise(t0, t1 - t0), b = F('bandpass', 300, 3), g = G(0); b.frequency.setValueAtTime(300, t0); b.frequency.exponentialRampToValueAtTime(9000, t1);
    g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(v, t1 - .02); g.gain.linearRampToValueAtTime(0, t1); n.connect(b); b.connect(g); out(g, sfx, 0, .3);
    const o = osc('sawtooth', 110, t0, t1 - t0); o.frequency.exponentialRampToValueAtTime(880, t1); const l = F('lowpass', 1800), og = G(0);
    og.gain.setValueAtTime(0, t0); og.gain.linearRampToValueAtTime(v * .3, t1 - .02); og.gain.linearRampToValueAtTime(0, t1); o.connect(l); l.connect(og); out(og, sfx, 0, .3);
  }
  function whoosh(t, d = .6, v = .3, p0 = -.8, p1 = .8) {
    const n = noise(t, d), b = F('bandpass', 400, 1.6), g = G(0), pn = ac.createStereoPanner();
    b.frequency.setValueAtTime(400, t); b.frequency.exponentialRampToValueAtTime(3200, t + d * .5); b.frequency.exponentialRampToValueAtTime(500, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + d * .5); g.gain.linearRampToValueAtTime(0, t + d);
    pn.pan.setValueAtTime(p0, t); pn.pan.linearRampToValueAtTime(p1, t + d); n.connect(b); b.connect(g); g.connect(pn); pn.connect(sfx);
  }
  const CH = { Am: [57, 60, 64], F: [53, 57, 60], C: [55, 60, 64], G: [55, 59, 62] }, RT = { Am: 33, F: 29, C: 36, G: 31 };

  // 0~3: 공기감 + 첫 착지 잔향
  { const n = noise(0, 3), b = F('lowpass', 900), g = G(0); g.gain.setValueAtTime(0, 0); g.gain.linearRampToValueAtTime(.025, .4); g.gain.setValueAtTime(.025, 2.6); g.gain.linearRampToValueAtTime(0, 3.2); n.connect(b); b.connect(g); out(g, sfx); }
  // 3~11.4: 심장박동 → 패드 → 아르페지오 → 하이햇 → 라이저
  const prog4 = ['Am', 'F', 'C', 'G'];
  for (let b = 6; b * BEAT < 11.4; b++) {
    const t = b * BEAT, bar = Math.floor((t - 3) / 2), c = prog4[((bar % 4) + 4) % 4];
    const inten = Math.min(1, (t - 3) / 8);
    if (b % 2 === 0 || t > 7) kick(t, .35 + .45 * inten, 110, 45, .3);
    if (t >= 5) for (let s = 0; s < 2; s++) pluck(t + s * .25, CH[c][(b * 2 + s) % 3] + 12 + ((b + s) % 4 === 3 ? 12 : 0), .05 + .05 * inten, ((b + s) % 2 ? .3 : -.3));
    if (t >= 7) { hat(t + .25, .06 + .08 * inten); }
    if (t >= 9 && b % 2 === 1) clap(t, .2 + .2 * inten);
    if ((b - 6) % 4 === 0) { pad(t, CH[c].map(m => m + 12), 1.95, .03 + .03 * inten); sub(t, RT[c] + 12, 1.9, .25 * inten); }
  }
  riser(9.4, 11.38, .32);
  // 11.4: 완성 임팩트 + 다이브
  boom(11.4, .75); crash(11.4, .3, 2.2); supersaw(11.4, [57, 64, 69, 72, 76], 1.6, .14, .02);
  whoosh(11.5, 1.6, .35, .6, -.6);
  { const o = osc('sawtooth', 55, 11.6, 1.9), l = F('lowpass', 300, 4), g = G(0); o.frequency.exponentialRampToValueAtTime(220, 13.4); l.frequency.exponentialRampToValueAtTime(2400, 13.4);
    g.gain.setValueAtTime(0, 11.6); g.gain.linearRampToValueAtTime(.16, 13.3); g.gain.linearRampToValueAtTime(0, 13.38); o.connect(l); l.connect(g); out(g, music, 0, .3); }
  [11.9, 12.4, 12.8, 13.05, 13.2, 13.3].forEach((t, i) => kick(t, .5 + i * .06, 120, 45, .25));
  revCym(13.5, 1.2, .45);
  // 13.5: 펑!! → 드롭
  boom(13.5, 1); crash(13.5, .55, 2.6); kick(13.5, 1.1);
  for (let i = 0; i < 6; i++) whoosh(13.55 + i * .17, .45 + R() * .3, .22, (R() - .5) * 2, (R() - .5) * 2);
  const DROP = [[13.5, 'Am'], [14.5, 'Am'], [15.5, 'F'], [16.5, 'C'], [17.5, 'G'], [18.5, 'Am'], [19.5, 'F'], [20.5, 'C'], [21.5, 'G'], [22.5, 'Am'], [23.5, 'F']];
  for (let t = 14; t < 24; t += .5) { kick(t, .95); hat(t + .25, .18); }
  for (let t = 14.5; t < 24; t += 1) clap(t, .45);
  DROP.forEach(([t, c], i) => {
    const d = (DROP[i + 1] ? DROP[i + 1][0] : 24) - t;
    for (let o = 0; o < d - .01; o += .5) { supersaw(t + o + .25, CH[c].map(m => m + 12), .2, .11); sub(t + o, RT[c], .45, .45); }
    if (i > 0) pluck(t, CH[c][2] + 24, .12, .2);
  });
  // 15.9 자막 "10월 26일, 혜택이 열린다" / 20.8 엔딩 카드
  whoosh(20.7, .6, .35, .6, -.6);
  lp.frequency.setValueAtTime(20000, 20.7); lp.frequency.exponentialRampToValueAtTime(1100, 21.1);
  lp.frequency.setValueAtTime(1100, 21.2); lp.frequency.exponentialRampToValueAtTime(20000, 21.45);
  boom(21.35, .55); crash(21.35, .28, 1.4);
  [[21.7, 88], [22.0, 93], [22.2, 96]].forEach(([t, m]) => pluck(t, m, .18));
  // 24: 마무리
  supersaw(24, [57, 64, 69, 72, 76], 1.8, .18, .01); sub(24, 33, 1.3, .5); boom(24, .7); crash(24, .4, 2); kick(24, 1);

  const rendered = await ac.startRendering();
  // ── 3) 믹스 ──
  const mL = rendered.getChannelData(0), mR = rendered.getChannelData(1), outL = new Float32Array(L), outR = new Float32Array(L);
  let peak = 0;
  for (let i = 0; i < L; i++) {
    const a = mL[i] + Math.tanh(evL[i] * 1.2) * .9, b = mR[i] + Math.tanh(evR[i] * 1.2) * .9;
    outL[i] = a; outR[i] = b; peak = Math.max(peak, Math.abs(a), Math.abs(b));
  }
  const norm = .9 / peak;
  return encodeWAV([outL, outR], norm);
}
function tanhCurve(k) { const n = 2048, c = new Float32Array(n); for (let i = 0; i < n; i++) { const x = i / (n - 1) * 2 - 1; c[i] = Math.tanh(k * x) / Math.tanh(k); } return c; }
function makeIR(ac, dur, decay) {
  const len = Math.floor(SR * dur), b = ac.createBuffer(2, len, SR), r = D.rng(5);
  for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (r() * 2 - 1) * Math.pow(1 - i / len, decay) * (i < SR * .01 ? i / (SR * .01) : 1); }
  return b;
}
function encodeWAV(chans, norm) {
  const len = chans[0].length, nCh = chans.length, ab = new ArrayBuffer(44 + len * nCh * 2), v = new DataView(ab);
  const ws = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  ws(0, 'RIFF'); v.setUint32(4, 36 + len * nCh * 2, true); ws(8, 'WAVE'); ws(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true);
  v.setUint16(22, nCh, true); v.setUint32(24, SR, true); v.setUint32(28, SR * nCh * 2, true); v.setUint16(32, nCh * 2, true); v.setUint16(34, 16, true);
  ws(36, 'data'); v.setUint32(40, len * nCh * 2, true);
  let o = 44;
  for (let i = 0; i < len; i++) for (let c = 0; c < nCh; c++) { v.setInt16(o, Math.max(-1, Math.min(1, chans[c][i] * norm)) * 32767, true); o += 2; }
  return ab;
}
