// A안 「얼마나 크냐면」 러프 3D 프리비즈
// AI 영상 모델(Seedance Omni Reference)에 참고 영상으로 넣어 카메라·구도·동작·타이밍을 지정하는 용도
import * as THREE from 'three';

const W = 720, H = 1280;
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(W, H); renderer.setPixelRatio(1);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
document.body.appendChild(renderer.domElement);

// ---------- 유틸
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = t => { t = clamp(t); return t * t * (3 - 2 * t); };
const lerp = (a, b, k) => a + (b - a) * k;
const ramp = (t, a, b) => smooth((t - a) / (b - a));
const wob = (t, s) => Math.sin(t * 1.7 + s) * 0.6 + Math.sin(t * 3.1 + s * 2.3) * 0.3 + Math.sin(t * 7.3 + s * 5.1) * 0.1;
const M = {};
const mat = (c, o = {}) => { const k = c + JSON.stringify(o); return M[k] || (M[k] = new THREE.MeshStandardMaterial({ color: c, roughness: 0.75, ...o })); };
const mesh = (g, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; return o; };
const box = (w, h, d, m, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z);
const cap = (r, l, m, x, y, z) => mesh(new THREE.CapsuleGeometry(r, l, 6, 14), m, x, y, z);
const sph = (r, m, x, y, z) => mesh(new THREE.SphereGeometry(r, 24, 16), m, x, y, z);
const cyl = (r1, r2, h, m, x, y, z) => mesh(new THREE.CylinderGeometry(r1, r2, h, 20), m, x, y, z);

function canvasTex(w, h, draw, rep = [1, 1]) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); t.anisotropy = 4; return t;
}
const skyTex = (top, bot) => canvasTex(4, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
const windowTex = (wall = '#eceae4', win = '#7f93a6', cols = 4, rows = 8) => canvasTex(256, 512, (g, w, h) => {
  g.fillStyle = wall; g.fillRect(0, 0, w, h);
  const cw = w / cols, rh = h / rows;
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    g.fillStyle = win; g.fillRect(i * cw + cw * 0.15, j * rh + rh * 0.25, cw * 0.7, rh * 0.5);
    g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(i * cw + cw * 0.12, j * rh + rh * 0.76, cw * 0.76, rh * 0.05);
  }
});

function world(top = '#7fb2e5', bot = '#dfeaf3', fog = 0xdfe8f0, fogNear = 25, fogFar = 160) {
  const s = new THREE.Scene(); s.background = skyTex(top, bot); s.fog = new THREE.Fog(fog, fogNear, fogFar);
  s.add(new THREE.HemisphereLight(0xdfefff, 0x8a7f70, 1.25));
  const sun = new THREE.DirectionalLight(0xfff3e0, 2.6); sun.position.set(6, 10, 7); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 40 }); sun.shadow.bias = -0.0005; sun.shadow.normalBias = 0.03;
  s.add(sun); return s;
}
const ground = (s, c, size = 400) => { const g = mesh(new THREE.PlaneGeometry(size, size), mat(c)); g.rotation.x = -Math.PI / 2; s.add(g); return g; };
function apartment(s, x, z, w, h, d = 12, ry = 0) {
  const t = windowTex(); t.repeat.set(w / 8, h / 9);
  const m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.85 });
  const b = box(w, h, d, m, x, h / 2, z); b.rotation.y = ry; s.add(b);
  s.add(box(w + 0.6, 1.2, d + 0.6, mat('#d9d6cf'), x, h + 0.6, z));
  return b;
}
function tree(s, x, z, h = 5) { s.add(cyl(0.15, 0.22, h * 0.45, mat('#6b5040'), x, h * 0.22, z)); s.add(sph(h * 0.3, mat('#4f7f3d'), x, h * 0.62, z)); }

