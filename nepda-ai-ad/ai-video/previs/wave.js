// 「거대한 혜택이 밀려온다」 3D 애니매틱: AI 영상이 대략 어떻게 나올지 미리 보는 용도 (구도·타이밍·연출)
import * as THREE from 'three';
import { W, H, clamp, smooth, lerp, ramp, wob, mat, mesh, box, cyl, sph, canvasTex, skyTex, windowTex, person, REST, track, shake, taki } from './lib.js';

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);

const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
const G = '#00F550', P = '#9162FF';

function glowTex(inner, outer = 'rgba(0,0,0,0)') {
  return canvasTex(128, 128, (g, w) => { const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); r.addColorStop(0, inner); r.addColorStop(0.35, inner.replace(/[\d.]+\)$/, '0.55)')); r.addColorStop(1, outer); g.fillStyle = r; g.fillRect(0, 0, w, w); });
}
const GLOW = glowTex('rgba(170,255,170,1)'), WHITE = glowTex('rgba(255,255,255,1)');
const sprite = (tex, size, color = 0xffffff, op = 1) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, transparent: true, opacity: op, blending: THREE.AdditiveBlending, depthWrite: false })); s.scale.setScalar(size); return s; };

// ---------- 상품 (로고 없는 전자제품·잡화)
const PROD = ['tv', 'laptop', 'phone', 'fridge', 'washer', 'headphones', 'sneaker', 'console', 'vacuum', 'bag'];
function product(type) {
  const g = new THREE.Group();
  const blk = mat('#1a1b1e', { roughness: 0.35 }), slv = mat('#c9ccd1', { roughness: 0.35, metalness: 0.6 }), wht = mat('#f1f1ef', { roughness: 0.4 });
  if (type === 'tv') { g.add(box(1.4, 0.82, 0.05, blk)); g.add(box(1.32, 0.74, 0.01, mat('#2b4f7a', { emissive: '#1d3d66', roughness: 0.2 }), 0, 0, 0.03)); g.add(box(0.5, 0.04, 0.2, blk, 0, -0.45, 0)); }
  else if (type === 'laptop') { g.add(box(0.36, 0.02, 0.25, slv)); const s = box(0.36, 0.24, 0.012, slv, 0, 0.12, -0.12); s.rotation.x = -0.3; g.add(s); g.scale.setScalar(1.8); }
  else if (type === 'phone') { g.add(box(0.08, 0.16, 0.01, blk)); g.scale.setScalar(3); }
  else if (type === 'fridge') { g.add(box(0.75, 1.8, 0.7, slv)); g.add(box(0.02, 0.5, 0.04, blk, 0.3, 0.3, 0.36)); }
  else if (type === 'washer') { g.add(box(0.6, 0.85, 0.6, wht)); const d = cyl(0.2, 0.2, 0.03, mat('#3b4552', { roughness: 0.2 }), 0, 0.02, 0.31); d.rotation.x = Math.PI / 2; g.add(d); }
  else if (type === 'headphones') { const b = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 8, 24, Math.PI), mat(P)); g.add(b); for (const s of [-1, 1]) { const c = cyl(0.06, 0.06, 0.04, mat('#222'), s * 0.12, -0.02, 0); c.rotation.z = Math.PI / 2; g.add(c); } g.scale.setScalar(2.5); }
  else if (type === 'sneaker') { g.add(box(0.28, 0.08, 0.1, wht, 0, 0.04, 0)); g.add(box(0.16, 0.08, 0.1, mat('#d8342c'), -0.05, 0.11, 0)); g.scale.setScalar(2.4); }
  else if (type === 'console') { g.add(box(0.32, 0.07, 0.26, wht)); g.add(box(0.12, 0.05, 0.08, blk, 0.25, 0, 0)); g.scale.setScalar(2.2); }
  else if (type === 'vacuum') { g.add(cyl(0.17, 0.17, 0.09, mat('#2a2d33', { roughness: 0.3 }))); g.scale.setScalar(2.2); }
  else { g.add(box(0.36, 0.26, 0.13, mat('#8a5a3b', { roughness: 0.55 }))); const h = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 8, 20, Math.PI), mat('#5e3b25')); h.position.y = 0.13; g.add(h); g.scale.setScalar(2.2); }
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
  return g;
}

