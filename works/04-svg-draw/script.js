gsap.registerPlugin(DrawSVGPlugin);

// ── 試著改這兩個數字 ──
const DRAW = 1.2;  // 圓要畫多久（秒）；眼睛和微笑會依比例縮短
const GAP = 0.15;  // 每一筆之間停多久（秒）

// drawSVG: 0 → 線條長度 0（還沒畫）；drawSVG: '100%' → 整條畫完
gsap.set('.smiley *', { drawSVG: 0 });

// 每一筆前面放一個 label（書籤），點步驟按鈕時就從那個 label 開始播
const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, delay: 0.3, onUpdate: updateSteps });

tl.addLabel('face')
  .to('.face', { drawSVG: '100%', duration: DRAW })                                    // 1. 圓：從正上方順時針畫一圈
  .addLabel('left', `+=${GAP}`)
  .to('.eye-left', { drawSVG: '100%', duration: DRAW * 0.35, ease: 'power1.inOut' }, 'left')   // 2. 左眼
  .addLabel('right', `+=${GAP}`)
  .to('.eye-right', { drawSVG: '100%', duration: DRAW * 0.35, ease: 'power1.inOut' }, 'right') // 3. 右眼
  .addLabel('smile', `+=${GAP}`)
  .to('.smile', { drawSVG: '100%', duration: DRAW * 0.6 }, 'smile');                   // 4. 微笑：從左嘴角畫到右嘴角

// ── 步驟按鈕 ──
const buttons = [...document.querySelectorAll('.steps button')];

// 點擊：跳到那個 label 繼續播放
// （之前的筆畫會直接顯示成畫好的樣子，之後的筆畫會清空重畫）
buttons.forEach(btn => btn.addEventListener('click', () => tl.play(btn.dataset.step)));

// 依照目前的播放時間，決定每個按鈕是「正在畫」「畫完」還是「還沒畫」
function updateSteps() {
  const t = tl.time();
  buttons.forEach((btn, i) => {
    const start = tl.labels[btn.dataset.step];
    const next = buttons[i + 1] ? tl.labels[buttons[i + 1].dataset.step] : tl.duration();
    const finished = tl.progress() === 1;
    btn.classList.toggle('on', !finished && t >= start && t < next);
    btn.classList.toggle('done', finished ? true : t >= next);
  });
}

// 尊重「減少動態」設定：直接顯示畫好的圖示
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  tl.progress(1);
}
