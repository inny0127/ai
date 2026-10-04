// 프리비즈 공용 도구 (scene.js에서 분리)
import * as THREE from 'three';
export const W = 720, H = 1280;
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

export { clamp, smooth, lerp, ramp, wob, mat, mesh, box, cap, sph, cyl, canvasTex, skyTex, windowTex, world, ground, apartment, tree, person, REST, mixPose, track, micHand, placeMic, shake, lookCam, taki };