// ---------- 마네킹 (인물 블로킹용)
function person(o = {}) {
  const sc = o.scale ?? 1, g = o.girth ?? 1, ag = o.arm ?? 1;
  const skin = mat(o.skin ?? '#d8a888'), shirt = mat(o.shirt ?? '#888'), pants = mat(o.pants ?? '#334'), hair = mat(o.hair ?? '#1b1714');
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  for (const sd of [-1, 1]) { body.add(cap(0.075 * g, 0.62, pants, sd * 0.1 * g, 0.47, 0)); body.add(box(0.12 * g, 0.07, 0.24, mat('#2a2a2a'), sd * 0.1 * g, 0.04, 0.04)); }
  const torso = cap(0.17 * g, 0.36, shirt, 0, 1.2, 0); torso.scale.set(1, 1, 0.72); body.add(torso);
  body.add(cyl(0.05, 0.055, 0.1, skin, 0, 1.52, 0));
  const head = new THREE.Group(); head.position.set(0, 1.64, 0); body.add(head);
  head.add(sph(0.115, skin, 0, 0, 0));
  const hm = new THREE.Mesh(new THREE.SphereGeometry(0.122, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), hair); hm.rotation.x = -0.25; hm.position.y = 0.01; head.add(hm);
  for (const sd of [-1, 1]) head.add(sph(0.016, mat('#111'), sd * 0.04, 0.015, 0.105));
  head.add(box(0.05, 0.012, 0.01, mat('#a0524a'), 0, -0.05, 0.108));
  const arms = {};
  for (const sd of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(sd * (0.17 * g + 0.05), 1.42, 0); body.add(sh);
    sh.add(cap(0.05 * ag, 0.2, o.sleeve === 'none' ? skin : shirt, 0, -0.15, 0));
    const el = new THREE.Group(); el.position.y = -0.3; sh.add(el);
    el.add(cap(0.043 * ag, 0.19, o.sleeve === 'long' ? shirt : skin, 0, -0.13, 0));
    el.add(sph(0.05, skin, 0, -0.29, 0));
    arms[sd] = { sh, el };
  }
  const extra = new THREE.Group(); body.add(extra);
  if (o.glasses) for (const sd of [-1, 1]) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.006, 8, 20), mat('#111')); r.position.set(sd * 0.042, 1.655, 0.11); extra.add(r); }
  if (o.cap) { extra.add(cyl(0.125, 0.125, 0.07, mat(o.cap), 0, 1.73, 0)); const b = box(0.2, 0.012, 0.12, mat(o.cap), 0, 1.7, 0.12); extra.add(b); }
  if (o.apron) { const a = box(0.3 * g, 0.5, 0.02, mat(o.apron), 0, 1.05, 0.13 * g); extra.add(a); }
  if (o.vest) { const v = cap(0.18 * g, 0.3, mat(o.vest), 0, 1.22, 0); v.scale.set(1.04, 1, 0.78); extra.add(v); }
  if (o.backpack) { extra.add(box(0.3, 0.36, 0.14, mat(o.backpack), 0, 1.18, -0.17)); for (const sd of [-1, 1]) extra.add(box(0.04, 0.4, 0.02, mat(o.backpack), sd * 0.1, 1.25, 0.12)); }
  if (o.perm) { for (let i = 0; i < 26; i++) { const a = i / 26 * Math.PI * 2, r = 0.11; extra.add(sph(0.04, mat('#b9b5b0'), Math.cos(a) * r, 1.7 + Math.sin(i * 2.1) * 0.03, Math.sin(a) * r * 0.9)); } }
  root.scale.setScalar(sc);
  const P = { root, body, head, arms, headY: 1.64 * sc };
  // 포즈: side 별로 rx(앞으로 들기), sz(옆으로 벌리기), ex/ez(팔꿈치)
  P.pose = (L, R, extraP = {}) => {
    for (const [sd, p] of [[-1, L], [1, R]]) {
      const a = arms[sd]; a.sh.rotation.set(p.rx ?? 0, 0, sd * (p.sz ?? 0.08)); a.el.rotation.set(p.ex ?? -0.15, 0, sd * (p.ez ?? 0));
    }
    body.rotation.y = extraP.ry ?? 0; body.position.y = extraP.lift ?? 0;
    head.rotation.set(extraP.hx ?? 0, extraP.hy ?? 0, extraP.hz ?? 0);
  };
  return P;
}
const REST = { rx: 0.05, sz: 0.1, ex: -0.15 };
const mixPose = (a, b, k) => { const o = {}; for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) o[key] = lerp(a[key] ?? REST[key] ?? 0, b[key] ?? REST[key] ?? 0, k); return o; };
// keys: [[t, pose], ...] → 부드럽게 보간
function track(keys, t) {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) { const [t0, p0] = keys[i], [t1, p1] = keys[i + 1]; if (t <= t1) return mixPose(p0, p1, smooth((t - t0) / (t1 - t0))); }
  return keys.at(-1)[1];
}

