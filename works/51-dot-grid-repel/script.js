// ── 試著改這幾個數字 ──
const GAP = 28;         // 點和點的距離（px）
const RADIUS = 110;     // 游標推開的範圍
const FORCE = 36;       // 最多推多遠
const STIFFNESS = 0.08; // 彈簧有多硬：越大回得越快
const DAMPING = 0.82;   // 每一格保留多少速度：越接近 1 晃越久
const WAVE_SPEED = 9;   // 震波每一格擴散幾 px

const field = document.querySelector('.field');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let dots = [];
let grid = '';
function build() {
  const w = field.clientWidth, h = field.clientHeight;
  const cols = Math.floor(w / GAP), rows = Math.floor(h / GAP);
  const ox = (w - (cols - 1) * GAP) / 2, oy = (h - (rows - 1) * GAP) / 2; // 置中
  // 欄數、列數都沒變（例如只寬了幾 px）：沿用原本的點，只重算位置，不重建幾百個元素
  if (grid !== `${cols}x${rows}`) {
    grid = `${cols}x${rows}`;
    field.innerHTML = '';
    dots = [];
    for (let i = 0; i < cols * rows; i++) {
      const el = document.createElement('span');
      el.className = 'dot';
      field.append(el);
      dots.push({ el, hot: false, rest: false, dx: 0, dy: 0, vx: 0, vy: 0, set: gsap.quickSetter(el, 'css') }); // quickSetter：每一格寫 transform 最快
    }
  }
  dots.forEach((d, i) => {
    d.hx = ox + (i % cols) * GAP; // 原本的位置（home）
    d.hy = oy + Math.floor(i / cols) * GAP;
    d.rest = false;
    d.set({ x: d.hx + d.dx, y: d.hy + d.dy });
  });
}

const pointer = { x: -9999, y: -9999, inside: false };
let wave = null; // { x, y, r }：震波中心和目前半徑

// 物理用固定步長（每步 = 60fps 的一格）：120Hz 螢幕一格約 8ms，0.5 步四捨五入會變 1，所以用累積的方式算
let acc = 0;
function tick(time, deltaTime) {
  acc += Math.min(deltaTime, 50) / (1000 / 60);
  const steps = Math.floor(acc);
  acc -= steps;
  if (!steps) return;
  let moving = false;
  dots.forEach(d => {
    // ① 目標偏移：在游標範圍內，往「遠離游標」的方向推，越近推越遠
    let tx = 0, ty = 0;
    if (pointer.inside) {
      const ax = d.hx - pointer.x, ay = d.hy - pointer.y;
      const dist = Math.hypot(ax, ay) || 1;
      if (dist < RADIUS) {
        const push = (1 - dist / RADIUS) ** 2 * FORCE; // 平方：邊緣幾乎不動，中心推最多
        tx = ax / dist * push;
        ty = ay / dist * push;
      }
    }
    // ② 震波經過這個點的那一格：給它一個往外的速度（之後交給彈簧晃回來）
    if (wave) {
      const ax = d.hx - wave.x, ay = d.hy - wave.y;
      const dist = Math.hypot(ax, ay) || 1;
      if (Math.abs(dist - wave.r) < WAVE_SPEED * steps / 2 + 0.5) {
        const kick = 7 * Math.max(0, 1 - wave.r / 420);
        d.vx += ax / dist * kick;
        d.vy += ay / dist * kick;
      }
    }
    // ③ 彈簧：往目標拉（速度 += 距離 × 硬度），再乘上阻尼慢慢停下來 → 會超過一點再晃回來
    for (let i = 0; i < steps; i++) {
      d.vx = (d.vx + (tx - d.dx) * STIFFNESS) * DAMPING;
      d.vy = (d.vy + (ty - d.dy) * STIFFNESS) * DAMPING;
      d.dx += d.vx;
      d.dy += d.vy;
    }

    const off = Math.hypot(d.dx, d.dy);
    if (off > 0.05 || Math.abs(d.vx) + Math.abs(d.vy) > 0.05) { moving = true; d.rest = false; }
    else {
      // 停在原位：上一格已經畫在原位就跳過，不再寫 DOM（幾百個點裡通常只有游標附近幾十個在動）
      if (d.rest) return;
      d.dx = d.dy = d.vx = d.vy = 0;
      d.rest = true;
    }
    // 推得越遠放越大；只有狀態改變時才切換 class（不要每一格都改 DOM）
    d.set({ x: d.hx + d.dx, y: d.hy + d.dy, scale: 1 + Math.min(off / FORCE, 1) * 1.2 });
    const hot = off > FORCE * 0.35;
    if (hot !== d.hot) { d.hot = hot; d.el.classList.toggle('is-hot', hot); }
  });

  if (wave) {
    wave.r += WAVE_SPEED * steps;
    if (wave.r > Math.hypot(field.clientWidth, field.clientHeight)) wave = null;
  }
  // 全部停下來、游標不在、也沒有震波：停掉計算
  if (!moving && !pointer.inside && !wave) stop();
}

let running = false;
function start() { if (!running && !reduce) { running = true; gsap.ticker.add(tick); } }
function stop() { running = false; gsap.ticker.remove(tick); }

function track(e) {
  const r = field.getBoundingClientRect();
  pointer.x = e.clientX - r.left;
  pointer.y = e.clientY - r.top;
}
field.addEventListener('pointermove', e => { track(e); pointer.inside = true; start(); });
field.addEventListener('pointerleave', () => { pointer.inside = false; });
// 點一下：從點的位置發出一圈震波
field.addEventListener('pointerdown', e => {
  track(e);
  wave = { x: pointer.x, y: pointer.y, r: 0 };
  start();
});
// 觸控：手指離開就當作游標離開（不然最後一個位置會一直推著點）
field.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') pointer.inside = false; });

// 寬度變了才重排（作品頁展開程式碼時只會改高度）
let lastWidth = field.clientWidth;
build(); // 先建一次（不等 ResizeObserver 的第一次通知）
// 拖動視窗時每一格都會通知：等寬度停下 120ms 再重建一次（debounce）
let resizeTimer;
new ResizeObserver(() => {
  if (field.clientWidth === lastWidth) return;
  lastWidth = field.clientWidth;
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(build, 120);
}).observe(field);

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (reduce) return;
  const path = { t: 0 };
  gsap.timeline({ delay: 0.6 })
    // 假游標橫著劃過點陣
    .to(path, {
      t: 1, duration: 1.8, ease: 'power1.inOut',
      onStart: () => { pointer.inside = true; start(); },
      onUpdate: () => {
        pointer.x = field.clientWidth * (0.1 + 0.8 * path.t);
        pointer.y = field.clientHeight * (0.5 + 0.25 * Math.sin(path.t * Math.PI * 2));
      },
      onComplete: () => { pointer.inside = false; }
    })
    // 再在中間點一下，發出震波
    .add(() => { wave = { x: field.clientWidth / 2, y: field.clientHeight / 2, r: 0 }; start(); }, '+=0.3');
});
// 自己動手（按滑鼠或鍵盤，或游標進到點陣裡）就停掉示範，免得和你的操作互搶
const stopDemo = () => { demo.kill(); pointer.inside = false; };
['pointerdown', 'keydown'].forEach(type => addEventListener(type, stopDemo, { once: true, capture: true }));
field.addEventListener('pointerenter', stopDemo, { once: true });
// #endregion demo
