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

// ── 游標跟隨方塊 ─────────────────────────────────
// 系統游標保留（點選、選字要精準），旁邊多一個會跟著跑的品牌方塊：
// 平常是小方塊；移到可以點的東西上變成外框；移到作品卡上變成「看作品」標籤；
// 移到預覽、程式碼、輸入框上就藏起來（那裡需要專心操作）
const LAG = 0.35; // 方塊追上游標要幾秒（越大越「飄」）

export function initCursor() {
  if (!window.gsap || reduce() || !finePointer()) return;
  const el = document.createElement('div');
  el.className = 'cursor';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<span class="cursor-label">${t('cursor.view')}<i class="ph-light ph-arrow-up-right"></i></span>`;
  document.body.append(el);

  const moveX = gsap.quickTo(el, 'x', { duration: LAG, ease: 'expo.out' });
  const moveY = gsap.quickTo(el, 'y', { duration: LAG, ease: 'expo.out' });
  let first = true;

  const setState = target => {
    const hide = target.closest('iframe, .CodeMirror, input, textarea, select, .preview-frame');
    const card = target.closest('.work-card');
    const link = target.closest('a, button, [role="tab"], [role="switch"], label');
    el.classList.toggle('is-hidden', !!hide);
    el.classList.toggle('is-card', !hide && !!card);
    el.classList.toggle('is-link', !hide && !card && !!link);
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

// ── 磁吸按鈕 ─────────────────────────────────────
const STRENGTH = 0.3; // 按鈕跟著游標移動的比例（練習 09 用 0.4，網站上收斂一點）

export function magnetic(selector) {
  if (!window.gsap || reduce() || !finePointer()) return;
  document.querySelectorAll(selector).forEach(btn => {
    const mx = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'expo.out' });
    const my = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'expo.out' });
    btn.addEventListener('pointermove', e => {
      const r = btn.getBoundingClientRect();
      mx((e.clientX - (r.left + r.width / 2)) * STRENGTH);
      my((e.clientY - (r.top + r.height / 2)) * STRENGTH);
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
