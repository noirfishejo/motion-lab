// ═══════════════════════════════════════════════
// 「關於／方法」頁：無限捲動的 3D 走廊（參考 santalarch.com，不用 WebGL）
//
// 做法
// · 畫面固定成一個 3D 空間（CSS perspective），捲動條只是用來推動「鏡頭」往前飛
// · 六個站點和幾十個飄浮的字排在一條長 L 的走廊上；每一格畫面算出每個東西「在鏡頭前面多遠」，
//   超過走廊長度就取餘數 → 剛經過的東西會繞到最遠處，走廊永遠走不完（無限循環沒有接縫）
// · Lenis 的 infinite 模式讓捲動條本身也循環：捲到底會接回開頭
// · 鏡頭在每一站前面停一下（讓人讀完），飛向下一站時往旁邊轉、上下傾、微微側滾，就是「視角的移動」
// · 滑鼠移動時鏡頭跟著稍微看過去，更有身在其中的感覺
// 減少動態、沒有 GSAP 或 Lenis 時：不進入 3D，六站照順序排成一般的頁面
// ═══════════════════════════════════════════════
import { initI18n, t, pick } from './i18n.js';
import { WORKS, TOPICS } from './works.js';
import { initHeader } from './header.js';
import { initSmooth } from './smooth.js';
import { initCursor, initTooltips, magnetic } from './interactions.js';
import { STATIONS, WORDS } from './about-data.js';

// ── 試著改這幾個數字 ──
const SPACING = 2400;        // 兩站之間的距離（3D 空間裡的 px）
const FOG = 5600;            // 多遠以外完全看不到（像霧）
const WORD_FOG = 3000;       // 飄浮的字多遠以外看不到
const BEHIND = 700;          // 經過鏡頭後還保留多遠，之後繞到走廊最遠處
const DWELL = 0.22;          // 每一段捲動，前後各有多少比例是「停在站前面」
const SCREENS_PER_STATION = 1.6; // 每一站要捲幾個螢幕高
const TURN = 16;             // 飛行時鏡頭往旁邊轉幾度
const TILT = 7;              // 飛行時鏡頭上下傾幾度
const ROLL = 3;              // 飛行時鏡頭側滾幾度
const LOOK = { yaw: 5, pitch: 3 }; // 滑鼠帶動鏡頭看過去的角度

await initI18n();
document.title = `${t('about.title')}${t('site.titleSep')}Motion Lab`;
initHeader();
initCursor();
initTooltips();
magnetic('.site-header .icon-toggle');

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const N = STATIONS.length;
const L = N * SPACING;

// ── 站點內容 ───────────────────────────────────
const stats = [
  [WORKS.length, t('about.stat.works')],
  [TOPICS.length, t('about.stat.topics')],
  [new Set(WORKS.map(w => w.tech)).size, t('about.stat.tech')]
];
document.getElementById('stations').innerHTML = STATIONS.map((s, i) => `
  <section class="station" id="station-${i}" data-i="${i}" aria-labelledby="station-${i}-title">
    <p class="station-kicker"><span class="station-num">${String(i + 1).padStart(2, '0')}</span>${esc(pick(s.kicker))}</p>
    <h2 id="station-${i}-title">${esc(pick(s.title))}</h2>
    <p class="station-text">${esc(pick(s.text))}</p>
    ${s.stats ? `<dl class="station-stats">${stats.map(([n, label]) => `<div><dt>${esc(label)}</dt><dd>${n}</dd></div>`).join('')}</dl>` : ''}
    ${s.tags ? `<ul class="station-tags">${s.tags.map(tag => `<li>${esc(tag)}</li>`).join('')}</ul>` : ''}
    ${s.links ? `<p class="station-links">${s.links.map(l => `<a class="btn btn-ghost" href="${l.href}">${esc(t(l.key))}<i class="ph-light ph-arrow-right" aria-hidden="true"></i></a>`).join('')}</p>` : ''}
  </section>`).join('');
document.getElementById('hudTotal').textContent = String(N).padStart(2, '0');

const use3d = !!(window.gsap && window.Lenis) && !matchMedia('(prefers-reduced-motion: reduce)').matches;
if (use3d) init3d();

