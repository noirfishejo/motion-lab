// ── 試著改這幾個數字 ──
const SPEED = 40;     // 每秒移動多少 px（越大越快）
const SLOW = 0.2;     // 滑鼠移上去時變成原本速度的幾倍

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.marquee').forEach(row => {
  const track = row.querySelector('.track');
  const chunk = track.firstElementChild;
  const toLeft = row.dataset.direction === 'left';

  // 減少動態：完全不動（跑馬燈是裝飾，停下來不影響閱讀）
  if (reduce) return;

  let loop;
  const build = () => {
    loop?.kill();
    const width = chunk.offsetWidth;              // 一份內容的寬度：跑完這段剛好回到「看起來一樣」的位置
    // 往左：0 → -width；往右：-width → 0。repeat: -1 無限重複，ease: 'none' 等速
    loop = gsap.fromTo(track,
      { x: toLeft ? 0 : -width },
      { x: toLeft ? -width : 0, duration: width / SPEED, ease: 'none', repeat: -1 });
  };
  document.fonts.ready.then(build);
  window.addEventListener('resize', build);

  // 滑鼠移上去：不是直接停下，而是用 timeScale 慢慢減速；移開再慢慢加速回來
  row.addEventListener('pointerenter', () => gsap.to(loop, { timeScale: SLOW, duration: 0.6, ease: 'power2.out' }));
  row.addEventListener('pointerleave', () => gsap.to(loop, { timeScale: 1, duration: 0.6, ease: 'power2.in' }));
});
