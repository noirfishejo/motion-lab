gsap.registerPlugin(Flip);

// ── 試著改這兩個數字 ──
const DURATION = 0.7;   // 版面切換要幾秒
const STAGGER = 0.03;   // 每個項目之間差幾秒（讓移動有先後，比較好看出誰去了哪裡）

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const list = document.querySelector('.items');
const buttons = [...document.querySelectorAll('.view-btn')];

function setView(view) {
  if (list.classList.contains(`is-${view}`)) return;
  buttons.forEach(b => b.setAttribute('aria-pressed', b.dataset.view === view));

  // ① 記下每個項目、裡面的方塊和文字「現在」的位置和大小
  const state = Flip.getState('.item, .item-thumb, .item-text');
  // ② 直接切換 class：版面瞬間變成另一種
  list.classList.toggle('is-list', view === 'list');
  list.classList.toggle('is-grid', view === 'grid');
  if (reduce) return;
  // ③ Flip 把每個東西從舊位置動畫到新位置
  Flip.from(state, {
    duration: DURATION,
    ease: 'expo.inOut',
    stagger: STAGGER,
    absolute: true,   // 動畫期間暫時改成絕對定位，項目之間不會互相推擠
    nested: true,     // 項目裡面的方塊和文字也一起算（它們的位置會跟著外層一起變）
    scale: true       // 方塊用縮放（scale）過去，而不是改寬高，比較順
  });
}

buttons.forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));

// ── 自動示範一次（首頁縮圖也看得到動態） ──
if (!reduce) gsap.delayedCall(1, () => setView('grid'));
