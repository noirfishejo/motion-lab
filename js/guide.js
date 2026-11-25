// ═══════════════════════════════════════════════
// 動態規範頁：依 js/guide-data.js 產生各節，加上可以播放的示範
// · Ease：方塊沿軌道走，曲線上的點同步標出「時間 → 進度」
// · 時長：四個等級的方塊各自用代表秒數走一次，刻度上標出建議範圍
// · 依序出現：同一排方塊用三種 stagger 設定比較總時間
// 示範第一次捲進畫面時自動播一次；「預覽減少動態」打開時，示範改成直接切換
// ═══════════════════════════════════════════════
import { initI18n, t, pick } from './i18n.js';
import { WORKS } from './works.js';
import { initHeader } from './header.js';
import { initSmooth } from './smooth.js';
import { initCursor, initTooltips, magnetic, pageReveal } from './interactions.js';
import { SECTIONS, PRINCIPLES, EASES, DURATIONS, STAGGER, COSTS, CSS_OR_GSAP, CHECKLIST, REDUCED } from './guide-data.js';

await initI18n();
document.title = `${t('guide.title')}${t('site.titleSep')}Motion Lab`;
initHeader();
initSmooth();
initCursor();
initTooltips();
magnetic('.site-header .icon-toggle');

const hasGsap = !!window.gsap;
if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
// 系統開了減少動態，開關一開始就是打開的
let reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const byId = Object.fromEntries(WORKS.map(w => [w.id, w]));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

document.getElementById('guideBasis').textContent = t('guide.basis', { count: WORKS.length });

// ── 共用小元件 ─────────────────────────────────
// 相關練習的連結（用側欄的短名稱；練習被刪掉時自動略過）
function examples(ids) {
  const links = ids.filter(id => byId[id]).map(id =>
    `<a class="ex-link" href="work.html?id=${id}">${esc(pick(byId[id].short || byId[id].title))}</a>`);
  return links.length ? `<p class="ex"><span class="ex-label">${t('guide.examples')}</span>${links.join('')}</p>` : '';
}
// 文字裡的 `code` 標成程式碼樣式（資料裡沒有反引號時原樣輸出）
const rich = s => esc(s).replace(/(gsap\.[\w.]+\(\)|stagger: \{ amount: [\d.]+ \}|ScrollTrigger\.batch|expo\.out|power2\.in|quickTo|overwrite|translateX)/g, '<code>$1</code>');
const playBtn = (attr, label = t('guide.play')) =>
  `<button class="btn btn-ghost btn-sm play" type="button" ${attr}><i class="ph-light ph-play" aria-hidden="true"></i><span>${label}</span></button>`;
const section = (s, i, inner) => `
  <section class="panel guide-section" id="${s.id}" aria-labelledby="${s.id}-title">
    <h2 id="${s.id}-title"><span class="num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${esc(pick(s.title))}</h2>
    ${inner}
  </section>`;

