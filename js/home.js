// ═══════════════════════════════════════════════
// 首頁：開場滾動、篩選列、作品卡片
// ═══════════════════════════════════════════════
import { initI18n, t, pick } from './i18n.js';
import { WORKS, TOPICS, searchText, matches } from './works.js';
import { initHeader } from './header.js';
import { initSmooth, scrollToY } from './smooth.js';
import { initCursor, initTooltips, magnetic, slidingIndicator } from './interactions.js';
import { initHeroSpec } from './hero-spec.js';
import { addClearButton, addSuggestions, renderEmpty, stopEmpty } from './search.js';

// 縮圖構圖用的常數（見下方 fitThumb）。要放在所有 await 之前，否則縮圖載入時還讀不到
const THUMB_VIEW = { w: 960, h: 600 };
const FIT_W = 0.82, FIT_H = 0.72;
let moveFilterLine = () => {}; // 篩選列的滑動底線（renderFilters 建立）
// 篩選與排序的狀態（放在最上面：檔案一載入就會用到）
let currentTopic = 'all';
let currentTech = null;   // null = 不限 GSAP 功能
let chipsReady = false;  // GSAP 功能標籤第一次更新完了沒（第一次不播遞補動畫）
let currentSort = 'newest';
const SORTS = ['newest', 'oldest', 'name', 'tech'];
let heroSpec = null; // 開場的聚光燈（js/hero-spec.js）

// GSAP 從 CDN 載入；載入失敗時內容照樣顯示，只是沒有動畫
const hasGsap = !!(window.gsap && window.ScrollTrigger && window.SplitText);
if (hasGsap) gsap.registerPlugin(ScrollTrigger, SplitText);

// 重新整理時不要停在上次的捲動位置，開場才會從頭播放
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
if (!location.hash) window.scrollTo(0, 0);

// 剛切換語言：回到切換前的位置，不重播開場（見 i18n.js 的 setLang）
const resumeY = (() => {
  try {
    const saved = JSON.parse(sessionStorage.getItem('langScroll'));
    sessionStorage.removeItem('langScroll');
    return saved?.path === location.pathname ? saved.y : null;
  } catch { return null; }
})();

await initI18n();
initHeader();
renderFilters();
renderCards();
setupRefine();
setupRefineToggle();
initSmooth();
initCursor();
initTooltips();
magnetic('.site-header .icon-toggle');
if (hasGsap) {
  await document.fonts.ready; // 字體載入後再拆字，位置才會準
  heroSpec = initHeroSpec();   // 開場的聚光燈規格層（字體載入後才量得準標題大小）
  initMotion();
} else {
  document.documentElement.classList.remove('intro'); // 沒有動畫：直接顯示開場
  document.querySelector('.site-header').revealNav?.();
}
scrollToHash();
if (resumeY !== null) {
  window.ScrollTrigger?.refresh(); // 開場的固定畫面會把頁面撐長，算好位置再捲過去
  scrollToY(resumeY, { immediate: true });
}

// 從作品頁點「作品」回來（網址帶 #works）：
// 開場固定畫面會把頁面撐長，要等 ScrollTrigger 算好位置再捲過去
function scrollToHash() {
  if (!location.hash) return;
  const target = document.querySelector(location.hash);
  if (!target) return;
  window.ScrollTrigger?.refresh();
  target.scrollIntoView({ block: 'start' }); // 會套用 html 的 scroll-padding-top，標題不會被固定頁首蓋住
}

