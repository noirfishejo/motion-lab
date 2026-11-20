// 尊重「減少動態」設定
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduce) {
  gsap.from('.box', { y: 48, opacity: 0, duration: 1.2, ease: 'expo.out' });
}
