// ── 試著改這幾個數字 ──
const OPEN_W = 320;     // 打開後的寬度（px；窄螢幕會自動變小）
const DURATION = 0.6;   // 撐開要幾秒
const CLOSE_SPEED = 1.5; // 關閉時的倍速

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const shell = document.querySelector('.shell');
const toggle = shell.querySelector('.toggle');
const nav = document.getElementById('nav');
const scrim = document.querySelector('.scrim');
const words = shell.querySelectorAll('.word');
let tl;

// 打開的動畫每次都重新建立：尺寸要依當下的畫面寬度、選單內容的高度來量
function build() {
  const closedW = toggle.offsetWidth, closedH = toggle.offsetHeight;
  nav.hidden = false;
  const openW = Math.min(OPEN_W, innerWidth - 32);
  gsap.set(shell, { width: openW });
  const openH = shell.offsetHeight;   // 打開後內容的實際高度
  gsap.set(shell, { width: closedW, height: closedH });

  return gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' }, onReverseComplete: () => { nav.hidden = true; gsap.set(shell, { clearProps: 'width,height' }); } })
    // ① 外殼往左下撐開（右上角固定不動，因為它是靠右上定位的）
    .to(shell, { width: openW, height: openH, duration: DURATION }, 0)
    .fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: DURATION * 0.8, ease: 'power1.out' }, 0)
    // ② 按鈕文字像滾輪一樣從「Menu」換成「Close」，＋ 轉 45° 變成 ×
    .fromTo(words, { yPercent: 0 }, { yPercent: -100, duration: 0.5, ease: 'expo.out' }, 0)
    .fromTo(shell.querySelector('.toggle-icon'), { rotation: 0 }, { rotation: 45, duration: 0.5, ease: 'expo.out' }, 0)
    // ③ 撐開到一半時，連結一個一個從遮罩下方升起
    // （用 fromTo 寫清楚起點和終點：每次打開都重新建立動畫，用 from 的話第二次會把「藏在下面」當成終點）
    .fromTo(nav.querySelectorAll('.item'), { yPercent: 110 }, { yPercent: 0, duration: 0.6, stagger: 0.05, ease: 'expo.out' }, DURATION * 0.45);
}

function setOpen(open) {
  toggle.setAttribute('aria-expanded', open);
  scrim.style.pointerEvents = open ? 'auto' : 'none';
  if (open) {
    tl?.kill();
    tl = build();
    reduce ? tl.progress(1) : tl.timeScale(1).play();
    nav.querySelector('a').focus({ preventScroll: true });
  } else if (tl) {
    reduce ? tl.progress(0) : tl.timeScale(CLOSE_SPEED).reverse();
    if (reduce) { nav.hidden = true; gsap.set(shell, { clearProps: 'width,height' }); }
    toggle.focus({ preventScroll: true });
  }
}

toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
scrim.addEventListener('click', () => setOpen(false));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') setOpen(false); });
nav.addEventListener('click', e => { if (e.target.closest('a')) { e.preventDefault(); setOpen(false); } }); // 示範用：點連結就關閉

// （沒有自動打開：打開會把焦點移進選單，放在作品頁預覽裡時外面的頁面會跟著捲動）