// ── 內容 ─────────────────────────────────────────
function renderFilters() {
  const nav = document.querySelector('.filters');
  const count = topic => WORKS.filter(w => topic === 'all' || w.topic === topic).length;
  nav.innerHTML = ['all', ...TOPICS].map(topic => `
    <button type="button" data-topic="${topic}" aria-pressed="${topic === 'all'}">
      ${t(topic === 'all' ? 'home.filter.all' : `topic.${topic}`)}<sup>${count(topic)}</sup>
    </button>`).join('');
  // 選中的分類下方：一條會滑動的底線（練習 15）
  moveFilterLine = slidingIndicator(nav, b => b.getAttribute('aria-pressed') === 'true', 14);
  // 搜尋：停止輸入 0.2 秒後才篩選，打字時卡片不會一直閃
  let timer;
  const search = document.getElementById('workSearch');
  search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => applyFilter(), 200); });
  search.addEventListener('keydown', e => { if (e.key === 'Escape' && search.value) { search.value = ''; search.dispatchEvent(new Event('input')); } });
  addClearButton(search, () => search.dispatchEvent(new Event('input')));
  addSuggestions(search); // 打字時下方出現最符合的作品，選了直接前往
  nav.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (btn) applyFilter(btn.dataset.topic);
  });

  // 篩選列放不下時（手機）：邊緣漸隱，提示還可以往旁邊滑
  const edges = () => {
    const max = nav.scrollWidth - nav.clientWidth;
    nav.classList.toggle('more-start', nav.scrollLeft > 2);
    nav.classList.toggle('more-end', nav.scrollLeft < max - 2);
  };
  nav.addEventListener('scroll', edges, { passive: true });
  new ResizeObserver(edges).observe(nav);
}

// ── 縮圖構圖 ─────────────────────────────────────
// 作品用 THUMB_VIEW 的大小渲染，再量出「主要內容」的範圍，
// 縮放到卡片的 FIT_W × FIT_H 安全框裡並置中。每張縮圖的留白比例因此一致。
// 主要內容預設是 <main> 的直接子元素；作品資料裡的 thumb 可以指定別的選擇器。
// （THUMB_VIEW、FIT_W、FIT_H 放在檔案最上面：縮圖在等字體載入時就會開始量尺寸）
function fitThumb(thumb) {
  const frame = thumb.querySelector('iframe');
  const W = thumb.clientWidth, H = thumb.clientHeight;
  const base = W / THUMB_VIEW.w;
  let k = base, tx = 0, ty = 0;
  try {
    const doc = frame.contentDocument, win = frame.contentWindow;
    const els = thumb.dataset.fit ? doc.querySelectorAll(thumb.dataset.fit) : (doc.querySelector('main') || doc.body).children;
    let l = Infinity, tp = Infinity, r = -Infinity, b = -Infinity;
    for (const el of els) {
      const cs = win.getComputedStyle(el);
      if (cs.display === 'none' || cs.position === 'absolute' || cs.position === 'fixed') continue; // 跳過裝飾層、飛行物
      const rc = el.getBoundingClientRect();
      if (!rc.width || !rc.height) continue;
      l = Math.min(l, rc.left); tp = Math.min(tp, rc.top); r = Math.max(r, rc.right); b = Math.max(b, rc.bottom);
    }
    // 主要內容超出練習畫面的下緣（例如「功能步驟捲動說明」這類長的捲動練習）：
    // 先把練習捲到內容開頭再重新量，不然框到的是畫面外、沒有畫出來的部分（和 tools/capture.html 截靜態縮圖的做法相同）
    if (b > THUMB_VIEW.h && !thumb.dataset.scrolled) {
      thumb.dataset.scrolled = '1';
      win.scrollTo(0, win.scrollY + tp - 24);
      win.ScrollTrigger?.update();
      return fitThumb(thumb);
    }
    if (r > l && b > tp) {
      k = Math.min(W * FIT_W / (r - l), H * FIT_H / (b - tp), base * 2); // 最多放大 2 倍，避免小圖示被放得過大
      tx = W / 2 - (l + r) / 2 * k;
      ty = H / 2 - (tp + b) / 2 * k;
    }
  } catch {}
  frame.style.transform = `translate(${tx}px, ${ty}px) scale(${k})`;
}

// 目前的配色（縮圖分深色／亮色兩張）
// （寫成 function：檔案上面一載入就會呼叫 renderCards，function 才不會有「還沒定義」的問題）
function thumbSrc(id) {
  const theme = document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
  return `works/${id}/thumb-${theme}.jpg`;
}

