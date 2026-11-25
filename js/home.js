// ═══════════════════════════════════════════════
// 首頁：開場（方塊＋標題、聚光燈）＋介紹網站的段落
// 作品格在作品頁（works.html、js/works-page.js）
// ═══════════════════════════════════════════════
import { initI18n, t, pick } from './i18n.js';
import { initHeader } from './header.js';
import { initSmooth, scrollToY } from './smooth.js';
import { initCursor, initTooltips, magnetic } from './interactions.js';
import { renderStory, initStoryMotion } from './home-story.js';
import { initHeroSpec } from './hero-spec.js';

let heroSpec = null; // 開場的聚光燈（js/hero-spec.js）

// GSAP 從 CDN 載入；載入失敗時內容照樣顯示，只是沒有動畫
const hasGsap = !!(window.gsap && window.ScrollTrigger && window.SplitText);
if (hasGsap) gsap.registerPlugin(ScrollTrigger, SplitText);

// 舊網址：首頁的作品區（#works）已經搬到作品頁
if (location.hash === '#works') location.replace(`works.html${location.search}`);

// 重新整理時不要停在上次的捲動位置，開場才會從頭播放
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (!location.hash) window.scrollTo(0, 0);

// 剛切換語言：回到切換前的位置，不重播開場（見 i18n.js 的 setLang）
const resumeY = (() => {
  try {
    const saved = JSON.parse(sessionStorage.getItem('langScroll'));
    sessionStorage.removeItem('langScroll');
    return saved?.path === location.pathname ? saved.y : null;
  } catch { return null; }
})();

await initI18n();
initHeader();
renderStory();
initSmooth();
initCursor();
initTooltips();
magnetic('.site-header .icon-toggle');
if (hasGsap) {
  await document.fonts.ready; // 字體載入後再拆字，位置才會準
  heroSpec = initHeroSpec();   // 開場的聚光燈規格層（字體載入後才量得準標題大小）
  initMotion();
  initStoryMotion(); // 介紹段落的捲動動態（開場的 ScrollTrigger 建好之後）
} else {
  document.documentElement.classList.remove('intro'); // 沒有動畫：直接顯示開場
  document.querySelector('.site-header').revealNav?.();
  initStoryMotion(); // 沒有 GSAP 時只會把圖示換成 SVG
}
scrollToHash();
if (resumeY !== null) {
  window.ScrollTrigger?.refresh(); // 開場的固定畫面會把頁面撐長，算好位置再捲過去
  scrollToY(resumeY, { immediate: true });
}

// 從作品頁點「作品」回來（網址帶 #works）：
// 開場固定畫面會把頁面撐長，要等 ScrollTrigger 算好位置再捲過去
function scrollToHash() {
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  if (!target) return;
  window.ScrollTrigger?.refresh();
  target.scrollIntoView({ block: 'start' }); // 會套用 html 的 scroll-padding-top，標題不會被固定頁首蓋住
}

