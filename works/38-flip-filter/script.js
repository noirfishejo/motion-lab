gsap.registerPlugin(Flip);

// ── 試著改這兩個數字 ──
const DURATION = 0.6;  // 補位要幾秒
const STAGGER = 0.03;  // 卡片之間差幾秒

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const tiles = [...document.querySelectorAll('.tile')];
const buttons = [...document.querySelectorAll('.filters button')];

function filter(cat) {
  buttons.forEach(b => b.setAttribute('aria-pressed', b.dataset.cat === cat));
  // ① 記下所有卡片現在的位置
  const state = Flip.getState(tiles);
  // ② 直接顯示／隱藏：版面瞬間變成篩選後的樣子
  // 用 inline 的 display（不用 hidden 屬性）：Flip 要能暫時把離開的卡片顯示出來，播完淡出才藏起來
  tiles.forEach(t => { t.style.display = cat !== 'all' && t.dataset.cat !== cat ? 'none' : ''; });
  if (reduce) return;
  // ③ Flip：留下的卡片從舊位置移動補位；新出現的放大淡入；被篩掉的縮小淡出
  Flip.from(state, {
    duration: DURATION,
    ease: 'expo.inOut',
    stagger: STAGGER,
    absolute: true,
    onEnter: els => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: DURATION, ease: 'expo.out' }),
    onLeave: els => gsap.to(els, { opacity: 0, scale: 0.85, duration: DURATION * 0.6, ease: 'power2.in' })
  });
}

buttons.forEach(b => b.addEventListener('click', () => filter(b.dataset.cat)));

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
// ── 自動示範一次（首頁縮圖也看得到動態） ──
const demo = gsap.context(() => {
  if (!reduce) {
    gsap.delayedCall(1, () => filter('motion'));
    gsap.delayedCall(2.6, () => filter('all'));
  }
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
