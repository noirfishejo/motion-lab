// ═══════════════════════════════════════════════
// 首頁：開場滾動、篩選列、作品卡片
// ═══════════════════════════════════════════════
import { initI18n, t, pick } from './i18n.js';
import { WORKS, TOPICS } from './works.js';
import { initHeader } from './header.js';
import { initSmooth, scrollToY } from './smooth.js';

// 縮圖構圖用的常數（見下方 fitThumb）。要放在所有 await 之前，否則縮圖載入時還讀不到
const THUMB_VIEW = { w: 960, h: 600 };
const FIT_W = 0.82, FIT_H = 0.72;

// GSAP 從 CDN 載入；載入失敗時內容照樣顯示，只是沒有動畫
const hasGsap = !!(window.gsap && window.ScrollTrigger && window.SplitText);
if (hasGsap) gsap.registerPlugin(ScrollTrigger, SplitText);

// 重新整理時不要停在上次的捲動位置，開場才會從頭播放
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (!location.hash) window.scrollTo(0, 0);

await initI18n();
initHeader();
renderFilters();
renderCards();
initSmooth();
if (hasGsap) {
  await document.fonts.ready; // 字體載入後再拆字，位置才會準
  initMotion();
} else {
  document.documentElement.classList.remove('intro'); // 沒有動畫：直接顯示開場
}
scrollToHash();

// 從作品頁點「作品」回來（網址帶 #works）：
// 開場固定畫面會把頁面撐長，要等 ScrollTrigger 算好位置再捲過去
function scrollToHash() {
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  if (!target) return;
  window.ScrollTrigger?.refresh();
  target.scrollIntoView({ block: 'start' }); // 會套用 html 的 scroll-padding-top，標題不會被固定頁首蓋住
}

// ── 內容 ─────────────────────────────────────────
function renderFilters() {
  const nav = document.querySelector('.filters');
  const count = topic => WORKS.filter(w => topic === 'all' || w.topic === topic).length;
  nav.innerHTML = ['all', ...TOPICS].map(topic => `
    <button type="button" data-topic="${topic}" aria-pressed="${topic === 'all'}">
      ${t(topic === 'all' ? 'home.filter.all' : `topic.${topic}`)}<sup>${count(topic)}</sup>
    </button>`).join('');
  nav.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (btn) applyFilter(btn.dataset.topic);
  });

  // 篩選列放不下時（手機）：邊緣漸隱，提示還可以往旁邊滑
  const edges = () => {
    const max = nav.scrollWidth - nav.clientWidth;
    nav.classList.toggle('more-start', nav.scrollLeft > 2);
    nav.classList.toggle('more-end', nav.scrollLeft < max - 2);
  };
  nav.addEventListener('scroll', edges, { passive: true });
  new ResizeObserver(edges).observe(nav);
}

// ── 縮圖構圖 ─────────────────────────────────────
// 作品用 THUMB_VIEW 的大小渲染，再量出「主要內容」的範圍，
// 縮放到卡片的 FIT_W × FIT_H 安全框裡並置中。每張縮圖的留白比例因此一致。
// 主要內容預設是 <main> 的直接子元素；作品資料裡的 thumb 可以指定別的選擇器。
// （THUMB_VIEW、FIT_W、FIT_H 放在檔案最上面：縮圖在等字體載入時就會開始量尺寸）
function fitThumb(thumb) {
  const frame = thumb.querySelector('iframe');
  const W = thumb.clientWidth, H = thumb.clientHeight;
  const base = W / THUMB_VIEW.w;
  let k = base, tx = 0, ty = 0;
  try {
    const doc = frame.contentDocument, win = frame.contentWindow;
    const els = thumb.dataset.fit ? doc.querySelectorAll(thumb.dataset.fit) : (doc.querySelector('main') || doc.body).children;
    let l = Infinity, tp = Infinity, r = -Infinity, b = -Infinity;
    for (const el of els) {
      const cs = win.getComputedStyle(el);
      if (cs.display === 'none' || cs.position === 'absolute' || cs.position === 'fixed') continue; // 跳過裝飾層、飛行物
      const rc = el.getBoundingClientRect();
      if (!rc.width || !rc.height) continue;
      l = Math.min(l, rc.left); tp = Math.min(tp, rc.top); r = Math.max(r, rc.right); b = Math.max(b, rc.bottom);
    }
    if (r > l && b > tp) {
      k = Math.min(W * FIT_W / (r - l), H * FIT_H / (b - tp), base * 2); // 最多放大 2 倍，避免小圖示被放得過大
      tx = W / 2 - (l + r) / 2 * k;
      ty = H / 2 - (tp + b) / 2 * k;
    }
  } catch {}
  frame.style.transform = `translate(${tx}px, ${ty}px) scale(${k})`;
}

