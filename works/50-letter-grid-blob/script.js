// ── 試著改這幾個數字 ──
const RADIUS = 120;   // 游標影響範圍（px）：越大，一次變方塊的字母越多
const DECAY = 0.94;   // 離開後每一格剩下多少（0.9 很快消失，0.98 拖出很長的軌跡）
const STRETCH = 0.012; // 游標移動越快，方塊沿著移動方向拉得越長
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const grid = document.querySelector('.grid');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 產生格子：字母不夠就從頭重複，讓格子剛好排滿 4 列
let cells = [];
function build() {
  const cols = Math.max(4, Math.floor(grid.clientWidth / 56));
  const count = cols * 4;
  grid.innerHTML = Array.from({ length: count }, (_, i) =>
    `<span class="cell"><span class="block"></span><span class="glyph">${LETTERS[i % LETTERS.length]}</span></span>`).join('');
  cells = [...grid.querySelectorAll('.cell')].map(el => ({
    block: el.querySelector('.block'),
    glyph: el.querySelector('.glyph'),
    // quickSetter：每一格都要改很多次，先建好「直接寫值」的函式，比 gsap.set 快
    setBlock: gsap.quickSetter(el.querySelector('.block'), 'css'),
    setGlyph: gsap.quickSetter(el.querySelector('.glyph'), 'css'),
    heat: 0,   // 0 = 字母，1 = 完整的方塊
    stretch: 1, rot: 0, // 被游標碰到那一刻的拉長和方向（留在軌跡上的方塊維持這個形狀縮回去）
    x: 0, y: 0
  }));
  measure();
}
// 記下每一格中心點（相對於格子區塊左上角）：之後每一格只算距離，不再讀版面
function measure() {
  cells.forEach(c => {
    const el = c.block.parentElement;
    c.x = el.offsetLeft + el.offsetWidth / 2;
    c.y = el.offsetTop + el.offsetHeight / 2;
  });
}

// 游標位置和速度（相對於格子區塊）
const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, inside: false };
let last = null;

function tick(time, deltaTime) {
  const k = Math.max(0.1, Math.min(deltaTime, 50) / (1000 / 60)); // 這一格是 60fps 的幾格（120Hz 螢幕約 0.5）：軌跡長度在不同螢幕上一樣
  // 速度：這一格和上一格的位置差，再平滑一下（不然方塊會抖）
  if (last) {
    pointer.vx += ((pointer.x - last.x) / k - pointer.vx) * 0.3; // ÷ k：換算成「每個 60fps 格」的速度
    pointer.vy += ((pointer.y - last.y) / k - pointer.vy) * 0.3;
  }
  last = { x: pointer.x, y: pointer.y };
  const speed = Math.hypot(pointer.vx, pointer.vy);
  const angle = Math.atan2(pointer.vy, pointer.vx) * 180 / Math.PI;
  let alive = false;

  cells.forEach(c => {
    const d = Math.hypot(c.x - pointer.x, c.y - pointer.y);
    const target = pointer.inside ? Math.max(0, 1 - d / RADIUS) : 0;
    // 靠近：馬上變大（追上 target 的 40%）；離開：每一格乘上 DECAY 慢慢縮，留下軌跡
    c.heat = target > c.heat ? c.heat + (target - c.heat) * (1 - 0.6 ** k) : c.heat * DECAY ** k;
    if (c.heat < 0.002) c.heat = 0;
    if (c.heat > 0) alive = true;
    // 方塊沿著游標移動方向拉長、另一個方向變窄（體積差不多不變，看起來像被拖著走）
    // 只有正在被游標碰到的格子更新形狀；軌跡上的方塊維持原本的方向慢慢縮回去
    if (target > 0.05) {
      c.stretch = 1 + Math.min(speed * STRETCH, 0.8);
      if (speed > 0.5) c.rot = angle;
    }
    if (c.heat === 0 && c.stretch !== 1) { c.stretch = 1; c.rot = 0; }
    c.setBlock({ scaleX: c.heat * c.stretch, scaleY: c.heat / c.stretch, rotation: c.rot });
    c.setGlyph({ opacity: 1 - Math.min(c.heat * 3, 1) }); // 字母比方塊早消失：小方塊上不會壓著半透明的字
  });

  // 全部縮回去、游標也不在裡面：停掉每一格的計算（不在背景空轉）
  if (!alive && !pointer.inside) stop();
}

let running = false;
function start() { if (!running && !reduce) { running = true; last = null; gsap.ticker.add(tick); } }
function stop() { running = false; gsap.ticker.remove(tick); }

function track(e) {
  const r = grid.getBoundingClientRect();
  pointer.x = e.clientX - r.left;
  pointer.y = e.clientY - r.top;
  pointer.inside = true;
  start();
}
grid.addEventListener('pointermove', track);
grid.addEventListener('pointerdown', track);
grid.addEventListener('pointerleave', () => { pointer.inside = false; });

// 寬度變了才重排（作品頁展開程式碼時只會改高度）
let lastWidth = grid.clientWidth;
build(); // 先建一次（不等 ResizeObserver 的第一次通知）
new ResizeObserver(() => {
  if (grid.clientWidth === lastWidth) return;
  lastWidth = grid.clientWidth;
  build();
}).observe(grid);

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (reduce) return;
  // 假的游標：沿著一條 S 形走過格子
  const path = { t: 0 };
  gsap.to(path, {
    t: 1, duration: 2.6, delay: 0.6, ease: 'power1.inOut',
    onStart: () => { pointer.inside = true; start(); },
    onUpdate: () => {
      pointer.x = path.t * grid.clientWidth;
      pointer.y = grid.clientHeight * (0.5 + 0.38 * Math.sin(path.t * Math.PI * 2.5));
    },
    onComplete: () => { pointer.inside = false; }
  });
});
// 自己動手（按滑鼠或鍵盤，或游標進到格子裡）就停掉示範，免得和你的操作互搶
const stopDemo = () => { demo.kill(); pointer.inside = false; }; // 假游標停在半路的話，方塊也要縮回去
['pointerdown', 'keydown'].forEach(type => addEventListener(type, stopDemo, { once: true, capture: true }));
grid.addEventListener('pointerenter', stopDemo, { once: true });
// #endregion demo
