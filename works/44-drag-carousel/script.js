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
  // offsetLeft 是相對外層容器量的（會包含頁面留白），所以要減掉第一張的位置，第一張才會剛好貼齊左邊
  const first = slides[0].offsetLeft;
  stops = slides.map(s => Math.max(-(s.offsetLeft - first), end));
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
let targetX = null; // 按箭頭後 track 正要去的位置（動畫還沒跑完時，連按要從「目的地」算下一張）
function setActive(i, x = stops[i]) {
  index = i;
  dots.forEach((d, k) => d.setAttribute('aria-current', k === i));
  // 箭頭看「實際位置」決定能不能按：已經在最左邊／最右邊才停用
  prev.disabled = x >= stops[0] - 1;
  next.disabled = x <= stops[stops.length - 1] + 1;
}

const drag = Draggable.create(track, {
  type: 'x',
  inertia: !reduce,          // 放開後依照速度繼續滑（InertiaPlugin）
  bounds: { minX: stops[stops.length - 1], maxX: 0 },
  edgeResistance: RESISTANCE,
  // 慣性停下的位置會被吸到最近的一張：甩得快可以一次跳過好幾張
  snap: x => gsap.utils.snap(stops, x),
  onPress: () => { targetX = null; },
  onDrag: () => setActive(nearest(drag.x), drag.x),
  onThrowUpdate: () => setActive(nearest(drag.x), drag.x),
  onThrowComplete: () => setActive(nearest(drag.x), drag.x),
  onDragEnd() { if (reduce) goTo(nearest(this.x)); }
})[0];

function goTo(i) {
  i = gsap.utils.clamp(0, slides.length - 1, i);
  setActive(i);
  targetX = stops[i];
  gsap.to(track, {
    x: stops[i], duration: reduce ? 0 : 0.8, ease: 'expo.out', overwrite: true,
    onUpdate: () => drag.update() // 讓 Draggable 知道 track 被程式移動了（下次拖曳才從正確位置開始）
  });
}

// 箭頭依「現在的位置」找下一個真的會移動的位置
// 最後幾張可能共用同一個位置（都是盡頭），只用 index ± 1 的話，在盡頭按上一張會停在原地、看起來沒反應
function step(dir) {
  // 正在滑動時，用滑動的終點來算（甩出去的慣性用 drag.endX，按箭頭的用 targetX）
  const x = drag.isThrowing ? drag.endX : targetX ?? gsap.getProperty(track, 'x');
  const i = dir > 0
    ? stops.findIndex(s => s < x - 1)                        // 往右：第一個在目前位置右邊的
    : stops.findLastIndex(s => s > x + 1);                   // 往左：最後一個在目前位置左邊的
  if (i === -1) return;
  goTo(dir > 0 && stops[i] === stops[stops.length - 1] ? stops.length - 1 : i);
}
prev.addEventListener('click', () => step(-1));
next.addEventListener('click', () => step(1));
dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
viewport.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
  if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1); }
});

// 視窗大小改變：重新量位置、更新拖曳範圍，停在同一張
window.addEventListener('resize', () => {
  measure();
  drag.applyBounds({ minX: stops[stops.length - 1], maxX: 0 });
  targetX = stops[index];
  gsap.set(track, { x: targetX });
  drag.update();
});

setActive(0);

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
if (!reduce) {
  const demo = gsap.delayedCall(0.8, () => goTo(1));
  // 自己動手了就不播示範，免得被它拉走
  ['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
}
// #endregion demo