// ---------- 바다·해변·하늘
function seaWorld(o = {}) {
  const s = new THREE.Scene();
  s.background = skyTex(o.top || '#5d9fe0', o.bot || '#e4eef6');
  s.fog = new THREE.Fog(0xdbe7f1, o.fogNear ?? 150, o.fogFar ?? 1400);
  s.add(new THREE.HemisphereLight(0xe3f0ff, 0xc7b38c, 1.2));
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.4); sun.position.set(-30, 60, -40); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -14, near: 1, far: 200 }); sun.shadow.normalBias = 0.03;
  s.add(sun);
  const geo = new THREE.PlaneGeometry(3000, 3000, 160, 160); geo.rotateX(-Math.PI / 2);
  const sea = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#1f6fa8', roughness: 0.22, metalness: 0.1 }));
  sea.position.z = -1500 + (o.shore ?? 0); sea.receiveShadow = true; s.add(sea);
  const base = geo.attributes.position.array.slice();
  s.userData.seaTick = t => { const p = geo.attributes.position.array; for (let i = 0; i < p.length; i += 3) { const x = base[i], z = base[i + 2]; p[i + 1] = Math.sin(x * 0.05 + t * 1.3) * 0.35 + Math.sin(z * 0.08 - t * 1.9) * 0.3 + Math.sin((x + z) * 0.2 + t * 2.7) * 0.08; } geo.attributes.position.needsUpdate = true; geo.computeVertexNormals(); };
  if (o.beach !== false) {
    const sand = mesh(new THREE.PlaneGeometry(3000, 120), mat('#dcc79b', { roughness: 0.95 })); sand.rotation.x = -Math.PI / 2; sand.position.set(0, 0.05, 60 + (o.shore ?? 0)); s.add(sand);
    const wet = mesh(new THREE.PlaneGeometry(3000, 6), mat('#b9a47a', { roughness: 0.5 })); wet.rotation.x = -Math.PI / 2; wet.position.set(0, 0.07, 2 + (o.shore ?? 0)); s.add(wet);
  }
  return s;
}
function skyline(s, x0, x1, z, hmin = 40, hmax = 110) {
  for (let x = x0; x < x1; x += 18 + rnd() * 10) {
    const h = hmin + rnd() * (hmax - hmin), t = windowTex('#e9e6df', '#6f8aa3', 5, 12); t.repeat.set(1, h / 30);
    s.add(box(14 + rnd() * 6, h, 14, new THREE.MeshStandardMaterial({ map: t, roughness: 0.8 }), x, h / 2, z - rnd() * 30));
  }
}

// 거대한 투명 파도 (앞면 + 말려 들어가는 윗부분 + 흰 거품)
function bigWave(width = 700, height = 60) {
  const g = new THREE.Group();
  const prof = []; for (let i = 0; i <= 24; i++) { const v = i / 24, a = v * Math.PI * 0.95; prof.push([Math.sin(a * 0.6) * 0.9 - v * v * 0.25, v < 0.75 ? v * 1.05 : 0.79 + Math.sin((v - 0.75) / 0.25 * Math.PI * 0.6) * 0.12, v]); }
  const pos = [], idx = [], uv = [];
  const NX = 60;
  for (let i = 0; i <= NX; i++) for (const [z, y, v] of prof) { const x = (i / NX - 0.5) * width; const wob2 = Math.sin(i * 0.7) * 0.04; pos.push(x, y * height * (1 + wob2), -z * height * 0.55); uv.push(i / NX, v); }
  const R = prof.length;
  for (let i = 0; i < NX; i++) for (let j = 0; j < R - 1; j++) { const a = i * R + j, b = a + R; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
  const tex = canvasTex(8, 256, (c, w, h) => { const gr = c.createLinearGradient(0, h, 0, 0); gr.addColorStop(0, 'rgba(18,96,140,0.95)'); gr.addColorStop(0.45, 'rgba(40,190,200,0.55)'); gr.addColorStop(0.8, 'rgba(120,235,225,0.4)'); gr.addColorStop(0.93, 'rgba(240,255,255,0.95)'); gr.addColorStop(1, 'rgba(255,255,255,1)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  const m = new THREE.MeshStandardMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, roughness: 0.1, metalness: 0.1, emissive: '#0d5d6a', emissiveIntensity: 0.35, depthWrite: false });
  const w = new THREE.Mesh(geo, m); w.renderOrder = 2; g.add(w);
  // 파도 속 상품
  const items = [];
  for (let i = 0; i < 140; i++) {
    const p = product(PROD[i % PROD.length]); const sc = height / 9 * (0.6 + rnd() * 0.6); p.scale.multiplyScalar(sc);
    const v = 0.12 + rnd() * 0.6; p.position.set((rnd() - 0.5) * width * 0.9, v * height, -(0.15 + rnd() * 0.35) * height * 0.55);
    p.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); p.userData.spin = [rnd() - 0.5, rnd() - 0.5, rnd() - 0.5];
    g.add(p); items.push(p);
  }
  g.userData.items = items; g.userData.height = height;
  g.userData.tick = t => items.forEach(p => { p.rotation.x += p.userData.spin[0] * 0.02; p.rotation.y += p.userData.spin[1] * 0.02; p.rotation.z += p.userData.spin[2] * 0.02; });
  return g;
}

// 초록 불덩이 (안에 택이 얼굴)
function fireball(size = 1) {
  const g = new THREE.Group();
  const core = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), new THREE.MeshBasicMaterial({ color: '#7dff86' })); g.add(core);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), new THREE.MeshBasicMaterial({ color: '#ffffff' })); e.position.set(s * 0.3, 0.25, 0.85); g.add(e); const p = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), new THREE.MeshBasicMaterial({ color: '#0b3d12' })); p.position.set(s * 0.3, 0.22, 1.04); g.add(p); }
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 12), new THREE.MeshBasicMaterial({ color: '#7dff86' })); horn.position.set(0.05, 1.05, 0); g.add(horn);
  g.add(sprite(GLOW, 6, 0x9dff9d, 0.9)); g.add(sprite(WHITE, 2.6, 0xffffff, 0.6));
  const trail = []; for (let i = 0; i < 40; i++) { const sp = sprite(GLOW, 4, i % 3 ? 0x4dff6a : 0xffe08a, 0.5); trail.push(sp); }
  g.userData.trail = trail; g.scale.setScalar(size); return g;
}

