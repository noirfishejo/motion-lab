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

function update() {
  const v = input.value;
  let level = 0;
  document.querySelectorAll('.rules li').forEach(li => {
    const ok = RULES[li.dataset.rule](v);
    if (ok && !li.classList.contains('ok') && !reduce) {
      // 剛符合的那一條：打勾的小方塊彈一下
      gsap.fromTo(li.querySelector('.mark'), { scale: 0.4 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
    }
    li.classList.toggle('ok', ok);
    if (ok) level++;
  });
  if (!v) level = 0;
  else level = Math.max(level, 1);
  if (level === shown) return;
  shown = level;

  card.style.setProperty('--level-color', LEVELS[level].color); // 顏色交給 CSS 變數，亮暗模式都正確
  label.textContent = LEVELS[level].text;
  // 強度條：前 level 格填滿、後面清空；stagger 讓它從左到右一格一格填（清空時從右到左）
  gsap.to(bars, {
    '--on': i => (i < level ? 1 : 0),
    duration: reduce ? 0 : 0.4,
    ease: 'expo.out',
    stagger: { each: reduce ? 0 : 0.06, from: 'start' }
  });
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

// ── 自動示範一次：一個字一個字「打」出一組密碼，看強度慢慢升級（假資料） ──
if (!reduce) {
  const demo = 'Motion#2026';
  [...demo].forEach((_, i) => gsap.delayedCall(0.8 + i * 0.12, () => { input.value = demo.slice(0, i + 1); update(); }));
}
