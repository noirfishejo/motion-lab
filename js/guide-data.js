// ═══════════════════════════════════════════════
// 動態規範頁（guide.html）的內容
// 從 56 個練習的筆記、DESIGN.md 第 8 節和效能檢視整理出來；改規則時 DESIGN.md 一起更新
// 文字欄位寫成 { 'zh-TW': '…', en: '…' }（同 works 的寫法）；ex 是相關練習的資料夾名稱
// ═══════════════════════════════════════════════
const L = (zh, en) => ({ 'zh-TW': zh, en });

export const SECTIONS = [
  { id: 'principles', title: L('原則', 'Principles') },
  { id: 'easing', title: L('Ease 怎麼選', 'Choosing an ease') },
  { id: 'duration', title: L('時長', 'Duration') },
  { id: 'stagger', title: L('依序出現', 'Stagger') },
  { id: 'cost', title: L('效能成本', 'Performance cost') },
  { id: 'css-gsap', title: L('CSS 還是 GSAP', 'CSS or GSAP') },
  { id: 'checklist', title: L('實作檢查', 'Build checklist') },
  { id: 'reduced', title: L('減少動態', 'Reduced motion') }
];

export const PRINCIPLES = [
  {
    title: L('動態要說明一件事', 'Motion explains something'),
    text: L('東西從哪裡來、狀態改變了、操作有被收到。說不出理由的動態就不做，不要每個區塊都淡入。',
      'Where something came from, that a state changed, that an action was received. If you can’t say why it moves, don’t animate it; not every section needs a fade-in.'),
    ex: ['46-shared-element', '13-submit-states']
  },
  {
    title: L('快出、輕停', 'Fast out, soft landing'),
    text: L('預設用 expo.out：一開始就有反應，最後輕輕停住。使用者在等的是「開始動」，不是「動完」。',
      'Default to expo.out: it responds immediately and settles gently. People wait for motion to start, not to finish.'),
    ex: ['01-stagger']
  },
  {
    title: L('離開比進入快', 'Exits are quicker'),
    text: L('進場要讓人看見，離場只要讓路。彈窗開 0.5 秒、關 0.3 秒；離場用 power2.in 加速離開。',
      'Entrances need to be seen; exits just get out of the way. A modal opens in 0.5s and closes in 0.3s, leaving with power2.in.'),
    ex: ['16-modal-sheet', '23-hamburger-menu']
  },
  {
    title: L('隨時可以打斷', 'Always interruptible'),
    text: L('動到一半又操作時，要從目前的位置接著走，不是跳回起點，也不是排隊等上一段播完。',
      'When someone acts mid-animation, continue from where things are, never jump back to the start or queue behind the previous animation.'),
    ex: ['11-toggle-switch', '24-dropdown']
  }
];

// 每一列有一個示範：方塊沿著軌道走，曲線上的點同步標出「時間 → 進度」
export const EASES = [
  {
    ease: 'expo.out',
    use: L('預設。進場、展開、各種回饋。', 'The default: entrances, expanding, feedback.'),
    ex: ['01-stagger', '06-flip']
  },
  {
    ease: 'expo.inOut',
    use: L('在畫面裡從 A 搬到 B，起點和終點都看得到：版面重新排列、清單和格狀切換。', 'Moving from A to B with both ends on screen: reflowing a layout, switching list and grid.'),
    ex: ['38-flip-filter', '35-layout-switch']
  },
  {
    ease: 'power2.in',
    use: L('離場：慢慢起步、加速離開。關閉、移出畫面。', 'Exits: start slow and accelerate away. Closing, leaving the screen.'),
    ex: ['16-modal-sheet', '47-swipe-delete']
  },
  {
    ease: 'back.out(2.5)',
    use: L('稍微超過再回來：圖示、徽章、按讚這種「蹦一下」的回饋。', 'Overshoot and settle: icons, badges and likes that pop.'),
    ex: ['21-like-burst', '53-star-rating']
  },
  {
    ease: 'elastic.out(1, 0.4)',
    use: L('彈簧：放開後彈回原位（拖曳、磁吸）。很搶眼，一頁用一兩處就好。', 'A spring back to rest after letting go (drag, magnetic). Loud, so one or two per page.'),
    ex: ['49-button-hovers', '52-elastic-string']
  },
  {
    ease: 'none',
    use: L('等速：跟著捲動（scrub）、跑馬燈、進度條，速度要和輸入一致。', 'Linear: scroll-scrubbed motion, marquees and progress, where speed must match the input.'),
    ex: ['22-parallax', '25-marquee']
  }
];

