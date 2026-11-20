// ═══════════════════════════════════════════════
// 多語系：讀取 locales/<語言>.json，填入有 data-i18n 的元素
// 之後加英文：新增 locales/en.json，並把 'en' 加進 SUPPORTED
// ═══════════════════════════════════════════════
const SUPPORTED = ['zh-TW'];
const DEFAULT_LANG = 'zh-TW';
let dict = {};
export let lang = DEFAULT_LANG;

export async function initI18n() {
  try {
    const saved = localStorage.getItem('lang');
    if (SUPPORTED.includes(saved)) lang = saved;
  } catch {}
  const res = await fetch(`locales/${lang}.json`);
  dict = await res.json();
  document.documentElement.lang = lang === 'zh-TW' ? 'zh-Hant' : lang;
  applyI18n(document);
}

// t('home.intro.band', { count: 3 }) → "3 個練習"
export function t(key, vars = {}) {
  let s = dict[key] ?? key;
  for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s;
}

// <span data-i18n="nav.works"></span>
// <button data-i18n-attr="aria-label:work.copy"></button>
export function applyI18n(root) {
  root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.dataset.i18nAttr.split(';').forEach(pair => {
      const [attr, key] = pair.split(':');
      el.setAttribute(attr.trim(), t(key.trim()));
    });
  });
}

// 作品資料裡的多語欄位：{ 'zh-TW': '…', en: '…' } → 目前語言的字串
export function pick(field) {
  if (typeof field === 'string') return field;
  return field?.[lang] ?? field?.[DEFAULT_LANG] ?? '';
}
