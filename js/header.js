// ═══════════════════════════════════════════════
// 共用頁首：捲動後加底線
// ═══════════════════════════════════════════════
import { WORKS } from './works.js';
import { t, lang, setLang } from './i18n.js';
import { scrollToY } from './smooth.js';

// ── 主選單：參考 santalarch.com 的「尺規」頁首 ──
// 頁首底部是一條橫跨整頁的細線，每個選單項目下面有一個刻度；
// 亮的那一段從左邊一路延伸到「目前這一頁」的刻度，滑到別的項目時亮線滑過去預覽，離開再滑回來
const NAV = [
  { key: 'works', href: 'index.html#works', page: 'index' },
  { key: 'guide', href: 'guide.html', page: 'guide' },
  { key: 'lab', href: 'ease.html', page: 'ease' },
  { key: 'about', href: 'about.html', page: 'about' }
];

function currentPage() {
  const file = location.pathname.split('/').pop() || 'index.html';
  return file.replace('.html', '') || 'index';
}

function setupNav(header) {
  const page = currentPage();
  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', t('nav.label'));
  nav.innerHTML = `<ol>${NAV.map(n => `
    <li><a href="${n.href}"${n.page === page ? ' aria-current="page"' : ''}>${t(`nav.${n.key}`)}</a></li>`).join('')}</ol>`;
  header.querySelector('.header-end').before(nav);

  const rail = document.createElement('span');
  rail.className = 'nav-rail';
  rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML = '<span class="nav-fill"></span>';
  header.append(rail);
  const fill = rail.firstElementChild;

  const items = [...nav.querySelectorAll('li')];
  const current = items.find(li => li.querySelector('[aria-current]'));
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // 亮線的長度＝從頁首最左邊到某個刻度（不在選單裡的頁面，例如作品頁，就停在作品那一格）
  const target = li => (li || items[0]).getBoundingClientRect().left / header.clientWidth;
  const go = (li, animate = true) => {
    const scaleX = target(li);
    if (!window.gsap) { fill.style.transform = `scaleX(${scaleX})`; return; }
    if (!animate || reduce()) gsap.set(fill, { scaleX });
    else gsap.to(fill, { scaleX, duration: 0.7, ease: 'expo.out', overwrite: true });
  };
  const home = current || (page === 'work' ? items[0] : null);
  items.forEach(li => {
    li.addEventListener('pointerenter', () => go(li));
    li.querySelector('a').addEventListener('focus', () => go(li));
  });
  nav.addEventListener('pointerleave', () => go(home));
  nav.addEventListener('focusout', e => { if (!nav.contains(e.relatedTarget)) go(home); });
  new ResizeObserver(() => go(home, false)).observe(header);

  // 進到頁面時亮線從左邊長到目前的刻度：告訴人「你在這裡」
  // 首頁要等開場播完（home.js 會呼叫 header.revealNav）
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    if (window.gsap && !reduce()) gsap.fromTo(fill, { scaleX: 0 }, { scaleX: target(home), duration: 1.2, ease: 'expo.out', delay: 0.1 });
    else go(home, false);
  };
  if (window.gsap) gsap.set(fill, { scaleX: 0, transformOrigin: '0 50%' });
  if (document.documentElement.classList.contains('intro')) { header.revealNav = reveal; setTimeout(reveal, 6500); } // 保險：開場沒播完也會長出來
  else document.fonts.ready.then(reveal);
}

export function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  setupNav(header);
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
    document.dispatchEvent(new Event('themechange')); // 首頁縮圖會換成對應配色的圖片
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