// ---------- 컷
const SHOTS = [];

// 컷 1: 우주 → 대기권 진입 (3초)
SHOTS.push({ name: 'w1_meteor', dur: 3.2, build() {
  const s = new THREE.Scene(); s.background = new THREE.Color('#02030a');
  const sg = new THREE.BufferGeometry(), sp = []; for (let i = 0; i < 2500; i++) { const a = rnd() * 6.28, b = Math.acos(rnd() * 2 - 1); sp.push(Math.sin(b) * Math.cos(a) * 600, Math.cos(b) * 600, Math.sin(b) * Math.sin(a) * 600); }
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); s.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, sizeAttenuation: false })));
  const earthTex = canvasTex(1024, 512, (g, w, h) => {
    g.fillStyle = '#123f78'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { g.fillStyle = ['#3f6b35', '#6d7a43', '#8a7a52'][i % 3]; g.beginPath(); g.ellipse(rnd() * w, h * 0.2 + rnd() * h * 0.6, 20 + rnd() * 90, 10 + rnd() * 50, rnd() * 3, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(255,255,255,0.55)'; for (let i = 0; i < 260; i++) { g.beginPath(); g.ellipse(rnd() * w, rnd() * h, 10 + rnd() * 60, 3 + rnd() * 12, rnd() * 0.6, 0, 7); g.fill(); }
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(80, 96, 64), new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.8 })); earth.position.set(0, -92, -40); earth.rotation.x = Math.PI / 2.2; s.add(earth);
  const atm = new THREE.Mesh(new THREE.SphereGeometry(83, 96, 64), new THREE.ShaderMaterial({ transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 n; varying vec3 v; void main(){ n=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); v=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'varying vec3 n; varying vec3 v; void main(){ float f=pow(1.-abs(dot(n,v)),3.); gl_FragColor=vec4(0.35,0.65,1.,1.)*f*1.6; }' }));
  atm.position.copy(earth.position); s.add(atm);
  s.add(new THREE.AmbientLight(0x223344, 0.6)); const sun = new THREE.DirectionalLight(0xffe2b8, 2.8); sun.position.set(-80, 30, 40); s.add(sun);
  const F = fireball(1.1); s.add(F); F.userData.trail.forEach(t => s.add(t));
  const hist = [];
  const cam = new THREE.PerspectiveCamera(50, W / H, 0.1, 3000);
  return { s, cam, update(t) {
    const k = smooth(t / 3.2), ent = ramp(t, 1.2, 2.2);
    const pos = new THREE.Vector3(lerp(-26, 4, k), lerp(34, -6, Math.pow(k, 1.3)), lerp(-30, -46, k));
    F.position.copy(pos); F.rotation.y = 0.4 - k * 0.3;
    F.children[F.children.length - 2].scale.setScalar(6 + ent * 10); // 대기권 진입하며 불꽃이 커짐
    hist.length = 0; for (let i = 0; i < 40; i++) { const tt = Math.max(0, t - i * 0.025), kk = smooth(tt / 3.2); hist.push(new THREE.Vector3(lerp(-26, 4, kk), lerp(34, -6, Math.pow(kk, 1.3)), lerp(-30, -46, kk))); }
    F.userData.trail.forEach((sp, i) => { sp.position.copy(hist[i]).add(new THREE.Vector3(wob(t * 5, i) * 0.3, wob(t * 5, i + 9) * 0.3, 0)); sp.scale.setScalar((4.5 + ent * 6) * (1 - i / 44)); sp.material.opacity = (0.55 - i / 90) * (0.4 + ent); });
    earth.rotation.z = t * 0.01;
    cam.position.set(lerp(-8, 2, k), lerp(14, 6, k), lerp(16, 6, k)); cam.lookAt(pos.x * 0.6, pos.y * 0.6 - 6, pos.z); shake(cam, t, ent * 2.5);
  } };
} });

