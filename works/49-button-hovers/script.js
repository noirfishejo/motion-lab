// ── 試著改這幾個數字 ──
const SPEED = 0.45;     // 大部分滑入／滑出動畫的秒數
const ROLL_STAGGER = 0.02; // 文字上捲：每個字母之間差幾秒
const STRENGTH = 0.4;   // 磁吸力道：按鈕跟著滑鼠移動的比例（0 不動，1 完全貼著滑鼠；0.3～0.5 最自然）
const LABEL_EXTRA = 0.5; // 磁吸：文字比按鈕再多移多少，做出前後層次
const RIPPLE_DURATION = 0.7; // 波紋擴散要幾秒

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

// ── 5 磁吸：游標在格子裡時，按鈕往游標方向移動一部分距離，文字再多移一點 ──
{
  const zone = document.querySelector('.magnet-zone');
  const btn = zone.querySelector('.btn-magnetic');
  const label = btn.querySelector('.label');
  // quickTo：x、y 各建一次補間，滑鼠每動一下只丟新的終點進去
  const ease = { duration: dur(0.6), ease: 'expo.out' };
  const bx = gsap.quickTo(btn, 'x', ease), by = gsap.quickTo(btn, 'y', ease);
  const lx = gsap.quickTo(label, 'x', ease), ly = gsap.quickTo(label, 'y', ease);
  let cx = 0, cy = 0; // 按鈕「原位」的中心點：進入格子時量一次，移動時不再讀版面
  const measure = () => {
    const r = btn.getBoundingClientRect();
    cx = r.left + r.width / 2 - gsap.getProperty(btn, 'x');
    cy = r.top + r.height / 2 - gsap.getProperty(btn, 'y');
  };
  let back = null; // 離開時的彈回補間
  const pull = (dx, dy) => {
    back?.kill(); // 彈回途中又靠近：先停掉彈回，交給 quickTo（不能用 overwrite，會把 quickTo 的補間一起殺掉）
    bx(dx * STRENGTH); by(dy * STRENGTH); lx(dx * STRENGTH * LABEL_EXTRA); ly(dy * STRENGTH * LABEL_EXTRA);
  };
  effects.magnet = {
    enter(e) { measure(); if (e) pull(e.clientX - cx, e.clientY - cy); },
    move(e) { pull(e.clientX - cx, e.clientY - cy); },
    // 離開：用有彈性的 ease 回到原位，像被橡皮筋拉回來
    leave() { back = gsap.to([btn, label], { x: 0, y: 0, duration: dur(1), ease: 'elastic.out(1, 0.4)' }); }
  };
  // 只給滑鼠（手機沒有「靠近」這件事），減少動態時不吸
  if (!reduce) {
    zone.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') effects.magnet.enter(e); });
    zone.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') effects.magnet.move(e); });
    zone.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') effects.magnet.leave(); });
  }
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

// ── 7 果凍按壓：按下時壓扁（變寬變矮），放開用 elastic 彈回 ──
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

// ── 8 波紋：在按下的位置放一個方塊，放大到蓋住整顆按鈕再淡掉 ──
{
  const btn = document.querySelector('.btn-ripple');
  effects.ripple = {
    enter(x = btn.offsetWidth / 2, y = btn.offsetHeight / 2) {
      if (reduce) return;
      const w = btn.offsetWidth, h = btn.offsetHeight;
      // 要大到能蓋住整顆按鈕：用「按下的位置到最遠角落」的距離當半徑
      const size = Math.hypot(Math.max(x, w - x), Math.max(y, h - y)) * 2;
      const dot = document.createElement('span');
      dot.className = 'ripple';
      Object.assign(dot.style, { width: `${size}px`, height: `${size}px`, left: `${x - size / 2}px`, top: `${y - size / 2}px` });
      btn.prepend(dot); // 放在文字前面，文字才會疊在波紋上
      gsap.timeline({ onComplete: () => dot.remove() })
        .fromTo(dot, { scale: 0, opacity: 0.35 }, { scale: 1, duration: RIPPLE_DURATION, ease: 'expo.out' })
        .to(dot, { opacity: 0, duration: RIPPLE_DURATION * 0.6, ease: 'power1.out' }, '-=0.35');
    }
  };
  btn.addEventListener('pointerdown', e => {
    const r = btn.getBoundingClientRect();
    effects.ripple.enter(e.clientX - r.left, e.clientY - r.top);
  });
  // 鍵盤按 Enter／空白鍵：從按鈕中心擴散
  btn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) effects.ripple.enter(); });
}

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (reduce) return;
  // 假的滑鼠位置：從按鈕左邊中間進來、從右邊出去
  const at = (sel, x) => { const r = document.querySelector(sel).getBoundingClientRect(); return { clientX: r.left + r.width * x, clientY: r.top + r.height / 2 }; };
  const order = [['fill', '.btn-fill'], ['roll', '.btn-roll'], ['draw', '.btn-draw'], ['arrow', '.btn-arrow'], ['magnet', '.btn-magnetic'], ['glow', '.btn-glow'], ['squash', '.btn-squash'], ['ripple', '.btn-ripple']];
  const tl = gsap.timeline({ delay: 0.6 });
  order.forEach(([key, sel], i) => {
    const t = i * 0.5;
    const el = document.querySelector(sel);
    if (key === 'ripple') { tl.add(() => effects.ripple.enter(el.offsetWidth * 0.3, el.offsetHeight * 0.5), t); return; }
    if (key === 'magnet') {
      // 假的游標從按鈕右上方靠近，按鈕被吸過去
      tl.add(() => { const r = el.getBoundingClientRect(); effects.magnet.enter({ clientX: r.right, clientY: r.top - 10 }); }, t);
      tl.add(() => effects.magnet.leave(), t + 0.7);
      return;
    }
    tl.add(() => effects[key].enter(at(sel, 0.02)), t);
    if (key === 'glow') tl.to(el, { '--x': () => at(sel, 0.9).clientX - el.getBoundingClientRect().left, duration: 0.8, ease: 'power2.inOut' }, t + 0.1);
    tl.add(() => effects[key].leave(at(sel, 0.98)), t + (key === 'squash' ? 0.2 : key === 'glow' ? 1 : 0.9));
  });
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
