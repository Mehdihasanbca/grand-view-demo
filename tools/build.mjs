#!/usr/bin/env node
/**
 * GRAND VIEW — static build injector.
 *
 * Reads the EXISTING root *.html pages (preserved, non-destructive), extracts each page's
 * <head> metadata and <main> body, then re-assembles a page using the canonical chrome partials
 * and the single company-config source of truth. Output goes to dist/.
 *
 * Why: header/footer/topbar/WhatsApp/scripts live in ONE place (partials + config), so contact
 * details cannot drift across pages (ADR-002). Page bodies are taken verbatim from the working
 * originals, so nothing is lost.
 *
 * Usage: node tools/build.mjs
 * Dev-only. Never publishes anything.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { company, navigation } from '../src/config/company.js';
import { DICTIONARY, LANG_META, LANGS } from '../src/config/i18n.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const distDir = join(root, 'dist');
const partialsDir = join(root, 'src', 'templates', 'partials');

// Text vs binary: text files are read/written as utf8; binary (images/fonts) is copied as raw
// Buffers so bytes are preserved exactly (a JPG must never be utf8-decoded — see bug note).
const TEXT_EXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.txt', '.xml', '.md']);
const isText = (p) => TEXT_EXT.has(extname(p).toLowerCase());

const PAGES = [
  { file: 'index.html', key: 'home' },
  { file: 'about.html', key: 'about' },
  { file: 'services.html', key: 'services' },
  { file: 'tiles-marble.html', key: 'tiles' },
  { file: 'plumbing.html', key: 'plumbing' },
  { file: 'electrical.html', key: 'electrical' },
  { file: 'projects.html', key: 'projects' },
  { file: 'contact.html', key: 'contact' },
];

const read = (p) => readFileSync(p, 'utf8');
const partial = (name) => read(join(partialsDir, name));

/** Extract the <head>...</head> block. */
function extractHead(html) {
  const m = html.match(/<head>[\s\S]*?<\/head>/i);
  if (!m) throw new Error('No <head> found');
  return m[0];
}

/** Extract the inner HTML of <main ...> ... </main>. */
function extractMainBody(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) throw new Error('No <main> found');
  return m[1].trim();
}

/**
 * Add data-reveal to selected containers for a subtle scroll-in (motion.js).
 * Only targets section-level wrappers that don't already reveal, so it's safe and idempotent.
 */
function addReveals(body) {
  return body
    .replace(/<section class="section(?: section-panel| section-paper| section-sm)?"/g,
      (m) => m + ' data-reveal')
    .replace(/<section class="section-sm"/g, (m) => m + ' data-reveal');
}

/** Pull <title> and meta description out of an existing <head>. */
function extractMeta(head) {
  const title = (head.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1].trim();
  const desc = (head.match(/<meta name="description" content="([\s\S]*?)">/i) || [, ''])[1].trim();
  const jsonLdMatch = head.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i);
  const jsonLd = jsonLdMatch ? jsonLdMatch[0] : '';
  return { title, description: desc, jsonLd };
}

/** Build nav links with the correct aria-current for the active page. */
function buildNav(activeKey) {
  // Service detail pages highlight "Services".
  const servicePages = ['tiles', 'plumbing', 'electrical'];
  return navigation
    .map((item) => {
      const isActive =
        item.key === activeKey || (item.key === 'services' && servicePages.includes(activeKey));
      const cur = isActive ? ' aria-current="page"' : '';
      return `<a href="${item.href}"${cur}>${item.label}</a>`;
    })
    .join('');
}

/** Replace {{token}} placeholders using a values map. */
function fill(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in values ? values[k] : ''));
}

/** English text -> Arabic text map built from the bilingual dictionary. */
const EN_TO_AR = (() => {
  const map = new Map();
  Object.keys(DICTIONARY.en).forEach((key) => {
    const en = DICTIONARY.en[key];
    const ar = DICTIONARY.ar[key];
    if (typeof en === 'string' && typeof ar === 'string' && en && ar && en !== ar) {
      map.set(en, ar);
      // Also index the HTML-escaped form so `&` in text nodes still matches.
      if (en.includes('&')) map.set(en.replace(/&/g, '&amp;'), ar);
    }
  });
  return map;
})();

