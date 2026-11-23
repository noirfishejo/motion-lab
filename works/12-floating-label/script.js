// ── 試著改這幾個數字 ──
const DURATION = 0.45;  // 標籤浮起／落下要幾秒
const LIFT = -20;       // 標籤往上移多少 px
const SCALE = 0.75;     // 浮起後縮成幾倍

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const d = reduce ? 0 : DURATION;

document.querySelectorAll('.field').forEach(field => {
  const input = field.querySelector('.input');
  const label = field.querySelector('.label');
  const line = field.querySelector('.line');
  const error = field.querySelector('.error');

  // 標籤要不要浮在上方：正在輸入（有焦點）或已經有內容
  const isUp = () => document.activeElement === input || input.value !== '';

  function update() {
    const focused = document.activeElement === input;
    field.classList.toggle('is-focused', focused); // 標籤顏色交給 CSS（切換亮暗模式時才會跟著變）
    gsap.to(label, {
      y: isUp() ? LIFT : 0,
      scale: isUp() ? SCALE : 1,
      duration: d, ease: 'expo.out', overwrite: 'auto'
    });
    // 強調線：焦點時從左邊畫出來，離開時往右收掉
    gsap.to(line, {
      scaleX: focused ? 1 : 0,
      transformOrigin: focused ? '0% 50%' : '100% 50%',
      duration: d, ease: 'expo.out', overwrite: 'auto'
    });
  }

  input.addEventListener('focus', update);
  input.addEventListener('input', update);  // 瀏覽器自動填入時也會觸發
  input.addEventListener('blur', () => {
    update();
    if (input.type === 'email') validate();
  });

  // Email 格式不對：離開欄位時顯示錯誤，欄位輕輕左右晃一下
  function validate() {
    const bad = input.value !== '' && !input.checkValidity();
    field.classList.toggle('is-invalid', bad);
    input.setAttribute('aria-invalid', bad);
    error.textContent = bad ? 'Enter an email like name@example.com' : '';
    if (bad && !reduce) {
      gsap.fromTo(field, { x: 0 }, { keyframes: { x: [-6, 6, -4, 4, 0] }, duration: 0.4, ease: 'power1.out' });
      gsap.from(error, { y: -6, opacity: 0, duration: 0.3, ease: 'expo.out' });
    }
  }

  update(); // 一開始就依目前的內容擺好位置（例如瀏覽器記住的值）
});

// ── 自動示範一次（首頁縮圖也看得到動態）：幫第一個欄位填入假資料，標籤會浮起來 ──
// （不用 focus()：放在作品頁預覽裡，focus 會讓外面的頁面跟著捲動）
if (!reduce) {
  gsap.delayedCall(0.8, () => {
    const name = document.getElementById('name');
    name.value = 'Avery Chen';
    name.dispatchEvent(new Event('input'));
  });
}
