// ── 試著改這兩個數字，看看節奏怎麼變 ──
const STAGGER = 0.1;  // 每張卡片之間的間隔（秒）
const DURATION = 1.2;  // 每張卡片自己播多久（秒）

const cards = gsap.utils.toArray('.card');

// 把每張卡片的延遲時間寫在卡片上：第 n 張 = (n - 1) × STAGGER
cards.forEach((card, i) => {
  card.querySelector('.delay').textContent = `delay ${(i * STAGGER).toFixed(2)}s`;
});
document.querySelector('.gap-value').textContent = STAGGER;

function play() {
  const tl = gsap.timeline();

  // 卡片依序從下方浮現
  tl.from(cards, {
    y: 48,
    opacity: 0,
    duration: DURATION,
    ease: 'expo.out',
    stagger: STAGGER
  });

  // 時間條：和卡片同時開始、同樣間隔，長滿就代表那張卡片播完了
  tl.fromTo('.fill', { scaleX: 0 }, {
    scaleX: 1,
    duration: DURATION,
    ease: 'none',
    stagger: STAGGER
  }, 0);

  return tl;
}

// 尊重「減少動態」設定：有開啟就直接顯示最終畫面
// （要重播，按作品頁預覽上方的「重播」）
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduce) play();
