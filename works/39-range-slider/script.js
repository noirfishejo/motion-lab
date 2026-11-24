gsap.registerPlugin(Draggable);

// ── 試著改這幾個數字 ──
const MIN = 0, MAX = 500, STEP = 5;   // 數值範圍和每一格
const TILT = 0.06;                    // 拖曳速度換算成泡泡傾斜的比例（0 = 不傾斜）
const MAX_TILT = 18;                  // 最多傾斜幾度

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const slider = document.querySelector('.slider');
const thumb = slider.querySelector('.thumb');
const fill = slider.querySelector('.fill');
const bubble = thumb.querySelector('.bubble-text');
let value = parseFloat(thumb.getAttribute('aria-valuenow'));

const width = () => slider.clientWidth;
const toX = v => ((v - MIN) / (MAX - MIN)) * width();
const toValue = x => gsap.utils.snap(STEP, gsap.utils.clamp(MIN, MAX, MIN + (x / width()) * (MAX - MIN)));

// 泡泡傾斜：quickTo 讓角度平順地追上目標，停下來時自然回正
const tilt = gsap.quickTo(bubble, 'rotation', { duration: 0.4, ease: 'power3.out' });

function render(x) {
  value = toValue(x);
  gsap.set(fill, { scaleX: x / width() });
  bubble.textContent = `$${value}`;
  thumb.setAttribute('aria-valuenow', value);
  thumb.setAttribute('aria-valuetext', `$${value}`);
}

// 設定到某個數值（鍵盤、點軌道時用）：方塊用動畫滑過去
function setValue(v, animate = true) {
  const x = toX(gsap.utils.clamp(MIN, MAX, v));
  gsap.to(thumb, { x, duration: animate && !reduce ? 0.4 : 0, ease: 'expo.out', onUpdate: () => render(gsap.getProperty(thumb, 'x')), overwrite: true });
  render(x);
}

const [drag] = Draggable.create(thumb, {
  type: 'x',
  bounds: slider,
  onPress() { if (!reduce) gsap.to(bubble, { scale: 1.15, duration: 0.2, ease: 'power2.out' }); },  // 拿起來：泡泡放大
  onDrag() {
    render(this.x);
    // 拖得越快傾斜越多，方向和拖的方向相反（像被甩在後面）
    if (!reduce) tilt(gsap.utils.clamp(-MAX_TILT, MAX_TILT, -this.deltaX * TILT * 10));
  },
  onRelease() {
    tilt(0);
    if (!reduce) gsap.to(bubble, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
    setValue(value, false); // 放開時對齊到最近的一格
  }
});

// 點軌道：方塊滑到點的位置
slider.addEventListener('pointerdown', e => {
  if (e.target.closest('.thumb')) return;
  const r = slider.getBoundingClientRect();
  setValue(toValue(e.clientX - r.left));
});

// 鍵盤：左右 ±1 格、Shift ±10 格、Home／End 到頭尾
thumb.addEventListener('keydown', e => {
  const big = e.shiftKey ? 10 : 1;
  const next = { ArrowRight: value + STEP * big, ArrowUp: value + STEP * big, ArrowLeft: value - STEP * big, ArrowDown: value - STEP * big, Home: MIN, End: MAX }[e.key];
  if (next === undefined) return;
  e.preventDefault();
  setValue(next);
});

setValue(value, false);
// 只有「寬度」變了才重算：放在作品頁預覽裡展開程式碼時，iframe 只改高度、每一格都會觸發 resize
let lastW = innerWidth;
window.addEventListener('resize', () => {
  if (innerWidth === lastW) return;
  lastW = innerWidth;
  setValue(value, false);
  drag.applyBounds(slider);
});

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
// ── 自動示範一次（首頁縮圖也看得到動態） ──
if (!reduce) { gsap.delayedCall(0.9, () => setValue(380)); gsap.delayedCall(1.8, () => setValue(260)); }
// #endregion demo
