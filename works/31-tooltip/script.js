// ── 試著改這幾個數字 ──
const DELAY = 0.45;     // 第一次要停多久才出現（秒）：太短會讓滑過去的人被閃到
const WARM = 0.4;       // 提示框消失後，這段時間內移到別的按鈕會「立刻」出現（不用再等 DELAY）
const GAP = 8;          // 提示框和按鈕之間的距離（px）

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const tip = document.getElementById('tooltip');
const text = tip.querySelector('.tip-text');
const key = tip.querySelector('.tip-key');
let showTimer, lastHidden = -Infinity, current = null;

function place(btn) {
  const r = btn.getBoundingClientRect();
  return { x: r.left + r.width / 2 - tip.offsetWidth / 2, y: r.top - tip.offsetHeight - GAP };
}

function show(btn) {
  const wasVisible = current !== null;
  current = btn;
  text.textContent = btn.dataset.tip;
  key.textContent = btn.dataset.key;
  btn.setAttribute('aria-describedby', 'tooltip');
  const { x, y } = place(btn);
  if (reduce) { gsap.set(tip, { x, y, opacity: 1 }); return; }
  if (wasVisible) {
    // 已經有提示框：直接滑到新按鈕上面（不淡出再淡入，比較不閃）
    gsap.to(tip, { x, y, duration: 0.25, ease: 'expo.out', overwrite: true });
  } else {
    gsap.set(tip, { x, y: y + 4 });
    gsap.to(tip, { y, opacity: 1, duration: 0.2, ease: 'expo.out', overwrite: true });
  }
}

function hide() {
  clearTimeout(showTimer);
  if (!current) return;
  current.removeAttribute('aria-describedby');
  current = null;
  lastHidden = performance.now();
  gsap.to(tip, { opacity: 0, duration: reduce ? 0 : 0.12, overwrite: true });
}

document.querySelectorAll('.tool').forEach(btn => {
  btn.addEventListener('pointerenter', () => {
    clearTimeout(showTimer);
    // 「暖機」：剛剛才看過提示框（或現在就開著），就不用再等
    const warm = current || performance.now() - lastHidden < WARM * 1000;
    if (warm) show(btn);
    else showTimer = setTimeout(() => show(btn), DELAY * 1000);
  });
  btn.addEventListener('pointerleave', e => {
    // 移到隔壁的按鈕：不要先藏起來（交給下一個按鈕的 pointerenter 直接滑過去）
    if (e.relatedTarget?.closest?.('.tool')) return;
    hide();
  });
  btn.addEventListener('focus', () => { if (btn.matches(':focus-visible')) show(btn); }); // 鍵盤移到按鈕上：立刻顯示
  btn.addEventListener('blur', hide);
  btn.addEventListener('pointerdown', hide);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });

// ── 自動示範一次：提示框依序滑過三個按鈕（不移動焦點） ──
if (!reduce) {
  const tools = document.querySelectorAll('.tool');
  gsap.delayedCall(0.8, () => show(tools[0]));
  gsap.delayedCall(1.5, () => show(tools[1]));
  gsap.delayedCall(2.2, () => show(tools[2]));
  gsap.delayedCall(3.2, hide);
}
