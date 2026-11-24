// ── 試著改這幾個數字 ──
const DURATION = 0.45;   // 滑塊移動要幾秒
const STRETCH = 1.4;     // 移動途中滑塊被「拉長」的倍數（1 就是不變形）
const PRESS = 1.15;      // 按住時滑塊先變寬多少，給手指「準備滑過去」的感覺

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.switch').forEach(sw => {
  const thumb = sw.querySelector('.thumb');
  const hint = sw.closest('.row').querySelector('.row-hint');

  // 滑塊要移動的距離：軌道內寬 − 滑塊寬（用量的，改 CSS 尺寸也不用改這裡）
  const travel = () => sw.clientWidth - parseFloat(getComputedStyle(sw).paddingLeft) * 2 - thumb.offsetWidth;

  // 一開始就放在正確的位置（開著的開關，滑塊在右邊）
  gsap.set(thumb, { x: sw.getAttribute('aria-checked') === 'true' ? travel() : 0 });

  function toggle() {
    const on = sw.getAttribute('aria-checked') !== 'true';
    sw.setAttribute('aria-checked', on);           // 顏色交給 CSS 變
    hint.textContent = on ? hint.dataset.on : hint.dataset.off;

    if (reduce) { gsap.set(thumb, { x: on ? travel() : 0, scaleX: 1 }); return; }

    // overwrite: true → 連點時，先停掉上一次還沒跑完的動畫，從目前的位置接著走
    gsap.to(thumb, { x: on ? travel() : 0, duration: DURATION, ease: 'expo.out', overwrite: true });
    // 移動途中拉長再縮回：從「出發的那一側」拉長，看起來像往前衝
    gsap.fromTo(thumb,
      { scaleX: STRETCH, transformOrigin: on ? '0% 50%' : '100% 50%' },
      { scaleX: 1, duration: DURATION * 0.9, ease: 'expo.out' });
  }

  sw.addEventListener('click', toggle);             // 滑鼠、觸控、鍵盤（Enter／空白鍵）都會觸發 click

  // 按住：滑塊稍微變寬（iOS 的開關也有這個細節）
  if (!reduce) {
    sw.addEventListener('pointerdown', () => {
      const on = sw.getAttribute('aria-checked') === 'true';
      gsap.to(thumb, { scaleX: PRESS, transformOrigin: on ? '100% 50%' : '0% 50%', duration: 0.2, ease: 'power2.out' });
    });
    sw.addEventListener('pointerleave', () => gsap.to(thumb, { scaleX: 1, duration: 0.3, ease: 'expo.out' }));
  }
});

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
// ── 自動示範一次（首頁縮圖也看得到動態） ──
const demo = gsap.context(() => {
  if (!reduce) {
    const demo = document.querySelectorAll('.switch')[1];
    gsap.delayedCall(0.8, () => demo.click());
  }
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
