// A안 「얼마나 크냐면」 자동 편집: 클립 자르기 → 이어 붙이기 → 자막·게이지·KV 엔드카드 → 음악·효과음 믹스
//   node edit.mjs                 clips/shot0~6.mp4 → out/얼마나크냐면_9x16.mp4 (없는 컷은 임시 화면)
//   node edit.mjs --stills 1,16   자막 확인용 정지컷 → out/stills
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/');
const { chromium } = require('playwright');

const ROOT = path.dirname(new URL(import.meta.url).pathname), BASE = path.dirname(ROOT);
const OUT = path.join(ROOT, 'out'), AUD = path.join(ROOT, 'audio');
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(AUD, { recursive: true });
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'edit.json'), 'utf8'));
const FPS = cfg.fps, W = 1080, H = 1920, FONT = path.join(BASE, 'assets/fonts/Pretendard-Black.otf');
const arg = k => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : null; };
const run = (args, input) => new Promise((res, rej) => {
  const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: [input ? 'pipe' : 'ignore', 'inherit', 'inherit'] });
  p.on('close', c => c ? rej(new Error('ffmpeg ' + c)) : res()); if (input) input(p.stdin);
});
const hasAudio = f => execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', f]).toString().trim() !== '';

// 타임라인
let acc = 0;
const shots = cfg.shots.map((s, i) => { const d = +(s.out - s.in).toFixed(3), o = { ...s, i, t0: acc, d }; acc += d; return o; });
const end0 = acc, total = acc + cfg.endcard;
console.log(`total ${total.toFixed(2)}s  (컷 ${shots.map(s => s.d).join(' + ')} + 엔드카드 ${cfg.endcard})`);

// --- 오버레이 렌더러 (헤드리스 크로미움)
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
const done = async () => { await browser.close(); server.close(); };

const STILLS = arg('stills');
if (STILLS) {
  const dir = path.join(OUT, 'stills'); fs.mkdirSync(dir, { recursive: true });
  for (const t of STILLS.split(',').map(Number)) {
    const s = shots.find(s => t >= s.t0 && t < s.t0 + s.d), src = s && path.join(ROOT, s.file);
    const raw = path.join(dir, 'ov.rgba'); fs.writeFileSync(raw, Buffer.from(await page.evaluate(t => window.renderAt(t), t), 'base64'));
    const bg = s && fs.existsSync(src) ? ['-ss', String(s.in + t - s.t0), '-i', src] : ['-f', 'lavfi', '-i', `color=c=0x5a6b7c:s=${W}x${H}`];
    await run([...bg, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-i', raw, '-filter_complex',
      `[0:v]scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H}[b];[b][1:v]overlay`, '-frames:v', '1', path.join(dir, `t${t.toFixed(2)}.png`)]);
    console.log('still', t);
  }
  await done(); process.exit(0);
}

// --- 1. 컷 정리: 1080×1920·30fps로 맞추고 in~out 구간만
const segs = [];
for (const s of shots) {
  const src = path.join(ROOT, s.file), seg = path.join(OUT, `seg${s.i}.mkv`); segs.push(seg);
  const vf = `scale=${W}:${H}:force_original_aspect_ratio=increase:flags=lanczos,crop=${W}:${H},fps=${FPS},setsar=1,format=yuv420p`;
  if (fs.existsSync(src)) {
    const a = hasAudio(src);
    await run(['-ss', String(s.in), '-t', String(s.d), '-i', src, '-f', 'lavfi', '-t', String(s.d), '-i', 'anullsrc=r=48000:cl=stereo',
      '-filter_complex', `[0:v]${vf}[v];${a ? '[0:a]' : '[1:a]'}aresample=48000,aformat=channel_layouts=stereo,apad[a]`,
      '-map', '[v]', '-map', '[a]', '-t', String(s.d), '-c:v', 'libx264', '-crf', '12', '-preset', 'fast', '-c:a', 'pcm_s16le', seg]);
    console.log(`컷 ${s.i}: ${s.file} [${s.in}~${s.out}]${a ? '' : ' (소리 없음)'}`);
  } else {
    const label = path.join(OUT, `label${s.i}.txt`); fs.writeFileSync(label, `컷 ${s.i}\n(${s.file} 없음)`);
    const hue = [0x3d5a80, 0x7a4e2d, 0x2d6a4f, 0x5c4d7d, 0x6d6875, 0x386641, 0x0b132b][s.i % 7].toString(16).padStart(6, '0');
    await run(['-f', 'lavfi', '-i', `color=c=0x${hue}:s=${W}x${H}:r=${FPS}:d=${s.d}`, '-f', 'lavfi', '-t', String(s.d), '-i', 'anullsrc=r=48000:cl=stereo',
      '-vf', `drawtext=fontfile=${FONT}:textfile=${label}:fontcolor=white@0.55:fontsize=64:line_spacing=20:x=(w-tw)/2:y=h*0.45,format=yuv420p`,
      '-t', String(s.d), '-c:v', 'libx264', '-crf', '12', '-preset', 'fast', '-c:a', 'pcm_s16le', seg]);
    console.log(`컷 ${s.i}: 임시 화면 (${s.file} 없음)`);
  }
}
const endSeg = path.join(OUT, 'seg_end.mkv'); segs.push(endSeg);
await run(['-f', 'lavfi', '-i', `color=c=white:s=${W}x${H}:r=${FPS}:d=${cfg.endcard}`, '-f', 'lavfi', '-t', String(cfg.endcard), '-i', 'anullsrc=r=48000:cl=stereo',
  '-vf', 'format=yuv420p', '-t', String(cfg.endcard), '-c:v', 'libx264', '-crf', '12', '-preset', 'fast', '-c:a', 'pcm_s16le', endSeg]);
