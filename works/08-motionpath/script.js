gsap.registerPlugin(MotionPathPlugin);

// ── 試著改這幾個數字 ──
const DURATION = 2;    // 飛行時間（秒）
const ARC = 60;        // 弧線往上拱多高（px）；改成 0 就是直線
const CURVINESS = 2.3; // 路徑的彎曲程度：0 是折線，1～2 越來越圓滑

const stage = document.getElementById('stage');
const path = document.getElementById('flightPath');
const item = document.querySelector('.item');
const cart = document.querySelector('.cart');
const badge = document.querySelector('.badge');
const flyerTemplate = document.querySelector('.flyer');
let count = 0;

// 取得元素中心點（以舞台左上角為原點）
function center(el) {
  const s = stage.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
}

// ── 畫路徑：起點（商品）→ 拱起的中間點 → 終點（購物車） ──
function drawPath() {
  const a = center(item);
  const b = center(cart);
  // 中間點：起點和終點連線的中點，再往「垂直於連線、偏上方」的方向推 ARC px
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
  let nx = dy / len, ny = -dx / len;           // 垂直方向
  if (ny > 0) { nx = -nx; ny = -ny; }          // 確保往上拱
  const mid = { x: (a.x + b.x) / 2 + nx * ARC, y: Math.max(16, (a.y + b.y) / 2 + ny * ARC) };
  // 把三個點連成一條平滑曲線，轉成 SVG 的 d 屬性
  const raw = MotionPathPlugin.arrayToRawPath([a, mid, b], { curviness: CURVINESS });
  path.setAttribute('d', MotionPathPlugin.rawPathToString(raw));
}
drawPath();
window.addEventListener('resize', drawPath);

// ── 加入購物車：複製一個方塊，沿著路徑飛到購物車 ──
function addToCart() {
  const flyer = flyerTemplate.cloneNode();
  stage.appendChild(flyer);

  gsap.timeline({ onComplete: () => flyer.remove() })
    .set(flyer, { visibility: 'visible' })
    .to(flyer, {
      duration: DURATION,
      ease: 'power1.inOut',
      motionPath: {
        path: path,              // 沿著這條 SVG 路徑飛
        align: path,             // 把方塊對齊到路徑的座標上
        alignOrigin: [0.5, 0.5]  // 用方塊的中心點貼著路徑走
      },
      scale: 0.3,                // 一邊飛一邊縮小
      rotation: 180
    })
    // 抵達後：數字加一、購物車彈一下
    .add(() => { badge.textContent = ++count; })
    .fromTo(cart, { scale: 1.25 }, { scale: 1, duration: 0.6, ease: 'expo.out' }, '<');
}

document.querySelector('.add').addEventListener('click', addToCart);

// 自動示範一次（首頁縮圖也看得到動態）
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.delayedCall(0.8, addToCart);
}
