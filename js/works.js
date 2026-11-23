// ═══════════════════════════════════════════════
// 作品清單：新增練習時，在陣列最後加一筆
// id 要和 works/ 底下的資料夾名稱完全相同
// topic 可用：tween、timeline、scroll、svg、plugins、ui（介面元件）
// 文字欄位都寫成 { 'zh-TW': '…', en: '…' }；少了 en 會自動顯示中文
// ═══════════════════════════════════════════════
export const WORKS = [
  {
    id: '01-stagger',
    title: { 'zh-TW': 'Stagger 進場・卡片列表', en: 'Stagger entrance · Card list' },
    short: { 'zh-TW': 'Stagger 進場', en: 'Stagger entrance' }, // 側欄用的短名稱
    summary: { 'zh-TW': '6 張卡片依序浮現。每張卡片上寫著自己的延遲時間，底部的時間條顯示播放進度，一眼就看得出 stagger 在做什麼。', en: 'Six cards fade up one after another. Each card shows its own delay and the bar at the bottom shows playback progress, so you can see exactly what stagger does.' },
    topic: 'tween',
    tags: ['gsap.from', 'stagger', 'expo.out'],
    date: '2026-11-19',
    notes: [
      { code: 'gsap.from()', text: { 'zh-TW': '從「指定的狀態」動畫回到元素原本的樣子。適合進場：寫出「從哪裡來」就好。', en: 'Animates from the state you specify back to the element’s natural state. Perfect for entrances: just describe where it comes from.' } },
      { code: 'STAGGER = 0.08', text: { 'zh-TW': '每張卡片之間差 0.08 秒。改成 0.3 會像一張一張排隊；改成 0 就是全部同時出現。展開下方程式碼的 JS 分頁，就可以直接改改看。', en: 'Each card starts 0.08s after the previous one. Try 0.3 and they queue up one by one; 0 makes them all appear at once. Open the JS tab below to edit it live.' } },
      { code: 'y: 48, opacity: 0', text: { 'zh-TW': '起點：往下 48px、透明。位移太大會顯得拖沓，40～60px 比較俐落。', en: 'Start point: 48px lower and transparent. Too much travel feels sluggish — 40–60px stays crisp.' } },
      { code: "ease: 'expo.out'", text: { 'zh-TW': '一開始很快、最後慢慢停下，是本站統一的動態節奏。時間條用 none（等速），才看得出真實的時間長度。', en: 'Fast at first, then settles slowly — the house motion rhythm of this site. The progress bar uses none (linear) so you see the real duration.' } }
    ]
  },
  {
    id: '02-timeline',
    title: { 'zh-TW': 'Timeline 編排・Onboarding 三步驟', en: 'Timeline sequencing · 3-step onboarding' },
    short: { 'zh-TW': 'Timeline 編排', en: 'Timeline sequencing' }, // 側欄用的短名稱
    summary: { 'zh-TW': '三個步驟依序進場、停留、離場，下一步會在上一步離開前提早進來。下方的時間軸會顯示播放頭和每個步驟的 label 位置。', en: 'Three steps enter, hold and leave in sequence, and each next step arrives just before the previous one leaves. The timeline below shows the playhead and where each step’s label sits.' },
    topic: 'timeline',
    tags: ['gsap.timeline', 'label', 'position'],
    date: '2026-11-19',
    notes: [
      { code: 'gsap.timeline()', text: { 'zh-TW': '把很多段動畫排在同一條時間軸上。改一段的長度，後面的會自動往後推，不用自己算 delay。', en: 'Puts many animations on one shared timeline. Change the length of one part and everything after it shifts automatically — no delay maths.' } },
      { code: "'<0.1'", text: { 'zh-TW': "位置參數：在「上一段開始後」0.1 秒播放。'<' 是同時開始，'+=1.4' 是上一段結束後再等 1.4 秒。", en: 'Position parameter: start 0.1s after the previous animation starts. \'<\' starts at the same time, \'+=1.4\' waits 1.4s after the previous one ends.' } },
      { code: 'OVERLAP = 0.3', text: { 'zh-TW': '下一步提早 0.3 秒進場，和上一步的離場重疊，轉場才不會有空檔。改成 0 會看到明顯的停頓。', en: 'The next step enters 0.3s early, overlapping the previous exit so the transition has no gap. Set it to 0 to see an obvious pause.' } },
      { code: "addLabel('step2')", text: { 'zh-TW': 'label 是時間軸上的書籤。可以用 tl.play(\'step2\') 直接跳到那裡播放，下方刻度就是 label 的位置。', en: 'A label is a bookmark on the timeline. tl.play(\'step2\') jumps straight there; the ticks below mark each label.' } },
      { code: 'function enter() { return gsap.timeline() }', text: { 'zh-TW': '每個步驟的進場寫成一個函式，回傳一段小 timeline，再用 tl.add() 放進主 timeline。三個步驟共用同一段程式碼。', en: 'Each step’s entrance is a function that returns a small timeline, added to the main one with tl.add(). All three steps share the same code.' } }
    ]
  },
  {
    id: '03-scroll-logo',
    title: { 'zh-TW': 'ScrollTrigger・方塊飛進頁首', en: 'ScrollTrigger · Square flies into the header' },
    short: { 'zh-TW': '方塊飛進頁首', en: 'Square to header' }, // 側欄用的短名稱
    summary: { 'zh-TW': '首頁開場的簡化教學版：往下捲時，標題字母往上移出，方塊轉半圈飛進頁首，接著頁首文字逐字出現。在預覽畫面裡捲動就能看到。', en: 'A simplified version of the home page intro: as you scroll, the title letters slide up, the square spins half a turn into the header, then the header text appears letter by letter. Scroll inside the preview to see it.' },
    topic: 'scroll',
    tags: ['ScrollTrigger', 'scrub', 'markers'],
    markers: true, // 作品頁預覽上方會出現 Markers 開關
    thumb: '.lockup', // 首頁縮圖要對準的主要內容（預設是 <main> 的子元素）
    date: '2026-11-19',
    notes: [
      { code: 'scrub: 0.5', text: { 'zh-TW': '讓動畫進度跟著捲軸走：往下捲前進、往上捲倒放。數字是「跟手的延遲」，0.5 會有一點滑順的拖尾；true 是完全貼著捲動。', en: 'Ties animation progress to the scrollbar: scroll down to play, up to reverse. The number is the catch-up delay — 0.5 adds a smooth trail; true sticks exactly to the scroll.' } },
      { code: "start: 'top top'", text: { 'zh-TW': '前面是「觸發元素的哪裡」，後面是「畫面的哪裡」。這裡是 hero 的頂端碰到畫面頂端時開始。', en: 'The first word is the point on the trigger element, the second is the point on the screen. Here it starts when the top of the hero meets the top of the screen.' } },
      { code: 'end: `+=${DISTANCE}`', text: { 'zh-TW': '從開始的位置再往下捲 300px 時結束。距離越長，同樣的動畫播得越慢。', en: 'Ends after scrolling another 300px from the start. The longer the distance, the slower the same animation plays.' } },
      { code: 'markers: SHOW_MARKERS', text: { 'zh-TW': '在畫面右側顯示 start／end 標記，方便確認觸發範圍。用預覽上方的 Markers 開關切換；上線前記得關掉。', en: 'Shows start/end markers on the right so you can check the trigger range. Toggle them with the Markers switch above the preview — turn them off before shipping.' } },
      { code: { 'zh-TW': '反過來想', en: 'Think backwards' }, text: { 'zh-TW': '方塊本來就放在頁首（終點），先用 gsap.set 把它放大、移到開場的位置（起點），捲動時再讓它回家。因為頁首固定在畫面上，方塊抵達後就不會跟著頁面往上跑。', en: 'The square actually lives in the header (the end point). gsap.set first enlarges it and moves it to the intro position (the start), and scrolling brings it home. Because the header is fixed, the square stays put once it arrives.' } }
    ]
  },
  {
    id: '04-svg-draw',
    title: { 'zh-TW': 'SVG 描邊・Smiley 圖示', en: 'SVG drawing · Smiley icon' },
    short: { 'zh-TW': 'SVG 描邊', en: 'SVG drawing' }, // 側欄用的短名稱
    summary: { 'zh-TW': '把 Phosphor 的 Smiley 圖示一筆一筆畫出來：圓 → 左眼 → 右眼 → 微笑。下方的步驟會跟著目前畫到的那一筆亮起來，點任何一步都能從那一步重新播放。', en: 'Draws Phosphor’s Smiley icon stroke by stroke: circle → left eye → right eye → smile. The step list below lights up with the stroke being drawn, and clicking any step replays from there.' },
    topic: 'svg',
    tags: ['DrawSVGPlugin', 'stroke', 'label'],
    date: '2026-11-19',
    notes: [
      { code: "drawSVG: 0 → '100%'", text: { 'zh-TW': 'DrawSVG 控制線條「畫出來多少」。0 是還沒畫，100% 是整條畫完；也可以寫 \'20% 80%\' 只顯示中間一段。', en: 'DrawSVG controls how much of a stroke is drawn. 0 is nothing, 100% is the full line; \'20% 80%\' shows only the middle part.' } },
      { code: 'fill → stroke', text: { 'zh-TW': 'Phosphor 和多數圖示庫下載的 SVG 是「外框填色」，沒有線條可以描。要做描邊動畫，得用線條（stroke）版本：Figma 裡可以取消 Outline stroke 再匯出，或像這裡照原尺寸改寫成 circle 和 path。', en: 'SVGs downloaded from Phosphor and most icon sets are filled outlines with no stroke to draw. For a drawing animation you need the stroke version: turn off Outline stroke in Figma before exporting, or rewrite it as circle and path at the original size like here.' } },
      { code: 'rotate(-90 128 128)', text: { 'zh-TW': '圓的描邊預設從 3 點鐘方向開始。轉 -90° 就會從正上方（12 點鐘）開始畫，看起來比較自然。', en: 'A circle’s stroke starts at 3 o’clock by default. Rotating it -90° starts the drawing at 12 o’clock, which looks more natural.' } },
      { code: 'r="6" stroke-width="12"', text: { 'zh-TW': '眼睛是實心圓點：用半徑 6、線寬 12 的線條畫一圈，線條剛好填滿整個圓，看起來就像「點」被畫出來。', en: 'The eyes are solid dots: a circle with radius 6 and stroke width 12 fills itself completely, so it looks like a dot being drawn.' } },
      { code: "tl.play('left')", text: { 'zh-TW': '每一筆前面都放了 label（書籤）。點下方的步驟按鈕，就用 tl.play(label) 從那一步開始播：前面的筆畫會直接顯示成畫好，後面的會清空重畫。', en: 'Every stroke has a label (bookmark) before it. Clicking a step calls tl.play(label): earlier strokes show as finished and later ones are cleared and redrawn.' } }
    ]
  },
  {
    id: '05-splittext',
    title: { 'zh-TW': 'SplitText・行／單字／字元三種拆法', en: 'SplitText · Lines, words and characters' },
    short: { 'zh-TW': 'SplitText 拆字', en: 'SplitText' }, // 側欄用的短名稱
    summary: { 'zh-TW': '同一個外掛的三種拆法：英文標題一行一行從遮罩升起、英文句子一個單字一個單字浮現、中文一個字一個字亮起來。', en: 'Three ways to split with the same plugin: an English headline rising line by line from a mask, an English sentence appearing word by word, and letters lighting up one by one.' },
    topic: 'plugins',
    tags: ['SplitText', 'mask', 'autoSplit'],
    date: '2026-11-19',
    notes: [
      { code: "type: 'lines'", text: { 'zh-TW': '依照「畫面上實際的換行」拆成一行一行。適合大標題；搭配 mask 就是常見的「從下方升起」效果。', en: 'Splits by the actual line breaks on screen. Great for headlines; add a mask and you get the classic rise-from-below effect.' } },
      { code: "type: 'words'", text: { 'zh-TW': '依照空格拆成單字。只適合英文：中文沒有空格，整句會被當成一個字。', en: 'Splits on spaces. English only — Chinese has no spaces, so a whole sentence counts as one word.' } },
      { code: "type: 'chars'", text: { 'zh-TW': '拆成每一個字元。中文要逐字動畫就用這個。字元越多越耗效能，長段落建議改用 lines。', en: 'Splits into every character. Use it for per-character animation in Chinese. More characters cost more performance, so prefer lines for long paragraphs.' } },
      { code: "mask: 'lines'", text: { 'zh-TW': '在每一行外面包一層會裁切的遮罩，文字從遮罩下方升上來時不會露出來。首頁的 Motion Lab 也是用這招（mask: chars）。', en: 'Wraps each line in a clipping mask so text stays hidden while it rises from below. The home page Motion Lab title uses the same trick (mask: chars).' } },
      { code: 'autoSplit + onSplit', text: { 'zh-TW': '字體載入或視窗變寬變窄時，換行位置會改變。autoSplit 會自動重新拆分，onSplit 回傳的動畫會自動接上，不會錯位。', en: 'Line breaks change when fonts load or the window resizes. autoSplit re-splits automatically and the animation returned from onSplit is reconnected, so nothing drifts.' } }
    ]
  },
  {
    id: '06-flip',
    title: { 'zh-TW': 'Flip・卡片展開成詳細內容', en: 'Flip · Card expands into details' },
    short: { 'zh-TW': 'Flip 展開', en: 'Flip expand' }, // 側欄用的短名稱
    summary: { 'zh-TW': '點一張卡片，它會展開到最上方、其他卡片縮成一排；再點一次收合。版面只靠切換 CSS class，動畫全部交給 Flip 補上。', en: 'Click a card and it expands to the top while the others shrink into a row; click again to collapse. The layout only toggles a CSS class — Flip fills in all the animation.' },
    topic: 'plugins',
    tags: ['Flip', 'getState', 'layout'],
    date: '2026-11-19',
    notes: [
      { code: 'Flip.getState(cards)', text: { 'zh-TW': '① 先記下每張卡片「現在」的位置和大小。', en: '① First record where every card is and how big it is right now.' } },
      { code: "classList.toggle('is-active')", text: { 'zh-TW': '② 直接切換 CSS class，版面會瞬間跳到新的樣子。版面完全由 CSS 決定，設計師可以只改 CSS 調整排版。', en: '② Toggle the CSS class and the layout jumps to its new state instantly. Layout is pure CSS, so a designer can restyle it without touching JS.' } },
      { code: 'Flip.from(state)', text: { 'zh-TW': '③ Flip 會把每張卡片從「剛剛記下的位置」動畫到「新位置」。這三步驟就是 Flip 的全部用法。', en: '③ Flip animates every card from the recorded position to its new one. These three steps are all there is to Flip.' } },
      { code: 'absolute: true', text: { 'zh-TW': '動畫期間暫時把卡片改成絕對定位，卡片之間不會互相推擠變形。格狀版面切換時幾乎都要加。', en: 'Temporarily positions cards absolutely during the animation so they don’t push each other out of shape. Almost always needed for grid layout changes.' } },
      { code: 'order: -1', text: { 'zh-TW': 'CSS 的 order 可以改變格子的排列順序，不用動 HTML。展開的卡片就是靠它排到最前面。', en: 'CSS order changes the visual order of grid items without touching the HTML. That’s how the expanded card moves to the front.' } }
    ]
  },
  {
    id: '07-draggable',
    title: { 'zh-TW': 'Draggable・底部抽屜', en: 'Draggable · Bottom sheet' },
    short: { 'zh-TW': 'Draggable 抽屜', en: 'Draggable sheet' }, // 側欄用的短名稱
    summary: { 'zh-TW': '手機常見的底部抽屜：上下拖曳，放開後依照甩動的速度繼續滑，最後吸附到「全開／半開／收合」三個位置之一。', en: 'A mobile-style bottom sheet: drag it up or down, release and it keeps gliding with your flick speed, then snaps to open, half or collapsed.' },
    topic: 'plugins',
    tags: ['Draggable', 'InertiaPlugin', 'snap'],
    date: '2026-11-19',
    notes: [
      { code: "Draggable.create(sheet, { type: 'y' })", text: { 'zh-TW': '讓元素可以被拖曳。type 決定方向：\'x\'、\'y\'、\'x,y\'，或 \'rotation\'（旋轉旋鈕）。', en: 'Makes an element draggable. type sets the direction: \'x\', \'y\', \'x,y\', or \'rotation\' for knobs.' } },
      { code: 'bounds: { minY, maxY }', text: { 'zh-TW': '限制拖曳範圍。也可以直接給一個元素，例如 bounds: \'.phone\'，就不會拖出那個框。', en: 'Limits how far it can be dragged. You can also pass an element, e.g. bounds: \'.phone\', to keep it inside that box.' } },
      { code: 'inertia: true', text: { 'zh-TW': '放開後依照甩動的速度繼續滑一段再停下，手感更像原生 App。需要另外載入 InertiaPlugin。', en: 'After release it keeps sliding with the flick velocity before stopping — feels like a native app. Requires InertiaPlugin.' } },
      { code: 'snap: gsap.utils.snap(points)', text: { 'zh-TW': '慣性滑動最後會停在最接近的吸附點。改 PEEK 和 HALF 就能調整三個位置。', en: 'The inertia glide ends on the nearest snap point. Change PEEK and HALF to adjust the three positions.' } },
      { code: 'edgeResistance: 0.85', text: { 'zh-TW': '拖超過範圍時的阻力，0 是完全不擋，1 是完全拉不動。0.8 左右最像 iOS 的「橡皮筋」手感。', en: 'Resistance when dragging past the limits: 0 is none, 1 won’t move at all. Around 0.8 feels like iOS rubber-banding.' } }
    ]
  },
  {
    id: '08-motionpath',
    title: { 'zh-TW': 'MotionPath・加入購物車', en: 'MotionPath · Add to cart' },
    short: { 'zh-TW': 'MotionPath 路徑', en: 'MotionPath cart' }, // 側欄用的短名稱
    summary: { 'zh-TW': '按下「加入購物車」，商品方塊會沿著一條弧線飛進右上角的購物車，抵達後數字加一、購物車彈一下。虛線就是飛行路徑。', en: 'Press “Add to cart” and a product square flies along an arc into the cart at the top right; when it lands the count goes up and the cart bounces. The dashed line is the flight path.' },
    topic: 'plugins',
    tags: ['MotionPathPlugin', 'arrayToRawPath', 'align'],
    date: '2026-11-19',
    notes: [
      { code: 'motionPath: { path }', text: { 'zh-TW': '讓元素沿著一條路徑移動，而不是直直地從 A 到 B。路徑可以是 SVG 的 path，也可以是一串座標點。', en: 'Moves an element along a path instead of straight from A to B. The path can be an SVG path or a list of points.' } },
      { code: 'arrayToRawPath([a, mid, b])', text: { 'zh-TW': '用三個點（起點、拱起的中間點、終點）自動產生一條平滑曲線，再轉成 SVG 的 d 屬性畫出虛線。視窗大小改變時會重畫。', en: 'Builds a smooth curve from three points (start, raised midpoint, end), then converts it to an SVG d attribute to draw the dashed line. Redrawn when the window resizes.' } },
      { code: 'curviness: 2.3', text: { 'zh-TW': '曲線的圓滑程度：0 是折線，1～2 越來越圓。改 ARC 可以讓弧線拱得更高或更低。', en: 'How round the curve is: 0 is straight segments, 1–2 gets rounder. Change ARC to raise or lower the arc.' } },
      { code: 'align + alignOrigin: [0.5, 0.5]', text: { 'zh-TW': 'align 把元素對齊到路徑的座標系統；alignOrigin 決定元素的哪一點貼著路徑走，[0.5, 0.5] 是中心點。', en: 'align maps the element onto the path’s coordinate system; alignOrigin sets which point of the element follows the path — [0.5, 0.5] is the centre.' } },
      { code: 'cloneNode()', text: { 'zh-TW': '每次點擊都複製一個新的方塊來飛，飛完就移除。所以連續點很多下，也會一個接一個飛進購物車。', en: 'Each click clones a fresh square to fly and removes it on arrival, so rapid clicks send them into the cart one after another.' } }
    ]
  },
  {
    id: '09-micro-interactions',
    title: { 'zh-TW': '按鈕微互動・磁吸與波紋', en: 'Button micro-interactions · Magnetic & ripple' },
    short: { 'zh-TW': '按鈕微互動', en: 'Button micro-interactions' }, // 側欄用的短名稱
    summary: { 'zh-TW': '兩種常見的按鈕回饋：滑鼠靠近時按鈕被吸過去的磁吸效果，以及從點擊位置擴散的波紋。按下時按鈕會稍微縮小，給手指「壓下去」的感覺。', en: 'Two common button feedbacks: a magnetic pull toward the cursor, and a ripple spreading from where you click. Pressing shrinks the button slightly so it feels pushed in.' },
    topic: 'tween',
    tags: ['gsap.quickTo', 'pointer events', 'elastic'],
    date: '2026-11-20',
    notes: [
      { code: "gsap.quickTo(el, 'x')", text: { 'zh-TW': '先建立好一個只改 x 的補間，之後每次滑鼠移動只丟新數值進去。比每次呼叫 gsap.to() 省效能，跟著滑鼠的動態都用它。', en: 'Creates a tween that only changes x, then feeds it new values on every mouse move. Cheaper than calling gsap.to() each time — use it for anything that follows the cursor.' } },
      { code: 'STRENGTH = 0.4', text: { 'zh-TW': '按鈕跟著滑鼠移動的比例。0.3～0.5 最自然；太大會像按鈕在逃跑。文字再多移一點（LABEL_EXTRA），做出前後層次。', en: 'How much the button follows the cursor. 0.3–0.5 feels natural; more and the button seems to run away. The label moves a bit further (LABEL_EXTRA) for depth.' } },
      { code: "ease: 'elastic.out(1, 0.4)'", text: { 'zh-TW': '滑鼠離開時用有彈性的 ease 回到原位，像被橡皮筋拉回來。第二個數字越小，彈得越多下。', en: 'On leave it springs back with an elastic ease, like a rubber band. The smaller the second number, the more it wobbles.' } },
      { code: "matchMedia('(hover: hover)')", text: { 'zh-TW': '只在有滑鼠的裝置啟用磁吸。手機沒有「靠近」這件事，手指一碰就是點擊。', en: 'The magnetic effect only runs on devices with a mouse. Phones have no “approach” — a touch is already a tap.' } },
      { code: 'Math.hypot(...) * 2', text: { 'zh-TW': '波紋要大到蓋住整個按鈕：用點擊位置到最遠角落的距離當半徑。本站全部直角，所以波紋用方塊擴散；加上 border-radius: 50% 就是傳統的圓形波紋。', en: 'The ripple must cover the whole button, so its radius is the distance from the click to the farthest corner. This site is square-cornered, so the ripple is a square; add border-radius: 50% for the classic round ripple.' } },
      { code: 'scale: 0.96', text: { 'zh-TW': '按下時縮小 4%，放開用 expo.out 彈回。縮太多（< 0.9）會顯得誇張。', en: 'Shrinks 4% on press and springs back with expo.out on release. Shrinking much more (< 0.9) feels exaggerated.' } }
    ]
  },
  {
    id: '10-horizontal-scroll',
    title: { 'zh-TW': '橫向捲動・固定畫面往側邊走', en: 'Horizontal scroll · Pinned section moves sideways' },
    short: { 'zh-TW': '橫向捲動', en: 'Horizontal scroll' }, // 側欄用的短名稱
    summary: { 'zh-TW': '往下捲時區塊固定在畫面上，裡面的面板改成往左移動；走完後恢復一般的直向捲動。每個面板進入畫面時，文字會跟著升起。', en: 'Scrolling down pins the section and moves its panels to the left; once they’re done, normal vertical scrolling resumes. Each panel’s text rises as it comes into view.' },
    topic: 'scroll',
    markers: true, // 作品頁預覽上方會出現 Markers 開關
    thumb: '.hs-head, .panel:nth-child(-n+2)', // 首頁縮圖對準頁首和前兩個面板（被 pin 的區塊是 fixed，量不到）
    tags: ['pin', 'scrub', 'containerAnimation'],
    date: '2026-11-20',
    notes: [
      { code: 'x: () => -distance()', text: { 'zh-TW': '軌道往左移「軌道總寬 − 畫面寬」，剛好讓最後一個面板停在畫面右邊。寫成函式，搭配 invalidateOnRefresh，視窗大小改變時會重新計算。', en: 'Moves the track left by its total width minus the screen width, so the last panel stops at the right edge. As a function with invalidateOnRefresh, it recalculates on resize.' } },
      { code: "ease: 'none'", text: { 'zh-TW': '橫向捲動一定要等速，捲多少就移多少。用 expo 之類的 ease，會覺得捲動和畫面對不上。', en: 'Horizontal scrolling must be linear — move exactly as much as you scroll. An ease like expo makes scroll and motion feel out of sync.' } },
      { code: 'pin: true', text: { 'zh-TW': '在 start 到 end 之間把區塊固定在畫面上，ScrollTrigger 會自動在下方補上等長的空白，讓頁面有東西可以捲。', en: 'Pins the section between start and end, and ScrollTrigger adds matching space below so the page has room to scroll.' } },
      { code: 'end: `+=${distance() * SPEED}`', text: { 'zh-TW': '要往下捲多遠才走完。SPEED 改成 2，就要捲兩倍遠，橫向移動感覺比較慢、比較穩。', en: 'How far you need to scroll to finish. Set SPEED to 2 and it takes twice the scroll, so the sideways motion feels slower and steadier.' } },
      { code: 'containerAnimation: move', text: { 'zh-TW': '面板是橫向移進畫面的，一般的 ScrollTrigger 看不到。用 containerAnimation 告訴它「看 move 這段動畫的進度」，start／end 也改用 left、right。', en: 'Panels enter sideways, which a normal ScrollTrigger can’t see. containerAnimation tells it to follow the progress of the move animation; start/end use left and right instead.' } }
    ]
  },
  {
    id: '11-toggle-switch',
    title: { 'zh-TW': 'Tween 開關・設定頁的 Switch', en: 'Toggle switch · Settings page' },
    short: { 'zh-TW': 'Switch 開關', en: 'Toggle switch' }, // 側欄用的短名稱
    summary: { 'zh-TW': '設定頁最常見的開關：點擊時滑塊滑到另一邊，途中被拉長再縮回，按住時滑塊先稍微變寬。顏色交給 CSS，位置和形變交給 GSAP。', en: 'The most common control on a settings page: on click the thumb slides across, stretching on the way and settling back; pressing widens it slightly first. CSS handles colour, GSAP handles position and shape.' },
    topic: 'ui',
    tags: ['gsap.to', 'overwrite', 'role="switch"'],
    date: '2026-11-23',
    notes: [
      { code: "gsap.to(thumb, { x: travel() })", text: { 'zh-TW': '滑塊只用 x（transform）移動，不改 left 或 margin，動畫才會順。移動距離用量的：軌道內寬 − 滑塊寬，改 CSS 尺寸也不用改程式。', en: 'The thumb moves with x (a transform), not left or margin, so it stays smooth. The distance is measured — track inner width minus thumb width — so changing the CSS size needs no code change.' } },
      { code: 'overwrite: true', text: { 'zh-TW': '連續快速點擊時，先停掉上一段還沒跑完的動畫，從目前的位置接著走，不會卡住或跳回起點。', en: 'When clicked rapidly, it stops the unfinished animation and continues from the current position instead of stuttering or jumping back.' } },
      { code: 'STRETCH = 1.4', text: { 'zh-TW': '移動途中把滑塊拉長 1.4 倍再縮回，從「出發的那一側」拉長（transformOrigin），看起來像往前衝。改成 1 就是單純的滑動。', en: 'Stretches the thumb 1.4× mid-move and settles back, anchored on the side it leaves from (transformOrigin), so it seems to lunge forward. Set it to 1 for a plain slide.' } },
      { code: 'transition: background-color', text: { 'zh-TW': '軌道顏色用 CSS 過渡，不用 GSAP：GSAP 會把顏色寫死在 style 上，切換亮暗模式時就不會跟著變。', en: 'Track colour uses a CSS transition rather than GSAP: GSAP would bake the colour into the style attribute, so it wouldn’t follow light/dark changes.' } },
      { code: 'role="switch" aria-checked', text: { 'zh-TW': '用 button 加上 role="switch"，鍵盤的 Enter、空白鍵都能切換，讀屏軟體會唸出「開關，開啟」。', en: 'A button with role="switch" toggles with Enter or Space, and screen readers announce “switch, on”.' } }
    ]
  },
  {
    id: '12-floating-label',
    title: { 'zh-TW': '浮動標籤輸入框・註冊表單', en: 'Floating label input · Sign-up form' },
    short: { 'zh-TW': '浮動標籤', en: 'Floating label' }, // 側欄用的短名稱
    summary: { 'zh-TW': '標籤一開始躺在輸入框裡，點進去或有內容時縮小浮到上方，底線從左邊畫出來。Email 格式不對時，欄位會輕輕搖一下並顯示錯誤。', en: 'The label starts inside the field and floats up, shrinking, when you focus or type; an underline draws in from the left. An invalid email gives the field a small shake and shows an error.' },
    topic: 'ui',
    tags: ['gsap.to', 'focus / blur', 'keyframes'],
    date: '2026-11-23',
    notes: [
      { code: "isUp = focused || value !== ''", text: { 'zh-TW': '標籤浮起的條件只有兩個：正在輸入，或已經有內容。離開欄位但有填字時，標籤要留在上方，不然會蓋住文字。', en: 'The label floats for only two reasons: the field is focused, or it has a value. If you leave a filled field the label must stay up, or it would cover the text.' } },
      { code: 'y: LIFT, scale: SCALE', text: { 'zh-TW': '只用位移和縮放（transform），不改 top 或 font-size，動畫才順。transformOrigin 設在左邊，縮小時才會貼齊輸入框的左緣。', en: 'Only translate and scale (transforms), never top or font-size, so it stays smooth. transformOrigin sits on the left so the shrunken label stays aligned to the field’s left edge.' } },
      { code: "transformOrigin: focused ? '0%' : '100%'", text: { 'zh-TW': '底線進場從左邊畫出來，離場往右收掉，方向一致看起來比較順。', en: 'The underline draws in from the left and exits to the right, so the motion reads in one direction.' } },
      { code: "addEventListener('input', update)", text: { 'zh-TW': '除了 focus／blur，也聽 input 事件：瀏覽器自動填入帳號密碼時不會觸發 focus，沒聽 input 標籤就會和文字疊在一起。', en: 'Besides focus/blur it listens to input: browser autofill doesn’t fire focus, and without input the label would overlap the filled text.' } },
      { code: 'keyframes: { x: [-6, 6, -4, 4, 0] }', text: { 'zh-TW': '錯誤時左右搖晃，幅度越來越小。搖晃要短（0.4 秒）而且小（6px 以內），太大會像在責備使用者。', en: 'A shake that gets smaller each time. Keep it short (0.4s) and small (within 6px) — bigger feels like scolding the user.' } }
    ]
  },
  {
    id: '13-submit-states',
    title: { 'zh-TW': '送出按鈕狀態・載入、成功、失敗', en: 'Submit button states · Loading, success, error' },
    short: { 'zh-TW': '送出按鈕狀態', en: 'Submit states' }, // 側欄用的短名稱
    summary: { 'zh-TW': '按下送出後，按鈕縮成方塊、裡面的小方塊開始轉；成功時撐回原本寬度並打勾，失敗時變紅並左右搖晃。勾選下方的選項就能試失敗的情況。', en: 'Pressing Send shrinks the button into a square with a small spinning square inside; on success it widens back with a check, on failure it turns red and shakes. Tick the option below to try a failure.' },
    topic: 'ui',
    tags: ['gsap.timeline', 'async / await', 'aria-busy'],
    date: '2026-11-23',
    notes: [
      { code: 'await gsap.timeline()', text: { 'zh-TW': 'GSAP 的動畫可以用 await 等它播完。流程就能照順序寫：先縮成方塊 → 等送出結果 → 再播成功或失敗，不用一層一層包 callback。', en: 'GSAP animations can be awaited. The flow reads top to bottom — shrink to a square, wait for the result, then play success or failure — without nested callbacks.' } },
      { code: "width: SQUARE → fullWidth", text: { 'zh-TW': '寬度動畫會觸發重新排版，但只影響這一顆按鈕，可以接受。原本的寬度先量好存起來，變回來時才知道要回到多寬。', en: 'Animating width triggers layout, but only for this one button, which is fine. The original width is measured once so it knows how wide to return.' } },
      { code: "rotation: '+=360', repeat: -1", text: { 'zh-TW': '載入中的小方塊無限旋轉，ease 用 none 才會等速轉。結束時要 kill() 停掉，不然會在背景一直轉。', en: 'The loading square spins forever; ease none keeps the speed constant. kill() it when done, or it keeps spinning in the background.' } },
      { code: "aria-busy='true'", text: { 'zh-TW': '送出中再點不會重複送出（防止重複下單），讀屏軟體也會知道按鈕正在忙。結果用 role="status" 的文字唸出來。', en: 'While busy, extra clicks are ignored (no double submissions) and screen readers know the button is busy. The result is announced through a role="status" element.' } },
      { code: "classList.toggle('is-fail')", text: { 'zh-TW': '失敗的紅色交給 CSS 過渡，GSAP 只管大小和位置。這樣亮暗模式切換時顏色也會正確。', en: 'The red failure colour is a CSS transition; GSAP only handles size and position, so colours stay correct across light and dark mode.' } }
    ]
  },
  {
    id: '14-toast',
    title: { 'zh-TW': 'Toast 通知・堆疊與自動消失', en: 'Toast notifications · Stack and auto-dismiss' },
    short: { 'zh-TW': 'Toast 通知', en: 'Toast' }, // 側欄用的短名稱
    summary: { 'zh-TW': '從右下角滑入的通知：新的會把舊的往上推，底部的細線顯示剩餘時間，時間到自動消失；滑鼠移上去會暫停。最多同時顯示三則。', en: 'Notifications that slide in at the bottom right: new ones push older ones up, a thin line shows the time left, and they leave on their own — hovering pauses them. Up to three at once.' },
    topic: 'ui',
    tags: ['gsap.timeline', 'height: 0', 'pause / resume'],
    date: '2026-11-23',
    notes: [
      { code: 'from(wrap, { height: 0 })', text: { 'zh-TW': '通知外面多包一層，只動這層的高度。新通知撐開時，上面的通知會平順地被推上去，不會突然跳動。', en: 'Each toast has an outer wrapper whose height animates. As a new one opens up, the ones above are pushed smoothly instead of jumping.' } },
      { code: 'timer.pause() / resume()', text: { 'zh-TW': '倒數本身就是一段 tween（細線從滿縮到 0），onComplete 時收掉通知。滑鼠移上去或鍵盤焦點在裡面時暫停，讓人有時間看完。', en: 'The countdown is itself a tween (the line shrinks to 0) that dismisses the toast on complete. It pauses on hover or keyboard focus so people have time to read.' } },
      { code: 'x: 48 → height: 0', text: { 'zh-TW': '離場分兩步：先往右滑出淡出，再把高度收成 0。如果直接移除元素，下面的通知會瞬間跳上來。', en: 'Leaving takes two steps: slide out and fade to the right, then collapse the height to 0. Removing the element directly would make the others jump.' } },
      { code: 'MAX = 3', text: { 'zh-TW': '同時太多通知會蓋住畫面。超過上限就先收掉最舊的一則。', en: 'Too many toasts at once cover the page. Over the limit, the oldest one is dismissed first.' } },
      { code: 'role="status" aria-live="polite"', text: { 'zh-TW': '讀屏軟體會在使用者停下來時唸出新通知，不會打斷正在唸的內容。錯誤要立刻提醒的話可以改用 role="alert"。', en: 'Screen readers announce new toasts when the user pauses, without interrupting. For errors that need immediate attention, use role="alert" instead.' } }
    ]
  }
];

export const TOPICS = ['tween', 'timeline', 'scroll', 'svg', 'plugins', 'ui'];
