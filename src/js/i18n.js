import { DICTIONARY, currentLang, t, LANG_META } from './i18n-dict.js';

/**
 * GRAND VIEW — i18n client runtime (NX-2 / RTL language switch).
 *
 * The static build pre-renders /ar/*.html with Arabic text nodes. This runtime
 * keeps the language switchable at runtime: it rewrites text nodes between the
 * English and Arabic dictionary values and toggles `lang` / `dir` on <html>.
 *
 * Translation is driven by text-node value matching (no data-* attributes needed),
 * so it works on every element the build emitted — nav, hero, headings, body copy.
 */
(() => {
  'use strict';

  if (!DICTIONARY) return;

  // Build bidirectional maps: exact English text -> Arabic text and back.
  const enToAr = Object.create(null);
  const arToEn = Object.create(null);
  Object.keys(DICTIONARY.en).forEach((key) => {
    const en = DICTIONARY.en[key];
    const ar = DICTIONARY.ar[key];
    if (typeof en === 'string' && typeof ar === 'string' && en && ar && en !== ar) {
      enToAr[en] = ar;
      arToEn[ar] = en;
    }
  });

  const root = document.documentElement;
  // Language the document body is currently rendered in (build-time state).
  let domLang = (root.getAttribute('lang') || 'en').toLowerCase() === 'ar' ? 'ar' : 'en';

  function walkTextNodes() {
    const nodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.nodeValue && n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function translateTo(next) {
    if (next === domLang) return;
    const map = next === 'ar' ? enToAr : arToEn;
    walkTextNodes().forEach((node) => {
      const raw = node.nodeValue;
      const lead = raw.match(/^\s*/)[0];
      const trail = raw.match(/\s*$/)[0];
      const core = raw.slice(lead.length, raw.length - trail.length);
      const swapped = map[core];
      if (swapped) node.nodeValue = lead + swapped + trail;
    });
    domLang = next;
  }

  function applyLangAttrs(lang) {
    const meta = LANG_META[lang] || LANG_META.en;
    root.setAttribute('lang', meta.htmlLang || lang);
    root.setAttribute('dir', meta.dir || 'ltr');
    const sel = document.getElementById('lang-select');
    if (sel) {
      sel.value = lang;
      sel.setAttribute('aria-label', t(lang, 'navLanguage') || 'Language');
    }
  }

  const initial = currentLang();
  translateTo(initial);
  applyLangAttrs(initial);

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target && target.id === 'lang-select')) return;
    const next = target.value === 'ar' ? 'ar' : 'en';
    if (next === domLang) return;
    translateTo(next);
    applyLangAttrs(next);
    try {
      history.replaceState(null, '', '?' + new URLSearchParams({ lang: next }));
    } catch (_) {
      /* file:// or sandboxed — ignore */
    }
  });

  window.GV_I18N = { DICTIONARY, currentLang, t, LANG_META, translateTo };
})();

