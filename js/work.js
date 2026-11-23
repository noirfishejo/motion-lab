// ═══════════════════════════════════════════════
// 作品頁：依網址 ?id= 讀取練習
// 預覽＋可編輯的程式碼（改了會即時更新預覽）＋復原＋筆記
// 原始程式碼直接讀 works/<id>/ 的檔案；按「存回檔案」才會寫回（需用 tools/serve.py 開啟）
// ═══════════════════════════════════════════════
import { initI18n, t, pick, list } from './i18n.js';
import { WORKS, TOPICS, searchText, matches } from './works.js';
import { initHeader } from './header.js';
import { initSmooth } from './smooth.js';
import { initCursor, initTooltips, magnetic, slidingIndicator, toast } from './interactions.js';
import { addClearButton, renderEmpty, stopEmpty } from './search.js';

// 三個程式碼檔案（放在最前面：下方的流程一開始就會用到）
const FILES = { html: 'index.html', css: 'style.css', js: 'script.js' };
const MODES = { html: 'htmlmixed', css: 'css', js: 'javascript' };
const LANG_NAMES = { html: 'HTML', css: 'CSS', js: 'JS' };
const original = {};   // 檔案裡的原始程式碼
const docs = {};       // 編輯器裡每個分頁各自的內容（各自有 Ctrl+Z 紀錄）
let editor = null;
let current = 'js'; // 預設打開 JS：GSAP 動畫和「試著改這幾個數字」都在這裡
let showMarkers = true; // Markers 開關（放在最前面，理由同上）

await initI18n();
initHeader();
// 只有在自己電腦上開（localhost）才能「存回檔案」；用手機或分享網址開時只能試改
const CAN_SAVE = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);

const id = new URLSearchParams(location.search).get('id');
const index = WORKS.findIndex(w => w.id === id);
const work = WORKS[index];
const frame = document.getElementById('previewFrame');
const src = work ? `works/${work.id}/index.html` : '';

setupWorksNav();
initSmooth();
initCursor();
initTooltips();
magnetic('.site-header .icon-toggle');

if (!work) {
  document.getElementById('main').hidden = true;
  document.getElementById('notFound').hidden = false;
  document.title = `${t('work.notFound.title')}${t('site.titleSep')}Motion Lab`;
} else {
  renderInfo();
  renderPager();
  setupPreview();
  setupToggle();
  await loadCode();
  setupTabs();
  setupCopy();
  setupToPreview();
  reveal();
}

// ── 標題、筆記、上一個／下一個 ─────────────────────
function renderInfo() {
  const title = pick(work.title);
  document.title = `${title}${t('site.titleSep')}Motion Lab`;
  document.getElementById('workTitle').textContent = title;
  document.getElementById('workSummary').textContent = pick(work.summary);
  document.getElementById('workTopic').textContent = t(`topic.${work.topic}`);
  document.getElementById('workDate').textContent = work.date.replaceAll('-', '.');
  document.getElementById('workTags').innerHTML = [work.tech, ...work.tags].map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('');
  document.getElementById('notes').innerHTML = (work.notes || []).map(n =>
    `<li><code>${escapeHtml(pick(n.code))}</code><p>${pick(n.text)}</p></li>`).join('');
  // 被截掉的長程式碼：加上提示框顯示完整內容
  document.fonts.ready.then(() => document.querySelectorAll('.notes code').forEach(c => {
    if (c.scrollWidth > c.clientWidth + 1) { c.dataset.tip = c.textContent; c.tabIndex = 0; }
  }));
}

function renderPager() {
  const pager = document.getElementById('pager');
  pager.setAttribute('aria-label', t('work.pagerLabel'));
  const prev = WORKS[index - 1], next = WORKS[index + 1];
  pager.innerHTML =
    (prev ? `<a class="prev" href="work.html?id=${prev.id}"><small class="label">← ${t('work.prev')}</small><span>${pick(prev.title)}</span></a>` : '') +
    (next ? `<a class="next" href="work.html?id=${next.id}"><small class="label">${t('work.next')} →</small><span>${pick(next.title)}</span></a>` : '');
}

// ── 預覽 ─────────────────────────────────────────
function setupPreview() {
  setupMarkers();
  frame.src = previewSrc();
  frame.title = pick(work.title);
  if (work.topic === 'scroll') setupScrollCover();

  // 重播：有修改就重新渲染修改後的版本，沒有就重新載入原檔
  document.getElementById('replayBtn').addEventListener('click', () => {
    if (isModified()) renderEdited();
    else try { frame.contentWindow.location.reload(); } catch { frame.src = previewSrc(); }
  });

  setupFullscreen();
}

