gsap.registerPlugin(ScrollTrigger);

// 是否顯示 markers：由作品頁預覽上方的開關決定（首頁縮圖預設不顯示）
const SHOW_MARKERS = window.SHOW_MARKERS ?? new URLSearchParams(location.search).has('markers');

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const visuals = [...document.querySelectorAll('.visual')];
const steps = [...document.querySelectorAll('.step')];
const dots = [...document.querySelectorAll('.dots i')];
let current = -1;

// 換到第 i 步：舊畫面往上淡出、新畫面從下面浮上來；右邊的步驟文字和下方的點同步
function show(i) {
  if (i === current) return;
  const dir = i > current ? 1 : -1;          // 往下捲：新的從下面來；往上捲：新的從上面來
  const prev = visuals[current];
  current = i;
  steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
  dots.forEach((d, n) => d.classList.toggle('on', n === i));
  if (reduce) { visuals.forEach((v, n) => gsap.set(v, { autoAlpha: n === i ? 1 : 0, y: 0 })); return; }
  if (prev) gsap.to(prev, { autoAlpha: 0, y: -40 * dir, duration: 0.4, ease: 'power2.in', overwrite: true });
  gsap.fromTo(visuals[i], { autoAlpha: 0, y: 40 * dir }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out', overwrite: true, delay: prev ? 0.1 : 0 });
}

// 一開始只顯示第一步
gsap.set(visuals, { autoAlpha: 0 });
show(0);

// 每一步：它的中間經過畫面中間時，就換成這一步（往回捲也一樣）
steps.forEach((step, i) => {
  ScrollTrigger.create({
    trigger: step,
    start: 'top center',
    end: 'bottom center',
    onToggle: self => { if (self.isActive) show(i); },
    markers: SHOW_MARKERS && i === 0
  });
});
