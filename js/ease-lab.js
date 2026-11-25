// ═══════════════════════════════════════════════
// Ease 實驗室（ease.html）
// 選 ease 的種類、方向、參數和秒數 → 曲線圖、四種屬性的示範、比較賽道、GSAP／CSS 程式碼
// · 所有示範共用一個 0→1 的進度（ease: none），再各自套 ease：曲線上的點和方塊才會完全同步
// · 網址會記住目前的設定（?ease=expo.out&d=0.6），可以直接分享；動態規範頁的 ease 也連到這裡
// ═══════════════════════════════════════════════
import { initI18n, t, pick } from './i18n.js';
import { initHeader } from './header.js';
import { initSmooth } from './smooth.js';
import { initCursor, initTooltips, magnetic, toast, copyText, pageReveal } from './interactions.js';
import { EASES as GUIDE_EASES } from './guide-data.js';

const L = (zh, en) => ({ 'zh-TW': zh, en });

// ── 可以選的 ease ──
// css：常見 ease 對應的 cubic-bezier（近似值，來源 easings.net）；沒有的（elastic、bounce）改用 CSS linear() 取樣
const FAMILIES = {
  power1: { css: { in: '.11,0,.5,0', out: '.5,1,.89,1', inOut: '.45,0,.55,1' } },
  power2: { css: { in: '.32,0,.67,0', out: '.33,1,.68,1', inOut: '.65,0,.35,1' } },
  power3: { css: { in: '.5,0,.75,0', out: '.25,1,.5,1', inOut: '.76,0,.24,1' } },
  power4: { css: { in: '.64,0,.78,0', out: '.22,1,.36,1', inOut: '.83,0,.17,1' } },
  expo: { css: { in: '.7,0,.84,0', out: '.16,1,.3,1', inOut: '.87,0,.13,1' } },
  sine: { css: { in: '.12,0,.39,0', out: '.61,1,.88,1', inOut: '.37,0,.63,1' } },
  circ: { css: { in: '.55,0,1,.45', out: '0,.55,.45,1', inOut: '.85,0,.15,1' } },
  back: { params: [{ key: 'overshoot', min: 0.5, max: 4, step: 0.1, value: 1.7 }], css: { in: '.36,0,.66,-.56', out: '.34,1.56,.64,1', inOut: '.68,-.6,.32,1.6' } },
  elastic: { params: [{ key: 'amplitude', min: 1, max: 3, step: 0.1, value: 1 }, { key: 'period', min: 0.1, max: 1, step: 0.05, value: 0.3 }] },
  bounce: {},
  none: { noDir: true }
};
const DIRS = ['in', 'out', 'inOut'];

// 沒有寫在動態規範裡的組合：依方向給一句通用的建議
const DIR_HINT = {
  out: L('快出、輕停：進場、展開、回饋。', 'Fast start, soft landing: entrances, expanding, feedback.'),
  in: L('慢慢起步、加速離開：離場、關閉。', 'Slow start, speeding away: exits and closing.'),
  inOut: L('兩端都慢：在畫面裡從 A 搬到 B。', 'Slow at both ends: moving from A to B on screen.'),
  none: L('等速：跟著捲動或輸入，速度要一致。', 'Constant speed: follows scroll or input at the same rate.')
};
const COMPARE_MAX = 4;

await initI18n();
document.title = `${t('lab.title')}${t('site.titleSep')}Motion Lab`;
initHeader();
initSmooth();
initCursor();
initTooltips();
magnetic('.site-header .icon-toggle');

const hasGsap = !!window.gsap;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);

// ── 狀態 ───────────────────────────────────────
const state = { family: 'expo', dir: 'out', params: {}, duration: 0.6, loop: false };
const compares = []; // 比較賽道：[{ ease }]

