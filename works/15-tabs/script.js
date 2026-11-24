// ── 試著改這幾個數字 ──
const DURATION = 0.5;   // 底線滑過去要幾秒
const SHIFT = 24;       // 內容切換時，往分頁移動的方向滑多少 px

// 假資料：每個分頁的內容
const CONTENT = {
  overview: ['Overview', 'Your plan, usage this month and recent changes at a glance.'],
  activity: ['Activity', 'Sign-ins, edits and shared links from the last 30 days.'],
  settings: ['Settings', 'Name, language, notifications and connected apps.'],
  billing: ['Billing and invoices', 'Payment method, billing address and every invoice you have received.']
};

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const tabs = [...document.querySelectorAll('.tab')];
const indicator = document.querySelector('.indicator');
const panel = document.getElementById('panel');
const title = panel.querySelector('.panel-title');
const text = panel.querySelector('.panel-text');
const BASE = indicator.offsetWidth; // 底線本身的寬度（CSS 寫的 100px）

let current = tabs[0];
let panelTl;  // 內容切換的動畫

// 把底線移到某個分頁下方：x = 分頁左邊的位置，scaleX = 分頁寬 ÷ 底線本身的寬
function moveIndicator(tab, animate = true) {
  const to = { x: tab.offsetLeft, scaleX: tab.offsetWidth / BASE };
  if (!animate || reduce) gsap.set(indicator, to);
  else gsap.to(indicator, { ...to, duration: DURATION, ease: 'expo.out', overwrite: true });
}

function fillPanel(tab) {
  const [t, p] = CONTENT[tab.id.replace('tab-', '')];
  title.textContent = t;
  text.textContent = p;
  panel.setAttribute('aria-labelledby', tab.id);
}

function select(tab) {
  if (tab === current) return;
  // 往右邊的分頁切換 → 內容從右邊滑進來；往左 → 從左邊
  const dir = tabs.indexOf(tab) > tabs.indexOf(current) ? 1 : -1;
  tabs.forEach(t => {
    const on = t === tab;
    t.setAttribute('aria-selected', on);
    t.tabIndex = on ? 0 : -1;  // 只有選中的分頁能用 Tab 鍵進入，其他用方向鍵切換
  });
  current = tab;
  // 窄螢幕：把被選中的分頁捲進分頁列的可視範圍
  // （不用 scrollIntoView：放在 iframe 預覽裡時，它會連外面的整個頁面一起捲動）
  const bar = tab.parentElement;
  if (tab.offsetLeft < bar.scrollLeft || tab.offsetLeft + tab.offsetWidth > bar.scrollLeft + bar.clientWidth) {
    bar.scrollTo({ left: tab.offsetLeft - 16, behavior: reduce ? 'auto' : 'smooth' });
  }
  moveIndicator(tab);

  // 快速連點時：停掉上一次還沒跑完的內容切換，不然它的 fillPanel 會晚一步把內容換回舊的分頁
  panelTl?.kill();
  if (reduce) { fillPanel(tab); return; }
  panelTl = gsap.timeline({ defaults: { overwrite: true } })
    .to([title, text], { x: -SHIFT * dir, opacity: 0, duration: 0.15, ease: 'power2.in' })
    .add(() => fillPanel(tab))
    .fromTo([title, text], { x: SHIFT * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'expo.out' });
}

tabs.forEach(tab => tab.addEventListener('click', () => select(tab)));

// 鍵盤：左右方向鍵切換分頁，Home／End 跳到第一個、最後一個
document.querySelector('.tabs').addEventListener('keydown', e => {
  const i = tabs.indexOf(document.activeElement);
  if (i < 0) return;
  const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
  if (next === undefined) return;
  e.preventDefault();
  const tab = tabs[(next + tabs.length) % tabs.length];
  tab.focus();
  select(tab);
});

// 一開始：底線直接放在第一個分頁下方（不要動畫）；字體載入或視窗大小改變後重新對齊
fillPanel(current);
moveIndicator(current, false);
document.fonts.ready.then(() => moveIndicator(current, false));
// 只有「寬度」變了才重算：放在作品頁預覽裡展開程式碼時，iframe 只改高度、每一格都會觸發 resize
let lastW = innerWidth;
window.addEventListener('resize', () => { if (innerWidth !== lastW) { lastW = innerWidth; moveIndicator(current, false); } });

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
// ── 自動示範一次（首頁縮圖也看得到動態） ──
const demo = gsap.context(() => {
  if (!reduce) {
    gsap.delayedCall(0.8, () => select(tabs[2]));
    gsap.delayedCall(1.8, () => select(tabs[1]));
  }
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