fs.writeFileSync(path.join(OUT, 'list.txt'), segs.map(f => `file '${f}'`).join('\n'));
const baseVid = path.join(OUT, 'base.mkv');
await run(['-f', 'concat', '-safe', '0', '-i', path.join(OUT, 'list.txt'), '-c', 'copy', baseVid]);

// --- 2. 자막·게이지·엔드카드 합성
const N = Math.round(total * FPS), video = path.join(OUT, 'video.mp4'), t0 = Date.now();
await run(['-i', baseVid, '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-',
  '-filter_complex', '[0:v][1:v]overlay=format=auto:shortest=1,format=yuv420p', '-an', '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', video],
  async stdin => {
    for (let i = 0; i < N; i++) {
      const b = Buffer.from(await page.evaluate(t => window.renderAt(t), i / FPS), 'base64');
      if (!stdin.write(b)) await new Promise(r => stdin.once('drain', r));
      if (i % 150 === 0) console.log(`overlay ${i}/${N}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    stdin.end();
  });
await done();

// --- 3. 소리: Veo 대사·현장음 + BGM(대사 나올 때 자동으로 작아짐) + 컷마다 음정이 오르는 '뾰옹' + 로고 쾅
const pick = n => ['eleven_' + n + '.mp3', 'synth_' + n + '.wav'].map(f => path.join(AUD, f)).find(f => fs.existsSync(f));
if (!fs.existsSync(path.join(AUD, 'eleven_bgm.mp3'))) { // 합성 BGM은 컷 길이에 맞춰 매번 새로
  execFileSync('python3', [path.join(ROOT, 'synth.py'), JSON.stringify({ t0: shots.map(s => s.t0), end0, total })], { stdio: 'inherit' });
}
const bgm = pick('bgm'), boing = pick('boing'), slam = pick('slam');
console.log('audio:', [bgm, boing, slam].map(f => path.basename(f)).join(', '));
const people = shots.filter(s => s.type !== 'earth'), earth0 = shots.find(s => s.type === 'earth')?.t0 ?? end0;
const ms = t => Math.max(0, Math.round(t * 1000));
const fc = [
  `[1:a]aresample=48000,volume=1.15,asplit=2[dlg][key]`,
  `[2:a]aresample=48000,aformat=channel_layouts=stereo,volume='if(lt(t,${earth0}),0.30,0.9)':eval=frame[bg0]`,
  `[bg0][key]sidechaincompress=threshold=0.02:ratio=8:attack=8:release=300[bg]`,
  `[3:a]aresample=48000,aformat=channel_layouts=stereo,asplit=${people.length}${people.map((_, k) => `[bi${k}]`).join('')}`,
  ...people.map((s, k) => `[bi${k}]asetrate=${Math.round(48000 * 2 ** (k * 2 / 12))},aresample=48000,volume=0.45,adelay=${ms(s.t0 + s.say - 0.05)}:all=1[b${k}]`),
  `[4:a]aresample=48000,aformat=channel_layouts=stereo,volume=0.9,adelay=${ms(end0 + 0.08)}:all=1[sl]`,
  `[dlg][bg]${people.map((_, k) => `[b${k}]`).join('')}[sl]amix=inputs=${people.length + 3}:duration=first:normalize=0,alimiter=limit=0.89[a]`,
].join(';');
const final = path.join(ROOT, 'out', '얼마나크냐면_9x16.mp4');
await run(['-i', video, '-i', baseVid, '-i', bgm, '-i', boing, '-i', slam, '-filter_complex', fc,
  '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', '-shortest', final]);
console.log('done', final);