// 인터뷰어의 손 + 초록 마이크 (화면 오른쪽에서 들어옴)
function micHand(s) {
  const g = new THREE.Group(), dx = 0.447, dy = -0.894, rz = Math.atan2(dx, -dy);
  g.add(sph(0.042, mat('#555', { roughness: 0.9 }), 0, 0, 0));
  const m = cyl(0.024, 0.018, 0.2, mat('#16c45a', { roughness: 0.4 }), dx * 0.12, dy * 0.12, 0); m.rotation.z = rz; g.add(m);
  g.add(sph(0.05, mat('#e0b090'), dx * 0.2, dy * 0.2, 0));
  const arm = cap(0.045, 0.5, mat('#e0b090'), dx * 0.5, dy * 0.5, 0); arm.rotation.z = rz; g.add(arm);
  s.add(g); return g;
}
function placeMic(g, P, t, dz = 0.3, dy = -0.16, enter = [0, 0.5]) {
  const k = ramp(t, enter[0], enter[1]);
  g.position.set(lerp(0.75, 0.2, k) + wob(t, 9) * 0.008, P.headY + dy - (1 - k) * 0.35 + wob(t, 3) * 0.006, dz);
}

function shake(cam, t, amt = 1) {
  cam.position.x += wob(t, 1) * 0.012 * amt; cam.position.y += wob(t, 2) * 0.01 * amt;
  cam.rotation.z += wob(t, 4) * 0.006 * amt;
}
function lookCam(cam, pos, at, t, amt = 1) {
  cam.position.set(...pos); cam.lookAt(...at); shake(cam, t, amt);
}

// ---------- 컷 정의
const SHOTS = [];

// 컷 0: 대학생 "요만큼?" — 손가락으로 아주 작게
SHOTS.push({ name: 'shot0_student', dur: 4, build() {
  const s = world('#8dbbe8', '#e4edf3'); ground(s, '#b9b4ab');
  for (let i = -3; i <= 3; i++) s.add(box(9, 14 + (i % 2) * 4, 8, mat(i % 2 ? '#b98f6f' : '#cdbfa8'), i * 10, 7, -26));
  for (let i = -4; i <= 4; i++) tree(s, i * 4 + 1, -9, 4.5);
  const bg = []; for (let i = 0; i < 6; i++) { const p = person({ shirt: ['#3a4a6a', '#a33', '#ddd', '#596', '#222', '#c96'][i], scale: 0.95 }); p.root.position.set(-6 + i * 2.4, 0, -6 - (i % 3) * 2); s.add(p.root); bg.push(p); }
  const P = person({ shirt: '#8a8d92', pants: '#2d3b55', glasses: true, sleeve: 'long' }); s.add(P.root);
  const mic = micHand(s);
  const cam = new THREE.PerspectiveCamera(40, W / H, 0.05, 400);
  return { s, cam, update(t) {
    bg.forEach((p, i) => { p.root.position.x = -6 + i * 2.4 + t * (i % 2 ? 0.7 : -0.6); p.pose(REST, REST); });
    const L = track([[0, REST], [0.55, REST], [1.1, { rx: -1.0, sz: -0.35, ex: -1.75 }], [3.3, { rx: -1.0, sz: -0.35, ex: -1.8 }], [3.9, { rx: -0.6, sz: -0.1, ex: -1.2 }]], t);
    P.pose(L, REST, { hz: ramp(t, 0.6, 1.2) * 0.12, hx: 0.05 });
    placeMic(mic, P, t);
    lookCam(cam, [0.05, 1.5, 1.45], [0, 1.4, 0], t);
  } };
} });

