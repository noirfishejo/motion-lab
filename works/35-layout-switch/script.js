gsap.registerPlugin(Flip);

// ── 試著改這幾個設定 ──
// MODE：'fade'  → 項目先淡出、版面切換、再在新位置依序浮出（產品裡最常見，不會有縮放變形）
//       'morph' → Flip：每個項目從舊位置移動、縮放到新位置（看得出誰去了哪裡，常見於相簿、檔案管理）
const MODE = 'fade';
const DURATION = 0.7;   // 'morph' 版面切換要幾秒
const STAGGER = 0.03;   // 每個項目之間差幾秒

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const list = document.querySelector('.items');
const buttons = [...document.querySelectorAll('.view-btn')];

function setView(view) {
  if (list.classList.contains(`is-${view}`)) return;
  buttons.forEach(b => b.setAttribute('aria-pressed', b.dataset.view === view));

  const swap = () => {
    list.classList.toggle('is-list', view === 'list');
    list.classList.toggle('is-grid', view === 'grid');
  };
  if (reduce) { swap(); return; }

  if (MODE === 'fade') {
    const items = list.querySelectorAll('.item');
    gsap.timeline()
      .to(items, { opacity: 0, y: -8, duration: 0.18, stagger: 0.015, ease: 'power2.in' })  // ① 舊版面淡出
      .add(swap)                                                                          // ② 換版面
      .fromTo(items, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'expo.out' }); // ③ 新位置依序浮出
    return;
  }

  // ── MODE = 'morph' ──
  // ① 記下每個項目、裡面的方塊和文字「現在」的位置和大小
  const state = Flip.getState('.item, .item-thumb, .item-text');
  // ② 直接切換 class：版面瞬間變成另一種
  swap();
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
