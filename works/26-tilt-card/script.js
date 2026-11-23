// ── 試著改這幾個數字 ──
const MAX_TILT = 14;   // 最多傾斜幾度
const FOLLOW = 0.5;    // 跟上滑鼠要幾秒（越大越「沉」）

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const card = document.querySelector('.card');
const glare = card.querySelector('.glare');

// 只在有滑鼠、沒開「減少動態」時啟用（手機沒有「游標在卡片上」這件事）
if (!reduce && window.matchMedia('(hover: hover)').matches) {
  // quickTo：先建立好「只改某一個屬性」的補間，之後滑鼠每動一次只丟新數值進去
  const rotX = gsap.quickTo(card, 'rotationX', { duration: FOLLOW, ease: 'power3.out' });
  const rotY = gsap.quickTo(card, 'rotationY', { duration: FOLLOW, ease: 'power3.out' });
  const glX = gsap.quickTo(glare, 'xPercent', { duration: FOLLOW, ease: 'power3.out' });
  const glY = gsap.quickTo(glare, 'yPercent', { duration: FOLLOW, ease: 'power3.out' });

  // 滑鼠在卡片上的位置換算成 -0.5 ～ 0.5（正中間是 0）
  // 用外層 .scene（不會轉動）的位置來算：卡片轉動後自己的外框會變大變形，從角落滑入時會算錯
  const scene = card.parentElement;
  const point = e => {
    const r = scene.getBoundingClientRect();
    return { px: (e.clientX - r.left) / r.width - 0.5, py: (e.clientY - r.top) / r.height - 0.5 };
  };
  // 光斑是卡片的 2 倍大（inset: -50%），所以移動「卡片寬度 × px」= 自己寬度的 px × 50%
  const GLARE = 50;

  card.addEventListener('pointermove', e => {
    const { px, py } = point(e);
    rotY(px * MAX_TILT * 2);     // 左右移動 → 繞 Y 軸轉
    rotX(-py * MAX_TILT * 2);    // 上下移動 → 繞 X 軸轉（加負號：滑鼠在上面時，卡片上緣往後倒）
    glX(px * GLARE);
    glY(py * GLARE);
  });
  card.addEventListener('pointerenter', e => {
    // 一進來就把光斑放在游標的位置（quickTo 第二個值是起點：起點＝終點就是直接跳過去），再淡入
    // 不這樣做的話，光斑會從上一次的位置（通常是正中央）滑過來
    const { px, py } = point(e);
    gsap.killTweensOf(glare); // 停掉「離開時回到中央」的動畫，不然它會把光斑拉回正中間
    glX(px * GLARE, px * GLARE);
    glY(py * GLARE, py * GLARE);
    gsap.to(glare, { opacity: 1, duration: 0.4 });
  });
  card.addEventListener('pointerleave', () => {
    // 離開：慢慢回正
    gsap.to(card, { rotationX: 0, rotationY: 0, duration: 1, ease: 'expo.out' });
    gsap.to(glare, { opacity: 0, duration: 0.4 }); // 只淡出、位置不動：下次進來時直接從游標的位置出現
  });

  // ── 自動示範一次（首頁縮圖也看得到動態）：左右輕輕晃一下再回正 ──
  gsap.timeline({ delay: 0.8 })
    .to(card, { rotationY: 12, rotationX: 6, duration: 0.8, ease: 'power2.inOut' })
    .to(card, { rotationY: -10, rotationX: -4, duration: 1, ease: 'power2.inOut' })
    .to(card, { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'expo.out' });
}
