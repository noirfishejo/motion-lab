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
    const progress = loop?.progress() ?? 0; // 重建時保留跑到哪裡，不會跳回起點
    loop?.kill();
    const width = chunk.offsetWidth;              // 一份內容的寬度：跑完這段剛好回到「看起來一樣」的位置
    // 往左：0 → -width；往右：-width → 0。repeat: -1 無限重複，ease: 'none' 等速
    loop = gsap.fromTo(track,
      { x: toLeft ? 0 : -width },
      { x: toLeft ? -width : 0, duration: width / SPEED, ease: 'none', repeat: -1 });
    loop.progress(progress);
  };
  document.fonts.ready.then(build);
  // 只有「寬度」變了才重算：放在作品頁預覽裡展開程式碼時，iframe 只改高度、每一格都會觸發 resize
  // 拖拉視窗時每秒會觸發幾十次，等停下來 150 毫秒再重建一次就好
  let lastW = innerWidth, timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => { if (innerWidth !== lastW) { lastW = innerWidth; build(); } }, 150);
  });

  // 捲出畫面就暫停，回來再繼續：看不到的無限動畫不用一直算
  new IntersectionObserver(([e]) => loop && (e.isIntersecting ? loop.resume() : loop.pause())).observe(row);

  // 滑鼠移上去：不是直接停下，而是用 timeScale 慢慢減速；移開再慢慢加速回來
  row.addEventListener('pointerenter', () => gsap.to(loop, { timeScale: SLOW, duration: 0.6, ease: 'power2.out' }));
  row.addEventListener('pointerleave', () => gsap.to(loop, { timeScale: 1, duration: 0.6, ease: 'power2.in' }));
});
