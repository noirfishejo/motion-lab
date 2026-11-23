// ── 試著改這兩個數字 ──
const FOLLOW = 0.3;   // 高亮底色追上滑鼠要幾秒（0 就是直接跳過去）
const OPEN = 0.35;    // 清單展開要幾秒

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const trigger = document.querySelector('.trigger');
const list = document.querySelector('.options');
const highlight = list.querySelector('.highlight');
const options = [...list.querySelectorAll('[role="option"]')];
const value = document.getElementById('sort-value');
let active = 0;

// 高亮底色只有一塊：移到某個選項 = 把它的 y 移到那個選項的位置（quickTo：連續移動時很順）
const moveY = gsap.quickTo(highlight, 'y', { duration: reduce ? 0 : FOLLOW, ease: 'expo.out' });

function setActive(i, instant = false) {
  active = i;
  list.setAttribute('aria-activedescendant', options[i].id);
  const y = options[i].offsetTop - options[0].offsetTop;
  if (instant) moveY(y, y); else moveY(y); // quickTo 第二個值是起點：起點＝終點就是直接跳過去
  gsap.to(highlight, { opacity: 1, duration: 0.2 });
}

function open() {
  list.hidden = false;
  trigger.setAttribute('aria-expanded', 'true');
  setActive(options.findIndex(o => o.getAttribute('aria-selected') === 'true'), true); // 一打開就在目前選的那項上
  list.focus({ preventScroll: true }); // preventScroll：放在預覽裡時，外面的頁面不會跟著捲
  if (!reduce) {
    gsap.fromTo(list, { opacity: 0, y: -6, scaleY: 0.96 }, { opacity: 1, y: 0, scaleY: 1, duration: OPEN, ease: 'expo.out' });
    gsap.from(options, { opacity: 0, y: -4, duration: 0.3, stagger: 0.03, ease: 'expo.out' });
    gsap.to(trigger.querySelector('.caret'), { rotation: 180, duration: OPEN, ease: 'expo.out' });
  }
}

function close(focusTrigger = true) {
  if (list.hidden) return;
  trigger.setAttribute('aria-expanded', 'false');
  const done = () => { list.hidden = true; gsap.set(highlight, { opacity: 0 }); };
  if (reduce) done();
  else {
    gsap.to(list, { opacity: 0, y: -4, duration: 0.15, ease: 'power2.in', onComplete: done });
    gsap.to(trigger.querySelector('.caret'), { rotation: 0, duration: 0.3, ease: 'expo.out' });
  }
  if (focusTrigger) trigger.focus({ preventScroll: true });
}

function choose(i) {
  options.forEach((o, n) => o.setAttribute('aria-selected', n === i));
  value.textContent = options[i].textContent;
  close();
}

trigger.addEventListener('click', () => (list.hidden ? open() : close()));
options.forEach((o, i) => {
  o.addEventListener('pointerenter', () => setActive(i));
  o.addEventListener('click', () => choose(i));
});
list.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown') { e.preventDefault(); setActive((active + 1) % options.length); }
  else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((active - 1 + options.length) % options.length); }
  else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active); }
  else if (e.key === 'Escape' || e.key === 'Tab') close(e.key === 'Escape');
});
document.addEventListener('pointerdown', e => { if (!e.target.closest('.dropdown')) close(false); }); // 點外面就關閉
