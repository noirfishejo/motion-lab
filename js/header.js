// ═══════════════════════════════════════════════
// 共用頁首：捲動後加底線
// ═══════════════════════════════════════════════
import { WORKS } from './works.js';
import { t, lang, setLang } from './i18n.js';
import { scrollToY } from './smooth.js';

export function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const count = header.querySelector('[data-works-count]');
  if (count) count.textContent = String(WORKS.length).padStart(2, '0');

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  setupTheme();
  document.getElementById('langToggle')?.addEventListener('click', () => setLang(lang === 'en' ? 'zh-TW' : 'en'));

  // 頁尾「回到頂部」
  document.querySelectorAll('[data-to-top]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    scrollToY(0);
  }));
}

// ── 亮色／深色切換 ──
// 按了就記住；沒按過就跟著系統（系統切換時也會跟著變）
function setupTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const root = document.documentElement;
  const render = () => {
    const light = root.dataset.theme === 'light';
    // 預覽和縮圖裡的練習也跟著換（練習載入時自己會讀一次，這裡處理「切換的當下」）
    document.querySelectorAll('iframe').forEach(f => {
      try { f.contentDocument.documentElement.dataset.theme = root.dataset.theme; } catch {}
    });
    // 圖示顯示「按下去會變成什麼」：現在亮色 → 月亮
    btn.querySelector('i').className = `ph-light ${light ? 'ph-moon' : 'ph-sun'}`;
    const label = t(light ? 'theme.toDark' : 'theme.toLight');
    btn.setAttribute('aria-label', label);
    btn.dataset.tip = label; // 本站樣式的提示框（js/interactions.js）
  };
  render();
  btn.addEventListener('click', () => {
    const apply = () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      try { localStorage.setItem('theme', root.dataset.theme); } catch {}
      render();
    };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    // 整頁的顏色淡入淡出（瀏覽器內建的 View Transitions；不支援就直接換）
    if (document.startViewTransition && !reduce) document.startViewTransition(apply); else apply();
    // 圖示轉半圈換成新的（太陽 ↔ 月亮）
    if (window.gsap && !reduce) gsap.fromTo(btn.querySelector('i'), { rotation: -120, scale: 0.4, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2)' });
  });
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch {}
    if (saved) return;
    root.dataset.theme = e.matches ? 'light' : 'dark';
    render();
  });
}
