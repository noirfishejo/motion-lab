// ── 試著改這幾個數字 ──
const DURATION = 0.6;   // 選單展開要幾秒
const STAGGER = 0.06;   // 每個選項之間差幾秒進場
const CLOSE_SPEED = 1.6; // 關閉時播放的倍速（關閉比打開快，比較俐落）

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const burger = document.querySelector('.burger');
const menu = document.getElementById('menu');
// （不能叫 top：那是瀏覽器內建的 window.top）
const [lineTop, lineMid, lineBottom] = burger.querySelectorAll('.line');

// 一條時間軸包辦「打開」的全部動作；關閉時把同一條倒著播（reverse），不用另外寫關閉動畫
const tl = gsap.timeline({
  paused: true,
  defaults: { ease: 'expo.inOut' },
  onReverseComplete: () => { menu.hidden = true; } // 倒著播完 = 完全關上，才把選單藏起來
})
  // ① 漢堡 → ×：上下兩條移到中間並轉 45°，中間那條縮掉
  .to(lineTop, { y: 7, rotation: 45, duration: 0.4 }, 0)
  .to(lineBottom, { y: -7, rotation: -45, duration: 0.4 }, 0)
  .to(lineMid, { scaleX: 0, opacity: 0, duration: 0.2, ease: 'power2.in' }, 0)
  // ② 選單從上方往下展開（clip-path：從一條線變成整個畫面）
  .fromTo(menu, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: DURATION }, 0)
  // ③ 選項逐項從遮罩下方升起，最後是聯絡資訊
  .from('.item', { yPercent: 110, duration: 0.7, stagger: STAGGER, ease: 'expo.out' }, DURATION * 0.5)
  .from('.menu-foot', { opacity: 0, y: 12, duration: 0.5, ease: 'expo.out' }, '-=0.4');

function setOpen(open) {
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
  document.body.classList.toggle('is-open', open);
  if (open) {
    menu.hidden = false;
    reduce ? tl.progress(1) : tl.timeScale(1).play();
    menu.querySelector('a').focus({ preventScroll: true }); // 鍵盤使用者直接從第一個選項開始
  } else {
    reduce ? (tl.progress(0), menu.hidden = true) : tl.timeScale(CLOSE_SPEED).reverse();
    burger.focus({ preventScroll: true });
  }
}

burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') setOpen(false); });
menu.addEventListener('click', e => { if (e.target.closest('a')) { e.preventDefault(); setOpen(false); } }); // 示範用：點選項就關閉

// （沒有自動示範：載入時自己變 × 又變回來，看起來像滑鼠碰到就有反應，容易誤會）
