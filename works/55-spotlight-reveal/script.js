// ── 試著改這幾個數字 ──
const RADIUS = 130;   // 手電筒照到的半徑（px）
const FOLLOW = 0.35;  // 光圈跟上游標要幾秒：越大越「拖」

const spot = document.getElementById('spot');
const specs = spot.querySelector('.specs');
const toggle = document.getElementById('toggle');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dur = s => (reduce ? 0 : s);

// 光圈位置：quickTo 只建一次補間，游標每動一下只更新終點（CSS 變數是沒有單位的數字，CSS 裡乘上 1px）
const toX = gsap.quickTo(specs, '--x', { duration: dur(FOLLOW), ease: 'power3' });
const toY = gsap.quickTo(specs, '--y', { duration: dur(FOLLOW), ease: 'power3' });
let allOn = false;

function local(e) {
  const r = spot.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top];
}
// 光圈打開／關上：只補間半徑
const openLight = (r = RADIUS) => gsap.to(specs, { '--r': r, duration: dur(0.5), ease: 'expo.out', overwrite: 'auto' });
const closeLight = () => gsap.to(specs, { '--r': 0, duration: dur(0.4), ease: 'power2.in', overwrite: 'auto' });

spot.addEventListener('pointerenter', e => {
  if (allOn || e.pointerType !== 'mouse') return;
  const [x, y] = local(e);
  gsap.set(specs, { '--x': x, '--y': y }); // 進來的那一刻光圈直接在游標上，不要從上次離開的地方滑過來
  openLight();
});
spot.addEventListener('pointermove', e => {
  if (allOn) return;
  const [x, y] = local(e);
  toX(x); toY(y);
});
spot.addEventListener('pointerleave', () => { if (!allOn) closeLight(); });

// 全部打開：光圈從畫面中間放大到蓋住整塊（半徑 = 對角線）
toggle.addEventListener('click', () => {
  allOn = !allOn;
  toggle.setAttribute('aria-pressed', allOn);
  toggle.querySelector('span').textContent = allOn ? 'Hide specs' : 'Show all specs';
  if (allOn) {
    gsap.set(specs, { '--x': spot.clientWidth / 2, '--y': spot.clientHeight / 2 });
    openLight(Math.hypot(spot.clientWidth, spot.clientHeight));
  } else closeLight();
});

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (reduce) return;
  const w = spot.clientWidth, h = spot.clientHeight;
  gsap.set(specs, { '--x': w * 0.2, '--y': h * 0.45 });
  gsap.timeline({ delay: 0.7 })
    .add(() => openLight())
    .to(specs, { '--x': w * 0.75, '--y': h * 0.4, duration: 1.4, ease: 'power1.inOut' }, 0.1)
    .to(specs, { '--x': w * 0.55, '--y': h * 0.8, duration: 0.9, ease: 'power1.inOut' })
    .add(() => closeLight(), '+=0.3');
});
// 自己動手（按滑鼠或鍵盤，或游標進到畫面裡）就停掉示範，免得和你的操作互搶
const stopDemo = () => { demo.kill(); if (!allOn) closeLight(); }; // 示範停在半路：光圈先收起來
['pointerdown', 'keydown'].forEach(type => addEventListener(type, stopDemo, { once: true, capture: true }));
spot.addEventListener('pointerenter', stopDemo, { once: true, capture: true });
// #endregion demo
