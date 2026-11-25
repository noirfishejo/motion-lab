gsap.registerPlugin(Draggable);

// ── 試著改這幾個數字 ──
const START = 0.5;  // 一開始分隔線在哪（0 = 最左、1 = 最右）
const STEP = 0.05;  // 方向鍵一次移動多少

const compare = document.querySelector('.compare');
const clip = compare.querySelector('.after-clip');
const inner = clip.querySelector('.shot');
const handle = compare.querySelector('.handle');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let ratio = START;
let width = compare.clientWidth;

// 把比例畫到畫面上：外層往右推、內層往左推一樣多 → After 的內容不動，只有左邊被裁掉
// 三個元素都只改 transform，不改寬度或 clip-path：拖曳時不用重排版面、也不用重畫裁切範圍
const pos = { r: ratio };
function render() {
  const px = pos.r * width;
  gsap.set(clip, { x: px });
  gsap.set(inner, { x: -px });
  gsap.set(handle, { x: px });
  const pct = Math.round(pos.r * 100);
  handle.setAttribute('aria-valuenow', pct);
  handle.setAttribute('aria-valuetext', `${pct}% before, ${100 - pct}% after`);
}

// 動畫移到某個比例（點畫面、按方向鍵時用）
function slideTo(r, duration = 0.6) {
  ratio = gsap.utils.clamp(0, 1, r);
  gsap.to(pos, { r: ratio, duration: reduce ? 0 : duration, ease: 'expo.out', overwrite: true, onUpdate: render });
}

// 拖曳：拖的是把手本身（type: x，範圍限制在畫面裡），每一格換算成比例
const drag = Draggable.create(handle, {
  type: 'x',
  bounds: { minX: 0, maxX: width },
  trigger: compare,      // 按在畫面任何地方都能直接開始拖
  cursor: 'col-resize',
  onPress(e) {
    gsap.killTweensOf(pos);
    // 按下的那一刻：分隔線先滑到手指的位置（不是瞬間跳過去）
    const r = (e.clientX - compare.getBoundingClientRect().left) / width;
    slideTo(r, 0.35);
  },
  // 開始拖了：停掉「滑到手指位置」的補間，讓 Draggable 從分隔線現在的位置接著算（不然兩邊會互搶）
  onDragStart() { gsap.killTweensOf(pos); this.update(); },
  onDrag() { ratio = pos.r = this.x / width; render(); },
  onRelease() { handle.focus({ preventScroll: true }); }
})[0];

// 鍵盤：左右鍵移動、Home／End 到兩端
handle.addEventListener('keydown', e => {
  const map = { ArrowLeft: ratio - STEP, ArrowDown: ratio - STEP, ArrowRight: ratio + STEP, ArrowUp: ratio + STEP, Home: 0, End: 1 };
  if (!(e.key in map)) return;
  e.preventDefault();
  slideTo(map[e.key], 0.4);
});

// 寬度變了：重新換算 px（比例不變），並更新拖曳範圍
new ResizeObserver(() => {
  if (compare.clientWidth === width) return;
  width = compare.clientWidth;
  drag.applyBounds({ minX: 0, maxX: width });
  render();
}).observe(compare);
render();

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (reduce) return;
  gsap.timeline({ delay: 0.7, defaults: { ease: 'power2.inOut', onUpdate: render } })
    .to(pos, { r: 0.18, duration: 0.9 })
    .to(pos, { r: 0.82, duration: 1.2 }, '+=0.2')
    .to(pos, { r: START, duration: 0.8 }, '+=0.2');
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => { demo.kill(); ratio = pos.r; }, { once: true, capture: true }));
// #endregion demo
