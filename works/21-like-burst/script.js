// ── 試著改這幾個數字 ──
const PARTICLES = 10;   // 噴出幾顆粒子
const DISTANCE = 34;    // 粒子飛多遠（px），每顆會再隨機 ±30%
const POP = 1.35;       // 愛心按下時先放大到幾倍

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const btn = document.querySelector('.like');
const iconOn = btn.querySelector('.icon-on');
const iconOff = btn.querySelector('.icon-off');
const burst = btn.querySelector('.burst');
const countEl = document.querySelector('.count-num');
const photo = document.querySelector('.photo');
const bigHeart = document.querySelector('.big-heart');
let liked = false;
let count = parseInt(countEl.textContent, 10);

function setLiked(next) {
  liked = next;
  btn.setAttribute('aria-pressed', liked);   // 讀屏軟體會唸出「已按下」
  count += liked ? 1 : -1;
  countEl.textContent = count;

  if (reduce) { gsap.set(iconOn, { opacity: liked ? 1 : 0, scale: 1 }); return; }

  if (liked) {
    // ① 實心愛心從 0 彈出：先放大超過一點，再回到原尺寸（back.out 的「超過再回來」）
    gsap.timeline()
      .to(iconOff, { scale: 0, duration: 0.15, ease: 'power2.in' })
      .fromTo(iconOn, { scale: 0, opacity: 1 }, { scale: POP, duration: 0.2, ease: 'power2.out' }, 0.05)
      .to(iconOn, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
    // ② 同時：外框方塊擴散、粒子往四周噴
    explode();
    // ③ 數字往上滾一格
    gsap.fromTo(countEl, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'expo.out' });
  } else {
    // 取消：安靜地縮回空心，不噴粒子（取消不需要慶祝）
    gsap.timeline()
      .to(iconOn, { scale: 0, duration: 0.2, ease: 'power2.in' })
      .fromTo(iconOff, { scale: 0.6 }, { scale: 1, duration: 0.4, ease: 'expo.out' });
  }
}

// 粒子：沿著圓周平均分佈的角度往外飛，同時縮小、旋轉、淡出；飛完就移除
function explode() {
  const ring = document.createElement('span');
  ring.className = 'ring';
  burst.append(ring);
  gsap.fromTo(ring, { scale: 0.3, opacity: 1 }, { scale: 2.4, opacity: 0, duration: 0.5, ease: 'expo.out', onComplete: () => ring.remove() });

  for (let i = 0; i < PARTICLES; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    burst.append(p);
    const angle = (i / PARTICLES) * Math.PI * 2 + gsap.utils.random(-0.2, 0.2);
    const dist = DISTANCE * gsap.utils.random(0.7, 1.3);
    gsap.fromTo(p,
      { x: 0, y: 0, scale: gsap.utils.random(0.6, 1.2), rotation: 0, opacity: 1 },
      {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        rotation: gsap.utils.random(-180, 180),
        scale: 0,
        duration: gsap.utils.random(0.5, 0.8),
        ease: 'expo.out',
        onComplete: () => p.remove()
      });
  }
}

btn.addEventListener('click', () => setLiked(!liked));

// 在圖片上點兩下：中間跳出大愛心，而且只會「按讚」不會「取消」（和 Instagram 一樣）
photo.addEventListener('dblclick', () => {
  if (!liked) setLiked(true);
  if (reduce) return;
  gsap.timeline()
    .fromTo(bigHeart, { scale: 0, opacity: 1 }, { scale: 1.15, duration: 0.25, ease: 'power2.out' })
    .to(bigHeart, { scale: 1, duration: 0.3, ease: 'back.out(3)' })
    .to(bigHeart, { scale: 0.6, opacity: 0, duration: 0.3, ease: 'power2.in' }, '+=0.35');
});

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
// ── 自動示範一次（首頁縮圖也看得到動態） ──
if (!reduce) gsap.delayedCall(0.8, () => setLiked(true));
// #endregion demo
