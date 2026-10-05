// 「거대한 혜택이 밀려온다」 v3 — Seedance 2.5 레퍼런스 영상용 정밀 3D 블로킹 (클레이 렌더 스타일)
// 30초 한 번 생성: 이 영상(29.5초)을 @Video1로 넣으면 카메라·구도·동작·타이밍을 따라감. 생김새는 이미지 레퍼런스가 담당.
// 샷 길이 = 최종 편집 길이 (A1 2.0 / A2 2.9 / A3 4.5 / B1 2.3 / B2 1.8 / B3 3.3 / C1 4.0 / C2 8.7)
import * as THREE from 'three';
import { W, H, clamp, smooth, lerp, ramp, wob, mat, mesh, box, cyl, sph, canvasTex, skyTex, windowTex, person, REST, track, shake } from './lib.js';

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const reseed = s => { seed = s; };

function glowTex(inner) {
  return canvasTex(128, 128, (g, w) => { const r = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); r.addColorStop(0, inner); r.addColorStop(0.35, inner.replace(/[\d.]+\)$/, '0.55)')); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, w, w); });
}
const GLOW = glowTex('rgba(170,255,170,1)'), WHITE = glowTex('rgba(255,255,255,1)');
const sprite = (tex, size, color = 0xffffff, op = 1, add = true) => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color, transparent: true, opacity: op, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, depthWrite: false })); s.scale.setScalar(size); return s; };

// ---------- 택이 (레퍼런스 기준: 위로 갈수록 좁아지는 젤리 몸, 작은 뿔, 옆을 보는 흰 눈, 일자 입, 짧은 다리, 굵은 팔, 눈 달린 보라 허리 파우치)
const TAKI_PROFILE = [[0, 0.16], [0.4, 0.17], [0.64, 0.25], [0.79, 0.42], [0.86, 0.64], [0.85, 0.88], [0.78, 1.12], [0.65, 1.35], [0.48, 1.55], [0.29, 1.7], [0.11, 1.79], [0, 1.81]];
const takiR = y => { for (let i = 0; i < TAKI_PROFILE.length - 1; i++) { const [r0, y0] = TAKI_PROFILE[i], [r1, y1] = TAKI_PROFILE[i + 1]; if (y <= y1) return lerp(r0, r1, (y - y0) / (y1 - y0)); } return 0; };
const ZS = 0.86; // 앞뒤 두께 비율
function taki(o = {}) {
  const g = new THREE.Group(), rig = new THREE.Group(); g.add(rig);
  const green = new THREE.MeshPhysicalMaterial({ color: '#62d64c', roughness: 0.36, clearcoat: 0.7, clearcoatRoughness: 0.25, emissive: o.emissive ?? '#000000', emissiveIntensity: o.ei ?? 0 });
  const pts = new THREE.SplineCurve(TAKI_PROFILE.map(([r, y]) => new THREE.Vector2(r, y))).getPoints(48).map(p => new THREE.Vector2(Math.max(0, p.x), p.y));
  pts[0].x = 0; pts[pts.length - 1].x = 0;
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 72), green); body.scale.z = ZS; body.castShadow = body.receiveShadow = true; rig.add(body);
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.2, 24), green); horn.position.set(0, 1.86, -0.02); horn.rotation.x = -0.3; rig.add(horn);
  // 다리
  for (const sd of [-1, 1]) { const l = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.1, 8, 20), green); l.position.set(sd * 0.36, 0.17, 0.06); l.scale.set(1, 1, 1.15); l.castShadow = true; rig.add(l); }
  // 팔 (어깨 회전으로 포즈)
  const arms = {};
  for (const sd of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(sd * 0.72, 1.0, 0.06); rig.add(sh);
    const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.4, 8, 20), green); a.position.set(sd * 0.06, -0.3, 0); a.rotation.z = sd * 0.2; a.castShadow = true; sh.add(a);
    arms[sd] = sh;
  }
  // 눈
  const white = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.25, clearcoat: 1 }), black = new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.3 });
  const eyes = [];
  for (const sd of [-1, 1]) {
    const y = 1.2, x = 0.2, z = ZS * Math.sqrt(takiR(y) ** 2 - x * x);
    const e = new THREE.Group(); e.position.set(sd * x, y, z - 0.015); e.rotation.y = sd * 0.32; rig.add(e);
    const rim = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), black); rim.scale.set(0.118, 0.148, 0.035); e.add(rim);
    const w = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), white); w.scale.set(0.105, 0.135, 0.045); w.position.z = 0.006; e.add(w);
    const p = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), black); p.scale.set(0.048, 0.058, 0.02); p.position.set(0.035, -0.005, 0.045); e.add(p);
    eyes.push(e);
  }
  // 입 (일자)
  const my = 1.03, mouth = new THREE.Mesh(new THREE.CapsuleGeometry(0.009, 0.07, 4, 8), black); mouth.rotation.z = Math.PI / 2; mouth.position.set(0, my, ZS * takiR(my) - 0.004); rig.add(mouth);
  // 허리 파우치 (2026: 파우치에 눈 두 개)
  const purple = new THREE.MeshPhysicalMaterial({ color: '#8a5ae0', roughness: 0.45, clearcoat: 0.4 });
  const beltG = new THREE.TorusGeometry(1, 0.04, 10, 96); beltG.rotateX(Math.PI / 2);
  const belt = new THREE.Mesh(beltG, purple); belt.position.y = 0.62; belt.scale.set(takiR(0.62) + 0.015, 1, ZS * takiR(0.62) + 0.015); belt.rotation.z = 0.06; rig.add(belt);
  const pz = ZS * takiR(0.5);
  const pouch = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 24), purple); pouch.position.set(0, 0.5, pz + 0.02); pouch.scale.set(0.36, 0.2, 0.15); pouch.castShadow = true; rig.add(pouch);
  const pouchEyes = [];
  for (const sd of [-1, 1]) {
    const e = new THREE.Group(); e.position.set(sd * 0.085, 0.53, pz + 0.155); rig.add(e);
    const w = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 14), white); w.scale.set(0.055, 0.065, 0.02); e.add(w);
    const p = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10), black); p.scale.set(0.024, 0.03, 0.01); p.position.set(0, -0.005, 0.017); e.add(p);
    pouchEyes.push(e);
  }
  Object.assign(g, { rig, eyes, pouchEyes, arms, mats: [green, purple] });
  // 포즈 헬퍼: 팔 들기(0=내림, 1=만세), 눈 감기(0~1)
  g.arm = (sd, lift, wave = 0) => { arms[sd].rotation.set(0, 0, sd * (lift * 2.5 + wave)); };
  g.wink = (k, pouchToo = true) => { eyes[0].scale.y = 1 - 0.9 * k; if (pouchToo) pouchEyes.forEach(e => (e.scale.y = 1 - 0.9 * k)); };
  return g;
}

