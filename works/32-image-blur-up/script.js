// ── 試著改這兩個數字 ──
const BLUR = 24;       // 預覽圖模糊多少 px
const REVEAL = 0.9;    // 從模糊變清楚要幾秒

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('.photo').forEach(photo => {
  const art = photo.querySelector('.art-img'); // 動的是裡面的圖，外框負責裁切
  // ① 還在載入：很模糊、稍微放大（放大是為了藏住模糊造成的邊緣淡出）、有點透明
  gsap.set(art, { filter: `blur(${BLUR}px)`, scale: 1.15, opacity: 0.7 });

  // ② 假裝圖片載入完成：真實情況是 <img> 的 load 事件（img.addEventListener('load', …)）
  const loaded = () => {
    if (reduce) { gsap.set(art, { filter: 'blur(0px)', scale: 1, opacity: 1 }); return; }
    gsap.to(art, { filter: 'blur(0px)', scale: 1, opacity: 1, duration: REVEAL, ease: 'expo.out' });
  };
  // 每張圖片載入時間不同（data-load 秒數），所以會一張一張變清楚
  gsap.delayedCall(parseFloat(photo.dataset.load), loaded);
});
