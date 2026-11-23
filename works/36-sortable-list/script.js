gsap.registerPlugin(Draggable);

// ── 試著改這兩個數字 ──
const ROW = 64;        // 每一列佔多高（56px 的列＋8px 間距）
const MOVE = 0.35;     // 其他列讓位要幾秒

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const list = document.querySelector('.list');
const rows = [...list.querySelectorAll('.row')];
const status = document.getElementById('status');
let order = rows.map((_, i) => i);   // order[位置] = 第幾列（資料的順序）

list.style.height = `${rows.length * ROW - 8}px`;

// 依照 order 把每一列放到該去的位置；except：正在被拖的那列不動（它跟著手指）
function layout(except, instant = false) {
  order.forEach((rowIndex, slot) => {
    const row = rows[rowIndex];
    if (row === except) return;
    gsap.to(row, { y: slot * ROW, duration: instant || reduce ? 0 : MOVE, ease: 'expo.out', overwrite: 'auto' });
  });
}
layout(null, true);

const announce = (row, slot) => { status.textContent = `${row.querySelector('.row-text').textContent}, position ${slot + 1} of ${rows.length}`; };

// 把 row 移到 slot 這個位置：從 order 裡拿出來、插到新位置，其他列自動讓位
function moveTo(row, slot) {
  const from = order.indexOf(rows.indexOf(row));
  if (from === slot) return false;
  order.splice(slot, 0, order.splice(from, 1)[0]);
  return true;
}

rows.forEach(row => {
  // Draggable：只能上下拖、只能抓把手、不能拖出清單
  Draggable.create(row, {
    type: 'y',
    trigger: row.querySelector('.handle'),
    bounds: { minY: 0, maxY: (rows.length - 1) * ROW },
    onPress() {
      row.classList.add('is-dragging');
      if (!reduce) gsap.to(row, { scale: 1.02, duration: 0.2, ease: 'power2.out' }); // 拿起來：稍微放大
    },
    onDrag() {
      // 拖到哪一格：目前的 y ÷ 列高，四捨五入
      const slot = gsap.utils.clamp(0, rows.length - 1, Math.round(this.y / ROW));
      if (moveTo(row, slot)) layout(row); // 換位置了 → 其他列讓位
    },
    onRelease() {
      const slot = order.indexOf(rows.indexOf(row));
      row.classList.remove('is-dragging');
      // 放開：吸到自己的那一格、縮回原尺寸
      gsap.to(row, { y: slot * ROW, scale: 1, duration: reduce ? 0 : 0.4, ease: 'expo.out' });
      announce(row, slot);
    }
  });

  // 鍵盤：把手有焦點時，上下方向鍵移動一格
  row.querySelector('.handle').addEventListener('keydown', e => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
    e.preventDefault();
    const from = order.indexOf(rows.indexOf(row));
    const slot = gsap.utils.clamp(0, rows.length - 1, from + (e.key === 'ArrowUp' ? -1 : 1));
    if (moveTo(row, slot)) { layout(null); announce(row, slot); }
  });
});

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
// ── 自動示範一次：第 4 列移到第 2 列（首頁縮圖也看得到動態） ──
if (!reduce) gsap.delayedCall(1, () => { moveTo(rows[3], 1); layout(null); });
// #endregion demo
