gsap.registerPlugin(ScrollTrigger);

// ── 試著改這兩個數字 ──
const SCRUB = 0.6;     // 跟手的延遲秒數；改成 true 會完全貼著捲動
const ZOOM = 1.3;      // 圖片一開始放大幾倍，打開的同時縮回 1（像鏡頭拉遠）

// 是否顯示 markers：由作品頁預覽上方的開關決定（首頁縮圖預設不顯示）
const SHOW_MARKERS = window.SHOW_MARKERS ?? new URLSearchParams(location.search).has('markers');

// 三種「縫」：clip-path: inset(上 右 下 左)，數字越大裁掉越多
const FROM = {
  center: 'inset(50% 0% 50% 0%)',   // 上下各裁一半 → 只剩中間一條線
  left: 'inset(0% 100% 0% 0%)',     // 右邊裁 100% → 什麼都看不到，從左邊開始露出
  bottom: 'inset(100% 0% 0% 0%)'    // 上面裁 100% → 從底部開始往上露出
};

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  document.querySelectorAll('.shot').forEach((shot, i) => {
    const img = shot.querySelector('.shot-img');
    gsap.timeline({
      scrollTrigger: {
        trigger: shot,
        start: 'top 85%',         // 圖片頂端到畫面 85% 的位置時開始打開
        end: 'top 35%',           // 到 35% 時完全打開
        scrub: SCRUB,
        markers: SHOW_MARKERS && i === 0
      }
    })
      // clip-path 從一條縫打開到整張（inset 全部是 0）
      .fromTo(img, { clipPath: FROM[shot.dataset.from] }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' }, 0)
      // 同一段時間裡，裡面的圖示從放大縮回原尺寸，打開的感覺更有深度
      .fromTo(img.querySelector('i'), { scale: ZOOM }, { scale: 1, ease: 'none' }, 0)
      .from(shot.querySelector('figcaption'), { opacity: 0, y: 8, ease: 'none' }, 0.5);
  });
}
