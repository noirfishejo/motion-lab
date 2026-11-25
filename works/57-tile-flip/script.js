// ── 試著改這幾個數字 ──
const COLS = 10;        // 一列幾塊（窄螢幕自動減少）
const ROWS = 5;
const HOLD = 1.1;       // 翻過去後停幾秒再翻回來
const WORD = 'MOTION';  // 背面依序藏著的字（從頭重複）

const wall = document.getElementById('wall');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let tiles = [];
function build() {
  const cols = wall.clientWidth < 480 ? 6 : COLS;
  wall.style.setProperty('--cols', cols);
  wall.innerHTML = Array.from({ length: cols * ROWS }, (_, i) =>
    `<div class="tile"><span class="face front"></span><span class="face back">${WORD[i % WORD.length]}</span></div>`).join('');
  tiles = [...wall.children].map(el => ({ el, flipped: false, back: null }));
}

// 翻過去：rotationY 0 → 180；同一塊在翻回來之前又被碰到，只重新計時、不重播
function flip(t) {
  t.back?.kill();
  if (!t.flipped) {
    t.flipped = true;
    gsap.to(t.el, { rotationY: 180, duration: reduce ? 0 : 0.6, ease: 'expo.out', overwrite: true });
  }
  t.back = gsap.delayedCall(HOLD, () => {
    t.flipped = false;
    gsap.to(t.el, { rotationY: 0, duration: reduce ? 0 : 0.8, ease: 'power3.inOut', overwrite: true });
  });
}

// 用一個 pointermove 監聽整面牆，找出游標底下是哪一塊（不必替每塊磚各綁事件；觸控拖過去也能用）
let last = null;
wall.addEventListener('pointermove', e => {
  const el = document.elementFromPoint(e.clientX, e.clientY)?.closest('.tile');
  if (!el || el === last) return;
  last = el;
  flip(tiles[[...wall.children].indexOf(el)]);
});
wall.addEventListener('pointerleave', () => { last = null; });

// 寬度變了才重建（作品頁展開程式碼時只會改高度）
let lastWidth = wall.clientWidth;
build();
// 拖動視窗時每一格都會通知：等寬度停下 120ms 再重建一次（debounce）
let resizeTimer;
new ResizeObserver(() => {
  if (wall.clientWidth === lastWidth) return;
  lastWidth = wall.clientWidth;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(build, 120);
}).observe(wall);

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (reduce) return;
  // 從左上角斜著一波一波翻過去：延遲 = (列 + 欄) × 0.06 秒，同一條斜線上的磚塊一起翻
  const cols = Number(wall.style.getPropertyValue('--cols'));
  tiles.forEach((t, i) => {
    const r = Math.floor(i / cols), c = i % cols;
    gsap.delayedCall(0.6 + (r + c) * 0.06, () => flip(t));
  });
});
// 自己動手（按滑鼠或鍵盤，或游標進到牆上）就停掉示範，免得和你的操作互搶
const stopDemo = () => demo.kill();
['pointerdown', 'keydown'].forEach(type => addEventListener(type, stopDemo, { once: true, capture: true }));
wall.addEventListener('pointerenter', stopDemo, { once: true, capture: true });
// #endregion demo