function init3d() {
  const root = document.documentElement;
  root.classList.add('is-3d');
  const camera = document.querySelector('.about-camera');
  const wordsBox = document.querySelector('.about-words');
  const stationEls = [...document.querySelectorAll('.station')];
  const track = document.querySelector('.about-track');

  // 固定的亂數（每次打開位置都一樣，不會每次重新整理就換一個樣子）
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  // 字重複兩輪，空間裡才夠密（88 個元素，每格只改 transform 和透明度）
  wordsBox.innerHTML = [...WORDS, ...WORDS].map(w => `<span class="word">${esc(w)}</span>`).join('');
  const wordEls = [...wordsBox.children];
  const wordSeeds = wordEls.map(() => ({ z: rand(), side: rand() < 0.5 ? -1 : 1, x: rand(), y: rand(), size: rand(), ry: rand(), rz: rand(), accent: rand() < 0.14 }));

  // 每個東西在走廊裡的位置（視窗大小改變時重算）
  let items = [];
  let textBox = { w: 380, h: 280 };
  function layout() {
    const W = innerWidth, H = innerHeight;
    const sx = Math.min(W * 0.3, 520), sy = H * 0.12;
    const SX = [0, -1, 1, -0.6, 0.9, -0.8], SY = [0, -0.6, 0.8, -0.9, 0.5, 0.2];
    const scale = Math.min(1, W / 1440) * 0.6 + 0.4;
    items = [
      ...stationEls.map((el, i) => ({ el, station: true, z: i * SPACING, x: SX[i % SX.length] * sx, y: SY[i % SY.length] * sy, ry: 0, rz: 0, base: 1 })),
      ...wordEls.map((el, i) => {
        const s = wordSeeds[i];
        // 字放在兩側和上下，不擋住站點中間的文字
        const x = s.side * (W * 0.2 + s.x * W * 0.55);
        const y = (s.y - 0.5) * H * 1.4;
        el.style.fontSize = `${Math.round((14 + s.size * 56) * scale)}px`; // 和下面的 size 相同
        el.classList.toggle('is-accent', s.accent);
        const ry = [0, 0, 35, -35, 60, -60][Math.floor(s.ry * 6)];
        const size = Math.round((14 + s.size * 56) * scale);
        return { el, station: false, z: s.z * L, x, y, ry, rz: (s.rz - 0.5) * 24, base: s.accent ? 0.9 : 0.42, w: el.textContent.length * size * 0.6 };
      })
    ];
    // 捲動長度：每站 SCREENS_PER_STATION 個螢幕高，再多一個螢幕（捲動條到底時剛好接回開頭）
    track.style.height = `${(N * SCREENS_PER_STATION + 1) * 100}vh`;
    // 站點文字大約佔的範圍（從畫面中心算起的半寬、半高），字飄進來時要讓開
    textBox = { w: Math.min(680, W * 0.84) / 2 + 24, h: Math.min(H * 0.34, 320) };
    dirty = true;
  }

  let progress = 0;

  // 滑鼠帶動鏡頭：quickTo 只建一次補間，滑鼠每動一下只更新終點
  const look = { x: 0, y: 0 };
  const lookX = gsap.quickTo(look, 'x', { duration: 1.2, ease: 'power3', onUpdate: () => { dirty = true; } });
  const lookY = gsap.quickTo(look, 'y', { duration: 1.2, ease: 'power3', onUpdate: () => { dirty = true; } });
  addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    lookX(e.clientX / innerWidth * 2 - 1);
    lookY(e.clientY / innerHeight * 2 - 1);
  });

  const clamp01 = v => Math.max(0, Math.min(1, v));
  const smoother = v => v * v * v * (v * (v * 6 - 15) + 10); // 起步和停下都很柔（smootherstep）
  const mod = (a, b) => ((a % b) + b) % b;

  let dirty = true, currentIndex = -1;
  const hudIndex = document.getElementById('hudIndex'), hudName = document.getElementById('hudName');
  const P = () => parseFloat(getComputedStyle(root).getPropertyValue('--about-persp')) || 900;
  let persp = P();

  function render() {
    if (!dirty) return;
    dirty = false;
    // 捲動進度 → 第幾段、這段走了多少（前後各有 DWELL 是停著的）
    const tt = progress * N;
    const seg = Math.floor(tt), f = tt - seg;
    const e = smoother(clamp01((f - DWELL) / (1 - DWELL * 2)));
    const a = seg % N, b = (seg + 1) % N;
    const A = items[a], B = items[b];
    const camZ = (seg + e) * SPACING;
    const camX = A.x + (B.x - A.x) * e;
    const camY = A.y + (B.y - A.y) * e;
    const arc = Math.sin(Math.PI * e); // 停在站前面是 0，飛到一半是 1
    const dir = Math.sign(B.x - A.x) || 1;
    const yaw = dir * TURN * arc + look.x * LOOK.yaw;
    const pitch = (seg % 2 ? 1 : -1) * TILT * arc - look.y * LOOK.pitch;
    const roll = -dir * ROLL * arc;
    // 旋轉的中心放在「眼睛」的位置（往前 perspective 的距離），轉起來才像轉頭，不是整個世界繞著畫面轉
    camera.style.transform = `translateZ(${persp}px) rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${roll}deg) translateZ(${-persp}px)`;

    for (const it of items) {
      const rel = mod(it.z - camZ + BEHIND, L) - BEHIND; // 在鏡頭前面多遠（負的＝已經經過）
      // 遠處像霧一樣淡掉；字的霧比較濃：太遠的字會縮到畫面中央（消失點），和正在讀的文字疊在一起
      const fog = it.station ? FOG : WORD_FOG;
      let o = it.base * (1 - clamp01((rel - fog * 0.4) / (fog * 0.6)));
      if (rel < 0) o *= clamp01(1 + rel / (BEHIND * 0.7));               // 經過鏡頭時淡掉
      // 字投影到畫面上時如果落在站點文字的範圍內，就幾乎透明，不干擾閱讀
      if (!it.station) {
        const k = persp / (persp + Math.max(rel, -persp * 0.9));
        const px = (it.x - camX) * k, py = (it.y - camY) * k;
        // 字的寬度：大概是字數 × 字級 × 0.6（等寬字），左右都要算進去
        const half = it.w * k / 2;
        if (Math.abs(px) - half < textBox.w && Math.abs(py) < textBox.h) o *= 0.06;
      }
      // 還沒到的站：停在前一站時看不到（不和正在讀的字疊在一起），鏡頭飛過去的路上才慢慢浮現
      if (it.station && rel > 120) o *= 1 - clamp01((rel - SPACING * 0.3) / (SPACING * 0.4));
      const hidden = o < 0.01 || rel > fog;
      if (hidden) { if (it.el.style.visibility !== 'hidden') it.el.style.visibility = 'hidden'; continue; }
      if (it.el.style.visibility) it.el.style.visibility = '';
      it.el.style.opacity = o.toFixed(3);
      it.el.style.transform = `translate3d(${(it.x - camX).toFixed(1)}px, ${(it.y - camY).toFixed(1)}px, ${(-rel).toFixed(1)}px) translate(-50%, -50%) rotateY(${it.ry}deg) rotateZ(${it.rz}deg)`;
    }

    // 目前在哪一站：過了一半就算下一站
    const idx = e < 0.5 ? a : b;
    if (idx !== currentIndex) {
      currentIndex = idx;
      stationEls.forEach((el, i) => el.classList.toggle('is-current', i === idx));
      hudIndex.textContent = String(idx + 1).padStart(2, '0');
      hudName.textContent = pick(STATIONS[idx].title);
    }
  }

  layout();
  // Lenis 要在捲動長度設好之後才建立，不然它量到的可捲距離是 0
  const lenis = initSmooth({ infinite: true, syncTouch: true });
  lenis.resize();
  lenis.on('scroll', e => { progress = e.limit ? ((e.scroll % e.limit) + e.limit) % e.limit / e.limit : 0; dirty = true; });
  render();
  gsap.ticker.add(render);
  let timer;
  addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(() => { persp = P(); layout(); lenis.resize(); }, 120); });

  // 鍵盤：Tab 到某一站的連結時，鏡頭飛到那一站
  stationEls.forEach((el, i) => el.addEventListener('focusin', () => {
    if (i === currentIndex) return;
    lenis.scrollTo((i + DWELL / 2) / N * lenis.limit);
  }));
}
