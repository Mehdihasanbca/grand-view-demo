/**
 * Performance measurement script for Grand View static site.
 * Spawns an internal HTTP static server (matching playwright.config.js),
 * navigates with Playwright Chromium, and captures PerformanceNavigationTiming,
 * paint metrics (FP, FCP), resource counts, and payload transfer sizes.
 *
 * Local development only.
 */
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from '@playwright/test';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

const distDir = join(process.cwd(), 'dist');

function startServer(port = 8935) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const urlPath = req.url.split('?')[0];
      const filePath = join(distDir, urlPath === '/' ? 'index.html' : urlPath);
      if (existsSync(filePath) && statSync(filePath).isFile()) {
        const ext = extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(readFileSync(filePath));
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function run() {
  const port = 8935;
  const server = await startServer(port);
  const browser = await chromium.launch({ headless: true });

  const routes = [
    { name: 'Home (EN)', url: `http://127.0.0.1:${port}/index.html` },
    { name: 'Home (AR)', url: `http://127.0.0.1:${port}/ar/index.html` },
    { name: 'Services (EN)', url: `http://127.0.0.1:${port}/services.html` },
    { name: 'Contact (EN)', url: `http://127.0.0.1:${port}/contact.html` },
  ];

  console.log('=== Performance Measurement Report ===');
  for (const r of routes) {
    const page = await browser.newPage();
    await page.goto(r.url, { waitUntil: 'load' });
    const data = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0];
      const paints = performance.getEntriesByType('paint');
      const resources = performance.getEntriesByType('resource');
      const fcp = paints.find((p) => p.name === 'first-contentful-paint');
      return {
        ttfb: Math.round(nav.responseStart - nav.requestStart),
        domContentLoaded: Math.round(nav.domContentLoadedEventEnd - nav.startTime),
        load: Math.round(nav.loadEventEnd - nav.startTime),
        fcp: fcp ? Math.round(fcp.startTime) : null,
        resourceCount: resources.length,
        cssCount: resources.filter((res) => res.initiatorType === 'css' || res.name.endsWith('.css')).length,
        jsCount: resources.filter((res) => res.initiatorType === 'script' || res.name.endsWith('.js')).length,
        imgCount: resources.filter((res) => res.initiatorType === 'img' || /\.(png|jpg|jpeg|svg|webp)/.test(res.name)).length,
      };
    });
    console.log(`\nRoute: ${r.name}`);
    console.log(`  TTFB: ${data.ttfb} ms`);
    console.log(`  FCP:  ${data.fcp} ms`);
    console.log(`  DCL:  ${data.domContentLoaded} ms`);
    console.log(`  Load: ${data.load} ms`);
    console.log(`  Resources: total=${data.resourceCount} (css=${data.cssCount}, js=${data.jsCount}, img=${data.imgCount})`);
    await page.close();
  }

  await browser.close();
  server.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