// ── 全螢幕預覽：同一頁裡把預覽面板放大到整個視窗；按「關閉全螢幕」或 Esc 回來 ──
// （iframe 不重新載入，修改過的程式碼和動畫狀態都會保留）
function setupFullscreen() {
  const panel = document.getElementById('previewWrap').closest('.panel');
  const full = document.getElementById('fullBtn');
  const exit = document.getElementById('exitFullBtn');
  const placeholder = document.createElement('div'); // 全螢幕時佔住原本的位置，後面的版面不會跳動
  // 把一個矩形換成 clip-path：只露出畫面上這一塊
  const clipTo = r => `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px)`;
  let busy = false;

  const finish = on => {
    full.hidden = on;
    exit.hidden = !on;
    (on ? exit : full).focus();
    busy = false;
  };

  const open = () => {
    if (busy || panel.classList.contains('is-full')) return;
    busy = true;
    const r = panel.getBoundingClientRect();
    const cs = getComputedStyle(panel);
    placeholder.style.height = `${r.height}px`;
    placeholder.style.position = cs.position; // 電腦版預覽是 sticky：佔位方塊也一起固定，收回時才回到看得到的位置
    placeholder.style.top = cs.top;
    panel.before(placeholder);
    panel.classList.add('is-full');
    document.documentElement.classList.add('has-full');
    window.__lenis?.stop(); // 全螢幕時後方頁面不捲動
    if (!window.gsap || reduceMotion()) { finish(true); return; }
    // 從原本的位置「展開」到整個畫面（clip-path 不會把預覽內容壓扁變形）
    gsap.fromTo(panel, { clipPath: clipTo(r) }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 0.55, ease: 'expo.inOut', clearProps: 'clipPath', onComplete: () => finish(true) });
  };

  const close = () => {
    if (busy || !panel.classList.contains('is-full')) return;
    busy = true;
    const done = () => {
      panel.classList.remove('is-full');
      document.documentElement.classList.remove('has-full');
      placeholder.remove();
      window.__lenis?.start();
      finish(false);
    };
    if (!window.gsap || reduceMotion()) { done(); return; }
    // 收回原本的位置（佔位的方塊就是目的地）
    gsap.to(panel, { clipPath: clipTo(placeholder.getBoundingClientRect()), duration: 0.45, ease: 'expo.inOut', onComplete: () => { gsap.set(panel, { clearProps: 'clipPath' }); done(); } });
  };

  full.addEventListener('click', open);
  exit.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel.classList.contains('is-full')) close(); });
}