/**
 * Translate every text node in an HTML string from English to Arabic using the
 * dictionary. <script>/<style> content is protected so JSON-LD stays valid.
 */
function translateHtmlToArabic(html) {
  const blocks = [];
  const protectedHtml = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, (m) => {
    blocks.push(m);
    return '\u0000' + (blocks.length - 1) + '\u0000';
  });
  const translated = protectedHtml.replace(/>([^<>]+)</g, (m, text) => {
    const lead = (text.match(/^\s*/) || [''])[0];
    const trail = (text.match(/\s*$/) || [''])[0];
    const core = text.slice(lead.length, text.length - trail.length);
    const ar = EN_TO_AR.get(core);
    return ar ? '>' + lead + ar + trail + '<' : m;
  });
  return translated.replace(/\u0000(\d+)\u0000/g, (_, i) => blocks[Number(i)]);
}

function build() {
  if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true });

  // Copy static assets referenced by pages into dist/.
  const assetsSrc = join(root, 'assets');
  const assetsDst = join(distDir, 'assets');
  copyDir(assetsSrc, assetsDst);
  // Include the modular JS (motion reveal) so dist is self-contained.
  copyDir(join(root, 'src', 'js'), join(assetsDst, 'js'));
  for (const extra of ['robots.txt', 'sitemap.xml']) {
    if (existsSync(join(root, extra))) writeFileSync(join(distDir, extra), read(join(root, extra)));
  }

  const headTpl = partial('head.html');
  const topTpl = partial('chrome-top.html');
  const bottomTpl = partial('chrome-bottom.html');

  const built = [];
  for (const page of PAGES) {
    const src = read(join(root, page.file));
    const head = extractHead(src);
    const body = addReveals(extractMainBody(src));
    const { title, description, jsonLd } = extractMeta(head);

    for (const lang of LANGS) {
      const isAr = lang === 'ar';
      const assetPrefix = isAr ? '../' : '';
      const pagePrefix = '';
      const brandHref = 'index.html';
      const contactHref = 'contact.html';

      const contactCurrent = page.key === 'contact' ? ' aria-current="page"' : '';
      const topBase = fill(topTpl, {
        assetPrefix,
        brandHref,
        contactHref,
        locationShort: company.locationShort,
        phoneDisplay: company.phoneDisplay,
        telHref: company.telHref,
        navLinks: buildNav(page.key),
        contactCurrent,
      });

      const bottomOut = fill(bottomTpl, {
        assetPrefix,
        pagePrefix,
        location: company.location,
        phoneDisplay: company.phoneDisplay,
        telHref: company.telHref,
        email: company.email,
        mailtoHref: company.mailtoHref,
        whatsappUrl: company.whatsappUrl,
        tagline: company.tagline,
      });

      const meta = LANG_META[lang];
      const headOut = fill(headTpl, {
        assetPrefix,
        title,
        description,
        jsonLd: jsonLd ? '\n' + jsonLd : '',
        htmlLang: lang,
        htmlDir: meta.dir,
        ogLocale: meta.locale,
      });

      let out = [
        headOut,
        `<body data-page="${page.key}">`,
        topBase,
        body,
        bottomOut,
      ].join('\n');

      if (isAr) out = translateHtmlToArabic(out);

      const target = isAr ? join(distDir, 'ar') : distDir;
      if (!existsSync(target)) mkdirSync(target, { recursive: true });
      writeFileSync(join(target, page.file), out);
      built.push((isAr ? 'ar/' : '') + page.file);
    }
  }

  console.log('Built ' + built.length + ' pages into dist/:');
  for (const f of built) console.log('  - ' + f);
}

function copyDir(src, dst) {
  if (!existsSync(dst)) mkdirSync(dst, { recursive: true });
  for (const entry of readdirSync(src)) {
    const s = join(src, entry);
    const d = join(dst, entry);
    const st = statSync(s);
    if (st.isDirectory()) {
      copyDir(s, d);
    } else if (isText(s)) {
      writeFileSync(d, readFileSync(s, 'utf8'));   // text: preserve as utf8
    } else {
      writeFileSync(d, readFileSync(s));            // binary: copy raw bytes exactly
    }
  }
}

build();
