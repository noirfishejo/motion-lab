// ═══════════════════════════════════════════════
// 多語系：讀取 locales/<語言>.json，填入有 data-i18n 的元素
// 預設：記住的語言 → 瀏覽器語言（中文用 zh-TW，其他用 en）
// ═══════════════════════════════════════════════
const SUPPORTED = ['zh-TW', 'en'];
const DEFAULT_LANG = 'zh-TW';
let dict = {};
export let lang = DEFAULT_LANG;

export async function initI18n() {
  // 網址帶 ?lang=en 時優先（方便分享英文版連結），不會改掉記住的設定；
  // 同一次瀏覽（同一個分頁）裡點進其他頁也沿用，不會一進作品頁又變回中文
  const forced = new URLSearchParams(location.search).get('lang');
  let session = null, saved = null;
  try {
    if (SUPPORTED.includes(forced)) sessionStorage.setItem('langForced', forced);
    session = sessionStorage.getItem('langForced');
  } catch {}
  try { saved = localStorage.getItem('lang'); } catch {}
  if (SUPPORTED.includes(forced)) lang = forced;
  else if (SUPPORTED.includes(session)) lang = session;
  else if (SUPPORTED.includes(saved)) lang = saved;
  else lang = /^zh/i.test(navigator.language) ? 'zh-TW' : 'en';

  // 語系檔讀不到（網路問題）時：先試另一個語言，再不行就顯示 key，頁面其他部分照常運作
  for (const l of [lang, ...SUPPORTED.filter(x => x !== lang)]) {
    try {
      const res = await fetch(`locales/${l}.json`);
      if (!res.ok) continue;
      dict = await res.json();
      lang = l;
      break;
    } catch {}
  }
  document.documentElement.lang = lang === 'zh-TW' ? 'zh-Hant' : lang;
  document.querySelector('meta[name="description"]')?.setAttribute('content', t('site.description'));
  applyI18n(document);
  // 語言按鈕上的字是另一種語言：標上 lang，讀屏軟體才會用對的發音
  document.getElementById('langToggle')?.setAttribute('lang', lang === 'zh-TW' ? 'en' : 'zh-Hant');
}

// 切換語言：記住後重新載入（作品頁有沒存的修改時，瀏覽器會先提醒）
export function setLang(next) {
  try { localStorage.setItem('lang', next); } catch {}
  try { sessionStorage.removeItem('langForced'); } catch {} // 自己切換過，就不再沿用分享連結的 ?lang=
  // 記下目前捲到哪裡：重新載入後回到同一個位置（首頁也不會重播開場）
  try { sessionStorage.setItem('langScroll', JSON.stringify({ path: location.pathname, y: scrollY })); } catch {}
  // 網址上的 ?lang= 要拿掉，不然重新載入後又被它蓋過去，切換鈕看起來沒反應
  const url = new URL(location.href);
  if (url.searchParams.has('lang')) { url.searchParams.delete('lang'); location.replace(url); }
  else location.reload();
}

// ['a', 'b', 'c'] → 中文「a、b 和 c」／英文「a, b and c」
export function list(items) {
  try { return new Intl.ListFormat(lang === 'zh-TW' ? 'zh-Hant' : lang, { type: 'conjunction' }).format(items); }
  catch { return items.join(', '); }
}

// t('home.intro.band', { count: 3 }) → "3 個練習"
export function t(key, vars = {}) {
  let s = dict[key] ?? key;
  for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, () => v); // 用函式：v 裡的 $& 之類不會被當成取代語法
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
