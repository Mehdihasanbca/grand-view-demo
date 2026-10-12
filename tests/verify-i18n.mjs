import { DICTIONARY, currentLang, t } from '../src/config/i18n.js';
const langs = ['en', 'ar'];
for (const lang of langs) {
  console.log('\n=== ' + lang + ' keys ===');
  const keys = Object.keys(DICTIONARY[lang]);
  console.log(keys.join(' | '));
  console.log('\nt("' + lang + '", "navCta")        = ' + t(lang, 'navCta'));
  console.log('t("' + lang + '", "heroH1a")      = ' + t(lang, 'heroH1a'));
  console.log('t("' + lang + '", "aboutWhoP2")   = ' + (t(lang, 'aboutWhoP2') || '(MISSING)'));
  console.log('currentLang()                     = ' + currentLang());
}
