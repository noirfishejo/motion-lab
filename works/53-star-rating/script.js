// ── 試著改這幾個數字 ──
const STAGGER = 0.04;  // 星星依序亮起，每顆差幾秒
const POP = 1.35;      // 選定那顆星彈起來的大小

const WORDS = ['Tap a star', 'Poor', 'Fair', 'Good', 'Great', 'Loved it'];
const stars = [...document.querySelectorAll('.star')];
const fills = stars.map(s => s.querySelector('.fill'));
const radios = [...document.querySelectorAll('.stars input')];
const word = document.querySelector('.word');
const wordIn = word.querySelector('.word-in');
const status = document.getElementById('status');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const dur = s => (reduce ? 0 : s);

let value = 0;   // 選定的分數（0 = 還沒選）
let shown = 0;   // 畫面上目前亮到第幾顆

// 亮到第 n 顆：從左到右依序放大；要熄掉的從右到左依序縮小（方向跟著手的移動）
function show(n) {
  if (n === shown) return;
  const on = fills.slice(0, n), off = fills.slice(n);
  gsap.to(on, { scale: 1, duration: dur(0.35), ease: 'back.out(2.5)', stagger: STAGGER, overwrite: 'auto' });
  gsap.to(off, { scale: 0, duration: dur(0.2), ease: 'power2.in', stagger: { each: STAGGER / 2, from: 'end' }, overwrite: 'auto' });
  shown = n;
  setWord(n);
}

// 文字換掉：舊字往上滑出、新字從下面滑進來
let currentWord = WORDS[0];
function setWord(n) {
  const text = WORDS[n];
  if (text === currentWord) return;
  currentWord = text;
  gsap.timeline({ overwrite: true })
    .to(wordIn, { yPercent: -100, duration: dur(0.15), ease: 'power2.in' })
    .add(() => { wordIn.textContent = text; word.classList.toggle('is-set', n > 0); })
    .fromTo(wordIn, { yPercent: 100 }, { yPercent: 0, duration: dur(0.3), ease: 'expo.out' });
}

// 選定：選中的那顆彈一下（放大＋轉一點再回正），前面亮著的星星跟著小跳一下
function choose(n) {
  value = n;
  show(n);
  gsap.fromTo(fills[n - 1], { scale: POP, rotation: -18 }, { scale: 1, rotation: 0, duration: dur(0.7), ease: 'elastic.out(1, 0.4)', overwrite: true });
  gsap.fromTo(stars.slice(0, n - 1), { y: 0 }, { keyframes: [{ y: -6, duration: dur(0.12), ease: 'power2.out' }, { y: 0, duration: dur(0.3), ease: 'bounce.out' }], stagger: STAGGER });
  status.textContent = `Rated ${n} of 5, ${WORDS[n]}`;
}

// 滑鼠：滑過預覽，離開回到選定的分數（觸控沒有「滑過」，只在 mouse 時預覽）
stars.forEach((star, i) => {
  star.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') show(i + 1); });
});
document.querySelector('.stars').addEventListener('pointerleave', () => show(value));
// 點擊、鍵盤方向鍵：都會觸發 radio 的 change
radios.forEach((r, i) => r.addEventListener('change', () => choose(i + 1)));

// #region demo（複製時會自動拿掉這一段：只是載入後自己播一次給你看）
const demo = gsap.context(() => {
  if (reduce) return;
  gsap.timeline({ delay: 0.7 })
    .add(() => show(2))
    .add(() => show(5), '+=0.5')
    .add(() => { radios[3].checked = true; choose(4); }, '+=0.6');
});
// 自己動手（按滑鼠或鍵盤）就停掉示範，免得和你的操作互搶
['pointerdown', 'keydown'].forEach(type => addEventListener(type, () => demo.kill(), { once: true }));
// #endregion demo