// ---------- 상품 (로고 없음, 실제 비율)
const PROD = ['tv', 'fridge', 'washer', 'laptop', 'tv', 'aircon', 'laptop', 'vacuum', 'fridge', 'washer', 'tv', 'phone'];
function product(type) {
  const g = new THREE.Group();
  const blk = mat('#16171a', { roughness: 0.3 }), scr = mat('#24364a', { roughness: 0.12, metalness: 0.2 }), slv = mat('#c4c8cd', { roughness: 0.3, metalness: 0.55 }),
    wht = mat('#f2f2ef', { roughness: 0.35 }), beige = mat('#e7ddcc', { roughness: 0.35 }), glass = mat('#2c3540', { roughness: 0.05, metalness: 0.3 });
  if (type === 'tv') {
    g.add(box(1.64, 0.94, 0.035, blk)); g.add(box(1.6, 0.9, 0.006, scr, 0, 0, 0.02));
    for (const s of [-1, 1]) { const f = box(0.04, 0.12, 0.26, blk, s * 0.6, -0.52, 0); f.rotation.z = s * 0.1; g.add(f); }
  } else if (type === 'fridge') {
    const m = rnd() < 0.5 ? slv : beige;
    g.add(box(0.91, 1.83, 0.72, m));
    g.add(box(0.008, 1.0, 0.01, blk, 0, 0.4, 0.365)); g.add(box(0.9, 0.008, 0.01, blk, 0, -0.12, 0.365)); g.add(box(0.9, 0.008, 0.01, blk, 0, -0.5, 0.365));
    for (const s of [-1, 1]) g.add(box(0.025, 0.5, 0.03, slv, s * 0.04, 0.45, 0.38));
    g.add(box(0.3, 0.025, 0.03, slv, 0, -0.2, 0.38)); g.add(box(0.3, 0.025, 0.03, slv, 0, -0.58, 0.38));
  } else if (type === 'washer') {
    g.add(box(0.6, 0.85, 0.62, rnd() < 0.5 ? wht : mat('#2d3036', { roughness: 0.35 })));
    g.add(box(0.6, 0.12, 0.01, glass, 0, 0.36, 0.312));
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 12, 40), slv); ring.position.set(0, -0.04, 0.32); g.add(ring);
    const d = cyl(0.19, 0.19, 0.02, glass, 0, -0.04, 0.315); d.rotation.x = Math.PI / 2; g.add(d);
    const k = cyl(0.035, 0.035, 0.03, slv, 0.2, 0.36, 0.32); k.rotation.x = Math.PI / 2; g.add(k);
  } else if (type === 'laptop') {
    g.add(box(0.36, 0.016, 0.25, slv)); g.add(box(0.31, 0.003, 0.11, blk, 0, 0.009, -0.03)); g.add(box(0.11, 0.003, 0.07, mat('#9aa0a6'), 0, 0.009, 0.08));
    const lid = new THREE.Group(); lid.position.set(0, 0.008, -0.125); lid.rotation.x = -0.35; g.add(lid);
    lid.add(box(0.36, 0.24, 0.008, slv, 0, 0.12, 0)); lid.add(box(0.34, 0.215, 0.002, scr, 0, 0.12, 0.005));
    g.scale.setScalar(1.8);
  } else if (type === 'aircon') {
    g.add(box(0.36, 1.75, 0.3, wht)); for (let i = 0; i < 3; i++) { const c = cyl(0.1, 0.1, 0.01, mat('#cfd3d6'), 0, 0.55 - i * 0.28, 0.152); c.rotation.x = Math.PI / 2; g.add(c); }
  } else if (type === 'vacuum') {
    g.add(cyl(0.17, 0.17, 0.09, mat('#2a2d33', { roughness: 0.3 }))); g.add(cyl(0.05, 0.05, 0.02, slv, 0, 0.05, 0.05)); g.scale.setScalar(2.4);
  } else {
    g.add(box(0.075, 0.16, 0.008, blk)); g.add(box(0.07, 0.15, 0.002, scr, 0, 0, 0.005)); g.scale.setScalar(4);
  }
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = false; } });
  return g;
}

