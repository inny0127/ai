// 범용: 페이지를 열고 window.out 의 dataURL 들을 PNG로 저장
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire('/opt/node22/lib/node_modules/'); const { chromium } = require('playwright');
const ROOT = path.dirname(new URL(import.meta.url).pathname);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.otf': 'font/otf', '.ttf': 'font/ttf' };
const server = http.createServer((req, res) => { const p = path.join(ROOT, decodeURIComponent(req.url.split('?')[0])); if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); } res.writeHead(200, { 'Content-Type': MIME[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res); });
await new Promise(r => server.listen(0, r));
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
page.on('console', m => console.log('[c]', m.text())); page.on('pageerror', e => console.log('[e]', e.message));
await page.goto(`http://127.0.0.1:${server.address().port}/${process.argv[2]}`);
await page.waitForFunction(() => window.READY === true, null, { timeout: 300000 });
const out = await page.evaluate(() => window.out);
fs.mkdirSync(path.join(ROOT, 'out'), { recursive: true });
for (const [k, v] of Object.entries(out)) {
  if (typeof v === 'string' && v.startsWith('data:image')) fs.writeFileSync(path.join(ROOT, 'out', `pv_${k}.png`), Buffer.from(v.split(',')[1], 'base64'));
  else console.log(k, JSON.stringify(v));
}
await browser.close(); server.close();