// demo：示範方塊用的秒數；min、max 畫在 0～1 秒的刻度上
export const DURATIONS = [
  {
    name: L('立即回饋', 'Instant feedback'), min: 0.1, max: 0.15, demo: 0.12,
    use: L('按下縮小、勾選、按鈕變色。慢一點就會覺得「沒按到」。', 'Press, check, colour change. Any slower feels like the tap didn’t register.'),
    ex: ['27-checkbox', '49-button-hovers']
  },
  {
    name: L('狀態切換', 'State change'), min: 0.15, max: 0.3, demo: 0.25, token: '--dur-fast',
    use: L('開關、分頁底線、提示框出現。', 'Switches, tab indicators, tooltips appearing.'),
    ex: ['11-toggle-switch', '31-tooltip']
  },
  {
    name: L('版面、浮層', 'Layout and overlays'), min: 0.3, max: 0.5, demo: 0.4,
    use: L('下拉選單、彈窗、手風琴展開。面積越大、移動越遠，越靠近上限。', 'Dropdowns, modals, accordions. The larger the area or distance, the closer to the upper end.'),
    ex: ['24-dropdown', '17-accordion']
  },
  {
    name: L('進場、轉場', 'Entrances and transitions'), min: 0.5, max: 0.8, demo: 0.65, token: '--dur',
    use: L('卡片進場、頁面之間的轉場。超過 1 秒就會讓人覺得在等。', 'Cards entering, transitions between pages. Past 1 second it feels like waiting.'),
    ex: ['01-stagger', '46-shared-element']
  }
];

export const STAGGER = {
  rules: [
    L('每個項目間隔 0.03～0.08 秒，看得出順序就好。', 'Space items 0.03–0.08s apart: just enough to read the order.'),
    L('項目多時固定「總時間」：stagger: { amount: 0.3 }。用固定間隔的話，50 張卡片要等 4 秒（首頁篩選就是這樣改的）。', 'With many items, fix the total instead: stagger: { amount: 0.3 }. A fixed gap makes 50 cards take 4 seconds (the home filter was fixed this way).'),
    L('只對畫面上看得到的做；捲進來的項目用 ScrollTrigger.batch 一批一批進場。', 'Only stagger what’s on screen; use ScrollTrigger.batch for items that scroll in.')
  ],
  // 示範的三種設定：each＝每個間隔幾秒、amount＝總共幾秒
  options: [
    { label: 'each: 0.03', each: 0.03 },
    { label: 'each: 0.08', each: 0.08 },
    { label: 'amount: 0.3', amount: 0.3 }
  ],
  count: 16,
  ex: ['01-stagger', '38-flip-filter', '42-falling-stack']
};

export const COSTS = [
  {
    level: 'light',
    props: 'transform · opacity',
    text: L('x、y、scale、rotation 和透明度交給顯示卡處理，幾乎沒有負擔。能用這兩種做到的，就不要改別的屬性。', 'x, y, scale, rotation and opacity run on the GPU at almost no cost. If these two can do it, don’t touch anything else.'),
    ex: ['11-toggle-switch', '29-segmented-control', '41-hover-image-follow']
  },
  {
    level: 'medium',
    props: 'clip-path · mask · SVG stroke · filter (small)',
    text: L('每一格都要重畫，但不用重新排版。範圍小、數量少時很順；全螢幕或大圖要注意。', 'Repainted every frame, but no relayout. Smooth when small; watch out at full screen or on large images.'),
    ex: ['33-clip-reveal', '55-spotlight-reveal', '23-hamburger-menu']
  },
  {
    level: 'heavy',
    props: 'width · height · top · left · padding · blur (large)',
    text: L('每一格都要重新計算版面或重畫大範圍。只對一兩個元素做；能換成 transform 就換（例如往右推改用 translateX，不改 padding）。', 'Relayout or large repaints every frame. Keep it to one or two elements and swap for transform where you can (nudge with translateX, not padding).'),
    ex: ['13-submit-states', '17-accordion', '19-blur-reveal']
  }
];

