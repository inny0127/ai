// ElevenLabs API로 BGM·효과음 생성 → audio/eleven_*.mp3 (edit.mjs가 synth_*.wav 대신 사용)
//   ELEVENLABS_API_KEY=... node eleven.mjs            전부
//   node eleven.mjs bgm | boing | slam                 하나만 다시
import fs from 'node:fs';
import path from 'node:path';

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) { console.error('ELEVENLABS_API_KEY 환경 변수가 없어요 (환경 설정 → 환경 변수에 추가)'); process.exit(1); }
const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, 'audio'); fs.mkdirSync(OUT, { recursive: true });
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'edit.json'), 'utf8'));
let t = 0; const starts = cfg.shots.map(s => { const a = t; t += s.out - s.in; return a; });
const end0 = t, total = t + cfg.endcard, earth0 = starts.at(-1), f1 = n => n.toFixed(1);

const JOBS = {
  bgm: ['/v1/music', {
    prompt: `Upbeat playful K-pop style advertising jingle, 120 BPM, instrumental only, no vocals. ` +
      `0-${f1(earth0)}s: bright synth plucks, claps and bouncy bass, light and comedic, energy rising a little every 2.5 seconds. ` +
      `${f1(earth0 - 1.2)}-${f1(earth0)}s: quick riser. ${f1(earth0)}-${f1(end0)}s: drums stop, huge cinematic space pad with a deep sub boom, awe and wonder. ` +
      `${f1(end0)}s: big energetic drop with full beat. ${f1(total - 1.6)}s: catchy 4-note bright bell brand stinger, clean ending at ${f1(total)}s.`,
    music_length_ms: Math.round(total * 1000), force_instrumental: true,
  }],
  boing: ['/v1/sound-generation', { text: 'short cartoon rising "boing" pop, comedic, bright, clean, no reverb', duration_seconds: 0.5, prompt_influence: 0.6 }],
  slam: ['/v1/sound-generation', { text: 'punchy logo slam impact, deep boom with a short bright whoosh, advertising stinger', duration_seconds: 1.2, prompt_influence: 0.6 }],
};

for (const name of process.argv[2] ? [process.argv[2]] : Object.keys(JOBS)) {
  const [ep, body] = JOBS[name];
  console.log(name, '…');
  const r = await fetch(`https://api.elevenlabs.io${ep}?output_format=mp3_44100_192`, {
    method: 'POST', headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  if (!r.ok) { console.error(name, r.status, await r.text()); process.exit(1); }
  fs.writeFileSync(path.join(OUT, `eleven_${name}.mp3`), Buffer.from(await r.arrayBuffer()));
  fs.writeFileSync(path.join(OUT, `eleven_${name}.prompt.json`), JSON.stringify({ endpoint: ep, ...body }, null, 2)); // 증빙
  console.log(name, 'ok');
}