// 컷 2a: 정면 반응샷 — 놀라서 하늘을 가리키는 사람들의 얼굴 (뭔지는 아직 안 보여줌)
SHOTS.push({ name: 'w2a_faces', dur: 3.4, build() {
  const s = seaWorld({ shore: 0 }); skyline(s, -120, 120, 70, 50, 130);
  const glow = new THREE.PointLight(0x7dff86, 0, 60, 1.5); glow.position.set(0, 18, -4); s.add(glow);
  const ppl = []; const looks = [['#e8e2d6', '#3b4a63', 1.0], ['#c83c3c', '#2b2b33', 0.95], ['#3a7bd5', '#d8d0c0', 1.02], ['#f2c230', '#2d3b55', 0.9], ['#ffffff', '#5a5560', 1.0], ['#d36', '#333', 0.75]];
  looks.forEach(([sh, pa, sc], i) => { const p = person({ shirt: sh, pants: pa, scale: sc }); p.root.position.set(-2.4 + i * 0.95, 0, 8 + (i % 2) * 1.0 + (i === 5 ? -0.6 : 0)); p.root.rotation.y = Math.PI; s.add(p.root); ppl.push(p); });
  const cam = new THREE.PerspectiveCamera(48, W / H, 0.1, 3000);
  return { s, cam, update(t) {
    s.userData.seaTick(t); glow.intensity = 60 * ramp(t, 0.5, 3.4);
    ppl.forEach((p, i) => {
      const point = { rx: -2.6, sz: 0.2, ex: -0.1 }, mouth = { rx: -1.4, sz: -0.4, ex: -2.3 };
      const tn = 0.2 + i * 0.25, k = [[0, REST], [tn, REST], [tn + 0.4, i % 3 === 1 ? mouth : point], [3.4, i % 3 === 1 ? mouth : point]];
      p.pose(i % 2 ? REST : track(k, t), i % 2 ? track(k, t) : REST, { hx: -0.5 * ramp(t, tn - 0.2, tn + 0.3), lift: 0 });
      p.root.position.z = 8 + (i % 2) * 1.0 + (i === 5 ? -0.6 : 0) + ramp(t, 2.2, 3.4) * 0.6;
    });
    cam.position.set(0, 1.45, 4.6 + 0.6 * (t / 3.4)); cam.lookAt(0, 1.75, 12); shake(cam, t, 0.5 + ramp(t, 2.0, 3.4));
  } };
} });

