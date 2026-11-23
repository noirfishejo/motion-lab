// ── 試著改這幾個數字 ──
const DURATION = 1.6;   // 數字跳完要幾秒
const STAGGER = 0.12;   // 三個數字之間差幾秒開始

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const values = [...document.querySelectorAll('.stat-value')];

// 依格式顯示：12,480／$84,230／3.6%（Intl.NumberFormat 會自動加千分位）
const FORMATS = {
  number: new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }),
  currency: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }),
  percent: new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })
};
const show = (el, n) => {
  const format = el.dataset.format;
  el.textContent = FORMATS[format].format(n) + (format === 'percent' ? '%' : '');
};

// 每個數字記住「目前顯示的值」，下一次從這裡跳到新的值（不會每次都從 0 開始）
const counters = values.map(el => ({ el, n: 0 }));

function countTo(targets) {
  counters.forEach((c, i) => {
    const to = targets[i];
    if (reduce) { c.n = to; show(c.el, to); return; }
    // 補間的對象是一個普通物件 c，不是畫面上的元素：GSAP 改 c.n，onUpdate 再把它寫成文字
    gsap.to(c, {
      n: to,
      duration: DURATION,
      delay: i * STAGGER,
      ease: 'expo.out',             // 一開始跳很快、最後慢慢停在正確的數字上
      overwrite: true,
      onUpdate: () => show(c.el, c.n)
    });
  });
}

// 第一次：從 0 跳到 HTML 裡寫的目標數字
countTo(values.map(el => parseFloat(el.dataset.value)));

// Refresh：換成新的假資料，從目前的值跳過去
document.querySelector('.refresh').addEventListener('click', () => {
  countTo([
    Math.round(9000 + Math.random() * 8000),
    Math.round(60000 + Math.random() * 40000),
    Math.round((2 + Math.random() * 3) * 10) / 10
  ]);
});