// ── 各節的內容 ─────────────────────────────────
const RENDER = {
  principles: () => `<ol class="principles">${PRINCIPLES.map(p => `
    <li><h3>${esc(pick(p.title))}</h3><p>${rich(pick(p.text))}</p>${examples(p.ex)}</li>`).join('')}</ol>`,

  easing: () => `
    <div class="section-tools">${playBtn('data-play-all="easing"', t('guide.playAll'))}</div>
    <ul class="demo-list">${EASES.map((e, i) => `
      <li class="ease-row" data-ease="${i}">
        <svg class="curve" viewBox="0 0 64 64" aria-hidden="true"><path class="curve-axis" d="M0 64H64M0 64V0"></path><path class="curve-line"></path><rect class="curve-dot" width="5" height="5" x="-2.5" y="-2.5"></rect></svg>
        <div class="row-text"><h3><a class="lab-link" href="ease.html?ease=${encodeURIComponent(e.ease)}" data-tip="${esc(t('guide.openLab'))}"><code>${esc(e.ease)}</code><i class="ph-light ph-arrow-up-right" aria-hidden="true"></i></a></h3><p>${rich(pick(e.use))}</p>${examples(e.ex)}</div>
        <div class="track" aria-hidden="true"><span class="block"></span></div>
        ${playBtn(`data-play="ease" data-i="${i}" aria-label="${esc(t('guide.play'))} ${esc(e.ease)}"`)}
      </li>`).join('')}</ul>`,

  duration: () => `
    <div class="section-tools">${playBtn('data-play-all="duration"', t('guide.playAll'))}</div>
    <ul class="demo-list">${DURATIONS.map((d, i) => `
      <li class="dur-row" data-dur="${i}">
        <div class="row-text">
          <h3>${esc(pick(d.name))} <span class="range">${d.min}–${d.max}s${d.token ? ` · <code>${d.token}</code>` : ''}</span></h3>
          <p>${rich(pick(d.use))}</p>${examples(d.ex)}
        </div>
        <div class="dur-demo" aria-hidden="true">
          <div class="scale"><span class="scale-range" style="left:${d.min * 100}%;width:${(d.max - d.min) * 100}%"></span><span class="scale-0">0</span><span class="scale-1">1s</span></div>
          <div class="track"><span class="block"></span></div>
        </div>
        ${playBtn(`data-play="dur" data-i="${i}" aria-label="${esc(t('guide.play'))} ${d.demo}s"`)}
      </li>`).join('')}</ul>
    <p class="note">${esc(t('guide.durNote'))}</p>`,

  stagger: () => `
    <div class="split">
    <ul class="rules">${STAGGER.rules.map(r => `<li>${rich(pick(r))}</li>`).join('')}</ul>
    <div class="stagger-demo">
      <div class="stagger-row" aria-hidden="true">${'<span></span>'.repeat(STAGGER.count)}</div>
      <div class="stagger-tools" role="group" aria-label="stagger">
        ${STAGGER.options.map((o, i) => `<button class="chip" type="button" data-play="stagger" data-i="${i}" aria-pressed="${i === 0}"><code>${o.label}</code></button>`).join('')}
        <span class="stagger-total" role="status"></span>
      </div>
    </div>
    </div>
    ${examples(STAGGER.ex)}`,

  // 這裡的輕／中／重是「屬性本身」的成本；練習頁的評等還看用了幾個元素、範圍多大，所以不列練習數
  cost: () => {
    return `<ul class="cost-list">${COSTS.map(c => `
      <li class="cost-${c.level}">
        <div class="cost-level"><span class="cost-badge">${esc(t(`cost.${c.level}`))}</span></div>
        <div class="row-text"><h3><code>${esc(c.props)}</code></h3><p>${rich(pick(c.text))}</p>${examples(c.ex)}</div>
      </li>`).join('')}</ul>`;
  },

  'css-gsap': () => `<div class="compare">${['css', 'gsap'].map(k => `
    <div class="compare-col"><h3>${esc(pick(CSS_OR_GSAP[k].title))}</h3>
      <ul class="rules">${CSS_OR_GSAP[k].items.map(it => `<li>${rich(pick(it))}</li>`).join('')}</ul></div>`).join('')}</div>`,

  checklist: () => `<ul class="checklist">${CHECKLIST.map(c => `
    <li><i class="ph-light ph-check-square" aria-hidden="true"></i>
      <div class="row-text"><h3><code>${esc(c.code)}</code></h3><p>${rich(pick(c.text))}</p>${examples(c.ex)}</div></li>`).join('')}</ul>`,

  reduced: () => `
    <div class="split">
      <ul class="rules">${REDUCED.rules.map(r => `<li>${rich(pick(r))}</li>`).join('')}</ul>
      <pre class="code-block"><code>${esc(REDUCED.code)}</code></pre>
    </div>
    ${examples(REDUCED.ex)}`
};

document.getElementById('guideBody').innerHTML = SECTIONS.map((s, i) => section(s, i, RENDER[s.id]())).join('');
document.getElementById('guideToc').innerHTML = SECTIONS.map((s, i) =>
  `<li><a href="#${s.id}"><span class="num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${esc(pick(s.title))}</a></li>`).join('');
