// ── 試著改這幾個數字 ──
const PRICE = 48;  // 單價（假資料）
const MIN = 1;
const MAX = 5;     // 庫存上限：超過時數字框會左右搖一下並顯示提示

const stepper = document.querySelector('.stepper');
const win = document.querySelector('.qty-window');
const minus = document.querySelector('[data-step="-1"]');
const plusBtn = document.querySelector('[data-step="1"]');
const totalEl = document.querySelector('.total');
const cart = document.querySelector('.cart');
const badge = document.querySelector('.badge');
const msg = document.querySelector('.msg');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dur = s => (reduce ? 0 : s);

let qty = 1;
let shown = win.querySelector('.qty'); // 目前顯示中的數字（連續快點時，舊的可能還在滑出去，不能用 querySelector 找）
const total = { value: PRICE }; // 小計用一個物件補間，數字才會「跑」過去

function change(step) {
  const next = qty + step;
  if (next > MAX) return refuse(`Only ${MAX} left in stock`);
  if (next < MIN) return;
  const dir = step > 0 ? 1 : -1;
  qty = next;

  // ① 數字交換：加的時候舊數字往上滑出、新數字從下面進來；減的時候反過來
  const old = shown;
  const fresh = document.createElement('span');
  fresh.className = 'qty';
  fresh.textContent = qty;
  win.append(fresh);
  shown = fresh;
  gsap.timeline({ defaults: { duration: dur(0.45), ease: 'expo.out' }, onComplete: () => old.remove() })
    .to(old, { yPercent: -100 * dir, opacity: 0, overwrite: true })
    .fromTo(fresh, { yPercent: 100 * dir, opacity: 0 }, { yPercent: 0, opacity: 1 }, 0);

  // ② 小計從舊的金額跑到新的金額
  gsap.to(total, {
    value: qty * PRICE, duration: dur(0.6), ease: 'power2.out', overwrite: true,
    onUpdate: () => { totalEl.textContent = `$${Math.round(total.value)}`; }
  });

  // ③ 購物車：徽章跳一下、購物袋左右搖一下（keyframes：依序經過這幾個值）
  badge.textContent = qty;
  cart.setAttribute('aria-label', `Cart, ${qty} items`);
  if (!reduce) {
    gsap.fromTo(badge, { scale: 1 }, { keyframes: { scale: [1, 1.45, 1] }, duration: 0.45, ease: 'power2.out', overwrite: true });
    gsap.fromTo(cart.querySelector('i'), { rotation: 0 }, { keyframes: { rotation: [0, -14, 10, -6, 0] }, duration: 0.5, overwrite: true });
  }

  minus.setAttribute('aria-disabled', qty <= MIN);
  msg.textContent = '';
}

// 超過上限：不是把按鈕停用（使用者會不知道為什麼按不了），而是搖一下並說明原因
function refuse(text) {
  msg.textContent = text;
  if (!reduce) gsap.fromTo(stepper, { x: 0 }, { keyframes: { x: [0, -6, 6, -4, 4, 0] }, duration: 0.4, ease: 'none', overwrite: true });
  gsap.fromTo(msg, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: dur(0.4), ease: 'expo.out' });
}

minus.addEventListener('click', () => change(-1));
plusBtn.addEventListener('click', () => change(1));
minus.setAttribute('aria-disabled', true);

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
if (!reduce) {
  gsap.delayedCall(0.8, () => change(1));
  gsap.delayedCall(1.5, () => change(1));
}
// #endregion demo
