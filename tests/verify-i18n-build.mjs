import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const PAGES = [
  'index.html', 'about.html', 'services.html', 'projects.html', 'contact.html',
  'tiles-marble.html', 'plumbing.html', 'electrical.html',
];

const failures = [];
const check = (cond, msg) => { if (!cond) failures.push(msg); };

for (const page of PAGES) {
  const enPath = join(dist, page);
  if (!existsSync(enPath)) { failures.push(`${page}: EN page missing`); continue; }
  const en = readFileSync(enPath, 'utf8');
  check(/<html lang="en" dir="ltr">/.test(en), `${page}: EN <html> lang/dir wrong`);
  check(/<a href="index\.html"[^>]*>Home<\/a>/.test(en), `${page}: EN nav "Home" missing`);

  const arPath = join(dist, 'ar', page);
  if (!existsSync(arPath)) { failures.push(`ar/${page}: AR page missing`); continue; }
  const ar = readFileSync(arPath, 'utf8');
  check(/<html lang="ar" dir="rtl">/.test(ar), `${page}: AR <html> lang/dir wrong`);
  check(ar.includes('>الرئيسية<'), `${page}: AR nav Home not translated`);
  check(ar.includes('اطلب عرض سعر'), `${page}: AR nav CTA not translated`);
  check(ar.includes('اللغة'), `${page}: AR language label not translated`);

  // Garbled / placeholder Arabic that must not survive an audit.
  const bad = ['غرفت فييرستا', 'ن discuss', 'الن finishing', 'جيروسيك', 'نيوماربل', 'سحب الأنابيب'];
  for (const s of bad) check(!ar.includes(s), `${page}: garbled/placeholder Arabic still present: "${s}"`);

  // JSON-LD must remain parseable after translation.
  const m = ar.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (m) { try { JSON.parse(m[1]); } catch (e) { failures.push(`${page}: JSON-LD invalid — ${e.message}`); } }
}

for (const f of ['assets/js/i18n.js', 'assets/js/i18n-dict.js', 'assets/js/main.js']) {
  check(existsSync(join(dist, f)), `dist/${f} missing`);
}

if (failures.length) {
  console.error(`FAIL — ${failures.length} issue(s):`);
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log(`OK — i18n build verified for ${PAGES.length} pages x 2 locales.`);
