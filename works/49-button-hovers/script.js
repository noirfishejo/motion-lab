// ── 試著改這幾個數字 ──
const SPEED = 0.45;     // 大部分滑入／滑出動畫的秒數
const ROLL_STAGGER = 0.02; // 文字上捲：每個字母之間差幾秒

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dur = s => (reduce ? 0 : s);

// 滑鼠移入／移出，鍵盤 Tab 到按鈕也算移入（不然鍵盤使用者永遠看不到效果）
// 觸控沒有「停在上面」：只在 pointerType 是 mouse 時才播，免得手指點一下就卡在 hover 狀態
function onHover(el, enter, leave) {
  el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') enter(e); });
  el.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') leave(e); });
  el.addEventListener('focus', () => { if (el.matches(':focus-visible')) enter(); });
  el.addEventListener('blur', () => leave());
}

const effects = {};

// ── 1 方向填色：算出滑鼠離哪一邊最近，填色就從那一邊進來／出去 ──
{
  const btn = document.querySelector('.btn-fill');
  const fill = btn.querySelector('.fill');
  const OUT = {
    left:   { xPercent: -101, yPercent: 0 },
    right:  { xPercent: 101,  yPercent: 0 },
    top:    { xPercent: 0,    yPercent: -101 },
    bottom: { xPercent: 0,    yPercent: 101 }
  };
  const side = e => {
    if (!e) return 'left'; // 鍵盤：從左邊進來
    const r = btn.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    // 按鈕是扁的：上下邊的距離乘上寬高比，才不會幾乎每次都判成上下
    const d = { left: x, right: 1 - x, top: y * r.height / r.width, bottom: (1 - y) * r.height / r.width };
    return Object.keys(d).reduce((a, b) => (d[a] < d[b] ? a : b));
  };
  gsap.set(fill, OUT.left);
  effects.fill = {
    enter(e) {
      btn.classList.add('is-on');
      gsap.fromTo(fill, OUT[side(e)], { xPercent: 0, yPercent: 0, duration: dur(SPEED), ease: 'expo.out', overwrite: true });
    },
    leave(e) {
      btn.classList.remove('is-on');
      gsap.to(fill, { ...OUT[side(e)], duration: dur(SPEED), ease: 'expo.out', overwrite: true });
    }
  };
  onHover(btn, effects.fill.enter, effects.fill.leave);
}

// ── 2 文字上捲：把文字拆成字母，每個字母上下各一份，整排依序往上捲一格 ──
{
  const btn = document.querySelector('.btn-roll');
  const label = btn.querySelector('.label');
  const text = label.textContent;
  label.setAttribute('aria-hidden', 'true'); // 拆開的字母不給讀屏唸（會一個字母一個字母唸）
  label.innerHTML = [...text].map(ch => `<span class="char"><span class="char-in"><span>${ch}</span><span>${ch}</span></span></span>`).join('');
  btn.insertAdjacentHTML('beforeend', `<span class="sr-only">${text}</span>`); // 讀屏唸完整的字
  const rows = label.querySelectorAll('.char-in');
  effects.roll = {
    enter() { gsap.to(rows, { yPercent: -50, duration: dur(0.5), stagger: ROLL_STAGGER, ease: 'expo.out', overwrite: true }); },
    leave() { gsap.to(rows, { yPercent: 0, duration: dur(0.5), stagger: ROLL_STAGGER, ease: 'expo.out', overwrite: true }); }
  };
  onHover(btn, effects.roll.enter, effects.roll.leave);
}

// ── 3 外框描邊：stroke-dashoffset 從 1 到 0（pathLength="1"，不用量外框有多長） ──
{
  const btn = document.querySelector('.btn-draw');
  const rect = btn.querySelector('rect');
  effects.draw = {
    enter() { gsap.fromTo(rect, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur(0.7), ease: 'power2.inOut', overwrite: true }); },
    // 離開時繼續往同一個方向「收掉」（0 → -1），比倒退回去自然
    leave() { gsap.to(rect, { strokeDashoffset: -1, duration: dur(0.5), ease: 'power2.inOut', overwrite: true }); }
  };
  onHover(btn, effects.draw.enter, effects.draw.leave);
}

