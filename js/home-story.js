// ═══════════════════════════════════════════════
// 首頁開場之後的介紹段落（參考 gsap.com 首頁：先說是什麼，再說能做什麼，最後導向各個分頁）
// 1. 是什麼：一段大字，捲動時一個詞一個詞亮起來，下面是練習數字
// 2. 方法：五個步驟排在一把尺上（和頁首選單同一種尺規），捲動時亮線往右走、圖示依序畫出來
// 3. 依用途找：七個分類＋全部作品，點了進作品頁並帶入那個分類
// 4. 最新練習：最近的 6 個
// 5. 工具：動態規範、Ease 實驗室
// 動態只放在「有意義」的地方：大字亮起（閱讀節奏）、尺規（步驟順序）、圖示（各自代表的事）；標題和卡片不另外淡入
// ═══════════════════════════════════════════════
import { t, pick } from './i18n.js';
import { WORKS, TOPICS } from './works.js';
import { STATEMENT, METHOD, TOPICS_INTRO, LATEST, TOOLS } from './home-data.js';
import { iconSlot, hydrateIcons, drawIcon, playMotion } from './icons.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const head = (title, id) => `<div class="story-head"><h2 id="${id}">${esc(pick(title))}</h2></div>`;
const thumbSrc = id => `works/${id}/thumb-${document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'}.jpg`;
const arrow = '<i class="ph-light ph-arrow-right card-arrow" aria-hidden="true"></i>';

export function renderStory() {
  const box = document.getElementById('story');
  if (!box) return;
  const stats = [
    [WORKS.length, t('about.stat.works')],
    [TOPICS.length, t('about.stat.topics')],
    [new Set(WORKS.map(w => w.tech)).size, t('about.stat.tech')]
  ];
  const latest = [...WORKS].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)).slice(0, LATEST.count);
  const topicCount = k => WORKS.filter(w => w.topic === k).length;

  box.innerHTML = `
  <section class="story-section story-statement container" aria-labelledby="story-about">
    <h2 class="statement" id="story-about">${esc(pick(STATEMENT.text))}</h2>
    <dl class="stats">${stats.map(([n, label]) => `<div><dt>${esc(label)}</dt><dd data-count="${n}">${n}</dd></div>`).join('')}</dl>
  </section>

  <section class="story-section container" aria-labelledby="story-method">
    ${head(METHOD.title, 'story-method')}
    <div class="method">
    <span class="method-rail" aria-hidden="true"><span class="method-fill"></span></span>
    <ol class="method-steps">
      ${METHOD.steps.map((s, i) => `
      <li class="method-step">
        ${iconSlot(s.icon, s.motion)}
        <span class="method-num">${String(i + 1).padStart(2, '0')}</span>
        <h3>${esc(pick(s.title))}</h3>
        <p>${esc(pick(s.text))}</p>
      </li>`).join('')}
    </ol>
    </div>
  </section>

  <section class="story-section container" aria-labelledby="story-topics">
    ${head(TOPICS_INTRO.title, 'story-topics')}
    <ul class="topic-grid">
      ${TOPICS.map(k => { const it = TOPICS_INTRO.items[k]; return `
      <li><a class="story-card" href="works.html?topic=${k}">
        ${iconSlot(it.icon, it.motion)}
        <span class="card-title">${esc(t(`topic.${k}`))}<sup>${topicCount(k)}</sup></span>
        <span class="card-text">${esc(pick(it.text))}</span>${arrow}
      </a></li>`; }).join('')}
      <li><a class="story-card is-all" href="works.html">
        ${iconSlot(TOPICS_INTRO.all.icon, TOPICS_INTRO.all.motion)}
        <span class="card-title">${esc(pick(TOPICS_INTRO.all.title))}<sup>${WORKS.length}</sup></span>
        <span class="card-text">${esc(pick(TOPICS_INTRO.all.text))}</span>${arrow}
      </a></li>
    </ul>
  </section>

  <section class="story-section story-latest container" aria-labelledby="story-latest">
    <div class="story-head-row">
      ${head(LATEST.title, 'story-latest')}
      <a class="btn btn-ghost" href="works.html"><span>${esc(pick(LATEST.cta))}</span><i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
    </div>
    <ul class="latest-grid">
      ${latest.map(w => `
      <li><a class="latest-card" href="work.html?id=${w.id}" data-short="${esc(pick(w.short || w.title))}" data-summary="${esc(pick(w.summary))}">
        <span class="latest-thumb"><img src="${thumbSrc(w.id)}" data-id="${w.id}" alt="" width="1200" height="750" loading="lazy" decoding="async"></span>
        <span class="latest-meta"><span class="latest-name">${esc(pick(w.title))}</span><span class="latest-tech">${esc(w.tech)}</span></span>
      </a></li>`).join('')}
    </ul>
  </section>

  <section class="story-section container" aria-labelledby="story-tools">
    ${head(TOOLS.title, 'story-tools')}
    <ul class="tool-grid">
      ${TOOLS.items.map(it => `
      <li><a class="story-card tool-card" href="${it.href}">
        ${iconSlot(it.icon, it.motion)}
        <span class="card-title">${esc(t(it.titleKey))}</span>
        <span class="card-text">${esc(pick(it.text))}</span>${arrow}
      </a></li>`).join('')}
    </ul>
  </section>`;

  document.addEventListener('themechange', () => box.querySelectorAll('.latest-thumb img').forEach(img => { img.src = thumbSrc(img.dataset.id); }));
  // 滑過卡片：圖示播自己的小動作
  box.querySelectorAll('.story-card, .method-step').forEach(card => {
    card.addEventListener('pointerenter', () => { const ic = card.querySelector('.anim-icon'); if (ic) playMotion(ic); });
  });
}