// ---------- 해운대: 바다·백사장·파라솔·해변 호텔·마린시티·엘시티
const WT = [windowTex('#e7e4dd', '#7d90a4', 5, 12), windowTex('#d9d8d3', '#5e7083', 6, 14), windowTex('#efe9df', '#93a6b6', 4, 10), windowTex('#cfd6dc', '#4f6377', 8, 16)];
function tower(s, x, z, w, h, d, k = 0, ry = 0) {
  const t = WT[k % WT.length].clone(); t.needsUpdate = true; t.repeat.set(Math.max(1, w / 14), h / 34);
  const b = box(w, h, d, new THREE.MeshStandardMaterial({ map: t, roughness: 0.75 }), x, h / 2, z); b.rotation.y = ry; b.castShadow = false; s.add(b);
  const cap = box(w * 0.7, Math.max(2, h * 0.03), d * 0.7, mat('#c9c6bf'), x, h + Math.max(1, h * 0.015), z); cap.rotation.y = ry; cap.castShadow = false; s.add(cap);
  return b;
}
function haeundae(s, o = {}) {
  reseed(o.seed ?? 21);
  // 해변 앞 호텔·아파트 (해변 뒤 z=125~170)
  for (let x = -760; x < 520; x += 34 + rnd() * 22) tower(s, x, 140 + rnd() * 35, 22 + rnd() * 14, 55 + rnd() * 120, 20 + rnd() * 8, Math.floor(rnd() * 4));
  // 엘시티 (동쪽 끝 초고층 3동)
  [[600, 120, 411], [660, 170, 339], [545, 175, 339]].forEach(([x, z, h], i) => { const b = tower(s, x, z, 34, h, 30, 3, 0.2); b.scale.set(1, 1, 1); });
  // 마린시티 (서쪽 만 건너편 초고층)
  if (o.marine !== false) for (let i = 0; i < 9; i++) tower(s, -340 + i * 38 + rnd() * 15, -820 - rnd() * 140, 28 + rnd() * 10, 170 + rnd() * 120, 28, 3, rnd());
  // 해변 뒤 도시 (항공샷용)
  if (o.deep) for (let i = 0; i < 420; i++) tower(s, -1400 + rnd() * 2200, 200 + rnd() * 1200, 18 + rnd() * 20, 30 + rnd() * 110, 18 + rnd() * 14, Math.floor(rnd() * 4));
  // 동백섬 (서쪽 끝 숲)
  const isl = mesh(new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat('#4d6b3f', { roughness: 0.95 })); isl.scale.set(170, 45, 140); isl.position.set(-900, -2, -40); isl.castShadow = false; s.add(isl);
  // 파라솔 (해운대 상징)
  if (o.parasols !== false) {
    const n = o.parasolN ?? 500, cone = new THREE.ConeGeometry(1.25, 0.45, 12), pole = new THREE.CylinderGeometry(0.03, 0.03, 2.2, 6);
    const ic = new THREE.InstancedMesh(cone, new THREE.MeshStandardMaterial({ roughness: 0.6 }), n), ip = new THREE.InstancedMesh(pole, mat('#dddddd'), n);
    const cols = ['#e2483d', '#f1c232', '#2f7dd1', '#ffffff', '#2fa26b', '#f08a24'].map(c => new THREE.Color(c));
    const m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
    for (let i = 0; i < n; i++) {
      let x = (o.px0 ?? -700) + ((o.px1 ?? 480) - (o.px0 ?? -700)) * (i % 50) / 50 + rnd() * 3; if (o.gap) x += x < 0 ? -o.gap : o.gap; const z = (o.pz0 ?? 26) + Math.floor(i / 50) * 4.2 + rnd();
      m4.compose(new THREE.Vector3(x, 2.4, z), q.identity(), new THREE.Vector3(1, 1, 1)); ic.setMatrixAt(i, m4); ic.setColorAt(i, cols[i % cols.length]);
      m4.compose(new THREE.Vector3(x, 1.1, z), q, new THREE.Vector3(1, 1, 1)); ip.setMatrixAt(i, m4);
    }
    ic.castShadow = true; s.add(ic, ip);
  }
}
function seaWorld(o = {}) {
  const s = new THREE.Scene();
  s.background = skyTex(o.top || '#4f93dc', o.bot || '#e2edf5');
  s.fog = new THREE.Fog(0xdde8f1, o.fogNear ?? 200, o.fogFar ?? 1800);
  s.add(new THREE.HemisphereLight(0xe3f0ff, 0xc7b38c, 1.15));
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.5); sun.position.set(-30, 60, -40); sun.castShadow = true;
  const sc = o.shadow ?? 16, sd = sc > 50 ? 10 : 1; sun.position.multiplyScalar(sd); sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -sc, right: sc, top: sc, bottom: -sc, near: 1, far: 300 * sd }); sun.shadow.normalBias = 0.03;
  sun.target.position.set(...(o.shadowAt ?? [0, 0, 0])); sun.position.add(sun.target.position); s.add(sun, sun.target);
  const geo = new THREE.PlaneGeometry(4000, 3000, 180, 140); geo.rotateX(-Math.PI / 2);
  const sea = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: '#1e6ea6', roughness: 0.2, metalness: 0.12 }));
  sea.position.z = -1500; sea.receiveShadow = true; s.add(sea);
  const base = geo.attributes.position.array.slice();
  s.userData.seaTick = t => { const p = geo.attributes.position.array; for (let i = 0; i < p.length; i += 3) { const x = base[i], z = base[i + 2]; p[i + 1] = Math.sin(x * 0.05 + t * 1.3) * 0.35 + Math.sin(z * 0.08 - t * 1.9) * 0.3 + Math.sin((x + z) * 0.2 + t * 2.7) * 0.08; } geo.attributes.position.needsUpdate = true; geo.computeVertexNormals(); };
  const sand = mesh(new THREE.PlaneGeometry(4000, 130), mat('#ddc89c', { roughness: 0.95 })); sand.rotation.x = -Math.PI / 2; sand.position.set(0, 0.05, 65); s.add(sand);
  const land = mesh(new THREE.PlaneGeometry(14000, 9000), mat('#a8a69b', { roughness: 0.95 })); land.rotation.x = -Math.PI / 2; land.position.set(0, 0.02, 4630); land.castShadow = false; s.add(land);
  const wet = mesh(new THREE.PlaneGeometry(4000, 7), mat('#b8a378', { roughness: 0.45 })); wet.rotation.x = -Math.PI / 2; wet.position.set(0, 0.07, 2.5); s.add(wet);
  const foamL = mesh(new THREE.PlaneGeometry(4000, 1.2), new THREE.MeshStandardMaterial({ color: '#f5fafa', transparent: true, opacity: 0.85 })); foamL.rotation.x = -Math.PI / 2; foamL.position.set(0, 0.1, -0.5); s.add(foamL);
  if (o.city !== false) haeundae(s, o);
  return s;
}

// 군중 (뒷모습/정면) — 다양한 체형·옷
const LOOKS = [['#e8e2d6', '#3b4a63'], ['#c83c3c', '#2b2b33'], ['#3a7bd5', '#d8d0c0'], ['#f2c230', '#2d3b55'], ['#ffffff', '#5a5560'], ['#2d6a4f', '#222'], ['#d36a8c', '#333'], ['#888', '#223'], ['#6b4f9e', '#444'], ['#f08a24', '#2a2a2a']];
function crowd(s, spots, faceSea = true) {
  return spots.map(([x, z, sc = 1], i) => {
    const [sh, pa] = LOOKS[i % LOOKS.length];
    const p = person({ shirt: sh, pants: pa, scale: sc, cap: i % 5 === 2 ? '#e6e6e6' : null, perm: i % 7 === 4, backpack: i % 6 === 3 ? '#3a3f4a' : null, sleeve: i % 4 === 1 ? 'none' : null });
    p.root.position.set(x, 0, z); p.root.rotation.y = faceSea ? Math.PI : 0; s.add(p.root); return p;
  });
}