// 컷 1: 시장 아주머니 "이만큼!" — 두 손을 어깨너비로
SHOTS.push({ name: 'shot1_market', dur: 4, build() {
  const s = world('#9cc4e6', '#efe9dd', 0xeee6d8, 15, 90); ground(s, '#8f8a82');
  const stall = box(3.2, 0.9, 1.2, mat('#7a5a3a'), 0, 0.45, -1.5); s.add(stall);
  for (let i = 0; i < 70; i++) { const x = -1.45 + (i % 14) * 0.21, row = Math.floor(i / 14); s.add(sph(0.07, mat(i % 3 ? '#e6802a' : '#c7262e', { roughness: 0.5 }), x, 0.95 + (row % 2) * 0.05, -1.95 + row * 0.2)); }
  const aw = canvasTex(64, 8, (g, w, h) => { for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? '#2d7d4a' : '#f2efe6'; g.fillRect(i * 8, 0, 8, h); } }, [6, 1]);
  const awn = box(3.6, 0.05, 1.8, new THREE.MeshStandardMaterial({ map: aw }), 0, 2.45, -1.4); awn.rotation.x = 0.15; s.add(awn);
  for (let i = 1; i <= 4; i++) for (const sd of [-1, 1]) { s.add(box(3, 2.6, 1.2, mat(['#6d5a48', '#8c7b63', '#5a6a5a'][i % 3]), sd * 3.4, 1.3, -1.5 - i * 3.2)); s.add(box(3.2, 0.05, 1.6, mat(i % 2 ? '#c44' : '#36a'), sd * 3.4, 2.7, -1.3 - i * 3.2)); }
  const P = person({ shirt: '#c7a98e', pants: '#4a3f3a', apron: '#e58fb0', girth: 1.15, scale: 0.93, hair: '#2b1d16' }); s.add(P.root);
  const mic = micHand(s);
  const cam = new THREE.PerspectiveCamera(46, W / H, 0.05, 300);
  return { s, cam, update(t) {
    const open = { rx: -0.55, sz: 0.95, ex: -0.95 };
    const k = [[0, REST], [0.6, REST], [1.05, open], [3.4, open], [3.9, { rx: -0.8, sz: 0.35, ex: -0.6 }]];
    P.pose(track(k, t), track(k, t), { lift: Math.max(0, Math.sin(t * 9)) * 0.012 * ramp(t, 1, 1.3), hx: -0.05 });
    placeMic(mic, P, t, 0.45);
    lookCam(cam, [0.0, 1.45, 2.2], [0, 1.25, 0], t);
  } };
} });

