// ═══════════════════════════════════════════════
// 多語系：讀取 locales/<語言>.json，填入有 data-i18n 的元素
// 預設：記住的語言 → 瀏覽器語言（中文用 zh-TW，其他用 en）
// ═══════════════════════════════════════════════
const SUPPORTED = ['zh-TW', 'en'];
const DEFAULT_LANG = 'zh-TW';
let dict = {};
export let lang = DEFAULT_LANG;

export async function initI18n() {
  try {
    // 網址帶 ?lang=en 時優先（方便分享英文版連結），不會改掉記住的設定
    const forced = new URLSearchParams(location.search).get('lang');
    const saved = localStorage.getItem('lang');
    if (SUPPORTED.includes(forced)) lang = forced;
    else if (SUPPORTED.includes(saved)) lang = saved;
    else lang = /^zh/i.test(navigator.language) ? 'zh-TW' : 'en';
  } catch {}
  const res = await fetch(`locales/${lang}.json`);
  dict = await res.json();
  document.documentElement.lang = lang === 'zh-TW' ? 'zh-Hant' : lang;
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('site.description'));
  applyI18n(document);
}

// 切換語言：記住後重新載入（作品頁有沒存的修改時，瀏覽器會先提醒）
export function setLang(next) {
  try { localStorage.setItem('lang', next); } catch {}
  // 記下目前捲到哪裡：重新載入後回到同一個位置（首頁也不會重播開場）
  try { sessionStorage.setItem('langScroll', JSON.stringify({ path: location.pathname, y: scrollY })); } catch {}
  location.reload();
}

// ['a', 'b', 'c'] → 中文「a、b 和 c」／英文「a, b and c」
export function list(items) {
  try { return new Intl.ListFormat(lang === 'zh-TW' ? 'zh-Hant' : lang, { type: 'conjunction' }).format(items); }
  catch { return items.join(', '); }
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
