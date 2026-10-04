// 「그것이 온다」 자동 편집: 컷 정리 → 색보정·그레인 → '쿵'마다 화면 흔들림 → 날짜 카드·KV 엔드카드 → 사운드 디자인 믹스
//   node edit.mjs                클립(clips/c*.mp4) → out/그것이온다_9x16.mp4 (없는 컷은 임시 화면)
//   node edit.mjs --stills 0.5,12
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

// --project <폴더>: 다른 콘티 폴더(edit.json·clips·out)를 같은 엔진으로 편집
const TOOL = path.dirname(new URL(import.meta.url).pathname), BASE = path.resolve(TOOL, '../..');
const pi = process.argv.indexOf('--project');
const ROOT = pi > 0 ? path.resolve(process.argv[pi + 1]) : TOOL;
const OUT = path.join(ROOT, 'out'), AUD = path.join(ROOT, 'audio');
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(AUD, { recursive: true });
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'edit.json'), 'utf8'));
const FPS = cfg.fps, W = 1080, H = 1920, FONT = path.join(BASE, 'assets/fonts/Pretendard-Bold.otf');
const arg = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : null; };
const run = (args, feed) => new Promise((res, rej) => {
  const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: [feed ? 'pipe' : 'ignore', 'inherit', 'inherit'] });
  p.on('close', c => c ? rej(new Error('ffmpeg ' + c)) : res()); if (feed) feed(p.stdin);
});
const hasAudio = f => execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', f]).toString().trim() !== '';

// 타임라인
let acc = 0;
const shots = cfg.shots.map((s, i) => { const d = +(s.out - s.in).toFixed(3), o = { ...s, i, t0: acc, d }; acc += d; return o; });
const end0 = acc, total = acc + cfg.endcard;
const events = shots.flatMap(s => (s.sfx || []).map(e => ({ ...e, t: +(s.t0 + e.t).toFixed(3) })));
const silence = shots.filter(s => s.silence).map(s => [s.t0, s.t0 + s.d]);
console.log(`total ${total.toFixed(2)}s, ${shots.length}컷 + 엔드카드`);

// --- 1. 컷 정리
const segs = [];
for (const s of shots) {
  const seg = path.join(OUT, `seg${s.i}.mkv`); segs.push(seg);
  const src = s.file && path.join(ROOT, s.file);
  const vf = `scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H},fps=${FPS},setsar=1,format=yuv420p`;
  const silent = ['-f', 'lavfi', '-t', String(s.d), '-i', 'anullsrc=r=48000:cl=stereo'];
  if (src && fs.existsSync(src)) {
    const a = hasAudio(src);
    await run(['-ss', String(s.in), '-t', String(s.d), '-i', src, ...silent, '-filter_complex',
      `[0:v]${vf}[v];${a ? '[0:a]' : '[1:a]'}aresample=48000,aformat=channel_layouts=stereo,volume=${s.vol ?? 0.5},apad[a]`,
      '-map', '[v]', '-map', '[a]', '-t', String(s.d), '-c:v', 'libx264', '-crf', '12', '-preset', 'fast', '-c:a', 'pcm_s16le', seg]);
    console.log(`컷 ${s.i}: ${s.file}`);
  } else {
    const label = path.join(OUT, `label${s.i}.txt`);
    fs.writeFileSync(label, s.type === 'card' ? ' ' : `컷 ${s.i}\n${s.label || ''}`);
    const hue = s.type === 'card' ? '000000' : ['5a6b7c', '4a5866', '6b6152', '52606b', '3d5566', '5c5c5c', '4f5560', '58665a', '2a2a2e', '3f5a46'][s.i % 10];
    await run(['-f', 'lavfi', '-i', `color=c=0x${hue}:s=${W}x${H}:r=${FPS}:d=${s.d}`, ...silent,
      '-vf', `drawtext=fontfile=${FONT}:textfile=${label}:fontcolor=white@0.6:fontsize=54:line_spacing=18:x=(w-tw)/2:y=h*0.42,format=yuv420p`,
      '-t', String(s.d), '-c:v', 'libx264', '-crf', '12', '-preset', 'fast', '-c:a', 'pcm_s16le', seg]);
    if (s.type !== 'card') console.log(`컷 ${s.i}: 임시 화면 (${s.file} 없음)`);
  }
}
const endSeg = path.join(OUT, 'seg_end.mkv'); segs.push(endSeg);
await run(['-f', 'lavfi', '-i', `color=c=white:s=${W}x${H}:r=${FPS}:d=${cfg.endcard}`, '-f', 'lavfi', '-t', String(cfg.endcard), '-i', 'anullsrc=r=48000:cl=stereo',
  '-vf', 'format=yuv420p', '-t', String(cfg.endcard), '-c:v', 'libx264', '-crf', '12', '-preset', 'fast', '-c:a', 'pcm_s16le', endSeg]);