// 컷 2: 해운대 — 하늘의 점이 점점 커지고 "저게 뭐야?" → 사람들 바로 앞바다에 거대하게 꽂힘 → 물폭발 속 택이 실루엣 (7초)
SHOTS.push({ name: 'w2_impact', dur: 7.6, build() {
  const s = seaWorld({ shore: 0 }); skyline(s, 40, 260, 40, 50, 130);
  const ppl = [];
  const looks = [['#e8e2d6', '#3b4a63'], ['#c83c3c', '#2b2b33'], ['#3a7bd5', '#d8d0c0'], ['#f2c230', '#2d3b55'], ['#ffffff', '#5a5560'], ['#2d6a4f', '#222'], ['#d36', '#333'], ['#888', '#223']];
  looks.forEach(([sh, pa], i) => { const p = person({ shirt: sh, pants: pa, scale: 0.92 + (i % 3) * 0.06 }); p.root.position.set(-6.5 + i * 1.9 + (i % 2) * 0.5, 0, 5.5 - (i % 3) * 1.8); p.root.rotation.y = Math.PI; s.add(p.root); ppl.push(p); });
  const F = fireball(1); s.add(F); F.userData.trail.forEach(t => s.add(t));
  const TI = 6.3, IMP = new THREE.Vector3(0, 0, -150), SRC = new THREE.Vector3(-120, 900, -2600);
  const fpos = t => { const k = Math.pow(clamp(t / TI), 2.2); return new THREE.Vector3().lerpVectors(SRC, IMP, k); };
  const colG = new THREE.Group(); colG.position.copy(IMP); s.add(colG);
  const col = []; for (let i = 0; i < 420; i++) { const sp = sprite(WHITE, 40, rnd() < 0.25 ? 0xa8ffb8 : 0xffffff, 0.6); sp.userData.r = rnd(); sp.userData.a = rnd() * 6.28; sp.userData.h = Math.pow(rnd(), 0.7); colG.add(sp); col.push(sp); }
  const flash = sprite(GLOW, 10, 0xd8ffd8, 0); flash.position.copy(IMP).add(new THREE.Vector3(0, 30, 0)); s.add(flash);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 96), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.copy(IMP).setY(0.6); s.add(ring);
  const T = taki(); T.scale.setScalar(70); s.add(T); T.traverse(o => { if (o.material) { o.material = o.material.clone(); o.material.transparent = true; } });
  const rain = []; for (let i = 0; i < 120; i++) { const sp = sprite(WHITE, 0.25, 0xffffff, 0.7); sp.userData.p = [(rnd() - 0.5) * 30, 20 + rnd() * 30, -rnd() * 30 + 8, rnd()]; s.add(sp); rain.push(sp); }
  const cam = new THREE.PerspectiveCamera(62, W / H, 0.1, 6000);
  return { s, cam, update(t) {
    s.userData.seaTick(t);
    const pos = fpos(t), k = clamp(t / TI);
    F.visible = t < TI; F.position.copy(pos); F.scale.setScalar(6 + 26 * Math.pow(k, 3));
    F.lookAt(cam.position);
    F.userData.trail.forEach((sp, i) => { const q = fpos(Math.max(0, t - i * 0.04)); sp.visible = t < TI + 0.05; sp.position.copy(q); sp.scale.setScalar((30 + 140 * Math.pow(k, 3)) * (1 - i / 44)); sp.material.opacity = 0.5 - i / 90; });
    const c = clamp((t - TI) / 0.7), fall = clamp((t - TI - 0.8) / 1.5);
    col.forEach(sp => { const d = sp.userData; const hh = d.h * 380 * smooth(c) * (1 - 0.25 * fall); const rr = d.r * (25 + 90 * d.h * c + 60 * fall); sp.position.set(Math.cos(d.a) * rr, hh, Math.sin(d.a) * rr * 0.6); sp.material.opacity = t < TI ? 0 : 0.6 * (1 - fall * 0.4); sp.scale.setScalar(50 + d.h * 60); });
    flash.material.opacity = t > TI ? Math.max(0, 1 - (t - TI) / 0.5) : 0; flash.scale.setScalar(300 + (t - TI) * 500);
    ring.scale.setScalar(Math.max(0.01, (t - TI) * 220)); ring.material.opacity = t > TI ? Math.max(0, 0.9 - (t - TI) / 1.6) : 0;
    // 물폭발 속에서 거대한 택이 실루엣이 솟아오름
    const r = ramp(t, TI + 0.5, 7.6); T.visible = t > TI + 0.4; T.position.set(0, lerp(-40, 45, r), -190); T.rotation.y = Math.sin(t) * 0.05;
    T.traverse(o => { if (o.material) o.material.opacity = 0.25 + 0.6 * r; });
    rain.forEach(sp => { const d = sp.userData.p; const tt = t - TI - 0.6; sp.visible = tt > 0; sp.position.set(d[0], d[1] - ((tt * 12 + d[3] * 20) % 40), d[2]); });
    ppl.forEach((p, i) => {
      const point = { rx: -2.5, sz: 0.25 + (i % 2) * 0.1, ex: -0.1 }, shield = { rx: -2.0, sz: -0.3, ex: -1.9 };
      const tNotice = 0.4 + (i % 4) * 0.45, pointer = i % 2 === 1 || i === 4;
      const R = track([[0, REST], [tNotice, REST], [tNotice + 0.5, pointer ? point : REST], [TI - 1.3, pointer ? point : REST], [TI - 0.6, shield], [7.6, shield]], t);
      const back = ramp(t, TI - 1.5, TI - 0.3) * 1.2 + ramp(t, TI, TI + 0.4) * 0.8;
      p.pose(REST, R, { hx: -0.25 - 0.35 * ramp(t, tNotice - 0.3, tNotice + 0.4), hy: -0.1, lift: t > TI && t < TI + 0.25 ? -0.04 : 0 });
      p.root.position.z = 5.5 - (i % 3) * 1.8 + back;
    });
    cam.position.set(0, 1.4, 13); cam.lookAt(0, lerp(40, 28, ramp(t, TI - 2, TI)), -200);
    shake(cam, t, 0.5 + 1.2 * ramp(t, TI - 1.5, TI) + (t > TI ? 7 * Math.exp(-(t - TI) * 2.5) : 0));
  } };
} });

