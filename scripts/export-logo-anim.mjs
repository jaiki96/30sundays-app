// Headless export of /logo-anim → HEVC MP4 at iPhone 16 Pro res.
// Uses installed Chrome via puppeteer-core (no browser download).
// Streams CDP screencast frames into ffmpeg → H.265 MP4.
//
// Run:
//   1) npm run dev   (in another terminal)
//   2) node scripts/export-logo-anim.mjs

import puppeteer from "puppeteer-core";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

// ─── Config ────────────────────────────────────────────────────────────────
const URL          = "http://localhost:5173/logo-anim";
const WIDTH        = 1206;          // iPhone 16 Pro native
const HEIGHT       = 2622;
const FPS          = 60;            // ProMotion-friendly
const DURATION_S   = 3.0;           // covers 2.75s animation + breath
const OUT_PATH     = "exports/logo-anim.mp4";
const CHROME_BIN   = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

if (!existsSync(CHROME_BIN)) {
  console.error("Chrome not found at expected path:", CHROME_BIN);
  process.exit(1);
}

console.log("→ Launching Chrome…");
const browser = await puppeteer.launch({
  executablePath: CHROME_BIN,
  headless: "new",
  defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 },
  args: [
    `--window-size=${WIDTH},${HEIGHT}`,
    "--hide-scrollbars",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--force-device-scale-factor=1",
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });

// Make the PhoneFrame fill the viewport so the animation is full-bleed.
await page.evaluateOnNewDocument(() => {
  const css = `
    html, body, #root { width: 100vw !important; height: 100vh !important;
                        margin: 0 !important; background: #fff !important; }
    #phone-frame, .phone-frame, [class*="PhoneFrame"] {
      width: 100vw !important; height: 100vh !important;
      max-width: none !important; max-height: none !important;
      border-radius: 0 !important; box-shadow: none !important;
      transform: none !important; inset: 0 !important;
    }
  `;
  const s = document.createElement("style");
  s.textContent = css;
  document.documentElement.appendChild(s);
});

console.log(`→ Loading ${URL}…`);
await page.goto(URL, { waitUntil: "networkidle0", timeout: 30_000 });

// Hide UI chrome (back button, replay button) so only the SVG animation shows.
await page.addStyleTag({ content: `button { display: none !important; }` });

// Brief settle.
await new Promise((r) => setTimeout(r, 300));

// ─── ffmpeg: receive PNG frames over stdin → encode HEVC MP4 ─────────────
console.log("→ Starting ffmpeg (HEVC)…");
const ff = spawn("ffmpeg", [
  "-y",
  "-f", "image2pipe",
  "-framerate", String(FPS),
  "-i", "-",
  "-c:v", "libx265",
  "-crf", "22",
  "-preset", "slower",
  "-pix_fmt", "yuv420p",
  "-tag:v", "hvc1",
  "-movflags", "+faststart",
  "-r", String(FPS),
  OUT_PATH,
], { stdio: ["pipe", "inherit", "inherit"] });

// ─── CDP screencast loop ───────────────────────────────────────────────────
const client = await page.target().createCDPSession();
let frameCount = 0;
const totalFrames = Math.round(DURATION_S * FPS);

console.log(`→ Capturing ${totalFrames} frames @ ${FPS}fps (${WIDTH}×${HEIGHT})…`);

// We replay the animation by remounting the SVG component via the Replay
// button logic — but easier: just reload, then capture from t=0.
const t0 = performance.now();

await client.send("Page.startScreencast", {
  format: "png",
  quality: 100,
  maxWidth:  WIDTH,
  maxHeight: HEIGHT,
  everyNthFrame: 1,
});

await new Promise((resolve) => {
  client.on("Page.screencastFrame", async (frame) => {
    if (frameCount >= totalFrames) return;
    const buf = Buffer.from(frame.data, "base64");
    ff.stdin.write(buf);
    frameCount++;
    try { await client.send("Page.screencastFrameAck", { sessionId: frame.sessionId }); } catch {}
    if (frameCount >= totalFrames) {
      await client.send("Page.stopScreencast");
      resolve();
    }
  });
  // Safety timeout
  setTimeout(resolve, (DURATION_S + 3) * 1000);
});

const elapsed = ((performance.now() - t0) / 1000).toFixed(2);
console.log(`→ Captured ${frameCount} frames in ${elapsed}s. Closing ffmpeg…`);

ff.stdin.end();
await new Promise((resolve) => ff.on("close", resolve));
await browser.close();

console.log(`✓ Done → ${OUT_PATH}`);