// ── 作品列表側欄 ─────────────────────────────────
// 寬螢幕（≥1280px）：固定在左側，內容往右讓位；開或關會記住，下次沿用（預設打開）
// 較窄：蓋在畫面上方，點外面、按 Esc 就收起
function setupWorksNav() {
  const nav = document.getElementById('worksNav');
  const toggle = document.getElementById('worksNavToggle');
  const scrim = document.getElementById('worksNavScrim');
  const wide = matchMedia('(min-width: 1280px)');
  const behind = [document.getElementById('main'), document.querySelector('.site-footer')];

  // 依主題分組，只列短名稱（參考 shadcn/ui 文件的側欄）
  document.getElementById('worksNavList').innerHTML = TOPICS
    .filter(topic => WORKS.some(w => w.topic === topic))
    .map(topic => `
      <div class="works-nav-group">
        <h3>${t(`topic.${topic}`)}</h3>
        <ul>${WORKS.filter(w => w.topic === topic).map(w => `
          <li><a href="work.html?id=${w.id}"${w.id === id ? ' aria-current="page"' : ''} data-search="${escapeHtml(searchText(w, t(`topic.${w.topic}`)))}">${pick(w.short || w.title)}</a></li>`).join('')}
        </ul>
      </div>`).join('');

  // 搜尋：輸入時即時篩選，沒有符合的分組整組藏起來
  const search = document.getElementById('worksSearch');
  const empty = document.getElementById('worksNavEmpty');
  search.addEventListener('input', () => {
    let any = false;
    nav.querySelectorAll('.works-nav-group').forEach(group => {
      let groupHit = false;
      group.querySelectorAll('li').forEach(li => {
        const hit = matches(li.firstElementChild.dataset.search, search.value);
        li.hidden = !hit;
        groupHit ||= hit;
      });
      group.hidden = !groupHit;
      any ||= groupHit;
    });
    empty.hidden = any;
    if (any) stopEmpty(empty);
    else renderEmpty(empty, search.value.trim(), { compact: true, onPick: word => {
      search.value = word;
      search.dispatchEvent(new Event('input'));
      search.focus();
    } });
  });
  addClearButton(search, () => search.dispatchEvent(new Event('input')));
  search.addEventListener('keydown', e => { if (e.key === 'Escape' && search.value) { search.value = ''; search.dispatchEvent(new Event('input')); e.stopPropagation(); } });

  const remembered = () => { try { return localStorage.getItem('worksNav') !== 'closed'; } catch { return true; } };
  const list = document.getElementById('worksNavList');
  const set = (open, { focus = true, save = true, init = false } = {}) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open);
    const overlay = !wide.matches;
    document.body.classList.toggle('nav-docked', open && !overlay);
    scrim.hidden = !(open && overlay);
    behind.forEach(el => { if (el) el.inert = open && overlay; }); // 蓋住時，後方內容不能被 Tab 到
    if (save && !overlay) try { localStorage.setItem('worksNav', open ? 'open' : 'closed'); } catch {}
    if (open && !init) nav.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest' });
    if (focus && !open) toggle.focus();
    if (focus && open && overlay) search.focus(); // 手機、平板打開側欄時，直接可以打字搜尋
    if (!init) setTimeout(() => editor?.refresh(), 650); // 內容變寬變窄後，編輯器重新量尺寸
    // 打開時：分組標題和連結依序浮出（GSAP）；背景遮罩淡入
    if (open && !init && window.gsap && !reduceMotion()) {
      gsap.fromTo(nav.querySelectorAll('.works-nav-search, .works-nav-group h3, .works-nav-group li'),
        { x: -12, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, stagger: 0.015, ease: 'expo.out', clearProps: 'transform,opacity' });
      if (overlay) gsap.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power1.out' });
    }
  };

  set(wide.matches && remembered(), { focus: false, save: false, init: true });
  // 換頁時保留側欄的捲動位置，看起來像同一個側欄（不會跳回最上面）
  try {
    const y = sessionStorage.getItem('worksNavScroll');
    if (y !== null) list.scrollTop = +y; else nav.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest' });
  } catch {}
  list.addEventListener('click', e => {
    // 從側欄換頁：記住側欄捲動位置，並讓下一頁跳過進場動畫（像在同一頁切換內容）
    if (e.target.closest('a')) try { sessionStorage.setItem('worksNavScroll', list.scrollTop); sessionStorage.setItem('skipReveal', '1'); } catch {}
  });
  // 初始狀態畫好之後，才恢復側欄的開合動畫
  requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.remove('nav-init', 'nav-preload')));
  wide.addEventListener('change', e => set(e.matches && remembered(), { focus: false, save: false }));
  toggle.addEventListener('click', () => set(!nav.classList.contains('is-open')));
  scrim.addEventListener('click', () => set(false));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open') && !wide.matches) set(false);
  });
}

// ── 捲動類練習：預覽上蓋一層，滾輪先捲整個頁面；點一下才把捲動交給預覽 ──
// 滑鼠移出預覽、或在預覽外點一下（手機），就再蓋回去
function setupScrollCover() {
  const wrap = document.getElementById('previewWrap');
  const cover = document.getElementById('frameCover');
  cover.hidden = false;
  cover.addEventListener('click', () => { cover.hidden = true; frame.focus(); });
  const rearm = e => { if (cover.hidden && !wrap.contains(e.target)) cover.hidden = false; };
  document.addEventListener('pointerover', rearm);  // 滑鼠從預覽移到外面
  document.addEventListener('pointerdown', rearm);  // 手機：點了預覽以外的地方
}