// 컷 3: 수평선의 거대한 물 파도, 투명한 물속에 상품들 (5초)
SHOTS.push({ name: 'w3_wave', dur: 4.6, build() {
  const s = seaWorld({ shore: 0 }); skyline(s, 40, 260, 40, 50, 130);
  const ppl = []; for (let i = 0; i < 8; i++) { const p = person({ shirt: ['#e8e2d6', '#c83c3c', '#3a7bd5', '#f2c230', '#fff', '#2d6a4f', '#444', '#d36'][i] }); p.root.position.set(-9 + i * 2.4, 0, 2 - (i % 2) * 2); p.root.rotation.y = Math.PI; s.add(p.root); ppl.push(p); }
  const WV = bigWave(1100, 170); s.add(WV);
  const cam = new THREE.PerspectiveCamera(60, W / H, 0.1, 4000);
  return { s, cam, update(t) {
    s.userData.seaTick(t); WV.userData.tick(t);
    const k = smooth(t / 4.6);
    WV.position.set(0, -30 + 30 * ramp(t, 0, 1.0), lerp(-260, -95, k)); WV.scale.set(1, lerp(0.75, 1.15, k), 1);
    ppl.forEach((p, i) => p.pose(REST, i % 3 === 0 ? { rx: -2.4, sz: 0.3 } : REST, { hx: -0.25, lift: 0 }));
    cam.position.set(0, lerp(1.7, 1.9, k), lerp(14, 4, k)); cam.lookAt(0, lerp(40, 80, k), -200); shake(cam, t, 0.5);
  } };
} });

// 컷 3b: 옆에서 본 쓰나미 — 말려 올라가는 파도의 옆모습, 해변의 사람들은 점처럼 작게
SHOTS.push({ name: 'w3b_side', dur: 2.6, build() {
  const s = seaWorld({ shore: 0, fogNear: 200, fogFar: 2200 }); skyline(s, -100, 400, 60, 50, 130);
  const ppl = []; for (let i = 0; i < 14; i++) { const p = person({ shirt: ['#e33', '#36c', '#fff', '#fc3', '#3a3', '#222'][i % 6] }); p.root.position.set(10 + i * 4, 0, 4 + (i % 3) * 2); p.root.rotation.y = Math.PI; s.add(p.root); ppl.push(p); }
  const WV = bigWave(1400, 150); s.add(WV);
  const cam = new THREE.PerspectiveCamera(62, W / H, 0.5, 5000);
  return { s, cam, update(t) {
    s.userData.seaTick(t); WV.userData.tick(t);
    WV.position.set(0, 0, lerp(-150, -95, t / 2.6));
    ppl.forEach(p => p.pose(REST, { rx: -2.6, sz: 0.3 }, { hx: -0.4 }));
    cam.position.set(-30, 3, 30); cam.lookAt(60, 45, -70); shake(cam, t, 0.8);
  } };
} });

