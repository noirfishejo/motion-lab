// ── 試著改這幾個數字 ──
const STRENGTH = 0.4;      // 磁吸力道：按鈕跟著滑鼠移動的比例（0 不動，1 完全貼著滑鼠）
const LABEL_EXTRA = 0.5;   // 文字比按鈕再多移動多少（做出前後層次）
const RIPPLE_DURATION = 0.7; // 波紋擴散要幾秒

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ═══ 1. 磁吸按鈕 ═══
const zone = document.querySelector('.magnet-zone');
const magnet = document.querySelector('.btn-magnetic');
const label = magnet.querySelector('.btn-label');

// quickTo：先建立好一個「只改 x（或 y）」的補間，之後每次滑鼠移動只要丟新的數值進去。
// 比每次都呼叫 gsap.to() 省效能，很適合跟著滑鼠的動態。
const moveX = gsap.quickTo(magnet, 'x', { duration: 0.6, ease: 'expo.out' });
const moveY = gsap.quickTo(magnet, 'y', { duration: 0.6, ease: 'expo.out' });
const labelX = gsap.quickTo(label, 'x', { duration: 0.6, ease: 'expo.out' });
const labelY = gsap.quickTo(label, 'y', { duration: 0.6, ease: 'expo.out' });

function pull(dx, dy) {
  moveX(dx * STRENGTH);
  moveY(dy * STRENGTH);
  labelX(dx * STRENGTH * LABEL_EXTRA);
  labelY(dy * STRENGTH * LABEL_EXTRA);
}

// 只在有滑鼠的裝置上啟用（手機沒有「靠近」這件事）
if (!reduce && window.matchMedia('(hover: hover)').matches) {
  zone.addEventListener('pointermove', e => {
    // 滑鼠和按鈕中心點的距離
    const r = magnet.getBoundingClientRect();
    pull(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
  });
  // 離開範圍：用有一點彈性的 ease 回到原位
  zone.addEventListener('pointerleave', () => {
    gsap.to([magnet, label], { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
  });
}

// ═══ 2. 波紋按鈕 ═══
function ripple(btn, x, y) {
  const r = btn.getBoundingClientRect();
  // 波紋要大到能蓋住整個按鈕：用「點擊位置到最遠角落」的距離當半徑
  const size = Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)) * 2;
  const dot = document.createElement('span');
  dot.className = 'ripple';
  Object.assign(dot.style, { width: `${size}px`, height: `${size}px`, left: `${x - size / 2}px`, top: `${y - size / 2}px` });
  btn.prepend(dot);

  gsap.timeline({ onComplete: () => dot.remove() })
    .fromTo(dot, { scale: 0, opacity: 0.35 }, { scale: 1, duration: RIPPLE_DURATION, ease: 'expo.out' })
    .to(dot, { opacity: 0, duration: RIPPLE_DURATION * 0.6, ease: 'power1.out' }, '-=0.35');
}

document.querySelectorAll('.btn-ripple, .btn-magnetic').forEach(btn => {
  btn.addEventListener('pointerdown', e => {
    // 按下：按鈕稍微縮小，給手指一個「壓下去」的回饋
    gsap.to(btn, { scale: 0.96, duration: 0.15, ease: 'power2.out' });
    if (!reduce) {
      const r = btn.getBoundingClientRect();
      ripple(btn, e.clientX - r.left, e.clientY - r.top);
    }
  });
  // 放開或移出：彈回原本大小
  const release = () => gsap.to(btn, { scale: 1, duration: 0.6, ease: 'expo.out' });
  btn.addEventListener('pointerup', release);
  btn.addEventListener('pointerleave', release);
  // 鍵盤按 Enter／空白鍵時，從按鈕中心擴散
  btn.addEventListener('keydown', e => {
    if (!reduce && (e.key === 'Enter' || e.key === ' ')) ripple(btn, btn.offsetWidth / 2, btn.offsetHeight / 2);
  });
});

// ── 自動示範一次（首頁縮圖也看得到動態） ──
if (!reduce) {
  gsap.timeline({ delay: 0.6 })
    .add(() => pull(60, -30))
    .add(() => pull(0, 0), 0.9)
    .add(() => {
      const btn = document.querySelector('.btn-ripple');
      ripple(btn, btn.offsetWidth * 0.3, btn.offsetHeight * 0.5);
    }, 1.2);
}
