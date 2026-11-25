// ═══════════════════════════════════════════════
// 會動的圖示：Phosphor 官方的 SVG（Light），不是自己畫的
// · Phosphor 的 SVG 是填色的外框，所以「畫出來」的做法是：先用細線沿著外框描一圈，再把裡面填滿
// · 每個圖示另外有一個小動作（motion），滑過卡片時播：眨眼、搖鈴、彈一下……
// · 讀不到 SVG（離線）時維持原本的圖示字型，只是不會描邊
// ═══════════════════════════════════════════════
const BASE = 'https://unpkg.com/@phosphor-icons/core@2.1.1/assets/light/';
const cache = new Map();
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// 先放圖示字型（立刻看得到），hydrateIcons 再換成可以描邊的 SVG
export const iconSlot = (name, motion = 'pop') =>
  `<span class="anim-icon" data-icon="${name}" data-motion="${motion}" aria-hidden="true"><i class="ph-light ph-${name}"></i></span>`;

function load(name) {
  if (!cache.has(name)) cache.set(name, fetch(`${BASE}${name}-light.svg`).then(r => (r.ok ? r.text() : Promise.reject())));
  return cache.get(name);
}

export async function hydrateIcons(root = document) {
  await Promise.all([...root.querySelectorAll('.anim-icon[data-icon]')].map(async el => {
    try {
      const svg = await load(el.dataset.icon);
      el.innerHTML = svg;
      // pathLength="1"：不用量外框有多長，虛線長度 1 就是一整圈（同練習「按鈕動效八款」的描邊）
      el.querySelectorAll('path').forEach(p => p.setAttribute('pathLength', '1'));
      el.classList.add('is-svg');
    } catch {}
  }));
}

// 描邊 → 填滿：細線沿著外框畫一圈，畫完再把形狀填滿、細線淡掉
export function drawIcon(el, { delay = 0 } = {}) {
  const paths = el.querySelectorAll('path');
  if (!window.gsap || !paths.length || reduce()) return null;
  return gsap.timeline({ delay })
    .fromTo(paths, { strokeDashoffset: 1, strokeOpacity: 1, fillOpacity: 0 },
      { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: 0.12 })
    .to(paths, { fillOpacity: 1, duration: 0.35, ease: 'power1.out' }, '-=0.25')
    .to(paths, { strokeOpacity: 0, duration: 0.3 }, '<0.15')
    .add(() => playMotion(el), '-=0.1');
}

// 每個圖示自己的小動作（只動 transform，很輕）
export function playMotion(el) {
  if (!window.gsap || reduce()) return;
  const target = el.firstElementChild || el;
  gsap.killTweensOf(target);
  gsap.set(target, { transformOrigin: '50% 50%' });
  switch (el.dataset.motion) {
    case 'blink': // 眼睛眨一下
      gsap.timeline().to(target, { scaleY: 0.08, duration: 0.12, ease: 'power2.in' }).to(target, { scaleY: 1, duration: 0.3, ease: 'back.out(2.5)' });
      break;
    case 'ring': // 鈴鐺從上面的掛點左右搖
      gsap.fromTo(target, { rotation: 0 }, { keyframes: { rotation: [-18, 14, -9, 5, 0] }, duration: 0.8, ease: 'power1.out', transformOrigin: '50% 12%' });
      break;
    case 'wiggle': // 筆、文字：左右晃
      gsap.fromTo(target, { rotation: 0 }, { keyframes: { rotation: [-12, 9, -5, 0] }, duration: 0.6, ease: 'power1.out' });
      break;
    case 'nudge': // 往右推一下再回來
      gsap.fromTo(target, { x: 0 }, { keyframes: { x: ['-12%', '10%', 0] }, duration: 0.55, ease: 'power2.out' });
      break;
    case 'lift': // 往上浮起再落下
      gsap.fromTo(target, { y: 0 }, { keyframes: { y: ['-16%', 0] }, duration: 0.6, ease: 'expo.out' });
      break;
    case 'turn': // 轉半圈
      gsap.fromTo(target, { rotation: 0 }, { rotation: 180, duration: 0.8, ease: 'expo.inOut' });
      break;
    case 'split': // 四格：轉 90 度、縮放一下
      gsap.fromTo(target, { rotation: 0, scale: 1 }, { keyframes: { rotation: [0, 90], scale: [0.8, 1] }, duration: 0.7, ease: 'expo.out' });
      break;
    default: // 彈一下
      gsap.fromTo(target, { scale: 0.7 }, { scale: 1, duration: 0.6, ease: 'back.out(3)' });
  }
}