// 컷 4: 파도가 부서지며 제품들이 하늘에서 쏟아져 사람들 바로 앞 모래에 꽂힘 (스펙터클) → 환호
SHOTS.push({ name: 'w4_welcome', dur: 4.2, build() {
  const s = seaWorld({ shore: 0, fogNear: 60, fogFar: 900 });
  const cast = [['#2d3b55', '#4a4a4a'], ['#6b4f9e', '#5a5560'], ['#f2c230', '#2b2b33'], ['#e8e2d6', '#3b4a63'], ['#c83c3c', '#222']];
  const ppl = cast.map(([sh, pa], i) => { const p = person({ shirt: sh, pants: pa, perm: i === 1, scale: i === 1 ? 0.88 : 1 }); p.root.position.set(-3.2 + i * 1.6, 0, 5); p.root.rotation.y = Math.PI; s.add(p.root); if (i === 1) { const b = cyl(0.32, 0.22, 0.16, mat('#d9302c', { roughness: 0.4 })); b.position.set(0, 2.05, 0); p.body.add(b); } return p; });
  const items = []; for (let i = 0; i < 34; i++) { const p = product(PROD[i % PROD.length]); p.scale.multiplyScalar(2.6); const x = -7 + rnd() * 14, z = 3 - rnd() * 9;
    p.userData = { dst: new THREE.Vector3(x, 0.15, z), src: new THREE.Vector3(x + (rnd() - 0.5) * 10, 40 + rnd() * 40, z - 30 - rnd() * 20), t0: 0.2 + rnd() * 1.6, tilt: [(rnd() - 0.5) * 1.2, rnd() * 6, (rnd() - 0.5) * 1.2], spin: [rnd() * 8, rnd() * 8] };
    s.add(p); items.push(p); }
  const puffs = items.map(() => { const sp = sprite(WHITE, 1, 0xe8d6ad, 0); sp.material.blending = THREE.NormalBlending; s.add(sp); return sp; });
  const foam = mesh(new THREE.PlaneGeometry(300, 30), new THREE.MeshStandardMaterial({ color: '#f4fbfb', transparent: true, opacity: 0.9 })); foam.rotation.x = -Math.PI / 2; s.add(foam);
  const cam = new THREE.PerspectiveCamera(60, W / H, 0.1, 3000);
  return { s, cam, update(t) {
    s.userData.seaTick(t);
    foam.position.set(0, 0.12, lerp(-40, -16, ramp(t, 0, 1.2))); foam.material.opacity = 0.9 * (1 - ramp(t, 1.4, 3));
    items.forEach((p, i) => { const d = p.userData, k = clamp((t - d.t0) / 0.9); p.visible = t > d.t0 - 0.05;
      p.position.lerpVectors(d.src, d.dst, k * k); p.rotation.set(d.tilt[0] + d.spin[0] * (1 - k), d.tilt[1] + d.spin[1] * (1 - k), d.tilt[2]);
      const pt = t - d.t0 - 0.9, pf = puffs[i]; pf.position.copy(d.dst).setY(0.8); pf.material.opacity = pt > 0 ? Math.max(0, 0.75 - pt * 0.9) : 0; pf.scale.setScalar(pt > 0 ? 1.5 + pt * 6 : 0.01); });
    ppl.forEach((p, i) => { const flinch = { rx: -2.0, sz: -0.3, ex: -1.9 }, cheer = { rx: -2.9, sz: 0.5, ex: -0.2 };
      const k = [[0, REST], [0.3, flinch], [2.4, flinch], [2.8, cheer], [4.2, cheer]];
      p.pose(track(k, t), track(k, t), { lift: t > 2.8 ? Math.abs(Math.sin((t - 2.8) * 7 + i)) * 0.2 : 0, hx: -0.2 }); });
    cam.position.set(0.3, 1.2, 10); cam.lookAt(0, 4, -20); shake(cam, t, 0.5 + 2.5 * ramp(t, 0.9, 1.3) * (1 - ramp(t, 1.8, 2.6)));
  } };
} });