// 컷 2: 근육남 "이이이만큼!!" — 팔을 최대한 넓게 → 알통
SHOTS.push({ name: 'shot2_gym', dur: 4, build() {
  const s = world('#7fb0e0', '#dde8f1'); ground(s, '#a9a69f');
  s.add(box(14, 6, 1, mat('#2b2f36'), 0, 3, -3));
  s.add(box(2.4, 2.6, 0.1, new THREE.MeshStandardMaterial({ color: '#7fa5c4', roughness: 0.1, metalness: 0.3 }), 0, 1.3, -2.45));
  for (const sd of [-1, 1]) s.add(box(2.2, 1.6, 0.1, new THREE.MeshStandardMaterial({ color: '#6c8aa6', roughness: 0.1 }), sd * 3.2, 1.8, -2.45));
  s.add(box(30, 0.15, 3, mat('#8f8c86'), 0, 0.075, 1.2));
  for (let i = -3; i <= 3; i++) s.add(box(8, 20, 8, mat('#c8c4bb'), i * 10, 10, -20));
  const P = person({ shirt: '#141414', pants: '#3b3f46', girth: 1.5, arm: 1.6, sleeve: 'none', scale: 1.03 }); s.add(P.root);
  const mic = micHand(s);
  const cam = new THREE.PerspectiveCamera(52, W / H, 0.05, 300);
  return { s, cam, update(t) {
    const wide = { rx: 0, sz: 1.5, ex: 0, ez: 0 }, flex = { rx: 0, sz: 1.45, ex: 0, ez: 1.65 };
    const k = [[0, REST], [0.5, REST], [0.95, wide], [1.8, wide], [2.2, flex], [3.9, flex]];
    P.pose(track(k, t), track(k, t), { hx: -0.1 + ramp(t, 0.9, 1.1) * -0.05 });
    placeMic(mic, P, t, 0.38, -0.12);
    lookCam(cam, [0, 1.15, 3.3], [0, 1.3, 0], t, 1.2);
  } };
} });

// 컷 3: 택배기사 "이 트럭만큼." — 엄지로 뒤 트럭을 가리킴
SHOTS.push({ name: 'shot3_truck', dur: 4, build() {
  const s = world('#8ab9e6', '#e3ecf2'); ground(s, '#7e7e80');
  const truck = new THREE.Group(); truck.position.set(-1.1, 0, -4.2); truck.rotation.y = 0.5; s.add(truck);
  truck.add(box(1.7, 1.6, 1.7, mat('#f1f1ee'), 0, 1.15, 1.6));
  truck.add(box(1.6, 0.7, 0.05, new THREE.MeshStandardMaterial({ color: '#5d7387', roughness: 0.15 }), 0, 1.5, 2.46));
  truck.add(box(1.9, 2.1, 3.6, mat('#f6f6f3'), 0, 1.4, -1.1));
  for (const [x, z] of [[-0.85, 1.5], [0.85, 1.5], [-0.85, -1.9], [0.85, -1.9]]) { const w = cyl(0.36, 0.36, 0.25, mat('#1a1a1a'), x, 0.36, z); w.rotation.z = Math.PI / 2; truck.add(w); }
  for (let i = -3; i <= 3; i++) s.add(box(6, 6 + (i % 2) * 3, 6, mat(['#cbb79c', '#a9b3bb', '#d6cfc2'][(i + 3) % 3]), i * 7, 3.5, -14));
  const P = person({ shirt: '#1f2a44', pants: '#1f2a44', cap: '#1f2a44', sleeve: 'long' }); s.add(P.root);
  const mic = micHand(s);
  const cam = new THREE.PerspectiveCamera(46, W / H, 0.05, 300);
  return { s, cam, update(t) {
    const point = { rx: -0.55, sz: 0.35, ex: -2.45 };
    const L = track([[0, REST], [0.6, REST], [1.1, point], [3.9, point]], t);
    P.pose(L, REST, { ry: -ramp(t, 0.5, 1.0) * 0.35, hy: ramp(t, 0.5, 0.9) * 0.15 - ramp(t, 1.4, 1.8) * 0.25 });
    placeMic(mic, P, t, 0.32);
    lookCam(cam, [0.35, 1.5, 2.3], [-0.35, 1.35, -0.5], t);
  } };
} });

