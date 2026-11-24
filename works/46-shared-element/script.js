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
const dur = s => (reduce ? 0 : s);
const flipEase = gsap.parseEase('expo.inOut');
// 縮圖上的圖示 ÷ 大圖上的圖示（例如 44px ÷ 88px = 0.5）
const iconRatio = thumb => parseFloat(getComputedStyle(thumb).fontSize) / parseFloat(getComputedStyle(hero).fontSize);
// 外框寬高各自縮放時，圖示反向修正：看起來的大小從 from 倍平順變到 1 倍，而且寬高一樣（不變形）
function keepIcon(box, from) {
  const icon = box.querySelector('i');
  return function () {
    const p = flipEase(this.progress());
    const size = from + (1 - from) * p;            // 圖示這一格看起來應該是幾倍
    const sx = gsap.getProperty(box, 'scaleX');     // 外框這一格被縮放了多少
    const sy = gsap.getProperty(box, 'scaleY');
    if (this.progress() === 1) gsap.set(icon, { clearProps: 'transform' });
    else gsap.set(icon, { scaleX: size / sx, scaleY: size / sy });
  };
}

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

  // ③ 讓大圖從縮圖的位置長出來；scale: true 用縮放做（不會每一格重排版面，比改寬高順）
  // 縮圖 4:3、大圖 16:9，寬高縮放的比例不同，圖示會被壓扁 → keepIcon 每一格把圖示反向修正成等比例
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .add(Flip.from(state, { targets: hero, duration: dur(DURATION), ease: 'expo.inOut', scale: true, onUpdate: keepIcon(hero, iconRatio(thumb)) }))
    .fromTo(detail, { backgroundColor: 'transparent' }, { backgroundColor: getComputedStyle(document.body).backgroundColor, duration: dur(0.4) }, 0)
    // 返回鈕只淡入、往右滑一點（不往上浮：從下面浮上來會壓到大圖），文字再依序浮上來
    .from(closeBtn, { opacity: 0, x: -12, duration: dur(0.6) }, reduce ? 0 : '-=0.35')
    .from(textEls, { opacity: 0, y: 24, duration: dur(0.8), stagger: 0.06 }, '<');

  // 把焦點移進來（preventScroll：放在作品頁預覽裡時，外面的頁面不會跟著捲）
  // 自動示範不移焦點：不然放在作品頁預覽裡時，會把焦點從外面的頁面搶走
  if (focus) closeBtn.focus({ preventScroll: true });
}

function close({ focus = true } = {}) {
  if (!current) return;
  const card = current;
  const thumb = card.querySelector('.thumb');
  current = null;

  // ① 文字和返回鈕先淡出（由下往上依序），完全消失之後
  // ② 大圖才縮回縮圖原本的位置，詳細頁的底色同時淡掉，露出後面的列表
  gsap.timeline()
    .to([...textEls].reverse().concat(closeBtn), { opacity: 0, y: 12, duration: dur(0.3), stagger: dur(0.04), ease: 'power2.in' })
    .add(() => {
      const state = Flip.getState(hero);
      hero.style.visibility = 'hidden'; // 詳細頁先留著（只剩底色），大圖改由縮圖接手往回縮
      thumb.style.visibility = '';
      grid.inert = false;
      gsap.timeline({
        onComplete: () => {
          detail.hidden = true;
          hero.style.visibility = '';
          gsap.set([closeBtn, ...textEls, detail], { clearProps: 'all' });
        }
      })
        .add(Flip.from(state, { targets: thumb, duration: dur(DURATION * 0.85), ease: 'expo.inOut', scale: true, zIndex: 20, onUpdate: keepIcon(thumb, 1 / iconRatio(thumb)) }))
        .to(detail, { backgroundColor: 'transparent', duration: dur(0.35), ease: 'power1.out' }, 0);
      if (focus) card.focus({ preventScroll: true }); // 焦點回到原本的卡片
    });
}

document.querySelectorAll('.card').forEach(card => card.addEventListener('click', () => open(card)));
closeBtn.addEventListener('click', () => close());
document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (!reduce) {
    gsap.delayedCall(0.9, () => open(document.querySelectorAll('.card')[1], { focus: false }));
    gsap.delayedCall(2.8, () => close({ focus: false }));
  }
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
