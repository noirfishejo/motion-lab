// ── 試著改這幾個數字 ──
const REQUEST_TIME = 1.4;  // 假裝送出要等幾秒（真實情況是等伺服器回應）
const HOLD = 1.8;          // 成功的「Sent」顯示幾秒後回到原本的樣子
const SQUARE = 52;         // 送出中縮成的方塊大小（和按鈕高度相同）

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const btn = document.querySelector('.submit');
const idle = btn.querySelector('.face-idle');
const ok = btn.querySelector('.face-ok');
const fail = btn.querySelector('.face-fail');
const spinner = btn.querySelector('.spinner');
const status = document.getElementById('status');
const failNext = document.getElementById('failNext');

const fullWidth = btn.offsetWidth; // 原本的寬度（量一次，變回來時用）
let spin;                          // 旋轉中的方塊動畫
let shown = idle;                  // 目前顯示的是哪一段文字
let back;                          // 成功後「回到原本樣子」的計時

// 假的送出：等 REQUEST_TIME 秒後，依勾選框決定成功或失敗
const fakeRequest = () => new Promise((resolve, reject) =>
  setTimeout(() => (failNext.checked ? reject() : resolve()), REQUEST_TIME * 1000));

// 換掉目前顯示的文字：舊的往上淡出，新的從下面淡入
function swapFace(from, to) {
  shown = to;
  if (reduce) { gsap.set(from, { autoAlpha: 0 }); gsap.set(to, { autoAlpha: 1, y: 0 }); return gsap.timeline(); }
  return gsap.timeline()
    .to(from, { autoAlpha: 0, y: -12, duration: 0.2, ease: 'power2.in' })
    .fromTo(to, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'expo.out' });
}

async function submit() {
  if (btn.getAttribute('aria-busy') === 'true') return; // 送出中再點：不會重複送出
  btn.setAttribute('aria-busy', 'true');
  btn.classList.remove('is-fail');
  status.textContent = 'Sending…';
  back?.kill(); // 成功後還沒變回原樣就又按：取消「變回原樣」

  // ① 送出中：文字淡出 → 按鈕縮成方塊 → 小方塊開始轉
  await gsap.timeline()
    .to(shown, { autoAlpha: 0, y: -12, duration: reduce ? 0 : 0.2, ease: 'power2.in' })
    .to(btn, { width: SQUARE, duration: reduce ? 0 : 0.45, ease: 'expo.inOut' })
    .set(spinner, { autoAlpha: 1 });
  spin = gsap.to(spinner, { rotation: '+=360', duration: 0.9, ease: 'none', repeat: -1 });

  try {
    await fakeRequest();
    await settle(ok, false);
    status.textContent = 'Message sent';
    // 成功：停一下再回到原本的「Send message」
    back = gsap.delayedCall(HOLD, () => swapFace(ok, idle));
  } catch {
    await settle(fail, true);
    status.textContent = 'Sending failed. Try again.';
    // 失敗：左右搖晃，像「不行」的搖頭
    if (!reduce) gsap.fromTo(btn, { x: 0 }, { keyframes: { x: [-10, 10, -7, 7, -3, 0] }, duration: 0.45, ease: 'power1.out' });
  }
  btn.setAttribute('aria-busy', 'false');
}

// ② 結束：小方塊停下 → 按鈕撐回原本寬度 → 顯示結果文字
function settle(face, isFail) {
  shown = face;
  spin.kill();
  btn.classList.toggle('is-fail', isFail); // 底色交給 CSS 過渡
  return gsap.timeline()
    .to(spinner, { autoAlpha: 0, rotation: 0, scale: 0.4, duration: reduce ? 0 : 0.2 })
    .to(btn, { width: fullWidth, duration: reduce ? 0 : 0.5, ease: 'expo.out' })
    .fromTo(face, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: reduce ? 0 : 0.4, ease: 'expo.out' }, '-=0.25')
    .set(spinner, { scale: 1 });
}

btn.addEventListener('click', submit);

// ── 自動示範一次（首頁縮圖也看得到動態） ──
if (!reduce) gsap.delayedCall(0.8, submit);
