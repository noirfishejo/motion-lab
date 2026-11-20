gsap.registerPlugin(Flip);

// ── 試著改這個數字 ──
const DURATION = 0.8; // 版面切換要花幾秒

const grid = document.querySelector('.grid');
const cards = gsap.utils.toArray('.card');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function toggle(card) {
  const opening = !card.classList.contains('is-active');

  // ① 記下「切換前」每張卡片的位置和大小
  const state = Flip.getState(cards);

  // ② 直接切換 CSS class（版面瞬間變成「切換後」的樣子）
  cards.forEach(c => {
    const on = opening && c === card;
    c.classList.toggle('is-active', on);
    c.setAttribute('aria-expanded', on);
  });
  grid.classList.toggle('has-active', opening);

  if (reduce) return;

  // ③ Flip 把每張卡片「從切換前的位置」動畫到「切換後的位置」
  Flip.from(state, {
    duration: DURATION,
    ease: 'expo.inOut',
    absolute: true, // 動畫期間暫時改成絕對定位，卡片不會互相推擠
  });

  // 展開時，說明文字晚一點淡入
  if (opening) {
    gsap.from(card.querySelector('.detail'), { opacity: 0, y: 12, duration: 0.6, delay: DURATION * 0.6, ease: 'expo.out' });
  }
}

cards.forEach(card => card.addEventListener('click', () => toggle(card)));

// 自動示範一次（首頁縮圖也看得到動態）：載入後展開第 2 張
if (!reduce) gsap.delayedCall(0.8, () => toggle(cards[1]));
