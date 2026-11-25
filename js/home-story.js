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
const head = (kicker, title, id) => `
  <div class="story-head">
    <p class="label">${esc(pick(kicker))}</p>
    ${title ? `<h2 id="${id}">${esc(pick(title))}</h2>` : ''}
  </div>`;
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
    ${head(STATEMENT.kicker)}
    <h2 class="statement" id="story-about">${esc(pick(STATEMENT.text))}</h2>
    <dl class="stats">${stats.map(([n, label]) => `<div><dt>${esc(label)}</dt><dd data-count="${n}">${n}</dd></div>`).join('')}</dl>
  </section>

  <section class="story-section container" aria-labelledby="story-method">
    ${head(METHOD.kicker, METHOD.title, 'story-method')}
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
    ${head(TOPICS_INTRO.kicker, TOPICS_INTRO.title, 'story-topics')}
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

  <section class="story-section container" aria-labelledby="story-latest">
    <div class="story-head-row">
      ${head(LATEST.kicker, LATEST.title, 'story-latest')}
      <a class="btn btn-ghost" href="works.html"><span>${esc(pick(LATEST.cta))}</span><i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>
    </div>
    <ul class="latest-grid">
      ${latest.map(w => `
      <li><a class="latest-card" href="work.html?id=${w.id}">
        <span class="latest-thumb"><img src="${thumbSrc(w.id)}" data-id="${w.id}" alt="" width="1200" height="750" loading="lazy" decoding="async"></span>
        <span class="latest-meta"><span class="latest-name">${esc(pick(w.title))}</span><span class="latest-tech">${esc(w.tech)}</span></span>
      </a></li>`).join('')}
    </ul>
  </section>

  <section class="story-section container" aria-labelledby="story-tools">
    ${head(TOOLS.kicker, TOOLS.title, 'story-tools')}
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
export async function initStoryMotion() {
  const box = document.getElementById('story');
  if (!box) return;
  await hydrateIcons(box);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!window.gsap || !window.ScrollTrigger || reduce) return;

  // 1. 大字：捲動時一個詞一個詞亮起來（scrub：跟著捲動，往回捲會暗回去）
  const statement = box.querySelector('.statement');
  if (window.SplitText) {
    // 中文沒有空格，用「詞」拆會變成一大塊、換行也會亂掉 → 中文一個字一個字拆，英文一個詞一個詞拆
    const zh = document.documentElement.lang.startsWith('zh');
    const split = SplitText.create(statement, { type: zh ? 'chars' : 'words' });
    const parts = zh ? split.chars : split.words;
    gsap.fromTo(parts, { opacity: 0.16 }, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: statement, start: 'top 80%', end: 'bottom 45%', scrub: 0.5 }
    });
  }
  // 數字：進到畫面時從 0 數上來
  box.querySelectorAll('[data-count]').forEach(dd => {
    const n = +dd.dataset.count, o = { v: 0 };
    gsap.to(o, { v: n, duration: 1.4, ease: 'expo.out', onUpdate: () => { dd.textContent = Math.round(o.v); },
      scrollTrigger: { trigger: dd, start: 'top 90%', once: true } });
    dd.textContent = '0';
  });

  // 2. 方法：亮線跟著捲動往右走，經過哪一步，那一步的圖示就畫出來
  const method = box.querySelector('.method');
  const steps = [...method.querySelectorAll('.method-step')];
  const drawn = new Set();
  // 手機的尺是直的：亮線由上往下長（scaleY）；平板、電腦由左往右（scaleX）
  const axis = matchMedia('(max-width: 599px)').matches ? 'scaleY' : 'scaleX';
  gsap.fromTo(method.querySelector('.method-fill'), { [axis]: 0 }, {
    [axis]: 1, ease: 'none',
    scrollTrigger: {
      trigger: method, start: 'top 75%', end: 'bottom 55%', scrub: 0.6,
      onUpdate: self => steps.forEach((s, i) => {
        if (self.progress >= i / steps.length && !drawn.has(i)) { drawn.add(i); s.classList.add('is-on'); drawIcon(s.querySelector('.anim-icon')); }
      })
    }
  });

  // 3、5. 卡片的圖示：卡片捲進畫面時依序畫出來
  ScrollTrigger.batch(box.querySelectorAll('.story-card'), {
    start: 'top 88%', once: true,
    onEnter: batch => batch.forEach((card, i) => drawIcon(card.querySelector('.anim-icon'), { delay: i * 0.08 }))
  });
}