// 컷 5: 바다에 둥둥 뜬 택이 → 윙크 (4.5초)
SHOTS.push({ name: 'w5_taki', dur: 4.6, build() {
  const s = seaWorld({ shore: 0, top: '#78aee6', bot: '#f6e7cf' }); skyline(s, -260, 260, -900, 40, 120);
  const T = taki(); T.scale.setScalar(85); s.add(T);
  const ppl = []; for (let i = 0; i < 9; i++) { const p = person({ shirt: ['#e33', '#36c', '#fff', '#fc3', '#3a3', '#222', '#d36', '#888', '#6b4f9e'][i] }); p.root.position.set(-7 + i * 1.75, 0, 4 + (i % 2) * 1.2); p.root.rotation.y = Math.PI; s.add(p.root); ppl.push(p); }
  const fl = []; for (let i = 0; i < 16; i++) { const p = product(PROD[i % PROD.length]); p.position.set(-9 + rnd() * 18, 0.25, -1 - rnd() * 4); p.rotation.y = rnd() * 6; s.add(p); fl.push(p); }
  const cam = new THREE.PerspectiveCamera(72, W / H, 0.1, 4000);
  return { s, cam, update(t) {
    s.userData.seaTick(t);
    T.position.set(0, 62 + Math.sin(t * 1.3) * 1.5, -220); T.rotation.set(0.12, lerp(0.4, 0, ramp(t, 0.6, 1.8)), Math.sin(t * 1.1) * 0.04);
    const wink = t > 2.3 && t < 2.85 ? Math.sin((t - 2.3) / 0.55 * Math.PI) : 0; T.eyes[0].scale.y = 1 - 0.92 * wink;
    ppl.forEach((p, i) => p.pose(REST, t > 2.6 && i % 2 ? { rx: -2.8, sz: 0.4 } : REST, { hx: -0.55, lift: t > 2.6 ? Math.abs(Math.sin((t - 2.6) * 6 + i)) * 0.12 : 0 }));
    cam.position.set(0, 1.0, 13); cam.lookAt(0, lerp(55, 62, t / 4.6), -150); shake(cam, t, 0.3);
  } };
} });

// 컷 6: 상품으로 뒤덮인 해운대 항공샷 (+ KV 엔드카드가 위에 얹힘) (7.5초)
SHOTS.push({ name: 'w6_aerial', dur: 9.4, build() {
  const s = seaWorld({ shore: 0, fogNear: 300, fogFar: 2600 }); skyline(s, -320, 320, 160, 60, 160);
  const N = 1400, cols = ['#1a1b1e', '#f1f1ef', '#c9ccd1', G, P, '#d8342c', '#8a5a3b', '#2b4f7a'];
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const inst = cols.map(c => new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: c, roughness: 0.5 }), Math.ceil(N / cols.length)));
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  inst.forEach((im, ci) => { for (let i = 0; i < im.count; i++) { const x = (rnd() - 0.5) * 520, z = 2 + rnd() * 70; e.set(0, rnd() * 3, rnd() < 0.3 ? 1.57 : 0); q.setFromEuler(e); const w = 0.6 + rnd() * 1.6; m4.compose(new THREE.Vector3(x, w * 0.4, z), q, new THREE.Vector3(w, w * (0.5 + rnd()), w * 0.7)); im.setMatrixAt(i, m4); } im.castShadow = true; s.add(im); });
  const pg = new THREE.CapsuleGeometry(0.3, 1.0, 4, 8), pc = ['#e33', '#36c', '#fff', '#fc3', '#3a3', '#222'];
  pc.forEach(c => { const im = new THREE.InstancedMesh(pg, new THREE.MeshStandardMaterial({ color: c }), 80); for (let i = 0; i < 80; i++) { m4.compose(new THREE.Vector3((rnd() - 0.5) * 480, 0.8, 4 + rnd() * 60), q.identity(), new THREE.Vector3(1, 1, 1)); im.setMatrixAt(i, m4); } s.add(im); });
  const T = taki(); T.scale.setScalar(40); s.add(T);
  const cam = new THREE.PerspectiveCamera(55, W / H, 0.5, 6000);
  return { s, cam, update(t) {
    s.userData.seaTick(t);
    T.position.set(-90, 8 + Math.sin(t * 1.4) * 2, -30); T.rotation.y = Math.PI + 0.6 + Math.sin(t * 0.7) * 0.1;
    const k = smooth(t / 9.4);
    cam.position.set(lerp(-20, 10, k), lerp(85, 130, k), lerp(-190, -250, k)); cam.lookAt(0, 0, lerp(25, 35, k)); shake(cam, t, 0.2);
  } };
} });

// ---------- 렌더 API
let cur = -1, ctx = null;
window.SHOTS = SHOTS.map(s => ({ name: s.name, dur: s.dur }));
window.renderAt = (i, t) => {
  if (i !== cur) { ctx = SHOTS[i].build(); cur = i; }
  ctx.update(t); renderer.render(ctx.s, ctx.cam);
  const gl = renderer.getContext(), px = new Uint8Array(W * H * 4);
  gl.readPixels(0, 0, W, H, gl.RGBA, gl.UNSIGNED_BYTE, px);
  let s = ''; for (let k = 0; k < px.length; k += 0x8000) s += String.fromCharCode.apply(null, px.subarray(k, k + 0x8000));
  return btoa(s);
};
window.READY = true;
