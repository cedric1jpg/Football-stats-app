const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

(async () => {
  const outDir = path.resolve(__dirname, '..', 'screenshots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const pages = [
    { url: process.env.APP_URL || 'http://localhost:3000/', name: 'homepage' },
    { url: (process.env.APP_URL || 'http://localhost:3000') + '/teams/1', name: 'team-detail' },
    { url: (process.env.APP_URL || 'http://localhost:3000') + '/futuristic', name: 'futuristic' }
  ];

  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    for (const p of pages) {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
      console.log(`Navigating to ${p.url}`);
      const res = await page.goto(p.url, { waitUntil: 'networkidle2', timeout: 30000 });
      if (!res || !res.ok()) {
        console.warn(`Warning: navigation to ${p.url} returned status ${res && res.status()}`);
      }

      // wait for main content (use a small sleep to avoid Puppeteer API differences)
      await new Promise((resolve) => setTimeout(resolve, 800)); // short wait to allow animations

      const outPath = path.join(outDir, `${p.name}.png`);
      await page.screenshot({ path: outPath, fullPage: true });
      console.log(`Saved ${outPath}`);
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log('Screenshots finished.');
})();
