#!/usr/bin/env node
/**
 * GRAND VIEW — automated quality checks (dependency-free).
 *
 * Run: node tests/run.js
 * Exits non-zero if any check fails. Uses only Node built-ins (no install).
 * Dev-only. Never publishes anything.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { company } from '../src/config/company.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');

const PAGES = [
  'index.html', 'about.html', 'services.html', 'tiles-marble.html',
  'plumbing.html', 'electrical.html', 'projects.html', 'contact.html',
];

let passed = 0;
let failed = 0;
const failures = [];

function ok(name) { passed++; console.log('  ✓ ' + name); }
function bad(name, detail) { failed++; failures.push(name + (detail ? ' — ' + detail : '')); console.log('  ✗ ' + name + (detail ? ' — ' + detail : '')); }
function check(name, cond, detail) { cond ? ok(name) : bad(name, detail); }

const readDist = (f) => readFileSync(join(distDir, f), 'utf8');

console.log('\nGRAND VIEW — automated checks\n');

console.log('[0] Build output');
check('dist/ exists', existsSync(distDir), 'run: node tools/build.mjs');

if (existsSync(distDir)) {
  console.log('\n[1] Routes exist');
  for (const p of PAGES) check('route ' + p, existsSync(join(distDir, p)));

  console.log('\n[2] Internal links resolve');
  const hrefRe = /href="([^"#][^"]*?)"/g;
  for (const p of PAGES) {
    if (!existsSync(join(distDir, p))) continue;
    const html = readDist(p);
    let m; const broken = [];
    while ((m = hrefRe.exec(html)) !== null) {
      const href = m[1];
      if (/^(https?:|tel:|mailto:|\/\/)/.test(href)) continue;
      const target = href.split('?')[0].split('#')[0];
      if (!target) continue;
      if (!existsSync(join(distDir, target))) broken.push(href);
    }
    check(p + ' internal links', broken.length === 0, broken.join(', '));
  }
  for (const p of PAGES) {
    const arFile = join(distDir, 'ar', p);
    if (!existsSync(arFile)) continue;
    const html = readFileSync(arFile, 'utf8');
    let m; const broken = [];
    while ((m = hrefRe.exec(html)) !== null) {
      const href = m[1];
      if (/^(https?:|tel:|mailto:|\/\/)/.test(href)) continue;
      const target = href.split('?')[0].split('#')[0];
      if (!target) continue;
      if (!existsSync(join(distDir, 'ar', target))) broken.push(href);
    }
    check('ar/' + p + ' internal links', broken.length === 0, broken.join(', '));
  }

  console.log('\n[3] Contact consistency (from company.js)');
  for (const p of PAGES) {
    if (!existsSync(join(distDir, p))) continue;
    const html = readDist(p);
    const good =
      html.includes('tel:+971581645299') &&
      html.includes('https://wa.me/971581645299') &&
      html.includes('mailto:grandviewceramic202@gmail.com') &&
      html.includes('Abu Dhabi');
    check(p + ' contact details', good);
  }
  check('config phoneDial', company.phoneDial === '+971581645299');
  check('config whatsappUrl', company.whatsappUrl === 'https://wa.me/971581645299');
  check('config email', company.email === 'grandviewceramic202@gmail.com');
}
if (existsSync(distDir)) {
  console.log('\n[4] Enquiry form fields');
  const contact = readDist('contact.html');
  for (const id of ['name', 'phone', 'location', 'email', 'service', 'message']) {
    check('field #' + id, contact.includes('id="' + id + '"'));
  }
  for (const req of ['id="name"', 'id="phone"', 'id="location"', 'id="service"', 'id="message"']) {
    const re = new RegExp(req + '[^>]*required');
    check('required on ' + req, re.test(contact));
  }
  check('form status aria-live', /id="form-status"[^>]*aria-live="polite"/.test(contact));
  check('honest "does not store" note', /does not store your details/i.test(contact));

  console.log('\n[5] WhatsApp message encoding');
  const buildMsg = (d) => [
    'Hello GRAND VIEW CERAMIC AND MARBLE WORK,', '',
    'I would like to enquire about your services.',
    'Name: ' + (d.name || '').trim(),
    'Phone: ' + (d.phone || '').trim(),
    'Location: ' + ((d.location || '').trim() || 'Not provided'),
    'Email: ' + ((d.email || '').trim() || 'Not provided'),
    'Service required: ' + ((d.service || '').trim() || 'General enquiry'),
    'Project details: ' + (d.message || '').trim(), '',
    'Please contact me to discuss the next steps.'
  ].join('\n');
  const sample = { name: 'A', phone: '+971500000000', location: 'Al Reem Island', email: '', service: 'Tile & marble work', message: 'x & y' };
  const url = 'https://wa.me/971581645299?text=' + encodeURIComponent(buildMsg(sample));
  check('wa.me prefix', url.startsWith('https://wa.me/971581645299?text='));
  check('newlines encoded', url.includes('%0A'));
  check('ampersand encoded', url.includes('%26'));
  check('no literal spaces in query', !url.split('?text=')[1].includes(' '));
  const mainJs = readFileSync(join(root, 'assets', 'js', 'main.js'), 'utf8');
  check('main.js uses wa.me/971581645299', mainJs.includes('https://wa.me/971581645299'));
  check('main.js uses encodeURIComponent', mainJs.includes('encodeURIComponent'));

  console.log('\n[6] Local assets present');
  for (const a of ['assets/images/grand-view-logo.jpg', 'assets/images/placeholder.svg', 'assets/css/styles.css', 'assets/js/main.js', 'assets/js/motion.js']) {
    check('asset ' + a, existsSync(join(distDir, a)));
  }

  console.log('\n[7] JSON-LD (Home + Contact)');
  for (const p of ['index.html', 'contact.html']) {
    const html = readDist(p);
    const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
    if (!m) { bad(p + ' has JSON-LD'); continue; }
    try { const o = JSON.parse(m[1]); check(p + ' JSON-LD parses', o['@type'] === 'LocalBusiness'); }
    catch (e) { bad(p + ' JSON-LD parses', e.message); }
  }

  console.log('\n[8] SEO & accessibility essentials');
  for (const p of PAGES) {
    const html = readDist(p);
    const title = /<title>[^<]+<\/title>/.test(html);
    const desc = /<meta name="description" content="[^"]+">/.test(html);
    const h1 = (html.match(/<h1/g) || []).length === 1;
    const lang = html.includes('<html lang="en" dir="ltr">');
    const skip = html.includes('class="skip-link"');
    const main = html.includes('<main id="main-content"');
    const og = html.includes('property="og:title"') && html.includes('og:site_name');
    check(p + ' seo/a11y', title && desc && h1 && lang && skip && main && og,
      [!title && 'title', !desc && 'desc', !h1 && 'h1', !lang && 'lang', !skip && 'skip', !main && 'main', !og && 'og'].filter(Boolean).join(','));
  }
  const css = readFileSync(join(distDir, 'assets', 'css', 'styles.css'), 'utf8');
  check('reduced-motion CSS', css.includes('prefers-reduced-motion'));
  check('motion reveal CSS', css.includes('[data-reveal]'));

  console.log('\n[8b] Binary asset integrity (no utf8 corruption)');
  // Compare a binary asset byte-for-byte between root and dist.
  for (const a of ['assets/images/grand-view-logo.jpg']) {
    const rootBuf = readFileSync(join(root, a));
    const distBuf = readFileSync(join(distDir, a));
    check(a + ' bytes identical (root vs dist)', rootBuf.length === distBuf.length && rootBuf.equals(distBuf),
      'root=' + rootBuf.length + ' dist=' + distBuf.length);
  }

  console.log('\n[9] Originals preserved (non-destructive)');
  for (const p of PAGES) check('root ' + p + ' still present', existsSync(join(root, p)));
  check('supplied logo intact', existsSync(join(root, 'assets', 'images', 'grand-view-logo.jpg')));
}

console.log('\n----------------------------------------');
console.log('PASSED: ' + passed + '   FAILED: ' + failed);
if (failed > 0) { console.log('\nFailures:'); failures.forEach((f) => console.log('  - ' + f)); process.exit(1); }
console.log('All automated checks passed.\n');

