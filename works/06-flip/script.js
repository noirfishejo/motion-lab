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

  // 展開的那張：文字先藏起來，卡片變大時才不會看到字跟著被拉扯
  const texts = card.querySelectorAll('.num, .name, .detail');
  if (opening) gsap.set(texts, { opacity: 0 });

  // ③ Flip 把每張卡片「從切換前的位置」動畫到「切換後的位置」
  Flip.from(state, {
    duration: DURATION,
    ease: 'expo.inOut',
    absolute: true, // 動畫期間暫時改成絕對定位，卡片不會互相推擠
    // ④ 卡片完全放大之後，文字才由上而下依序浮出來
    onComplete: () => {
      if (opening) gsap.fromTo(texts, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'expo.out' });
    }
  });
}

cards.forEach(card => card.addEventListener('click', () => toggle(card)));

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
// 自動示範一次（首頁縮圖也看得到動態）：載入後展開第 2 張
const demo = gsap.context(() => {
  if (!reduce) gsap.delayedCall(0.8, () => toggle(cards[1]));
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
