// ── 試著改這兩個數字，看看節奏怎麼變 ──
const HOLD = 1.4;     // 每個步驟停留多久（秒）
const OVERLAP = 0.3;  // 下一步提早幾秒進場（和上一步的離場重疊）

const steps = gsap.utils.toArray('.step');
const fills = gsap.utils.toArray('.dot i');

// 一開始全部藏起來，由 timeline 一個一個叫出來
gsap.set(steps, { autoAlpha: 0 });

// ── 進場：回傳一段「小 timeline」，再放進主 timeline ──
function enter(step, i) {
  return gsap.timeline({ defaults: { ease: 'expo.out', duration: 0.9 } })
    .set(step, { autoAlpha: 1 })
    .from(step.querySelector('.icon'), { scale: 0.4, rotation: -90, opacity: 0 })
    // '<0.1'：在上一段「開始後」0.1 秒播放
    .from(step.querySelector('h2 span'), { yPercent: 110 }, '<0.1')
    .from(step.querySelector('p'), { y: 16, opacity: 0 }, '<0.15')
    .to(fills[i], { scaleX: 1, duration: 0.6, ease: 'power2.out' }, '<');
}

// ── 離場：往左滑出 ──
function leave(step) {
  return gsap.timeline()
    .to(step.children, { x: -40, opacity: 0, duration: 0.5, stagger: 0.05, ease: 'expo.in' })
    .set(step, { autoAlpha: 0 });
}

// ── 主 timeline：用 label 標出每個步驟的位置 ──
const tl = gsap.timeline({ onUpdate: updateRuler });

tl.add(enter(steps[0], 0), 'step1')
  .add(leave(steps[0]), `+=${HOLD}`)            // 停留 HOLD 秒後離場
  .add(enter(steps[1], 1), `-=${OVERLAP}`)      // 離場還沒結束就提早進場
  .addLabel('step2', '<')                        // 把 label 放在剛剛那段的開頭
  .add(leave(steps[1]), `+=${HOLD}`)
  .add(enter(steps[2], 2), `-=${OVERLAP}`)
  .addLabel('step3', '<');

// ── 時間軸視覺化：把 label 畫成刻度，播放頭跟著進度走 ──
const labelsEl = document.querySelector('.ruler-labels');
const playhead = document.querySelector('.playhead');
const labelEls = Object.entries(tl.labels).map(([name, time]) => {
  const el = document.createElement('span');
  el.textContent = `${name}  ${time.toFixed(1)}s`;
  el.style.left = `${(time / tl.duration()) * 100}%`;
  el.dataset.time = time;
  labelsEl.appendChild(el);
  return el;
});
// 最後一個刻度的文字改放在刻度左邊，避免超出畫面
labelEls[labelEls.length - 1]?.classList.add('end');

function updateRuler() {
  gsap.set(playhead, { scaleX: tl.progress() });
  labelEls.forEach(el => el.classList.toggle('on', tl.time() >= Number(el.dataset.time)));
}

// 尊重「減少動態」設定：直接跳到最後一個步驟
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) tl.progress(1);
