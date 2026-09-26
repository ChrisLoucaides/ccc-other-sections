/**
 * Render an animated layout page to a vertical MP4.
 *
 *   node record-video.mjs                          -> app-install-30s.mp4 (1080x1920, 30s @ 30fps)
 *   node record-video.mjs --seconds 15 --fps 60
 *   node record-video.mjs --page other.html --out other.mp4
 *
 * How it works: headless Chrome renders the page, every CSS animation is paused
 * and then seeked frame by frame through the Web Animations API, and each frame
 * is piped straight into ffmpeg. Seeking (rather than recording in real time)
 * means the output is deterministic and never drops a frame.
 *
 * Needs: Chrome, and ffmpeg via `python -m pip install imageio-ffmpeg`.
 */

import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// ---------- options ----------
const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf('--' + name);
  return i === -1 ? fallback : args[i + 1];
};
const PAGE    = opt('page', 'app-install-animated.html');
const SECONDS = parseFloat(opt('seconds', '30'));
const FPS     = parseInt(opt('fps', '30'), 10);
const WIDTH   = parseInt(opt('width', '1080'), 10);
const HEIGHT  = parseInt(opt('height', '1920'), 10);
const OUT     = path.resolve(HERE, opt('out', PAGE.replace(/\.html$/, '') + `-${SECONDS}s.mp4`));
const PORT    = parseInt(opt('port', '9333'), 10);
const CRF     = opt('crf', '18');

const TOTAL_FRAMES = Math.round(SECONDS * FPS);
const PAGE_URL = pathToFileURL(path.resolve(HERE, PAGE)).href;

// ---------- locate binaries ----------
function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    process.env.LOCALAPPDATA && path.join(process.env.LOCALAPPDATA, 'Google/Chrome/Application/chrome.exe'),
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
  ].filter(Boolean);
  const hit = candidates.find((p) => existsSync(p));
  if (!hit) throw new Error('Chrome not found. Set CHROME_PATH to the chrome executable.');
  return hit;
}

function findFfmpeg() {
  if (process.env.FFMPEG_PATH && existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  const py = spawnSync('python', ['-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'], {
    encoding: 'utf8',
  });
  const p = (py.stdout || '').trim();
  if (p && existsSync(p)) return p;
  return 'ffmpeg'; // fall back to PATH
}

// ---------- tiny CDP client ----------
class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
      }
    });
  }
  static async attach(wsUrl) {
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => {
      ws.addEventListener('open', res, { once: true });
      ws.addEventListener('error', rej, { once: true });
    });
    return new CDP(ws);
  }
  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
  async evaluate(expression) {
    const r = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || 'page error');
    return r.result.value;
  }
  close() { this.ws.close(); }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function findPageTarget() {
  for (let i = 0; i < 60; i++) {
    try {
      const list = await fetch(`http://127.0.0.1:${PORT}/json/list`).then((r) => r.json());
      const page = list.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch { /* browser not up yet */ }
    await sleep(250);
  }
  throw new Error('Could not reach Chrome DevTools endpoint.');
}

// ---------- run ----------
const chromeBin = findChrome();
const ffmpegBin = findFfmpeg();
const profile = mkdtempSync(path.join(tmpdir(), 'ccc-rec-'));

console.log(`page    ${PAGE}`);
console.log(`output  ${OUT}`);
console.log(`format  ${WIDTH}x${HEIGHT}  ${SECONDS}s @ ${FPS}fps  (${TOTAL_FRAMES} frames)`);

const chrome = spawn(chromeBin, [
  '--headless=new',
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${profile}`,
  `--window-size=${WIDTH},${HEIGHT}`,
  '--hide-scrollbars',
  '--force-device-scale-factor=1',
  '--force-color-profile=srgb',
  '--disable-gpu',
  '--allow-file-access-from-files',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
  '--no-first-run',
  '--no-default-browser-check',
  PAGE_URL,
], { stdio: 'ignore' });

// A silent audio track keeps Instagram / TikTok / Facebook happy; --no-audio drops it.
const SILENT_AUDIO = !args.includes('--no-audio');

const ffmpeg = spawn(ffmpegBin, [
  '-y',
  '-f', 'image2pipe',
  '-c:v', 'png',
  '-framerate', String(FPS),
  '-i', '-',
  ...(SILENT_AUDIO ? ['-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo'] : []),
  '-c:v', 'libx264',
  '-preset', 'slow',
  '-crf', CRF,
  '-pix_fmt', 'yuv420p',
  ...(SILENT_AUDIO ? ['-c:a', 'aac', '-b:a', '128k', '-shortest'] : []),
  '-movflags', '+faststart',
  OUT,
], { stdio: ['pipe', 'ignore', 'pipe'] });

let ffmpegErr = '';
ffmpeg.stderr.on('data', (d) => { ffmpegErr += d.toString(); });

const write = (buf) =>
  ffmpeg.stdin.write(buf) ? Promise.resolve() : new Promise((r) => ffmpeg.stdin.once('drain', r));

let cdp;
try {
  const target = await findPageTarget();
  cdp = await CDP.attach(target.webSocketDebuggerUrl);

  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH, height: HEIGHT, deviceScaleFactor: 1, mobile: false,
  });

  // Let the page's own starter fire (fonts / load / its 1.2s fallback) so the
  // timeline is live, then freeze every animation and drive it ourselves.
  await sleep(3000);
  const count = await cdp.evaluate(`
    (async () => {
      await document.fonts.ready;
      if (!document.body.classList.contains('go')) document.body.classList.add('go');
      window.__anims = document.getAnimations();
      window.__anims.forEach(a => a.pause());
      window.__seek = (ms) => { for (const a of window.__anims) { try { a.currentTime = ms; } catch (e) {} } };
      return window.__anims.length;
    })()
  `);
  if (!count) throw new Error('No CSS animations found on the page.');
  console.log(`driving ${count} animations\n`);

  const step = 1000 / FPS;
  for (let f = 0; f < TOTAL_FRAMES; f++) {
    await cdp.evaluate(`window.__seek(${(f * step).toFixed(3)})`);
    const shot = await cdp.send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    await write(Buffer.from(shot.data, 'base64'));
    if (f % FPS === 0 || f === TOTAL_FRAMES - 1) {
      const pct = Math.round(((f + 1) / TOTAL_FRAMES) * 100);
      process.stdout.write(`\r  ${String(pct).padStart(3)}%  frame ${f + 1}/${TOTAL_FRAMES}`);
    }
  }
  process.stdout.write('\n');
} finally {
  ffmpeg.stdin.end();
  cdp?.close();
  chrome.kill();
}

const code = await new Promise((r) => ffmpeg.on('close', r));
try { rmSync(profile, { recursive: true, force: true }); } catch {}

if (code !== 0) {
  console.error(ffmpegErr.split('\n').slice(-25).join('\n'));
  process.exit(code);
}
console.log(`\ndone -> ${OUT}`);
