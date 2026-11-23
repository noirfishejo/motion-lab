gsap.registerPlugin(DrawSVGPlugin);

// ── 假的上傳：每一段「進度到哪、花幾秒」，故意不等速，比較像真實網路 ──
const STEPS = [[0.18, 0.5], [0.42, 0.7], [0.47, 0.6], [0.8, 0.8], [1, 0.5]];

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const bar = document.querySelector('.bar');
const line = document.querySelector('.line i');
const pct = document.querySelector('.pct');
const icon = document.querySelector('.done-icon');
const status = document.querySelector('.status');
const btn = document.querySelector('.upload');
const state = { p: 0 }; // 目前進度 0～1：環、長條、百分比數字都看這個值

const render = () => {
  gsap.set(bar, { drawSVG: `${state.p * 100}%` });  // 環：畫出百分比那麼長
  gsap.set(line, { scaleX: state.p });              // 長條
  pct.textContent = `${Math.round(state.p * 100)}%`;
};

function upload() {
  btn.disabled = true;
  status.textContent = 'Uploading…';
  gsap.set([pct, bar], { opacity: 1 });
  gsap.set(icon, { opacity: 0, scale: 0.4 });
  bar.classList.remove('is-done');
  state.p = 0; render();

  const tl = gsap.timeline({ onComplete: done });
  // 依序跑每一段進度；onUpdate 每一格畫面都重畫一次
  STEPS.forEach(([to, sec]) => tl.to(state, { p: to, duration: reduce ? 0 : sec, ease: 'power1.inOut', onUpdate: render }));
}

function done() {
  status.textContent = 'Uploaded · 4.2 MB';
  btn.disabled = false;
  if (reduce) { gsap.set(pct, { opacity: 0 }); gsap.set(icon, { opacity: 1, scale: 1 }); return; }
  // 完成：百分比淡出、環變成綠色的實心圈、打勾彈出來
  gsap.timeline()
    .to(pct, { opacity: 0, scale: 0.6, duration: 0.2 })
    .add(() => bar.classList.add('is-done'), 0)        // 顏色交給 CSS（亮暗模式的綠色不同）
    .to(icon, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(3)' }, 0.15)
    .add(() => bar.classList.remove('is-done'), '+=1.2')
    .set(pct, { scale: 1 });
}

btn.addEventListener('click', upload);
render();
// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
// ── 自動示範一次（首頁縮圖也看得到動態） ──
if (!reduce) gsap.delayedCall(0.8, upload);
// #endregion demo