// 컷 4: 할머니 "저 아파트만큼은 되겄지." — 뒤의 아파트를 가리킴
SHOTS.push({ name: 'shot4_apartment', dur: 4, build() {
  const s = world('#7fb0e2', '#e2ebf3', 0xe0e8f0, 40, 260); ground(s, '#a7a399');
  apartment(s, -14, -38, 22, 48); apartment(s, 16, -46, 22, 52);
  for (let i = -3; i <= 3; i++) tree(s, i * 3.2 + 0.5, -7, 4);
  const P = person({ shirt: '#d8d0c0', pants: '#5a5560', vest: '#6b4f9e', scale: 0.88, girth: 1.05, hair: '#b9b5b0', perm: true, skin: '#cf9f80' }); s.add(P.root);
  const mic = micHand(s);
  const cam = new THREE.PerspectiveCamera(48, W / H, 0.05, 400);
  return { s, cam, update(t) {
    const up = { rx: -2.75, sz: 0.25, ex: -0.1 };
    const L = track([[0, REST], [0.5, REST], [1.5, up], [3.9, up]], t);
    P.pose(L, REST, { ry: ramp(t, 0.5, 1.3) * 0.35, hx: -ramp(t, 0.8, 1.6) * 0.35 });
    placeMic(mic, P, t, 0.3);
    lookCam(cam, [0.1, 1.3, 2.0], [-0.1, 1.45, 0], t);
  } };
} });

// 컷 5: 초등학생 "우주만큼!!!" — 점프하며 두 팔을 하늘로 → 카메라가 하늘로 틸트업
SHOTS.push({ name: 'shot5_playground', dur: 4, build() {
  const s = world('#5f9fe0', '#d8e8f5', 0xdbe7f2, 40, 300); ground(s, '#d6c39b');
  const slide = new THREE.Group(); slide.position.set(-2.5, 0, -4); s.add(slide);
  slide.add(box(1.2, 1.8, 1.2, mat('#e04a3a'), 0, 0.9, 0)); const sl = box(0.6, 0.06, 2.6, mat('#f2c230'), 0, 1.0, 1.6); sl.rotation.x = 0.6; slide.add(sl);
  for (const x of [1.5, 4]) { const p = cyl(0.05, 0.05, 2.4, mat('#3a7bd5'), x, 1.2, -5); s.add(p); }
  s.add(cyl(0.05, 0.05, 2.6, mat('#3a7bd5'), 2.75, 2.4, -5).rotateZ(Math.PI / 2));
  apartment(s, -22, -55, 22, 50); apartment(s, 20, -60, 22, 55);
  const P = person({ shirt: '#3a7bd5', pants: '#2b2b33', backpack: '#f2c230', scale: 0.74, girth: 0.95, skin: '#e2b494' }); s.add(P.root);
  const mic = micHand(s);
  const cam = new THREE.PerspectiveCamera(54, W / H, 0.05, 400);
  return { s, cam, update(t) {
    const up = { rx: -3.0, sz: 0.3, ex: -0.05 };
    const k = [[0, REST], [0.55, { rx: -0.3, sz: 0.3, ex: -0.8 }], [0.85, up], [3.9, up]];
    const jump = t > 0.8 && t < 1.45 ? Math.sin((t - 0.8) / 0.65 * Math.PI) * 0.3 : (t > 0.5 && t < 0.8 ? -0.06 * Math.sin((t - 0.5) / 0.3 * Math.PI) : 0);
    P.pose(track(k, t), track(k, t), { lift: jump / 0.74, hx: -0.3 * ramp(t, 0.8, 1.0) });
    placeMic(mic, P, t, 0.3, 0.05);
    const tilt = ramp(t, 1.9, 3.6);
    lookCam(cam, [0, lerp(0.75, 0.9, tilt), 1.9], [0, lerp(1.0, 30, tilt), lerp(0, -30, tilt)], t, 1.4);
  } };
} });

