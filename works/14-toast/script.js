// ── 試著改這幾個數字 ──
const LIFETIME = 4;   // 通知停留幾秒後自動消失
const MAX = 3;        // 最多同時顯示幾則，超過就把最舊的收掉
const SLIDE = 24;     // 進場時從下方多遠的地方滑上來（px）

// 假資料：三種通知的內容
const MESSAGES = {
  success: { icon: 'ph-check-circle', title: 'Changes saved', text: 'Your profile is up to date.' },
  error: { icon: 'ph-warning-circle', title: 'Upload failed', text: 'The file is larger than 10 MB.' },
  info: { icon: 'ph-info', title: 'New version available', text: 'Refresh to get the latest features.' }
};

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const list = document.querySelector('.toasts');
const template = document.getElementById('toast-template');

function showToast(type) {
  const msg = MESSAGES[type];
  const wrap = template.content.firstElementChild.cloneNode(true);
  const toast = wrap.querySelector('.toast');
  toast.dataset.type = type;
  wrap.querySelector('.toast-icon').classList.add(msg.icon);
  wrap.querySelector('.toast-title').textContent = msg.title;
  wrap.querySelector('.toast-text').textContent = msg.text;
  list.append(wrap);

  // 超過 MAX 則：把最舊的那一則收掉
  const all = list.querySelectorAll('.toast-wrap:not(.is-leaving)');
  if (all.length > MAX) dismiss(all[0]);

  // 進場：外層高度從 0 撐開（上面的通知會平順地被推上去），
  //      內層同時從下方滑上來、淡入
  if (!reduce) {
    gsap.timeline()
      .from(wrap, { height: 0, duration: 0.45, ease: 'expo.out' })
      .from(toast, { y: SLIDE, opacity: 0, duration: 0.5, ease: 'expo.out' }, 0);
  }

  // 倒數：底部的線從滿縮到 0，結束時自動收掉
  const timer = gsap.fromTo(wrap.querySelector('.toast-timer'), { scaleX: 1 }, {
    scaleX: 0, duration: LIFETIME, ease: 'none',
    onComplete: () => dismiss(wrap)
  });
  wrap.timer = timer;

  // 滑鼠移上去：暫停倒數（讓人有時間看完）；移開再繼續
  toast.addEventListener('pointerenter', () => timer.pause());
  toast.addEventListener('pointerleave', () => timer.resume());
  // 鍵盤焦點在通知裡（例如關閉鈕）時也暫停
  toast.addEventListener('focusin', () => timer.pause());
  toast.addEventListener('focusout', () => timer.resume());
  wrap.querySelector('.toast-close').addEventListener('click', () => dismiss(wrap));
}

// 離場：先往右滑出、淡出，再把高度收成 0（下面的通知不會突然跳上來）
function dismiss(wrap) {
  if (wrap.classList.contains('is-leaving')) return;
  wrap.classList.add('is-leaving');
  wrap.timer?.kill();
  if (reduce) { wrap.remove(); return; }
  gsap.timeline({ onComplete: () => wrap.remove() })
    .to(wrap.querySelector('.toast'), { x: 48, opacity: 0, duration: 0.25, ease: 'power2.in' })
    .to(wrap, { height: 0, duration: 0.35, ease: 'expo.inOut' });
}

document.querySelectorAll('.btn').forEach(btn =>
  btn.addEventListener('click', () => showToast(btn.dataset.type)));

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
// ── 自動示範一次（首頁縮圖也看得到動態） ──
const demo = gsap.context(() => {
  if (!reduce) {
    gsap.delayedCall(0.6, () => showToast('success'));
    gsap.delayedCall(1.3, () => showToast('info'));
  }
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