function renderCards() {
  const grid = document.getElementById('workGrid');
  // 縮圖平常是靜態圖片（tools/make_thumbs.py 產生）；滑鼠移上去才載入真的練習播放
  // → 首頁不用同時跑 30 幾個網頁，捲動和記憶體都輕很多
  grid.innerHTML = WORKS.map((w, i) => `
    <a class="work-card" href="work.html?id=${w.id}" data-id="${w.id}" data-topic="${w.topic}" data-tech="${w.tech}" data-search="${searchText(w, t(`topic.${w.topic}`)).replace(/"/g, '&quot;')}" aria-labelledby="card-${w.id}" aria-describedby="card-${w.id}-sum">
      <div class="thumb" data-id="${w.id}"${w.thumb ? ` data-fit="${w.thumb}"` : ''}>
        <img class="thumb-img" src="${thumbSrc(w.id)}" alt="" width="1200" height="750" loading="${i < 4 ? 'eager' : 'lazy'}" decoding="async">
        <span class="thumb-go" aria-hidden="true"><i class="ph-light ph-arrow-up-right"></i></span>
      </div>
      <div class="work-meta">
        <h3 id="card-${w.id}">${pick(w.title)}</h3>
        <span class="topic">${w.tech}</span>
        <p id="card-${w.id}-sum">${pick(w.summary)}</p>
        <div class="tags">${w.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
      </div>
    </a>`).join('');

  const thumbs = [...grid.querySelectorAll('.thumb')];
  const ro = new ResizeObserver(entries => entries.forEach(({ target }) => target.querySelector('iframe') && fitThumb(target)));

  // 放進真的練習（iframe）：載入完成、構圖算好之後才淡入，蓋在圖片上面
  const goLive = thumb => {
    if (thumb.querySelector('iframe')) return;
    const frame = document.createElement('iframe');
    delete thumb.dataset.scrolled; // 新的 iframe 從頂端開始，要重新判斷要不要捲
    frame.src = `works/${thumb.dataset.id}/index.html`;
    frame.tabIndex = -1;
    frame.title = '';
    frame.setAttribute('aria-hidden', 'true');
    thumb.insertBefore(frame, thumb.querySelector('.thumb-go'));
    frame.addEventListener('load', () => {
      fitThumb(thumb);
      frame.contentDocument?.fonts?.ready.then(() => fitThumb(thumb)); // 字體載入後尺寸會變，再算一次
      thumb.classList.add('is-live');
    });
    ro.observe(thumb);
  };
  // 移走：先淡出，再把 iframe 整個拿掉（釋放記憶體）
  const goStill = thumb => {
    const frame = thumb.querySelector('iframe');
    if (!frame || thumb.dataset.noImage) return;
    thumb.classList.remove('is-live');
    ro.unobserve(thumb);
    setTimeout(() => { if (!thumb.classList.contains('is-live')) frame.remove(); }, 350);
  };

  thumbs.forEach(thumb => {
    // 還沒有縮圖（例如剛新增、還沒跑 make_thumbs.py）：直接用真的練習當縮圖
    thumb.querySelector('.thumb-img').addEventListener('error', () => { thumb.dataset.noImage = '1'; goLive(thumb); }, { once: true });
  });

  // 只有滑鼠（可以「停在上面」）的裝置才在滑過時播放；停 0.15 秒才開始，滑過去不會一直載入
  if (matchMedia('(hover: hover)').matches) {
    grid.querySelectorAll('.work-card').forEach(card => {
      const thumb = card.querySelector('.thumb');
      let timer;
      card.addEventListener('pointerenter', () => { timer = setTimeout(() => goLive(thumb), 150); });
      card.addEventListener('pointerleave', () => { clearTimeout(timer); goStill(thumb); });
    });
  }

  // 切換深淺色：圖片換成另一張
  document.addEventListener('themechange', () => grid.querySelectorAll('.thumb-img').forEach(img => {
    img.src = thumbSrc(img.closest('.thumb').dataset.id);
  }));
}

