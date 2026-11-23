// ═══════════════════════════════════════════════
// 搜尋欄：自製清除鈕、模糊搜尋建議欄、找不到時的空狀態
// 首頁（有建議欄）和作品頁側欄（清單本身就是結果，不另外跳建議）共用
// ═══════════════════════════════════════════════
import { t, pick } from './i18n.js';
import { WORKS, searchText, score, fuzzy } from './works.js';

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const animate = () => window.gsap && !reduce();
const MAX_SUGGEST = 6;
const EXAMPLES = ['Flip', 'scroll', 'toast']; // 找不到時建議試試的關鍵字

// ── 清除鈕：有字才出現，點了清空並把焦點留在輸入框 ──
// （瀏覽器自帶的 ✕ 在 CSS 裡藏起來了，樣式各家不同也不能換顏色）
export function addClearButton(input, onClear) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'search-clear';
  btn.hidden = true;
  btn.setAttribute('aria-label', t('search.clear'));
  btn.dataset.tip = t('search.clear');
  btn.innerHTML = '<i class="ph-light ph-x"></i>';
  input.after(btn);
  const sync = () => { btn.hidden = !input.value; };
  input.addEventListener('input', sync);
  btn.addEventListener('click', () => {
    input.value = '';
    sync();
    input.focus();
    onClear();
  });
  return sync;
}

// ── 建議欄（combobox）：打字時列出最符合的作品，方向鍵選、Enter 前往 ──
export function addSuggestions(input) {
  const list = document.createElement('ul');
  list.className = 'suggest';
  list.id = `${input.id}-suggest`;
  list.setAttribute('role', 'listbox');
  list.setAttribute('aria-label', t('search.suggestions'));
  list.hidden = true;
  input.closest('.search').append(list);
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', list.id);

  let active = -1;
  let items = [];

  const close = () => {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    active = -1;
  };

  const setActive = i => {
    active = i;
    [...list.children].forEach((li, n) => li.setAttribute('aria-selected', n === i));
    if (i >= 0) input.setAttribute('aria-activedescendant', list.children[i].id);
    else input.removeAttribute('aria-activedescendant');
  };

  const render = () => {
    const q = input.value.trim();
    if (!q) { close(); return; }
    items = WORKS
      .map(w => ({ w, s: score(searchText(w, t(`topic.${w.topic}`)), q) }))
      .filter(r => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, MAX_SUGGEST)
      .map(r => r.w);
    if (!items.length) { close(); return; }
    list.innerHTML = items.map((w, i) => `
      <li role="option" id="${list.id}-${i}" aria-selected="false" data-id="${w.id}">
        <span class="suggest-name">${highlight(pick(w.short), q)}</span>
        <span class="suggest-meta">${t(`topic.${w.topic}`)} · ${w.tech}</span>
      </li>`).join('');
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    setActive(-1);
    if (animate()) gsap.from(list.children, { y: -4, opacity: 0, duration: 0.3, stagger: 0.03, ease: 'expo.out' });
  };

  const go = i => { location.href = `work.html?id=${items[i].id}`; };

  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  input.addEventListener('keydown', e => {
    if (list.hidden) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((active + 1) % items.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((active - 1 + items.length) % items.length); }
    else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); go(active); }
    else if (e.key === 'Escape') { e.stopPropagation(); close(); }
  });
  // pointerdown（不是 click）：在輸入框失去焦點、建議欄被關掉之前就先處理
  list.addEventListener('pointerdown', e => {
    const li = e.target.closest('li');
    if (li) { e.preventDefault(); go([...list.children].indexOf(li)); }
  });
  list.addEventListener('pointermove', e => {
    const li = e.target.closest('li');
    if (li) setActive([...list.children].indexOf(li));
  });
  input.addEventListener('blur', close);
  return close;
}

// 把比對到的字標成強調色（只標名稱；比對到的是別的欄位就原樣顯示）
function highlight(name, query) {
  const lower = name.toLowerCase();
  const marks = new Set();
  for (const word of query.toLowerCase().split(/\s+/).filter(Boolean)) {
    fuzzy(word, lower)?.idx.forEach(i => marks.add(i));
  }
  return [...name].map((ch, i) => {
    const safe = ch.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    return marks.has(i) ? `<mark>${safe}</mark>` : safe;
  }).join('');
}

// ── 找不到的空狀態：放大鏡在框裡來回「找」，下方給幾個可以試的關鍵字 ──
// compact：作品頁側欄用的精簡版（比較小、不顯示建議關鍵字）
export function renderEmpty(box, query, { onPick, compact = false } = {}) {
  box.__loop?.kill();
  box.innerHTML = `
    <div class="empty-state${compact ? ' is-compact' : ''}">
      <span class="empty-icon" aria-hidden="true"><i class="ph-light ph-magnifying-glass"></i></span>
      <p class="empty-title"></p>
      ${compact ? '' : `<p class="empty-hint">${t('search.tryHint')}</p>
      <div class="empty-chips">${EXAMPLES.map(w => `<button type="button" class="chip" data-word="${w}">${w}</button>`).join('')}</div>`}
      <button type="button" class="btn btn-ghost btn-sm empty-clear"><i class="ph-light ph-x"></i><span>${t('search.clear')}</span></button>
    </div>`;
  box.querySelector('.empty-title').textContent = t('search.emptyTitle', { q: query });
  box.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => onPick?.(c.dataset.word)));
  box.querySelector('.empty-clear').addEventListener('click', () => onPick?.(''));

  if (!animate()) return;
  const glass = box.querySelector('.empty-icon i');
  // 進場：圖示、標題、建議依序往上浮出
  gsap.from(box.querySelectorAll('.empty-state > *'), { y: 12, opacity: 0, duration: 0.5, stagger: 0.06, ease: 'expo.out' });
  // 放大鏡沿著「∞」形的路線慢慢移動，像在找東西；空狀態被藏起來時停止（見 stopEmpty）
  box.__loop = gsap.timeline({ repeat: -1, defaults: { duration: 0.7, ease: 'sine.inOut' } })
    .to(glass, { x: 8, y: -5, rotation: 8 })
    .to(glass, { x: 0, y: 3, rotation: 0 })
    .to(glass, { x: -8, y: -5, rotation: -8 })
    .to(glass, { x: 0, y: 0, rotation: 0 });
}

export function stopEmpty(box) {
  box.__loop?.kill();
  box.__loop = null;
}
