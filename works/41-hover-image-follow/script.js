// ── 試著改這幾個數字 ──
const FOLLOW = 0.5;     // 圖片追上游標要幾秒（越大越「飄」）
const TILT = 0.08;      // 移動速度換算成傾斜的比例
const MAX_TILT = 10;    // 最多傾斜幾度

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const list = document.querySelector('.projects');
const preview = document.querySelector('.preview');
const strip = preview.querySelector('.preview-strip');

// 只在有滑鼠、沒開「減少動態」時啟用；觸控裝置改成每列左邊的小圖（見 CSS）
if (!reduce && window.matchMedia('(hover: hover)').matches) {
  const moveX = gsap.quickTo(preview, 'x', { duration: FOLLOW, ease: 'power3.out' });
  const moveY = gsap.quickTo(preview, 'y', { duration: FOLLOW, ease: 'power3.out' });
  const rotate = gsap.quickTo(preview, 'rotation', { duration: FOLLOW, ease: 'power3.out' });
  let lastX = 0, shown = false;

  window.addEventListener('pointermove', e => {
    moveX(e.clientX);
    moveY(e.clientY);
    // 往右移得快就往右傾斜，停下來慢慢回正
    rotate(gsap.utils.clamp(-MAX_TILT, MAX_TILT, (e.clientX - lastX) * TILT * 10));
    lastX = e.clientX;
  });

  list.querySelectorAll('.project').forEach(row => {
    row.addEventListener('pointerenter', e => {
      const i = +row.dataset.index;
      if (!shown) {
        // 第一次出現：直接放在游標的位置（不要從畫面角落飛過來），再放大淡入
        gsap.set(preview, { x: e.clientX, y: e.clientY });
        moveX(e.clientX, e.clientX);
        moveY(e.clientY, e.clientY);
        gsap.set(strip, { yPercent: -i * (100 / strip.children.length) });
        shown = true;
      }
      gsap.to(preview, { opacity: 1, scale: 1, duration: 0.5, ease: 'expo.out', overwrite: 'auto' });
      // 換到這一列的圖片：整欄圖片上下移動（往下的列 → 圖片往上捲）
      gsap.to(strip, { yPercent: -i * (100 / strip.children.length), duration: 0.6, ease: 'expo.out', overwrite: true });
    });
  });
  list.addEventListener('pointerleave', () => {
    shown = false;
    gsap.to(preview, { opacity: 0, scale: 0.6, duration: 0.4, ease: 'expo.out', overwrite: 'auto' });
  });
}

document.querySelectorAll('.project').forEach(a => a.addEventListener('click', e => e.preventDefault())); // 示範用：連結不跳頁
