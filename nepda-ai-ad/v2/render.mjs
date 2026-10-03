// 헤드리스 크로미움에서 프레임 단위로 결정적 렌더 → ffmpeg 로 mp4
//   node render.mjs                     전체 렌더 (60fps, 4 workers)
//   node render.mjs --stills 0.5,3,7.2  지정 시점 PNG 저장 (out/stills)
//   node render.mjs --fps 30 --workers 2
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, 'out');
fs.mkdirSync(OUT, { recursive: true });
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const FPS = +arg('fps', 60), WORKERS = +arg('workers', 4), DUR = 26;
const STILLS = arg('stills', null);

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf', '.otf': 'font/otf' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, r));
const URL_ = `http://127.0.0.1:${server.address().port}/index.html`;

const browser = await chromium.launch({ args: ['--disable-gpu-vsync', '--font-render-hinting=none'] });
async function newPage() {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('console', m => { if (m.type() === 'error') console.error('[page]', m.text()); });
  page.on('pageerror', e => console.error('[pageerror]', e.message));
  await page.goto(URL_);
  await page.waitForFunction(() => window.READY === true, null, { timeout: 120000 });
  return page;
}
const shot = page => page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: 1080, height: 1920 } });

if (STILLS) {
  const page = await newPage(), dir = path.join(OUT, 'stills');
  fs.mkdirSync(dir, { recursive: true });
  for (const t of STILLS.split(',').map(Number)) {
    const t0 = Date.now();
    await page.evaluate(t => window.renderAt(t), t);
    fs.writeFileSync(path.join(dir, `t${t.toFixed(2).padStart(5, '0')}.png`), await shot(page));
    console.log('still', t, Date.now() - t0, 'ms');
  }
  await browser.close(); server.close(); process.exit(0);
}

const AUDIO_ONLY = process.argv.includes('--audio-only');
// 오디오
{
  const page = await newPage();
  const b64 = await page.evaluate(() => window.audioB64());
  fs.writeFileSync(path.join(OUT, 'audio.wav'), Buffer.from(b64, 'base64'));
  await page.close();
  console.log('audio done');
}

const N = Math.round(DUR * FPS), per = Math.ceil(N / WORKERS);
const t0 = Date.now();
if (AUDIO_ONLY) { await browser.close(); server.close(); }
else {
let done = 0;
await Promise.all([...Array(WORKERS)].map(async (_, w) => {
  const a = w * per, b = Math.min(N, a + per);
  const page = await newPage();
  const seg = path.join(OUT, `seg${w}.mp4`);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '14', '-pix_fmt', 'yuv420p', '-r', String(FPS), seg], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = a; i < b; i++) {
    await page.evaluate(t => window.renderAt(t), i / FPS);
    const png = await shot(page);
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
    done++;
    if (done % 60 === 0) { const el = (Date.now() - t0) / 1000; console.log(`${done}/${N}  ${el.toFixed(0)}s  eta ${(el / done * (N - done)).toFixed(0)}s`); }
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
  await page.close();
}));
await browser.close(); server.close();
}
fs.writeFileSync(path.join(OUT, 'list.txt'), [...Array(WORKERS)].map((_, w) => `file 'seg${w}.mp4'`).join('\n'));
const final = path.join(OUT, 'hyetaek_evolution_9x16.mp4');
await new Promise((res, rej) => {
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'list.txt'), '-i', path.join(OUT, 'audio.wav'),
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', final], { stdio: 'inherit' });
  ff.on('close', c => c ? rej(c) : res());
});
console.log('done', final, ((Date.now() - t0) / 1000).toFixed(0) + 's');