pageReveal(); // 進場：和作品頁相同（標題、側欄浮上來，面板捲到時一批一批浮出）

// ── Ease 曲線：直接取樣 GSAP 的 ease 畫出來（elastic、back 會超出方框，所以 y 不裁切） ──
const curvePoint = (fn, p) => [p * 64, 64 - fn(p) * 64];
if (hasGsap) {
  document.querySelectorAll('.ease-row').forEach(row => {
    const fn = gsap.parseEase(EASES[row.dataset.ease].ease);
    row.querySelector('.curve-line').setAttribute('d', Array.from({ length: 61 }, (_, i) => {
      const [x, y] = curvePoint(fn, i / 60);
      return `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join(''));
    const [x, y] = curvePoint(fn, 0);
    row.querySelector('.curve-dot').setAttribute('transform', `translate(${x} ${y})`);
  });
}

// ── 示範 ───────────────────────────────────────
// 軌道上可以走的距離：軌道寬減掉方塊寬（播放當下才量，視窗縮放後也對）
const travel = row => row.querySelector('.track').clientWidth - row.querySelector('.block').offsetWidth;

const easeTweens = [];
const PLAY = {
  // 一個 0→1 的進度用 ease:none 走完，再自己套 ease：方塊的位置和曲線上的點才會完全同步
  ease(i) {
    const row = document.querySelector(`.ease-row[data-ease="${i}"]`);
    const fn = gsap.parseEase(EASES[i].ease);
    const block = row.querySelector('.block'), dot = row.querySelector('.curve-dot');
    const dist = travel(row);
    const draw = p => {
      const e = fn(p);
      gsap.set(block, { x: e * dist });
      const [x, y] = curvePoint(fn, p);
      dot.setAttribute('transform', `translate(${x} ${y})`);
    };
    easeTweens[i]?.kill(); // 播到一半再按：停掉上一次，從頭播
    if (reduced) { draw(1); return; }
    const state = { p: 0 };
    easeTweens[i] = gsap.to(state, { p: 1, duration: 1.2, ease: 'none', onUpdate: () => draw(state.p) });
  },
  dur(i) {
    const row = document.querySelector(`.dur-row[data-dur="${i}"]`);
    const block = row.querySelector('.block');
    return gsap.fromTo(block, { x: 0 }, { x: travel(row), duration: reduced ? 0 : DURATIONS[i].demo, ease: 'expo.out', overwrite: true });
  },
  stagger(i) {
    const o = STAGGER.options[i];
    const items = document.querySelectorAll('.stagger-row span');
    document.querySelectorAll('[data-play="stagger"]').forEach(b => b.setAttribute('aria-pressed', b.dataset.i === String(i)));
    // 每一個的動畫 0.5 秒；總時間＝最後一個開始的時間＋0.5
    const each = o.amount != null ? o.amount / (items.length - 1) : o.each;
    document.querySelector('.stagger-total').textContent = t('guide.total', { s: (each * (items.length - 1) + 0.5).toFixed(2) });
    if (reduced) { gsap.set(items, { yPercent: 0, opacity: 1 }); return; }
    return gsap.fromTo(items, { yPercent: 120, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out', overwrite: true, stagger: o.amount != null ? { amount: o.amount } : o.each });
  }
};

function playAll(kind) {
  if (kind === 'easing') EASES.forEach((_, i) => PLAY.ease(i));
  if (kind === 'duration') DURATIONS.forEach((_, i) => PLAY.dur(i));
}

if (hasGsap) {
  document.getElementById('guideBody').addEventListener('click', e => {
    const btn = e.target.closest('[data-play], [data-play-all]');
    if (!btn) return;
    if (btn.dataset.playAll) playAll(btn.dataset.playAll);
    else PLAY[btn.dataset.play](+btn.dataset.i);
  });
  // 第一次捲進畫面時自動播一次，示範一眼就看得懂
  if (window.ScrollTrigger) {
    ScrollTrigger.create({ trigger: '#easing .demo-list', start: 'top 75%', once: true, onEnter: () => playAll('easing') });
    ScrollTrigger.create({ trigger: '#duration .demo-list', start: 'top 75%', once: true, onEnter: () => playAll('duration') });
    ScrollTrigger.create({ trigger: '.stagger-demo', start: 'top 80%', once: true, onEnter: () => PLAY.stagger(0) });
  }
  // 起點：ease 方塊在左邊；依序出現的方塊先藏起來，等捲到再出現
  if (!reduced) gsap.set('.stagger-row span', { yPercent: 120, opacity: 0 });
} else {
  document.querySelectorAll('[data-play], [data-play-all]').forEach(b => { b.hidden = true; });
}
document.querySelector('.stagger-total').textContent = t('guide.total', { s: (STAGGER.options[0].each * (STAGGER.count - 1) + 0.5).toFixed(2) });

// ── 預覽減少動態：只影響這一頁的示範 ──
{
  const sw = document.getElementById('reduceToggle');
  const thumb = sw.querySelector('.switch-thumb');
  const TRAVEL = 14; // 軌道 32 − 邊框 2 − 左右留白 4 − 滑塊 12
  const place = animate => {
    sw.setAttribute('aria-checked', reduced);
    if (!hasGsap) { thumb.style.transform = `translateX(${reduced ? TRAVEL : 0}px)`; return; }
    if (!animate || matchMedia('(prefers-reduced-motion: reduce)').matches) { gsap.set(thumb, { x: reduced ? TRAVEL : 0 }); return; }
    gsap.to(thumb, { x: reduced ? TRAVEL : 0, duration: 0.45, ease: 'expo.out', overwrite: true });
    gsap.fromTo(thumb, { scaleX: 1.5, transformOrigin: reduced ? '0% 50%' : '100% 50%' }, { scaleX: 1, duration: 0.4, ease: 'expo.out' });
  };
  place(false);
  sw.addEventListener('click', () => {
    reduced = !reduced;
    place(true);
    if (reduced && hasGsap) { // 打開時把示範直接放到終點，看起來就是「沒有動畫，只有結果」
      EASES.forEach((_, i) => PLAY.ease(i));
      DURATIONS.forEach((_, i) => PLAY.dur(i));
      gsap.set('.stagger-row span', { yPercent: 0, opacity: 1 });
    }
  });
}

// ── 目錄：目前讀到哪一節就標起來（電腦版目錄固定在左邊） ──
// 左邊只有一條指示條，量出目前那一項的位置和高度，用 y 和 scaleY 滑過去（同首頁篩選列底線的做法，改成直的）
{
  const toc = document.getElementById('guideToc');
  const links = [...toc.querySelectorAll('a')];
  const bar = document.createElement('span');
  bar.className = 'toc-bar';
  bar.setAttribute('aria-hidden', 'true');
  toc.append(bar);
  let current = null;
  const mark = (id, animate = true) => {
    current = id;
    links.forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === `#${id}`));
    const a = links.find(l => l.hasAttribute('aria-current'));
    if (!a) return;
    const to = { y: a.offsetTop, scaleY: a.offsetHeight / 100 }; // CSS 裡指示條本身高 100px
    if (!hasGsap) bar.style.transform = `translateY(${to.y}px) scaleY(${to.scaleY})`;
    else if (!animate || reduced) gsap.set(bar, to);
    else gsap.to(bar, { ...to, duration: 0.5, ease: 'expo.out', overwrite: true });
  };
  if (window.ScrollTrigger) {
    SECTIONS.forEach(s => ScrollTrigger.create({
      trigger: `#${s.id}`, start: 'top 40%', end: 'bottom 40%',
      onToggle: self => { if (self.isActive) mark(s.id); }
    }));
  }
  mark(SECTIONS[0].id, false);
  new ResizeObserver(() => mark(current, false)).observe(toc);
}
