// ═══════════════════════════════════════════════
// 作品清單：新增練習時，在陣列最後加一筆
// id 要和 works/ 底下的資料夾名稱完全相同
// topic 可用：tween、timeline、scroll、svg、plugins
// ═══════════════════════════════════════════════
export const WORKS = [
  {
    id: '01-stagger',
    title: { 'zh-TW': 'Stagger 進場・卡片列表' },
    short: { 'zh-TW': 'Stagger 進場' }, // 側欄用的短名稱
    summary: { 'zh-TW': '6 張卡片依序浮現。每張卡片上寫著自己的延遲時間，底部的時間條顯示播放進度，一眼就看得出 stagger 在做什麼。' },
    topic: 'tween',
    tags: ['gsap.from', 'stagger', 'expo.out'],
    date: '2026-11-19',
    notes: [
      { code: 'gsap.from()', text: { 'zh-TW': '從「指定的狀態」動畫回到元素原本的樣子。適合進場：寫出「從哪裡來」就好。' } },
      { code: 'STAGGER = 0.08', text: { 'zh-TW': '每張卡片之間差 0.08 秒。改成 0.3 會像一張一張排隊；改成 0 就是全部同時出現。展開下方程式碼的 JS 分頁，就可以直接改改看。' } },
      { code: 'y: 48, opacity: 0', text: { 'zh-TW': '起點：往下 48px、透明。位移太大會顯得拖沓，40～60px 比較俐落。' } },
      { code: "ease: 'expo.out'", text: { 'zh-TW': '一開始很快、最後慢慢停下，是本站統一的動態節奏。時間條用 none（等速），才看得出真實的時間長度。' } }
    ]
  },
  {
    id: '02-timeline',
    title: { 'zh-TW': 'Timeline 編排・Onboarding 三步驟' },
    short: { 'zh-TW': 'Timeline 編排' }, // 側欄用的短名稱
    summary: { 'zh-TW': '三個步驟依序進場、停留、離場，下一步會在上一步離開前提早進來。下方的時間軸會顯示播放頭和每個步驟的 label 位置。' },
    topic: 'timeline',
    tags: ['gsap.timeline', 'label', 'position'],
    date: '2026-11-19',
    notes: [
      { code: 'gsap.timeline()', text: { 'zh-TW': '把很多段動畫排在同一條時間軸上。改一段的長度，後面的會自動往後推，不用自己算 delay。' } },
      { code: "'<0.1'", text: { 'zh-TW': "位置參數：在「上一段開始後」0.1 秒播放。'<' 是同時開始，'+=1.4' 是上一段結束後再等 1.4 秒。" } },
      { code: 'OVERLAP = 0.3', text: { 'zh-TW': '下一步提早 0.3 秒進場，和上一步的離場重疊，轉場才不會有空檔。改成 0 會看到明顯的停頓。' } },
      { code: "addLabel('step2')", text: { 'zh-TW': 'label 是時間軸上的書籤。可以用 tl.play(\'step2\') 直接跳到那裡播放，下方刻度就是 label 的位置。' } },
      { code: 'function enter() { return gsap.timeline() }', text: { 'zh-TW': '每個步驟的進場寫成一個函式，回傳一段小 timeline，再用 tl.add() 放進主 timeline。三個步驟共用同一段程式碼。' } }
    ]
  },
  {
    id: '03-scroll-logo',
    title: { 'zh-TW': 'ScrollTrigger・方塊飛進頁首' },
    short: { 'zh-TW': '方塊飛進頁首' }, // 側欄用的短名稱
    summary: { 'zh-TW': '首頁開場的簡化教學版：往下捲時，標題字母往上移出，方塊轉半圈飛進頁首，接著頁首文字逐字出現。在預覽畫面裡捲動就能看到。' },
    topic: 'scroll',
    tags: ['ScrollTrigger', 'scrub', 'markers'],
    markers: true, // 作品頁預覽上方會出現 Markers 開關
    thumb: '.lockup', // 首頁縮圖要對準的主要內容（預設是 <main> 的子元素）
    date: '2026-11-19',
    notes: [
      { code: 'scrub: 0.5', text: { 'zh-TW': '讓動畫進度跟著捲軸走：往下捲前進、往上捲倒放。數字是「跟手的延遲」，0.5 會有一點滑順的拖尾；true 是完全貼著捲動。' } },
      { code: "start: 'top top'", text: { 'zh-TW': '前面是「觸發元素的哪裡」，後面是「畫面的哪裡」。這裡是 hero 的頂端碰到畫面頂端時開始。' } },
      { code: 'end: `+=${DISTANCE}`', text: { 'zh-TW': '從開始的位置再往下捲 300px 時結束。距離越長，同樣的動畫播得越慢。' } },
      { code: 'markers: SHOW_MARKERS', text: { 'zh-TW': '在畫面右側顯示 start／end 標記，方便確認觸發範圍。用預覽上方的 Markers 開關切換；上線前記得關掉。' } },
      { code: '反過來想', text: { 'zh-TW': '方塊本來就放在頁首（終點），先用 gsap.set 把它放大、移到開場的位置（起點），捲動時再讓它回家。因為頁首固定在畫面上，方塊抵達後就不會跟著頁面往上跑。' } }
    ]
  },
  {
    id: '04-svg-draw',
    title: { 'zh-TW': 'SVG 描邊・Smiley 圖示' },
    short: { 'zh-TW': 'SVG 描邊' }, // 側欄用的短名稱
    summary: { 'zh-TW': '把 Phosphor 的 Smiley 圖示一筆一筆畫出來：圓 → 左眼 → 右眼 → 微笑。下方的步驟會跟著目前畫到的那一筆亮起來，點任何一步都能從那一步重新播放。' },
    topic: 'svg',
    tags: ['DrawSVGPlugin', 'stroke', 'label'],
    date: '2026-11-19',
    notes: [
      { code: "drawSVG: 0 → '100%'", text: { 'zh-TW': 'DrawSVG 控制線條「畫出來多少」。0 是還沒畫，100% 是整條畫完；也可以寫 \'20% 80%\' 只顯示中間一段。' } },
      { code: 'fill → stroke', text: { 'zh-TW': 'Phosphor 和多數圖示庫下載的 SVG 是「外框填色」，沒有線條可以描。要做描邊動畫，得用線條（stroke）版本：Figma 裡可以取消 Outline stroke 再匯出，或像這裡照原尺寸改寫成 circle 和 path。' } },
      { code: 'rotate(-90 128 128)', text: { 'zh-TW': '圓的描邊預設從 3 點鐘方向開始。轉 -90° 就會從正上方（12 點鐘）開始畫，看起來比較自然。' } },
      { code: 'r="6" stroke-width="12"', text: { 'zh-TW': '眼睛是實心圓點：用半徑 6、線寬 12 的線條畫一圈，線條剛好填滿整個圓，看起來就像「點」被畫出來。' } },
      { code: "tl.play('left')", text: { 'zh-TW': '每一筆前面都放了 label（書籤）。點下方的步驟按鈕，就用 tl.play(label) 從那一步開始播：前面的筆畫會直接顯示成畫好，後面的會清空重畫。' } }
    ]
  },
  {
    id: '05-splittext',
    title: { 'zh-TW': 'SplitText・行／單字／字元三種拆法' },
    short: { 'zh-TW': 'SplitText 拆字' }, // 側欄用的短名稱
    summary: { 'zh-TW': '同一個外掛的三種拆法：英文標題一行一行從遮罩升起、英文句子一個單字一個單字浮現、中文一個字一個字亮起來。' },
    topic: 'plugins',
    tags: ['SplitText', 'mask', 'autoSplit'],
    date: '2026-11-19',
    notes: [
      { code: "type: 'lines'", text: { 'zh-TW': '依照「畫面上實際的換行」拆成一行一行。適合大標題；搭配 mask 就是常見的「從下方升起」效果。' } },
      { code: "type: 'words'", text: { 'zh-TW': '依照空格拆成單字。只適合英文：中文沒有空格，整句會被當成一個字。' } },
      { code: "type: 'chars'", text: { 'zh-TW': '拆成每一個字元。中文要逐字動畫就用這個。字元越多越耗效能，長段落建議改用 lines。' } },
      { code: "mask: 'lines'", text: { 'zh-TW': '在每一行外面包一層會裁切的遮罩，文字從遮罩下方升上來時不會露出來。首頁的 Motion Lab 也是用這招（mask: chars）。' } },
      { code: 'autoSplit + onSplit', text: { 'zh-TW': '字體載入或視窗變寬變窄時，換行位置會改變。autoSplit 會自動重新拆分，onSplit 回傳的動畫會自動接上，不會錯位。' } }
    ]
  },
  {
    id: '06-flip',
    title: { 'zh-TW': 'Flip・卡片展開成詳細內容' },
    short: { 'zh-TW': 'Flip 展開' }, // 側欄用的短名稱
    summary: { 'zh-TW': '點一張卡片，它會展開到最上方、其他卡片縮成一排；再點一次收合。版面只靠切換 CSS class，動畫全部交給 Flip 補上。' },
    topic: 'plugins',
    tags: ['Flip', 'getState', 'layout'],
    date: '2026-11-19',
    notes: [
      { code: 'Flip.getState(cards)', text: { 'zh-TW': '① 先記下每張卡片「現在」的位置和大小。' } },
      { code: "classList.toggle('is-active')", text: { 'zh-TW': '② 直接切換 CSS class，版面會瞬間跳到新的樣子。版面完全由 CSS 決定，設計師可以只改 CSS 調整排版。' } },
      { code: 'Flip.from(state)', text: { 'zh-TW': '③ Flip 會把每張卡片從「剛剛記下的位置」動畫到「新位置」。這三步驟就是 Flip 的全部用法。' } },
      { code: 'absolute: true', text: { 'zh-TW': '動畫期間暫時把卡片改成絕對定位，卡片之間不會互相推擠變形。格狀版面切換時幾乎都要加。' } },
      { code: 'order: -1', text: { 'zh-TW': 'CSS 的 order 可以改變格子的排列順序，不用動 HTML。展開的卡片就是靠它排到最前面。' } }
    ]
  },
  {
    id: '07-draggable',
    title: { 'zh-TW': 'Draggable・底部抽屜' },
    short: { 'zh-TW': 'Draggable 抽屜' }, // 側欄用的短名稱
    summary: { 'zh-TW': '手機常見的底部抽屜：上下拖曳，放開後依照甩動的速度繼續滑，最後吸附到「全開／半開／收合」三個位置之一。' },
    topic: 'plugins',
    tags: ['Draggable', 'InertiaPlugin', 'snap'],
    date: '2026-11-19',
    notes: [
      { code: "Draggable.create(sheet, { type: 'y' })", text: { 'zh-TW': '讓元素可以被拖曳。type 決定方向：\'x\'、\'y\'、\'x,y\'，或 \'rotation\'（旋轉旋鈕）。' } },
      { code: 'bounds: { minY, maxY }', text: { 'zh-TW': '限制拖曳範圍。也可以直接給一個元素，例如 bounds: \'.phone\'，就不會拖出那個框。' } },
      { code: 'inertia: true', text: { 'zh-TW': '放開後依照甩動的速度繼續滑一段再停下，手感更像原生 App。需要另外載入 InertiaPlugin。' } },
      { code: 'snap: gsap.utils.snap(points)', text: { 'zh-TW': '慣性滑動最後會停在最接近的吸附點。改 PEEK 和 HALF 就能調整三個位置。' } },
      { code: 'edgeResistance: 0.85', text: { 'zh-TW': '拖超過範圍時的阻力，0 是完全不擋，1 是完全拉不動。0.8 左右最像 iOS 的「橡皮筋」手感。' } }
    ]
  },
  {
    id: '08-motionpath',
    title: { 'zh-TW': 'MotionPath・加入購物車' },
    short: { 'zh-TW': 'MotionPath 路徑' }, // 側欄用的短名稱
    summary: { 'zh-TW': '按下「加入購物車」，商品方塊會沿著一條弧線飛進右上角的購物車，抵達後數字加一、購物車彈一下。虛線就是飛行路徑。' },
    topic: 'plugins',
    tags: ['MotionPathPlugin', 'arrayToRawPath', 'align'],
    date: '2026-11-19',
    notes: [
      { code: 'motionPath: { path }', text: { 'zh-TW': '讓元素沿著一條路徑移動，而不是直直地從 A 到 B。路徑可以是 SVG 的 path，也可以是一串座標點。' } },
      { code: 'arrayToRawPath([a, mid, b])', text: { 'zh-TW': '用三個點（起點、拱起的中間點、終點）自動產生一條平滑曲線，再轉成 SVG 的 d 屬性畫出虛線。視窗大小改變時會重畫。' } },
      { code: 'curviness: 2.3', text: { 'zh-TW': '曲線的圓滑程度：0 是折線，1～2 越來越圓。改 ARC 可以讓弧線拱得更高或更低。' } },
      { code: 'align + alignOrigin: [0.5, 0.5]', text: { 'zh-TW': 'align 把元素對齊到路徑的座標系統；alignOrigin 決定元素的哪一點貼著路徑走，[0.5, 0.5] 是中心點。' } },
      { code: 'cloneNode()', text: { 'zh-TW': '每次點擊都複製一個新的方塊來飛，飛完就移除。所以連續點很多下，也會一個接一個飛進購物車。' } }
    ]
  },
  {
    id: '09-micro-interactions',
    title: { 'zh-TW': '按鈕微互動・磁吸與波紋' },
    short: { 'zh-TW': '按鈕微互動' }, // 側欄用的短名稱
    summary: { 'zh-TW': '兩種常見的按鈕回饋：滑鼠靠近時按鈕被吸過去的磁吸效果，以及從點擊位置擴散的波紋。按下時按鈕會稍微縮小，給手指「壓下去」的感覺。' },
    topic: 'tween',
    tags: ['gsap.quickTo', 'pointer events', 'elastic'],
    date: '2026-11-20',
    notes: [
      { code: "gsap.quickTo(el, 'x')", text: { 'zh-TW': '先建立好一個只改 x 的補間，之後每次滑鼠移動只丟新數值進去。比每次呼叫 gsap.to() 省效能，跟著滑鼠的動態都用它。' } },
      { code: 'STRENGTH = 0.4', text: { 'zh-TW': '按鈕跟著滑鼠移動的比例。0.3～0.5 最自然；太大會像按鈕在逃跑。文字再多移一點（LABEL_EXTRA），做出前後層次。' } },
      { code: "ease: 'elastic.out(1, 0.4)'", text: { 'zh-TW': '滑鼠離開時用有彈性的 ease 回到原位，像被橡皮筋拉回來。第二個數字越小，彈得越多下。' } },
      { code: "matchMedia('(hover: hover)')", text: { 'zh-TW': '只在有滑鼠的裝置啟用磁吸。手機沒有「靠近」這件事，手指一碰就是點擊。' } },
      { code: 'Math.hypot(...) * 2', text: { 'zh-TW': '波紋要大到蓋住整個按鈕：用點擊位置到最遠角落的距離當半徑。本站全部直角，所以波紋用方塊擴散；加上 border-radius: 50% 就是傳統的圓形波紋。' } },
      { code: 'scale: 0.96', text: { 'zh-TW': '按下時縮小 4%，放開用 expo.out 彈回。縮太多（< 0.9）會顯得誇張。' } }
    ]
  },
  {
    id: '10-horizontal-scroll',
    title: { 'zh-TW': '橫向捲動・固定畫面往側邊走' },
    short: { 'zh-TW': '橫向捲動' }, // 側欄用的短名稱
    summary: { 'zh-TW': '往下捲時區塊固定在畫面上，裡面的面板改成往左移動；走完後恢復一般的直向捲動。每個面板進入畫面時，文字會跟著升起。' },
    topic: 'scroll',
    markers: true, // 作品頁預覽上方會出現 Markers 開關
    thumb: '.hs-head, .panel:nth-child(-n+2)', // 首頁縮圖對準頁首和前兩個面板（被 pin 的區塊是 fixed，量不到）
    tags: ['pin', 'scrub', 'containerAnimation'],
    date: '2026-11-20',
    notes: [
      { code: 'x: () => -distance()', text: { 'zh-TW': '軌道往左移「軌道總寬 − 畫面寬」，剛好讓最後一個面板停在畫面右邊。寫成函式，搭配 invalidateOnRefresh，視窗大小改變時會重新計算。' } },
      { code: "ease: 'none'", text: { 'zh-TW': '橫向捲動一定要等速，捲多少就移多少。用 expo 之類的 ease，會覺得捲動和畫面對不上。' } },
      { code: 'pin: true', text: { 'zh-TW': '在 start 到 end 之間把區塊固定在畫面上，ScrollTrigger 會自動在下方補上等長的空白，讓頁面有東西可以捲。' } },
      { code: 'end: `+=${distance() * SPEED}`', text: { 'zh-TW': '要往下捲多遠才走完。SPEED 改成 2，就要捲兩倍遠，橫向移動感覺比較慢、比較穩。' } },
      { code: 'containerAnimation: move', text: { 'zh-TW': '面板是橫向移進畫面的，一般的 ScrollTrigger 看不到。用 containerAnimation 告訴它「看 move 這段動畫的進度」，start／end 也改用 left、right。' } }
    ]
  }
];

export const TOPICS = ['tween', 'timeline', 'scroll', 'svg', 'plugins'];
