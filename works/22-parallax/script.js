gsap.registerPlugin(ScrollTrigger);

// ── 試著改這兩個數字 ──
const STRENGTH = 1;   // 整體視差強度的倍數：0 = 沒有視差，2 = 加倍
const SCRUB = true;   // true：完全貼著捲動；改成 0.5 之類的數字會多一點延遲的滑順感

// 是否顯示 markers：由作品頁預覽上方的開關決定（首頁縮圖預設不顯示）
const SHOW_MARKERS = window.SHOW_MARKERS ?? new URLSearchParams(location.search).has('markers');

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  // 每個有 data-speed 的元素：從「進畫面」到「離開畫面」這段捲動裡，往反方向移動一點
  // speed 正數 → 移動得比頁面慢（像在遠處）；負數 → 比頁面快（像在近處）
  document.querySelectorAll('[data-speed]').forEach((el, i) => {
    const speed = parseFloat(el.dataset.speed) * STRENGTH;
    // 圖片框本身不動，動的是框裡的畫面；文字直接動自己
    const target = el.querySelector('.media-inner') || el;
    // 畫面用 yPercent（相對自己的高度）：最多 ±14%，因為畫面只比框多出上下各 20%（20 ÷ 140 ≈ 14%），再多就會露出空白
    // 文字用 px：speed × 300（-0.1 → 上下各 30px）
    const amount = target === el ? speed * 300 : gsap.utils.clamp(-14, 14, speed * 40);

    gsap.fromTo(target,
      target === el ? { y: -amount } : { yPercent: -amount },
      {
        ...(target === el ? { y: amount } : { yPercent: amount }),
        ease: 'none',                 // 視差一定要等速：捲多少就移多少
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',        // 元素頂端剛從畫面底部出現時
          end: 'bottom top',          // 元素底端從畫面頂部離開時
          scrub: SCRUB,
          markers: SHOW_MARKERS && i === 0
        }
      });
  });
}
