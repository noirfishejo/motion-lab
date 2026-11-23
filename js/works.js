// ═══════════════════════════════════════════════
// 作品資料：每個練習的名稱、說明、筆記放在自己資料夾的 meta.json
// tools/build_works.py 會把它們合成 js/works-data.js（serve.py 自動執行），這裡再轉出去給各頁使用
// ── 命名與分類規則（新增練習時照這個寫，搜尋才找得到） ──
// title：看得到的東西（元件或效果）＋情境，用設計師會搜尋的詞，不用 GSAP 名詞開頭。例：「浮動標籤輸入框」
// short：側欄用的名稱，中文 8 個字以內。例：「浮動標籤」
// topic（分類，依用途）：forms 表單／overlays 導覽與浮層／feedback 回饋與狀態／transitions 進場與轉場／scroll 捲動／graphics 文字與視覺效果
// tech：主要的 GSAP 功能，例：Tween、Timeline、ScrollTrigger、Flip、Draggable、SplitText
// tags：細節技巧（gsap.to、stagger、overwrite…）
// 文字欄位都寫成 { 'zh-TW': '…', en: '…' }；少了 en 會自動顯示中文
// ═══════════════════════════════════════════════
export { WORKS } from './works-data.js';

export const TOPICS = ['forms', 'overlays', 'feedback', 'transitions', 'scroll', 'graphics'];

// ── 搜尋（首頁和作品頁側欄共用） ─────────────────
// 每個欄位用「|」分開：中英文名稱、短名稱、分類名稱、GSAP 功能、標籤（全部轉小寫）
export function searchText(w, topicLabel) {
  const both = f => (typeof f === 'string' ? [f] : Object.values(f || {}));
  return [...both(w.short), ...both(w.title), topicLabel, w.tech, ...w.tags].join(' | ').toLowerCase();
}

// 模糊比對：一個字詞在一個欄位裡的分數（找不到回傳 null）
// · 連續出現（例如「flip」在「flip 展開」裡）分數最高，越前面越高
// · 不連續但依序出現、而且字母之間的距離不遠（例如打錯或漏字：「swtch」→「switch」）也算，分數較低
// 回傳 idx：比對到的字元位置（建議欄用來把字標成強調色）
export function fuzzy(word, field) {
  const at = field.indexOf(word);
  if (at >= 0) return { score: 100 - at + (at === 0 ? 20 : 0), idx: [...word].map((_, i) => at + i) };
  // 從第一個字母每一個出現的位置都試一次，取「字母最集中」的那一組
  // （例如「btn」在「submit button」裡：從 submit 的 b 開始會散太開，從 button 的 b 開始才對）
  let best = null;
  for (let start = field.indexOf(word[0]); start >= 0; start = field.indexOf(word[0], start + 1)) {
    const idx = [start];
    let from = start + 1;
    for (const ch of word.slice(1)) {
      const i = field.indexOf(ch, from);
      if (i < 0) break;
      idx.push(i);
      from = i + 1;
    }
    if (idx.length < word.length) break; // 後面的位置更不可能配到
    const span = idx[idx.length - 1] - start + 1;
    if (!best || span < best.span) best = { span, idx };
  }
  if (!best || best.span > word.length * 2 + 2) return null; // 字母散太開：不算符合（避免什麼都配得到）
  return { score: 50 - (best.span - word.length) * 5 - best.idx[0], idx: best.idx };
}

// 整個查詢的分數：每個字詞（用空白分開）都要配到某個欄位，分數相加；有一個配不到就回傳 -1
export function score(text, query) {
  const fields = text.split(' | ');
  const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  let total = 0;
  for (const word of words) {
    let best = null;
    for (const f of fields) {
      const r = fuzzy(word, f);
      if (r && (!best || r.score > best.score)) best = r;
    }
    if (!best) return -1;
    total += best.score;
  }
  return total;
}

export function matches(text, query) {
  return !query.trim() || score(text, query) >= 0;
}