// ── 4 箭頭推出：一條暫停的時間軸，移入 play、移出 reverse ──
{
  const btn = document.querySelector('.btn-arrow');
  const [out, back] = btn.querySelectorAll('.arrow i');
  const tl = gsap.timeline({ paused: true, defaults: { duration: dur(0.4), ease: 'expo.inOut' } })
    .to(out, { xPercent: 110 })
    .fromTo(back, { xPercent: -110 }, { xPercent: 0 }, '<0.08');
  gsap.set(back, { xPercent: -110 });
  effects.arrow = { enter: () => tl.play(), leave: () => tl.reverse() };
  onHover(btn, effects.arrow.enter, effects.arrow.leave);
}

// ── 5 果凍按壓：按下時壓扁（變寬變矮），放開用 elastic 彈回 ──
{
  const btn = document.querySelector('.btn-squash');
  const press = () => gsap.to(btn, { scaleX: 1.06, scaleY: 0.88, duration: dur(0.12), ease: 'power2.out', overwrite: true });
  const release = () => gsap.to(btn, { scaleX: 1, scaleY: 1, duration: dur(0.9), ease: 'elastic.out(1, 0.3)', overwrite: true });
  btn.addEventListener('pointerdown', press);
  btn.addEventListener('pointerup', release);
  btn.addEventListener('pointerleave', release);
  // 鍵盤：空白鍵／Enter 按下也壓扁（e.repeat：按住不放時不要一直重來）
  btn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) press(); });
  btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') release(); });
  effects.squash = { enter: press, leave: release };
}

// ── 6 游標光暈：quickTo 只建一次補間，滑鼠每動一下只更新終點（CSS 變數 --x、--y） ──
{
  const btn = document.querySelector('.btn-glow');
  const toX = gsap.quickTo(btn, '--x', { duration: dur(0.4), ease: 'power3' });
  const toY = gsap.quickTo(btn, '--y', { duration: dur(0.4), ease: 'power3' });
  const move = e => {
    const r = btn.getBoundingClientRect();
    if (e) { toX(e.clientX - r.left); toY(e.clientY - r.top); }
    else { toX(r.width / 2); toY(r.height / 2); } // 鍵盤：光暈停在正中間
  };
  btn.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') move(e); });
  effects.glow = {
    enter(e) {
      const r = btn.getBoundingClientRect();
      // 進來的那一格先直接跳到滑鼠位置，不然光暈會從上一次離開的地方滑過來
      if (e) gsap.set(btn, { '--x': e.clientX - r.left, '--y': e.clientY - r.top }); else move();
      gsap.to(btn, { '--on': 1, duration: dur(0.3), overwrite: 'auto' });
    },
    leave() { gsap.to(btn, { '--on': 0, duration: dur(0.4), overwrite: 'auto' }); }
  };
  onHover(btn, effects.glow.enter, effects.glow.leave);
}

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (reduce) return;
  // 假的滑鼠位置：從按鈕左邊中間進來、從右邊出去
  const at = (sel, x) => { const r = document.querySelector(sel).getBoundingClientRect(); return { clientX: r.left + r.width * x, clientY: r.top + r.height / 2 }; };
  const order = [['fill', '.btn-fill'], ['roll', '.btn-roll'], ['draw', '.btn-draw'], ['arrow', '.btn-arrow'], ['squash', '.btn-squash'], ['glow', '.btn-glow']];
  const tl = gsap.timeline({ delay: 0.6 });
  order.forEach(([key, sel], i) => {
    const t = i * 0.55;
    tl.add(() => effects[key].enter(at(sel, 0.02)), t);
    if (key === 'glow') tl.to(document.querySelector(sel), { '--x': () => at(sel, 0.9).clientX - document.querySelector(sel).getBoundingClientRect().left, duration: 0.8, ease: 'power2.inOut' }, t + 0.1);
    tl.add(() => effects[key].leave(at(sel, 0.98)), t + (key === 'squash' ? 0.2 : key === 'glow' ? 1 : 0.9));
  });
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
