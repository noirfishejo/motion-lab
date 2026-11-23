gsap.registerPlugin(Draggable, InertiaPlugin);

// ── 試著改這幾個數字 ──
const RESISTANCE = 0.85; // 拉到第一張或最後一張之外時的阻力（0～1，越大越拉不動）

const viewport = document.querySelector('.viewport');
const track = document.querySelector('.track');
const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 每一張對齊左邊時，track 要移到的 x；最後幾張不能移超過盡頭（不然右邊會空一塊）
let stops = [];
function measure() {
  const end = -(track.scrollWidth - viewport.clientWidth);
  stops = slides.map(s => Math.max(-s.offsetLeft, end));
}
measure();

// 目前最接近的是第幾張（用 x 反推）
// 拉到盡頭時算最後一張（最後幾張可能共用同一個位置，不然最後一個圓點永遠亮不起來）
const nearest = x => {
  const last = stops.length - 1;
  if (Math.abs(x - stops[last]) < 2) return last;
  return stops.reduce((best, s, i) => Math.abs(s - x) < Math.abs(stops[best] - x) ? i : best, 0);
};

let index = 0;
function setActive(i) {
  index = i;
  dots.forEach((d, k) => d.setAttribute('aria-current', k === i));
  prev.disabled = i === 0;
  next.disabled = i === stops.length - 1;
}

const drag = Draggable.create(track, {
  type: 'x',
  inertia: !reduce,          // 放開後依照速度繼續滑（InertiaPlugin）
  bounds: { minX: stops[stops.length - 1], maxX: 0 },
  edgeResistance: RESISTANCE,
  // 慣性停下的位置會被吸到最近的一張：甩得快可以一次跳過好幾張
  snap: x => gsap.utils.snap(stops, x),
  onDrag: () => setActive(nearest(drag.x)),
  onThrowUpdate: () => setActive(nearest(drag.x)),
  onDragEnd() { if (reduce) goTo(nearest(this.x)); }
})[0];

function goTo(i) {
  i = gsap.utils.clamp(0, slides.length - 1, i);
  // 已經捲到盡頭時，往後一張就直接跳到最後一張（中間幾張的位置都是盡頭）
  if (i > index && stops[i] === stops[stops.length - 1]) i = stops.length - 1;
  setActive(i);
  gsap.to(track, {
    x: stops[i], duration: reduce ? 0 : 0.8, ease: 'expo.out', overwrite: true,
    onUpdate: () => drag.update() // 讓 Draggable 知道 track 被程式移動了（下次拖曳才從正確位置開始）
  });
}

prev.addEventListener('click', () => goTo(index - 1));
next.addEventListener('click', () => goTo(index + 1));
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
viewport.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { e.preventDefault(); goTo(index + 1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(index - 1); }
});

// 視窗大小改變：重新量位置、更新拖曳範圍，停在同一張
window.addEventListener('resize', () => {
  measure();
  drag.applyBounds({ minX: stops[stops.length - 1], maxX: 0 });
  gsap.set(track, { x: stops[index] });
  drag.update();
});

setActive(0);

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
if (!reduce) gsap.delayedCall(0.8, () => goTo(1));
// #endregion demo