const easeString = (s = state) => {
  if (s.family === 'none') return 'none';
  const fam = FAMILIES[s.family];
  const base = `${s.family}.${s.dir}`;
  if (!fam.params) return base;
  const vals = fam.params.map(p => +(s.params[p.key] ?? p.value));
  // 都是預設值時寫短的（back.out(1.7) 還是寫出來，比較好懂它可以調）
  return `${base}(${vals.join(', ')})`;
};

// 網址 → 狀態：expo.out、back.out(2.5)、elastic.out(1, 0.4)、none
function parseEase(str) {
  const m = /^(\w+)(?:\.(in|out|inOut))?(?:\(([^)]*)\))?$/.exec((str || '').trim());
  if (!m || !FAMILIES[m[1]]) return null;
  const fam = FAMILIES[m[1]];
  const params = {};
  if (fam.params && m[3]) m[3].split(',').forEach((v, i) => { if (fam.params[i] && !isNaN(+v)) params[fam.params[i].key] = +v; });
  return { family: m[1], dir: m[2] || 'out', params };
}
{
  const q = new URLSearchParams(location.search);
  const parsed = parseEase(q.get('ease'));
  if (parsed) Object.assign(state, parsed);
  const d = +q.get('d');
  if (d >= 0.1 && d <= 2) state.duration = d;
}
function syncUrl() {
  const q = new URLSearchParams(location.search);
  q.set('ease', easeString());
  q.set('d', state.duration);
  history.replaceState(null, '', `${location.pathname}?${q}`);
}

// ── 控制項 ─────────────────────────────────────
$('families').innerHTML = Object.keys(FAMILIES).map(f => `
  <label class="chip-radio"><input type="radio" name="family" value="${f}"${f === state.family ? ' checked' : ''}><span>${f}</span></label>`).join('');
$('directions').innerHTML = DIRS.map(d => `
  <label class="seg"><input type="radio" name="dir" value="${d}"${d === state.dir ? ' checked' : ''}><span>.${d}</span></label>`).join('');

function renderParams() {
  const fam = FAMILIES[state.family];
  $('dirField').disabled = !!fam.noDir;
  $('dirField').classList.toggle('is-off', !!fam.noDir);
  $('paramFields').innerHTML = (fam.params || []).map(p => {
    const v = state.params[p.key] ?? p.value;
    return `<div class="param"><label class="label range-label" for="p-${p.key}"><span>${t(`lab.param.${p.key}`)}</span><output for="p-${p.key}">${v}</output></label>
      <input class="range" type="range" id="p-${p.key}" data-param="${p.key}" min="${p.min}" max="${p.max}" step="${p.step}" value="${v}"></div>`;
  }).join('');
  $('paramFields').hidden = !fam.params;
}

$('controls').addEventListener('input', e => {
  const el = e.target;
  if (el.name === 'family') { state.family = el.value; state.params = {}; renderParams(); }
  else if (el.name === 'dir') state.dir = el.value;
  else if (el.dataset.param) { state.params[el.dataset.param] = +el.value; el.previousElementSibling.querySelector('output').textContent = el.value; }
  else if (el.id === 'duration') state.duration = +el.value;
  update(true);
});
$('duration').value = state.duration;

// ── 曲線圖 ─────────────────────────────────────
// 繪圖區：x 20～220 是時間 0～1；y 190 是進度 0、50 是進度 1（上下留空間給超出去的部分）
const X0 = 20, X1 = 220, Y0 = 190, Y1 = 50;
const px = p => X0 + p * (X1 - X0);
const py = v => Y0 - v * (Y0 - Y1);
const pathOf = fn => Array.from({ length: 121 }, (_, i) => {
  const p = i / 120;
  return `${i ? 'L' : 'M'}${px(p).toFixed(2)} ${Math.max(4, Math.min(236, py(fn(p)))).toFixed(2)}`;
}).join('');
$('graphGrid').innerHTML =
  [0, 0.25, 0.5, 0.75, 1].map(v => `<line class="${v % 1 ? 'minor' : 'major'}" x1="${X0}" x2="${X1}" y1="${py(v)}" y2="${py(v)}"></line>`).join('') +
  [0.25, 0.5, 0.75].map(p => `<line class="minor" x1="${px(p)}" x2="${px(p)}" y1="${Y1}" y2="${Y0}"></line>`).join('') +
  `<line class="major" x1="${X0}" x2="${X0}" y1="${Y1}" y2="${Y0}"></line>` +
  `<text x="${X0 - 4}" y="${py(0) + 3}" text-anchor="end">0</text><text x="${X0 - 4}" y="${py(1) + 3}" text-anchor="end">1</text>` +
  `<text x="${X1}" y="${Y0 + 14}" text-anchor="end">${t('lab.time')}</text>`;