// ── 篩選：舊卡片淡出 → 換成新的一組 → 新卡片依序進場 ─────
// （之前用 Flip 只會「移動」卡片；還沒捲進畫面的卡片是透明的，篩選後就看不到。
//   現在每次篩選都重新播一次進場動畫，所有分類都一定會出現卡片）
let filterTl;
// 分類、GSAP 功能、搜尋一起決定要顯示哪些卡片；排序決定順序

// 依排序方式比較兩個作品（同分時用編號，順序才固定）
function compare(a, b) {
  const byId = a.id.localeCompare(b.id);
  if (currentSort === 'oldest') return a.date.localeCompare(b.date) || byId;
  if (currentSort === 'name') return pick(a.short).localeCompare(pick(b.short), document.documentElement.lang) || byId;
  if (currentSort === 'tech') return a.tech.localeCompare(b.tech) || byId;
  return b.date.localeCompare(a.date) || -byId; // newest：日期新的在前，同一天的編號大的在前
}

// GSAP 功能 chip 的選取狀態
function syncChips() {
  document.querySelectorAll('#techChips .chip').forEach(c => {
    const on = c.dataset.tech === currentTech;
    c.setAttribute('aria-pressed', on);
    if (on) c.dataset.tip = t('tech.clear', { tech: c.dataset.tech }); else delete c.dataset.tip;
  });
}

// chip 上的數字跟著目前的分類和搜尋重新算；0 個的 chip 藏起來（點下去只會得到空結果）
// 顯示的標籤有變時：全部快速淡出 → 換成新的一組 → 由左至右逐一出現（比各自滑到新位置好懂，不會有某一顆「晚一步彈過去」）
// 只有數字變、顯示的標籤沒變時不播動畫；頁面剛載入的第一次也不播
function updateChipCounts(topic, query) {
  const counts = {};
  document.querySelectorAll('.work-card').forEach(c => {
    if ((topic === 'all' || c.dataset.topic === topic) && matches(c.dataset.search, query)) counts[c.dataset.tech] = (counts[c.dataset.tech] || 0) + 1;
  });
  const chips = [...document.querySelectorAll('#techChips .chip')];
  const show = c => !!counts[c.dataset.tech];
  const changed = chips.some(c => c.hidden === show(c));
  const animate = chipsReady && changed && window.gsap && !reduceMotion();
  chipsReady = true;
  if (window.gsap) { gsap.killTweensOf(chips); gsap.set(chips, { clearProps: 'opacity,transform' }); } // 連續快速切換：上一次的動畫直接結束
  const apply = () => {
    chips.forEach(c => {
      c.querySelector('sup').textContent = counts[c.dataset.tech] || 0;
      c.hidden = !show(c);
    });
    syncChips(); // 記住的 GSAP 功能回到有它的分類：重新顯示成選中
    if (!animate) return;
    gsap.fromTo(chips.filter(show), { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.35, stagger: 0.03, ease: 'expo.out', clearProps: 'opacity,transform' });
  };
  if (animate) gsap.to(chips.filter(c => !c.hidden), { opacity: 0, duration: 0.12, ease: 'power1.in', onComplete: apply });
  else apply();
}

// 實際套用的 GSAP 功能：使用者選的那個在目前分類＋搜尋裡有作品才套用，沒有就先不套（但記著，換回有它的分類會恢復）
function activeTech(topic, query) {
  if (!currentTech) return null;
  return [...document.querySelectorAll('.work-card')]
    .some(c => c.dataset.tech === currentTech && (topic === 'all' || c.dataset.topic === topic) && matches(c.dataset.search, query)) ? currentTech : null;
}

