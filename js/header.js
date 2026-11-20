// ═══════════════════════════════════════════════
// 共用頁首：捲動後加底線
// ═══════════════════════════════════════════════
import { WORKS } from './works.js';
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

  // 頁尾「回到頂部」
  document.querySelectorAll('[data-to-top]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    scrollToY(0);
  }));
}