// 거대한 투명 파도 + 속의 상품
function bigWave(width = 700, height = 60, nItems = 150) {
  const g = new THREE.Group();
  const prof = []; for (let i = 0; i <= 32; i++) { const v = i / 32, a = v * Math.PI * 0.95; prof.push([Math.sin(a * 0.6) * 0.9 - v * v * 0.25, v < 0.75 ? v * 1.05 : 0.79 + Math.sin((v - 0.75) / 0.25 * Math.PI * 0.6) * 0.12, v]); }
  const pos = [], idx = [], uv = [], NX = 90;
  for (let i = 0; i <= NX; i++) for (const [z, y, v] of prof) { const x = (i / NX - 0.5) * width; const w2 = Math.sin(i * 0.7) * 0.04 + Math.sin(i * 0.23) * 0.05; pos.push(x, y * height * (1 + w2), -z * height * 0.55); uv.push(i / NX, v); }
  const R = prof.length;
  for (let i = 0; i < NX; i++) for (let j = 0; j < R - 1; j++) { const a = i * R + j, b = a + R; idx.push(a, b, a + 1, b, b + 1, a + 1); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx); geo.computeVertexNormals();
  const tex = canvasTex(8, 256, (c, w, h) => { const gr = c.createLinearGradient(0, h, 0, 0); gr.addColorStop(0, 'rgba(18,96,140,0.9)'); gr.addColorStop(0.45, 'rgba(40,190,200,0.45)'); gr.addColorStop(0.8, 'rgba(120,235,225,0.35)'); gr.addColorStop(0.93, 'rgba(240,255,255,0.95)'); gr.addColorStop(1, 'rgba(255,255,255,1)'); c.fillStyle = gr; c.fillRect(0, 0, w, h); });
  const m = new THREE.MeshStandardMaterial({ map: tex, transparent: true, side: THREE.DoubleSide, roughness: 0.08, metalness: 0.1, emissive: '#0d5d6a', emissiveIntensity: 0.35, depthWrite: false });
  const w = new THREE.Mesh(geo, m); w.renderOrder = 2; g.add(w);
  // 물마루 물보라
  const spray = []; for (let i = 0; i < 160; i++) { const sp = sprite(WHITE, height * 0.12, 0xffffff, 0.5, false); sp.userData.x = (rnd() - 0.5) * width; sp.userData.p = rnd(); g.add(sp); spray.push(sp); }
  const items = [];
  for (let i = 0; i < nItems; i++) {
    const p = product(PROD[i % PROD.length]); const sc = height / 10 * (0.6 + rnd() * 0.6); p.scale.multiplyScalar(sc);
    const v = 0.12 + rnd() * 0.6; p.position.set((rnd() - 0.5) * width * 0.9, v * height, -(0.15 + rnd() * 0.35) * height * 0.55);
    p.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6); p.userData.spin = [rnd() - 0.5, rnd() - 0.5, rnd() - 0.5];
    g.add(p); items.push(p);
  }
  g.userData.tick = t => {
    items.forEach(p => { const s = p.userData.spin; p.rotation.set(s[0] * t * 1.2 + s[1] * 3, s[1] * t * 1.2 + s[2] * 3, s[2] * t * 1.2); });
    spray.forEach(sp => { const k = (t * 0.6 + sp.userData.p) % 1; sp.position.set(sp.userData.x + k * 10, height * (0.92 + k * 0.25), -height * 0.45 + k * height * 0.3); sp.material.opacity = 0.55 * (1 - k); });
  };
  return g;
}

// 초록 불덩이 (안에 몸을 웅크린 택이)
function fireball(size = 1) {
  const g = new THREE.Group();
  const T = taki({ emissive: '#3dff6a', ei: 0.9 }); T.scale.setScalar(1.1); T.position.y = -0.95; T.arm(-1, 0.05); T.arm(1, 0.05); g.add(T);
  g.add(sprite(GLOW, 6, 0x9dff9d, 0.75)); g.add(sprite(WHITE, 2.8, 0xeaffea, 0.35));
  const trail = []; for (let i = 0; i < 44; i++) trail.push(sprite(GLOW, 4, i % 3 ? 0x4dff6a : 0xffe08a, 0.5));
  g.userData.trail = trail; g.userData.taki = T; g.scale.setScalar(size); return g;
}

const SHOTS = [];