export const CSS_OR_GSAP = {
  css: {
    title: L('用 CSS transition', 'Use a CSS transition'),
    items: [
      L('兩個固定狀態之間切換：滑過變色、底線變色、提示框淡入。', 'Switching between two fixed states: hover colours, underline colour, a tooltip fading in.'),
      L('顏色留在 CSS，亮暗模式切換時才會正確。', 'Keep colours in CSS so light and dark modes stay correct.')
    ]
  },
  gsap: {
    title: L('用 GSAP', 'Use GSAP'),
    items: [
      L('有順序、要重疊或倒著播（漢堡選單、送出按鈕）。', 'Sequenced, overlapping or reversible (hamburger menu, submit button).'),
      L('即時跟著滑鼠、捲動、輸入（游標、視差、搜尋建議）。', 'Live-following the pointer, scroll or input (cursor, parallax, search suggestions).'),
      L('終點要量才知道（分頁底線、高度 auto、Flip）。', 'The end value must be measured (tab indicator, height: auto, Flip).'),
      L('中途會被打斷，要從目前位置接著走（連點開關）。', 'It will be interrupted and must continue from its current position (rapid toggling).'),
      L('要等動畫播完才做下一件事（彈窗關閉、骨架屏換內容）。', 'Something waits for it to finish (closing a modal, swapping in content after a skeleton).')
    ]
  }
};

export const CHECKLIST = [
  {
    code: 'gsap.quickTo()',
    text: L('跟著游標、捲動的動態用 quickTo：只建一次補間，每次只更新終點，不要每動一下就 gsap.to。', 'Use quickTo for anything following the pointer or scroll: one tween, only the target updates, never a new gsap.to per move.'),
    ex: ['56-cursor-trail']
  },
  {
    code: "overwrite: true",
    text: L('不要用 overwrite 去打斷 quickTo：它會把 quickTo 的補間一起殺掉，下次就不會動了。要停掉另一段補間，就自己 kill 那一段。', 'Don’t use overwrite against a quickTo: it kills the quickTo tween too, so it stops responding. Keep a reference to the other tween and kill that instead.'),
    ex: ['49-button-hovers']
  },
  {
    code: 'gsap.context()',
    text: L('自動示範、重複播放的動畫包在 context 裡，使用者一操作或離開頁面就整包 kill。', 'Wrap demos and repeating animations in a context and kill the whole thing when the user interacts or leaves.'),
    ex: ['50-letter-grid-blob']
  },
  {
    code: 'IntersectionObserver',
    text: L('捲出畫面就暫停：跑馬燈、無限重複的動畫、首頁縮圖都只播看得到的。', 'Pause when off screen: marquees, infinite loops and thumbnails only play while visible.'),
    ex: ['25-marquee']
  },
  {
    code: 'ResizeObserver + debounce',
    text: L('視窗大小改變時，停下 0.1 秒左右才重建，不要每一格都重算。', 'On resize, rebuild once things settle (about 0.1s), not every frame.'),
    ex: ['51-dot-grid-repel']
  },
  {
    code: 'will-change',
    text: L('只加在真的會動的元素上，動完可以拿掉。幾百個小元素各自加反而吃記憶體。', 'Only on elements that actually animate, and remove it afterwards. Adding it to hundreds of small elements wastes memory.'),
    ex: ['19-blur-reveal']
  },
  {
    code: '.is-loading',
    text: L('動畫起點由 JS 設定的頁面，起點設好之前先藏起來，不然會先閃過最終畫面。', 'If JS sets the starting state, hide the page until it’s applied, or the final state flashes first.'),
    ex: ['05-splittext']
  }
];

export const REDUCED = {
  rules: [
    L('位移、縮放、視差、自動捲動關掉；顏色和透明度的變化可以保留。', 'Turn off movement, scaling, parallax and auto-scrolling; colour and opacity changes can stay.'),
    L('必要的狀態變化直接切換：開關仍然要變色，只是不滑過去。', 'Essential state changes still happen instantly: the switch still changes colour, it just doesn’t slide.'),
    L('自動播放、會一直動的東西要有暫停鈕。', 'Anything that autoplays or keeps moving needs a pause button.'),
    L('GSAP 用 gsap.matchMedia() 分開兩套設定，系統設定改變時會自動切換並清掉舊的動畫。', 'In GSAP, split the two with gsap.matchMedia(); it switches and cleans up when the system setting changes.')
  ],
  code: `gsap.matchMedia().add({
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)'
}, ({ conditions }) => {
  gsap.from('.card', {
    y: conditions.motion ? 40 : 0,
    opacity: 0,
    duration: conditions.motion ? 0.8 : 0.2
  });
});`,
  ex: ['25-marquee', '11-toggle-switch']
};
