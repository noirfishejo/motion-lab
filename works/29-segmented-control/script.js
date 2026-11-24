// ── 假資料：每個區間的長條（0～1 的比例） ──
const DATA = {
  day: [0.3, 0.5, 0.4, 0.8, 0.6, 0.9, 0.7],
  week: [0.6, 0.7, 0.5, 0.9, 0.8, 0.6, 0.4],
  month: [0.4, 0.6, 0.9, 0.7, 0.5, 0.8, 0.95],
  year: [0.9, 0.7, 0.6, 0.8, 1, 0.85, 0.75]
};
const TOTALS = { day: '1,204 visits', week: '8,912 visits', month: '36,480 visits', year: '402,115 visits' };

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const group = document.querySelector('.segmented');
const pill = group.querySelector('.pill');
const options = [...group.querySelectorAll('[role="radio"]')];
const chart = document.querySelector('.chart');
const total = document.querySelector('.total');
chart.innerHTML = '<i></i>'.repeat(7);
const bars = [...chart.children];

function select(btn, animate = true) {
  options.forEach(o => { const on = o === btn; o.setAttribute('aria-checked', on); o.tabIndex = on ? 0 : -1; });
  const d = animate && !reduce ? 0.5 : 0;
  // 底色滑到選中的那一格：xPercent 100 = 移動「自己一整格的寬度」
  gsap.to(pill, { xPercent: options.indexOf(btn) * 100, duration: d, ease: 'expo.out', overwrite: true });
  // 長條圖：每一根長到新的高度（scaleY），由左到右依序
  gsap.to(bars, { scaleY: i => DATA[btn.dataset.range][i], duration: d * 1.4, stagger: d ? 0.04 : 0, ease: 'expo.out', overwrite: true });
  total.textContent = TOTALS[btn.dataset.range];
}

options.forEach(o => o.addEventListener('click', () => select(o)));
// 鍵盤：左右方向鍵切換（radiogroup 的標準用法）
group.addEventListener('keydown', e => {
  const i = options.indexOf(document.activeElement);
  if (i < 0 || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  e.preventDefault();
  const next = options[(i + (e.key === 'ArrowRight' ? 1 : -1) + options.length) % options.length];
  next.focus();
  select(next);
});

gsap.set(bars, { scaleY: 0 });
select(options[0], false);
if (!reduce) gsap.from(bars, { scaleY: 0, duration: 0.8, stagger: 0.05, ease: 'expo.out', delay: 0.2 });
// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
// ── 自動示範一次（首頁縮圖也看得到動態） ──
const demo = gsap.context(() => {
  if (!reduce) gsap.delayedCall(1.4, () => select(options[2]));
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
