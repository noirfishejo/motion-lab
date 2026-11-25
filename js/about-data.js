// ═══════════════════════════════════════════════
// 「關於／方法」頁（about.html）的內容
// 六個站點依序排在 3D 走廊裡，最後一站之後回到第一站（無限循環）
// 文字欄位寫成 { 'zh-TW': '…', en: '…' }；{works}、{topics}、{tech} 由 about.js 換成實際數字
// ═══════════════════════════════════════════════
const L = (zh, en) => ({ 'zh-TW': zh, en });

export const STATIONS = [
  {
    kicker: L('關於', 'About'),
    title: L('一次一個動態', 'One motion at a time'),
    text: L('Motion Lab 是一位 UIUX 設計師的 GSAP 練習庫。每個練習都從真實介面裡的一個動態開始：拆開它、做出來，再寫下為什麼這樣做。',
      'Motion Lab is a UI/UX designer’s GSAP practice library. Each practice starts from one motion in a real interface: take it apart, build it, then write down why.'),
    stats: true
  },
  {
    kicker: L('方法 01', 'Method 01'),
    title: L('觀察', 'Observe'),
    text: L('在真實的網站和 App 裡找動態：按鈕怎麼回應、頁面怎麼轉場、捲動時發生了什麼。錄下來，記下它讓人有什麼感覺。',
      'Find motion in real sites and apps: how a button responds, how pages transition, what happens on scroll. Record it, and note how it makes you feel.'),
    tags: ['reference', 'screen recording', 'feeling']
  },
  {
    kicker: L('方法 02', 'Method 02'),
    title: L('拆解', 'Break it down'),
    text: L('把一段動態拆成時間軸：哪些元素在動、動哪個屬性、多久、用什麼 ease、誰先誰後。大部分的「質感」都藏在這些數字裡。',
      'Turn the motion into a timeline: which elements move, which property, for how long, with what ease, in what order. Most of the “feel” hides in these numbers.'),
    tags: ['timeline', 'duration', 'ease', 'stagger']
  },
  {
    kicker: L('方法 03', 'Method 03'),
    title: L('製作', 'Build'),
    text: L('用 GSAP 做出來，把關鍵的數字放在程式最上面。預覽旁邊就能直接改、馬上看到結果，試到感覺對為止。',
      'Build it with GSAP and put the key numbers at the top of the code. Edit them right beside the preview and see the result instantly, until it feels right.'),
    tags: ['gsap.to()', 'quickTo', 'ScrollTrigger', 'Flip']
  },
  {
    kicker: L('方法 04', 'Method 04'),
    title: L('檢查', 'Check'),
    text: L('鍵盤能不能操作、讀屏唸什麼、開了減少動態怎麼辦、手機上順不順、會不會吃效能。每個練習都過一次這份清單。',
      'Does it work with a keyboard, what does a screen reader say, what happens with reduced motion, is it smooth on a phone, what does it cost. Every practice goes through this list.'),
    tags: ['keyboard', 'reduced motion', 'transform', 'cleanup']
  },
  {
    kicker: L('方法 05', 'Method 05'),
    title: L('寫下來', 'Write it down'),
    text: L('把判斷寫成筆記：為什麼是這個 ease、這個秒數。累積多了，就整理成動態規範，下一個練習又從觀察開始。',
      'Turn the judgement into notes: why this ease, why this duration. Over time they become the guidelines, and the next practice starts again with observing.'),
    links: [
      { key: 'nav.works', href: 'index.html#works' },
      { key: 'nav.guide', href: 'guide.html' },
      { key: 'lab.title', href: 'ease.html' }
    ]
  }
];

// 飄在空間裡的字：GSAP 和動態設計的用語（純裝飾，讀屏不唸）
export const WORDS = [
  'expo.out', 'stagger', 'Timeline', 'yPercent', 'scrub', 'pin', 'Flip', 'quickTo', 'ease', '0.6s',
  'transform', 'opacity', 'elastic', 'Draggable', 'SplitText', 'ScrollTrigger', 'overwrite', 'context()',
  'matchMedia', 'will-change', 'back.out', 'power2.in', 'duration', 'delay', 'repeat', 'yoyo', 'from()',
  'to()', 'set()', 'rotation', 'scale', 'clip-path', 'Observe', 'Break down', 'Build', 'Check', 'Write',
  'feel', 'rhythm', 'timing', 'interrupt', 'easeInOut', 'progress', 'onUpdate'
];
