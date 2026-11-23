gsap.registerPlugin(ScrollTrigger);

// ── 試著改這幾個數字 ──
const SHRINK = 0.9;    // 被蓋住的卡片縮到幾倍
const DARK = 0.45;     // 被蓋住的卡片變多暗（黑色蓋板的透明度）
const SCRUB = true;    // true：完全跟著捲動

// 是否顯示 markers：由作品頁預覽上方的開關決定（首頁縮圖預設不顯示）
const SHOW_MARKERS = window.SHOW_MARKERS ?? new URLSearchParams(location.search).has('markers');

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const cards = [...document.querySelectorAll('.stack-card')];
cards.forEach((card, i) => card.style.setProperty('--i', i)); // 每張卡片的 sticky 位置往下錯開一點

if (!reduce) {
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return; // 最後一張不會被蓋
    // 下一張「從畫面底部出現」到「黏到定位」的這段捲動裡，這一張往後縮小、變暗
    gsap.timeline({
      scrollTrigger: {
        trigger: next,
        start: 'top bottom',
        end: 'top 20%',
        scrub: SCRUB,
        markers: SHOW_MARKERS && i === 0
      }
    })
      .to(card, { scale: SHRINK - (cards.length - 2 - i) * 0.02, ease: 'none' }, 0) // 越早的卡片縮得越小，疊起來有層次
      .to(card.querySelector('.shade'), { opacity: DARK, ease: 'none' }, 0);
  });
}
