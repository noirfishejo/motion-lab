gsap.registerPlugin(ScrollTrigger);

// ── 試著改這幾個數字 ──
const PER_CARD = 0.6;   // 每張卡片離場要捲多遠（畫面高的倍數）：越大越慢
const TILT = 12;        // 往下掉落時最多轉幾度
const SWIPE_TILT = 24;  // 左右甩出時轉幾度（甩出去的力道比較大，轉得多一點）
const SCRUB = 0.6;      // 跟手的延遲秒數；改成 true 會完全貼著捲動

// 是否顯示 markers：由作品頁預覽上方的開關決定（首頁縮圖預設不顯示）
const SHOW_MARKERS = window.SHOW_MARKERS ?? new URLSearchParams(location.search).has('markers');

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// 最上面的卡片是 HTML 裡的第一張；畫面上要讓它疊在最前面
const cards = [...document.querySelectorAll('.drop-card')];
cards.forEach((card, i) => { card.style.zIndex = cards.length - i; });

// 疊起來的樣子：第 n 張往上錯開 n × 20px、縮小 n × 6%、暗一點（越後面越小、越高、越暗）
const stacked = n => ({ y: -n * 20, scale: 1 - n * 0.06, filter: `brightness(${1 - n * 0.18})` });

// 兩種離場方式：回傳「第 i 張卡片」要動到哪裡
const EXITS = {
  // 往下掉出畫面，左右交替傾斜；ease 一開始慢、越掉越快，像受重力影響
  fall: i => ({
    y: () => innerHeight,
    rotation: (i % 2 ? -1 : 1) * TILT,
    // 只在最後 40% 才淡出：太早半透明會透出後面的卡片，看起來像掉到後面去
    opacity: 0,
    ease: 'power2.in'
  }),
  // 左右交替甩出畫面：往旁邊飛、稍微往上揚、轉比較多；甩出去不用淡出，直接飛出畫面外
  swipe: i => {
    const dir = i % 2 ? -1 : 1;
    return {
      x: () => dir * (innerWidth / 2 + cards[0].offsetWidth), // 中心點移到畫面外，再多一張卡片寬，確保整張出去
      y: -40,
      rotation: dir * SWIPE_TILT,
      ease: 'power1.in'
    };
  }
};

let tl;
function build(mode) {
  // 換方式時：先把舊的 timeline 和它的 ScrollTrigger（含固定畫面）拆掉，卡片回到疊好的樣子
  if (tl) { tl.scrollTrigger.kill(); tl.kill(); }
  gsap.set(cards, { clearProps: 'x,y,rotation,opacity' });
  cards.forEach((card, i) => gsap.set(card, stacked(i)));
  if (reduce) return; // 減少動態：維持疊好的樣子，不做離場動畫

  tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: '.pile',
      start: 'top top',
      end: () => `+=${innerHeight * PER_CARD * (cards.length - 1)}`, // 每張卡片分到一段捲動距離
      pin: true,           // 固定住：卡片沒離場完之前，頁面看起來不會往下走
      scrub: SCRUB,
      invalidateOnRefresh: true,
      markers: SHOW_MARKERS
    }
  });

  // 最後一張留著（其他都離場後，畫面上還有東西），其他依序離場
  cards.slice(0, -1).forEach((card, i) => {
    const at = i; // 第 i 段捲動
    const { opacity, ...move } = EXITS[mode](i);
    tl.to(card, { ...move, duration: 1 }, at);
    if (opacity !== undefined) tl.to(card, { opacity, duration: 0.4 }, at + 0.6);
    // 同一段時間裡，後面的每張卡片都往前遞補一格（變大、往下）
    cards.slice(i + 1).forEach((rest, j) => tl.to(rest, { ...stacked(j), duration: 1, ease: 'power2.out' }, at));
  });
}

// ── 切換按鈕 ──
const buttons = document.querySelectorAll('.mode-btn');
buttons.forEach(btn => btn.addEventListener('click', () => {
  buttons.forEach(b => b.setAttribute('aria-pressed', b === btn));
  // 先回到最上面再重建：卡片從疊好的樣子重新開始
  window.scrollTo(0, 0);
  build(btn.dataset.mode);
}));

build('fall');