// ── 示範 ───────────────────────────────────────
const lanes = {
  x: document.querySelector('[data-prop="x"]'),
  scale: document.querySelector('[data-prop="scale"]'),
  rotation: document.querySelector('[data-prop="rotation"]'),
  opacity: document.querySelector('[data-prop="opacity"]')
};
const travel = block => block.parentElement.clientWidth - block.offsetWidth;
let fn = p => p;

// 把進度 p（0～1）畫到所有示範上
function draw(p) {
  const v = fn(p);
  $('timeLine').setAttribute('x1', px(p)); $('timeLine').setAttribute('x2', px(p));
  $('dot').setAttribute('transform', `translate(${px(p)} ${Math.max(4, Math.min(236, py(v)))})`);
  gsap.set(lanes.x, { x: v * travel(lanes.x) });
  gsap.set(lanes.scale, { scale: Math.max(0, 0.2 + 0.8 * v) });
  gsap.set(lanes.rotation, { rotation: v * 180 });
  gsap.set(lanes.opacity, { opacity: Math.max(0, Math.min(1, v)) });
  // 比較賽道：第一列是目前的 ease，後面依序是加進來比較的
  const fns = [fn, ...compares.map(c => c.fn)];
  document.querySelectorAll('.race-block').forEach((b, i) => gsap.set(b, { x: fns[i](p) * travel(b) }));
}

let player = null;
function play() {
  if (!hasGsap) return;
  player?.kill();
  const prog = { p: 0 };
  player = gsap.to(prog, {
    p: 1, duration: state.duration, ease: 'none',
    repeat: state.loop ? -1 : 0, repeatDelay: 0.5,
    onUpdate: () => draw(prog.p)
  });
}
$('playBtn').addEventListener('click', play);
// 空白鍵也能播放（焦點不在輸入框、按鈕上時）
addEventListener('keydown', e => {
  if (e.key !== ' ' || e.target.closest('input, button, a, textarea, select')) return;
  e.preventDefault(); play();
});

// 重複播放
{
  const sw = $('loopToggle');
  const thumb = sw.querySelector('.switch-thumb');
  const place = () => {
    sw.setAttribute('aria-checked', state.loop);
    if (hasGsap) gsap.to(thumb, { x: state.loop ? 14 : 0, duration: reduceMotion ? 0 : 0.45, ease: 'expo.out', overwrite: true });
  };
  sw.addEventListener('click', () => { state.loop = !state.loop; place(); play(); });
  place();
}

