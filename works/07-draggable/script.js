gsap.registerPlugin(Draggable, InertiaPlugin);

// ── 試著改這兩個數字 ──
const PEEK = 96;     // 收合時露出多少高度（px）
const HALF = 0.45;   // 半開時抽屜往下移多少（抽屜高度的比例）

const sheet = document.querySelector('.sheet');
const stateEl = document.querySelector('.state');
const yEl = document.querySelector('.y');

// 三個吸附點：y 越大，抽屜越往下（越收合）
const height = sheet.offsetHeight;
const SNAP = {
  open: 0,                         // 全開
  half: Math.round(height * HALF), // 半開
  collapsed: height - PEEK         // 收合
};
const points = Object.values(SNAP);

// 顯示目前的 y 和最接近的狀態
function update(y) {
  yEl.textContent = Math.round(y);
  const nearest = Object.entries(SNAP).reduce((a, b) => Math.abs(b[1] - y) < Math.abs(a[1] - y) ? b : a);
  stateEl.textContent = nearest[0];
}

// 一開始是收合
gsap.set(sheet, { y: SNAP.collapsed });
update(SNAP.collapsed);

Draggable.create(sheet, {
  type: 'y',                                  // 只能上下拖
  bounds: { minY: 0, maxY: SNAP.collapsed },       // 拖曳範圍：全開到收合之間
  inertia: true,                              // 放開時會依照甩動的速度繼續滑一段
  snap: { y: gsap.utils.snap(points) },       // 滑到最後會停在最近的吸附點
  edgeResistance: 0.85,                       // 拖到範圍外時的阻力（0～1）
  onDrag() { update(this.y); },
  onThrowUpdate() { update(this.y); }
});

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
// 自動示範一次（首頁縮圖也看得到動態）：從收合滑到半開
const demo = gsap.context(() => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.to(sheet, {
      y: SNAP.half, duration: 1, ease: 'expo.out', delay: 0.6,
      onUpdate: () => update(gsap.getProperty(sheet, 'y'))
    });
  }
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