// 컷 6: 아파트 뒤에서 해처럼 떠오르는 거대한 택이 → 윙크
function taki() {
  const g = new THREE.Group();
  const green = new THREE.MeshPhysicalMaterial({ color: '#3fbf3a', roughness: 0.28, clearcoat: 0.8, clearcoatRoughness: 0.2 });
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), green); body.scale.set(1, 0.95, 0.88); g.add(body);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.9, 40, 24), green); belly.position.set(0, -0.45, 0.05); belly.scale.set(1.05, 0.75, 0.95); g.add(belly);
  const horn = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.32, 20), green); horn.position.set(0.05, 1.0, 0.05); horn.rotation.z = -0.2; g.add(horn);
  const eyes = [];
  for (const sd of [-1, 1]) {
    const e = new THREE.Group(); e.position.set(sd * 0.27, 0.42, 0.72); g.add(e);
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 20), new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.2, clearcoat: 1 })); w.scale.set(0.85, 1.05, 0.55); e.add(w);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 16), new THREE.MeshStandardMaterial({ color: '#111', roughness: 0.3 })); p.position.set(0, -0.04, 0.1); e.add(p);
    eyes.push(e);
  }
  const purple = new THREE.MeshPhysicalMaterial({ color: '#7b4fd6', roughness: 0.4, clearcoat: 0.5 });
  const pouch = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 24), purple); pouch.position.set(0.05, -0.42, 0.72); pouch.scale.set(0.55, 0.3, 0.32); g.add(pouch);
  const strap = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.05, 12, 64), purple); strap.position.y = -0.35; strap.rotation.x = Math.PI / 2 + 0.12; strap.scale.set(1.02, 0.92, 1); g.add(strap);
  for (const sd of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 14), new THREE.MeshStandardMaterial({ color: '#fff' })); w.position.set(0.05 + sd * 0.12, -0.36, 1.0); w.scale.z = 0.5; g.add(w);
    const p = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 10), new THREE.MeshStandardMaterial({ color: '#111' })); p.position.set(0.05 + sd * 0.12, -0.37, 1.04); g.add(p);
  }
  for (const sd of [-1, 1]) { const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.35, 8, 16), green); a.position.set(sd * 0.92, -0.2, 0.25); a.rotation.z = sd * 0.9; g.add(a); }
  g.eyes = eyes; return g;
}
SHOTS.push({ name: 'shot6_taki', dur: 6, build() {
  const s = world('#5d9ee2', '#dbe9f6', 0xdde9f4, 120, 900); ground(s, '#cdbb93', 1200);
  apartment(s, -38, -70, 26, 52); apartment(s, 36, -75, 26, 50); apartment(s, -70, -110, 26, 58); apartment(s, 72, -115, 26, 56);
  for (let i = 0; i < 6; i++) tree(s, -10 + i * 4, -18, 5);
  const ppl = []; for (let i = 0; i < 5; i++) { const p = person({ shirt: ['#d33', '#36c', '#eee', '#3a3', '#222'][i] }); p.root.position.set(-6 + i * 3, 0, -12 - (i % 2) * 3); s.add(p.root); ppl.push(p); }
  const T = taki(); T.scale.setScalar(55); s.add(T);
  const birds = []; for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.4, 3), mat('#333')); b.rotation.z = Math.PI / 2; s.add(b); birds.push(b); }
  const cam = new THREE.PerspectiveCamera(62, W / H, 0.5, 2000);
  return { s, cam, update(t) {
    const r = ramp(t, 0.5, 4.2);
    T.position.set(0, lerp(-50, 62, r) + Math.sin(t * 2) * 1.5 * r, -170);
    T.rotation.set(0.28 * r, Math.sin(t * 0.8) * 0.06, Math.sin(t * 1.3) * 0.03);
    const wink = t > 4.6 && t < 5.15 ? Math.sin((t - 4.6) / 0.55 * Math.PI) : 0;
    T.eyes[0].scale.y = 1 - 0.92 * wink;
    ppl.forEach((p, i) => p.pose(REST, i === 2 ? { rx: -2.6, sz: 0.2 } : REST, { hx: -0.5 * ramp(t, 1 + i * 0.3, 1.8 + i * 0.3), ry: Math.PI }));
    birds.forEach((b, i) => b.position.set(-30 + ((t * 6 + i * 9) % 60), 38 + i * 3 + Math.sin(t * 6 + i) * 0.5, -40 - i * 4));
    lookCam(cam, [0, 1.3, 6], [0, lerp(18, 34, r), -100], t, 0.6);
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