function renderCards() {
  const grid = document.getElementById('workGrid');
  grid.innerHTML = WORKS.map((w, i) => `
    <a class="work-card" href="work.html?id=${w.id}" data-topic="${w.topic}" aria-labelledby="card-${w.id}" aria-describedby="card-${w.id}-sum">
      <div class="thumb"${w.thumb ? ` data-fit="${w.thumb}"` : ''}>
        <iframe src="works/${w.id}/index.html" loading="lazy" tabindex="-1" aria-hidden="true" title=""></iframe>
        <span class="thumb-go" aria-hidden="true"><i class="ph-light ph-arrow-up-right"></i></span>
      </div>
      <div class="work-meta">
        <h3 id="card-${w.id}">${pick(w.title)}</h3>
        <span class="topic">${t(`topic.${w.topic}`)}</span>
        <p id="card-${w.id}-sum">${pick(w.summary)}</p>
        <div class="tags">${w.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
      </div>
    </a>`).join('');

  // 縮圖統一構圖：找出作品的主要內容，縮放並置中到同一個安全框裡
  const ro = new ResizeObserver(entries => entries.forEach(({ target }) => fitThumb(target)));
  grid.querySelectorAll('.thumb').forEach(el => {
    ro.observe(el);
    const frame = el.querySelector('iframe');
    frame.addEventListener('load', () => {
      fitThumb(el);
      frame.contentDocument?.fonts?.ready.then(() => fitThumb(el)); // 字體載入後尺寸會變，再算一次
    });
  });

  // 滑鼠移入時重播縮圖裡的動畫
  grid.querySelectorAll('.work-card').forEach(card => {
    let last = 0;
    card.addEventListener('mouseenter', () => {
      if (Date.now() - last < 1500) return;
      last = Date.now();
      try { card.querySelector('iframe').contentWindow.location.reload(); } catch {}
    });
  });
}

// ── 篩選：舊卡片淡出 → 換成新的一組 → 新卡片依序進場 ─────
// （之前用 Flip 只會「移動」卡片；還沒捲進畫面的卡片是透明的，篩選後就看不到。
//   現在每次篩選都重新播一次進場動畫，所有分類都一定會出現卡片）
let filterTl;
function applyFilter(topic) {
  document.querySelectorAll('.filters button').forEach(b => b.setAttribute('aria-pressed', b.dataset.topic === topic));
  const cards = [...document.querySelectorAll('.work-card')];
  const shown = cards.filter(c => c.style.display !== 'none');
  const next = cards.filter(c => topic === 'all' || c.dataset.topic === topic);

  const swap = () => {
    cards.forEach(c => { c.style.display = next.includes(c) ? '' : 'none'; });
    document.getElementById('empty').hidden = next.length > 0;
    // 篩選列已經吸附在頁首下方時：捲回作品格開頭，新的一組卡片從第一張開始看
    const bar = document.querySelector('.filters-bar');
    const headerH = document.querySelector('.site-header').offsetHeight;
    const top = document.getElementById('workGrid').getBoundingClientRect().top + scrollY - headerH - bar.offsetHeight - 16;
    if (scrollY > top) scrollToY(top, { immediate: true });
    window.ScrollTrigger?.refresh(); // 版面變了，重新計算捲動觸發位置
  };

  filterTl?.kill(); // 連續快速點擊時，先停掉上一次的動畫
  if (!hasGsap) { swap(); return; }
  if (reduceMotion()) { swap(); gsap.set(next, { opacity: 1, y: 0 }); return; }

  filterTl = gsap.timeline()
    .to(shown, { opacity: 0, y: -16, duration: 0.25, stagger: 0.03, ease: 'power2.in' })
    .add(swap)
    .fromTo(next, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'expo.out' });
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
      .from('.hero-sub', { opacity: 0, y: 16, duration: 1, stagger: 0.1 }, '<0.3');

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
      .to('.hero-sub', { opacity: 0, duration: 0.3 }, 0);

    return () => logoText.revert();
  });

  // ③ 作品區的進場：要在 ② 的「固定開場」之後才建立，觸發位置才會算進固定的那段距離
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // 作品區：標題和篩選列捲到畫面內才出現
    gsap.from('.works-head, .filters-bar', {
      opacity: 0, y: 40, duration: 1.2, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: '.works', start: 'top bottom', once: true } // 一露出畫面就出現（開場縮短後，第一個畫面就看得到）
    });
    // 作品卡片：捲到畫面內時依序進場
    gsap.set('.work-card', { opacity: 0, y: 56 });
    ScrollTrigger.batch('.work-card', {
      start: 'top 90%',
      once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out' })
    });
  });
}
