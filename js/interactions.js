// ═══════════════════════════════════════════════
// 全站互動：把練習裡的動效用在網站本身
// · 游標跟隨方塊（練習 09 的 quickTo）
// · 磁吸按鈕（練習 09）
// · 滑動底線（練習 15）：首頁篩選列、作品頁的 HTML／CSS／JS 分頁
// · Toast 通知（練習 14）：複製、存檔的結果
// 全部在「減少動態」時關閉或改成直接顯示
// ═══════════════════════════════════════════════
import { t } from './i18n.js';

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

// ── 自訂游標 ─────────────────────────────────────
// 取代系統游標（有滑鼠的裝置才啟用；觸控、減少動態時維持系統游標）。只有一個方塊：
// · 平常：8px 品牌方塊，用 quickTo 稍微落後滑鼠一點點，移動起來比較滑順
// · 移到可以點的東西上：方塊放大成外框，把它框起來
// · 移到作品卡上：變成實心方塊，裡面是「眼睛」圖示（看作品）
// · 預覽、程式碼、輸入框：換回系統游標（打字需要文字游標；iframe 裡也收不到滑鼠位置）
const LAG = 0.16; // 方塊追上滑鼠要幾秒：0 是完全貼著，越大越滑順但越不精準（建議 0.1～0.25）

export function initCursor() {
  if (!window.gsap || reduce() || !finePointer()) return;
  const el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<i class="ph-light ph-eye"></i>';
  document.body.append(el);
  document.documentElement.classList.add('has-cursor'); // CSS：這時才把系統游標藏起來

  const moveX = gsap.quickTo(el, 'x', { duration: LAG, ease: 'power3.out' });
  const moveY = gsap.quickTo(el, 'y', { duration: LAG, ease: 'power3.out' });
  let first = true;

  const setState = target => {
    const native = !!target.closest('iframe, .CodeMirror, input, textarea, select, .preview-frame');
    const card = !native && !!target.closest('.work-card');
    const link = !native && !card && !!target.closest('a, button, [role="tab"], [role="switch"], [role="option"], label, summary');
    document.documentElement.classList.toggle('cursor-native', native);
    el.classList.toggle('is-hidden', native);
    el.classList.toggle('is-card', card);
    el.classList.toggle('is-link', link);
  };

  document.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    if (first) { gsap.set(el, { x: e.clientX, y: e.clientY }); first = false; }
    moveX(e.clientX);
    moveY(e.clientY);
    el.classList.add('is-visible');
    setState(e.target);
  }, { passive: true });
  // 游標離開視窗，或移進 iframe（之後就收不到移動事件了）時藏起來
  document.addEventListener('pointerout', e => { if (!e.relatedTarget || e.relatedTarget.tagName === 'IFRAME') el.classList.remove('is-visible'); });
  document.addEventListener('pointerdown', () => gsap.to(el, { scale: 0.8, duration: 0.15, ease: 'power2.out' }));
  document.addEventListener('pointerup', () => gsap.to(el, { scale: 1, duration: 0.5, ease: 'expo.out' }));
}

// ── 提示框（取代瀏覽器的 title）──────────────────
// 元素加上 data-tip="說明文字" 就會有：滑鼠停 0.3 秒、或用鍵盤移到上面時，下方淡入一個本站樣式的小框
// 讀屏軟體透過 aria-describedby 唸出說明；觸控裝置不顯示（沒有「停在上面」這件事）
let tipEl, tipTarget, tipTimer;
let tipHiddenAt = -Infinity;
const TIP_DELAY = 450; // 第一次要停多久才出現（毫秒）：滑過去不會一直閃
const TIP_WARM = 400;  // 提示框剛消失的這段時間內，移到別的按鈕會立刻出現（練習 31 的「暖機」）

export function initTooltips() {
  tipEl = document.createElement('div');
  tipEl.className = 'tooltip';
  tipEl.id = 'tooltip';
  tipEl.setAttribute('role', 'tooltip');
  document.body.append(tipEl);

  document.addEventListener('pointerover', e => {
    if (e.pointerType !== 'mouse') return;
    const target = e.target.closest('[data-tip]');
    if (target === tipTarget) return;
    const warm = tipTarget || performance.now() - tipHiddenAt < TIP_WARM; // 正在看提示，或剛看完
    if (target && warm) { showTip(target); return; } // 直接換到新的按鈕（提示框滑過去）
    hideTip();
    if (target) tipTimer = setTimeout(() => showTip(target), TIP_DELAY);
  });
  document.addEventListener('focusin', e => {
    const target = e.target.closest?.('[data-tip]');
    if (target && target.matches(':focus-visible')) showTip(target); else hideTip();
  });
  document.addEventListener('focusout', hideTip);
  document.addEventListener('pointerdown', hideTip);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hideTip(); });
  window.addEventListener('scroll', hideTip, { passive: true });
}

