// ═══════════════════════════════════════════════
// 共用頁首：捲動後加底線
// ═══════════════════════════════════════════════
import { WORKS } from './works.js';
import { t, lang, setLang } from './i18n.js';
import { scrollToY } from './smooth.js';

// ── 主選單：參考 santalarch.com 的「尺規」頁首 ──
// · 頁首底部是一條橫跨整頁的細線，每個選單項目的左邊是一條和底線相接的刻度
// · 亮的那一段從左邊延伸到「目前這一頁」的刻度；換頁時從「上一頁」的位置伸縮過去（往右或往左），不是每次都從頭跑
// · 滑過項目：整格由下往上反白，文字往上捲成另一份（同練習「按鈕動效八款」的文字上捲）；亮線也滑過去預覽
// · 手機（< 600px）：收進漢堡選單，點開後從頁首下方展開（同練習「漢堡選單」：三條線變 ×、選項從遮罩下方依序升起）
const NAV = [
  { key: 'works', href: 'index.html#works', page: 'index' },
  { key: 'guide', href: 'guide.html', page: 'guide' },
  { key: 'lab', href: 'ease.html', page: 'ease' },
  { key: 'about', href: 'about.html', page: 'about' }
];
const FILL_KEY = 'navFill'; // 上一頁亮線停在哪裡（佔頁首寬度的比例）

function currentPage() {
  const file = location.pathname.split('/').pop() || 'index.html';
  return file.replace('.html', '') || 'index';
}

function setupNav(header) {
  const page = currentPage();
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const label = n => t(`nav.${n.key}`);
  const cur = n => (n.page === page ? ' aria-current="page"' : '');

  // ── 電腦、平板：尺規選單 ──
  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', t('nav.label'));
  // 文字上下各一份：滑過時上面那份往上捲走、下面那份捲上來（讀屏只唸 aria-label）
  nav.innerHTML = `<ol>${NAV.map(n => `
    <li><a href="${n.href}"${cur(n)}><span class="nav-roll" aria-hidden="true"><span>${label(n)}</span><span>${label(n)}</span></span><span class="visually-hidden">${label(n)}</span></a></li>`).join('')}</ol>`;
  header.querySelector('.header-end').before(nav);

  const rail = document.createElement('span');
  rail.className = 'nav-rail';
  rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML = '<span class="nav-fill"></span>';
  header.append(rail);
  const fill = rail.firstElementChild;

  const items = [...nav.querySelectorAll('li')];
  const current = items.find(li => li.querySelector('[aria-current]'));
  // 目前這一頁：這一格的底線加粗成強調色，進頁面時從刻度往右畫出來
  const here = document.createElement('span');
  here.className = 'nav-here';
  here.setAttribute('aria-hidden', 'true');
  current?.querySelector('a').append(here);
  // 亮線的長度＝從頁首最左邊到某個刻度（不在選單裡的頁面，例如作品頁，就停在作品那一格）
  const home = current || (page === 'work' ? items[0] : null);
  const target = li => (li ? li.getBoundingClientRect().left / header.clientWidth : 0);
  const go = (li, animate = true) => {
    const scaleX = target(li);
    if (!window.gsap) { fill.style.transform = `scaleX(${scaleX})`; return; }
    if (!animate || reduce()) gsap.set(fill, { scaleX });
    else gsap.to(fill, { scaleX, duration: 0.7, ease: 'expo.out', overwrite: true });
  };
  items.forEach(li => {
    li.addEventListener('pointerenter', () => go(li));
    li.querySelector('a').addEventListener('focus', () => go(li));
  });
  nav.addEventListener('pointerleave', () => go(home));
  nav.addEventListener('focusout', e => { if (!nav.contains(e.relatedTarget)) go(home); });
  new ResizeObserver(() => go(home, false)).observe(header);
  // 離開這一頁時記下亮線的位置，下一頁從這裡接著伸縮
  addEventListener('pagehide', () => { try { sessionStorage.setItem(FILL_KEY, String(target(home))); } catch {} });

  // 進到頁面：亮線從上一頁的位置伸縮到這一頁（第一次進來才從左邊長出來）
  // 首頁要等開場播完（home.js 會呼叫 header.revealNav）
  let from = 0;
  try { from = parseFloat(sessionStorage.getItem(FILL_KEY)) || 0; } catch {}
  let revealed = false;
  const reveal = () => {
    if (revealed) return;
    revealed = true;
    if (window.gsap && !reduce()) {
      gsap.fromTo(fill, { scaleX: from }, { scaleX: target(home), duration: from ? 0.9 : 1.2, ease: 'expo.out', delay: 0.05 });
      if (current) gsap.fromTo(here, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'expo.out', delay: from ? 0.5 : 0.8 }); // 亮線到了才畫
    } else go(home, false);
  };
  if (window.gsap) { gsap.set(fill, { scaleX: from, transformOrigin: '0 50%' }); if (!reduce()) gsap.set(here, { scaleX: 0 }); }
  else fill.style.transform = `scaleX(${from})`;
  if (document.documentElement.classList.contains('intro')) { header.revealNav = reveal; setTimeout(reveal, 6500); } // 保險：開場沒播完也會長出來
  else document.fonts.ready.then(reveal);

  setupMenu(header, label, cur, reduce);
}

