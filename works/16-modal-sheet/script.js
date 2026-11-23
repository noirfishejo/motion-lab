// ── 試著改這幾個數字 ──
const OPEN = 0.5;    // 打開要幾秒
const CLOSE = 0.3;   // 關閉要幾秒（關閉比打開快，感覺比較俐落）

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const narrow = window.matchMedia('(max-width: 599px)'); // 和 CSS 的斷點相同
const dialog = document.getElementById('dialog');
const scrim = dialog.querySelector('.scrim');
const sheet = dialog.querySelector('.sheet');
let closing = false;

// 同一個元件，依螢幕寬度決定「從哪裡來」：
// 電腦 → 從稍微下面、稍微小一點的地方浮上來；手機 → 從畫面底部整個滑上來
const hiddenState = () => (narrow.matches
  ? { yPercent: 100, y: 0, scale: 1, opacity: 1 }
  : { yPercent: 0, y: 24, scale: 0.96, opacity: 0 });

function open() {
  dialog.showModal(); // 焦點會自動移到彈窗裡的第一個按鈕
  if (reduce) return;
  gsap.timeline()
    .fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: OPEN * 0.6, ease: 'power1.out' })
    .fromTo(sheet, hiddenState(), { yPercent: 0, y: 0, scale: 1, opacity: 1, duration: OPEN, ease: 'expo.out' }, 0);
}

function close() {
  if (closing) return;
  closing = true;
  const done = () => { dialog.close(); closing = false; }; // 關閉後焦點會自動回到「Delete project」按鈕
  if (reduce) { done(); return; }
  gsap.timeline({ onComplete: done })
    .to(sheet, { ...hiddenState(), duration: CLOSE, ease: 'power2.in' })
    .to(scrim, { opacity: 0, duration: CLOSE, ease: 'power1.in' }, 0);
}

document.getElementById('openBtn').addEventListener('click', open);
// 點背景、按「Cancel」或「Delete」都會關閉（示範用，Delete 不會真的刪除）
dialog.querySelectorAll('[data-close]').forEach(el => el.addEventListener('click', close));
// 按 Esc：瀏覽器預設會「立刻」關掉，先攔下來，播完關閉動畫再關
dialog.addEventListener('cancel', e => { e.preventDefault(); close(); });

// （沒有自動示範：打開彈窗會把焦點移進來，放在作品頁預覽裡時會讓外面的頁面跟著捲動）