// 手機的「篩選」按鈕：展開／收起第二排（高度補間）
function setupRefineToggle() {
  const btn = document.getElementById('refineToggle');
  const panel = document.getElementById('refine');
  let tl;
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', open);
    tl?.kill();
    if (open) panel.classList.add('is-open');
    if (reduceMotion() || !window.gsap) { panel.classList.toggle('is-open', open); return; }
    tl = open
      ? gsap.timeline()
          .fromTo(panel, { height: 0, overflow: 'hidden' }, { height: 'auto', duration: 0.5, ease: 'expo.out', clearProps: 'height,overflow' }) // 動畫時才裁切：展開後排序的下拉清單要能超出去
          .from(panel.children, { opacity: 0, y: 8, duration: 0.4, stagger: 0.05, ease: 'expo.out', clearProps: 'opacity,transform' }, 0.05)
      : gsap.timeline({ onComplete: () => { panel.classList.remove('is-open'); gsap.set(panel, { clearProps: 'height,paddingTop,paddingBottom,overflow' }); } })
          .to(panel, { height: 0, paddingTop: 0, paddingBottom: 0, overflow: 'hidden', duration: 0.35, ease: 'expo.inOut' });
  });
}

// 一次清掉主題、GSAP 功能和搜尋，回到全部
function clearFilters() {
  currentTech = null;
  syncChips();
  const input = document.getElementById('workSearch');
  if (input.value) { input.value = ''; input.dispatchEvent(new Event('input')); }
  applyFilter('all');
  document.querySelector('.filters button[data-topic="all"]')?.focus();
}

// ── GSAP 功能快速篩選＋排序 ───────────────────────
function setupRefine() {
  // GSAP 功能：依出現次數排，次數一樣依名稱
  const counts = {};
  WORKS.forEach(w => { counts[w.tech] = (counts[w.tech] || 0) + 1; });
  const techs = Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));
  const chips = document.getElementById('techChips');
  chips.innerHTML = techs.map(tech => `<button type="button" class="chip" data-tech="${tech}" aria-pressed="false">${tech}<sup>${counts[tech]}</sup></button>`).join('');
  updateChipCounts('all', ''); // 先跑一次（全部都有，不會藏任何標籤）：之後的切換才播遞補動畫
  chips.addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    currentTech = currentTech === chip.dataset.tech ? null : chip.dataset.tech; // 再按一次選中的 = 取消
    syncChips();
    applyFilter();
  });

  // 排序：記住上次的選擇
  try { if (SORTS.includes(localStorage.getItem('sort'))) currentSort = localStorage.getItem('sort'); } catch {}
  const btn = document.getElementById('sortBtn');
  const list = document.getElementById('sortList');
  const value = document.getElementById('sortValue');
  list.innerHTML = '<li class="sort-hl" role="presentation" aria-hidden="true"></li>' +
    SORTS.map(k => `<li role="option" id="sort-${k}" data-sort="${k}" aria-selected="${k === currentSort}">${t(`sort.${k}`)}</li>`).join('');
  const opts = [...list.querySelectorAll('[role="option"]')];
  const hl = list.querySelector('.sort-hl');
  let active = 0;
  value.textContent = t(`sort.${currentSort}`);

  // 滑動高亮：整個清單只有一塊，移到哪個選項就滑過去（同練習 24）
  const setActive = (i, instant) => {
    active = i;
    list.setAttribute('aria-activedescendant', opts[i].id);
    const to = { y: opts[i].offsetTop, opacity: 1 };
    if (instant || !hasGsap || reduceMotion()) { hasGsap ? gsap.set(hl, to) : Object.assign(hl.style, { transform: `translateY(${to.y}px)`, opacity: 1 }); }
    else gsap.to(hl, { ...to, duration: 0.3, ease: 'expo.out', overwrite: true });
  };
  const open = () => {
    list.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    setActive(SORTS.indexOf(currentSort), true);
    list.focus({ preventScroll: true });
    if (hasGsap && !reduceMotion()) gsap.fromTo(list, { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.3, ease: 'expo.out' });
  };
  const close = (focusBtn = true) => {
    if (list.hidden) return;
    list.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    if (focusBtn) btn.focus({ preventScroll: true });
  };
  const choose = i => {
    currentSort = SORTS[i];
    try { localStorage.setItem('sort', currentSort); } catch {}
    opts.forEach((o, n) => o.setAttribute('aria-selected', n === i));
    value.textContent = t(`sort.${currentSort}`);
    close();
    applyFilter();
  };
  btn.addEventListener('click', () => (list.hidden ? open() : close()));
  opts.forEach((o, i) => {
    o.addEventListener('pointerenter', () => setActive(i));
    o.addEventListener('click', () => choose(i));
  });
  list.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((active + 1) % opts.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((active - 1 + opts.length) % opts.length); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(active); }
    else if (e.key === 'Escape' || e.key === 'Tab') close(e.key === 'Escape');
  });
  document.addEventListener('pointerdown', e => { if (!e.target.closest('.sort')) close(false); });

  // 一開始就照記住的排序排好（不播動畫）
  const grid = document.getElementById('workGrid');
  sortCards(grid);
}