// ── Markers 開關（只有 works.js 標了 markers: true 的練習才會出現） ──
// 開關狀態記在瀏覽器裡，下次打開作品頁會沿用；首頁縮圖一律不顯示
function setupMarkers() {
  const sw = document.getElementById('markersSwitch');
  if (!work.markers) return;
  try { showMarkers = localStorage.getItem('showMarkers') !== 'false'; } catch {}
  sw.hidden = false;
  sw.setAttribute('aria-checked', showMarkers);
  // 滑塊：滑過去途中被拉長再縮回（練習 11 的開關動效）
  const thumb = sw.querySelector('.switch-thumb');
  const TRAVEL = 14; // 軌道內寬 30 − 左右各 2 − 滑塊 12
  const place = on => {
    if (!window.gsap) { thumb.style.transform = `translateX(${on ? TRAVEL : 0}px)`; return; }
    if (reduceMotion()) { gsap.set(thumb, { x: on ? TRAVEL : 0 }); return; }
    gsap.to(thumb, { x: on ? TRAVEL : 0, duration: 0.45, ease: 'expo.out', overwrite: true });
    gsap.fromTo(thumb, { scaleX: 1.5, transformOrigin: on ? '0% 50%' : '100% 50%' }, { scaleX: 1, duration: 0.4, ease: 'expo.out' });
  };
  if (window.gsap) gsap.set(thumb, { x: showMarkers ? TRAVEL : 0 }); else place(showMarkers);
  sw.addEventListener('click', () => {
    showMarkers = !showMarkers;
    sw.setAttribute('aria-checked', showMarkers);
    place(showMarkers);
    try { localStorage.setItem('showMarkers', showMarkers); } catch {}
    if (isModified()) renderEdited(); else resetPreview(); // 重新載入預覽套用設定
  });
}
function previewSrc() { return work.markers && showMarkers ? `${src}?markers` : src; }

// 把三個檔案合成一個 HTML；加上 <base> 讓相對路徑（圖片等）仍然找得到
function buildHtml({ withBase = true } = {}) {
  const v = values();
  let html = v.html
    .replace(/<link[^>]*href=["']style\.css["'][^>]*>/, () => `<style>\n${v.css}\n  </style>`)
    .replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/, () => `<script>\n${v.js}\n  </script>`);
  if (withBase) {
    // 預覽用：加上 <base>，並把 Markers 開關的狀態告訴練習頁
    html = html.replace(/<head>/i, `<head>\n  <base href="${new URL(`works/${work.id}/`, location.href)}">\n  <script>window.SHOW_MARKERS = ${work.markers ? showMarkers : false};</script>`);
  }
  return html;
}

function renderEdited() { frame.srcdoc = buildHtml(); }

// 預覽剛套用修改：「預覽」標籤閃一下強調色
function flashPreview() {
  const label = document.getElementById('previewLabel');
  label.classList.add('is-fresh');
  clearTimeout(flashPreview.timer);
  flashPreview.timer = setTimeout(() => label.classList.remove('is-fresh'), 900);
}

// ── 程式碼：可收合 ───────────────────────────────
function setupToggle() {
  const btn = document.getElementById('codeToggle');
  const body = document.getElementById('codeBody');
  const workBody = document.querySelector('.work-body');
  const animate = () => !reduceMotion() && window.gsap;

  // 電腦版（≥1024px）：程式碼固定展開，和預覽左右並排（展開列在電腦版隱藏）
  const desktop = matchMedia('(min-width: 1024px)');
  const openNow = () => {
    btn.setAttribute('aria-expanded', true);
    workBody.classList.add('is-editing');
    body.hidden = false;
    editor?.refresh();
  };
  if (desktop.matches) openNow();
  desktop.addEventListener('change', e => { if (e.matches) openNow(); else editor?.refresh(); });

  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', open);
    // 編輯模式：平板的預覽固定在上方；手機捲到程式碼時出現「看預覽」按鈕
    workBody.classList.toggle('is-editing', open);
    if (open) {
      body.hidden = false;
      editor?.refresh(); // 隱藏時建立的編輯器，展開後要重新量尺寸
      if (animate()) gsap.fromTo(body, { height: 0 }, { height: 'auto', duration: 0.5, ease: 'expo.out', onComplete: () => editor?.refresh() });
    } else if (!animate()) {
      body.hidden = true;
      document.getElementById('saveConfirm').hidden = true;
    } else {
      gsap.to(body, { height: 0, duration: 0.3, ease: 'expo.in', onComplete: () => { body.hidden = true; gsap.set(body, { clearProps: 'height' }); } });
    }
  });
}

