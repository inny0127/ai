// ───────────── 3D 장면: 선물상자 82,944개 모자이크 ─────────────
// 하이브리드 렌더: 가까운/움직이는 상자는 진짜 3D 인스턴스, 바닥에 깔린 먼 상자는
// 같은 PBR 조명을 받는 셀 셰이더(임포스터)로 그린다 — GPU 없는 환경에서 8만 개를 그리기 위한 구조.
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as D from './design.js';

export const W = 1080, H = 1920;
export const T_LOD = 6.5;          // 이후 바닥 상자는 임포스터로
export const T3A = 11.4, T3B = 16.6; // 이 구간은 8만 개 전부 진짜 3D (저각 + 뚜껑 분수)
const BOW_MAX = 2600;              // 리본 매듭은 처음 상자들만 (매크로 구간)
const SETTLE = .3;
const BODY_H = .6, LID_H = .15, LID_Y = BODY_H - .02, TOP_Y = LID_Y + LID_H;

const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

// 단조 3차 보간 (카메라 키프레임용)
function monotone(keys) {
  const n = keys.length, xs = keys.map(k => k[0]), ys = keys.map(k => k[1]);
  const d = [], m = new Array(n).fill(0);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const tt = 3 / Math.sqrt(s); m[i] = tt * a * d[i]; m[i + 1] = tt * b * d[i]; }
  }
  return x => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}

export class Mosaic {
  constructor(canvas, data) {
    this.data = data;                       // {colA, colB, rib (Uint8 rgb), sch}
    const r = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    r.setPixelRatio(1); r.setSize(W, H, false);
    r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFShadowMap;
    r.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#cbbfa9');
    const pm = new THREE.PMREMGenerator(r);
    this.scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture;
    this.scene.environmentIntensity = .8;
    this.camera = new THREE.PerspectiveCamera(35, W / H, .05, 4000);
    this.uniforms = { uTime: { value: 0 }, uRattle: { value: 0 }, uRibMix: { value: 0 } };
    this._lights(); this._ground(); this._cameraPath(); this._boxes(); this._impostor(); this._post();
  }

  _lights() {
    const s = this.sun = new THREE.DirectionalLight('#fff0dc', 2.6);
    s.castShadow = true; s.shadow.mapSize.set(2048, 2048); s.shadow.bias = -.0004; s.shadow.normalBias = .02;
    this.scene.add(s, s.target);
    this.scene.add(new THREE.HemisphereLight('#fff8ee', '#b9a98c', .5));
  }

