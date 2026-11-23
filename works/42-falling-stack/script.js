gsap.registerPlugin(ScrollTrigger);

// ── 試著改這幾個數字 ──
const PER_CARD = 0.6;   // 每張卡片掉落要捲多遠（畫面高的倍數）：越大掉得越慢
const TILT = 12;        // 掉落時最多轉幾度
const SCRUB = 0.6;      // 跟手的延遲秒數；改成 true 會完全貼著捲動

// 是否顯示 markers：由作品頁預覽上方的開關決定（首頁縮圖預設不顯示）
const SHOW_MARKERS = window.SHOW_MARKERS ?? new URLSearchParams(location.search).has('markers');

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// 最上面的卡片是 HTML 裡的第一張；畫面上要讓它疊在最前面
const cards = [...document.querySelectorAll('.drop-card')];
cards.forEach((card, i) => { card.style.zIndex = cards.length - i; });

// 疊起來的樣子：第 n 張往上錯開 n × 20px、縮小 n × 6%、暗一點（越後面越小、越高、越暗）
const stacked = n => ({ y: -n * 20, scale: 1 - n * 0.06, filter: `brightness(${1 - n * 0.18})` });
cards.forEach((card, i) => gsap.set(card, stacked(i)));

if (!reduce) {
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.pile',
      start: 'top top',
      end: () => `+=${innerHeight * PER_CARD * (cards.length - 1)}`, // 每張卡片分到一段捲動距離
      pin: true,           // 固定住：卡片沒掉完之前，頁面看起來不會往下走
      scrub: SCRUB,
      invalidateOnRefresh: true,
      markers: SHOW_MARKERS
    }
  });

  // 最後一張留著（掉完所有卡片後，畫面上還有東西），其他依序掉落
  cards.slice(0, -1).forEach((card, i) => {
    const at = i; // 第 i 段捲動
    tl.to(card, {
      y: () => innerHeight,                                   // 往下掉出畫面
      rotation: (i % 2 ? -1 : 1) * TILT,                       // 左右交替傾斜
      opacity: 0,
      duration: 1,
      ease: 'power2.in'                                         // 一開始慢、越掉越快，像受重力影響
    }, at);
    // 同一段時間裡，後面的每張卡片都往前遞補一格（變大、往下）
    cards.slice(i + 1).forEach((rest, j) => tl.to(rest, { ...stacked(j), duration: 1, ease: 'power2.out' }, at));
  });
}