// ── 程式碼：讀檔＋編輯器 ─────────────────────────
async function loadCode() {
  try {
    await Promise.all(Object.entries(FILES).map(async ([lang, file]) => {
      const res = await fetch(`works/${work.id}/${file}`);
      if (!res.ok) throw new Error(file);
      original[lang] = (await res.text()).trimEnd();
    }));
  } catch {
    document.getElementById('editorWrap').innerHTML = `<p class="code-error">${t('work.codeError')}</p>`;
    return;
  }

  // 編輯器（CDN）載入失敗：顯示說明，複製按鈕仍然可以用（複製的是原始程式碼）
  if (!window.CodeMirror) {
    document.getElementById('editorWrap').innerHTML = `<p class="code-error">${t('work.editorError')}</p>`;
    return;
  }

  for (const lang of Object.keys(FILES)) docs[lang] = CodeMirror.Doc(original[lang], MODES[lang]);
  editor = CodeMirror(document.getElementById('editorWrap'), {
    lineNumbers: true, tabSize: 2, indentUnit: 2,
    lineWrapping: false, viewportMargin: 50,
    screenReaderLabel: t('work.editorLabel', { lang: 'JS' }) // 讀屏軟體會唸出「JS 程式碼編輯器」
  });
  // 用 swapDoc 放進文件：編輯器才會切換成這個文件的語法模式（直接當 value 傳入會停在 xml 模式，JS 沒有顏色）
  editor.swapDoc(docs[current]);

  // 停止輸入 0.5 秒後更新預覽
  let timer;
  editor.on('change', () => {
    updateModified();
    clearTimeout(timer);
    timer = setTimeout(() => { isModified() ? renderEdited() : resetPreview(); flashPreview(); }, 500);
  });

  setupSave();

  // 有還沒存的修改時，離開頁面（上一個／下一個、重新整理、關分頁）前先提醒
  window.addEventListener('beforeunload', e => { if (isModified()) e.preventDefault(); });

  document.getElementById('resetBtn').addEventListener('click', () => {
    for (const lang of Object.keys(FILES)) docs[lang].setValue(original[lang]); // 仍可用 Ctrl+Z 找回修改
    resetPreview();
    updateModified();
  });
}

// ── 存回檔案：先列出會覆寫哪些檔案，確認後才用 PUT 寫回 works/<id>/（tools/serve.py 負責寫檔） ──
function setupSave() {
  const btn = document.getElementById('saveBtn');
  if (!CAN_SAVE) {
    btn.hidden = true;
    document.querySelector('.toggle-hint').textContent = t('work.codeHintRemote');
    return;
  }
  const box = document.getElementById('saveConfirm');
  const changedFiles = () => Object.keys(FILES).filter(l => docs[l].getValue() !== original[l]);

  btn.addEventListener('click', () => {
    const names = list(changedFiles().map(l => FILES[l]));
    document.getElementById('saveConfirmText').textContent = t('work.saveConfirm', { files: names });
    box.hidden = false;
    document.getElementById('saveYes').focus();
  });
  document.getElementById('saveNo').addEventListener('click', () => { box.hidden = true; btn.focus(); });

  document.getElementById('saveYes').addEventListener('click', async () => {
    box.hidden = true;
    const changed = changedFiles();
    btn.disabled = true;
    try {
      for (const lang of changed) {
        const value = docs[lang].getValue();
        const res = await fetch(`works/${work.id}/${FILES[lang]}`, { method: 'PUT', body: value });
        if (!res.ok) throw new Error(res.status);
        original[lang] = value.trimEnd(); // 存好的內容成為新的「原始版本」
      }
      toast(t('work.savedStatus', { files: list(changed.map(l => FILES[l])) }));
      announce(t('work.savedStatus', { files: list(changed.map(l => FILES[l])) }));
      resetPreview();
    } catch {
      toast(t('work.saveFailed'), 'error');
      announce(t('work.saveFailedStatus'));
    }
    updateModified();
    btn.focus();
  });
}

// 告訴讀屏軟體目前的狀態（畫面上看不到，見 work.html 的 #status）
function announce(msg) {
  const el = document.getElementById('status');
  el.textContent = '';
  requestAnimationFrame(() => { el.textContent = msg; });
}

function values() {
  const v = {};
  for (const lang of Object.keys(FILES)) v[lang] = docs[lang] ? docs[lang].getValue() : original[lang];
  return v;
}
function isModified() { return Object.keys(FILES).some(l => docs[l] && docs[l].getValue() !== original[l]); }
function resetPreview() { frame.removeAttribute('srcdoc'); frame.src = previewSrc(); }
function updateModified() {
  const m = isModified();
  document.querySelectorAll('[data-modified-badge]').forEach(b => { b.hidden = !m; });
  document.getElementById('resetBtn').disabled = !m;
  document.getElementById('saveBtn').disabled = !m;
}

