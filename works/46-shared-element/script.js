gsap.registerPlugin(Flip);

// ── 試著改這幾個數字 ──
const DURATION = 0.8; // 縮圖變大圖的秒數

const PLACES = [
  {
    icon: 'ph-mountains',
    name: 'Alpine Trail',
    country: 'Switzerland',
    body: 'A high ridge walk with lakes on both sides. Best from June to September, starting before sunrise.'
  },
  {
    icon: 'ph-waves',
    name: 'North Coast',
    country: 'Portugal',
    body: 'Cliff paths above long sandy beaches. Windy in the afternoon, calm and golden at dusk.'
  },
  {
    icon: 'ph-tree-evergreen',
    name: 'Pine Valley',
    country: 'Canada',
    body: 'Quiet forest loops along a river. Easy terrain, with a wooden lookout halfway.'
  },
  {
    icon: 'ph-sun-horizon',
    name: 'Desert Rim',
    country: 'United States',
    body: 'A short rim trail over red canyons. Bring water and stay for the sunset.'
  }
];

const detail = document.querySelector('.detail');
const hero = detail.querySelector('.hero');
const closeBtn = detail.querySelector('.close');
const textEls = detail.querySelectorAll('.detail-meta, h2, .detail-body');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let current = null; // 目前打開的卡片

const grid = document.querySelector('.grid');

function open(card, { focus = true } = {}) {
  if (current) return; // 已經開著一張：不能疊著開（不然前一張的縮圖會一直藏著）
  const i = Number(card.dataset.index);
  const place = PLACES[i];
  const thumb = card.querySelector('.thumb');
  current = card;

  // ① 記下縮圖現在的位置和大小
  const state = Flip.getState(thumb);

  // ② 換成詳細頁：大圖和縮圖用同一個 data-flip-id，Flip 就知道「它們是同一個東西」
  hero.dataset.flipId = thumb.dataset.flipId;
  hero.querySelector('i').className = `ph-light ${place.icon}`;
  detail.querySelector('.detail-meta').textContent = place.country;
  detail.querySelector('h2').textContent = place.name;
  detail.querySelector('.detail-body').textContent = place.body;
  detail.hidden = false;
  thumb.style.visibility = 'hidden'; // 縮圖先藏起來：畫面上只有「正在長大」的那一張
  grid.inert = true; // 被詳細頁蓋住的列表：Tab 不會跑過去、讀屏也不會唸

  // ③ 讓大圖從縮圖的位置長出來；scale: true 用縮放做（圖示也會跟著放大，比改寬高順）
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .add(Flip.from(state, { targets: hero, duration: reduce ? 0 : DURATION, ease: 'expo.inOut', scale: true }))
    .fromTo(detail, { backgroundColor: 'transparent' }, { backgroundColor: getComputedStyle(document.body).backgroundColor, duration: reduce ? 0 : 0.4 }, 0)
    .from([closeBtn, ...textEls], { opacity: 0, y: 24, duration: reduce ? 0 : 0.8, stagger: 0.06 }, reduce ? 0 : '-=0.35');

  // 把焦點移進來（preventScroll：放在作品頁預覽裡時，外面的頁面不會跟著捲）
  // 自動示範不移焦點：不然放在作品頁預覽裡時，會把焦點從外面的頁面搶走
  if (focus) closeBtn.focus({ preventScroll: true });
}

function close({ focus = true } = {}) {
  if (!current) return;
  const card = current;
  const thumb = card.querySelector('.thumb');
  current = null;

  // 文字先淡出，再讓大圖縮回縮圖原本的位置
  gsap.timeline()
    .to([closeBtn, ...textEls], { opacity: 0, duration: reduce ? 0 : 0.2 })
    .add(() => {
      const state = Flip.getState(hero);
      detail.hidden = true;
      gsap.set([closeBtn, ...textEls, detail], { clearProps: 'all' });
      grid.inert = false;
      thumb.style.visibility = '';
      Flip.from(state, { targets: thumb, duration: reduce ? 0 : DURATION * 0.85, ease: 'expo.inOut', scale: true, zIndex: 5 });
      if (focus) card.focus({ preventScroll: true }); // 焦點回到原本的卡片
    });
}

document.querySelectorAll('.card').forEach(card => card.addEventListener('click', () => open(card)));
closeBtn.addEventListener('click', () => close());
document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
if (!reduce) {
  const demo = [
    gsap.delayedCall(0.9, () => open(document.querySelectorAll('.card')[1], { focus: false })),
    gsap.delayedCall(2.8, () => close({ focus: false }))
  ];
  // 自己動手了就停掉示範，免得剛打開的詳細頁被它關掉
  ['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.forEach(d => d.kill()), { once: true }));
}
// #endregion demo
