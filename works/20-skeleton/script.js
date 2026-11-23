// ── 試著改這幾個數字 ──
const LOAD_TIME = 1.8;   // 假裝資料要載入幾秒
const SWEEP = 1.6;       // 光澤從左上掃到右下要幾秒
const PAUSE = 0.4;       // 兩次之間停多久

// 假資料：三篇文章
const POSTS = [
  { title: 'Designing for the first five seconds', text: 'What people notice before they read a single word.', tone: 1 },
  { title: 'Motion tokens in practice', text: 'Durations and easings that a whole team can share.', tone: 2 },
  { title: 'When not to animate', text: 'Speed, focus and the cost of every extra frame.', tone: 3 }
];

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const feed = document.querySelector('.feed');
const template = document.getElementById('card-template');
let shimmer;
let pending; // 等待中的「資料回來」

function load() {
  shimmer?.kill();
  pending?.kill(); // 再載入一次時：取消上一次的等待
  feed.setAttribute('aria-busy', 'true');
  feed.replaceChildren(...POSTS.map(() => template.content.firstElementChild.cloneNode(true)));

  // 光澤：所有骨架用同一段動畫一起掃，看起來像同一道光；減少動態時不掃（骨架靜止）
  if (!reduce) {
    // 背景位置 100% → 0%：整張漸層往右下移，光就從畫面左上掃到右下（見 style.css）
    shimmer = gsap.fromTo('.shine',
      { backgroundPosition: '100% 100%' },
      { backgroundPosition: '0% 0%', duration: SWEEP, ease: 'none', repeat: -1, repeatDelay: PAUSE });
  }

  // 假裝等資料：真實情況是 fetch() 回來之後才呼叫 reveal()
  pending = gsap.delayedCall(LOAD_TIME, () => {
    // 資料回來時，光如果正掃到一半，等它掃完這一趟才換內容（不會停在中間突然消失）
    const t = shimmer ? shimmer.time() : SWEEP;
    pending = gsap.delayedCall(t < SWEEP ? SWEEP - t : 0, reveal);
  });
}

function reveal() {
  const cards = [...feed.children];
  cards.forEach((card, i) => {
    const post = POSTS[i];
    const content = card.querySelector('.content');
    content.querySelector('.media').dataset.tone = post.tone;
    content.querySelector('.title').textContent = post.title;
    content.querySelector('.text').textContent = post.text;
    content.hidden = false;
  });
  feed.setAttribute('aria-busy', 'false'); // 讀屏軟體：載入完成，可以唸內容了

  const skeletons = feed.querySelectorAll('.skeleton');
  const contents = feed.querySelectorAll('.content');
  if (reduce) { skeletons.forEach(s => s.remove()); shimmer?.kill(); return; }

  // 骨架淡出、真實內容由左到右依序浮現（同一張卡片裡：圖片 → 標題 → 內文）
  gsap.timeline({ onComplete: () => { shimmer.kill(); skeletons.forEach(s => s.remove()); } })
    .to(skeletons, { opacity: 0, duration: 0.3, stagger: 0.1, ease: 'power1.out' })
    .from(contents, { opacity: 0, duration: 0.3, stagger: 0.1 }, 0)
    .from(feed.querySelectorAll('.content > *'), { y: 12, opacity: 0, duration: 0.6, stagger: 0.05, ease: 'expo.out' }, 0.05);
}

load();
