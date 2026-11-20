// ═══════════════════════════════════════════════
// 平滑捲動（Lenis）：滾輪停下後頁面還會微微滑行一下再停，參考 santalarch.com
// · 只影響滑鼠滾輪／觸控板；手機的手指滑動維持系統原生的慣性
// · 開啟「減少動態」時不啟用
// · 程式碼編輯器、側欄清單、篩選列這些「自己會捲」的區塊不套用，避免搶捲動
// ═══════════════════════════════════════════════
const LERP = 0.085; // 每一格畫面追上目標的比例：越小飄得越久（0.05～0.15 之間調）

export function initSmooth() {
  if (!window.Lenis || matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const lenis = new Lenis({
    lerp: LERP,
    smoothWheel: true,
    prevent: node => !!node.closest?.('.CodeMirror, .works-nav-list, .filters, [data-lenis-prevent]')
  });

  // 用 GSAP 的計時器驅動，和 ScrollTrigger 同步（首頁的開場、作品進場都靠它）
  if (window.gsap) {
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
  } else {
    const loop = time => { lenis.raf(time); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  window.__lenis = lenis; // 其他程式（回到頂部、全螢幕）要暫停或捲動時使用
  return lenis;
}

// 捲到指定位置：有 Lenis 就交給它（才不會兩邊打架），沒有就用原生的
export function scrollToY(y, { immediate = false } = {}) {
  if (window.__lenis) window.__lenis.scrollTo(y, { immediate });
  else window.scrollTo({ top: y, behavior: immediate ? 'auto' : 'smooth' });
}