// A1 (0~2.0) 우주: 초록 불덩이가 대기권으로
SHOTS.push({ name: 'A1_meteor', dur: 2.0, build() {
  reseed(3);
  const s = new THREE.Scene(); s.background = new THREE.Color('#02030a');
  const sg = new THREE.BufferGeometry(), sp = []; for (let i = 0; i < 3000; i++) { const a = rnd() * 6.28, b = Math.acos(rnd() * 2 - 1); sp.push(Math.sin(b) * Math.cos(a) * 600, Math.cos(b) * 600, Math.sin(b) * Math.sin(a) * 600); }
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); s.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.2, sizeAttenuation: false })));
  const earthTex = canvasTex(2048, 1024, (g, w, h) => {
    g.fillStyle = '#123f78'; g.fillRect(0, 0, w, h);
    // 한반도 비슷한 육지 + 주변
    g.fillStyle = '#4f6e3a'; g.beginPath(); g.ellipse(w * 0.52, h * 0.42, 60, 150, 0.25, 0, 7); g.fill();
    g.fillStyle = '#6d7a43'; g.beginPath(); g.ellipse(w * 0.38, h * 0.3, 380, 160, 0.1, 0, 7); g.fill();
    g.fillStyle = '#5c7341'; g.beginPath(); g.ellipse(w * 0.66, h * 0.58, 70, 220, -0.6, 0, 7); g.fill();
    for (let i = 0; i < 60; i++) { g.fillStyle = ['#3f6b35', '#6d7a43', '#8a7a52'][i % 3]; g.beginPath(); g.ellipse(rnd() * w, h * 0.15 + rnd() * h * 0.7, 20 + rnd() * 90, 10 + rnd() * 50, rnd() * 3, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(255,255,255,0.55)'; for (let i = 0; i < 420; i++) { g.beginPath(); g.ellipse(rnd() * w, rnd() * h, 10 + rnd() * 70, 3 + rnd() * 14, rnd() * 0.6, 0, 7); g.fill(); }
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(80, 128, 64), new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.8 })); earth.position.set(0, -92, -40); earth.rotation.x = Math.PI / 2.2; s.add(earth);
  const atm = new THREE.Mesh(new THREE.SphereGeometry(83, 96, 64), new THREE.ShaderMaterial({ transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
    vertexShader: 'varying vec3 n; varying vec3 v; void main(){ n=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); v=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }',
    fragmentShader: 'varying vec3 n; varying vec3 v; void main(){ float f=pow(1.-abs(dot(n,v)),3.); gl_FragColor=vec4(0.35,0.65,1.,1.)*f*1.6; }' }));
  atm.position.copy(earth.position); s.add(atm);
  s.add(new THREE.AmbientLight(0x223344, 0.7)); const sun = new THREE.DirectionalLight(0xffe2b8, 2.8); sun.position.set(-80, 30, 40); s.add(sun);
  const F = fireball(1.1); s.add(F); F.userData.trail.forEach(t => s.add(t));
  const D = 3.2, path = tt => { const k = smooth(tt / D); return new THREE.Vector3(lerp(-26, 4, k), lerp(34, -6, Math.pow(k, 1.3)), lerp(-30, -46, k)); };
  const cam = new THREE.PerspectiveCamera(50, W / H, 0.1, 3000);
  return { s, cam, update(t0) {
    const t = t0 + 0.4, k = smooth(t / D), ent = ramp(t, 1.2, 2.2), pos = path(t);
    F.position.copy(pos); F.rotation.set(0.5, 0.6 - k * 0.3, -0.4);
    F.children[1].scale.setScalar(6 + ent * 10);
    F.userData.trail.forEach((sp, i) => { sp.position.copy(path(Math.max(0, t - i * 0.025))).add(new THREE.Vector3(wob(t * 5, i) * 0.3, wob(t * 5, i + 9) * 0.3, 0)); sp.scale.setScalar((4.5 + ent * 6) * (1 - i / 48)); sp.material.opacity = (0.55 - i / 95) * (0.4 + ent); });
    earth.rotation.z = t * 0.01;
    cam.position.set(lerp(-8, 2, k), lerp(14, 6, k), lerp(16, 6, k)); cam.lookAt(pos.x * 0.6, pos.y * 0.6 - 6, pos.z); shake(cam, t, ent * 2.5);
  } };
} });

// A2 (2.0~4.9) 정면: 하늘을 보고 얼어붙는 사람들, 초록빛이 얼굴에 (뭔지는 안 보여줌)
SHOTS.push({ name: 'A2_faces', dur: 2.9, build() {
  const s = seaWorld({ shadowAt: [0, 0, 9], parasolN: 150, pz0: 13 });
  const glow = new THREE.PointLight(0x7dff86, 0, 60, 1.5); glow.position.set(0, 18, 2); s.add(glow);
  const ppl = crowd(s, [[-2.3, 8.2, 1.0], [-1.35, 9.2, 0.95], [-0.4, 8.0, 1.02], [0.55, 9.1, 0.9], [1.5, 8.3, 1.0], [-0.9, 7.5, 0.72], [2.4, 9.4, 0.97], [-3.1, 9.6, 0.94]]);
  const cam = new THREE.PerspectiveCamera(46, W / H, 0.1, 3000);
  return { s, cam, update(t0) {
    const t = t0 + 0.2; s.userData.seaTick(t); glow.intensity = 70 * ramp(t, 0.4, 3.2);
    ppl.forEach((p, i) => {
      const point = { rx: -2.6, sz: 0.2, ex: -0.1 }, mouth = { rx: -1.4, sz: -0.4, ex: -2.3 }, grab = { rx: -0.9, sz: -0.5, ex: -1.2 };
      const tn = 0.15 + (i % 6) * 0.28, P = i === 5 ? grab : i % 3 === 1 ? mouth : point, k = [[0, REST], [tn, REST], [tn + 0.45, P], [3.4, P]];
      p.pose(i % 2 ? REST : track(k, t), i % 2 ? track(k, t) : REST, { hx: -0.5 * ramp(t, tn - 0.2, tn + 0.3), hy: wob(t, i) * 0.06 });
      p.root.position.z = [8.2, 9.2, 8.0, 9.1, 8.3, 7.5, 9.4, 9.6][i] + ramp(t, 2.2, 3.2) * 0.5;
    });
    cam.position.set(0, 1.4, 4.4 + 0.7 * (t / 3.2)); cam.lookAt(0, 1.8, 12); shake(cam, t, 0.5 + ramp(t, 2.0, 3.2));
  } };
} });

