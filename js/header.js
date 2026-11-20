// ═══════════════════════════════════════════════
// 共用頁首：捲動後加底線
// ═══════════════════════════════════════════════
import { WORKS } from './works.js';
import { t } from './i18n.js';
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
    // 圖示顯示「按下去會變成什麼」：現在亮色 → 月亮
    btn.querySelector('i').className = `ph-light ${light ? 'ph-moon' : 'ph-sun'}`;
    const label = t(light ? 'theme.toDark' : 'theme.toLight');
    btn.setAttribute('aria-label', label);
    btn.title = label;
  };
  render();
  btn.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('theme', root.dataset.theme); } catch {}
    render();
  });
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch {}
    if (saved) return;
    root.dataset.theme = e.matches ? 'light' : 'dark';
    render();
  });
}
