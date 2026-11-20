gsap.registerPlugin(ScrollTrigger);

// ── 試著改這兩個數字 ──
const SPEED = 1;     // 捲動距離的倍數：2 = 要捲兩倍遠才走完（感覺比較慢）
const SCRUB = 0.6;   // 跟手的延遲秒數；改成 true 會完全貼著捲動

// 是否顯示 markers：由作品頁預覽上方的開關決定（首頁縮圖預設不顯示）
const SHOW_MARKERS = window.SHOW_MARKERS ?? new URLSearchParams(location.search).has('markers');

const track = document.querySelector('.track');
const readout = document.querySelector('.readout');

// 軌道要往左移多少：軌道總寬度 − 畫面寬度
// 寫成函式，視窗大小改變時（invalidateOnRefresh）會重新計算
const distance = () => track.scrollWidth - window.innerWidth;

// ── 主動畫：往下捲 → 軌道往左移 ──
const move = gsap.to(track, {
  x: () => -distance(),
  ease: 'none',                       // 一定要等速，捲動和位移才會一比一對應
  scrollTrigger: {
    trigger: '.hscroll',
    start: 'top top',                 // 區塊頂端碰到畫面頂端時開始
    end: () => `+=${distance() * SPEED}`, // 往下捲「橫向距離 × SPEED」後結束
    pin: true,                        // 這段期間把區塊固定在畫面上
    scrub: SCRUB,
    invalidateOnRefresh: true,        // 視窗大小改變時重新計算 distance()
    markers: SHOW_MARKERS,
    onUpdate: self => {
      readout.textContent = `${Math.round(self.progress * 100)}%`;
      gsap.set('.bar i', { scaleX: self.progress });
    }
  }
});

// ── 每個面板自己的進場：用 containerAnimation 當成「橫向的捲軸」 ──
// 一般的 ScrollTrigger 看的是直向捲動；這裡面板是橫向移進畫面的，
// 所以要告訴它「看 move 這段動畫的進度」，start／end 也改成 left／right。
// （開啟「減少動態」時略過，文字直接顯示）
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) gsap.utils.toArray('.panel:not(.panel-intro)').forEach(panel => {
  gsap.from(panel.querySelectorAll('h2, p'), {
    y: 60,
    opacity: 0,
    stagger: 0.1,
    ease: 'none',
    scrollTrigger: {
      containerAnimation: move,
      trigger: panel,
      start: 'left 95%',   // 面板左緣到畫面 95% 的位置時開始
      end: 'left 45%',     // 到 45% 時完成
      scrub: true
    }
  });
});