  _ground() {
    const { groundTex, detailTex } = this.data;
    const gt = new THREE.CanvasTexture(groundTex); gt.colorSpace = THREE.SRGBColorSpace; gt.anisotropy = 4;
    const dt = new THREE.CanvasTexture(detailTex); dt.wrapS = dt.wrapT = THREE.RepeatWrapping; dt.repeat.set(D.NX / 3, D.NY / 3);
    const inner = this.groundInner = new THREE.Mesh(new THREE.PlaneGeometry(D.NX, D.NY), new THREE.MeshStandardMaterial({ map: gt, bumpMap: dt, bumpScale: 1.2, roughness: .93 }));
    inner.rotation.x = -Math.PI / 2; inner.receiveShadow = true;
    const dt2 = dt.clone(); dt2.repeat.set(1600 / 3, 1600 / 3); dt2.needsUpdate = true;
    const outer = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), new THREE.MeshStandardMaterial({ color: '#d9cbb3', bumpMap: dt2, bumpScale: 1.2, roughness: .93 }));
    outer.rotation.x = -Math.PI / 2; outer.position.y = -.01; outer.receiveShadow = true;
    this.scene.add(inner, outer);
  }

  // 리본 줄무늬를 그리는 상자/뚜껑 재질
  _boxMaterial(kind) {
    const m = new THREE.MeshStandardMaterial({ roughness: .2, metalness: 0 });
    const full = kind === 'bodyFull';
    if (full) m.defines = { BODYFULL: '' };
    m.onBeforeCompile = sh => {
      sh.uniforms.uRibMix = this.uniforms.uRibMix; sh.uniforms.uTime = this.uniforms.uTime;
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nattribute vec3 aRib;\nvarying vec3 vRib;\nvarying vec3 vLoc;\nvarying vec3 vNl;\n#ifdef BODYFULL\nattribute float aPop; varying float vPop;\n#endif')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvRib = aRib; vLoc = position; vNl = normal;\n#ifdef BODYFULL\nvPop = aPop;\n#endif');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vRib;\nvarying vec3 vLoc;\nvarying vec3 vNl;\nuniform float uRibMix, uTime;\nfloat ribS, edgeS;\n#ifdef BODYFULL\nvarying float vPop;\n#endif')
        .replace('#include <color_fragment>', `#include <color_fragment>
          {
            float w = 0.068;
            vec2 q; bool top = vNl.y > .5, bot = vNl.y < -.5;
            if (top) q = vLoc.xz; else if (abs(vNl.z) > .5) q = vec2(vLoc.x, 9.); else q = vec2(vLoc.z, 9.);
            vec2 fw = fwidth(q) + 1e-4;
            float sx = 1. - smoothstep(w - fw.x, w + fw.x, abs(q.x));
            float sz = 1. - smoothstep(w - fw.y, w + fw.y, abs(q.y));
            ribS = max(sx, sz);
            ${kind === 'lid' ? 'if (bot) { diffuseColor.rgb = vec3(.62,.50,.34); ribS = 0.; }' : ''}
            float lumT = dot(diffuseColor.rgb, vec3(.2126, .7152, .0722));
            vec3 tone = lumT < .2 ? diffuseColor.rgb * 1.7 + .012 : diffuseColor.rgb * .9;
            bool opened = false;
            #ifdef BODYFULL
            opened = top && uTime >= vPop;
            #endif
            if (opened) {
              vec2 f = vLoc.xz; float e = max(abs(f.x), abs(f.y)); float fe = fwidth(e) + 1e-4;
              float inIn = 1. - smoothstep(.385 - fe, .385 + fe, e);
              float ao = mix(.72, 1., smoothstep(.385, .14, e));
              float wall = smoothstep(-.3, .25, -(f.x + f.y)) * smoothstep(.22, .385, e);
              vec3 inside = diffuseColor.rgb * ao * (1. - .22 * wall);
              diffuseColor.rgb = mix(mix(diffuseColor.rgb, vec3(1.), .45), inside, inIn);
              ribS = 0.;
            } else diffuseColor.rgb = mix(diffuseColor.rgb, mix(vRib, tone, uRibMix), ribS);
            ${kind !== 'lid' ? 'if (!top) diffuseColor.rgb *= mix(.5, 1., smoothstep(.0, .3, vLoc.y));' : ''}
            // 모서리 하이라이트 (둥근 모서리 흉내)
            vec3 hs = ${kind === 'lid' ? 'vec3(.465, .075, .465)' : 'vec3(.43, .3, .43)'};
            vec3 lc = vLoc - vec3(0., ${kind === 'lid' ? (LID_Y + LID_H / 2).toFixed(3) : (BODY_H / 2).toFixed(3)}, 0.);
            vec3 dd = hs - abs(lc);
            float mn = 1e3; if (abs(vNl.x) < .5) mn = min(mn, dd.x); if (abs(vNl.y) < .5) mn = min(mn, dd.y); if (abs(vNl.z) < .5) mn = min(mn, dd.z);
            edgeS = 1. - smoothstep(.0, .022, mn);
            diffuseColor.rgb += edgeS * .06;
          }`)
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = mix(mix(roughnessFactor, .16, ribS), .08, edgeS);');
    };
    return m;
  }

  _boxes() {
    const bodyG = new THREE.BoxGeometry(.86, BODY_H, .86); bodyG.translate(0, BODY_H / 2, 0);
    const lidG = new THREE.BoxGeometry(.93, LID_H, .93); lidG.translate(0, LID_Y + LID_H / 2, 0);
    const lidC = new THREE.BoxGeometry(.93, LID_H, .93);
    const loop = s => { const g = new THREE.TorusGeometry(.085, .026, 6, 16); g.scale(1.35, 1, 1); g.rotateZ(s * .55); g.translate(s * .11, TOP_Y + .07, 0); return g; };
    const knot = new THREE.SphereGeometry(.05, 10, 8); knot.scale(1, .8, 1); knot.translate(0, TOP_Y + .03, 0);
    const tail = s => { const g = new THREE.BoxGeometry(.05, .012, .17); g.rotateY(s * .5); g.translate(s * .07, TOP_Y + .006, .08); return g; };
    const bowG = mergeGeometries([loop(-1), loop(1), knot, tail(-1), tail(1)].map(g => g.toNonIndexed ? g.toNonIndexed() : g));
    const N = D.N, matB = this._boxMaterial('body'), matL = this._boxMaterial('lid');
    const matBow = new THREE.MeshStandardMaterial({ roughness: .18 });
    const mk = (geo, mat, n, rib = true) => {
      const g = geo.clone(); if (rib) g.setAttribute('aRib', new THREE.InstancedBufferAttribute(new Float32Array(n * 3), 3));
      const im = new THREE.InstancedMesh(g, mat, n); im.castShadow = im.receiveShadow = true; im.frustumCulled = false;
      im.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      im.setColorAt(0, new THREE.Color()); im.count = 0; this.scene.add(im); return im;
    };
    const SMAX = this._staticMax = this._countShownBy(T_LOD) + 50;
    this.sBody = mk(bodyG, matB, SMAX); this.sLid = mk(lidG, matL, SMAX); this.sBow = mk(bowG, matBow, Math.min(SMAX, BOW_MAX), false);
    const DMAX = 26000;
    this.dBody = mk(bodyG, matB, DMAX); this.dLid = mk(lidG, matL, DMAX); this.dBow = mk(bowG, matBow, BOW_MAX, false);
    this.fLid = mk(lidC, matL, 70000);
    this.fLid.castShadow = false;
    const matBF = this._boxMaterial('bodyFull');
    this.uBody = mk(bodyG, matBF, N); this.uBody.geometry.setAttribute('aPop', new THREE.InstancedBufferAttribute(new Float32Array(N), 1));
    this.uLid = mk(lidG, matL, N);
    for (const im of [this.uBody, this.uLid]) im.castShadow = im.receiveShadow = false;

    // 타일별 고정값
    const { sch } = this.data, R = D.rng(4242);
    this.lin = { A: new Float32Array(N * 3), B: new Float32Array(N * 3), R: new Float32Array(N * 3) };
    const c = new THREE.Color();
    for (let k = 0; k < N; k++) {
      for (const [key, src] of [['A', this.data.colA], ['B', this.data.colB], ['R', this.data.rib]]) {
        c.setRGB(src[k * 3] / 255, src[k * 3 + 1] / 255, src[k * 3 + 2] / 255, THREE.SRGBColorSpace);
        this.lin[key][k * 3] = c.r; this.lin[key][k * 3 + 1] = c.g; this.lin[key][k * 3 + 2] = c.b;
      }
    }
    this.jit = new Float32Array(N * 4);        // dx, dz, rotY, brightness
    this.fall = new Float32Array(N * 6);       // 낙하 시작 기울기축(xyz)·각도, 수평 드리프트(x,z)
    this.fly = new Float32Array(N * 8);        // 뚜껑 비행: vx, vy, vz, 회전축 xyz, 각속도, 수명
    for (let k = 0; k < N; k++) {
      const i = k % D.NX, j = Math.floor(k / D.NX);
      this.jit.set([(R() - .5) * .05, (R() - .5) * .05, (R() - .5) * .07, .96 + R() * .08], k * 4);
      const ax = new THREE.Vector3(R() - .5, R() - .5, R() - .5).normalize();
      this.fall.set([ax.x, ax.y, ax.z, (.3 + R() * .5) * (R() < .5 ? -1 : 1), (R() - .5) * 1.2, (R() - .5) * 1.2], k * 6);
      // 뚜껑 분수: 위로 솟구치며 바깥으로 퍼짐
      const dx = i - 108, dz = j - 152, dl = Math.hypot(dx, dz) + 1e-3, vr = 3 + R() * 13, up = 22 + R() * 50;
      const ax2 = new THREE.Vector3(R() - .5, R() - .5, R() - .5).normalize();
      this.fly.set([dx / dl * vr + (R() - .5) * 7, up, dz / dl * vr + (R() - .5) * 7, ax2.x, ax2.y, ax2.z, (4 + R() * 10) * (R() < .5 ? -1 : 1), R() * 6.28], k * 8);
    }
    { const k0 = sch.order[0]; this.fall[k0 * 6 + 4] = 0; this.fall[k0 * 6 + 5] = 0; this.fall[k0 * 6 + 3] = .45; }
    // 시간표 (등장 시점)
    this.tShow = new Float32Array(N); this.tSpawn = new Float32Array(N);
    for (let k = 0; k < N; k++) {
      const tl = sch.tLand[k];
      this.tShow[k] = tl < T_LOD ? tl + SETTLE : tl;
      this.tSpawn[k] = tl - sch.tFall[k];
    }
    this.byRank = sch.order;                   // rank → tile
    this.rankShow = Float32Array.from(sch.order, k => this.tShow[k]);
    this.rankLand = Float32Array.from(sch.order, k => sch.tLand[k]);
    // 정적(매크로) 인스턴스는 최종 위치로 미리 채움
    const m = new THREE.Matrix4();
    for (let r = 0; r < SMAX; r++) {
      const k = this.byRank[r];
      this._restMatrix(k, m);
      this.sBody.setMatrixAt(r, m); this._setTileAttrs(this.sBody, r, k, 'B');
      this.sLid.setMatrixAt(r, m); this._setTileAttrs(this.sLid, r, k);
      if (r < this.sBow.instanceMatrix.count) { this.sBow.setMatrixAt(r, m); this.sBow.setColorAt(r, c.setRGB(...this._rgbLin('R', k))); }
    }
    for (const im of [this.sBody, this.sLid, this.sBow]) { im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; const a = im.geometry.getAttribute('aRib'); if (a) a.needsUpdate = true; }
    // 전체 3D: 몸통 전부 + 뚜껑(펑 늦은 순 → 안 터진 것이 앞쪽 prefix)
    const ap = this.uBody.geometry.getAttribute('aPop');
    for (let k = 0; k < N; k++) { this._restMatrix(k, m); this.uBody.setMatrixAt(k, m); this._setTileAttrs(this.uBody, k, k, 'B'); ap.setX(k, sch.tPop[k]); }
    this.lidOrder = Array.from({ length: N }, (_, k) => k).sort((a, b) => sch.tPop[b] - sch.tPop[a]);
    this.lidOrder.forEach((k, r) => { this._restMatrix(k, m); this.uLid.setMatrixAt(r, m); this._setTileAttrs(this.uLid, r, k); });
    this.popSorted = Float32Array.from(sch.tPop).sort();
    this.uBody.count = 0; this.uLid.count = 0;
    for (const im of [this.uBody, this.uLid]) { im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; im.geometry.getAttribute('aRib').needsUpdate = true; }
    ap.needsUpdate = true;
  }
  _rgbLin(key, k) { const a = this.lin[key]; return [a[k * 3], a[k * 3 + 1], a[k * 3 + 2]]; }
  _setTileAttrs(im, r, k, key = 'A') {
    const b = this.jit[k * 4 + 3], A = this.lin[key];
    im.instanceColor.setXYZ(r, A[k * 3] * b, A[k * 3 + 1] * b, A[k * 3 + 2] * b);
    const ra = im.geometry.getAttribute('aRib'); if (ra) ra.setXYZ(r, ...this._rgbLin('R', k));
  }
  _countShownBy(t) { const s = this.data.sch; let n = 0; for (let k = 0; k < D.N; k++) { const tl = s.tLand[k], ts = tl < T_LOD ? tl + SETTLE : tl; if (ts <= t) n++; } return n; }
  _tilePos(k) { const i = k % D.NX, j = Math.floor(k / D.NX); return [i - D.NX / 2 + .5 + this.jit[k * 4], j - D.NY / 2 + .5 + this.jit[k * 4 + 1]]; }
  _restMatrix(k, m) {
    const [x, z] = this._tilePos(k);
    this._q = this._q || new THREE.Quaternion(); this._q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this.jit[k * 4 + 2]);
    return m.compose(new THREE.Vector3(x, 0, z), this._q, new THREE.Vector3(1, 1, 1));
  }

  _impostor() {
    const N = D.N, NX = D.NX, NY = D.NY;
    const tex = (arr, srgb) => { const t = new THREE.DataTexture(arr, NX, NY, THREE.RGBAFormat, arr instanceof Float32Array ? THREE.FloatType : THREE.UnsignedByteType); t.magFilter = t.minFilter = THREE.NearestFilter; t.generateMipmaps = false; if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; return t; };
    const a8 = src => { const o = new Uint8Array(N * 4); for (let k = 0; k < N; k++) { o[k * 4] = src[k * 3]; o[k * 4 + 1] = src[k * 3 + 1]; o[k * 4 + 2] = src[k * 3 + 2]; o[k * 4 + 3] = 255; } return o; };
    const T = new Float32Array(N * 4);
    for (let k = 0; k < N; k++) T.set([this.tShow[k], this.data.sch.tPop[k], this.jit[k * 4 + 3], this.jit[k * 4 + 2]], k * 4);
    const u = this.impU = { uA: { value: tex(a8(this.data.colA), true) }, uB: { value: tex(a8(this.data.colB), true) }, uR: { value: tex(a8(this.data.rib), true) }, uT: { value: tex(T) }, uN: { value: new THREE.Vector2(NX, NY) } };
    const m = new THREE.MeshStandardMaterial({ roughness: .3 });
    m.onBeforeCompile = sh => {
      Object.assign(sh.uniforms, u, this.uniforms);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vCellUv;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvCellUv = uv;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>
          varying vec2 vCellUv; uniform sampler2D uA, uB, uR, uT; uniform vec2 uN; uniform float uTime, uRattle; float rgh;
          float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }`)
        .replace('#include <color_fragment>', `#include <color_fragment>
          {
            vec2 g = vec2(vCellUv.x * uN.x, (1. - vCellUv.y) * uN.y);
            vec2 cell = floor(g); vec2 tc = (cell + .5) / uN;
            vec4 T = texture2D(uT, tc);
            if (uTime < T.r) discard;
            vec2 f = fract(g) - .5;
            float an = T.a; f = mat2(cos(an), sin(an), -sin(an), cos(an)) * f;
            float aa = max(max(fwidth(g).x, fwidth(g).y), 1e-4) * .9;
            float e = max(abs(f.x), abs(f.y));
            vec3 gap = vec3(.20, .16, .115);
            rgh = .3;
            if (uTime < T.g) {
              float inLid = 1. - smoothstep(.465 - aa, .465 + aa, e);
              vec3 cA = texture2D(uA, tc).rgb * T.b, cR = texture2D(uR, tc).rgb;
              float w = .068;
              float rib = max(1. - smoothstep(w - aa, w + aa, abs(f.x)), 1. - smoothstep(w - aa, w + aa, abs(f.y)));
              float lumT = dot(cA, vec3(.2126, .7152, .0722));
              vec3 tone = lumT < .2 ? cA * 1.7 + .012 : cA * .9;
              vec3 lid = mix(cA, tone, rib);
              lid *= 1. + uRattle * (h21(cell + floor(uTime * 30.)) - .5) * .5;
              float edge = smoothstep(.40, .465, e);
              lid *= mix(1., .78, edge * smoothstep(-.2, .3, f.x + f.y));
              lid *= mix(1., 1.12, edge * smoothstep(-.2, .3, -(f.x + f.y)));
              diffuseColor.rgb = mix(gap, lid, inLid);
              rgh = mix(.42, .22, rib);
            } else {
              vec3 cA = texture2D(uA, tc).rgb * T.b, cB = texture2D(uB, tc).rgb;
              float inBox = 1. - smoothstep(.43 - aa, .43 + aa, e);
              float inIn = 1. - smoothstep(.385 - aa, .385 + aa, e);
              float ao = mix(.72, 1., smoothstep(.385, .14, e));
              float wall = smoothstep(-.3, .25, -(f.x + f.y)) * smoothstep(.22, .385, e);
              vec3 inside = cB * ao * (1. - .22 * wall);
              vec3 rim = mix(cB, vec3(1.), .45);
              diffuseColor.rgb = mix(gap, mix(rim, inside, inIn), inBox);
              rgh = .55;
            }
          }`)
        .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\nroughnessFactor = rgh;');
    };
    const plane = this.imp = new THREE.Mesh(new THREE.PlaneGeometry(NX, NY), m);
    plane.rotation.x = -Math.PI / 2; plane.position.y = TOP_Y; plane.visible = false;
    this.scene.add(plane);
  }

  // ── 후처리: DOF + FXAA + 톤매핑 + 그레인/비네트/색수차 ──
  _post() {
    const r = this.renderer;
    const depth = new THREE.DepthTexture(W, H); depth.type = THREE.UnsignedIntType;
    this.rtMain = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType, depthTexture: depth });
    const q = (w, h) => new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter });
    this.rtQa = q(W / 4, H / 4); this.rtQb = q(W / 4, H / 4); this.rtEa = q(W / 8, H / 8); this.rtEb = q(W / 8, H / 8);
    this.rtAcc = new THREE.WebGLRenderTarget(W, H, { type: THREE.HalfFloatType });
    this.postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const tri = new THREE.BufferGeometry(); tri.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3)); tri.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2));
    this.postQuad = new THREE.Mesh(tri); this.postScene = new THREE.Scene(); this.postScene.add(this.postQuad);
    const vs = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }';
    this.mDown = new THREE.ShaderMaterial({ uniforms: { tSrc: { value: null }, uTexel: { value: new THREE.Vector2() } }, vertexShader: vs,
      fragmentShader: 'uniform sampler2D tSrc; uniform vec2 uTexel; varying vec2 vUv; void main(){ vec4 c = texture2D(tSrc, vUv + uTexel*vec2(-1.,-1.)) + texture2D(tSrc, vUv + uTexel*vec2(1.,-1.)) + texture2D(tSrc, vUv + uTexel*vec2(-1.,1.)) + texture2D(tSrc, vUv + uTexel*vec2(1.,1.)); gl_FragColor = c * .25; }' });
    this.mAcc = new THREE.ShaderMaterial({ uniforms: { tSrc: { value: null }, uW: { value: 1 } }, vertexShader: vs, transparent: true, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false,
      fragmentShader: 'uniform sampler2D tSrc; uniform float uW; varying vec2 vUv; void main(){ gl_FragColor = texture2D(tSrc, vUv) * uW; }' });
    this.mBlur = new THREE.ShaderMaterial({ uniforms: { tSrc: { value: null }, uDir: { value: new THREE.Vector2() } }, vertexShader: vs,
      fragmentShader: `uniform sampler2D tSrc; uniform vec2 uDir; varying vec2 vUv;
        void main(){ vec4 c = texture2D(tSrc, vUv) * .2270;
          c += (texture2D(tSrc, vUv + uDir*1.3846) + texture2D(tSrc, vUv - uDir*1.3846)) * .3162;
          c += (texture2D(tSrc, vUv + uDir*3.2308) + texture2D(tSrc, vUv - uDir*3.2308)) * .0703;
          gl_FragColor = c; }` });
    this.mComp = new THREE.ShaderMaterial({
      uniforms: { tSharp: { value: this.rtMain.texture }, tDepth: { value: depth }, tBlur: { value: this.rtQa.texture }, tBlur2: { value: this.rtEa.texture },
        uRes: { value: new THREE.Vector2(W, H) }, uNear: { value: .05 }, uFar: { value: 4000 }, uFocus: { value: 10 }, uAperture: { value: 1 },
        uExposure: { value: 1 }, uTime: { value: 0 }, uCA: { value: 0 }, uBlurAll: { value: 0 }, uDim: { value: 0 }, uFlash: { value: 0 } },
      vertexShader: vs,
      fragmentShader: `
        uniform sampler2D tSharp, tDepth, tBlur, tBlur2; uniform vec2 uRes; uniform float uNear, uFar, uFocus, uAperture, uExposure, uTime, uCA, uBlurAll, uDim, uFlash;
        varying vec2 vUv;
        float lum(vec3 c){ return dot(sqrt(max(c, 0.)), vec3(.299,.587,.114)); }
        vec3 fxaa(vec2 uv){
          vec2 px = 1. / uRes;
          vec3 cM = texture2D(tSharp, uv).rgb;
          vec3 cNW = texture2D(tSharp, uv + vec2(-1.,-1.)*px).rgb, cNE = texture2D(tSharp, uv + vec2(1.,-1.)*px).rgb;
          vec3 cSW = texture2D(tSharp, uv + vec2(-1.,1.)*px).rgb, cSE = texture2D(tSharp, uv + vec2(1.,1.)*px).rgb;
          float lM = lum(cM), lNW = lum(cNW), lNE = lum(cNE), lSW = lum(cSW), lSE = lum(cSE);
          float mn = min(lM, min(min(lNW, lNE), min(lSW, lSE))), mx = max(lM, max(max(lNW, lNE), max(lSW, lSE)));
          if (mx - mn < .04) return cM;
          vec2 dir = vec2(-((lNW + lNE) - (lSW + lSE)), (lNW + lSW) - (lNE + lSE));
          float red = max((lNW + lNE + lSW + lSE) * .03125, 1./128.);
          dir = clamp(dir / (min(abs(dir.x), abs(dir.y)) + red), -8., 8.) * px;
          vec3 a = .5 * (texture2D(tSharp, uv + dir * (1./3. - .5)).rgb + texture2D(tSharp, uv + dir * (2./3. - .5)).rgb);
          vec3 b = a * .5 + .25 * (texture2D(tSharp, uv - dir * .5).rgb + texture2D(tSharp, uv + dir * .5).rgb);
          float lb = lum(b);
          return (lb < mn || lb > mx) ? a : b;
        }
        vec3 neutral(vec3 color){
          const float S = .76, Dsat = .15; color *= uExposure;
          float x = min(color.r, min(color.g, color.b)); float off = x < .08 ? x - 6.25 * x * x : .04; color -= off;
          float peak = max(color.r, max(color.g, color.b)); if (peak < S) return color;
          float d = 1. - S; float np = 1. - d * d / (peak + d - S); color *= np / peak;
          float g = 1. - 1. / (Dsat * (peak - np) + 1.); return mix(color, vec3(np), g);
        }
        vec3 srgb(vec3 c){ c = clamp(c, 0., 1.); return mix(c * 12.92, 1.055 * pow(c, vec3(1./2.4)) - .055, step(.0031308, c)); }
        float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453); }
        void main(){
          vec2 uv = vUv;
          float d = texture2D(tDepth, uv).r;
          float z = (uNear * uFar) / (uFar - d * (uFar - uNear));
          float coc = clamp(abs(z - uFocus) / max(z, 1e-3) * uAperture, 0., 1.);
          coc = max(coc, uBlurAll);
          vec3 sharp;
          if (uCA > 0.) {
            vec2 o = (uv - .5) * uCA;
            sharp = vec3(texture2D(tSharp, uv + o).r, fxaa(uv).g, texture2D(tSharp, uv - o).b);
          } else sharp = fxaa(uv);
          vec3 b1 = texture2D(tBlur, uv).rgb, b2 = texture2D(tBlur2, uv).rgb;
          vec3 col = mix(sharp, b1, smoothstep(.02, .3, coc));
          col = mix(col, b2, smoothstep(.35, .9, coc));
          col = neutral(col);
          col = srgb(col);
          vec2 vq = uv - .5; col *= 1. - .32 * dot(vq * vec2(.9, 1.1), vq * vec2(.9, 1.1)) * 1.6;
          float lg = dot(col, vec3(.299,.587,.114)); col = mix(vec3(lg), col, 1.16); col = (col - .5) * 1.07 + .5;
          col = mix(col, col * vec3(1.02, 1., .97), .5);
          col += (h(uv * uRes + fract(uTime * 7.31) * 100.) - .5) * .045;
          col = mix(col, vec3(.06,.05,.04), uDim);
          col = mix(col, vec3(1.), uFlash);
          gl_FragColor = vec4(col, 1.);
        }` });
  }
  _pass(mat, target) { this.postQuad.material = mat; this.renderer.setRenderTarget(target); this.renderer.render(this.postScene, this.postCam); }

  // ── 카메라 ──
  _cameraPath() {
    const { si, sj } = this.data.sch;
    const lg = keys => { const f = monotone(keys.map(([t, v]) => [t, Math.log(v)])); return t => Math.exp(f(t)); };
    this.cD = lg([[0, 4.6], [.55, 4.4], [1.6, 5.4], [2.6, 8.5], [3.4, 17], [4.2, 36], [5.0, 70], [6.0, 150], [7.0, 280], [8.0, 430], [9.0, 560], [10.0, 640], [11.4, 660], [12.5, 200], [13.45, 72],
      [13.5, 72], [14.5, 92], [15.6, 330], [16.6, 640], [18.5, 610], [21, 560], [26, 520]]);
    this.cPhi = monotone([[0, 24], [1.6, 26], [2.6, 32], [4.0, 46], [5.2, 62], [6.5, 76], [8.0, 86], [9.5, 89.4], [11.4, 89.4], [12.6, 56], [13.45, 34], [14.4, 33], [15.3, 55], [16.1, 84], [16.6, 89.4], [26, 89.4]]);
    this.cTh = monotone([[0, -14], [3, -16], [6, -8], [9.5, 0], [11.4, 0], [13.45, -20], [14.5, -14], [16.6, 0], [26, -3]]);
    const cx = D.NX / 2, cz = 152;
    this.cTx = monotone([[0, si + .5], [2.6, si + .5], [4.5, si + 4], [6.5, lerp(si, 108, .35)], [8.5, 103], [10, 108], [26, 108]]);
    this.cTz = monotone([[0, sj + .5], [2.6, sj + .5], [4.5, sj + 3], [6.5, lerp(sj, 192, .3)], [8.5, 185], [10, 192], [11.4, 192], [12.6, 160], [13.45, 152], [14.5, 154], [15.6, 172], [16.6, 192], [26, 192]]);
    this.cAp = monotone([[0, 2.4], [2.6, 2.0], [4, 1.5], [6, .9], [8, .5], [11.4, .4], [12.6, .8], [13.45, 1.1], [13.6, .55], [14.5, .5], [15.6, .45], [16.6, .4], [26, .4]]);
    this._sx = cx; this._sz = cz;
  }
  cameraAt(t) {
    const D_ = this.cD(t), phi = this.cPhi(t) * Math.PI / 180, th = this.cTh(t) * Math.PI / 180;
    const tx = this.cTx(t) - D.NX / 2, tz = this.cTz(t) - D.NY / 2;
    const target = new THREE.Vector3(tx, .55 * (1 - smooth(.3, 2.2, t)), tz);
    const pos = new THREE.Vector3(tx + D_ * Math.sin(th) * Math.cos(phi), D_ * Math.sin(phi), tz + D_ * Math.cos(th) * Math.cos(phi));
    // 흔들림
    let sh = 0;
    if (t > 12.6 && t < 13.5) sh = .003 * smooth(12.6, 13.45, t);
    if (t >= 13.5) sh = .014 * Math.exp(-(t - 13.5) * 2.4);
    if (sh > 0) { pos.x += D_ * sh * Math.sin(t * 93); pos.z += D_ * sh * Math.cos(t * 71); }
    const upTop = new THREE.Vector3(-Math.sin(th), 0, -Math.cos(th));
    const up = new THREE.Vector3(0, 1, 0).lerp(upTop, smooth(70, 86, this.cPhi(t))).normalize();
    this.camera.up.copy(up); this.camera.position.copy(pos); this.camera.lookAt(target);
    this.camera.near = Math.min(20, Math.max(.05, D_ * .012)); this.camera.far = D_ * 6 + 300; this.camera.updateProjectionMatrix();
    this.camera.updateMatrixWorld();
    const fy = t < .6 ? lerp(1.4, .45, smooth(0, .6, t)) : .45;
    let focus = pos.distanceTo(target.clone().setY(fy));
    return { target, D: D_, focus };
  }

  // ── 프레임 ──
  render(t) {
    const r = this.renderer, cam = this.cameraAt(t);
    this.uniforms.uTime.value = t;
    this.uniforms.uRattle.value = t > 12.9 && t < this.data.sch.tPop[0] + 2 ? smooth(12.9, 13.45, t) : 0;
    // 조명/그림자 영역을 화면에 맞춤
    const vis = cam.D * .75 + 4;
    const s = this.sun; s.target.position.copy(cam.target); s.position.copy(cam.target).add(new THREE.Vector3(-.52, 1, -.42).normalize().multiplyScalar(vis * 2 + 20));
    Object.assign(s.shadow.camera, { left: -vis, right: vis, top: vis, bottom: -vis, near: 1, far: vis * 4 + 60 }); s.shadow.camera.updateProjectionMatrix();
    s.castShadow = t < T_LOD + .05;
    s.color.set('#fff0dc').lerp(this._white || (this._white = new THREE.Color('#ffffff')), smooth(4, 9, t));
    this.scene.environmentIntensity = lerp(.8, .42, smooth(4, 9, t));
    this._updateBoxes(t);
    const nl = this._updateLids(t);
    // 렌더 → (모션블러) → DOF → 합성
    const storm = t > 13.52 && t < 15.8 && nl > 0;
    let src = this.rtMain;
    if (storm) {
      const S = 3, dt = 1 / 30 * .6;
      r.setRenderTarget(this.rtAcc); r.setClearColor(0x000000, 0); r.clear();
      for (let i = S - 1; i >= 0; i--) {
        const ts = t - dt * i / (S - 1);
        if (i > 0) { this.cameraAt(ts); this.uniforms.uTime.value = ts; this._updateBoxes(ts); this._updateLids(ts); }
        else { this.cameraAt(t); this.uniforms.uTime.value = t; this._updateBoxes(t); this._updateLids(t); }
        r.setRenderTarget(this.rtMain); r.render(this.scene, this.camera);
        this.mAcc.uniforms.tSrc.value = this.rtMain.texture; this.mAcc.uniforms.uW.value = 1 / S;
        this.postQuad.material = this.mAcc; r.setRenderTarget(this.rtAcc); r.autoClear = false; r.render(this.postScene, this.postCam); r.autoClear = true;
      }
      src = this.rtAcc;
    } else { r.setRenderTarget(this.rtMain); r.render(this.scene, this.camera); }
    this.mComp.uniforms.tSharp.value = src.texture;
    this.mDown.uniforms.tSrc.value = src.texture; this.mDown.uniforms.uTexel.value.set(1 / W, 1 / H); this._pass(this.mDown, this.rtQa);
    for (let k = 0; k < 2; k++) {
      this.mBlur.uniforms.tSrc.value = this.rtQa.texture; this.mBlur.uniforms.uDir.value.set(4 / W, 0); this._pass(this.mBlur, this.rtQb);
      this.mBlur.uniforms.tSrc.value = this.rtQb.texture; this.mBlur.uniforms.uDir.value.set(0, 4 / H); this._pass(this.mBlur, this.rtQa);
    }
    this.mDown.uniforms.tSrc.value = this.rtQa.texture; this.mDown.uniforms.uTexel.value.set(4 / W, 4 / H); this._pass(this.mDown, this.rtEa);
    for (let k = 0; k < 2; k++) {
      this.mBlur.uniforms.tSrc.value = this.rtEa.texture; this.mBlur.uniforms.uDir.value.set(8 / W, 0); this._pass(this.mBlur, this.rtEb);
      this.mBlur.uniforms.tSrc.value = this.rtEb.texture; this.mBlur.uniforms.uDir.value.set(0, 8 / H); this._pass(this.mBlur, this.rtEa);
    }
    const u = this.mComp.uniforms;
    u.uFocus.value = cam.focus; u.uAperture.value = this.cAp(t); u.uTime.value = t; u.uNear.value = this.camera.near; u.uFar.value = this.camera.far;
    u.uExposure.value = lerp(1.0, .9, smooth(4, 9, t)) * (1 + .14 * smooth(13.5, 13.62, t) * (1 - smooth(15.2, 15.85, t)));
    u.uCA.value = t > 13.5 ? .012 * Math.exp(-(t - 13.5) * 2.5) : 0;
    u.uFlash.value = t > 13.5 ? .22 * Math.exp(-(t - 13.5) * 10) : 0;
    u.uBlurAll.value = .75 * smooth(20.6, 21.4, t);
    u.uDim.value = .55 * smooth(20.6, 21.4, t);
    this._pass(this.mComp, null);
  }

  _updateBoxes(t) {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(1, 1, 1), ax = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
    // 정적 상자 (LOD 이전)
    const nShow = lowerBound(this.rankShow, t);       // rank < nShow → 표시됨 (tShow 단조)
    const preLod = t < T_LOD, full = t >= T3A && t < T3B;
    this.sBody.count = this.sLid.count = preLod ? Math.min(nShow, this._staticMax) : 0;
    this.sBow.count = preLod ? Math.min(nShow, this.sBow.instanceMatrix.count) : 0;
    this.imp.visible = !preLod && !full;
    this.groundInner.material.color.setScalar(full ? .3 : 1);
    if (full) {
      this.uBody.count = D.N;
      const popped = lowerBound(this.popSorted, t);
      this.uLid.count = D.N - popped;
      const ra = smooth(12.5, 13.45, t);
      if (ra > 0 && this.uLid.count > 0) {             // 터지기 직전 덜컹거림
        const tp0 = D.T_POP;
        for (let r = 0; r < this.uLid.count; r++) {
          const k = this.lidOrder[r], [x, z] = this._tilePos(k), ph = this.fly[k * 8 + 7];
          const near = Math.exp(-Math.max(0, this.data.sch.tPop[k] - Math.max(t, tp0)) * 3);
          const a = ra * (.05 + .1 * near), hop = a * Math.max(0, Math.sin(t * 42 + ph)) ** 2;
          q2.setFromAxisAngle(Y, this.jit[k * 4 + 2] + a * .6 * Math.sin(t * 37 + ph * 2));
          ax.set(Math.cos(ph), 0, Math.sin(ph)); q.setFromAxisAngle(ax, a * .5 * Math.sin(t * 51 + ph)).multiply(q2);
          p.set(x, hop, z); m.compose(p, q, sc); this.uLid.setMatrixAt(r, m);
        }
        this.uLid.instanceMatrix.needsUpdate = true; this._rattled = true;
      } else if (this._rattled) {
        this.lidOrder.forEach((k, r) => { this._restMatrix(k, m); this.uLid.setMatrixAt(r, m); }); this.uLid.instanceMatrix.needsUpdate = true; this._rattled = false;
      }
    } else { this.uBody.count = 0; this.uLid.count = 0; }
    const rm = this.uniforms.uRibMix.value = smooth(4.3, 6.3, t);
    if (preLod && rm > 0 && this.sBow.count > 0) {
      const A = this.lin.A, Rb = this.lin.R;
      for (let r = 0; r < this.sBow.count; r++) {
        const k = this.byRank[r], b = this.jit[k * 4 + 3], a0 = A[k * 3] * b, a1 = A[k * 3 + 1] * b, a2 = A[k * 3 + 2] * b;
        const l = .2126 * a0 + .7152 * a1 + .0722 * a2, f = l < .2 ? 1.7 : .9, o = l < .2 ? .012 : 0;
        this.sBow.instanceColor.setXYZ(r, lerp(Rb[k * 3], a0 * f + o, rm), lerp(Rb[k * 3 + 1], a1 * f + o, rm), lerp(Rb[k * 3 + 2], a2 * f + o, rm));
      }
      this.sBow.instanceColor.needsUpdate = true;
    }
    // 움직이는 상자: spawn ≤ t < show
    let n = 0, nb = 0;
    const r0 = lowerBound(this.rankLand, t - SETTLE - 1e-3), r1 = lowerBound(this.rankLand, t + .6);
    for (let r = r0; r < Math.min(r1, D.N); r++) {
      const k = this.byRank[r];
      if (this.tSpawn[k] > t || t >= this.tShow[k]) continue;
      if (n >= this.dBody.instanceMatrix.count) break;
      const s = this.data.sch, tl = s.tLand[k], tf = s.tFall[k], [x, z] = this._tilePos(k);
      const F = this.fall, o = k * 6;
      q2.setFromAxisAngle(Y, this.jit[k * 4 + 2]);
      if (t < tl) {
        const u = (t - (tl - tf)) / tf;                   // 0..1
        const y = s.h0[k] * (1 - u * u);
        p.set(x + F[o + 4] * (1 - u) * (1 - u), y, z + F[o + 5] * (1 - u) * (1 - u));
        ax.set(F[o], F[o + 1], F[o + 2]); q.setFromAxisAngle(ax, F[o + 3] * (1 - smooth(0, 1, u)));
        q.multiply(q2);
      } else {
        const b = (t - tl) / SETTLE;
        const hop = .1 * Math.abs(Math.sin(b * Math.PI * 1.6)) * (1 - b) * (1 - b);
        p.set(x, hop, z);
        ax.set(F[o + 2], 0, -F[o]).normalize(); q.setFromAxisAngle(ax, .08 * Math.sin(b * 18) * (1 - b));
        q.multiply(q2);
      }
      m.compose(p, q, sc);
      this.dBody.setMatrixAt(n, m); this.dLid.setMatrixAt(n, m);
      this._setTileAttrs(this.dBody, n, k, 'B'); this._setTileAttrs(this.dLid, n, k);
      if (r < BOW_MAX && nb < BOW_MAX) { this.dBow.setMatrixAt(nb, m); this.dBow.setColorAt(nb, this._c || (this._c = new THREE.Color()).setRGB(...this._rgbLin('R', k))); nb++; }
      n++;
    }
    this.dBody.count = this.dLid.count = n; this.dBow.count = nb;
    for (const im of [this.dBody, this.dLid, this.dBow]) {
      im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
      const a = im.geometry.getAttribute('aRib'); if (a) a.needsUpdate = true;
    }
  }

  _updateLids(t) {
    const s = this.data.sch, F = this.fly;
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(1, 1, 1), ax = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
    const fr = new THREE.Frustum().setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(this.camera.projectionMatrix, this.camera.matrixWorldInverse));
    const sph = new THREE.Sphere(new THREE.Vector3(), .8);
    let n = 0;
    if (t >= D.T_POP - .01) for (let k = 0; k < D.N; k++) {
      const u = t - s.tPop[k];
      if (u < 0 || u > (Math.hypot(k % D.NX - 108, Math.floor(k / D.NX) - 152) < 70 ? 2.6 : 1.5)) continue;
      const o = k * 8, [x, z] = this._tilePos(k);
      p.set(x + F[o] * u, LID_Y + LID_H / 2 + F[o + 1] * u - 8 * u * u, z + F[o + 2] * u);
      if (p.distanceToSquared(this.camera.position) < 2.5) continue;
      sph.center.copy(p); if (!fr.intersectsSphere(sph)) continue;
      q2.setFromAxisAngle(Y, this.jit[k * 4 + 2]); ax.set(F[o + 3], F[o + 4], F[o + 5]); q.setFromAxisAngle(ax, F[o + 6] * u).multiply(q2);
      m.compose(p, q, sc); this.fLid.setMatrixAt(n, m); this._setTileAttrs(this.fLid, n, k);
      if (++n >= this.fLid.instanceMatrix.count) break;
    }
    this.fLid.count = n;
    this.fLid.instanceMatrix.needsUpdate = true; this.fLid.instanceColor.needsUpdate = true; this.fLid.geometry.getAttribute('aRib').needsUpdate = true;
    return n;
  }
}
function lowerBound(arr, v) { let lo = 0, hi = arr.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (arr[mid] <= v) lo = mid + 1; else hi = mid; } return lo; }