function showTip(target) {
  clearTimeout(tipTimer);
  if (!target.isConnected || target.hidden || !target.dataset.tip) return;
  const from = tipTarget && tipEl.classList.contains('is-shown') ? { left: tipEl.style.left, top: tipEl.style.top } : null;
  tipTarget?.removeAttribute('aria-describedby');
  tipTarget = target;
  tipEl.textContent = target.dataset.tip;
  target.setAttribute('aria-describedby', 'tooltip');
  // 位置：目標下方置中；太靠近畫面底部就改放上方；左右不超出畫面
  const r = target.getBoundingClientRect();
  tipEl.classList.add('is-measuring');
  const w = tipEl.offsetWidth, h = tipEl.offsetHeight;
  tipEl.classList.remove('is-measuring');
  const gap = 8, edge = 12;
  const below = r.bottom + gap + h < innerHeight - edge;
  const left = Math.min(Math.max(r.left + r.width / 2 - w / 2, edge), innerWidth - w - edge);
  const top = below ? r.bottom + gap : r.top - gap - h;
  tipEl.dataset.side = below ? 'bottom' : 'top';
  if (from && window.gsap && !reduce()) {
    // 已經有提示框：從原本的位置滑到新按鈕（不淡出再淡入，比較不閃）
    gsap.fromTo(tipEl, { left: from.left, top: from.top }, { left, top, duration: 0.25, ease: 'expo.out', overwrite: true });
  } else {
    window.gsap?.killTweensOf(tipEl);
    tipEl.style.left = `${left}px`;
    tipEl.style.top = `${top}px`;
  }
  tipEl.classList.add('is-shown');
}

function hideTip() {
  clearTimeout(tipTimer);
  if (!tipTarget) return;
  tipTarget.removeAttribute('aria-describedby');
  tipTarget = null;
  tipHiddenAt = performance.now();
  tipEl.classList.remove('is-shown');
}

// ── 磁吸按鈕 ─────────────────────────────────────
const STRENGTH = 0.3; // 按鈕跟著游標移動的比例（練習 09 用 0.4，網站上收斂一點）

export function magnetic(selector) {
  if (!window.gsap || reduce() || !finePointer()) return;
  document.querySelectorAll(selector).forEach(btn => {
    const mx = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'expo.out' });
    const my = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'expo.out' });
    // 中心點在進來時量一次（扣掉按鈕目前被吸走的位移）：移動時不再每次讀版面，也不會因為按鈕自己在動而越吸越偏
    let cx = 0, cy = 0;
    btn.addEventListener('pointerenter', () => {
      const r = btn.getBoundingClientRect();
      cx = r.left + r.width / 2 - gsap.getProperty(btn, 'x');
      cy = r.top + r.height / 2 - gsap.getProperty(btn, 'y');
    });
    btn.addEventListener('pointermove', e => {
      mx((e.clientX - cx) * STRENGTH);
      my((e.clientY - cy) * STRENGTH);
    });
    btn.addEventListener('pointerleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.45)' }));
  });
}

// ── 滑動底線 ─────────────────────────────────────
// 整排只有一條底線，量出選中項目的位置和寬度，用 x 和 scaleX 滑過去（練習 15 的做法）
// inset：底線左右各內縮多少，對齊文字而不是整顆按鈕
export function slidingIndicator(container, isActive, inset = 0) {
  const line = document.createElement('span');
  line.className = 'slide-line';
  line.setAttribute('aria-hidden', 'true');
  container.append(line);
  const BASE = 100; // CSS 裡底線本身的寬度

  const update = (animate = true) => {
    const item = [...container.querySelectorAll('button')].find(isActive);
    if (!item) return;
    const to = { x: item.offsetLeft + inset, scaleX: (item.offsetWidth - inset * 2) / BASE };
    if (!animate || !window.gsap || reduce()) {
      if (window.gsap) gsap.set(line, to);
      else line.style.transform = `translateX(${to.x}px) scaleX(${to.scaleX})`;
    } else {
      gsap.to(line, { ...to, duration: 0.5, ease: 'expo.out', overwrite: true });
    }
  };
  update(false);
  document.fonts?.ready.then(() => update(false));
  new ResizeObserver(() => update(false)).observe(container);
  return update;
}

// ── Toast 通知 ───────────────────────────────────
// 從右下角滑入、停一下自動消失；新的把舊的往上推（練習 14 的簡化版）
// 讀屏軟體由各頁自己的 role="status" 唸出，這裡的通知只給眼睛看（aria-hidden）
const LIFETIME = 2.6;
let stack;

export function toast(message, type = 'success') {
  if (!stack) {
    stack = document.createElement('ol');
    stack.className = 'toasts';
    stack.setAttribute('aria-hidden', 'true');
    document.body.append(stack);
  }
  const icon = { success: 'ph-check-circle', error: 'ph-warning-circle' }[type];
  const wrap = document.createElement('li');
  wrap.className = 'toast-wrap';
  wrap.innerHTML = `<div class="toast" data-type="${type}"><i class="ph-light ${icon}"></i><span></span></div>`;
  wrap.querySelector('span').textContent = message;
  stack.append(wrap);

  const remove = () => {
    if (!window.gsap || reduce()) { wrap.remove(); return; }
    gsap.timeline({ onComplete: () => wrap.remove() })
      .to(wrap.firstElementChild, { x: 40, opacity: 0, duration: 0.25, ease: 'power2.in' })
      .to(wrap, { height: 0, duration: 0.3, ease: 'expo.inOut' });
  };
  if (window.gsap && !reduce()) {
    gsap.timeline()
      .from(wrap, { height: 0, duration: 0.4, ease: 'expo.out' })
      .from(wrap.firstElementChild, { y: 20, opacity: 0, duration: 0.45, ease: 'expo.out' }, 0);
    gsap.delayedCall(LIFETIME, remove);
  } else {
    setTimeout(remove, LIFETIME * 1000);
  }
}