fs.writeFileSync(path.join(OUT, 'list.txt'), segs.map(f => `file '${f}'`).join('\n'));
const baseVid = path.join(OUT, 'base.mkv');
await run(['-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'list.txt'), '-c', 'copy', baseVid]);

// --- 2. 시네마틱 처리: 색보정·비네트·필름 그레인(실사 컷에만) + '쿵' 순간 화면 흔들림
const shakeEv = events.filter(e => e.shake);
const amp = shakeEv.length ? shakeEv.map(e => `${e.shake}*gte(t,${e.t})*exp(-(t-${e.t})*7)`).join('+') : '0';
const M = 28; // 흔들림 여유 픽셀
const grade = cfg.grade
  ? `eq=contrast=1.07:saturation=0.86:gamma=0.97,colorbalance=rs=-0.03:gs=-0.01:bs=0.04:rh=0.04:gh=0.01:bh=-0.04,vignette=angle=PI/4.5,noise=alls=7:allf=t,`
  : '';
const look = `[0:v]${grade}crop=${W - 2 * M}:${H - 2 * M}:'${M}+${M}*(${amp})*sin(t*61)':'${M}+${M}*(${amp})*cos(t*47)',scale=${W}:${H}:flags=lanczos[base]`; // 카드·엔드카드는 위에 불투명하게 덮임

// --- 3. 날짜 카드·엔드카드 오버레이 (기존 overlay.html 재사용)
const server = http.createServer((req, res) => {
  const p = path.join(BASE, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(BASE) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': { '.html': 'text/html', '.png': 'image/png', '.otf': 'font/otf' }[path.extname(p)] || 'application/octet-stream' });
  fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, r));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on('pageerror', e => console.error('[page]', e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/ai-video/overlay.html`);
await page.waitForFunction(() => window.READY);
await page.evaluate(c => window.init(c), cfg);

const N = Math.round(total * FPS), video = path.join(OUT, 'video.mp4');
await run(['-i', baseVid, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
  '-filter_complex', `${look};[base][1:v]overlay=format=auto:shortest=1,format=yuv420p`, '-an', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', video],
  async stdin => {
    for (let i = 0; i < N; i++) {
      const b = Buffer.from(await page.evaluate(t => window.renderAt(t), i / FPS), 'base64');
      if (!stdin.write(b)) await new Promise(r => stdin.once('drain', r));
    }
    stdin.end();
  });
const STILLS = arg('stills');
await browser.close(); server.close();

// --- 4. 사운드: 클립 현장음 + 사운드 디자인(쿵·브아아암·드론·정적·뾰옹·징글)
const lastEvent = events.filter(e => e.type === 'braam').at(-1)?.t ?? end0;
execFileSync('python3', [path.join(TOOL, 'synth.py'), JSON.stringify({ events, total, end0, drone: cfg.drone === null ? null : (cfg.drone || [shots[1]?.t0 ?? 1, silence[0]?.[0] ?? lastEvent + 2]), silence, music: cfg.music || null }), AUD], { stdio: 'inherit' });
const sfx = fs.existsSync(path.join(AUD, 'eleven_comes.mp3')) ? path.join(AUD, 'eleven_comes.mp3') : path.join(AUD, 'comes_sfx.wav');
const mute = silence.map(([a, b]) => `volume=enable='between(t,${a},${b})':volume=0`).join(',') || 'anull';
const final = path.join(OUT, cfg.output || '그것이온다_9x16.mp4');
await run(['-i', video, '-i', baseVid, '-i', sfx, '-filter_complex',
  `[1:a]aresample=48000,${mute}[amb];[2:a]aresample=48000,aformat=channel_layouts=stereo[fx];[amb][fx]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.9[a]`,
  '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', final]);
console.log('done', final);

if (STILLS) {
  for (const t of STILLS.split(',').map(Number))
    await run(['-ss', String(t), '-i', final, '-frames:v', '1', '-vf', 'scale=360:640', path.join(OUT, `still_${t}.png`)]);
}