// A3 (4.9~9.4) 뒤에서: 불덩이가 바로 앞바다에 착지(2.9초 = 최종 7.8초) → 물기둥 속 택이 실루엣
SHOTS.push({ name: 'A3_impact', dur: 4.5, build() {
  const s = seaWorld({ shadowAt: [0, 0, 4], parasolN: 100, pz0: 0, px0: -60, px1: 60, gap: 14, marine: false });
  const ppl = crowd(s, [[-6.5, 5.5, 0.95], [-4.4, 3.8, 1.0], [-2.6, 5.9, 0.92], [-0.6, 4.1, 1.03], [1.3, 5.6, 0.97], [3.2, 3.6, 1.0], [5.0, 5.4, 0.9], [6.8, 4.0, 1.0], [-1.6, 2.4, 0.74]]);
  const F = fireball(1); s.add(F); F.userData.trail.forEach(t => s.add(t));
  const TI = 6.3, IMP = new THREE.Vector3(0, 0, -150), SRC = new THREE.Vector3(-120, 900, -2600);
  const fpos = t => new THREE.Vector3().lerpVectors(SRC, IMP, Math.pow(clamp(t / TI), 2.2));
  const colG = new THREE.Group(); colG.position.copy(IMP); s.add(colG);
  const col = []; for (let i = 0; i < 520; i++) { const sp = sprite(WHITE, 40, rnd() < 0.25 ? 0xa8ffb8 : 0xffffff, 0.6); sp.userData.r = rnd(); sp.userData.a = rnd() * 6.28; sp.userData.h = Math.pow(rnd(), 0.7); colG.add(sp); col.push(sp); }
  const shell = new THREE.Mesh(new THREE.CylinderGeometry(60, 25, 1, 48, 1, true), new THREE.MeshStandardMaterial({ color: '#eef8f6', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })); colG.add(shell);
  const flash = sprite(GLOW, 10, 0xd8ffd8, 0); flash.position.copy(IMP).add(new THREE.Vector3(0, 30, 0)); s.add(flash);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 96), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.copy(IMP).setY(0.6); s.add(ring);
  const T = taki(); T.scale.setScalar(80); s.add(T); T.mats.forEach(m => { m.transparent = true; });
  T.traverse(o => { if (o.material && !T.mats.includes(o.material)) { o.material = o.material.clone(); o.material.transparent = true; T.mats.push(o.material); } });
  const rain = []; for (let i = 0; i < 160; i++) { const sp = sprite(WHITE, 0.25, 0xffffff, 0.7); sp.userData.p = [(rnd() - 0.5) * 30, 20 + rnd() * 30, -rnd() * 30 + 8, rnd()]; s.add(sp); rain.push(sp); }
  const cam = new THREE.PerspectiveCamera(62, W / H, 0.1, 6000);
  return { s, cam, update(t0) {
    const t = t0 + 3.4; s.userData.seaTick(t);
    const pos = fpos(t), k = clamp(t / TI);
    F.visible = t < TI; F.position.copy(pos); F.scale.setScalar(6 + 26 * Math.pow(k, 3)); F.lookAt(cam.position);
    F.userData.trail.forEach((sp, i) => { sp.visible = t < TI + 0.05; sp.position.copy(fpos(Math.max(0, t - i * 0.04))); sp.scale.setScalar((30 + 140 * Math.pow(k, 3)) * (1 - i / 48)); sp.material.opacity = 0.5 - i / 95; });
    const c = clamp((t - TI) / 0.7), fall = clamp((t - TI - 0.8) / 1.5);
    col.forEach(sp => { const d = sp.userData; const hh = d.h * 380 * smooth(c) * (1 - 0.25 * fall); const rr = d.r * (25 + 90 * d.h * c + 60 * fall); sp.position.set(Math.cos(d.a) * rr, hh, Math.sin(d.a) * rr * 0.6); sp.material.opacity = t < TI ? 0 : 0.6 * (1 - fall * 0.4); sp.scale.setScalar(50 + d.h * 60); });
    shell.scale.set(1 + c * 0.6 + fall, Math.max(0.01, 340 * smooth(c)), 1 + c * 0.6 + fall); shell.position.y = 170 * smooth(c); shell.material.opacity = t < TI ? 0 : 0.5 * (1 - fall * 0.6);
    flash.material.opacity = t > TI ? Math.max(0, 1 - (t - TI) / 0.5) : 0; flash.scale.setScalar(300 + (t - TI) * 500);
    ring.scale.setScalar(Math.max(0.01, (t - TI) * 220)); ring.material.opacity = t > TI ? Math.max(0, 0.9 - (t - TI) / 1.6) : 0;
    const r = ramp(t, TI + 0.4, 7.9); T.visible = t > TI + 0.35; T.position.set(0, lerp(-110, -6, r), -200); T.rotation.y = Math.sin(t) * 0.05; T.arm(-1, 0.15 + r * 0.25); T.arm(1, 0.15 + r * 0.25);
    T.mats.forEach(m => (m.opacity = 0.2 + 0.6 * r));
    rain.forEach(sp => { const d = sp.userData.p; const tt = t - TI - 0.6; sp.visible = tt > 0; sp.position.set(d[0], d[1] - ((tt * 12 + d[3] * 20) % 40), d[2]); });
    ppl.forEach((p, i) => {
      const point = { rx: -2.5, sz: 0.25 + (i % 2) * 0.1, ex: -0.1 }, shield = { rx: -2.0, sz: -0.3, ex: -1.9 };
      const tNotice = 3.4 + (i % 4) * 0.25, pointer = i % 2 === 1 || i === 4;
      const R = track([[0, pointer ? point : REST], [TI - 1.3, pointer ? point : REST], [TI - 0.6, shield], [8, shield]], t);
      const back = ramp(t, TI - 1.5, TI - 0.3) * 1.2 + ramp(t, TI, TI + 0.4) * 0.8;
      p.pose(i % 3 === 0 ? track([[0, REST], [TI - 0.7, REST], [TI - 0.3, shield]], t) : REST, R, { hx: -0.6, hy: -0.1, lift: t > TI && t < TI + 0.25 ? -0.04 : 0 });
      p.root.position.z = [5.5, 3.8, 5.9, 4.1, 5.6, 3.6, 5.4, 4.0, 2.4][i] + back;
    });
    cam.position.set(0, 1.4, 13); cam.lookAt(0, lerp(40, 28, ramp(t, TI - 2, TI)), -200);
    shake(cam, t, 0.5 + 1.2 * ramp(t, TI - 1.5, TI) + (t > TI ? 7 * Math.exp(-(t - TI) * 2.5) : 0));
  } };
} });

// B1 (9.4~11.7) 정면: 착지 지점에서 솟는 거대한 투명 파도, 속에 상품들
SHOTS.push({ name: 'B1_wave', dur: 2.3, build() {
  const s = seaWorld({ shadowAt: [0, 0, 2], parasolN: 100, pz0: 0, px0: -50, px1: 50, gap: 14, marine: false });
  const ppl = crowd(s, [[-9, 2], [-6.6, 0], [-4.2, 2], [-1.8, 0], [0.6, 2], [3, 0], [5.4, 2], [7.8, 0], [-3, 4.5, 0.75]]);
  const WV = bigWave(1100, 170); s.add(WV);
  const cam = new THREE.PerspectiveCamera(60, W / H, 0.1, 4000);
  return { s, cam, update(t0) {
    const t = t0 + 0.2; s.userData.seaTick(t); WV.userData.tick(t);
    const k = smooth(t / 4.6);
    WV.position.set(0, -30 + 30 * ramp(t, 0, 1.0), lerp(-260, -95, k)); WV.scale.set(1, lerp(0.75, 1.15, k), 1);
    ppl.forEach((p, i) => p.pose(i % 4 === 1 ? { rx: -1.2, sz: -0.3, ex: -1.6 } : REST, i % 3 === 0 ? { rx: -2.4, sz: 0.3 } : REST, { hx: -0.35 }));
    cam.position.set(0, lerp(1.7, 1.9, k), lerp(14, 4, k)); cam.lookAt(0, lerp(40, 80, k), -200); shake(cam, t, 0.5);
  } };
} });