// 依目前的排序重新排列卡片（直接移動 DOM 順序）
function sortCards(grid = document.getElementById('workGrid')) {
  const byId = Object.fromEntries(WORKS.map(w => [w.id, w]));
  [...grid.children]
    .sort((a, b) => compare(byId[a.dataset.id], byId[b.dataset.id]))
    .forEach(card => grid.append(card));
}
function applyFilter(topic = currentTopic) {
  currentTopic = topic;
  document.querySelectorAll('.filters button').forEach(b => b.setAttribute('aria-pressed', b.dataset.topic === topic));
  moveFilterLine();
  const query = document.getElementById('workSearch').value;
  const cards = [...document.querySelectorAll('.work-card')];
  const shown = cards.filter(c => c.style.display !== 'none');
  const tech = activeTech(topic, query); // 選的 GSAP 功能這個分類沒有：先不套用，但不忘記
  updateChipCounts(topic, query); // 標籤馬上更新，不用等卡片淡出
  const next = cards.filter(c => (topic === 'all' || c.dataset.topic === topic)
    && (!tech || c.dataset.tech === tech)
    && matches(c.dataset.search, query));
  const empty = document.getElementById('empty');

  const swap = () => {
    sortCards();
    cards.forEach(c => { c.style.display = next.includes(c) ? '' : 'none'; });
    empty.hidden = next.length > 0;
    if (next.length) stopEmpty(empty);
    else if (query.trim()) {
      // 找不到：有動畫的空狀態，點建議的關鍵字或「清除搜尋」直接重新篩選
      renderEmpty(empty, query.trim(), { onPick: word => {
        const input = document.getElementById('workSearch');
        input.value = word;
        input.dispatchEvent(new Event('input'));
        input.focus();
      } });
    } else {
      // 不是搜尋造成的 0 筆（主題＋GSAP 功能的組合）：說明原因，給一顆「清除篩選」
      stopEmpty(empty);
      empty.innerHTML = `<p></p><button type="button" class="btn btn-ghost btn-sm"><i class="ph-light ph-x"></i><span></span></button>`;
      empty.querySelector('p').textContent = t('home.works.empty');
      empty.querySelector('span').textContent = t('home.filter.clear');
      empty.querySelector('button').addEventListener('click', clearFilters);
    }
    // 讀屏軟體：唸出結果數量（看不到畫面的人也知道篩選有沒有結果）
    document.getElementById('resultStatus').textContent = next.length ? t('home.works.count', { count: next.length }) : t('home.works.empty');
    // 篩選列已經吸附在頁首下方時：捲回作品格開頭，新的一組卡片從第一張開始看
    const bar = document.querySelector('.filters-bar');
    const headerH = document.querySelector('.site-header').offsetHeight;
    const top = document.getElementById('workGrid').getBoundingClientRect().top + scrollY - headerH - bar.offsetHeight - 16;
    if (scrollY > top) scrollToY(top, { immediate: true });
    window.ScrollTrigger?.refresh(); // 版面變了，重新計算捲動觸發位置
  };

  filterTl?.kill(); // 連續快速點擊時，先停掉上一次的動畫
  if (!hasGsap) { swap(); return; }
  if (reduceMotion()) { swap(); gsap.set(next, { opacity: 1, y: 0 }); return; }

  filterTl = gsap.timeline()
    // stagger 用 amount（整排總共花多久）而不是 each：卡片 52 張時，each 0.03 要等 1.8 秒新結果才出現
    .to(shown, { opacity: 0, y: -16, duration: 0.25, stagger: { amount: 0.2 }, ease: 'power2.in' })
    .add(swap)
    .add(() => {
      const ordered = [...document.querySelectorAll('.work-card')].filter(c => next.includes(c)); // 排序後的順序
      filterTl.fromTo(ordered, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.9, stagger: Math.min(0.08, 0.6 / ordered.length), ease: 'expo.out' }); // 張數少時每張差 0.08 秒，很多張時整排最多 0.6 秒；放進同一條 timeline：連點時一起被停掉
    });
}

