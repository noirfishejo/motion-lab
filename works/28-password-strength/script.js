// ── 規則：每符合一條，強度加一級 ──
const RULES = {
  length: v => v.length >= 8,
  case: v => /[a-z]/.test(v) && /[A-Z]/.test(v),
  number: v => /\d/.test(v),
  symbol: v => /[^A-Za-z0-9]/.test(v)
};
// 強度的名稱和顏色（0 = 還沒打字）
const LEVELS = [
  { text: 'Start typing', color: 'var(--muted)' },
  { text: 'Weak', color: 'var(--danger)' },
  { text: 'Fair', color: 'var(--warning)' },
  { text: 'Good', color: 'var(--accent-fg)' },
  { text: 'Strong', color: 'var(--success)' }
];

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const input = document.getElementById('pw');
const bars = [...document.querySelectorAll('.meter i')];
const label = document.getElementById('strength');
const card = document.querySelector('.card');
let shown = -1;
let barsTl;   // 強度條的動畫

// 強度條：一次只動一格，前一格「完全填滿」才開始下一格（不會有好幾格同時在長的狀態）
// 變強：從左往右一格一格填；變弱：從右往左一格一格清空
const STEP = 0.16; // 每一格花幾秒
function fillBars(level) {
  barsTl?.kill();
  if (reduce) { bars.forEach((b, i) => b.style.setProperty('--on', i < level ? 1 : 0)); return; }
  const now = bars.map(b => parseFloat(b.style.getPropertyValue('--on') || 0));
  barsTl = gsap.timeline();
  // 先清空多出來的（從最右邊開始），再填不足的（從最左邊開始）
  for (let i = bars.length - 1; i >= level; i--) if (now[i] > 0) barsTl.to(bars[i], { '--on': 0, duration: STEP, ease: 'power2.in' });
  for (let i = 0; i < level; i++) if (now[i] < 1) barsTl.to(bars[i], { '--on': 1, duration: STEP, ease: 'power2.out' });
}

function update() {
  const v = input.value;
  let level = 0;
  document.querySelectorAll('.rules li').forEach(li => {
    const ok = RULES[li.dataset.rule](v);
    if (ok && !li.classList.contains('ok') && !reduce) {
      // 剛符合的那一條：小方塊放大再縮回、文字往右輕推一下（只是提示，不是按鈕）
      gsap.fromTo(li.querySelector('.bullet'), { scale: 2.2 }, { scale: 1, duration: 0.5, ease: 'expo.out' });
      gsap.fromTo(li.querySelector('.rule-text'), { x: 4 }, { x: 0, duration: 0.5, ease: 'expo.out' });
    }
    li.classList.toggle('ok', ok);
    li.querySelector('.state').textContent = ok ? 'Met' : 'Not met'; // 讀屏軟體：唸出符合／不符合
    if (ok) level++;
  });
  if (!v) level = 0;
  else level = Math.max(level, 1);
  if (level === shown) return;
  shown = level;

  card.style.setProperty('--level-color', LEVELS[level].color); // 顏色交給 CSS 變數，亮暗模式都正確
  label.textContent = LEVELS[level].text;
  fillBars(level);
  if (!reduce) gsap.fromTo(label, { y: 4, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'expo.out' });
}

input.addEventListener('input', update);

// 顯示／隱藏密碼
const reveal = document.querySelector('.reveal');
reveal.addEventListener('click', () => {
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  reveal.setAttribute('aria-pressed', show);
  reveal.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  reveal.querySelector('i').className = `ph-light ${show ? 'ph-eye-slash' : 'ph-eye'}`;
});

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
// ── 自動示範一次：一個字一個字「打」出一組密碼，看強度慢慢升級（假資料） ──
const demo = gsap.context(() => {
  if (!reduce) {
    const demo = 'Motion#2026';
    [...demo].forEach((_, i) => gsap.delayedCall(0.8 + i * 0.12, () => { input.value = demo.slice(0, i + 1); update(); }));
  }
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
