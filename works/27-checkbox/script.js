gsap.registerPlugin(DrawSVGPlugin);

// ── 試著改這兩個數字 ──
const DRAW = 0.35;    // 勾勾畫出來要幾秒
const STRIKE = 0.4;   // 刪除線畫完要幾秒

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.task').forEach(task => {
  const input = task.querySelector('input');
  const box = task.querySelector('.box');
  const path = task.querySelector('.check-path');
  const text = task.querySelector('.text');

  // 方塊的填色是 ::before，GSAP 動不到偽元素 → 改用 CSS 變數，動畫改變數
  const fill = { s: 0 };
  const paintFill = () => box.style.setProperty('--fill', fill.s);
  gsap.set(path, { drawSVG: '0%' });

  input.addEventListener('change', () => {
    const on = input.checked;
    task.classList.toggle('is-done', on);
    if (reduce) {
      gsap.set(path, { drawSVG: on ? '100%' : '0%' });
      box.style.setProperty('--fill', on ? 1 : 0);
      text.style.setProperty('--strike', on ? 1 : 0);
      return;
    }
    if (on) {
      gsap.timeline()
        // ① 方塊填色從中間放大，稍微超過再回來（像被按下去的回饋）
        .to(fill, { s: 1, duration: 0.3, ease: 'back.out(2.5)', onUpdate: paintFill })
        // ② 勾勾從左到右一筆畫出來
        .fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', duration: DRAW, ease: 'power2.out' }, 0.1)
        // ③ 刪除線從左畫到右
        .fromTo(text, { '--strike': 0 }, { '--strike': 1, duration: STRIKE, ease: 'expo.out' }, 0.2);
    } else {
      // 取消：全部快速收回（取消不需要儀式感）
      gsap.timeline()
        .to(path, { drawSVG: '0%', duration: 0.2, ease: 'power2.in' })
        .to(fill, { s: 0, duration: 0.2, ease: 'power2.in', onUpdate: paintFill }, 0)
        .to(text, { '--strike': 0, duration: 0.25, ease: 'power2.in' }, 0);
    }
  });
});

// ── 自動示範一次（首頁縮圖也看得到動態） ──
if (!reduce) {
  gsap.delayedCall(0.8, () => { const i = document.querySelector('.task input'); i.checked = true; i.dispatchEvent(new Event('change')); });
}
