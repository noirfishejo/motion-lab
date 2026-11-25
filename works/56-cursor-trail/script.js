// ── 試著改這幾個數字 ──
const COUNT = 12;     // 尾巴有幾節
const SIZE = 18;      // 第一節的大小（px），後面越來越小
const LAG = 0.05;     // 每往後一節，多慢幾秒跟上：越大尾巴越長
const IDLE = 1.2;     // 游標停下幾秒後，尾巴淡出

const area = document.getElementById('area');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 產生方塊：越後面越小、越淡
const dots = Array.from({ length: COUNT }, (_, i) => {
  const el = document.createElement('span');
  el.className = 'dot';
  const s = SIZE * (1 - i / COUNT * 0.7);
  gsap.set(el, { width: s, height: s, xPercent: -50, yPercent: -50, autoAlpha: 0 });
  area.append(el);
  // 每一節各自一組 quickTo，跟上的秒數不同：第一節幾乎黏著游標，最後一節最慢 → 自然甩出一條尾巴
  return {
    el,
    x: gsap.quickTo(el, 'x', { duration: reduce ? 0 : 0.08 + i * LAG, ease: 'power3' }),
    y: gsap.quickTo(el, 'y', { duration: reduce ? 0 : 0.08 + i * LAG, ease: 'power3' }),
    alpha: 1 - i / COUNT * 0.75
  };
});

let visible = false;
let idleCall;
function show() {
  if (!visible) {
    visible = true;
    dots.forEach(d => gsap.to(d.el, { autoAlpha: d.alpha, duration: 0.3, overwrite: 'auto' }));
  }
  // 停下 IDLE 秒就淡出（每次移動都重新計時）
  idleCall?.kill();
  idleCall = gsap.delayedCall(IDLE, hide);
}
function hide() {
  visible = false;
  gsap.to(dots.map(d => d.el), { autoAlpha: 0, duration: 0.5, stagger: { each: 0.03, from: 'end' }, overwrite: 'auto' });
}

function moveTo(x, y) {
  dots.forEach(d => { d.x(x); d.y(y); });
  show();
}
function local(e) {
  const r = area.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top];
}
area.addEventListener('pointerenter', e => {
  // 進來的那一刻全部直接放在游標上，不要從上次離開的地方飛過來
  const [x, y] = local(e);
  dots.forEach(d => gsap.set(d.el, { x, y }));
  moveTo(x, y);
});
area.addEventListener('pointermove', e => moveTo(...local(e)));
area.addEventListener('pointerleave', () => { idleCall?.kill(); hide(); });

// 按住：每一節跟上的速度變 3 倍（尾巴收緊），放開恢復；方塊同時轉 45°
// quickTo 回傳的函式身上有 .tween：直接改它的 timeScale，不用重建補間
function tighten(on) {
  dots.forEach(d => { d.x.tween.timeScale(on ? 3 : 1); d.y.tween.timeScale(on ? 3 : 1); });
  gsap.to(dots.map(d => d.el), { rotation: on ? 45 : 0, duration: reduce ? 0 : 0.4, ease: 'back.out(2)', stagger: 0.02 });
}
area.addEventListener('pointerdown', e => { area.setPointerCapture(e.pointerId); tighten(true); });
area.addEventListener('pointerup', () => tighten(false));

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (reduce) return;
  // 假游標畫一個 ∞ 字
  const p = { t: 0 };
  gsap.to(p, {
    t: Math.PI * 2, duration: 2.8, delay: 0.6, ease: 'none',
    onStart: () => { const w = area.clientWidth / 2, h = area.clientHeight / 2; dots.forEach(d => gsap.set(d.el, { x: w, y: h })); },
    onUpdate: () => {
      const w = area.clientWidth, h = area.clientHeight;
      moveTo(w / 2 + Math.sin(p.t) * w * 0.32, h / 2 + Math.sin(p.t * 2) * h * 0.25);
    }
  });
});
// 自己動手（按滑鼠或鍵盤，或游標進到範圍裡）就停掉示範，免得和你的操作互搶
const stopDemo = () => demo.kill();
['pointerdown', 'keydown'].forEach(type => addEventListener(type, stopDemo, { once: true, capture: true }));
area.addEventListener('pointerenter', stopDemo, { once: true, capture: true });
// #endregion demo
