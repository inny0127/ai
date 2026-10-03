// 헤드리스 크로미움(SwiftShader WebGL)에서 프레임 단위 결정적 렌더 → ffmpeg
//   node render.mjs                       전체 (30fps, 2 workers)
//   node render.mjs --stills 0.6,3,9      정지컷 PNG → out/stills
//   node render.mjs --audio-only          사운드만 다시 합성 + 기존 영상과 합치기
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, 'out'); fs.mkdirSync(OUT, { recursive: true });
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = +arg('fps', 30), WORKERS = +arg('workers', 3), DUR = +arg('dur', 26);
const W = 1080, H = 1920;
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, r));
const URL_ = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-gpu-vsync', '--font-render-hinting=none'] });
async function newPage() {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error' || m.text().includes('failed')) console.error('[page]', m.text()); });
  page.on('pageerror', e => console.error('[pageerror]', e.message));
  await page.goto(URL_);
  await page.waitForFunction(() => window.READY === true || window.INIT_ERROR, null, { timeout: 600000 });
  const err = await page.evaluate(() => window.INIT_ERROR); if (err) throw new Error(err);
  return page;
}

const STILLS = arg('stills', null);
if (STILLS) {
  const page = await newPage(), dir = path.join(OUT, 'stills'); fs.mkdirSync(dir, { recursive: true });
  for (const t of STILLS.split(',').map(Number)) {
    const t0 = Date.now();
    const url = await page.evaluate(t => window.renderPNG(t), t);
    fs.writeFileSync(path.join(dir, `t${t.toFixed(2).padStart(5, '0')}.png`), Buffer.from(url.split(',')[1], 'base64'));
    console.log('still', t, Date.now() - t0, 'ms');
  }
  await browser.close(); server.close(); process.exit(0);
}

if (!process.argv.includes('--video-only')) {
  const page = await newPage(); const ta = Date.now();
  const b64 = await page.evaluate(() => window.audioB64());
  fs.writeFileSync(path.join(OUT, 'audio.wav'), Buffer.from(b64, 'base64'));
  await page.close(); console.log('audio done', Date.now() - ta, 'ms');
}
const final = path.join(OUT, 'hyetaek_hana_9x16.mp4');
if (process.argv.includes('--audio-test')) { await browser.close(); server.close(); process.exit(0); }
if (!process.argv.includes('--audio-only')) {
  // 1초(30프레임) 청크를 작업자들이 큐에서 하나씩 가져감 → 무거운 구간이 몰려도 균형
  const N = Math.round(DUR * FPS), CH = FPS, nCh = Math.ceil(N / CH), t0 = Date.now();
  let next = 0, done = 0;
  const segs = [...Array(nCh)].map((_, c) => path.join(OUT, `seg_${String(c).padStart(3, '0')}.mp4`));
  await Promise.all([...Array(WORKERS)].map(async () => {
    const page = await newPage();
    while (next < nCh) {
      const c = next++, a = c * CH, b = Math.min(N, a + CH);
      if (fs.existsSync(segs[c]) && process.argv.includes('--resume')) { done += b - a; continue; }
      const tmp = segs[c] + '.part.mp4';
      const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '15', '-pix_fmt', 'yuv420p', tmp], { stdio: ['pipe', 'inherit', 'inherit'] });
      for (let i = a; i < b; i++) {
        const b64 = await page.evaluate(t => window.renderAt(t), i / FPS);
        if (!ff.stdin.write(Buffer.from(b64, 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
        done++;
      }
      ff.stdin.end(); await new Promise(r => ff.on('close', r)); fs.renameSync(tmp, segs[c]);
      const el = (Date.now() - t0) / 1000; console.log(`chunk ${c + 1}/${nCh} done  frames ${done}/${N}  ${el.toFixed(0)}s  eta ${(el / done * (N - done)).toFixed(0)}s`);
    }
    await page.close();
  }));
  fs.writeFileSync(path.join(OUT, 'list.txt'), segs.map(f => `file '${path.basename(f)}'`).join('\n'));
  await new Promise((res, rej) => { const f = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'list.txt'), '-c', 'copy', path.join(OUT, 'video.mp4')], { stdio: 'inherit' }); f.on('close', c => c ? rej(c) : res()); });
}
await browser.close(); server.close();
await new Promise((res, rej) => {
  const f = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(OUT, 'video.mp4'), '-i', path.join(OUT, 'audio.wav'),
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', final], { stdio: 'inherit' });
  f.on('close', c => c ? rej(c) : res());
});
console.log('done', final);
