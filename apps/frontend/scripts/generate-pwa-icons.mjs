import { fileURLToPath } from 'url';
import path from 'path';
import { promises as fs } from 'fs';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../public/icons');

async function ensureDir(dir) {
  try { await fs.mkdir(dir, { recursive: true }); } catch {}
}

function iconHtml({ size, bg = '#111827', fg = '#ffffff', text = 'CP' }) {
  const fontSize = Math.round(size * 0.45);
  return `<!doctype html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0; width:${size}px; height:${size}px; background:${bg}; display:flex; align-items:center; justify-content:center;">
  <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'; font-weight: 800; color:${fg}; font-size:${fontSize}px; letter-spacing:-0.03em;">${text}</div>
</body>
</html>`;
}

async function renderIcon(browser, { size, file, bg, fg, text }) {
  const page = await browser.newPage();
  await page.setViewport({ width: size, height: size, deviceScaleFactor: 1 });
  await page.setContent(iconHtml({ size, bg, fg, text }), { waitUntil: 'load' });
  const outPath = path.join(outDir, file);
  await page.screenshot({ path: outPath, type: 'png' });
  await page.close();
  return outPath;
}

async function main() {
  await ensureDir(outDir);
  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const tasks = [
      { size: 192, file: 'icon-192.png' },
      { size: 512, file: 'icon-512.png' },
      { size: 192, file: 'maskable-192.png' },
      { size: 512, file: 'maskable-512.png' },
    ];
    for (const t of tasks) {
      await renderIcon(browser, { ...t, bg: '#111827', fg: '#ffffff', text: 'CP' });
    }
    console.log('PWA icons generated in:', outDir);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Failed to generate PWA icons:', err);
  process.exit(1);
});