// ── 比較賽道 ───────────────────────────────────
function renderRace() {
  const rows = [{ ease: easeString(), current: true }, ...compares];
  $('race').innerHTML = rows.map((r, i) => `
    <li class="race-row${r.current ? ' is-current' : ''}">
      <code class="race-name">${r.ease}</code>
      <div class="lane-track"><span class="race-block"></span></div>
      ${r.current ? `<span class="race-tag">${t('lab.current')}</span>` :
        `<button class="icon-toggle" type="button" data-remove="${i - 1}" aria-label="${t('lab.remove', { ease: r.ease })}" data-tip="${t('lab.remove', { ease: r.ease })}"><i class="ph-light ph-x" aria-hidden="true"></i></button>`}
    </li>`).join('');
  $('compareEmpty').hidden = compares.length > 0;
  $('addCompare').disabled = compares.length >= COMPARE_MAX || compares.some(c => c.ease === easeString());
  // 比較的曲線也畫在曲線圖上（淡色）
  $('compareCurves').innerHTML = compares.map(c => `<path class="graph-compare" d="${pathOf(c.fn)}"></path>`).join('');
}
$('addCompare').addEventListener('click', () => {
  const ease = easeString();
  if (compares.length >= COMPARE_MAX || compares.some(c => c.ease === ease)) return;
  compares.push({ ease, fn: gsap.parseEase(ease) });
  renderRace();
  $('status').textContent = t('lab.added', { ease });
  play();
});
$('race').addEventListener('click', e => {
  const btn = e.target.closest('[data-remove]');
  if (!btn) return;
  compares.splice(+btn.dataset.remove, 1);
  renderRace();
  $('addCompare').focus();
});

// ── 程式碼 ─────────────────────────────────────
// CSS linear()：把 ease 取樣成一串點，任何曲線（包含 elastic、bounce）都能用；較新的瀏覽器才支援
function linearCss(f) {
  const n = state.family === 'elastic' || state.family === 'bounce' ? 40 : 20;
  return `linear(${Array.from({ length: n + 1 }, (_, i) => +f(i / n).toFixed(3)).join(', ')})`;
}
function renderCode() {
  const ease = easeString();
  $('codeGsap').textContent = `gsap.to(el, {\n  x: 240,\n  duration: ${state.duration},\n  ease: "${ease}"\n});`;
  const fam = FAMILIES[state.family];
  const defaultBack = state.family !== 'back' || (state.params.overshoot ?? 1.7) === 1.7;
  let timing, note;
  if (state.family === 'none') { timing = 'linear'; note = ''; }
  else if (fam.css && defaultBack) { timing = `cubic-bezier(${fam.css[state.dir]})`; note = t('lab.cssBezier'); }
  else { timing = linearCss(fn); note = t('lab.cssLinear'); }
  $('codeCss').textContent = `transition: transform ${state.duration}s ${timing};`;
  $('cssNote').textContent = note;
}
document.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
  const what = btn.dataset.copy === 'codeGsap' ? 'GSAP' : 'CSS';
  try {
    await copyText($(btn.dataset.copy).textContent);
    toast(t('lab.copied', { what }));
    $('status').textContent = t('lab.copied', { what });
  } catch {
    toast(t('lab.copyFailed'), 'error');
  }
}));

// ── 全部更新 ───────────────────────────────────
let replayTimer;
function update(fromInput = false) {
  const ease = easeString();
  fn = hasGsap ? gsap.parseEase(ease) : (p => p);
  $('easeName').textContent = ease;
  $('durationOut').textContent = `${state.duration}s`;
  $('curve').setAttribute('d', pathOf(fn));
  const guide = GUIDE_EASES.find(g => g.ease === ease);
  $('useHint').textContent = pick(guide ? guide.use : DIR_HINT[state.family === 'none' ? 'none' : state.dir]);
  renderRace();
  renderCode();
  syncUrl();
  if (!hasGsap) return;
  if (player?.isActive()) { player.kill(); player = null; }
  draw(fromInput ? 0 : 1);
  // 改設定後自動播一次（拖滑桿時等停下來才播）；減少動態時只畫出結果，按播放才動
  clearTimeout(replayTimer);
  if (!reduceMotion) replayTimer = setTimeout(play, fromInput ? 250 : 400);
  else draw(1);
}

renderParams();
update();
new ResizeObserver(() => { if (!player?.isActive()) draw(1); }).observe($('lanes'));
pageReveal(); // 進場：和作品頁相同（標題、側欄浮上來，面板捲到時一批一批浮出）
