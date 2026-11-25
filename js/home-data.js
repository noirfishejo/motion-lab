// ═══════════════════════════════════════════════
// 首頁介紹段落的內容（開場之後：是什麼 → 方法 → 依用途找 → 最新練習 → 工具）
// 參考 gsap.com 首頁的節奏：先說是什麼，再說能做什麼，最後導向各個分頁
// 文字欄位寫成 { 'zh-TW': '…', en: '…' }；icon 是 Phosphor 圖示名稱（Light），motion 是滑過時的小動作
// ═══════════════════════════════════════════════
const L = (zh, en) => ({ 'zh-TW': zh, en });

export const STATEMENT = {
  kicker: L('關於', 'About'),
  text: L('Motion Lab 是收集介面動態的地方。每個練習都從真實產品裡的一個動態開始，用 GSAP 做出來、寫下為什麼這樣做，慢慢累積成一套自己的動態語言。',
    'Motion Lab is a place to collect interface motion. Each practice starts from one motion in a real product, gets built with GSAP and comes with notes on why, slowly adding up to a motion language of its own.')
};

export const METHOD = {
  kicker: L('方法', 'Method'),
  title: L('一個練習的五個步驟', 'Five steps to a practice'),
  steps: [
    { icon: 'eye', motion: 'blink', title: L('觀察', 'Observe'),
      text: L('在網站和 App 裡找動態，錄下來，記下它讓人有什麼感覺。', 'Find motion in sites and apps, record it, note how it feels.') },
    { icon: 'squares-four', motion: 'split', title: L('拆解', 'Break down'),
      text: L('拆成時間軸：誰在動、動哪個屬性、多久、什麼 ease。', 'Turn it into a timeline: what moves, which property, how long, which ease.') },
    { icon: 'code', motion: 'nudge', title: L('製作', 'Build'),
      text: L('用 GSAP 做出來，關鍵數字放最上面，邊改邊看。', 'Build it with GSAP, key numbers on top, tweak while watching.') },
    { icon: 'check-circle', motion: 'pop', title: L('檢查', 'Check'),
      text: L('鍵盤、讀屏、減少動態、手機、效能，每個都過一次。', 'Keyboard, screen reader, reduced motion, phones, performance.') },
    { icon: 'note-pencil', motion: 'wiggle', title: L('寫下來', 'Write it down'),
      text: L('把判斷寫成筆記，累積成動態規範。', 'Turn judgement into notes, and notes into guidelines.') }
  ]
};

export const TOPICS_INTRO = {
  kicker: L('分類', 'Topics'),
  title: L('依用途找動態', 'Find motion by purpose'),
  all: { icon: 'squares-four', motion: 'split', title: L('全部作品', 'All works'), text: L('篩選、搜尋、依 GSAP 功能排序。', 'Filter, search and sort by GSAP feature.') },
  items: {
    forms: { icon: 'textbox', motion: 'nudge', text: L('輸入框、開關、勾選、評分：填寫時有回應。', 'Inputs, switches, checkboxes and ratings that respond.') },
    overlays: { icon: 'stack', motion: 'lift', text: L('選單、彈窗、下拉、提示框：從哪裡來就回哪裡去。', 'Menus, modals, dropdowns, tooltips that open from where they belong.') },
    feedback: { icon: 'bell-simple', motion: 'ring', text: L('送出、通知、載入、按讚：告訴使用者「收到了」。', 'Submitting, notifications, loading, likes that say “got it”.') },
    pointer: { icon: 'cursor-click', motion: 'pop', text: L('拖曳、滑動、磁吸、游標：跟著手走的動態。', 'Dragging, swiping, magnetic and cursor effects that follow your hand.') },
    transitions: { icon: 'swap', motion: 'turn', text: L('進場、共享元素、版面切換：畫面之間的連續感。', 'Entrances, shared elements, layout switches that keep screens connected.') },
    scroll: { icon: 'mouse-scroll', motion: 'lift', text: L('視差、固定、橫向、堆疊：捲動就是時間軸。', 'Parallax, pinning, horizontal, stacking: scroll as a timeline.') },
    graphics: { icon: 'text-aa', motion: 'wiggle', text: L('拆字、描邊、數字、點陣：讓內容本身動起來。', 'Split text, strokes, numbers, dot grids: content that moves itself.') }
  }
};

export const LATEST = {
  kicker: L('最新', 'Latest'),
  title: L('最近做的練習', 'Latest practices'),
  count: 6,
  cta: L('看全部作品', 'See all works'),
  open: L('查看練習', 'Open practice')
};

export const TOOLS = {
  kicker: L('工具', 'Tools'),
  title: L('做練習時一起整理出來的', 'Built alongside the practices'),
  items: [
    { icon: 'book-open-text', motion: 'lift', href: 'guide.html', titleKey: 'guide.title',
      text: L('ease、時長、依序出現、效能：做練習累積下來的判斷，每條都附上練習。', 'Easing, duration, stagger and cost: the judgement behind the practices, each rule linked to examples.') },
    { icon: 'bezier-curve', motion: 'turn', href: 'ease.html', titleKey: 'lab.title',
      text: L('選一條 ease、調參數，和其他曲線並排比較，直接複製 GSAP 或 CSS。', 'Pick an ease, tune it, race it against others and copy it as GSAP or CSS.') }
  ]
};