function reduceMotion() {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ── 動態 ─────────────────────────────────────────
function initMotion() {
  const mm = gsap.matchMedia();
  const square = document.querySelector('.hero-square');
  const title = document.querySelector('.hero-title');
  let intro;      // 開場動畫（自動播放的那段）
  let titleChars; // 標題拆開後的字母

  // 開場播完（或使用者一開始就往下捲）之後，才顯示頁首按鈕、介紹段落、頁尾
  let restShown = false;
  const showRest = () => {
    if (restShown) return;
    restShown = true;
    // 先把要進場的元素設成起點，再拿掉 intro class，才不會閃一下
    gsap.from('.site-header .header-end, .site-nav', { opacity: 0, duration: 0.6, ease: 'power1.out' });
    document.querySelector('.site-header').revealNav?.(); // 頁首尺規的亮線從左邊長到「作品」
    if (innerWidth < 600) gsap.from('.site-header .logo', { opacity: 0, duration: 0.6, ease: 'power1.out' });
    document.documentElement.classList.remove('intro');
    if (!location.hash && resumeY === null) heroSpec?.sweep(); // 開場播完：光圈掃過標題一次，提示這裡藏了東西
  };

  // ① 所有尺寸：開場（自動播放，約 2.5 秒）
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const split = SplitText.create(title, { type: 'chars', mask: 'chars' });
    titleChars = split.chars;

    // 方塊和整組標題中心點的水平距離 → 讓方塊先出現在畫面正中央
    const lockup = square.parentElement;
    const toCenter = (lockup.offsetLeft + lockup.offsetWidth / 2) - (square.offsetLeft + square.offsetWidth / 2);

    gsap.set(square, { x: toCenter, scale: 0, rotation: -180 });
    gsap.set(split.chars, { yPercent: 110 });
    gsap.set('.hero-pin', { visibility: 'visible' }); // 初始狀態設好了才顯示（見 index.html 的 intro class）

    intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
      .to(square, { scale: 1.8, rotation: 0, duration: 1.1 })                 // 在中央旋轉放大
      .to(square, { scale: 1, x: 0, duration: 1.1, ease: 'expo.inOut' })      // 滑回標題左邊
      .to(split.chars, { yPercent: 0, duration: 1.2, stagger: 0.035 }, '-=0.45') // 把字一個一個「拉」出來
      .from('.hero-sub, .hero-hint', { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, '-=0.6')            // 副標題在字快拉完時出現
      .add(showRest, '-=0.3');                                                   // 開場收尾時，其他內容才出現

    // 從作品頁回到 #works：不等開場，直接顯示
    if (location.hash || resumeY !== null) intro.progress(1);

    return () => split.revert();
  });

  // ② 平板、電腦：往下捲時
  //    · 標題的字母由左往右依序往上移出（和進場相反）
  //    · 方塊飛進左上角：其實是「頁首的 logo 方塊」從大方塊的位置縮回原位，
  //      頁首固定在畫面上，所以抵達後不會跟著頁面往上跑
  //    · 方塊就定位後，頁首的 Motion Lab 由左往右逐字出現
  mm.add('(min-width: 600px) and (prefers-reduced-motion: no-preference)', () => {
    const mark = document.querySelector('.site-header .logo-mark');
    const logoText = SplitText.create('.site-header .logo-text', { type: 'chars', mask: 'chars' });

    // 方塊位置：hero 在頁面最上方 (0,0)；頁首方塊位置：頁首固定在畫面最上方 (0,0)
    // 用 offsetLeft/offsetTop 量，不會被動畫中的位移影響
    const center = el => ({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 });

    gsap.set(mark, { opacity: 0 });
    gsap.set(logoText.chars, { yPercent: 110 });
    const logoIn = gsap.to(logoText.chars, { yPercent: 0, duration: 0.5, stagger: 0.03, ease: 'expo.out', paused: true });
    gsap.set('.site-header .logo', { visibility: 'visible' });

    // 前半段先把開場固定住（pin），標題才不會一下子就被捲出畫面；
    // 後半段放開，作品區一邊往上出現、方塊一邊飛完最後一段
    // pinSpacing: false → 不在下方補空白，作品區像布幕一樣直接往上蓋過開場（第一個畫面底部就看得到作品區）
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: '+=30%', pin: '.hero-pin', pinSpacing: false });

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: '+=60%',
        scrub: 0.6, invalidateOnRefresh: true,
        // 開場還沒播完就開始捲動：直接跳到開場結尾，避免兩個方塊同時出現
        onUpdate: self => {
          if (self.progress > 0 && intro && intro.progress() < 1) intro.progress(1);
          // 頁首文字不跟著捲動「半截」顯示：方塊快到位就整段播出，往回捲才收起
          // （之前用 scrub，停在中間時頁首只剩一個方塊）
          self.progress >= 0.7 ? logoIn.play() : logoIn.reverse();
        }
      }
    })
      // 交棒：大方塊藏起來，頁首方塊放大疊在同一個位置
      // immediateRender: false → 開始捲動前不要先把起點畫出來（否則一載入就會看到藍色方塊）
      .set(square, { opacity: 0 }, 0)
      .fromTo(mark, {
        opacity: 1,
        x: () => center(square).x - center(mark).x,
        y: () => center(square).y - center(mark).y,
        scale: () => square.offsetWidth / mark.offsetWidth,
        rotation: 0
      }, { x: 0, y: 0, scale: 1, rotation: 180, duration: 1, ease: 'expo.inOut', immediateRender: false }, 0)
      // 標題字母依序往上移出
      .fromTo(titleChars, { yPercent: 0 }, { yPercent: -110, duration: 0.25, stagger: 0.03, ease: 'power2.in', immediateRender: false }, 0.02)
      .to('.hero-sub, .hero-hint, .hero-spec', { opacity: 0, duration: 0.3 }, 0);

    return () => logoText.revert();
  });

}