// ── 手機：漢堡選單（練習「漢堡選單」的做法） ──
function setupMenu(header, label, cur, reduce) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'icon-toggle menu-toggle';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'siteMenu');
  btn.setAttribute('aria-label', t('nav.menu'));
  btn.innerHTML = '<span class="menu-lines" aria-hidden="true"><span></span><span></span><span></span></span>';
  header.querySelector('.header-end').append(btn);

  const panel = document.createElement('nav');
  panel.className = 'site-menu';
  panel.id = 'siteMenu';
  panel.hidden = true;
  panel.setAttribute('aria-label', t('nav.label'));
  panel.innerHTML = `<ol>${NAV.map(n => `
    <li><a href="${n.href}"${cur(n)}><span class="menu-mask"><span class="menu-text">${label(n)}</span></span><span class="menu-mask"><span class="menu-side">${n.page === currentPage() ? `<span class="menu-here">${t('nav.current')}</span>` : '<i class="ph-light ph-arrow-up-right" aria-hidden="true"></i>'}</span></span></a></li>`).join('')}</ol>`;
  header.after(panel);

  const [l1, l2, l3] = btn.querySelectorAll('.menu-lines span');
  const texts = panel.querySelectorAll('.menu-text, .menu-side');
  // 一條暫停的時間軸：打開 play、關閉 reverse（中途再按會從目前的位置倒回去）
  const tl = window.gsap ? gsap.timeline({ paused: true, defaults: { ease: 'expo.out' },
    onReverseComplete: () => { panel.hidden = true; } })
    .to(l1, { y: 5, rotation: 45, duration: 0.4 }, 0)   // 三條線相隔 5px：上下兩條各移 5px 到中間再轉，× 才會對稱
    .to(l3, { y: -5, rotation: -45, duration: 0.4 }, 0)
    .to(l2, { scaleX: 0, duration: 0.2 }, 0)
    .fromTo(panel, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.6 }, 0)
    .fromTo(texts, { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.04 }, 0.1) : null;

  const isOpen = () => btn.getAttribute('aria-expanded') === 'true';
  const open = () => {
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', t('nav.menuClose'));
    panel.hidden = false;
    if (!tl || reduce()) tl?.progress(1); else tl.timeScale(1).play();
  };
  const close = (focusBtn = false) => {
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', t('nav.menu'));
    if (!tl || reduce()) { tl?.progress(0); panel.hidden = true; }
    else tl.timeScale(1.6).reverse(); // 關得比開得快
    if (focusBtn) btn.focus();
  };
  btn.addEventListener('click', () => (isOpen() ? close() : open()));
  addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) close(true); });
  document.addEventListener('pointerdown', e => { if (isOpen() && !panel.contains(e.target) && !btn.contains(e.target)) close(); });
  // 視窗變寬、回到尺規選單時，把漢堡選單關掉
  matchMedia('(min-width: 600px)').addEventListener('change', e => { if (e.matches && isOpen()) { tl?.progress(0); close(); panel.hidden = true; } });
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
