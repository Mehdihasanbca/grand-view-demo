#!/usr/bin/env node
/**
 * GRAND VIEW — zero-dependency static file server (dev/test only).
 *
 * Serves a directory (default: dist/) on 127.0.0.1 so pages can be previewed
 * and browser-tested over plain HTTP. Cross-platform (Node built-ins only).
 * Never publishes or deploys anything.
 *
 * Usage: node tools/serve.mjs [--dir dist] [--port 8931]
 */

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join, normalize, extname, dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : fallback;
};

const serveDir = resolve(repoRoot, opt('--dir', 'dist'));
const port = Number(opt('--port', '8931')) || 8931;

const MIME = new Map(
  Object.entries({
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.woff2': 'font/woff2',
  })
);

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = normalize(join(serveDir, pathname));
    // Block path traversal outside the served directory.
    if (file !== serveDir && !file.startsWith(serveDir + sep)) {
      res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }
    if (!existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found: ' + pathname);
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, {
      'Content-Type': MIME.get(extname(file).toLowerCase()) || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Content-Length': body.length,
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Server error');
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`GRAND VIEW local server: ${serveDir} -> http://127.0.0.1:${port}/`);
});
