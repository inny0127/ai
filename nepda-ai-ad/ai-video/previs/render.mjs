// 프리비즈 렌더: 컷별 720×1280 24fps mp4 (AI 참고 영상용) + 전체 애니매틱
//   node render.mjs                 전부
//   node render.mjs --only 2,6      일부 컷만
//   node render.mjs --stills 1.2    컷마다 해당 시각 정지컷 → out/stills.png
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const ROOT = path.dirname(new URL(import.meta.url).pathname), BASE = path.resolve(ROOT, '../..');
const OUT = path.join(ROOT, 'out'); fs.mkdirSync(OUT, { recursive: true });
const arg = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : null; };
const FPS = 24, W = 720, H = 1280;
const run = (args, feed) => new Promise((res, rej) => {
  const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: [feed ? 'pipe' : 'ignore', 'inherit', 'inherit'] });
  p.on('close', c => c ? rej(new Error('ffmpeg ' + c)) : res()); if (feed) feed(p.stdin);
});

const server = http.createServer((req, res) => {
  const p = path.join(BASE, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(BASE) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.js': 'text/javascript' }[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, r));
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on('pageerror', e => console.error('[page]', e.message));
page.on('console', m => m.type() === 'error' && console.error('[console]', m.text()));
await page.goto(`http://127.0.0.1:${server.address().port}/ai-video/previs/index.html`);
await page.waitForFunction(() => window.READY, null, { timeout: 120000 });
const SHOTS = await page.evaluate(() => window.SHOTS);
const only = arg('only') ? arg('only').split(',').map(Number) : SHOTS.map((_, i) => i);
const frame = (i, t) => page.evaluate(([i, t]) => window.renderAt(i, t), [i, t]);

const ST = arg('stills');
if (ST) {
  const times = ST.split(',').map(Number), raw = path.join(OUT, 'still.rgba'), files = [];
  for (const i of only) for (const t of times) {
    fs.writeFileSync(raw, Buffer.from(await frame(i, Math.min(t, SHOTS[i].dur - 0.01)), 'base64'));
    const f = path.join(OUT, `still_${i}_${t}.png`); files.push(f);
    await run(['-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-i', raw, '-vf', 'vflip,scale=270:480', '-frames:v', '1', f]);
  }
  await run([...files.flatMap(f => ['-i', f]), '-filter_complex', `${files.map((_, k) => `[${k}]`).join('')}xstack=inputs=${files.length}:grid=${times.length}x${only.length}`, path.join(OUT, 'stills.png')]
    .map(String)).catch(async () => {
      // xstack grid 미지원 ffmpeg 대비: 가로로만 이어 붙이기
      await run([...files.flatMap(f => ['-i', f]), '-filter_complex', `${files.map((_, k) => `[${k}]`).join('')}hstack=inputs=${files.length}`, path.join(OUT, 'stills.png')]);
    });
  console.log('stills', path.join(OUT, 'stills.png'));
} else {
  for (const i of only) {
    const { name, dur } = SHOTS[i], N = Math.round(dur * FPS), f = path.join(OUT, `${name}.mp4`), t0 = Date.now();
    await run(['-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-', '-vf', 'vflip,format=yuv420p',
      '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-movflags', '+faststart', f], async stdin => {
        for (let k = 0; k < N; k++) { const b = Buffer.from(await frame(i, k / FPS), 'base64'); if (!stdin.write(b)) await new Promise(r => stdin.once('drain', r)); }
        stdin.end();
      });
    console.log(`${name}  ${N}f  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  // 확인용 애니매틱 (컷 번호 표시)
  const font = path.join(BASE, 'assets/fonts/Pretendard-Bold.otf'), parts = SHOTS.map(s => path.join(OUT, `${s.name}.mp4`));
  if (parts.every(f => fs.existsSync(f))) {
    await run([...parts.flatMap(f => ['-i', f]), '-filter_complex',
      parts.map((_, k) => `[${k}:v]drawtext=fontfile=${font}:text='CUT ${k}':fontcolor=white:fontsize=34:box=1:boxcolor=black@0.5:boxborderw=10:x=24:y=24[v${k}]`).join(';') + ';' +
      parts.map((_, k) => `[v${k}]`).join('') + `concat=n=${parts.length}:v=1:a=0[v]`, '-map', '[v]', '-c:v', 'libx264', '-crf', '22', path.join(OUT, 'animatic_all.mp4')]);
    console.log('animatic', path.join(OUT, 'animatic_all.mp4'));
  }
}
await browser.close(); server.close();