// 捲動相關的動態：要在字體載入、開場的 ScrollTrigger 建好之後才設定
// 原則（2026-11-25 改版）：不用 3D 轉角度，改用遮罩、視差和「向上覆蓋」；每一段的進場方式都不一樣，才有節奏變化
// · 向上覆蓋：一段捲完之後先停在原地，下一段像布幕一樣從下面蓋上來，被蓋住的那段慢慢變暗
// · 是什麼：大字一個字一個字亮起來；數字從遮罩下方升上來
// · 方法：亮線往右走，經過哪一步，那一步從左往右被「擦」出來、圖示畫出來
// · 依用途找：卡片分成幾欄，每一欄捲動的速度不同（視差），卡片從下緣的遮罩裡長出來
// · 最新練習：固定住橫向推進，縮圖從右邊擦進來、圖片本身比外框慢一點（視差）
// · 工具：兩張卡片從中間往上下打開（遮罩）
export async function initStoryMotion() {
  const box = document.getElementById('story');
  if (!box) return;
  await hydrateIcons(box);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || reduce) return;
  const small = matchMedia('(max-width: 599px)').matches;

  // ── 是什麼 ──
  const statement = box.querySelector('.statement');
  if (window.SplitText) {
    // 中文沒有空格，用「詞」拆會變成一大塊、換行也會亂掉 → 中文一個字一個字拆，英文一個詞一個詞拆
    const zh = document.documentElement.lang.startsWith('zh');
    const split = SplitText.create(statement, { type: zh ? 'chars' : 'words' });
    gsap.fromTo(zh ? split.chars : split.words, { opacity: 0.14 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 40%', scrub: 0.5 }
    });
  }
  // 數字：每個數字外面包一層遮罩，數字從遮罩下方升上來，同時從 0 數上來
  box.querySelectorAll('[data-count]').forEach((dd, i) => {
    const n = +dd.dataset.count, o = { v: 0 };
    dd.innerHTML = `<span class="mask-line"><span>0</span></span>`;
    const inner = dd.firstElementChild.firstElementChild;
    gsap.timeline({ scrollTrigger: { trigger: dd, start: 'top 88%', once: true }, delay: i * 0.12 })
      .from(inner, { yPercent: 110, duration: 1, ease: 'expo.out' })
      .to(o, { v: n, duration: 1.4, ease: 'expo.out', onUpdate: () => { inner.textContent = Math.round(o.v); } }, 0);
  });

  // ── 方法：亮線往右走，經過哪一步，那一步被擦出來 ──
  const method = box.querySelector('.method');
  const steps = [...method.querySelectorAll('.method-step')];
  const axis = small ? 'scaleY' : 'scaleX'; // 手機的尺是直的：亮線由上往下長
  const hidden = small ? 'inset(0 0 100% 0)' : 'inset(0 100% 0 0)'; // 手機由上往下擦、電腦由左往右擦
  gsap.set(steps, { clipPath: hidden });
  const shown = new Set();
  gsap.fromTo(method.querySelector('.method-fill'), { [axis]: 0 }, {
    [axis]: 1, ease: 'none',
    scrollTrigger: {
      trigger: method, start: 'top 70%', end: 'bottom 55%', scrub: 0.6,
      onUpdate: self => steps.forEach((s, i) => {
        if (self.progress >= i / steps.length && !shown.has(i)) {
          shown.add(i);
          s.classList.add('is-on');
          gsap.to(s, { clipPath: 'inset(0 0% 0% 0)', duration: 0.9, ease: 'expo.out' });
          drawIcon(s.querySelector('.anim-icon'), { delay: 0.15 });
        }
      })
    }
  });

  // ── 依用途找：每一欄捲動的速度不同（視差），卡片從下緣的遮罩長出來 ──
  const grid = box.querySelector('.topic-grid');
  const items = [...grid.children];
  const cols = () => getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  if (!small) {
    // 第 2、4 欄比較快、第 1、3 欄比較慢：捲動時格子錯開又對齊
    gsap.fromTo(items, { y: i => (i % cols() % 2 ? 120 : 40) }, {
      y: i => (i % cols() % 2 ? -40 : 0), ease: 'none',
      scrollTrigger: { trigger: grid, start: 'top bottom', end: 'bottom top', scrub: true, invalidateOnRefresh: true }
    });
  }
  ScrollTrigger.batch(grid.querySelectorAll('.story-card'), {
    start: 'top 92%', once: true,
    onEnter: batch => gsap.fromTo(batch, { clipPath: 'inset(100% 0 0 0)' }, {
      clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'expo.out', stagger: 0.08,
      onStart() { batch.forEach((c, i) => drawIcon(c.querySelector('.anim-icon'), { delay: 0.3 + i * 0.08 })); }
    })
  });

  // ── 最新練習 ──
  initLatestCarousel(box);

  // ── 工具：兩張卡片從中間往上下打開 ──
  const tools = [...box.querySelectorAll('.tool-card')];
  gsap.set(tools, { clipPath: 'inset(50% 0 50% 0)' });
  ScrollTrigger.create({
    trigger: box.querySelector('.tool-grid'), start: 'top 85%', once: true,
    onEnter: () => gsap.to(tools, { clipPath: 'inset(0% 0 0% 0)', duration: 1.2, ease: 'expo.inOut', stagger: 0.15,
      onComplete() { tools.forEach((c, i) => drawIcon(c.querySelector('.anim-icon'), { delay: i * 0.1 })); } })
  });

  // ── 向上覆蓋：一段捲完先停住，下一段從下面蓋上來（被蓋住的慢慢變暗） ──
  // 每一段都要有不透明的底色、後面的疊在前面上面（z-index，見 home.css）
  // 最新練習本身已經固定住橫向推進：外面再包一層（latest-wrap），橫向推完之後固定的是外層，下一段一樣蓋上來
  const layers = [...box.querySelectorAll('.story-section')];
  const layerOf = sec => sec.closest('.latest-wrap') || sec; // 固定住之後中間會多一層 pin-spacer，所以用 closest 找外層
  layers.forEach((sec, i) => { layerOf(sec).style.zIndex = i + 1; }); // 後面的段落疊在前面上面
  layers.forEach((sec, i) => {
    const next = layers[i + 1];
    if (!next) return;
    if (sec.classList.contains('story-latest')) {
      // 橫向推完的那一刻，外層的底部剛好在畫面底部：從這裡開始固定外層，讓下一段蓋上來
      ScrollTrigger.create({ trigger: layerOf(sec), start: 'bottom bottom', end: () => `+=${innerHeight}`, pin: true, pinSpacing: false, invalidateOnRefresh: true });
    } else ScrollTrigger.create({
      trigger: sec,
      // 比畫面矮的段落：頂端到畫面頂端就停住；比畫面高的：讀到底才停住
      start: () => (sec.offsetHeight <= innerHeight ? 'top top' : 'bottom bottom'),
      end: () => `+=${Math.min(sec.offsetHeight, innerHeight)}`,
      pin: true, pinSpacing: false, invalidateOnRefresh: true
    });
    gsap.fromTo(sec.querySelector('.story-dim') || sec.appendChild(Object.assign(document.createElement('span'), { className: 'story-dim' })),
      { opacity: 0 }, { opacity: 0.6, ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true } });
  });
}

