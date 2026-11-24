gsap.registerPlugin(ScrollTrigger);

// ── 試著改這兩個數字 ──
const DISTANCE = 300; // 捲動多少 px 播完整段動畫（越大越慢）
const SCRUB = 0.5;    // 動畫跟手的延遲秒數；改成 true 會完全貼著捲動

// 是否顯示 markers（start／end 標記）：由作品頁預覽上方的開關決定，
// 首頁縮圖和複製出去的檔案預設不顯示。想自己打開，直接改成 true。
const SHOW_MARKERS = window.SHOW_MARKERS ?? new URLSearchParams(location.search).has('markers');

// ── 小工具：把文字拆成一個一個字母，每個字母外面包一層遮罩 ──
function splitChars(el) {
  el.innerHTML = [...el.textContent].map(c =>
    `<span class="char-mask"><span class="char">${c === ' ' ? '&nbsp;' : c}</span></span>`
  ).join('');
  return el.querySelectorAll('.char');
}
const titleChars = splitChars(document.querySelector('.title'));
const logoChars = splitChars(document.querySelector('.logo-text'));

// ── 關鍵技巧：反過來想 ──
// 方塊「本來」就在頁首（終點），我們只是先把它放大、移到開場的位置（起點），
// 捲動時再讓它回家。頁首固定在畫面上，所以方塊回家後就不會再跟著頁面跑。
const mark = document.querySelector('.mark');
const slot = document.querySelector('.slot');
const progressEl = document.querySelector('.progress'); // 先存起來：onUpdate 每一格都會用到

// 量出「起點」和「終點」中心點的距離，以及要放大幾倍
// 寫成函式：視窗大小改變（例如作品頁的全螢幕預覽）時，ScrollTrigger 會重新量一次
function startPos() {
  const a = slot.getBoundingClientRect();
  const b = mark.getBoundingClientRect();
  // 方塊可能已經被移動過：扣掉目前的 x、y，才是它在頁首的原位
  const homeX = b.left + b.width / 2 - gsap.getProperty(mark, 'x');
  const homeY = b.top + b.height / 2 - gsap.getProperty(mark, 'y');
  return {
    x: a.left + a.width / 2 - homeX,
    y: a.top + window.scrollY + a.height / 2 - homeY, // 以頁面最上方（還沒捲動）為準
    scale: a.width / mark.offsetWidth
  };
}

// 一開始：頁首文字藏在遮罩下方（方塊的起點由下面的 fromTo 設定）
gsap.set(logoChars, { yPercent: 110 });

// ── 捲動時間軸 ──
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',       // hero 的頂端碰到畫面頂端時開始
    end: `+=${DISTANCE}`,   // 再往下捲 DISTANCE px 時結束
    scrub: SCRUB,           // 動畫進度跟著捲軸走，往回捲會倒放
    invalidateOnRefresh: true, // 視窗大小改變時，重新計算起點
    markers: SHOW_MARKERS,  // 顯示 start／end 標記（教學用，上線前拿掉）
    onUpdate: self => {
      progressEl.textContent = `progress ${Math.round(self.progress * 100)}%`;
    }
  }
});

tl.to(titleChars, { yPercent: -110, stagger: 0.04, duration: 0.4, ease: 'power2.in' }, 0) // 1. 標題字母往上移出
  .fromTo(mark,                                                                          // 2. 方塊從開場位置回到頁首
    { x: () => startPos().x, y: () => startPos().y, scale: () => startPos().scale, rotation: 0 },
    { x: 0, y: 0, scale: 1, rotation: 180, duration: 1, ease: 'expo.inOut' }, 0)
  .to('.hint', { opacity: 0, duration: 0.2 }, 0)
  .to(logoChars, { yPercent: 0, stagger: 0.04, duration: 0.3, ease: 'expo.out' }, 0.9);  // 3. 頁首文字逐字出現

// 尊重「減少動態」設定：直接顯示最終畫面
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  tl.scrollTrigger.kill();
  tl.progress(1);
}
