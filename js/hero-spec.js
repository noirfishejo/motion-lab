// ═══════════════════════════════════════════════
// 首頁開場的聚光燈（同練習「聚光燈揭露」）
// 游標像手電筒：照到的地方露出開場「背後的數值」：格線、標題尺寸、上下緣參考線、
// 進場用的 ease 曲線和程式碼。規格層背景透明，原本的標題動畫照常看得到。
// 只給有滑鼠的電腦和平板（觸控沒有「停在上面」，規格層在 CSS 裡也是藏起來的）
// ═══════════════════════════════════════════════
import { t } from './i18n.js';
import { WORKS, TOPICS } from './works.js';

// 手電筒照到的半徑（px）：跟著畫面寬度，大螢幕照得比較大（160～280）
const radius = () => Math.max(160, Math.min(280, innerWidth * 0.18));
const FOLLOW = 0.35; // 光圈跟上游標要幾秒：越大越「拖」

const usable = () => matchMedia('(hover: hover) and (pointer: fine) and (min-width: 600px)').matches;
const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHeroSpec() {
  const pin = document.querySelector('.hero-pin');
  const spec = pin?.querySelector('.hero-spec');
  if (!spec || !window.gsap) return { sweep() {} };

  const $ = sel => spec.querySelector(sel);
  const lockup = pin.querySelector('.hero-lockup');
  const square = pin.querySelector('.hero-square');
  const xy = $('.spec-xy');
  const dur = s => (reduce() ? 0 : s);

  $('.spec-meta').textContent = t('home.spec.meta', { works: WORKS.length, topics: TOPICS.length });

  // ease 曲線：直接取樣 GSAP 的 expo.out，畫出來的就是開場真正用的曲線
  const ease = gsap.parseEase('expo.out');
  $('.ease-curve').setAttribute('d', Array.from({ length: 41 }, (_, i) => {
    const p = i / 40;
    return `${i ? 'L' : 'M'}${(p * 120).toFixed(1)} ${(72 - ease(p) * 72).toFixed(1)}`;
  }).join(''));

  // 依標題的實際位置擺標註（offsetLeft/Top 不受動畫中的位移影響；三者的 offsetParent 都是 .hero-pin）
  function layout() {
    const L = lockup.offsetLeft, T = lockup.offsetTop, W = lockup.offsetWidth, H = lockup.offsetHeight;
    const set = (sel, css) => Object.assign($(sel).style, css);
    set('.spec-box', { left: `${L}px`, top: `${T}px`, width: `${W}px`, height: `${H}px` });
    set('.spec-cap', { top: `${T}px` });
    set('.spec-base', { top: `${T + H}px` });
    $('.spec-size').textContent = `W ${W} × H ${H}`;
    set('.spec-size', { left: `${L}px`, top: `${T - 26}px` });
    set('.spec-chars', { left: `${L + W}px`, top: `${T - 26}px`, transform: 'translateX(-100%)' });
    set('.spec-square', { left: `${square.offsetLeft}px`, top: `${T + H + 8}px` });
  }
  layout();
  // 視窗大小改變：停下 0.12 秒再重排一次，不要每一格都量
  let timer;
  new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(layout, 120); }).observe(pin);

  // 光圈位置：quickTo 只建一次補間，游標每動一下只更新終點
  const toX = gsap.quickTo(spec, '--x', { duration: dur(FOLLOW), ease: 'power3' });
  const toY = gsap.quickTo(spec, '--y', { duration: dur(FOLLOW), ease: 'power3' });
  const open = () => gsap.to(spec, { '--r': radius(), duration: dur(0.5), ease: 'expo.out', overwrite: 'auto' });
  const close = () => gsap.to(spec, { '--r': 0, duration: dur(0.4), ease: 'power2.in', overwrite: 'auto' });
  let rect = null; // 開場區的位置：游標進來時量一次，移動時不再讀版面
  const local = e => [Math.round(e.clientX - rect.left), Math.round(e.clientY - rect.top)];

  let demo = null;
  const stopDemo = () => { demo?.kill(); demo = null; };

  pin.addEventListener('pointerenter', e => {
    if (e.pointerType !== 'mouse' || !usable()) return;
    stopDemo();
    rect = pin.getBoundingClientRect();
    const [x, y] = local(e);
    gsap.set(spec, { '--x': x, '--y': y }); // 進來的那一刻光圈直接在游標上，不要從上次離開的地方滑過來
    open();
  });
  pin.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || !rect) return;
    const [x, y] = local(e);
    toX(x); toY(y);
    xy.textContent = `x ${x} · y ${y}`;
  });
  pin.addEventListener('pointerleave', () => { rect = null; close(); });
  // 捲動時開場區會移動：重新量位置（下次移動時才用到），光圈收起來
  addEventListener('scroll', () => { if (rect) { rect = null; close(); } }, { passive: true });

  return {
    // 開場播完後示範一次：光圈從方塊掃過標題再收起，讓人知道這裡藏了東西
    sweep() {
      if (reduce() || !usable() || rect) return;
      demo = gsap.context(() => {
        const y = lockup.offsetTop + lockup.offsetHeight / 2;
        gsap.set(spec, { '--x': square.offsetLeft, '--y': y });
        gsap.timeline({ delay: 0.3 })
          .add(open)
          .to(spec, { '--x': lockup.offsetLeft + lockup.offsetWidth, duration: 1.6, ease: 'power1.inOut' }, 0.1)
          .add(close, '-=0.2');
      });
      // 自己動手（按滑鼠、鍵盤或捲動）就停掉示範，光圈收起來
      const stop = () => { if (demo) { stopDemo(); close(); } };
      ['pointerdown', 'keydown', 'wheel'].forEach(type => addEventListener(type, stop, { once: true, capture: true }));
    }
  };
}
