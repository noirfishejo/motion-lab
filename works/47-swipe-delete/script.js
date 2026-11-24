gsap.registerPlugin(Draggable);

// ── 試著改這幾個數字 ──
const OPEN = 96;           // 滑開後停住的距離（剛好露出刪除按鈕）
const DELETE_AT = 0.5;     // 滑超過項目寬度的幾成，放開就直接刪除

const list = document.querySelector('.list');
const empty = document.querySelector('.empty');
const template = list.innerHTML; // 「Restore all」用：記下原本的清單
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dur = s => (reduce ? 0 : s);
let draggables = [];

function setup() {
  draggables.forEach(d => d.kill());
  draggables = [...list.querySelectorAll('.row')].map(row => {
    const content = row.querySelector('.content');
    const del = row.querySelector('.delete');
    const icon = del.querySelector('i');

    let width = row.offsetWidth, armed = false;
    const d = Draggable.create(content, {
      type: 'x',
      bounds: { minX: -row.offsetWidth, maxX: 0 },
      edgeResistance: 0.9,
      onPress() {
        closeOthers(content);
        width = row.offsetWidth; // 按下時量一次寬度就好，拖曳時（每一格）不用一直量
        armed = false;
      },
      onDrag() {
        // 拖過「刪除線」時，圖示放大提示「放開就會刪除」；只有狀態改變那一刻才補間，不是每一格都建新的動畫
        const now = -this.x > width * DELETE_AT;
        if (now === armed) return;
        armed = now;
        gsap.to(icon, { scale: armed ? 1.3 : 1, duration: dur(0.25), ease: 'back.out(3)', overwrite: true });
      },
      onRelease() {
        if (-this.x > row.offsetWidth * DELETE_AT) remove(row);
        else snap(content, -this.x > OPEN / 2 ? -OPEN : 0); // 超過一半的按鈕寬就停在打開的位置
      }
    })[0];

    del.addEventListener('click', () => remove(row));
    content.addEventListener('keydown', e => { if (e.key === 'Delete' || e.key === 'Backspace') remove(row); });
    // 用 Tab 移到刪除按鈕時：自動滑開，按鈕才看得到（平常它被項目蓋住）；焦點離開這一列就收回
    del.addEventListener('focus', () => { closeOthers(content); snap(content, -OPEN); });
    row.addEventListener('focusout', e => { if (!row.contains(e.relatedTarget) && row.isConnected && !Draggable.get(content)?.isDragging) snap(content, 0); });
    return d;
  });
}

function snap(content, x) {
  gsap.to(content, { x, duration: dur(0.5), ease: 'expo.out', onUpdate: () => Draggable.get(content)?.update() });
}
// 一次只打開一列
function closeOthers(except) {
  list.querySelectorAll('.content').forEach(c => { if (c !== except && gsap.getProperty(c, 'x') !== 0) snap(c, 0); });
}

function remove(row) {
  const content = row.querySelector('.content');
  Draggable.get(content)?.kill();
  // 刪掉的那一列有焦點時：焦點移到下一列（沒有就上一列，都沒有就移到「Restore all」），不會掉回頁面最上面
  const hadFocus = row.contains(document.activeElement);
  const nextRow = row.nextElementSibling || row.previousElementSibling;
  const moveFocus = () => { if (hadFocus) (nextRow?.querySelector('.content') ?? document.getElementById('restore')).focus({ preventScroll: true }); };
  // 先整列滑出去，再把高度收起來，下面的項目自然往上補
  gsap.timeline({ onComplete: () => { row.remove(); empty.hidden = !!list.children.length; moveFocus(); } })
    .to(content, { x: -row.offsetWidth, duration: dur(0.25), ease: 'power2.in' })
    .to(row, { height: 0, borderBottomWidth: 0, duration: dur(0.4), ease: 'expo.out' });
}

document.getElementById('restore').addEventListener('click', () => {
  list.innerHTML = template;
  empty.hidden = true;
  setup();
  gsap.from(list.children, { opacity: 0, y: 12, duration: dur(0.6), stagger: 0.05, ease: 'expo.out' });
});

setup();

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (!reduce) {
    const first = list.querySelector('.content');
    gsap.delayedCall(0.8, () => snap(first, -OPEN));
    gsap.delayedCall(2, () => snap(first, 0));
  }
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
