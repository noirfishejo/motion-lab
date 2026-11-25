// ── 試著改這幾個數字 ──
const GRAB = 6;        // 游標離線幾 px 以內就會「勾住」線
const MAX_PULL = 44;   // 勾住後最多拉多遠，超過就鬆開彈回去
const SETTLE = 1.6;    // 鬆開後晃動多久（秒）
const WOBBLE = 0.18;   // elastic 的週期：越小晃得越快、次數越多

const menu = document.querySelector('.menu');
const svg = menu.querySelector('.lines');
const rows = [...menu.querySelectorAll('li')];
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAD = 48; // SVG 比列表上下多出來的高度（見 style.css）

// 每條線：y 位置、彎多少（bend）、彎在哪裡（cx）、是否被勾住
let lines = [];
function build() {
  const w = menu.clientWidth;
  svg.setAttribute('viewBox', `0 0 ${w} ${menu.clientHeight + PAD * 2}`);
  // 第一列上面一條，每一列下面各一條
  const ys = [0, ...rows.map(li => li.offsetTop + li.offsetHeight)];
  svg.innerHTML = ys.map(() => '<path></path>').join('');
  lines = ys.map((y, i) => ({ el: svg.children[i], y: y + PAD, w, bend: 0, cx: w / 2, grabbed: false, prevDy: null }));
  lines.forEach(draw);
}

// 二次貝茲曲線：控制點放在 bend 的兩倍，曲線最彎的地方剛好偏移 bend
function draw(line) {
  line.el.setAttribute('d', `M0 ${line.y} Q${line.cx} ${line.y + line.bend * 2} ${line.w} ${line.y}`);
}

// 鬆開：用 elastic 晃回直線（像撥了一下弦）
function release(line, from = line.bend) {
  line.grabbed = false;
  line.el.classList.remove('is-active');
  line.bend = from;
  gsap.to(line, {
    bend: 0, duration: reduce ? 0 : SETTLE, ease: `elastic.out(1.1, ${WOBBLE})`, overwrite: true,
    onUpdate: () => draw(line)
  });
}

function move(px, py) {
  lines.forEach(line => {
    const dy = py - line.y;
    if (line.grabbed) {
      // 勾住中：線的彎曲點跟著游標走
      if (Math.abs(dy) > MAX_PULL || px < 0 || px > line.w) { release(line); }
      else { line.bend = dy; line.cx = px; draw(line); }
    } else if (Math.abs(dy) < GRAB && px > 0 && px < line.w) {
      // 碰到線：勾住
      gsap.killTweensOf(line);
      line.grabbed = true;
      line.cx = px;
      line.el.classList.add('is-active');
    } else if (line.prevDy !== null && Math.sign(dy) !== Math.sign(line.prevDy) && px > 0 && px < line.w) {
      // 游標移動太快，兩次事件之間直接跨過線（沒碰到 GRAB 範圍）：當作撥了一下，往游標來的方向彈
      line.cx = px;
      release(line, gsap.utils.clamp(-MAX_PULL, MAX_PULL, -line.prevDy * 0.6));
    }
    line.prevDy = dy;
  });
}

function leave() {
  lines.forEach(line => { line.prevDy = null; if (line.grabbed) release(line); });
}

const local = e => {
  const r = svg.getBoundingClientRect();
  return [e.clientX - r.left, e.clientY - r.top];
};
// 監聽整個預覽區（不只列表）：游標從列表上下方進來時，第一條和最後一條線也撥得到
document.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') move(...local(e)); });
document.documentElement.addEventListener('pointerleave', leave);

// 滑過的那一列：箭頭淡入、文字往右推一點（只動 transform 和透明度）
rows.forEach((li, i) => {
  const a = li.querySelector('a');
  const icon = a.querySelector('i');
  const tl = gsap.timeline({ paused: true, defaults: { duration: reduce ? 0 : 0.5, ease: 'expo.out' } })
    .to(a, { x: 12 })
    .fromTo(icon, { opacity: 0, x: -8 }, { opacity: 1, x: 0 }, 0);
  const on = state => { a.classList.toggle('is-on', state); state ? tl.play() : tl.reverse(); }; // 顏色交給 CSS 過渡（GSAP 讀不懂 var(--…) 色彩）
  a.addEventListener('pointerenter', () => on(true));
  a.addEventListener('pointerleave', () => on(false));
  // 鍵盤 Tab 到這一列：一樣亮起來，並輕輕撥一下它下面那條線
  a.addEventListener('focus', () => { on(true); if (a.matches(':focus-visible')) release(lines[i + 1], 14); });
  a.addEventListener('blur', () => on(false));
  a.addEventListener('click', e => e.preventDefault()); // 練習用的假連結
});

// 列表的寬或高變了才重畫（字體載入後列高會變；作品頁展開程式碼時 iframe 變高，但列表本身的尺寸不變，不會重畫）
const size = () => `${menu.clientWidth}x${menu.clientHeight}`;
let lastSize = size();
build(); // 先建一次（不等 ResizeObserver 的第一次通知）
// 拖動視窗時每一格都會通知：等尺寸停下 120ms 再重畫一次（debounce）
let resizeTimer;
new ResizeObserver(() => {
  if (size() === lastSize) return;
  lastSize = size();
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(build, 120);
}).observe(menu);
document.fonts.ready.then(() => { lastSize = size(); build(); });

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (reduce) return;
  // 假游標：從上往下慢慢掃過每一條線（每條線會被勾住、拉一下、再彈開）
  const p = { y: PAD / 2 }; // SVG 座標（第一條線在 y = PAD）
  gsap.to(p, {
    y: () => menu.clientHeight + PAD * 1.5, duration: 2.6, delay: 0.6, ease: 'none',
    onUpdate: () => move(menu.clientWidth * 0.62, p.y),
    onComplete: leave
  });
});
// 自己動手（按滑鼠或鍵盤，或游標進到預覽裡）就停掉示範，免得和你的操作互搶
const stopDemo = () => { demo.kill(); leave(); };
['pointerdown', 'keydown'].forEach(type => addEventListener(type, stopDemo, { once: true, capture: true }));
document.documentElement.addEventListener('pointerenter', stopDemo, { once: true });
// #endregion demo