function reduceMotion() {
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ── 動態 ─────────────────────────────────────────
function initMotion() {
  const mm = gsap.matchMedia();
  const square = document.querySelector('.hero-square');
  const title = document.querySelector('.hero-title');
  let intro;      // 開場動畫（自動播放的那段）
  let titleChars; // 標題拆開後的字母

  // 開場播完（或使用者一開始就往下捲）之後，才顯示頁首按鈕、作品區、頁尾
  let restShown = false;
  const showRest = () => {
    if (restShown) return;
    restShown = true;
    // 先把要進場的元素設成起點，再拿掉 intro class，才不會閃一下
    gsap.from('.works-head, .filters-bar, .refine', { // GSAP 功能那一排也一起進場（之前沒包含，會先出現再看到上面滑進來）
      opacity: 0, y: 40, duration: 1.2, stagger: 0.08, ease: 'expo.out',
      scrollTrigger: { trigger: '.works', start: 'top bottom', once: true }
    });
    gsap.set('.work-card', { opacity: 0, y: 56 });
    ScrollTrigger.batch('.work-card', {
      start: 'top 90%',
      once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08, ease: 'expo.out' })
    });
    gsap.from('.site-header .header-end, .site-nav', { opacity: 0, duration: 0.6, ease: 'power1.out' });
    document.querySelector('.site-header').revealNav?.(); // 頁首尺規的亮線從左邊長到「作品」
    if (innerWidth < 600) gsap.from('.site-header .logo', { opacity: 0, duration: 0.6, ease: 'power1.out' });
    document.documentElement.classList.remove('intro');
    if (!location.hash && resumeY === null) heroSpec?.sweep(); // 開場播完：光圈掃過標題一次，提示這裡藏了東西
  };

  // ① 所有尺寸：開場（自動播放，約 2.5 秒）
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const split = SplitText.create(title, { type: 'chars', mask: 'chars' });
    titleChars = split.chars;

    // 方塊和整組標題中心點的水平距離 → 讓方塊先出現在畫面正中央
    const lockup = square.parentElement;
    const toCenter = (lockup.offsetLeft + lockup.offsetWidth / 2) - (square.offsetLeft + square.offsetWidth / 2);

    gsap.set(square, { x: toCenter, scale: 0, rotation: -180 });
    gsap.set(split.chars, { yPercent: 110 });
    gsap.set('.hero-pin', { visibility: 'visible' }); // 初始狀態設好了才顯示（見 index.html 的 intro class）

    intro = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 })
      .to(square, { scale: 1.8, rotation: 0, duration: 1.1 })                 // 在中央旋轉放大
      .to(square, { scale: 1, x: 0, duration: 1.1, ease: 'expo.inOut' })      // 滑回標題左邊
      .to(split.chars, { yPercent: 0, duration: 1.2, stagger: 0.035 }, '-=0.45') // 把字一個一個「拉」出來
      .from('.hero-sub, .hero-hint', { opacity: 0, y: 16, duration: 0.8, stagger: 0.1 }, '-=0.6')            // 副標題在字快拉完時出現
      .add(showRest, '-=0.3');                                                   // 開場收尾時，其他內容才出現

    // 從作品頁回到 #works：不等開場，直接顯示
    if (location.hash || resumeY !== null) intro.progress(1);

    return () => split.revert();
  });

  // ② 平板、電腦：往下捲時
  //    · 標題的字母由左往右依序往上移出（和進場相反）
  //    · 方塊飛進左上角：其實是「頁首的 logo 方塊」從大方塊的位置縮回原位，
  //      頁首固定在畫面上，所以抵達後不會跟著頁面往上跑
  //    · 方塊就定位後，頁首的 Motion Lab 由左往右逐字出現
  mm.add('(min-width: 600px) and (prefers-reduced-motion: no-preference)', () => {
    const mark = document.querySelector('.site-header .logo-mark');
    const logoText = SplitText.create('.site-header .logo-text', { type: 'chars', mask: 'chars' });

    // 方塊位置：hero 在頁面最上方 (0,0)；頁首方塊位置：頁首固定在畫面最上方 (0,0)
    // 用 offsetLeft/offsetTop 量，不會被動畫中的位移影響
    const center = el => ({ x: el.offsetLeft + el.offsetWidth / 2, y: el.offsetTop + el.offsetHeight / 2 });

    gsap.set(mark, { opacity: 0 });
    gsap.set(logoText.chars, { yPercent: 110 });
    const logoIn = gsap.to(logoText.chars, { yPercent: 0, duration: 0.5, stagger: 0.03, ease: 'expo.out', paused: true });
    gsap.set('.site-header .logo', { visibility: 'visible' });

    // 前半段先把開場固定住（pin），標題才不會一下子就被捲出畫面；
    // 後半段放開，作品區一邊往上出現、方塊一邊飛完最後一段
    // pinSpacing: false → 不在下方補空白，作品區像布幕一樣直接往上蓋過開場（第一個畫面底部就看得到作品區）
    ScrollTrigger.create({ trigger: '.hero', start: 'top top', end: '+=30%', pin: '.hero-pin', pinSpacing: false });

    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: '+=60%',
        scrub: 0.6, invalidateOnRefresh: true,
        // 開場還沒播完就開始捲動：直接跳到開場結尾，避免兩個方塊同時出現
        onUpdate: self => {
          if (self.progress > 0 && intro && intro.progress() < 1) intro.progress(1);
          // 頁首文字不跟著捲動「半截」顯示：方塊快到位就整段播出，往回捲才收起
          // （之前用 scrub，停在中間時頁首只剩一個方塊）
          self.progress >= 0.7 ? logoIn.play() : logoIn.reverse();
        }
      }
    })
      // 交棒：大方塊藏起來，頁首方塊放大疊在同一個位置
      // immediateRender: false → 開始捲動前不要先把起點畫出來（否則一載入就會看到藍色方塊）
      .set(square, { opacity: 0 }, 0)
      .fromTo(mark, {
        opacity: 1,
        x: () => center(square).x - center(mark).x,
        y: () => center(square).y - center(mark).y,
        scale: () => square.offsetWidth / mark.offsetWidth,
        rotation: 0
      }, { x: 0, y: 0, scale: 1, rotation: 180, duration: 1, ease: 'expo.inOut', immediateRender: false }, 0)
      // 標題字母依序往上移出
      .fromTo(titleChars, { yPercent: 0 }, { yPercent: -110, duration: 0.25, stagger: 0.03, ease: 'power2.in', immediateRender: false }, 0.02)
      .to('.hero-sub, .hero-hint, .hero-spec', { opacity: 0, duration: 0.3 }, 0);

    return () => logoText.revert();
  });

}
