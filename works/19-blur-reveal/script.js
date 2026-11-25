gsap.registerPlugin(ScrollTrigger, SplitText);

// ── 試著改這幾個數字 ──
const BLUR = 14;      // 一開始模糊多少 px
const RISE = 32;      // 一開始往下偏多少 px
const SCRUB = 0.8;    // 跟手的延遲秒數；改成 true 會完全貼著捲動

// 是否顯示 markers：由作品頁預覽上方的開關決定（首頁縮圖預設不顯示）
const SHOW_MARKERS = window.SHOW_MARKERS ?? new URLSearchParams(location.search).has('markers');

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  document.fonts.ready.then(() => {
    document.querySelectorAll('.statement').forEach((el, i) => {
      // 拆成「畫面上實際的一行一行」；視窗大小改變時 autoSplit 會重新拆
      SplitText.create(el, {
        type: 'lines',
        autoSplit: true,
        onSplit: self => gsap.fromTo(self.lines,
          { filter: `blur(${BLUR}px)`, opacity: 0.12, y: RISE },
          {
            filter: 'blur(0px)', opacity: 1, y: 0,
            stagger: 0.15,            // 每一行比上一行晚一點清楚
            ease: 'none',             // 跟著捲動的動畫用等速，捲多少就清楚多少
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',       // 這段文字的頂端到畫面 85% 的位置時開始
              end: 'bottom 55%',      // 底端到畫面 55% 時全部清楚
              scrub: SCRUB,
              // 在範圍內：will-change 讓模糊交給顯示卡處理，不用每一格重新點陣化文字；整段清楚後拿掉 filter（blur(0px) 仍然算一個濾鏡）
              onToggle: st => gsap.set(self.lines, { willChange: st.isActive ? 'filter' : 'auto' }),
              onLeave: () => gsap.set(self.lines, { filter: 'none' }),
              markers: SHOW_MARKERS && i === 0  // 只標第一段，畫面比較乾淨
            }
          })
      });
    });
  });
}
