// ── 試著改這幾個數字 ──
const DURATION = 0.5;    // 展開／收合要幾秒
const ONLY_ONE = true;   // true：一次只開一個（打開新的，舊的自動收起）；false：可以同時開好幾個

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const triggers = [...document.querySelectorAll('.trigger')];

function setOpen(trigger, open) {
  const answer = document.getElementById(trigger.getAttribute('aria-controls'));
  if ((trigger.getAttribute('aria-expanded') === 'true') === open) return;
  trigger.setAttribute('aria-expanded', open); // 「＋」變「－」和顏色交給 CSS

  if (reduce) { answer.hidden = !open; return; }

  if (open) {
    answer.hidden = false;
    // height: 'auto'：GSAP 會先量出內容實際的高度再動畫過去，答案多長都不用自己算
    gsap.fromTo(answer, { height: 0 }, { height: 'auto', duration: DURATION, ease: 'expo.out', overwrite: true });
    gsap.fromTo(answer.firstElementChild, { y: -8, opacity: 0 }, { y: 0, opacity: 1, duration: DURATION, delay: 0.08, ease: 'expo.out' });
  } else {
    gsap.to(answer, {
      height: 0, duration: DURATION * 0.7, ease: 'expo.inOut', overwrite: true,
      onComplete: () => { answer.hidden = true; gsap.set(answer, { clearProps: 'height' }); } // 收好後藏起來（讀屏軟體也不會唸到）
    });
  }
}

triggers.forEach(trigger => trigger.addEventListener('click', () => {
  const open = trigger.getAttribute('aria-expanded') !== 'true';
  if (open && ONLY_ONE) triggers.forEach(t => t !== trigger && setOpen(t, false));
  setOpen(trigger, open);
}));

// ── 自動示範一次（首頁縮圖也看得到動態） ──
if (!reduce) gsap.delayedCall(0.8, () => triggers[0].click());
