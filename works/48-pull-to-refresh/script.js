gsap.registerPlugin(Draggable);

// ── 試著改這幾個數字 ──
const THRESHOLD = 72;  // 拉超過幾 px，放開才會更新
const MAX = 160;       // 最多能拉多遠（越拉越重，永遠拉不到這個數字）
const HOLD = 64;       // 更新中，列表停在往下幾 px（露出轉圈圈）
const LOAD_TIME = 1.4; // 假裝等資料的秒數（真實情況是 fetch 回來才呼叫 finish）

const feed = document.querySelector('.feed');
const indicator = document.querySelector('.indicator');
const spinner = indicator.querySelector('.spinner');
const icon = spinner.querySelector('i');
const hint = indicator.querySelector('.hint');
const status = document.getElementById('status');
const refreshBtn = document.getElementById('refreshBtn');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dur = s => (reduce ? 0 : s);

// 新進來的資料（假資料：每次更新輪流放一筆）
const INCOMING = [
  ['LP', 'Leo Park', 'mentioned you in Sprint notes'],
  ['NG', 'Nora Gill', 'uploaded Hero video'],
  ['TB', 'Tom Baker', 'invited you to Design review']
];
let nextItem = 0;

// 拉了多遠：用一個物件存，手指拖曳和程式補間都改它，再由 render() 畫到畫面上
const pull = { y: 0 };
let armed = false;      // 是否已經拉過門檻（放開就會更新）
let refreshing = false;
let spin;               // 轉圈圈的無限動畫

// 越拉越重：手指移動 100px，列表只動一部分，而且越往下越少（像橡皮筋）
const damp = y => MAX * (1 - Math.exp(-Math.max(0, y) / MAX));
const undamp = p => -MAX * Math.log(1 - Math.min(p, MAX - 1) / MAX); // 反過來：列表在 p 時，手指要在哪裡

function render() {
  const p = pull.y;
  gsap.set(feed, { y: p });
  const t = Math.min(p / THRESHOLD, 1); // 0 → 1：拉到門檻的進度
  gsap.set(indicator, { opacity: t, y: (p - 72) / 2 }); // 指示器在列表空出來的空間裡置中
  gsap.set(spinner, { scale: 0.6 + t * 0.4 });
  if (refreshing) return;
  const now = p >= THRESHOLD;
  if (now !== armed) {
    // 拉過門檻那一刻：箭頭轉 180°、外框變色、文字換成「放開就更新」（只在狀態改變時補間）
    armed = now;
    gsap.to(icon, { rotation: armed ? 180 : 0, duration: dur(0.3), ease: 'back.out(2)' });
    spinner.classList.toggle('is-armed', armed);
    hint.textContent = armed ? 'Release to refresh' : 'Pull to refresh';
  }
}

function settle(to, duration = 0.5) {
  return gsap.to(pull, { y: to, duration: dur(duration), ease: 'expo.out', overwrite: true, onUpdate: render });
}

// ── 開始更新：列表停在 HOLD，箭頭換成轉圈圈 ──
function refresh() {
  if (refreshing) return;
  refreshing = true;
  armed = false;
  spinner.classList.add('is-armed');
  icon.className = 'ph-light ph-circle-notch';
  gsap.set(icon, { rotation: 0 });
  if (!reduce) spin = gsap.to(icon, { rotation: 360, duration: 0.8, ease: 'none', repeat: -1 });
  hint.textContent = 'Refreshing…';
  status.textContent = 'Refreshing';
  refreshBtn.disabled = true;
  settle(HOLD);
  gsap.delayedCall(LOAD_TIME, finish);
}

// ── 資料回來：新的一筆插在最上面，列表收回去 ──
function finish() {
  const [initials, who, what] = INCOMING[nextItem++ % INCOMING.length];
  const li = document.createElement('li');
  li.className = 'item is-new';
  li.innerHTML = `<span class="avatar">${initials}</span><span class="text"><span class="who">${who}</span><span class="what">${what}</span></span><span class="time">now</span>`;
  feed.querySelectorAll('.is-new').forEach(el => el.classList.remove('is-new'));
  feed.prepend(li);
  feed.lastElementChild.remove(); // 列表維持一樣長（假資料）

  hint.textContent = 'Updated';
  status.textContent = `Updated. New: ${who} ${what}`;
  spin?.kill();

  gsap.timeline({
    onComplete: () => {
      refreshing = false;
      refreshBtn.disabled = false;
      icon.className = 'ph-light ph-arrow-down';
      gsap.set(icon, { rotation: 0 });
      spinner.classList.remove('is-armed');
      hint.textContent = 'Pull to refresh';
    }
  })
    .to(pull, { y: 0, duration: dur(0.6), ease: 'expo.out', onUpdate: render }, 0.25) // 先讓「Updated」停一下，再收回去
    // 新的一筆從上面長出來：高度從 0 打開、內容淡入（只有這一筆改高度，負擔很小）
    .from(li, { height: 0, paddingTop: 0, paddingBottom: 0, opacity: 0, duration: dur(0.5), ease: 'expo.out', clearProps: 'all' }, 0.35);
}

function release() {
  if (refreshing) return;
  if (pull.y >= THRESHOLD) refresh();
  else settle(0); // 沒拉過門檻：彈回去，什麼都不做
}

// ── 拖曳：用一個看不到的「代理」元素接收拖曳距離，再換算成有阻力的拉動距離 ──
// （直接拖 feed 的話，列表會 1:1 跟著手指走，沒有越拉越重的感覺）
const proxy = document.createElement('div');
Draggable.create(proxy, {
  type: 'y',
  trigger: feed,
  onPress() {
    if (refreshing) return this.endDrag();
    gsap.killTweensOf(pull);
    gsap.set(proxy, { y: undamp(pull.y) }); // 從列表目前的位置接著拉（例如彈回去途中又抓住）
    this.update();
  },
  onDrag() {
    pull.y = damp(this.y); // 往上推（y < 0）不動：下拉更新只往下
    render();
  },
  onRelease: release
});

// 鍵盤、滑鼠使用者：按鈕也能更新（先把列表拉到 HOLD，看起來和手拉一樣）
refreshBtn.addEventListener('click', refresh);

render();

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (!reduce) {
    gsap.timeline({ delay: 0.8 })
      .to(pull, { y: THRESHOLD + 20, duration: 0.9, ease: 'power2.out', onUpdate: render })
      .add(release, '+=0.25');
  }
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => { demo.kill(); if (!refreshing && pull.y) settle(0); }, { once: true }));
// #endregion demo
