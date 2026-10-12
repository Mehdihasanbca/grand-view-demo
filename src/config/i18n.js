/** GRAND VIEW — i18n index: merges per-page dictionaries + locale helpers (NX-2/RTL). */
import enCore from './i18n/en-core.json' with { type: 'json' };
import enServices from './i18n/en-services.json' with { type: 'json' };
import enContact from './i18n/en-contact.json' with { type: 'json' };
import arCore from './i18n/ar-core.json' with { type: 'json' };
import arServices from './i18n/ar-services.json' with { type: 'json' };
import arContact from './i18n/ar-contact.json' with { type: 'json' };

export const LANGS = ['en', 'ar'];

export const LANG_META = {
  en: { dir: 'ltr', label: 'English', locale: 'en_AE', urlPrefix: '' },
  ar: { dir: 'rtl', label: 'العربية', locale: 'ar_AE', urlPrefix: 'ar' },
};

export const DICTIONARY = {
  en: { ...enCore, ...enServices, ...enContact },
  ar: { ...arCore, ...arServices, ...arContact },
};

export const DEFAULT_LANG = 'en';

/** Resolve the live locale from `?lang=`; used by the build and the client script. */
export function currentLang() {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get('lang');
  if (fromUrl === 'en' || fromUrl === 'ar') return fromUrl;
  return DEFAULT_LANG;
}

/** Translate a dot-separated key for a locale, with `{key}` variable substitution. */
export function t(lang, key, vars) {
  const map = DICTIONARY[lang] || DICTIONARY[DEFAULT_LANG];
  const fallback = DICTIONARY[DEFAULT_LANG][key];
  const str = map[key] !== undefined ? map[key] : fallback;
  if (!vars || typeof vars !== 'object') return str;
  return str.replace(/\{(#?\w+)\}/g, (_, name) => String(vars[name] ?? `{${name}}`));
}

/** Path prefix for a locale (e.g. '' for /en/, 'ar' for /ar/). */
export function langPrefix(lang) {
  return LANG_META[lang] ? LANG_META[lang].urlPrefix : '';
}

/** Locale-aware relative href (e.g. about.html -> ar/about.html for Arabic). */
export function relativeTo(href, toLang) {
  const prefix = langPrefix(toLang);
  return prefix ? `${prefix}/${href}` : href;
}

export default { LANGS, LANG_META, DICTIONARY, currentLang, t, langPrefix, relativeTo };