function setupTabs() {
  if (!editor) return;
  const tabs = [...document.querySelectorAll('.code-tabs [role="tab"]')];
  const select = tab => {
    tabs.forEach(b => { const on = b === tab; b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1; });
    document.getElementById('editorWrap').setAttribute('aria-labelledby', tab.id);
    current = tab.dataset.lang;
    editor.swapDoc(docs[current]);
    editor.setOption('screenReaderLabel', t('work.editorLabel', { lang: tab.textContent.trim() }));
    labelCopy();
  };
  const moveLine = slidingIndicator(document.querySelector('.code-tabs'), b => b.getAttribute('aria-selected') === 'true', 16);
  document.getElementById('codeToggle').addEventListener('click', () => requestAnimationFrame(() => moveLine(false))); // 展開後才量得到位置
  tabs.forEach(b => b.addEventListener('click', () => { select(b); moveLine(); }));
  document.querySelector('.code-tabs').addEventListener('keydown', e => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const i = tabs.indexOf(document.activeElement);
    const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
    next.focus(); select(next); moveLine();
  });
}

// 「複製 JS」：按鈕文字跟著目前的分頁改變
function labelCopy() {
  const btn = document.getElementById('copyBtn');
  btn.querySelector('span').textContent = t('work.copy', { lang: LANG_NAMES[current] });
  btn.dataset.tip = t('work.copyHint', { lang: LANG_NAMES[current] });
}

// ── 複製（複製的是「目前編輯後」的內容） ─────────
function setupCopy() {
  // 結果用 Toast 通知顯示（練習 14），讀屏軟體另外由 #status 唸出
  // 兩顆按鈕的差別寫在按鈕上：「複製 JS」只複製目前分頁；「複製完整頁面」是三個檔案合成一個可以直接打開的 HTML
  const bind = (btn, getText, what) => {
    btn.addEventListener('click', async () => {
      const msg = t('work.copiedStatus', { what: what() });
      try { await navigator.clipboard.writeText(getText()); toast(msg); announce(msg); }
      catch { toast(t('work.copyFailed'), 'error'); announce(t('work.copyFailed')); }
    });
  };
  bind(document.getElementById('copyBtn'), () => values()[current] ?? '', () => LANG_NAMES[current]);
  bind(document.getElementById('copyAllBtn'), () => buildHtml({ withBase: false }), () => t('work.copiedAll'));
  labelCopy();
}

// ── 手機：展開程式碼後，預覽整個捲出畫面時出現「看預覽」按鈕 ──
// （平板、電腦的預覽固定在畫面上，永遠看得到，按鈕不會出現）
function setupToPreview() {
  const btn = document.getElementById('toPreview');
  const panel = document.getElementById('previewWrap').closest('.panel');
  const workBody = document.querySelector('.work-body');
  let offscreen = false;
  const update = () => {
    const show = offscreen && workBody.classList.contains('is-editing');
    btn.classList.toggle('is-shown', show);
    btn.setAttribute('aria-hidden', !show);
    btn.tabIndex = show ? 0 : -1;
  };
  // rootMargin 扣掉頁首高度：預覽躲在頁首後面也算「看不到」
  new IntersectionObserver(([e]) => { offscreen = !e.isIntersecting && e.boundingClientRect.top < 0; update(); },
    { rootMargin: '-80px 0px 0px 0px' }).observe(panel);
  new MutationObserver(update).observe(workBody, { attributes: true, attributeFilter: ['class'] });
  btn.addEventListener('click', () => {
    panel.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
  });
}

// ── 進場動態 ─────────────────────────────────────
function reveal() {
  let fromSidebar = false;
  try { fromSidebar = sessionStorage.getItem('skipReveal') === '1'; sessionStorage.removeItem('skipReveal'); } catch {}
  const ready = () => document.documentElement.classList.remove('reveal-pending');
  if (fromSidebar || reduceMotion() || !window.gsap || !window.SplitText) { ready(); return; }
  document.fonts.ready.then(() => {
    const split = SplitText.create('#workTitle', { type: 'words', mask: 'words' });
    // 作品頁常常來回切換，進場要短（約 0.6 秒）；預覽和程式碼直接顯示，不等動畫
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .from(split.words, { yPercent: 110, duration: 0.6, stagger: 0.03 })
      .from('.work-info, .work-main > .panel, .work-side', { opacity: 0, y: 16, duration: 0.5, stagger: 0.05, clearProps: 'transform,opacity' }, 0.1);
    ready(); // 起點都設好了（from 會先把元素放到起點），這時才顯示
  });
}

function reduceMotion() { return matchMedia('(prefers-reduced-motion: reduce)').matches; }
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]); }