// B2 (11.7~13.5) 옆에서 본 쓰나미
SHOTS.push({ name: 'B2_side', dur: 1.8, build() {
  const s = seaWorld({ fogNear: 250, fogFar: 2400, shadowAt: [20, 0, 8], shadow: 40, pz0: 34, marine: false });
  const spots = []; for (let i = 0; i < 18; i++) spots.push([10 + i * 3.6, 4 + (i % 3) * 2]);
  const ppl = crowd(s, spots);
  const WV = bigWave(1400, 150); s.add(WV);
  const cam = new THREE.PerspectiveCamera(62, W / H, 0.5, 5000);
  return { s, cam, update(t0) {
    const t = t0 + 0.3; s.userData.seaTick(t); WV.userData.tick(t);
    WV.position.set(0, 0, lerp(-150, -95, t / 2.6));
    ppl.forEach((p, i) => p.pose(REST, { rx: -2.6, sz: 0.3 }, { hx: -0.4, lift: Math.abs(Math.sin(t * 5 + i)) * 0.05 }));
    cam.position.set(-30 + t * 1.5, 3, 30); cam.lookAt(60, 45, -70); shake(cam, t, 0.8);
  } };
} });

// B3 (13.5~16.8) 상품들이 사람들 바로 앞 모래에 쾅쾅 꽂힘 → 환호
SHOTS.push({ name: 'B3_crash', dur: 3.3, build() {
  const s = seaWorld({ fogNear: 80, fogFar: 1100, shadowAt: [0, 0, 0], shadow: 14, parasolN: 50, pz0: 0, px0: -30, px1: 30, gap: 12, marine: false });
  const ppl = crowd(s, [[-3.2, 5], [-1.6, 5.4, 0.88], [0, 5], [1.6, 5.3], [3.2, 5]]);
  const b = cyl(0.32, 0.22, 0.16, mat('#d9302c', { roughness: 0.4 })); b.position.set(0, 2.05, 0); ppl[1].body.add(b);
  reseed(41);
  const items = []; for (let i = 0; i < 38; i++) { const p = product(PROD[i % PROD.length]); p.scale.multiplyScalar(2.2); const x = -7 + rnd() * 14, z = 3 - rnd() * 9;
    p.userData = { dst: new THREE.Vector3(x, 0.15, z), src: new THREE.Vector3(x + (rnd() - 0.5) * 10, 40 + rnd() * 40, z - 30 - rnd() * 20), t0: 0.2 + rnd() * 1.6, tilt: [(rnd() - 0.5) * 1.0, rnd() * 6, (rnd() - 0.5) * 0.8], spin: [rnd() * 8, rnd() * 8] };
    s.add(p); items.push(p); }
  const puffs = items.map(() => { const sp = sprite(WHITE, 1, 0xe8d6ad, 0, false); s.add(sp); return sp; });
  const foam = mesh(new THREE.PlaneGeometry(300, 30), new THREE.MeshStandardMaterial({ color: '#f4fbfb', transparent: true, opacity: 0.9 })); foam.rotation.x = -Math.PI / 2; s.add(foam);
  const cam = new THREE.PerspectiveCamera(60, W / H, 0.1, 3000);
  return { s, cam, update(t0) {
    const t = t0 + 0.3; s.userData.seaTick(t);
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

// C1 (16.8~20.8) 호텔·마린시티보다 훨씬 큰 초거대 택이가 앞바다에 우뚝 → 1.7초에 윙크 (= 최종 18.5초)
const TS = 165, TPOS = new THREE.Vector3(-20, -6, -520);
function waterOnTaki(s, T, n = 220) {
  // 몸을 타고 흘러내리는 물줄기 + 발목의 하얀 물거품
  const drops = []; for (let i = 0; i < n; i++) { const sp = sprite(WHITE, 6, 0xffffff, 0.5, false); sp.userData = { a: rnd() * Math.PI * 2, h: 0.3 + rnd() * 1.4, p: rnd() }; s.add(sp); drops.push(sp); }
  const foam = []; for (const sd of [-1, 1]) { const r = new THREE.Mesh(new THREE.RingGeometry(0.5, 1, 48), new THREE.MeshStandardMaterial({ color: '#f6fbfb', transparent: true, opacity: 0.85, side: THREE.DoubleSide })); r.rotation.x = -Math.PI / 2; s.add(r); foam.push([r, sd]); }
  return t => {
    drops.forEach(sp => { const d = sp.userData, y = d.h - ((t * 0.18 + d.p) % 1) * d.h, rr = takiR(Math.max(0.17, y)) + 0.02;
      sp.position.set(T.position.x + Math.cos(d.a) * rr * TS, T.position.y + y * TS, T.position.z + Math.sin(d.a) * rr * ZS * TS); sp.material.opacity = 0.55 * Math.min(1, y * 3); });
    foam.forEach(([r, sd], i) => { r.position.set(T.position.x + sd * 0.36 * TS, 0.4, T.position.z + 0.06 * TS); r.scale.setScalar(0.32 * TS * (1 + 0.06 * Math.sin(t * 3 + i))); });
  };
}
SHOTS.push({ name: 'C1_taki', dur: 4.0, build() {
  const s = seaWorld({ top: '#6aa7e4', bot: '#f6e7cf', fogNear: 400, fogFar: 3200, shadowAt: [0, 0, 6], parasolN: 100, pz0: 0, px0: -40, px1: 40, gap: 14 });
  const T = taki(); T.scale.setScalar(TS); T.position.copy(TPOS); s.add(T);
  const fill = new THREE.DirectionalLight(0xfff4e6, 1.6); fill.position.set(200, 300, 600); s.add(fill);
  const water = waterOnTaki(s, T);
  const ppl = crowd(s, [[-6.5, 4.5], [-4.8, 5.6], [-3.1, 4.3], [-1.4, 5.4], [0.3, 4.4, 0.75], [2, 5.5], [3.7, 4.2], [5.4, 5.3], [7.1, 4.6]]);
  reseed(77); for (let i = 0; i < 18; i++) { const p = product(PROD[i % PROD.length]); p.position.set(-9 + rnd() * 18, 0.3, -1 - rnd() * 5); p.rotation.set((rnd() - 0.5) * 0.8, rnd() * 6, (rnd() - 0.5) * 0.6); s.add(p); }
  const cam = new THREE.PerspectiveCamera(60, W / H, 0.1, 6000);
  return { s, cam, update(t) {
    s.userData.seaTick(t); water(t);
    // 0~1.5 군중을 내려다봄 → 1.7 윙크 → 2.4~ 손 흔들기
    T.position.y = TPOS.y + Math.sin(t * 1.1) * 0.6; T.rig.rotation.set(0.14 + 0.04 * Math.sin(t * 0.9), 0.12 - 0.1 * ramp(t, 0, 1.5), Math.sin(t * 0.8) * 0.02);
    const w = t > 1.7 && t < 2.4 ? Math.sin((t - 1.7) / 0.7 * Math.PI) : 0; T.wink(Math.min(1, w * 1.4));
    T.arm(-1, 0.12); T.arm(1, 0.12 + 0.55 * ramp(t, 2.3, 2.8), t > 2.8 ? Math.sin((t - 2.8) * 6) * 0.25 : 0);
    ppl.forEach((p, i) => p.pose(t > 2.0 && i % 2 ? { rx: -2.8, sz: 0.4 } : REST, t > 2.2 && i % 3 === 0 ? { rx: -2.9, sz: 0.5 } : REST, { hx: -0.65, lift: t > 2.0 ? Math.abs(Math.sin((t - 2.0) * 6 + i)) * 0.12 : 0 }));
    const k = smooth(t / 4.0);
    cam.position.set(6, 0.9, 13); cam.lookAt(-10, lerp(70, 130, k), -300); shake(cam, t, 0.3);
  } };
} });

// C2 (20.8~29.5) 항공샷: 택이 머리 바로 위·뒤에서 시작 → 택이가 고개를 들어 카메라 보며 손 흔듦 → 상품으로 뒤덮인 해운대 전체로 상승
SHOTS.push({ name: 'C2_aerial', dur: 8.7, build() {
  const s = seaWorld({ fogNear: 900, fogFar: 3200, shadowAt: [0, 0, 30], shadow: 400, parasols: false, deep: true, marine: false });
  const fill = new THREE.DirectionalLight(0xfff4e6, 1.2); fill.position.set(0, 600, -900); s.add(fill);
  reseed(99);
  // 해변을 뒤덮은 상품들 + 사람들
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
  const kinds = [['tv', [1.64, 0.94, 0.05], '#16171a'], ['fridge', [0.9, 1.8, 0.72], '#c4c8cd'], ['fridge', [0.9, 1.8, 0.72], '#e7ddcc'], ['washer', [0.6, 0.85, 0.62], '#f2f2ef'], ['laptop', [0.6, 0.03, 0.45], '#c4c8cd'], ['aircon', [0.36, 1.75, 0.3], '#f2f2ef'], ['box', [0.8, 0.6, 0.6], '#c79a62']];
  const geo = new THREE.BoxGeometry(1, 1, 1);
  kinds.forEach(([_, sz, c]) => { const n = 900, im = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: c, roughness: 0.45 }), n);
    for (let i = 0; i < n; i++) { const x = -720 + rnd() * 1200, z = 3 + rnd() * 110, lay = rnd() < 0.45; e.set(lay ? 1.57 : (rnd() - 0.5) * 0.4, rnd() * 3, (rnd() - 0.5) * 0.4); q.setFromEuler(e); const sc = 1.3 + rnd() * 0.6;
      m4.compose(new THREE.Vector3(x, lay ? sz[2] * sc / 2 : sz[1] * sc / 2, z), q, new THREE.Vector3(sz[0] * sc, sz[1] * sc, sz[2] * sc)); im.setMatrixAt(i, m4); }
    im.castShadow = true; im.receiveShadow = true; s.add(im); });
  const pg = new THREE.CapsuleGeometry(0.28, 1.1, 4, 8);
  ['#e33', '#36c', '#fff', '#fc3', '#3a3', '#222', '#d36a8c', '#f08a24'].forEach(c => { const im = new THREE.InstancedMesh(pg, new THREE.MeshStandardMaterial({ color: c }), 260); for (let i = 0; i < 260; i++) { m4.compose(new THREE.Vector3(-720 + rnd() * 1200, 0.85, 4 + rnd() * 105), q.identity(), new THREE.Vector3(1, 1, 1)); im.setMatrixAt(i, m4); } s.add(im); });
  const T = taki(); T.scale.setScalar(TS); s.add(T);
  const TP = new THREE.Vector3(0, -6, -380); T.position.copy(TP);
  const water = waterOnTaki(s, T, 160);
  const cam = new THREE.PerspectiveCamera(58, W / H, 1, 8000);
  return { s, cam, update(t) {
    s.userData.seaTick(t); water(t);
    T.position.y = TP.y + Math.sin(t * 1.1) * 0.6;
    // 처음엔 해변을 바라봄(카메라는 등 뒤 위) → 1.2~3.2 몸을 돌려 고개를 들고 카메라를 봄 → 손 흔들기
    const turn = ramp(t, 1.2, 3.2);
    T.rotation.y = lerp(0.25, -Math.PI + 0.55, turn); T.rig.rotation.x = lerp(0.1, -0.55, ramp(t, 1.8, 3.4));
    T.arm(1, lerp(0.12, 0.75, ramp(t, 2.8, 3.4)), t > 3.4 ? Math.sin((t - 3.4) * 5.5) * 0.3 : 0); T.arm(-1, 0.15 + 0.1 * turn);
    T.wink(t > 5.2 && t < 5.7 ? Math.sin((t - 5.2) / 0.5 * Math.PI) : 0, false);
    // 카메라: 택이 머리 바로 위·뒤 → 상승하며 뒤로 빠지고 해변 전체가 보임 (택이는 화면 오른쪽 아래 유지)
    const k = smooth(t / 8.7), k2 = smooth(clamp(t / 6));
    cam.position.set(lerp(600, 800, k), lerp(1000, 1500, k), lerp(-800, -1100, k));
    cam.lookAt(lerp(-150, -200, k2), 0, lerp(80, 100, k2)); shake(cam, t, 0.15);
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