// ── 最新練習：固定住、橫向推進的輪播 ───────────────
// 版面：上面一排很大的練習名稱（目前這個最亮，對齊畫面中線），中間一張縮圖，左邊是說明，右下角是 02 / 06
// 捲動時：名稱整排往左推、下一張縮圖從右邊擦進來；圖片本身比外框移動得慢（視差），擦進來時像從窗口後面滑出來
function initLatestCarousel(box) {
  const sec = box.querySelector('.story-latest');
  const list = [...sec.querySelectorAll('.latest-card')].map(a => ({
    href: a.getAttribute('href'), id: a.querySelector('img').dataset.id,
    name: a.dataset.short, summary: a.dataset.summary, tech: a.querySelector('.latest-tech').textContent,
    img: a.querySelector('img').getAttribute('src')
  }));
  const N = list.length;
  const grid = sec.querySelector('.latest-grid');
  const carousel = document.createElement('div');
  carousel.className = 'carousel';
  carousel.innerHTML = `
    <div class="carousel-titles" aria-hidden="true"><div class="carousel-track">${list.map((w, i) => `<a class="carousel-title" href="${w.href}" tabindex="-1" data-i="${i}">${esc(w.name)}</a>`).join('')}</div></div>
    <div class="carousel-body">
      <div class="carousel-info">
        <span class="carousel-tech"></span>
        <p class="carousel-summary"></p>
        <a class="carousel-open" href=""><span>${esc(pick(LATEST.open))}</span><i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
      </div>
      <a class="carousel-stage" href="" tabindex="-1" aria-hidden="true">${list.map((w, i) => `<img src="${w.img}" data-id="${w.id}" alt="" width="1200" height="750" style="z-index:${i}">`).join('')}</a>
      <p class="carousel-count"><span class="carousel-index">01</span> / ${String(N).padStart(2, '0')}</p>
    </div>`;
  // 外面包一層：橫向推完之後要固定的是這一層（見 initStoryMotion 的「向上覆蓋」）
  const wrap = document.createElement('div');
  wrap.className = 'latest-wrap';
  sec.before(wrap);
  wrap.append(sec);
  grid.hidden = true; // 原本的卡片格留著給讀屏和鍵盤（連結都在），畫面上換成輪播
  grid.classList.add('visually-hidden');
  grid.hidden = false;
  sec.append(carousel);
  sec.classList.add('is-carousel');
  document.addEventListener('themechange', () => carousel.querySelectorAll('.carousel-stage img').forEach(img => { img.src = img.src.replace(/thumb-(dark|light)/, `thumb-${document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'}`); }));

  const track = carousel.querySelector('.carousel-track');
  const titles = [...track.children];
  const imgs = [...carousel.querySelectorAll('.carousel-stage img')];
  const stage = carousel.querySelector('.carousel-stage');
  const info = carousel.querySelector('.carousel-info');
  const idxEl = carousel.querySelector('.carousel-index');
  let current = -1;
  const setCurrent = i => {
    if (i === current) return;
    current = i;
    const w = list[i];
    idxEl.textContent = String(i + 1).padStart(2, '0');
    carousel.querySelector('.carousel-tech').textContent = w.tech;
    carousel.querySelector('.carousel-summary').textContent = w.summary;
    carousel.querySelector('.carousel-open').href = w.href;
    stage.href = w.href;
    gsap.fromTo(info.children, { yPercent: 40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'expo.out', overwrite: true });
  };
  setCurrent(0);

  // 名稱的位置：讓第 f 個名稱的左邊對齊畫面中線（f 可以是小數，捲到一半就停在兩個名稱中間）
  let offsets = [];
  const measure = () => { offsets = titles.map(t => t.offsetLeft - titles[0].offsetLeft); };
  measure();
  const render = f => {
    const i = Math.min(N - 1, Math.floor(f)), r = f - i;
    const x = offsets[i] + ((offsets[i + 1] ?? offsets[i]) - offsets[i]) * r;
    gsap.set(track, { x: -x });
    titles.forEach((t, j) => gsap.set(t, { opacity: 1 - Math.min(1, Math.abs(j - f)) * 0.82 }));
    // 縮圖：第 j 張在 f 經過 j-1 → j 的途中從右邊擦進來（疊在前一張上面）
    imgs.forEach((img, j) => {
      const reveal = j === 0 ? 1 : Math.max(0, Math.min(1, f - (j - 1)));
      // 遮罩從右往左打開；圖片本身從右邊 30% 的地方慢慢滑到定位（比遮罩慢 → 視差）
      gsap.set(img, { clipPath: `inset(0 0 0 ${(1 - reveal) * 100}%)`, xPercent: (1 - reveal) * 30 });
    });
    setCurrent(Math.round(f));
  };
  render(0);

  const st = ScrollTrigger.create({
    trigger: sec, start: 'top top', end: () => `+=${innerHeight * (N - 1) * 0.8}`,
    pin: true, scrub: 0.6, invalidateOnRefresh: true,
    onRefresh: () => { measure(); },
    onUpdate: self => render(self.progress * (N - 1))
  });
  // 鍵盤：Tab 到（畫面上藏起來的）卡片連結時，輪播捲到那一張
  grid.addEventListener('focusin', e => {
    const i = [...grid.querySelectorAll('.latest-card')].indexOf(e.target.closest('.latest-card'));
    if (i >= 0) window.scrollTo(0, st.start + (st.end - st.start) * i / (N - 1));
  });
}
