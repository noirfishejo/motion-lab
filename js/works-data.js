// ⚠ 自動產生的檔案，請不要直接修改。
// 要改練習的名稱、說明、筆記：改 works/<練習>/meta.json，tools/build_works.py 會重新產生這個檔案（serve.py 會自動執行）。
export const WORKS = [
  {
    "id": "01-stagger",
    "title": {
      "zh-TW": "卡片列表依序進場",
      "en": "Card list staggered entrance"
    },
    "short": {
      "zh-TW": "卡片依序進場",
      "en": "Staggered cards"
    },
    "summary": {
      "zh-TW": "6 張卡片依序浮現。每張卡片上寫著自己的延遲時間，底部的時間條顯示播放進度，一眼就看得出 stagger 在做什麼。",
      "en": "Six cards fade up one after another. Each card shows its own delay and the bar at the bottom shows playback progress, so you can see exactly what stagger does."
    },
    "topic": "transitions",
    "tech": "Stagger",
    "tags": [
      "gsap.from",
      "stagger",
      "expo.out"
    ],
    "date": "2026-11-19",
    "useCases": [
      "saas",
      "ecommerce",
      "content",
      "app"
    ],
    "cost": "light",
    "costNote": "transform",
    "notes": [
      {
        "code": "gsap.from()",
        "text": {
          "zh-TW": "從「指定的狀態」動畫回到元素原本的樣子。適合進場：寫出「從哪裡來」就好。",
          "en": "Animates from the state you specify back to the element’s natural state. Perfect for entrances: just describe where it comes from."
        }
      },
      {
        "code": "STAGGER = 0.08",
        "text": {
          "zh-TW": "每張卡片之間差 0.08 秒。改成 0.3 會像一張一張排隊；改成 0 就是全部同時出現。展開下方程式碼的 JS 分頁，就可以直接改改看。",
          "en": "Each card starts 0.08s after the previous one. Try 0.3 and they queue up one by one; 0 makes them all appear at once. Open the JS tab below to edit it live."
        }
      },
      {
        "code": "y: 48, opacity: 0",
        "text": {
          "zh-TW": "起點：往下 48px、透明。位移太大會顯得拖沓，40～60px 比較俐落。",
          "en": "Start point: 48px lower and transparent. Too much travel feels sluggish — 40–60px stays crisp."
        }
      },
      {
        "code": "ease: 'expo.out'",
        "text": {
          "zh-TW": "一開始很快、最後慢慢停下，是本站統一的動態節奏。時間條用 none（等速），才看得出真實的時間長度。",
          "en": "Fast at first, then settles slowly — the house motion rhythm of this site. The progress bar uses none (linear) so you see the real duration."
        }
      }
    ]
  },
  {
    "id": "02-timeline",
    "title": {
      "zh-TW": "新手引導三步驟轉場",
      "en": "Onboarding three-step transition"
    },
    "short": {
      "zh-TW": "新手引導轉場",
      "en": "Onboarding steps"
    },
    "summary": {
      "zh-TW": "三個步驟依序進場、停留、離場，下一步會在上一步離開前提早進來。下方的時間軸會顯示播放頭和每個步驟的 label 位置。",
      "en": "Three steps enter, hold and leave in sequence, and each next step arrives just before the previous one leaves. The timeline below shows the playhead and where each step’s label sits."
    },
    "topic": "transitions",
    "tech": "Timeline",
    "tags": [
      "gsap.timeline",
      "label",
      "position"
    ],
    "date": "2026-11-19",
    "useCases": [
      "app",
      "saas",
      "launch"
    ],
    "cost": "light",
    "costNote": "transform",
    "notes": [
      {
        "code": "gsap.timeline()",
        "text": {
          "zh-TW": "把很多段動畫排在同一條時間軸上。改一段的長度，後面的會自動往後推，不用自己算 delay。",
          "en": "Puts many animations on one shared timeline. Change the length of one part and everything after it shifts automatically — no delay maths."
        }
      },
      {
        "code": "'<0.1'",
        "text": {
          "zh-TW": "位置參數：在「上一段開始後」0.1 秒播放。'<' 是同時開始，'+=1.4' 是上一段結束後再等 1.4 秒。",
          "en": "Position parameter: start 0.1s after the previous animation starts. '<' starts at the same time, '+=1.4' waits 1.4s after the previous one ends."
        }
      },
      {
        "code": "OVERLAP = 0.3",
        "text": {
          "zh-TW": "下一步提早 0.3 秒進場，和上一步的離場重疊，轉場才不會有空檔。改成 0 會看到明顯的停頓。",
          "en": "The next step enters 0.3s early, overlapping the previous exit so the transition has no gap. Set it to 0 to see an obvious pause."
        }
      },
      {
        "code": "addLabel('step2')",
        "text": {
          "zh-TW": "label 是時間軸上的書籤。可以用 tl.play('step2') 直接跳到那裡播放，下方刻度就是 label 的位置。",
          "en": "A label is a bookmark on the timeline. tl.play('step2') jumps straight there; the ticks below mark each label."
        }
      },
      {
        "code": "function enter() { return gsap.timeline() }",
        "text": {
          "zh-TW": "每個步驟的進場寫成一個函式，回傳一段小 timeline，再用 tl.add() 放進主 timeline。三個步驟共用同一段程式碼。",
          "en": "Each step’s entrance is a function that returns a small timeline, added to the main one with tl.add(). All three steps share the same code."
        }
      }
    ],
    "thumbEnd": true
  },
  {
    "id": "03-scroll-logo",
    "title": {
      "zh-TW": "捲動時 Logo 飛進頁首",
      "en": "Logo flies into the header on scroll"
    },
    "short": {
      "zh-TW": "Logo 飛進頁首",
      "en": "Logo to header"
    },
    "summary": {
      "zh-TW": "首頁開場的簡化教學版：往下捲時，標題字母往上移出，方塊轉半圈飛進頁首，接著頁首文字逐字出現。在預覽畫面裡捲動就能看到。",
      "en": "A simplified version of the home page intro: as you scroll, the title letters slide up, the square spins half a turn into the header, then the header text appears letter by letter. Scroll inside the preview to see it."
    },
    "topic": "scroll",
    "tech": "ScrollTrigger",
    "tags": [
      "ScrollTrigger",
      "scrub",
      "markers"
    ],
    "date": "2026-11-19",
    "markers": true,
    "thumb": ".lockup",
    "useCases": [
      "brand",
      "launch"
    ],
    "cost": "light",
    "costNote": "scroll",
    "notes": [
      {
        "code": "scrub: 0.5",
        "text": {
          "zh-TW": "讓動畫進度跟著捲軸走：往下捲前進、往上捲倒放。數字是「跟手的延遲」，0.5 會有一點滑順的拖尾；true 是完全貼著捲動。",
          "en": "Ties animation progress to the scrollbar: scroll down to play, up to reverse. The number is the catch-up delay — 0.5 adds a smooth trail; true sticks exactly to the scroll."
        }
      },
      {
        "code": "start: 'top top'",
        "text": {
          "zh-TW": "前面是「觸發元素的哪裡」，後面是「畫面的哪裡」。這裡是 hero 的頂端碰到畫面頂端時開始。",
          "en": "The first word is the point on the trigger element, the second is the point on the screen. Here it starts when the top of the hero meets the top of the screen."
        }
      },
      {
        "code": "end: `+=${DISTANCE}`",
        "text": {
          "zh-TW": "從開始的位置再往下捲 300px 時結束。距離越長，同樣的動畫播得越慢。",
          "en": "Ends after scrolling another 300px from the start. The longer the distance, the slower the same animation plays."
        }
      },
      {
        "code": "markers: SHOW_MARKERS",
        "text": {
          "zh-TW": "在畫面右側顯示 start／end 標記，方便確認觸發範圍。用預覽上方的 Markers 開關切換；上線前記得關掉。",
          "en": "Shows start/end markers on the right so you can check the trigger range. Toggle them with the Markers switch above the preview — turn them off before shipping."
        }
      },
      {
        "code": {
          "zh-TW": "反過來想",
          "en": "Think backwards"
        },
        "text": {
          "zh-TW": "方塊本來就放在頁首（終點），先用 gsap.set 把它放大、移到開場的位置（起點），捲動時再讓它回家。因為頁首固定在畫面上，方塊抵達後就不會跟著頁面往上跑。",
          "en": "The square actually lives in the header (the end point). gsap.set first enlarges it and moves it to the intro position (the start), and scrolling brings it home. Because the header is fixed, the square stays put once it arrives."
        }
      }
    ]
  },
  {
    "id": "04-svg-draw",
    "title": {
      "zh-TW": "圖示描邊動畫",
      "en": "Icon line drawing"
    },
    "short": {
      "zh-TW": "圖示描邊",
      "en": "Icon drawing"
    },
    "summary": {
      "zh-TW": "把 Phosphor 的 Smiley 圖示一筆一筆畫出來：圓 → 左眼 → 右眼 → 微笑。下方的步驟會跟著目前畫到的那一筆亮起來，點任何一步都能從那一步重新播放。",
      "en": "Draws Phosphor’s Smiley icon stroke by stroke: circle → left eye → right eye → smile. The step list below lights up with the stroke being drawn, and clicking any step replays from there."
    },
    "topic": "graphics",
    "tech": "DrawSVG",
    "tags": [
      "DrawSVGPlugin",
      "stroke",
      "label"
    ],
    "date": "2026-11-19",
    "useCases": [
      "brand",
      "saas",
      "app"
    ],
    "cost": "light",
    "costNote": "svg",
    "notes": [
      {
        "code": "drawSVG: 0 → '100%'",
        "text": {
          "zh-TW": "DrawSVG 控制線條「畫出來多少」。0 是還沒畫，100% 是整條畫完；也可以寫 '20% 80%' 只顯示中間一段。",
          "en": "DrawSVG controls how much of a stroke is drawn. 0 is nothing, 100% is the full line; '20% 80%' shows only the middle part."
        }
      },
      {
        "code": "fill → stroke",
        "text": {
          "zh-TW": "Phosphor 和多數圖示庫下載的 SVG 是「外框填色」，沒有線條可以描。要做描邊動畫，得用線條（stroke）版本：Figma 裡可以取消 Outline stroke 再匯出，或像這裡照原尺寸改寫成 circle 和 path。",
          "en": "SVGs downloaded from Phosphor and most icon sets are filled outlines with no stroke to draw. For a drawing animation you need the stroke version: turn off Outline stroke in Figma before exporting, or rewrite it as circle and path at the original size like here."
        }
      },
      {
        "code": "rotate(-90 128 128)",
        "text": {
          "zh-TW": "圓的描邊預設從 3 點鐘方向開始。轉 -90° 就會從正上方（12 點鐘）開始畫，看起來比較自然。",
          "en": "A circle’s stroke starts at 3 o’clock by default. Rotating it -90° starts the drawing at 12 o’clock, which looks more natural."
        }
      },
      {
        "code": "r=\"6\" stroke-width=\"12\"",
        "text": {
          "zh-TW": "眼睛是實心圓點：用半徑 6、線寬 12 的線條畫一圈，線條剛好填滿整個圓，看起來就像「點」被畫出來。",
          "en": "The eyes are solid dots: a circle with radius 6 and stroke width 12 fills itself completely, so it looks like a dot being drawn."
        }
      },
      {
        "code": "tl.play('left')",
        "text": {
          "zh-TW": "每一筆前面都放了 label（書籤）。點下方的步驟按鈕，就用 tl.play(label) 從那一步開始播：前面的筆畫會直接顯示成畫好，後面的會清空重畫。",
          "en": "Every stroke has a label (bookmark) before it. Clicking a step calls tl.play(label): earlier strokes show as finished and later ones are cleared and redrawn."
        }
      }
    ],
    "featured": true
  },
  {
    "id": "05-splittext",
    "title": {
      "zh-TW": "標題逐行、逐字浮現",
      "en": "Text reveal by line, word and letter"
    },
    "short": {
      "zh-TW": "文字拆分浮現",
      "en": "Text reveal"
    },
    "summary": {
      "zh-TW": "同一個外掛的三種拆法：英文標題一行一行從遮罩升起、英文句子一個單字一個單字浮現、中文一個字一個字亮起來。",
      "en": "Three ways to split with the same plugin: an English headline rising line by line from a mask, an English sentence appearing word by word, and letters lighting up one by one."
    },
    "topic": "graphics",
    "tech": "SplitText",
    "tags": [
      "SplitText",
      "mask",
      "autoSplit"
    ],
    "date": "2026-11-19",
    "useCases": [
      "brand",
      "launch",
      "content"
    ],
    "cost": "medium",
    "costNote": "text",
    "notes": [
      {
        "code": "type: 'lines'",
        "text": {
          "zh-TW": "依照「畫面上實際的換行」拆成一行一行。適合大標題；搭配 mask 就是常見的「從下方升起」效果。",
          "en": "Splits by the actual line breaks on screen. Great for headlines; add a mask and you get the classic rise-from-below effect."
        }
      },
      {
        "code": "type: 'words'",
        "text": {
          "zh-TW": "依照空格拆成單字。只適合英文：中文沒有空格，整句會被當成一個字。",
          "en": "Splits on spaces. English only — Chinese has no spaces, so a whole sentence counts as one word."
        }
      },
      {
        "code": "type: 'chars'",
        "text": {
          "zh-TW": "拆成每一個字元。中文要逐字動畫就用這個。字元越多越耗效能，長段落建議改用 lines。",
          "en": "Splits into every character. Use it for per-character animation in Chinese. More characters cost more performance, so prefer lines for long paragraphs."
        }
      },
      {
        "code": "mask: 'lines'",
        "text": {
          "zh-TW": "在每一行外面包一層會裁切的遮罩，文字從遮罩下方升上來時不會露出來。首頁的 Motion Lab 也是用這招（mask: chars）。",
          "en": "Wraps each line in a clipping mask so text stays hidden while it rises from below. The home page Motion Lab title uses the same trick (mask: chars)."
        }
      },
      {
        "code": "autoSplit + onSplit",
        "text": {
          "zh-TW": "字體載入或視窗變寬變窄時，換行位置會改變。autoSplit 會自動重新拆分，onSplit 回傳的動畫會自動接上，不會錯位。",
          "en": "Line breaks change when fonts load or the window resizes. autoSplit re-splits automatically and the animation returned from onSplit is reconnected, so nothing drifts."
        }
      }
    ]
  },
  {
    "id": "06-flip",
    "title": {
      "zh-TW": "卡片展開成詳細內容",
      "en": "Card expands into details"
    },
    "short": {
      "zh-TW": "卡片展開",
      "en": "Card expand"
    },
    "summary": {
      "zh-TW": "點一張卡片，它會展開到最上方、其他卡片縮成一排；再點一次收合。版面只靠切換 CSS class，動畫全部交給 Flip 補上。",
      "en": "Click a card and it expands to the top while the others shrink into a row; click again to collapse. The layout only toggles a CSS class — Flip fills in all the animation."
    },
    "topic": "transitions",
    "tech": "Flip",
    "tags": [
      "Flip",
      "getState",
      "layout"
    ],
    "date": "2026-11-19",
    "useCases": [
      "ecommerce",
      "saas",
      "app"
    ],
    "cost": "light",
    "costNote": "flip",
    "notes": [
      {
        "code": "Flip.getState(cards)",
        "text": {
          "zh-TW": "① 先記下每張卡片「現在」的位置和大小。",
          "en": "① First record where every card is and how big it is right now."
        }
      },
      {
        "code": "classList.toggle('is-active')",
        "text": {
          "zh-TW": "② 直接切換 CSS class，版面會瞬間跳到新的樣子。版面完全由 CSS 決定，設計師可以只改 CSS 調整排版。",
          "en": "② Toggle the CSS class and the layout jumps to its new state instantly. Layout is pure CSS, so a designer can restyle it without touching JS."
        }
      },
      {
        "code": "Flip.from(state)",
        "text": {
          "zh-TW": "③ Flip 會把每張卡片從「剛剛記下的位置」動畫到「新位置」。這三步驟就是 Flip 的全部用法。",
          "en": "③ Flip animates every card from the recorded position to its new one. These three steps are all there is to Flip."
        }
      },
      {
        "code": "absolute: true",
        "text": {
          "zh-TW": "動畫期間暫時把卡片改成絕對定位，卡片之間不會互相推擠變形。格狀版面切換時幾乎都要加。",
          "en": "Temporarily positions cards absolutely during the animation so they don’t push each other out of shape. Almost always needed for grid layout changes."
        }
      },
      {
        "code": "order: -1",
        "text": {
          "zh-TW": "CSS 的 order 可以改變格子的排列順序，不用動 HTML。展開的卡片就是靠它排到最前面。",
          "en": "CSS order changes the visual order of grid items without touching the HTML. That’s how the expanded card moves to the front."
        }
      }
    ]
  },
  {
    "id": "07-draggable",
    "title": {
      "zh-TW": "可拖曳的底部抽屜",
      "en": "Draggable bottom sheet"
    },
    "short": {
      "zh-TW": "拖曳底部抽屜",
      "en": "Bottom sheet"
    },
    "summary": {
      "zh-TW": "手機常見的底部抽屜：上下拖曳，放開後依照甩動的速度繼續滑，最後吸附到「全開／半開／收合」三個位置之一。",
      "en": "A mobile-style bottom sheet: drag it up or down, release and it keeps gliding with your flick speed, then snaps to open, half or collapsed."
    },
    "topic": "pointer",
    "tech": "Draggable",
    "tags": [
      "Draggable",
      "InertiaPlugin",
      "snap"
    ],
    "date": "2026-11-19",
    "useCases": [
      "app",
      "ecommerce"
    ],
    "cost": "light",
    "costNote": "drag",
    "notes": [
      {
        "code": "Draggable.create(sheet, { type: 'y' })",
        "text": {
          "zh-TW": "讓元素可以被拖曳。type 決定方向：'x'、'y'、'x,y'，或 'rotation'（旋轉旋鈕）。",
          "en": "Makes an element draggable. type sets the direction: 'x', 'y', 'x,y', or 'rotation' for knobs."
        }
      },
      {
        "code": "bounds: { minY, maxY }",
        "text": {
          "zh-TW": "限制拖曳範圍。也可以直接給一個元素，例如 bounds: '.phone'，就不會拖出那個框。",
          "en": "Limits how far it can be dragged. You can also pass an element, e.g. bounds: '.phone', to keep it inside that box."
        }
      },
      {
        "code": "inertia: true",
        "text": {
          "zh-TW": "放開後依照甩動的速度繼續滑一段再停下，手感更像原生 App。需要另外載入 InertiaPlugin。",
          "en": "After release it keeps sliding with the flick velocity before stopping — feels like a native app. Requires InertiaPlugin."
        }
      },
      {
        "code": "snap: gsap.utils.snap(points)",
        "text": {
          "zh-TW": "慣性滑動最後會停在最接近的吸附點。改 PEEK 和 HALF 就能調整三個位置。",
          "en": "The inertia glide ends on the nearest snap point. Change PEEK and HALF to adjust the three positions."
        }
      },
      {
        "code": "edgeResistance: 0.85",
        "text": {
          "zh-TW": "拖超過範圍時的阻力，0 是完全不擋，1 是完全拉不動。0.8 左右最像 iOS 的「橡皮筋」手感。",
          "en": "Resistance when dragging past the limits: 0 is none, 1 won’t move at all. Around 0.8 feels like iOS rubber-banding."
        }
      }
    ]
  },
  {
    "id": "08-motionpath",
    "title": {
      "zh-TW": "加入購物車飛入動畫",
      "en": "Add-to-cart fly-in"
    },
    "short": {
      "zh-TW": "加入購物車",
      "en": "Add to cart"
    },
    "summary": {
      "zh-TW": "按下「加入購物車」，商品方塊會沿著一條弧線飛進右上角的購物車，抵達後數字加一、購物車彈一下。虛線就是飛行路徑。",
      "en": "Press “Add to cart” and a product square flies along an arc into the cart at the top right; when it lands the count goes up and the cart bounces. The dashed line is the flight path."
    },
    "topic": "feedback",
    "tech": "MotionPath",
    "tags": [
      "MotionPathPlugin",
      "arrayToRawPath",
      "align"
    ],
    "date": "2026-11-19",
    "useCases": [
      "ecommerce"
    ],
    "cost": "light",
    "costNote": "path",
    "notes": [
      {
        "code": "motionPath: { path }",
        "text": {
          "zh-TW": "讓元素沿著一條路徑移動，而不是直直地從 A 到 B。路徑可以是 SVG 的 path，也可以是一串座標點。",
          "en": "Moves an element along a path instead of straight from A to B. The path can be an SVG path or a list of points."
        }
      },
      {
        "code": "arrayToRawPath([a, mid, b])",
        "text": {
          "zh-TW": "用三個點（起點、拱起的中間點、終點）自動產生一條平滑曲線，再轉成 SVG 的 d 屬性畫出虛線。視窗大小改變時會重畫。",
          "en": "Builds a smooth curve from three points (start, raised midpoint, end), then converts it to an SVG d attribute to draw the dashed line. Redrawn when the window resizes."
        }
      },
      {
        "code": "curviness: 2.3",
        "text": {
          "zh-TW": "曲線的圓滑程度：0 是折線，1～2 越來越圓。改 ARC 可以讓弧線拱得更高或更低。",
          "en": "How round the curve is: 0 is straight segments, 1–2 gets rounder. Change ARC to raise or lower the arc."
        }
      },
      {
        "code": "align + alignOrigin: [0.5, 0.5]",
        "text": {
          "zh-TW": "align 把元素對齊到路徑的座標系統；alignOrigin 決定元素的哪一點貼著路徑走，[0.5, 0.5] 是中心點。",
          "en": "align maps the element onto the path’s coordinate system; alignOrigin sets which point of the element follows the path — [0.5, 0.5] is the centre."
        }
      },
      {
        "code": "cloneNode()",
        "text": {
          "zh-TW": "每次點擊都複製一個新的方塊來飛，飛完就移除。所以連續點很多下，也會一個接一個飛進購物車。",
          "en": "Each click clones a fresh square to fly and removes it on arrival, so rapid clicks send them into the cart one after another."
        }
      }
    ]
  },
  {
    "id": "09-micro-interactions",
    "title": {
      "zh-TW": "按鈕磁吸與波紋",
      "en": "Magnetic & ripple buttons"
    },
    "short": {
      "zh-TW": "按鈕磁吸＋波紋",
      "en": "Button feedback"
    },
    "summary": {
      "zh-TW": "兩種常見的按鈕回饋：滑鼠靠近時按鈕被吸過去的磁吸效果，以及從點擊位置擴散的波紋。按下時按鈕會稍微縮小，給手指「壓下去」的感覺。",
      "en": "Two common button feedbacks: a magnetic pull toward the cursor, and a ripple spreading from where you click. Pressing shrinks the button slightly so it feels pushed in."
    },
    "topic": "pointer",
    "tech": "quickTo",
    "tags": [
      "gsap.quickTo",
      "pointer events",
      "elastic"
    ],
    "date": "2026-11-20",
    "useCases": [
      "brand",
      "launch"
    ],
    "cost": "light",
    "costNote": "pointer",
    "notes": [
      {
        "code": "gsap.quickTo(el, 'x')",
        "text": {
          "zh-TW": "先建立好一個只改 x 的補間，之後每次滑鼠移動只丟新數值進去。比每次呼叫 gsap.to() 省效能，跟著滑鼠的動態都用它。",
          "en": "Creates a tween that only changes x, then feeds it new values on every mouse move. Cheaper than calling gsap.to() each time — use it for anything that follows the cursor."
        }
      },
      {
        "code": "STRENGTH = 0.4",
        "text": {
          "zh-TW": "按鈕跟著滑鼠移動的比例。0.3～0.5 最自然；太大會像按鈕在逃跑。文字再多移一點（LABEL_EXTRA），做出前後層次。",
          "en": "How much the button follows the cursor. 0.3–0.5 feels natural; more and the button seems to run away. The label moves a bit further (LABEL_EXTRA) for depth."
        }
      },
      {
        "code": "ease: 'elastic.out(1, 0.4)'",
        "text": {
          "zh-TW": "滑鼠離開時用有彈性的 ease 回到原位，像被橡皮筋拉回來。第二個數字越小，彈得越多下。",
          "en": "On leave it springs back with an elastic ease, like a rubber band. The smaller the second number, the more it wobbles."
        }
      },
      {
        "code": "matchMedia('(hover: hover)')",
        "text": {
          "zh-TW": "只在有滑鼠的裝置啟用磁吸。手機沒有「靠近」這件事，手指一碰就是點擊。",
          "en": "The magnetic effect only runs on devices with a mouse. Phones have no “approach” — a touch is already a tap."
        }
      },
      {
        "code": "Math.hypot(...) * 2",
        "text": {
          "zh-TW": "波紋要大到蓋住整個按鈕：用點擊位置到最遠角落的距離當半徑。本站全部直角，所以波紋用方塊擴散；加上 border-radius: 50% 就是傳統的圓形波紋。",
          "en": "The ripple must cover the whole button, so its radius is the distance from the click to the farthest corner. This site is square-cornered, so the ripple is a square; add border-radius: 50% for the classic round ripple."
        }
      },
      {
        "code": "scale: 0.96",
        "text": {
          "zh-TW": "按下時縮小 4%，放開用 expo.out 彈回。縮太多（< 0.9）會顯得誇張。",
          "en": "Shrinks 4% on press and springs back with expo.out on release. Shrinking much more (< 0.9) feels exaggerated."
        }
      }
    ]
  },
  {
    "id": "10-horizontal-scroll",
    "title": {
      "zh-TW": "固定畫面橫向捲動",
      "en": "Pinned horizontal scroll"
    },
    "short": {
      "zh-TW": "橫向捲動",
      "en": "Horizontal scroll"
    },
    "summary": {
      "zh-TW": "往下捲時區塊固定在畫面上，裡面的面板改成往左移動；走完後恢復一般的直向捲動。每個面板進入畫面時，文字會跟著升起。",
      "en": "Scrolling down pins the section and moves its panels to the left; once they’re done, normal vertical scrolling resumes. Each panel’s text rises as it comes into view."
    },
    "topic": "scroll",
    "tech": "ScrollTrigger",
    "tags": [
      "pin",
      "scrub",
      "containerAnimation"
    ],
    "date": "2026-11-20",
    "markers": true,
    "thumb": ".hs-head, .panel:nth-child(-n+2)",
    "useCases": [
      "brand",
      "launch"
    ],
    "cost": "medium",
    "costNote": "pin",
    "notes": [
      {
        "code": "x: () => -distance()",
        "text": {
          "zh-TW": "軌道往左移「軌道總寬 − 畫面寬」，剛好讓最後一個面板停在畫面右邊。寫成函式，搭配 invalidateOnRefresh，視窗大小改變時會重新計算。",
          "en": "Moves the track left by its total width minus the screen width, so the last panel stops at the right edge. As a function with invalidateOnRefresh, it recalculates on resize."
        }
      },
      {
        "code": "ease: 'none'",
        "text": {
          "zh-TW": "橫向捲動一定要等速，捲多少就移多少。用 expo 之類的 ease，會覺得捲動和畫面對不上。",
          "en": "Horizontal scrolling must be linear — move exactly as much as you scroll. An ease like expo makes scroll and motion feel out of sync."
        }
      },
      {
        "code": "pin: true",
        "text": {
          "zh-TW": "在 start 到 end 之間把區塊固定在畫面上，ScrollTrigger 會自動在下方補上等長的空白，讓頁面有東西可以捲。",
          "en": "Pins the section between start and end, and ScrollTrigger adds matching space below so the page has room to scroll."
        }
      },
      {
        "code": "end: `+=${distance() * SPEED}`",
        "text": {
          "zh-TW": "要往下捲多遠才走完。SPEED 改成 2，就要捲兩倍遠，橫向移動感覺比較慢、比較穩。",
          "en": "How far you need to scroll to finish. Set SPEED to 2 and it takes twice the scroll, so the sideways motion feels slower and steadier."
        }
      },
      {
        "code": "containerAnimation: move",
        "text": {
          "zh-TW": "面板是橫向移進畫面的，一般的 ScrollTrigger 看不到。用 containerAnimation 告訴它「看 move 這段動畫的進度」，start／end 也改用 left、right。",
          "en": "Panels enter sideways, which a normal ScrollTrigger can’t see. containerAnimation tells it to follow the progress of the move animation; start/end use left and right instead."
        }
      }
    ],
    "featured": true
  },
  {
    "id": "11-toggle-switch",
    "title": {
      "zh-TW": "設定頁開關",
      "en": "Settings toggle switch"
    },
    "short": {
      "zh-TW": "開關 Switch",
      "en": "Toggle switch"
    },
    "summary": {
      "zh-TW": "設定頁最常見的開關：點擊時滑塊滑到另一邊，途中被拉長再縮回，按住時滑塊先稍微變寬。顏色交給 CSS，位置和形變交給 GSAP。",
      "en": "The most common control on a settings page: on click the thumb slides across, stretching on the way and settling back; pressing widens it slightly first. CSS handles colour, GSAP handles position and shape."
    },
    "topic": "forms",
    "tech": "Tween",
    "tags": [
      "gsap.to",
      "overwrite",
      "role=\"switch\""
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "app",
      "trust"
    ],
    "cost": "light",
    "costNote": "transform",
    "notes": [
      {
        "code": "gsap.to(thumb, { x: travel() })",
        "text": {
          "zh-TW": "滑塊只用 x（transform）移動，不改 left 或 margin，動畫才會順。移動距離用量的：軌道內寬 − 滑塊寬，改 CSS 尺寸也不用改程式。",
          "en": "The thumb moves with x (a transform), not left or margin, so it stays smooth. The distance is measured — track inner width minus thumb width — so changing the CSS size needs no code change."
        }
      },
      {
        "code": "overwrite: true",
        "text": {
          "zh-TW": "連續快速點擊時，先停掉上一段還沒跑完的動畫，從目前的位置接著走，不會卡住或跳回起點。",
          "en": "When clicked rapidly, it stops the unfinished animation and continues from the current position instead of stuttering or jumping back."
        }
      },
      {
        "code": "STRETCH = 1.4",
        "text": {
          "zh-TW": "移動途中把滑塊拉長 1.4 倍再縮回，從「出發的那一側」拉長（transformOrigin），看起來像往前衝。改成 1 就是單純的滑動。",
          "en": "Stretches the thumb 1.4× mid-move and settles back, anchored on the side it leaves from (transformOrigin), so it seems to lunge forward. Set it to 1 for a plain slide."
        }
      },
      {
        "code": "transition: background-color",
        "text": {
          "zh-TW": "軌道顏色用 CSS 過渡，不用 GSAP：GSAP 會把顏色寫死在 style 上，切換亮暗模式時就不會跟著變。",
          "en": "Track colour uses a CSS transition rather than GSAP: GSAP would bake the colour into the style attribute, so it wouldn’t follow light/dark changes."
        }
      },
      {
        "code": "role=\"switch\" aria-checked",
        "text": {
          "zh-TW": "用 button 加上 role=\"switch\"，鍵盤的 Enter、空白鍵都能切換，讀屏軟體會唸出「開關，開啟」。",
          "en": "A button with role=\"switch\" toggles with Enter or Space, and screen readers announce “switch, on”."
        }
      }
    ]
  },
  {
    "id": "12-floating-label",
    "title": {
      "zh-TW": "浮動標籤輸入框",
      "en": "Floating label input"
    },
    "short": {
      "zh-TW": "浮動標籤",
      "en": "Floating label"
    },
    "summary": {
      "zh-TW": "標籤一開始躺在輸入框裡，點進去或有內容時縮小浮到上方，底線從左邊畫出來。Email 格式不對時，欄位會輕輕搖一下並顯示錯誤。",
      "en": "The label starts inside the field and floats up, shrinking, when you focus or type; an underline draws in from the left. An invalid email gives the field a small shake and shows an error."
    },
    "topic": "forms",
    "tech": "Tween",
    "tags": [
      "gsap.to",
      "focus / blur",
      "keyframes"
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "ecommerce",
      "trust",
      "app"
    ],
    "cost": "light",
    "costNote": "transform",
    "notes": [
      {
        "code": "isUp = focused || value !== ''",
        "text": {
          "zh-TW": "標籤浮起的條件只有兩個：正在輸入，或已經有內容。離開欄位但有填字時，標籤要留在上方，不然會蓋住文字。",
          "en": "The label floats for only two reasons: the field is focused, or it has a value. If you leave a filled field the label must stay up, or it would cover the text."
        }
      },
      {
        "code": "y: LIFT, scale: SCALE",
        "text": {
          "zh-TW": "只用位移和縮放（transform），不改 top 或 font-size，動畫才順。transformOrigin 設在左邊，縮小時才會貼齊輸入框的左緣。",
          "en": "Only translate and scale (transforms), never top or font-size, so it stays smooth. transformOrigin sits on the left so the shrunken label stays aligned to the field’s left edge."
        }
      },
      {
        "code": "transformOrigin: focused ? '0%' : '100%'",
        "text": {
          "zh-TW": "底線進場從左邊畫出來，離場往右收掉，方向一致看起來比較順。",
          "en": "The underline draws in from the left and exits to the right, so the motion reads in one direction."
        }
      },
      {
        "code": "addEventListener('input', update)",
        "text": {
          "zh-TW": "除了 focus／blur，也聽 input 事件：瀏覽器自動填入帳號密碼時不會觸發 focus，沒聽 input 標籤就會和文字疊在一起。",
          "en": "Besides focus/blur it listens to input: browser autofill doesn’t fire focus, and without input the label would overlap the filled text."
        }
      },
      {
        "code": "keyframes: { x: [-6, 6, -4, 4, 0] }",
        "text": {
          "zh-TW": "錯誤時左右搖晃，幅度越來越小。搖晃要短（0.4 秒）而且小（6px 以內），太大會像在責備使用者。",
          "en": "A shake that gets smaller each time. Keep it short (0.4s) and small (within 6px) — bigger feels like scolding the user."
        }
      }
    ]
  },
  {
    "id": "13-submit-states",
    "title": {
      "zh-TW": "送出按鈕的載入與結果",
      "en": "Submit button: loading and result"
    },
    "short": {
      "zh-TW": "送出按鈕狀態",
      "en": "Submit states"
    },
    "summary": {
      "zh-TW": "按下送出後，按鈕縮成方塊、裡面的小方塊開始轉；成功時撐回原本寬度並打勾，失敗時變紅並左右搖晃。勾選下方的選項就能試失敗的情況。",
      "en": "Pressing Send shrinks the button into a square with a small spinning square inside; on success it widens back with a check, on failure it turns red and shakes. Tick the option below to try a failure."
    },
    "topic": "forms",
    "tech": "Timeline",
    "tags": [
      "gsap.timeline",
      "async / await",
      "aria-busy"
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "ecommerce",
      "trust"
    ],
    "cost": "medium",
    "costNote": "layout",
    "notes": [
      {
        "code": "await gsap.timeline()",
        "text": {
          "zh-TW": "GSAP 的動畫可以用 await 等它播完。流程就能照順序寫：先縮成方塊 → 等送出結果 → 再播成功或失敗，不用一層一層包 callback。",
          "en": "GSAP animations can be awaited. The flow reads top to bottom — shrink to a square, wait for the result, then play success or failure — without nested callbacks."
        }
      },
      {
        "code": "width: SQUARE → fullWidth",
        "text": {
          "zh-TW": "寬度動畫會觸發重新排版，但只影響這一顆按鈕，可以接受。原本的寬度先量好存起來，變回來時才知道要回到多寬。",
          "en": "Animating width triggers layout, but only for this one button, which is fine. The original width is measured once so it knows how wide to return."
        }
      },
      {
        "code": "rotation: '+=360', repeat: -1",
        "text": {
          "zh-TW": "載入中的小方塊無限旋轉，ease 用 none 才會等速轉。結束時要 kill() 停掉，不然會在背景一直轉。",
          "en": "The loading square spins forever; ease none keeps the speed constant. kill() it when done, or it keeps spinning in the background."
        }
      },
      {
        "code": "aria-busy='true'",
        "text": {
          "zh-TW": "送出中再點不會重複送出（防止重複下單），讀屏軟體也會知道按鈕正在忙。結果用 role=\"status\" 的文字唸出來。",
          "en": "While busy, extra clicks are ignored (no double submissions) and screen readers know the button is busy. The result is announced through a role=\"status\" element."
        }
      },
      {
        "code": "classList.toggle('is-fail')",
        "text": {
          "zh-TW": "失敗的紅色交給 CSS 過渡，GSAP 只管大小和位置。這樣亮暗模式切換時顏色也會正確。",
          "en": "The red failure colour is a CSS transition; GSAP only handles size and position, so colours stay correct across light and dark mode."
        }
      }
    ]
  },
  {
    "id": "14-toast",
    "title": {
      "zh-TW": "堆疊式 Toast 通知",
      "en": "Stacking toast notifications"
    },
    "short": {
      "zh-TW": "Toast 通知",
      "en": "Toast"
    },
    "summary": {
      "zh-TW": "從右下角滑入的通知：新的會把舊的往上推，底部的細線顯示剩餘時間，時間到自動消失；滑鼠移上去會暫停。最多同時顯示三則。",
      "en": "Notifications that slide in at the bottom right: new ones push older ones up, a thin line shows the time left, and they leave on their own — hovering pauses them. Up to three at once."
    },
    "topic": "feedback",
    "tech": "Timeline",
    "tags": [
      "gsap.timeline",
      "height: 0",
      "pause / resume"
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "ecommerce",
      "trust",
      "app"
    ],
    "cost": "medium",
    "costNote": "layout",
    "notes": [
      {
        "code": "from(wrap, { height: 0 })",
        "text": {
          "zh-TW": "通知外面多包一層，只動這層的高度。新通知撐開時，上面的通知會平順地被推上去，不會突然跳動。",
          "en": "Each toast has an outer wrapper whose height animates. As a new one opens up, the ones above are pushed smoothly instead of jumping."
        }
      },
      {
        "code": "timer.pause() / resume()",
        "text": {
          "zh-TW": "倒數本身就是一段 tween（細線從滿縮到 0），onComplete 時收掉通知。滑鼠移上去或鍵盤焦點在裡面時暫停，讓人有時間看完。",
          "en": "The countdown is itself a tween (the line shrinks to 0) that dismisses the toast on complete. It pauses on hover or keyboard focus so people have time to read."
        }
      },
      {
        "code": "x: 48 → height: 0",
        "text": {
          "zh-TW": "離場分兩步：先往右滑出淡出，再把高度收成 0。如果直接移除元素，下面的通知會瞬間跳上來。",
          "en": "Leaving takes two steps: slide out and fade to the right, then collapse the height to 0. Removing the element directly would make the others jump."
        }
      },
      {
        "code": "MAX = 3",
        "text": {
          "zh-TW": "同時太多通知會蓋住畫面。超過上限就先收掉最舊的一則。",
          "en": "Too many toasts at once cover the page. Over the limit, the oldest one is dismissed first."
        }
      },
      {
        "code": "role=\"status\" aria-live=\"polite\"",
        "text": {
          "zh-TW": "讀屏軟體會在使用者停下來時唸出新通知，不會打斷正在唸的內容。錯誤要立刻提醒的話可以改用 role=\"alert\"。",
          "en": "Screen readers announce new toasts when the user pauses, without interrupting. For errors that need immediate attention, use role=\"alert\" instead."
        }
      }
    ]
  },
  {
    "id": "15-tabs",
    "title": {
      "zh-TW": "分頁切換的底線滑動",
      "en": "Tabs with a sliding underline"
    },
    "short": {
      "zh-TW": "分頁 Tabs",
      "en": "Tabs"
    },
    "summary": {
      "zh-TW": "帳號設定頁的四個分頁：點分頁時，底線滑到它下方並變成它的寬度，內容往分頁移動的方向滑進來。方向鍵也能切換。",
      "en": "Four tabs on an account page: the underline slides under the chosen tab and matches its width, and the content slides in from the direction you moved. Arrow keys work too."
    },
    "topic": "overlays",
    "tech": "Tween",
    "tags": [
      "gsap.to",
      "scaleX",
      "role=\"tablist\""
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "content",
      "app"
    ],
    "cost": "light",
    "costNote": "transform",
    "notes": [
      {
        "code": "x: tab.offsetLeft, scaleX: w / BASE",
        "text": {
          "zh-TW": "整排分頁只有一條底線。量出被選中分頁的位置和寬度，用 x 移過去、用 scaleX 縮放成同樣寬。只動 transform，比直接改 width、left 順。",
          "en": "There is just one underline. It measures the chosen tab’s position and width, moves with x and stretches with scaleX. Only transforms change, which is smoother than animating width or left."
        }
      },
      {
        "code": "transform-origin: 0 50%",
        "text": {
          "zh-TW": "scaleX 從左邊為基準縮放，x 才會剛好對齊分頁的左緣。少了這行，底線會從中間往兩邊縮放而錯位。",
          "en": "scaleX grows from the left edge so x lines up with the tab’s left side. Without it the line scales from its centre and drifts."
        }
      },
      {
        "code": "dir = next > current ? 1 : -1",
        "text": {
          "zh-TW": "往右邊的分頁切換時內容從右邊滑進來，往左就從左邊。方向和底線一致，空間感比單純淡入淡出清楚。",
          "en": "Moving to a tab on the right brings content in from the right, and vice versa. Matching the underline’s direction gives a clearer sense of space than a plain fade."
        }
      },
      {
        "code": "overwrite: true",
        "text": {
          "zh-TW": "快速連點不同分頁時，先停掉上一段還沒跑完的動畫，從目前的位置直接滑向新的分頁。",
          "en": "When tabs are clicked quickly, the unfinished animation is stopped and the line slides from where it is toward the new tab."
        }
      },
      {
        "code": "ArrowLeft / ArrowRight",
        "text": {
          "zh-TW": "照 WAI-ARIA 的分頁規範：Tab 鍵只會進到選中的分頁，用方向鍵切換其他分頁，Home／End 跳到頭尾。",
          "en": "Following the WAI-ARIA tabs pattern: Tab only reaches the selected tab, arrow keys move between tabs, and Home/End jump to the ends."
        }
      }
    ]
  },
  {
    "id": "16-modal-sheet",
    "title": {
      "zh-TW": "確認彈窗（手機變底部抽屜）",
      "en": "Confirm modal that becomes a bottom sheet"
    },
    "short": {
      "zh-TW": "彈窗 Modal",
      "en": "Modal / sheet"
    },
    "summary": {
      "zh-TW": "按「Delete project」打開確認彈窗：背景變暗，電腦版從下方稍微浮起、手機版從畫面底部整個滑上來。同一個元件依螢幕寬度切換，Esc、點背景都能關閉。",
      "en": "Delete project opens a confirmation: the background dims, and the dialog rises slightly on desktop or slides up from the bottom on phones. One component switches by screen width; Esc or clicking outside closes it."
    },
    "topic": "overlays",
    "tech": "Timeline",
    "tags": [
      "<dialog>",
      "showModal",
      "matchMedia"
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "trust",
      "app"
    ],
    "cost": "light",
    "costNote": "transform",
    "notes": [
      {
        "code": "dialog.showModal()",
        "text": {
          "zh-TW": "用原生的 <dialog>：焦點自動關在彈窗裡、後面的內容不能點、Esc 可以關閉、關閉後焦點回到原本的按鈕。這些無障礙細節自己做很容易漏。",
          "en": "The native <dialog> traps focus, blocks the page behind, closes on Esc and returns focus to the button afterwards — accessibility details that are easy to miss when hand-rolled."
        }
      },
      {
        "code": "addEventListener('cancel', preventDefault)",
        "text": {
          "zh-TW": "按 Esc 時瀏覽器會「立刻」關掉彈窗，關閉動畫就看不到了。先攔下來，播完動畫再 close()。",
          "en": "Esc closes the dialog instantly, skipping the exit animation. Intercept it, play the animation, then call close()."
        }
      },
      {
        "code": "::backdrop → .scrim",
        "text": {
          "zh-TW": "瀏覽器內建的 ::backdrop 沒辦法用 GSAP 控制，所以設成透明，改用一個自己的 .scrim 圖層做淡入淡出。",
          "en": "The built-in ::backdrop can’t be animated by GSAP, so it’s made transparent and a separate .scrim layer handles the fade."
        }
      },
      {
        "code": "yPercent: 100 vs y: 24, scale: 0.96",
        "text": {
          "zh-TW": "同一段程式，依 matchMedia 決定起點：手機從底部整個滑上來（底部抽屜），電腦從稍微下面、稍微小一點浮上來（置中彈窗）。",
          "en": "The same code picks its start state with matchMedia: phones slide the whole sheet up from the bottom; desktops rise a little from slightly below and slightly smaller."
        }
      },
      {
        "code": "CLOSE < OPEN",
        "text": {
          "zh-TW": "關閉（0.3 秒）比打開（0.5 秒）快。使用者已經做完決定，收起來要俐落，不要讓人等。",
          "en": "Closing (0.3s) is faster than opening (0.5s). The user has already decided — get out of the way quickly."
        }
      }
    ]
  },
  {
    "id": "17-accordion",
    "title": {
      "zh-TW": "常見問題手風琴",
      "en": "FAQ accordion"
    },
    "short": {
      "zh-TW": "手風琴",
      "en": "Accordion"
    },
    "summary": {
      "zh-TW": "點問題展開答案、再點一次收合：高度從 0 長到內容的實際高度，「＋」轉成「－」，答案文字輕輕往下浮出。預設一次只開一個。",
      "en": "Click a question to open its answer and again to close: the height grows from 0 to the real content height, “+” turns into “−”, and the answer text drifts in. One open at a time by default."
    },
    "topic": "overlays",
    "tech": "Tween",
    "tags": [
      "height: 'auto'",
      "aria-expanded",
      "hidden"
    ],
    "date": "2026-11-23",
    "useCases": [
      "content",
      "ecommerce",
      "trust",
      "saas"
    ],
    "cost": "medium",
    "costNote": "layout",
    "notes": [
      {
        "code": "height: 'auto'",
        "text": {
          "zh-TW": "CSS 沒辦法從 0 過渡到 auto，但 GSAP 可以：它會先量出內容的實際高度再動畫過去。答案多長都不用自己算。",
          "en": "CSS can’t transition from 0 to auto, but GSAP can: it measures the real content height first. Answers can be any length."
        }
      },
      {
        "code": "ONLY_ONE = true",
        "text": {
          "zh-TW": "一次只開一個，頁面比較不會忽長忽短。如果使用者常常需要比對兩個答案，改成 false 讓它們可以同時打開。",
          "en": "One at a time keeps the page from growing and shrinking a lot. If people often compare answers, set it to false so several can be open."
        }
      },
      {
        "code": "answer.hidden = true",
        "text": {
          "zh-TW": "收合動畫播完後加上 hidden，讀屏軟體和 Tab 鍵才不會跑進看不到的答案裡。打開前先拿掉 hidden，才量得到高度。",
          "en": "After closing, hidden is added so screen readers and the Tab key skip the invisible answer. It’s removed before opening so the height can be measured."
        }
      },
      {
        "code": "rotate(90deg) → 0",
        "text": {
          "zh-TW": "「＋」是兩條線，展開時直的那條轉 90° 疊到橫的上面變成「－」。這個用 CSS transition 就夠了，不需要 GSAP。",
          "en": "The “+” is two lines; opening rotates the vertical one 90° onto the horizontal one to make “−”. A CSS transition is enough here — no GSAP needed."
        }
      },
      {
        "code": "<h2><button aria-expanded>",
        "text": {
          "zh-TW": "標題外面包 h2、裡面是 button：讀屏使用者可以用標題快速跳到每個問題，按鈕會唸出「已展開／已收合」。",
          "en": "A button inside an h2: screen-reader users can jump between questions by heading, and the button announces expanded or collapsed."
        }
      }
    ]
  },
  {
    "id": "18-count-up",
    "title": {
      "zh-TW": "儀表板數字跳動計數",
      "en": "Dashboard count-up numbers"
    },
    "short": {
      "zh-TW": "數字計數",
      "en": "Count-up"
    },
    "summary": {
      "zh-TW": "三個統計數字從 0 跳到目標值，一開始很快、最後慢慢停在正確的數字。按 Refresh 換成新數字時，會從目前的值跳過去，不會每次都從 0 開始。",
      "en": "Three stats count up from 0 — fast at first, settling on the exact value. Refresh jumps from the current value to new numbers instead of restarting at 0."
    },
    "topic": "feedback",
    "tech": "Tween",
    "tags": [
      "gsap.to(object)",
      "onUpdate",
      "Intl.NumberFormat"
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "launch"
    ],
    "cost": "light",
    "costNote": "number",
    "notes": [
      {
        "code": "gsap.to(c, { n: to, onUpdate })",
        "text": {
          "zh-TW": "GSAP 不只能動畫元素，也能動畫一個普通物件的數字。改 c.n，再在 onUpdate 裡把它格式化成文字寫回畫面。",
          "en": "GSAP can tween a plain object’s number, not just elements. It changes c.n, and onUpdate formats it back into the text on screen."
        }
      },
      {
        "code": "Intl.NumberFormat",
        "text": {
          "zh-TW": "千分位、貨幣符號、小數位數交給瀏覽器內建的格式化，換語言或幣別時只要改設定，不用自己拼字串。",
          "en": "Thousands separators, currency symbols and decimals come from the built-in formatter; switching locale or currency is a setting, not string building."
        }
      },
      {
        "code": "font-variant-numeric: tabular-nums",
        "text": {
          "zh-TW": "等寬數字：跳動時每個數字一樣寬，整串數字不會左右抖動。所有會變動的數字（計時、價格）都建議加。",
          "en": "Tabular figures keep every digit the same width so the number doesn’t wobble while counting. Use it for any changing number — timers, prices."
        }
      },
      {
        "code": "ease: 'expo.out'",
        "text": {
          "zh-TW": "大部分時間花在最後幾個數字，眼睛來得及讀到結果。用 none（等速）會一直快速閃動到最後一刻才停。",
          "en": "Most of the time is spent on the last digits so the eye can catch the result. Linear (none) flickers fast right up to the final frame."
        }
      },
      {
        "code": {
          "zh-TW": "c.n（記住目前的值）",
          "en": "c.n (remembers the current value)"
        },
        "text": {
          "zh-TW": "每個數字記住目前顯示的值，Refresh 時從這裡跳到新值。配上 overwrite: true，連按也不會跳回 0。",
          "en": "Each counter remembers its current value and refreshes from there. With overwrite: true, repeated clicks never snap back to 0."
        }
      }
    ]
  },
  {
    "id": "19-blur-reveal",
    "title": {
      "zh-TW": "捲動時大字從模糊變清楚",
      "en": "Large text sharpens from blur on scroll"
    },
    "short": {
      "zh-TW": "模糊變清楚",
      "en": "Blur reveal"
    },
    "summary": {
      "zh-TW": "參考 santalarch 的大字敘事：每一行捲進畫面時，從模糊、半透明、偏下的位置，跟著捲動慢慢變清楚、到位。往回捲會再變模糊。",
      "en": "Big-type storytelling inspired by santalarch: each line starts blurred, faint and slightly low, and sharpens into place as you scroll. Scrolling back blurs it again."
    },
    "topic": "scroll",
    "tech": "ScrollTrigger",
    "tags": [
      "SplitText",
      "filter: blur",
      "scrub"
    ],
    "date": "2026-11-23",
    "markers": true,
    "thumb": ".intro, .statement:first-child",
    "useCases": [
      "brand",
      "launch"
    ],
    "cost": "heavy",
    "costNote": "blur",
    "notes": [
      {
        "code": "filter: 'blur(14px)' → 'blur(0px)'",
        "text": {
          "zh-TW": "GSAP 可以直接補間 CSS filter。模糊很吃效能，所以只用在少量的大字上，不要整頁每個元素都加。",
          "en": "GSAP can tween CSS filter directly. Blur is expensive, so keep it to a few large lines rather than every element on the page."
        }
      },
      {
        "code": "SplitText { type: 'lines' }",
        "text": {
          "zh-TW": "拆成畫面上實際的一行一行，每行各自變清楚，比整段一起變清楚更有節奏。autoSplit 讓視窗變寬變窄時重新拆行。",
          "en": "Splits into the actual on-screen lines so each one sharpens in turn — more rhythm than the whole paragraph at once. autoSplit re-splits on resize."
        }
      },
      {
        "code": "start: 'top 85%', end: 'bottom 55%'",
        "text": {
          "zh-TW": "文字頂端到畫面下方 85% 開始，底端到畫面中間偏下時全部清楚。也就是讀者讀到那裡的時候，字剛好清楚。",
          "en": "Starts when the top reaches 85% down the screen and is fully sharp when the bottom reaches 55% — right where the reader’s eyes are."
        }
      },
      {
        "code": "ease: 'none' + scrub",
        "text": {
          "zh-TW": "跟著捲動的動畫用等速，捲多少就清楚多少；scrub: 0.8 讓它稍微落後捲動一點，比較滑順。",
          "en": "Scroll-linked animation stays linear — sharpness follows scroll exactly; scrub: 0.8 trails slightly behind for smoothness."
        }
      },
      {
        "code": "stagger: 0.15",
        "text": {
          "zh-TW": "同一段裡，下一行比上一行晚一點清楚，閱讀方向和動畫方向一致。",
          "en": "Within a paragraph each line sharpens a little after the one above, matching the reading direction."
        }
      }
    ]
  },
  {
    "id": "20-skeleton",
    "title": {
      "zh-TW": "骨架屏載入與換上內容",
      "en": "Skeleton loading to real content"
    },
    "short": {
      "zh-TW": "骨架屏",
      "en": "Skeleton"
    },
    "summary": {
      "zh-TW": "資料還沒回來時先顯示和內容同形狀的灰色骨架，一道光從左上斜斜掃到右下；資料回來後骨架淡出，圖片、標題、內文依序浮現。按預覽上方的「重播」可以再看一次。",
      "en": "While data loads, grey skeletons shaped like the content catch one diagonal sweep of light from top left to bottom right; when it arrives they fade out and the image, title and text rise in order. Use Replay above the preview to watch again."
    },
    "topic": "feedback",
    "tech": "Timeline",
    "tags": [
      "repeat: -1",
      "background-attachment",
      "aria-busy"
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "content",
      "app",
      "ecommerce"
    ],
    "cost": "light",
    "costNote": "loop",
    "notes": [
      {
        "code": {
          "zh-TW": "骨架和內容疊在一起",
          "en": "Skeleton and content overlap"
        },
        "text": {
          "zh-TW": "骨架的形狀、大小和真實內容一樣，兩者放在同一個格子裡疊著。換上內容時卡片高度不變，版面不會跳動。",
          "en": "The skeleton matches the real content’s shape and size and sits in the same grid cell, so swapping doesn’t change the card’s height or shift the layout."
        }
      },
      {
        "code": "background-attachment: fixed",
        "text": {
          "zh-TW": "每一塊骨架的光澤都用「以畫面為基準」的同一張斜向漸層，再用 GSAP 移動 backgroundPosition。看起來是同一道光從左上掃到右下，經過哪塊就亮哪塊。",
          "en": "Every bone uses the same diagonal gradient anchored to the viewport, and GSAP moves its backgroundPosition. It reads as one beam sweeping from top left to bottom right, lighting each bone it passes."
        }
      },
      {
        "code": "SWEEP - shimmer.time()",
        "text": {
          "zh-TW": "資料回來時如果光正掃到一半，先等它掃完這一趟再換上內容，光不會停在中間突然消失。",
          "en": "If data arrives mid-sweep, it waits for the beam to finish its pass before swapping content, so the light never cuts out halfway."
        }
      },
      {
        "code": "shimmer.kill()",
        "text": {
          "zh-TW": "無限重複的動畫一定要在內容出現後停掉，不然看不到的骨架還會在背景一直跑。",
          "en": "Always kill an infinitely repeating animation once content appears, or hidden skeletons keep animating in the background."
        }
      },
      {
        "code": "aria-busy='true' → 'false'",
        "text": {
          "zh-TW": "載入中告訴讀屏軟體「還在忙」，骨架本身加 aria-hidden 不會被唸出來；載入完才唸真實內容。",
          "en": "aria-busy tells screen readers the area is loading, and the skeleton is aria-hidden; the real content is read once it arrives."
        }
      },
      {
        "code": {
          "zh-TW": "reduce → 不掃光",
          "en": "reduce → no shimmer"
        },
        "text": {
          "zh-TW": "開啟「減少動態」時骨架保持靜止，內容直接換上。骨架本身已經表達「載入中」，光澤只是加分。",
          "en": "With reduced motion the skeleton stays still and content swaps in directly. The skeleton already says “loading”; the shimmer is a bonus."
        }
      }
    ]
  },
  {
    "id": "21-like-burst",
    "title": {
      "zh-TW": "按讚愛心與粒子",
      "en": "Like button with particle burst"
    },
    "short": {
      "zh-TW": "按讚愛心",
      "en": "Like burst"
    },
    "summary": {
      "zh-TW": "按下愛心：空心縮掉、實心彈出，外框方塊擴散、十顆小方塊往四周噴開，按讚數往上滾一格。在圖片上點兩下也能按讚，中間會跳出大愛心。取消按讚則安靜地縮回去。",
      "en": "Tap the heart: the outline shrinks away, the filled heart pops in, a square ring expands and ten tiny squares burst outward while the count rolls up. Double-click the photo to like with a big centre heart. Unliking quietly shrinks back."
    },
    "topic": "feedback",
    "tech": "Timeline",
    "tags": [
      "back.out",
      "gsap.utils.random",
      "aria-pressed"
    ],
    "date": "2026-11-23",
    "useCases": [
      "app",
      "content"
    ],
    "cost": "light",
    "costNote": "particles",
    "notes": [
      {
        "code": "ease: 'back.out(3)'",
        "text": {
          "zh-TW": "先放大超過一點再回到原尺寸，像被按下去又彈回來。括號裡的數字越大，「超過」的幅度越大。",
          "en": "Overshoots slightly before settling, like a press that springs back. The bigger the number, the bigger the overshoot."
        }
      },
      {
        "code": "angle = i / PARTICLES × 2π",
        "text": {
          "zh-TW": "粒子沿著圓周平均分佈，再加一點隨機的角度和距離（gsap.utils.random），看起來自然而不是死板的放射狀。",
          "en": "Particles are spread evenly around a circle, then nudged with random angle and distance (gsap.utils.random) so the burst looks natural rather than rigid."
        }
      },
      {
        "code": "onComplete: () => p.remove()",
        "text": {
          "zh-TW": "每次按讚都會新增粒子，飛完一定要移除，不然連按很多次頁面上會堆滿看不見的元素。",
          "en": "New particles are created on every like, so remove them when they finish — otherwise repeated taps pile up invisible elements."
        }
      },
      {
        "code": {
          "zh-TW": "取消不噴粒子",
          "en": "No burst on unlike"
        },
        "text": {
          "zh-TW": "慶祝只給「按讚」。取消時安靜地縮回空心，動態的情緒要和動作的意義一致。",
          "en": "Celebrate only the like. Unliking quietly shrinks back — the motion’s mood should match the meaning of the action."
        }
      },
      {
        "code": "aria-pressed='true'",
        "text": {
          "zh-TW": "按讚按鈕是「切換」的按鈕，用 aria-pressed 讓讀屏軟體唸出「已按下／未按下」。點兩下圖片只是捷徑，鍵盤使用者用按鈕就好。",
          "en": "A like button is a toggle; aria-pressed lets screen readers announce pressed or not. Double-clicking the photo is a shortcut — keyboard users use the button."
        }
      }
    ]
  },
  {
    "id": "22-parallax",
    "title": {
      "zh-TW": "捲動時的圖片視差",
      "en": "Image parallax on scroll"
    },
    "short": {
      "zh-TW": "圖片視差",
      "en": "Parallax"
    },
    "summary": {
      "zh-TW": "圖片框固定、框裡的畫面移動得比頁面慢，旁邊的文字移動得比頁面快，三種速度疊出前後的距離感。往回捲時方向相反。",
      "en": "The image frame stays put while the picture inside drifts slower than the page and the text beside it moves faster — three speeds that create depth. Scrolling back reverses it."
    },
    "topic": "scroll",
    "tech": "ScrollTrigger",
    "tags": [
      "yPercent",
      "data-speed",
      "scrub"
    ],
    "date": "2026-11-23",
    "markers": true,
    "thumb": ".intro, .feature:first-of-type",
    "useCases": [
      "brand",
      "launch",
      "content"
    ],
    "cost": "light",
    "costNote": "scroll",
    "notes": [
      {
        "code": "overflow: hidden + height: 140%",
        "text": {
          "zh-TW": "圖片框裁掉超出的部分，框裡的畫面比框高 40%（上下各多 20%）。畫面在框裡上下移動，才不會露出空白。",
          "en": "The frame clips overflow, and the picture inside is 40% taller (20% extra top and bottom), so it can move without revealing gaps."
        }
      },
      {
        "code": "data-speed=\"0.2\"",
        "text": {
          "zh-TW": "正數：移動得比頁面慢，感覺在遠處；負數：比頁面快，感覺在近處。速度寫在 HTML 上，改數字就能調，不用改程式。",
          "en": "Positive values move slower than the page and feel far away; negative values move faster and feel close. Speeds live in the HTML, so tweaking needs no code."
        }
      },
      {
        "code": "start: 'top bottom', end: 'bottom top'",
        "text": {
          "zh-TW": "從元素剛出現在畫面底部，到完全離開畫面頂部，這整段捲動都在移動。視差才會連續，不會突然開始或停止。",
          "en": "Movement spans from the moment the element enters at the bottom to when it leaves at the top, so the parallax never starts or stops abruptly."
        }
      },
      {
        "code": "ease: 'none'",
        "text": {
          "zh-TW": "視差一定要等速：捲多少就移多少。用 expo 之類的 ease，捲動和畫面移動會對不上，看起來像卡頓。",
          "en": "Parallax must be linear — move exactly as much as you scroll. An ease like expo makes scrolling and movement drift apart and feel janky."
        }
      },
      {
        "code": "clamp(-14, 14, …)",
        "text": {
          "zh-TW": "視差強度要節制，10～20% 就夠，太大會讓人頭暈。這裡把畫面的移動限制在框能容納的範圍內。",
          "en": "Keep parallax subtle — 10–20% is plenty; more can make people feel seasick. The picture’s travel is clamped to what the frame can hold."
        }
      }
    ]
  },
  {
    "id": "23-hamburger-menu",
    "title": {
      "zh-TW": "漢堡選單變 × 與全螢幕選單",
      "en": "Hamburger to × with fullscreen menu"
    },
    "short": {
      "zh-TW": "漢堡選單",
      "en": "Hamburger menu"
    },
    "summary": {
      "zh-TW": "按漢堡按鈕：三條線變成 ×，藍色選單從上往下展開，選項一個一個從遮罩下方升起。關閉時把同一條時間軸倒著播，Esc 也能關。",
      "en": "Press the hamburger: three lines become ×, a blue menu unfolds from the top and items rise one by one from a mask. Closing plays the same timeline in reverse; Esc works too."
    },
    "topic": "overlays",
    "tech": "Timeline",
    "tags": [
      "tl.reverse()",
      "clip-path",
      "aria-expanded"
    ],
    "date": "2026-11-23",
    "thumb": ".page",
    "useCases": [
      "brand",
      "content",
      "app"
    ],
    "cost": "medium",
    "costNote": "clip",
    "notes": [
      {
        "code": "tl.play() / tl.reverse()",
        "text": {
          "zh-TW": "打開和關閉用同一條時間軸：打開正著播、關閉倒著播。只要寫一次動畫，兩個方向都會對。",
          "en": "One timeline for both directions: play to open, reverse to close. Write the animation once and both directions match."
        }
      },
      {
        "code": "timeScale(CLOSE_SPEED)",
        "text": {
          "zh-TW": "倒著播時加快 1.6 倍：關閉比打開快，使用者想離開時不用等。",
          "en": "Reverse at 1.6× speed: closing is faster than opening, so leaving never feels slow."
        }
      },
      {
        "code": "rotation: 45 + y: 7",
        "text": {
          "zh-TW": "上下兩條線先移到中間再各轉 45°，中間那條縮掉，就變成 ×。三條線的間距決定 y 要移多少。",
          "en": "The top and bottom lines move to the middle and rotate 45°, while the middle one shrinks away — that’s the ×. The line spacing decides how far y moves."
        }
      },
      {
        "code": "clipPath: 'inset(0% 0% 100% 0%)'",
        "text": {
          "zh-TW": "選單用 clip-path 從上面一條線展開成整個畫面，內容本身不會被壓扁或變形。",
          "en": "The menu unfolds from a line at the top with clip-path, so its content never squashes or stretches."
        }
      },
      {
        "code": "onReverseComplete → hidden",
        "text": {
          "zh-TW": "倒著播完才把選單藏起來（hidden），讀屏軟體和 Tab 鍵才不會跑進看不到的選單。",
          "en": "The menu is hidden only after reversing completes, so screen readers and Tab never land in an invisible menu."
        }
      }
    ]
  },
  {
    "id": "24-dropdown",
    "title": {
      "zh-TW": "下拉選單與滑動高亮",
      "en": "Dropdown with a sliding highlight"
    },
    "short": {
      "zh-TW": "下拉選單",
      "en": "Dropdown"
    },
    "summary": {
      "zh-TW": "點「Sort by」展開選單，滑鼠移過選項時，同一塊高亮底色跟著滑過去。方向鍵、Enter、Esc 都能操作，點外面會關閉。",
      "en": "Click “Sort by” to open the list; as the cursor moves over options, a single highlight slides along. Arrow keys, Enter and Esc work, and clicking outside closes it."
    },
    "topic": "overlays",
    "tech": "quickTo",
    "tags": [
      "gsap.quickTo",
      "role=\"listbox\"",
      "transform-origin"
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "ecommerce",
      "trust"
    ],
    "cost": "light",
    "costNote": "transform",
    "notes": [
      {
        "code": "gsap.quickTo(highlight, 'y')",
        "text": {
          "zh-TW": "整個清單只有一塊高亮底色。移到哪個選項就把它的 y 丟給 quickTo，連續移動時會很順地跟過去。",
          "en": "The list has a single highlight. Each option hovered sends its y to quickTo, so the highlight glides smoothly as you move."
        }
      },
      {
        "code": "moveY(y, y)",
        "text": {
          "zh-TW": "quickTo 的第二個值是「起點」。打開選單時起點和終點都設成目前選的那項，高亮直接出現在那裡，不會從頂端滑下來。",
          "en": "quickTo’s second value is the start. On open, start and end are the current choice, so the highlight appears there instead of sliding from the top."
        }
      },
      {
        "code": "scaleY: 0.96 → 1",
        "text": {
          "zh-TW": "展開時從稍微壓扁的狀態長出來，transform-origin 設在上方，看起來像從按鈕底下拉出來。",
          "en": "It opens from slightly squashed with transform-origin at the top, as if pulled out from under the button."
        }
      },
      {
        "code": "aria-activedescendant",
        "text": {
          "zh-TW": "焦點留在清單上，用 aria-activedescendant 告訴讀屏軟體目前停在哪個選項，方向鍵移動時才唸得出來。",
          "en": "Focus stays on the list and aria-activedescendant tells screen readers which option is active, so arrow keys are announced."
        }
      }
    ]
  },
  {
    "id": "25-marquee",
    "title": {
      "zh-TW": "無限輪播的文字跑馬燈",
      "en": "Infinite text marquee"
    },
    "short": {
      "zh-TW": "跑馬燈",
      "en": "Marquee"
    },
    "summary": {
      "zh-TW": "兩排大字一左一右無限輪播，第二排是空心字。滑鼠移上去會慢慢減速，移開再加速回來。",
      "en": "Two rows of big type loop forever in opposite directions, the second in outline. Hovering eases it down to a crawl and moving away speeds it back up."
    },
    "topic": "graphics",
    "tech": "Tween",
    "tags": [
      "repeat: -1",
      "timeScale",
      "width: max-content"
    ],
    "date": "2026-11-23",
    "useCases": [
      "brand",
      "launch",
      "ecommerce"
    ],
    "cost": "light",
    "costNote": "loop",
    "notes": [
      {
        "code": {
          "zh-TW": "內容複製兩份",
          "en": "Two copies of the content"
        },
        "text": {
          "zh-TW": "一排放兩份一模一樣的內容。第一份剛好跑出畫面時，第二份正好接在原位，從頭重來也看不出接縫。",
          "en": "Each row holds two identical copies. When the first has fully scrolled out, the second sits exactly where it started, so the restart is seamless."
        }
      },
      {
        "code": "x: 0 → -width, repeat: -1",
        "text": {
          "zh-TW": "移動的距離剛好是「一份內容的寬度」，ease 用 none 等速，repeat: -1 無限重複。",
          "en": "It moves exactly one copy’s width, linearly (ease: none), repeating forever (repeat: -1)."
        }
      },
      {
        "code": "gsap.to(loop, { timeScale: 0.2 })",
        "text": {
          "zh-TW": "timeScale 是動畫的播放速度。不直接暫停，而是用另一個補間慢慢把速度降下來，感覺像踩剎車。",
          "en": "timeScale is the playback speed. Instead of pausing, another tween eases it down — like braking rather than stopping dead."
        }
      },
      {
        "code": "duration = width / SPEED",
        "text": {
          "zh-TW": "時間用「寬度 ÷ 速度」算，內容長短不同的兩排，看起來的移動速度才會一樣。",
          "en": "Duration is width ÷ speed, so rows with different lengths move at the same visual speed."
        }
      }
    ]
  },
  {
    "id": "26-tilt-card",
    "title": {
      "zh-TW": "跟著滑鼠傾斜的 3D 卡片",
      "en": "3D card that tilts with the cursor"
    },
    "short": {
      "zh-TW": "3D 傾斜卡片",
      "en": "3D tilt card"
    },
    "summary": {
      "zh-TW": "滑鼠在卡片上移動時，卡片朝游標的方向傾斜，表面的反光跟著移動，標題和卡號浮在卡片前面一點。離開後慢慢回正。",
      "en": "As the cursor moves over the card it tilts toward it, a glare drifts across the surface, and the title and number float slightly in front. It settles back when you leave."
    },
    "topic": "pointer",
    "tech": "quickTo",
    "tags": [
      "rotationX / rotationY",
      "perspective",
      "translateZ"
    ],
    "date": "2026-11-23",
    "useCases": [
      "brand",
      "ecommerce"
    ],
    "cost": "medium",
    "costNote": "3d",
    "notes": [
      {
        "code": "perspective: 900px",
        "text": {
          "zh-TW": "外層設定透視距離，裡面的卡片轉動時才有立體感。數字越小越誇張，像把卡片貼近眼睛看。",
          "en": "Perspective on the outer element gives the rotating card depth. Smaller values exaggerate it, as if the card were closer to your eye."
        }
      },
      {
        "code": {
          "zh-TW": "px = 位置 ÷ 寬度 − 0.5",
          "en": "px = position ÷ width − 0.5"
        },
        "text": {
          "zh-TW": "把滑鼠在卡片上的位置換算成 -0.5～0.5，中間是 0，再乘上最大角度。左右移動繞 Y 軸轉，上下移動繞 X 軸轉。",
          "en": "The cursor position becomes -0.5 to 0.5 (centre is 0), times the max angle. Horizontal movement rotates around Y, vertical around X."
        }
      },
      {
        "code": "translateZ(40px)",
        "text": {
          "zh-TW": "標題往前浮 40px、卡號 24px，轉動時會和卡片表面分開，產生前後層次。外層要加 transform-style: preserve-3d。",
          "en": "The title floats 40px forward and the number 24px, separating from the surface as it rotates. The card needs transform-style: preserve-3d."
        }
      },
      {
        "code": "(hover: hover)",
        "text": {
          "zh-TW": "只在有滑鼠的裝置啟用。手機沒有「游標停在卡片上」這件事，硬做會很奇怪。",
          "en": "Only enabled with a mouse. Phones have no “cursor over the card”, so forcing it feels odd."
        }
      }
    ],
    "featured": true
  },
  {
    "id": "27-checkbox",
    "title": {
      "zh-TW": "勾選框打勾的描邊動畫",
      "en": "Checkbox with a drawn check"
    },
    "short": {
      "zh-TW": "勾選框",
      "en": "Checkbox"
    },
    "summary": {
      "zh-TW": "待辦清單的勾選框：勾選時方塊填色彈一下、勾勾一筆畫出來、文字劃上刪除線；取消時快速收回。真正的 checkbox 還在，鍵盤和讀屏軟體都能用。",
      "en": "A to-do checkbox: checking pops the fill, draws the tick in one stroke and strikes through the text; unchecking retracts quickly. The real checkbox is still there for keyboards and screen readers."
    },
    "topic": "forms",
    "tech": "DrawSVG",
    "tags": [
      "DrawSVGPlugin",
      "CSS 變數",
      "sr-only"
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "app",
      "trust"
    ],
    "cost": "light",
    "costNote": "svg",
    "notes": [
      {
        "code": "drawSVG: '0%' → '100%'",
        "text": {
          "zh-TW": "勾勾是 Phosphor 的 check 圖示，改成線條（stroke）版本才能用 DrawSVG 一筆畫出來。",
          "en": "The tick is Phosphor’s check icon converted to a stroke so DrawSVG can draw it in one line."
        }
      },
      {
        "code": "'--strike': 0 → 1",
        "text": {
          "zh-TW": "GSAP 動不到 ::after 這種偽元素，所以刪除線的長度寫成 CSS 變數，動畫改變數就好。",
          "en": "GSAP can’t reach pseudo-elements like ::after, so the strike length is a CSS variable and the animation changes the variable."
        }
      },
      {
        "code": "<input class=\"sr-only\">",
        "text": {
          "zh-TW": "真正的 checkbox 只是看不到，不是拿掉。點文字、按空白鍵、讀屏軟體都照常運作，畫面上的方塊只負責好看。",
          "en": "The real checkbox is only visually hidden, not removed. Clicking the label, pressing Space and screen readers all still work; the drawn box is just the look."
        }
      },
      {
        "code": "ease: 'back.out(2.5)'",
        "text": {
          "zh-TW": "填色放大時稍微超過再回來，像按下去的回饋。取消時用 power2.in 快速收回，不需要儀式感。",
          "en": "The fill overshoots slightly like a press; unchecking retracts quickly with power2.in — no ceremony needed."
        }
      }
    ]
  },
  {
    "id": "28-password-strength",
    "title": {
      "zh-TW": "密碼強度條",
      "en": "Password strength meter"
    },
    "short": {
      "zh-TW": "密碼強度",
      "en": "Password strength"
    },
    "summary": {
      "zh-TW": "輸入密碼時，四格強度條一次只動一格：變強時從左往右一格填滿才換下一格，變弱時從右往左清空；顏色從紅、橘、藍到綠。下方的條件符合時小方塊變綠（只是顯示狀態，不是按鈕）。",
      "en": "As you type, the four-segment meter moves one segment at a time — each fills completely before the next starts, and weaker passwords empty from the right — shifting from red through amber and blue to green. Met requirements turn their bullet green (status only, not a control)."
    },
    "topic": "forms",
    "tech": "Tween",
    "tags": [
      "timeline",
      "CSS 變數",
      "aria-live"
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "trust",
      "app"
    ],
    "cost": "light",
    "costNote": "transform",
    "notes": [
      {
        "code": {
          "zh-TW": "barsTl.to(bars[i], …)（一格接一格）",
          "en": "barsTl.to(bars[i], …) (one at a time)"
        },
        "text": {
          "zh-TW": "強度條用時間軸把每一格排成「前一格填滿、下一格才開始」，不用 stagger（stagger 會讓好幾格同時在長）。變弱時先從最右邊清空。",
          "en": "A timeline queues the segments so each starts only after the previous is full — not stagger, which overlaps them. Weaker passwords empty from the right first."
        }
      },
      {
        "code": "--level-color",
        "text": {
          "zh-TW": "強度的顏色寫成 CSS 變數放在卡片上，強度條和文字一起換色；亮暗模式各自有對應的顏色。",
          "en": "The strength colour is a CSS variable on the card, so the bar and label change together, with matching colours in light and dark mode."
        }
      },
      {
        "code": {
          "zh-TW": "項目符號，不是勾選框",
          "en": "Bullets, not checkboxes"
        },
        "text": {
          "zh-TW": "條件清單只是顯示狀態，不能點，所以不用方框和勾勾（看起來像可以勾選）。改成小方塊項目符號，符合時變綠並輕輕放大一下。",
          "en": "The requirement list only shows status and can’t be clicked, so boxes and ticks (which look tickable) are replaced by small bullets that turn green with a gentle pop."
        }
      },
      {
        "code": "aria-live=\"polite\"",
        "text": {
          "zh-TW": "強度文字（Weak、Strong）放在 aria-live 區塊，讀屏使用者打字時也會聽到強度變化。",
          "en": "The strength label sits in an aria-live region, so screen-reader users hear it change as they type."
        }
      }
    ]
  },
  {
    "id": "29-segmented-control",
    "title": {
      "zh-TW": "分段控制器與長條圖切換",
      "en": "Segmented control with chart transition"
    },
    "short": {
      "zh-TW": "分段控制",
      "en": "Segmented control"
    },
    "summary": {
      "zh-TW": "Day／Week／Month／Year 四段切換：藍色底色滑到選中的那一格，下方長條圖的每一根依序長到新的高度。方向鍵也能切換。",
      "en": "Switch between Day, Week, Month and Year: the blue pill slides to the chosen segment and each chart bar grows to its new height in turn. Arrow keys work too."
    },
    "topic": "overlays",
    "tech": "Tween",
    "tags": [
      "xPercent",
      "scaleY",
      "role=\"radiogroup\""
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "app"
    ],
    "cost": "light",
    "costNote": "transform",
    "notes": [
      {
        "code": "xPercent: index × 100",
        "text": {
          "zh-TW": "底色的寬度剛好是一格，xPercent 100 就是往右移「自己一整格」。第幾格就乘以幾，不用量位置。",
          "en": "The pill is exactly one segment wide, so xPercent 100 moves it one segment. Multiply by the index — no measuring needed."
        }
      },
      {
        "code": "scaleY + transform-origin: bottom",
        "text": {
          "zh-TW": "長條用 scaleY 從底部長高，不改 height。只動 transform，資料一換整排一起動也很順。",
          "en": "Bars grow from the bottom with scaleY rather than height. Only transforms change, so a whole row updating stays smooth."
        }
      },
      {
        "code": "scaleY: i => DATA[range][i]",
        "text": {
          "zh-TW": "一個補間處理整排長條，每根的目標值用函式從資料裡拿，再加 stagger 讓它們由左到右依序長。",
          "en": "One tween drives every bar; a function pulls each target from the data, and stagger grows them left to right."
        }
      },
      {
        "code": "role=\"radiogroup\"",
        "text": {
          "zh-TW": "分段控制在語意上是「多選一」，用 radiogroup 和 radio，方向鍵切換，讀屏軟體會唸出「第 2 個，共 4 個」。",
          "en": "A segmented control is semantically “choose one”, so it uses radiogroup and radio with arrow keys; screen readers announce “2 of 4”."
        }
      }
    ]
  },
  {
    "id": "30-progress-ring",
    "title": {
      "zh-TW": "上傳進度環",
      "en": "Upload progress ring"
    },
    "short": {
      "zh-TW": "進度環",
      "en": "Progress ring"
    },
    "summary": {
      "zh-TW": "按 Upload：進度環和長條一起前進，速度忽快忽慢像真的網路；完成時百分比淡出，環變綠、打勾彈出來。",
      "en": "Press Upload: the ring and bar advance together at an uneven, realistic pace; on completion the percentage fades, the ring turns green and a tick pops in."
    },
    "topic": "feedback",
    "tech": "DrawSVG",
    "tags": [
      "DrawSVGPlugin",
      "onUpdate",
      "rotate(-90deg)"
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "app"
    ],
    "cost": "light",
    "costNote": "svg",
    "notes": [
      {
        "code": "state = { p: 0 }",
        "text": {
          "zh-TW": "進度只存在一個數字裡，環、長條、百分比文字都在 onUpdate 裡依這個數字重畫，三者永遠同步。",
          "en": "Progress lives in one number; the ring, bar and percentage all redraw from it in onUpdate, so they always agree."
        }
      },
      {
        "code": "drawSVG: `${p * 100}%`",
        "text": {
          "zh-TW": "用 DrawSVG 把圓圈畫出百分比那麼長。SVG 轉 -90°，進度才會從 12 點鐘方向開始。",
          "en": "DrawSVG draws the circle to the percentage. The SVG is rotated -90° so progress starts at 12 o’clock."
        }
      },
      {
        "code": {
          "zh-TW": "STEPS（不等速）",
          "en": "STEPS (uneven pace)"
        },
        "text": {
          "zh-TW": "假的上傳分好幾段、每段速度不同，看起來比一路等速更真實；真實情況是依伺服器回報的進度更新 p。",
          "en": "The fake upload runs in uneven steps, which looks more real than a constant speed; in production, p follows the server’s reported progress."
        }
      },
      {
        "code": "classList.add('is-done')",
        "text": {
          "zh-TW": "完成時的綠色交給 CSS class，GSAP 只負責打勾彈出。顏色留在 CSS 裡，亮暗模式才會正確。",
          "en": "The green completion colour is a CSS class; GSAP only pops the tick. Keeping colours in CSS keeps light and dark mode correct."
        }
      }
    ]
  },
  {
    "id": "31-tooltip",
    "title": {
      "zh-TW": "工具列提示框的延遲與暖機",
      "en": "Toolbar tooltips with delay and warm-up"
    },
    "short": {
      "zh-TW": "提示框 Tooltip",
      "en": "Tooltip"
    },
    "summary": {
      "zh-TW": "編輯器工具列：滑鼠停一下才出現說明（避免滑過就閃）；說明出現後移到旁邊的按鈕，提示框直接滑過去，不用再等。鍵盤移到按鈕上會立刻顯示。",
      "en": "An editor toolbar: the hint appears only after a short pause so passing over doesn’t flash; once visible, moving to a neighbour slides it across instantly. Keyboard focus shows it right away."
    },
    "topic": "overlays",
    "tech": "Tween",
    "tags": [
      "setTimeout",
      "warm-up",
      "aria-describedby"
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas"
    ],
    "cost": "light",
    "costNote": "transform",
    "notes": [
      {
        "code": "DELAY = 0.45",
        "text": {
          "zh-TW": "第一次要停 0.45 秒才出現。太短的話，只是滑過工具列也會一直閃出提示框。",
          "en": "The first hint waits 0.45s. Any shorter and merely sweeping across the toolbar keeps flashing hints."
        }
      },
      {
        "code": {
          "zh-TW": "WARM = 0.4（暖機）",
          "en": "WARM = 0.4 (warm-up)"
        },
        "text": {
          "zh-TW": "提示框剛消失的 0.4 秒內移到其他按鈕，會立刻顯示。使用者已經在「看說明」，不該每個都再等一次。",
          "en": "Within 0.4s of a hint closing, the next one appears instantly. The user is already reading hints — don’t make them wait each time."
        }
      },
      {
        "code": {
          "zh-TW": "只有一個提示框",
          "en": "Only one tooltip"
        },
        "text": {
          "zh-TW": "整頁只有一個提示框，移到別的按鈕就用 GSAP 滑過去，比每個按鈕各自淡入淡出更穩定、不閃。",
          "en": "There is one tooltip for the page; moving between buttons slides it over with GSAP, steadier than each button fading its own."
        }
      },
      {
        "code": "aria-describedby",
        "text": {
          "zh-TW": "顯示時把按鈕和提示框連起來，讀屏軟體會在按鈕名稱後唸出說明和快捷鍵。",
          "en": "While shown, the button points to the tooltip so screen readers read the hint and shortcut after the button name."
        }
      }
    ]
  },
  {
    "id": "32-image-blur-up",
    "title": {
      "zh-TW": "圖片載入從模糊變清楚",
      "en": "Blur-up image loading"
    },
    "short": {
      "zh-TW": "圖片模糊載入",
      "en": "Blur-up loading"
    },
    "summary": {
      "zh-TW": "圖片還在載入時先顯示很模糊的預覽，載入完成後由模糊漸漸變清楚。每張圖載入時間不同，所以會一張一張清楚起來；圖片框大小固定，版面不會跳。",
      "en": "While images load, a very blurred preview shows; once loaded, each sharpens into focus. Load times differ, so they clear one by one, and the fixed frames keep the layout still."
    },
    "topic": "feedback",
    "tech": "Tween",
    "tags": [
      "filter: blur",
      "scale",
      "aspect-ratio"
    ],
    "date": "2026-11-23",
    "useCases": [
      "ecommerce",
      "content",
      "brand"
    ],
    "cost": "medium",
    "costNote": "blurOnce",
    "notes": [
      {
        "code": "filter: 'blur(24px)' → 'blur(0px)'",
        "text": {
          "zh-TW": "預覽圖先模糊，載入完成後補間到 0。真實做法是先放一張很小的低解析度圖，img 的 load 事件觸發時再換成清楚的。",
          "en": "The preview starts blurred and tweens to 0 on load. In practice you show a tiny low-res image first and swap on the img load event."
        }
      },
      {
        "code": "scale: 1.15 → 1",
        "text": {
          "zh-TW": "模糊會讓邊緣變淡、露出底色，稍微放大可以把淡掉的邊緣藏到框外面，清楚時再縮回原尺寸。",
          "en": "Blur fades the edges and reveals the background; scaling up slightly hides those edges outside the frame until it sharpens."
        }
      },
      {
        "code": "aspect-ratio: 4 / 5",
        "text": {
          "zh-TW": "圖片框先決定比例，載入前後大小都一樣，下面的內容不會因為圖片載入而被推動。",
          "en": "The frame’s ratio is fixed up front, so its size never changes and content below isn’t pushed when images load."
        }
      },
      {
        "code": "delayedCall(data-load)",
        "text": {
          "zh-TW": "示範用：每張圖片的「載入時間」寫在 HTML 上，所以會一張一張變清楚。真實情況直接聽 load 事件。",
          "en": "For the demo each image’s “load time” lives in the HTML, so they clear one at a time. In production, listen for the load event."
        }
      }
    ]
  },
  {
    "id": "33-clip-reveal",
    "title": {
      "zh-TW": "捲動時圖片從一條縫打開",
      "en": "Images open from a slit on scroll"
    },
    "short": {
      "zh-TW": "圖片遮罩揭露",
      "en": "Clip-path reveal"
    },
    "summary": {
      "zh-TW": "捲到圖片時（三張同寬），圖片用 clip-path 從一條縫慢慢打開：第一張從中間往上下撐開、第二張從左邊擦開、第三張從底部升起，裡面的圖示同時從放大縮回原尺寸。往回捲會再關上。",
      "en": "As each image scrolls in, clip-path opens it from a slit — the first splits from the centre, the second wipes from the left, the third rises from the bottom — while the icon inside zooms back to normal. Scrolling back closes them again."
    },
    "topic": "scroll",
    "tech": "ScrollTrigger",
    "tags": [
      "clip-path",
      "inset()",
      "scrub"
    ],
    "date": "2026-11-23",
    "markers": true,
    "thumb": ".intro, .shot:first-of-type",
    "useCases": [
      "brand",
      "launch",
      "content"
    ],
    "cost": "medium",
    "costNote": "clip",
    "notes": [
      {
        "code": "clipPath: 'inset(50% 0% 50% 0%)'",
        "text": {
          "zh-TW": "inset 的四個數字是「上、右、下、左各裁掉多少」。上下各裁 50% 只剩中間一條線，補間到全部 0% 就是整張打開。",
          "en": "inset’s four numbers are how much to cut from the top, right, bottom and left. Cutting 50% top and bottom leaves a line; tweening to all 0% opens it fully."
        }
      },
      {
        "code": "'inset(0% 100% 0% 0%)'",
        "text": {
          "zh-TW": "右邊裁 100%＝完全看不到，補間到 0 時會從左邊往右擦開。換一個邊就能換方向，不用改程式。",
          "en": "Cutting 100% on the right hides everything; tweening to 0 wipes in from the left. Change which side to change the direction — no code changes."
        }
      },
      {
        "code": "scale: ZOOM → 1",
        "text": {
          "zh-TW": "打開的同時，裡面的圖從放大縮回原尺寸，像鏡頭往後拉，比單純打開更有深度。外框負責裁切、裡面負責縮放，兩層分開做。",
          "en": "While it opens, the picture inside zooms back from larger, like a camera pulling out — more depth than a plain reveal. The frame clips and the inner layer scales."
        }
      },
      {
        "code": "start: 'top 85%', end: 'top 35%'",
        "text": {
          "zh-TW": "圖片頂端從畫面 85% 的位置開始打開、到 35% 時完全打開，也就是捲到畫面中間時剛好看完整張。",
          "en": "It starts opening when the image top reaches 85% of the screen and is fully open at 35% — completely visible by the middle of the screen."
        }
      }
    ]
  },
  {
    "id": "34-sticky-steps",
    "title": {
      "zh-TW": "固定畫面的功能步驟說明",
      "en": "Sticky visual with scrolling feature steps"
    },
    "short": {
      "zh-TW": "固定步驟說明",
      "en": "Sticky steps"
    },
    "summary": {
      "zh-TW": "產品介紹頁常見的版面：左邊的畫面固定不動，右邊的四個步驟一段段捲過；捲到哪一步，左邊就換成那一步的畫面，下方的進度條也跟著前進。往回捲方向相反。",
      "en": "A common product-page layout: the visual on the left stays put while four steps scroll past on the right; whichever step is in the middle, the visual switches to match and the progress marks follow. Scrolling back reverses the direction."
    },
    "topic": "scroll",
    "tech": "ScrollTrigger",
    "tags": [
      "position: sticky",
      "onToggle",
      "autoAlpha"
    ],
    "date": "2026-11-23",
    "markers": true,
    "thumb": ".media, .step:first-child",
    "useCases": [
      "launch",
      "saas"
    ],
    "cost": "light",
    "costNote": "scroll",
    "notes": [
      {
        "code": "position: sticky",
        "text": {
          "zh-TW": "左邊的固定用 CSS 的 sticky 就好，不需要 GSAP 的 pin。GSAP 只負責「現在是哪一步、換畫面」這件事，分工比較單純。",
          "en": "CSS sticky handles the fixed visual — no GSAP pin needed. GSAP only decides which step is active and swaps the visual, keeping responsibilities simple."
        }
      },
      {
        "code": "start: 'top center', end: 'bottom center'",
        "text": {
          "zh-TW": "每一步的範圍是「它經過畫面中間的這段時間」。這段時間裡它就是目前的步驟，捲過去就換下一步。",
          "en": "Each step is active while it crosses the middle of the screen; scroll past and the next one takes over."
        }
      },
      {
        "code": "onToggle: self => self.isActive && show(i)",
        "text": {
          "zh-TW": "onToggle 在「進入或離開範圍」時觸發，只在進入時換畫面。往上捲、往下捲都會正確觸發，不用自己算方向。",
          "en": "onToggle fires on entering or leaving the range; the visual changes only on entry. It works scrolling either way without tracking direction yourself."
        }
      },
      {
        "code": "y: 40 * dir",
        "text": {
          "zh-TW": "往下捲時新畫面從下面浮上來、往上捲時從上面下來，方向和捲動一致，比單純淡入淡出更清楚「往前還是往後」。",
          "en": "New visuals rise from below when scrolling down and drop from above when scrolling up — matching the scroll makes forward and back clearer than a plain fade."
        }
      }
    ]
  },
  {
    "id": "35-layout-switch",
    "title": {
      "zh-TW": "清單與格狀檢視切換",
      "en": "Switch between list and grid view"
    },
    "short": {
      "zh-TW": "清單／格狀切換",
      "en": "List / grid switch"
    },
    "summary": {
      "zh-TW": "按右上角的按鈕在清單和格狀之間切換。預設是產品裡最常見的做法：項目先淡出、版面切換、再在新的位置依序浮出，不會有縮放變形。把 MODE 改成 morph，就是用 Flip 讓每個項目從舊位置移動、縮放到新位置。",
      "en": "Toggle between list and grid with the buttons at the top right. By default it uses the most common product pattern — items fade out, the layout switches, and they rise in at their new spots without any scaling. Set MODE to morph to have Flip move and scale every item from old to new position."
    },
    "topic": "transitions",
    "tech": "Flip",
    "tags": [
      "stagger",
      "Flip",
      "nested"
    ],
    "date": "2026-11-23",
    "useCases": [
      "ecommerce",
      "saas"
    ],
    "cost": "light",
    "costNote": "flip",
    "notes": [
      {
        "code": "MODE = 'fade'",
        "text": {
          "zh-TW": "產品介面最常見的切換方式：舊版面很快淡出（0.18 秒）、瞬間換版面、新版面依序浮出。不會有縮放變形，文字一直清楚可讀。",
          "en": "The most common product pattern: the old layout fades out fast (0.18s), the layout switches instantly, and the new one rises in item by item. No scaling, so text stays crisp."
        }
      },
      {
        "code": "MODE = 'morph'",
        "text": {
          "zh-TW": "Flip 讓每個項目從舊位置移動、縮放到新位置，看得出「誰去了哪裡」。適合相簿、檔案、商品這種要追蹤同一個項目的情境；一般清單用 fade 就夠了。",
          "en": "Flip moves and scales each item from old to new position so you can see what went where. Good for photos, files and products where tracking an item matters; for ordinary lists, fade is enough."
        }
      },
      {
        "code": "classList.toggle('is-grid')",
        "text": {
          "zh-TW": "兩種模式都一樣：版面完全寫在 CSS，JS 只切換 class。設計師改清單或格狀的樣子，不用動程式。",
          "en": "Both modes share this: the layouts live entirely in CSS and JS only toggles a class, so designers can restyle either view without touching code."
        }
      },
      {
        "code": "nested: true + scale: true",
        "text": {
          "zh-TW": "morph 模式用到：裡面的方塊和文字會跟著外層一起移動，nested 讓 Flip 扣掉外層的移動；scale 讓方塊用縮放過去，比改寬高順。",
          "en": "Used in morph mode: nested accounts for the parent’s movement so children don’t drift; scale animates the thumbnail by scaling, smoother than resizing."
        }
      }
    ]
  },
  {
    "id": "36-sortable-list",
    "title": {
      "zh-TW": "可拖曳排序的清單",
      "en": "Drag-to-reorder list"
    },
    "short": {
      "zh-TW": "拖曳排序",
      "en": "Sortable list"
    },
    "summary": {
      "zh-TW": "抓住左邊的把手上下拖，其他項目會即時讓位；放開後吸到最近的位置。鍵盤用上下方向鍵也能移動，讀屏軟體會唸出新的位置。",
      "en": "Grab the handle and drag up or down; the other items make room as you go, and the row snaps into the nearest slot on release. Arrow keys move it too, and screen readers announce the new position."
    },
    "topic": "pointer",
    "tech": "Draggable",
    "tags": [
      "Draggable",
      "trigger",
      "aria-live"
    ],
    "date": "2026-11-23",
    "useCases": [
      "saas",
      "app"
    ],
    "cost": "light",
    "costNote": "drag",
    "notes": [
      {
        "code": "Draggable.create(row, { type: 'y', trigger: handle })",
        "text": {
          "zh-TW": "整列可以上下拖，但只有抓把手才會開始拖；列上其他地方還是可以點、可以選字。",
          "en": "The whole row drags vertically, but only the handle starts a drag, so the rest of the row stays clickable and selectable."
        }
      },
      {
        "code": "Math.round(this.y / ROW)",
        "text": {
          "zh-TW": "拖到哪一格：目前的位置除以每列的高度再四捨五入。格子變了，就更新順序、讓其他列讓位。",
          "en": "The target slot is the current y divided by row height, rounded. When it changes, the order updates and other rows move aside."
        }
      },
      {
        "code": "order.splice(…)",
        "text": {
          "zh-TW": "畫面上的位置不直接改 DOM，而是維護一個「順序陣列」，再依陣列把每列移到 slot × 列高。拖曳中不動 DOM，動畫才不會跳。",
          "en": "Instead of reordering the DOM mid-drag, an order array is updated and each row moves to slot × row height. Leaving the DOM alone keeps the motion smooth."
        }
      },
      {
        "code": "ArrowUp / ArrowDown",
        "text": {
          "zh-TW": "拖曳一定要有鍵盤替代方案：把手有焦點時用上下鍵一次移一格，並用 aria-live 唸出「第幾個，共幾個」。",
          "en": "Dragging always needs a keyboard alternative: with the handle focused, arrow keys move one slot and aria-live announces the position."
        }
      }
    ]
  },
  {
    "id": "37-stacking-cards",
    "title": {
      "zh-TW": "捲動時卡片堆疊",
      "en": "Cards stack as you scroll"
    },
    "short": {
      "zh-TW": "卡片堆疊",
      "en": "Stacking cards"
    },
    "summary": {
      "zh-TW": "往下捲時，下一張卡片蓋上來，被蓋住的那張往後縮小、變暗，最後疊成一疊。往回捲會一張張掀開。",
      "en": "As you scroll, each new card slides over the previous one, which shrinks back and darkens until they form a stack. Scroll back to peel them off one by one."
    },
    "topic": "scroll",
    "tech": "ScrollTrigger",
    "tags": [
      "position: sticky",
      "scrub",
      "scale"
    ],
    "date": "2026-11-23",
    "markers": true,
    "thumb": ".stack-card:first-child",
    "useCases": [
      "launch",
      "brand"
    ],
    "cost": "light",
    "costNote": "scroll",
    "notes": [
      {
        "code": "position: sticky",
        "text": {
          "zh-TW": "每張卡片都用 CSS sticky 黏在畫面上方，後面的卡片自然會捲上來蓋住前面的。堆疊本身不需要 GSAP。",
          "en": "Each card sticks to the top with CSS sticky, so later cards naturally scroll over earlier ones. The stacking itself needs no GSAP."
        }
      },
      {
        "code": "trigger: next, start: 'top bottom', end: 'top 20%'",
        "text": {
          "zh-TW": "被蓋住的卡片什麼時候縮小？看「下一張」：從它出現在畫面底部，到它黏到定位，這段捲動裡慢慢縮小變暗。",
          "en": "When does a card shrink? Watch the next card: from when it appears at the bottom until it sticks in place, the current one gradually shrinks and darkens."
        }
      },
      {
        "code": "top: calc(12vh + i × 14px)",
        "text": {
          "zh-TW": "每張卡片的黏貼位置往下錯開一點，疊起來時看得到後面卡片的上緣，比完全重疊更有層次。",
          "en": "Each card sticks slightly lower than the last, so the tops of earlier cards peek out — more depth than a perfect overlap."
        }
      },
      {
        "code": {
          "zh-TW": ".shade（黑色蓋板）",
          "en": ".shade (black overlay)"
        },
        "text": {
          "zh-TW": "變暗用一層黑色蓋板改透明度，不用 filter: brightness，比較省效能，也不會影響文字的清晰度。",
          "en": "Darkening uses a black overlay’s opacity instead of filter: brightness — cheaper, and text stays crisp."
        }
      }
    ]
  },
  {
    "id": "38-flip-filter",
    "title": {
      "zh-TW": "篩選時卡片重新排列",
      "en": "Filter with cards reflowing into place"
    },
    "short": {
      "zh-TW": "篩選重新排列",
      "en": "Filter reflow"
    },
    "summary": {
      "zh-TW": "切換分類時，被篩掉的卡片縮小淡出，留下的卡片從原位置移動補位，新出現的卡片放大淡入。比整批淡出淡入更有空間感，看得出卡片去了哪裡。",
      "en": "Switching categories shrinks and fades out the filtered cards, slides the remaining ones into the gaps, and scales in new ones. More spatial than fading everything, and you can follow where each card went."
    },
    "topic": "transitions",
    "tech": "Flip",
    "tags": [
      "Flip.from",
      "onEnter",
      "onLeave"
    ],
    "date": "2026-11-23",
    "useCases": [
      "ecommerce",
      "brand",
      "content"
    ],
    "cost": "light",
    "costNote": "flip",
    "notes": [
      {
        "code": "Flip.getState(tiles)",
        "text": {
          "zh-TW": "① 篩選前先記下所有卡片的位置。",
          "en": "① Record where every card is before filtering."
        }
      },
      {
        "code": "style.display = 'none'",
        "text": {
          "zh-TW": "② 直接把不符合的卡片藏起來，版面瞬間變成篩選後的樣子。這裡用 inline 的 display，Flip 才能暫時讓離開的卡片顯示、播完淡出再藏。",
          "en": "② Hide non-matching cards and the layout jumps to the filtered state. Inline display lets Flip briefly show leaving cards so they can fade out first."
        }
      },
      {
        "code": "onEnter / onLeave",
        "text": {
          "zh-TW": "③ Flip 把留下的卡片移動補位；新出現的交給 onEnter 放大淡入，被篩掉的交給 onLeave 縮小淡出。",
          "en": "③ Flip slides the remaining cards into place; onEnter scales new ones in and onLeave shrinks filtered ones out."
        }
      },
      {
        "code": "absolute: true",
        "text": {
          "zh-TW": "動畫期間暫時改成絕對定位，卡片在格子裡移動時不會互相推擠。",
          "en": "Cards are temporarily absolutely positioned during the animation so they don’t push each other while moving in the grid."
        }
      }
    ],
    "featured": true
  },
  {
    "id": "39-range-slider",
    "title": {
      "zh-TW": "範圍滑桿與數值泡泡",
      "en": "Range slider with a value bubble"
    },
    "short": {
      "zh-TW": "範圍滑桿",
      "en": "Range slider"
    },
    "summary": {
      "zh-TW": "拖曳方塊調整價格上限，上方的數值泡泡跟著移動，拖得快時會往反方向傾斜、放開後彈回。也可以點軌道或用方向鍵調整。",
      "en": "Drag the thumb to set a price limit; the value bubble follows, leaning away when you drag fast and springing back on release. Click the track or use arrow keys too."
    },
    "topic": "forms",
    "tech": "Draggable",
    "tags": [
      "Draggable",
      "deltaX",
      "role=\"slider\""
    ],
    "date": "2026-11-23",
    "useCases": [
      "ecommerce",
      "saas"
    ],
    "cost": "light",
    "costNote": "drag",
    "notes": [
      {
        "code": "Draggable.create(thumb, { type: 'x', bounds: slider })",
        "text": {
          "zh-TW": "方塊只能左右拖、不能拖出軌道。拖曳時用目前的 x 換算成數值，同時更新填色和泡泡的文字。",
          "en": "The thumb only moves horizontally within the track. The current x converts to a value and updates the fill and bubble text."
        }
      },
      {
        "code": "-this.deltaX × TILT",
        "text": {
          "zh-TW": "deltaX 是這一格畫面移動了多少（約等於速度）。拖得越快泡泡傾斜越多，方向相反，像被甩在後面；用 quickTo 讓角度平順。",
          "en": "deltaX is how far it moved this frame — roughly speed. Faster drags tilt the bubble more, leaning backwards; quickTo keeps the angle smooth."
        }
      },
      {
        "code": "gsap.utils.snap(STEP, …)",
        "text": {
          "zh-TW": "數值對齊到每 5 一格。拖曳時顯示對齊後的數值，放開時方塊也滑到那一格的位置。",
          "en": "Values snap to steps of 5. The bubble shows the snapped value while dragging, and the thumb settles onto that step on release."
        }
      },
      {
        "code": "role=\"slider\" + aria-valuenow",
        "text": {
          "zh-TW": "自製的滑桿要補上語意：讀屏軟體才會唸出「滑桿，200 美元」，方向鍵、Shift、Home／End 都能操作。",
          "en": "A custom slider needs semantics so screen readers announce “slider, $200”; arrow keys, Shift, Home and End all work."
        }
      }
    ]
  },
  {
    "id": "40-menu-expand",
    "title": {
      "zh-TW": "按鈕展開成導覽面板",
      "en": "Menu button that expands into a nav panel"
    },
    "short": {
      "zh-TW": "按鈕展開選單",
      "en": "Expanding menu"
    },
    "summary": {
      "zh-TW": "右上角的「Menu ＋」按鈕本身往左下撐開成導覽面板，按鈕文字像滾輪一樣換成「Close」、＋ 轉成 ×，連結一個一個升起，後方變暗。",
      "en": "The “Menu +” button at the top right grows down and left into the navigation panel, its label rolls to “Close”, + turns into ×, links rise one by one and the page behind dims."
    },
    "topic": "overlays",
    "tech": "Timeline",
    "tags": [
      "width / height",
      "tl.reverse()",
      "yPercent"
    ],
    "date": "2026-11-23",
    "thumb": ".page",
    "useCases": [
      "brand",
      "launch"
    ],
    "cost": "medium",
    "costNote": "layout",
    "notes": [
      {
        "code": {
          "zh-TW": "同一個外殼",
          "en": "One shell"
        },
        "text": {
          "zh-TW": "按鈕和面板是同一個元素：關著時只有按鈕那麼大，打開時撐開成面板。比「按鈕消失、面板出現」更有連續感，看得出面板是從按鈕來的。",
          "en": "The button and panel are the same element: closed it’s button-sized, open it grows into the panel. That continuity shows where the panel came from."
        }
      },
      {
        "code": {
          "zh-TW": "build()（每次重新量）",
          "en": "build() (measure each time)"
        },
        "text": {
          "zh-TW": "打開前先量出按鈕大小和面板內容的實際高度，再建立動畫。內容或畫面寬度改變，動畫也會對。",
          "en": "Before opening it measures the button and the panel’s real content height, then builds the animation, so it stays correct when content or screen width changes."
        }
      },
      {
        "code": "right: 16px; top: 14px",
        "text": {
          "zh-TW": "外殼靠右上定位，寬高變大時會自然往左下撐開，右上角固定不動。",
          "en": "The shell is anchored top-right, so growing its width and height naturally expands down and left while the corner stays put."
        }
      },
      {
        "code": "words → yPercent: -100",
        "text": {
          "zh-TW": "「Menu」和「Close」上下疊著放在一個遮罩裡，往上移一格就換字，像滾輪。比直接換文字更有回饋感。",
          "en": "“Menu” and “Close” are stacked in a mask; shifting up one line swaps them like a rolling counter — more tactile than swapping text."
        }
      }
    ]
  },
  {
    "id": "41-hover-image-follow",
    "title": {
      "zh-TW": "滑過專案時圖片跟著游標",
      "en": "Project list with an image that follows the cursor"
    },
    "short": {
      "zh-TW": "游標跟隨圖片",
      "en": "Hover image"
    },
    "summary": {
      "zh-TW": "作品集常見的專案清單：滑鼠移到哪一列，就有一張圖片跟著游標移動，移得快時會稍微傾斜；換到別列時，圖片像捲軸一樣上下捲到那一張。手機沒有滑過，改成每列左邊直接放小圖。",
      "en": "A common portfolio project list: hovering a row brings up an image that follows the cursor and tilts when you move fast; moving to another row scrolls the image strip to that project. Phones show a small thumbnail on each row instead."
    },
    "topic": "pointer",
    "tech": "quickTo",
    "tags": [
      "gsap.quickTo",
      "yPercent",
      "(hover: hover)"
    ],
    "date": "2026-11-23",
    "useCases": [
      "brand"
    ],
    "cost": "light",
    "costNote": "pointer",
    "notes": [
      {
        "code": "gsap.quickTo(preview, 'x')",
        "text": {
          "zh-TW": "跟著游標的東西都用 quickTo：先建立好補間，滑鼠每動一次只丟新的位置進去，比每次 gsap.to() 省效能，也比較順。",
          "en": "Anything that follows the cursor uses quickTo: build the tween once and feed it new positions — cheaper and smoother than calling gsap.to() each time."
        }
      },
      {
        "code": "moveX(x, x)",
        "text": {
          "zh-TW": "圖片第一次出現時，起點和終點都設成游標的位置，直接出現在游標旁，不會從畫面角落飛過來。",
          "en": "On first appearance the start and end are both the cursor position, so it appears right there instead of flying in from a corner."
        }
      },
      {
        "code": "strip yPercent: -i × (100 / n)",
        "text": {
          "zh-TW": "所有圖片排成一直欄放在框裡，換專案時整欄上下移動。往下一列，圖片就往上捲，方向和清單一致。",
          "en": "All images sit in one column inside the frame; changing project moves the whole column. Going down the list scrolls the images up, matching the direction."
        }
      },
      {
        "code": "@media (hover: none)",
        "text": {
          "zh-TW": "手機沒有「滑過」，跟著游標的圖片完全不會出現。改成每列左邊直接放小圖，內容才不會在手機上消失。",
          "en": "Phones have no hover, so the following image would never appear. Each row shows a small thumbnail instead so nothing is lost on mobile."
        }
      }
    ]
  },
  {
    "id": "42-falling-stack",
    "title": {
      "zh-TW": "捲動時堆疊卡片依序掉落或甩出",
      "en": "Stacked cards fall or swipe away as you scroll"
    },
    "short": {
      "zh-TW": "卡片依序掉落",
      "en": "Falling stack"
    },
    "summary": {
      "zh-TW": "和「捲動時卡片堆疊」相反：一開始就是一疊卡片，往下捲時畫面先固定住，最上面的卡片一張張離場、後面的往前遞補；全部離場後頁面才真的開始捲動。上方可切換兩種離場方式：往下掉落，或左右交替甩出。往回捲會再疊回去。",
      "en": "The reverse of “cards stack as you scroll”: it starts as a stack, the view stays pinned while the top cards leave one by one and the rest move forward; only then does the page actually scroll. Switch between two exits at the top: falling down, or swiping out left and right. Scroll back to restack them."
    },
    "topic": "scroll",
    "tech": "ScrollTrigger",
    "tags": [
      "pin",
      "scrub",
      "power2.in",
      "x / rotation"
    ],
    "date": "2026-11-23",
    "markers": true,
    "thumb": ".deck",
    "useCases": [
      "launch",
      "brand"
    ],
    "cost": "medium",
    "costNote": "pin",
    "notes": [
      {
        "code": "pin: true",
        "text": {
          "zh-TW": "把整個區塊固定在畫面上。固定的這段捲動距離拿來播掉落動畫，所以卡片沒掉完之前，頁面看起來不會往下走。",
          "en": "Pins the whole section. The pinned scroll distance drives the falling animation, so the page doesn’t appear to move until the cards are gone."
        }
      },
      {
        "code": "end: `+=${innerHeight * PER_CARD * (n - 1)}`",
        "text": {
          "zh-TW": "每張卡片分到一段捲動距離（畫面高 × 0.6）。卡片越多，要捲越久才會掉完；寫成函式，視窗大小改變時會重新計算。",
          "en": "Each card gets a slice of scroll (0.6 × screen height), so more cards mean a longer pin. As a function it recalculates on resize."
        }
      },
      {
        "code": "ease: 'power2.in'",
        "text": {
          "zh-TW": "掉落用「一開始慢、越來越快」的 ease，像受重力影響；後面的卡片往前遞補則用 power2.out，快到位、慢慢停。",
          "en": "Falling uses an ease that starts slow and speeds up, like gravity; the cards behind move forward with power2.out, arriving quickly and settling."
        }
      },
      {
        "code": "EXITS = { fall, swipe }",
        "text": {
          "zh-TW": "兩種離場方式寫成兩個函式，回傳「第 i 張卡片要動到哪裡」，其他（固定畫面、遞補）完全共用。甩出用 x 往左右交替飛出畫面（i % 2 決定方向），轉的角度比掉落大、不用淡出；切換時先把舊的 timeline 和 ScrollTrigger 拆掉再重建。",
          "en": "Each exit is a function that returns where card i should go; pinning and the move-forward are shared. Swipe flies cards out with x, alternating sides by i % 2, with more rotation and no fade. Switching kills the old timeline and its ScrollTrigger, then rebuilds."
        }
      },
      {
        "code": "stacked(n) = { y: -n × 20, scale: 1 - n × 0.06, filter: brightness(…) }",
        "text": {
          "zh-TW": "疊起來的樣子寫成一個函式：第幾張就往上錯開多少、縮小多少、暗多少。前面的卡片掉落時，後面的每張都補到「前一格」的位置，看起來就像整疊往前遞補。",
          "en": "The stacked look is one function: each card sits a bit higher, smaller and darker by its position. When the top card falls, every card behind moves to the slot in front, so the whole pile advances."
        }
      }
    ],
    "featured": true
  },
  {
    "id": "43-odometer",
    "title": {
      "zh-TW": "數字像滾輪一樣捲動的計數器",
      "en": "Counter with digits that roll like a wheel"
    },
    "short": {
      "zh-TW": "數字滾輪",
      "en": "Rolling digits"
    },
    "summary": {
      "zh-TW": "營收、價格、按讚數這類數字改變時，每一位數字像機械計數器一樣上下捲動：個位數先動、越左邊越晚停；數字變大往上捲、變小往下捲。只有真的變了的位數才會動。",
      "en": "When a revenue, price or like count changes, each digit rolls like a mechanical counter: the ones digit moves first and the leftmost stops last; it rolls up when the number grows and down when it shrinks. Only digits that actually change move."
    },
    "topic": "feedback",
    "tech": "Tween",
    "tags": [
      "yPercent",
      "stagger",
      "tabular-nums"
    ],
    "date": "2026-11-24",
    "thumb": ".card",
    "useCases": [
      "saas",
      "ecommerce",
      "launch"
    ],
    "cost": "light",
    "costNote": "transform",
    "notes": [
      {
        "code": ".col { height: 1em; overflow: hidden }",
        "text": {
          "zh-TW": "每一位數字是一條 0–9 的直條，外面的框只有一格高，所以只露出一個數字。換數字就是把直條往上或往下移，用 yPercent 移動，不管字多大都算得準。",
          "en": "Each digit is a 0–9 strip inside a one-cell-tall window, so only one number shows. Changing a digit moves the strip with yPercent, which stays accurate at any font size."
        }
      },
      {
        "code": "CELLS = 30（三組 0–9）",
        "text": {
          "zh-TW": "直條放三組 0–9，平常停在中間那組。8 → 2 往上加時捲到下一組的 2（經過 9、0），往下減就捲到上一組；捲完再用 gsap.set 無聲跳回中間，畫面一樣不會閃。",
          "en": "The strip holds three sets of 0–9 and rests on the middle one. Going up from 8 to 2 rolls into the next set (through 9 and 0); going down uses the previous set. Afterwards gsap.set snaps back to the middle invisibly."
        }
      },
      {
        "code": "delay: (digits.length - 1 - k) * STAGGER",
        "text": {
          "zh-TW": "個位數先動，越左邊越晚開始、越晚停下，像真的機械計數器。只有變了的位數才補間，沒變的保持不動，眼睛才看得出「哪裡變了」。",
          "en": "The ones digit starts first and leftward digits start and stop later, like a real counter. Only changed digits animate, so the eye can see what changed."
        }
      },
      {
        "code": "font-variant-numeric: tabular-nums",
        "text": {
          "zh-TW": "讓每個數字一樣寬，捲動時整排數字不會左右抖動。讀屏軟體則讀另一行隱藏的文字（aria-live），不讀那些直條。",
          "en": "Makes every digit the same width so the row doesn’t jiggle while rolling. Screen readers read a hidden aria-live line instead of the strips."
        }
      }
    ],
    "thumbEnd": true
  },
  {
    "id": "44-drag-carousel",
    "title": {
      "zh-TW": "可拖曳、會滑行吸附的圖片輪播",
      "en": "Image carousel you can drag, fling and snap"
    },
    "short": {
      "zh-TW": "拖曳輪播",
      "en": "Drag carousel"
    },
    "summary": {
      "zh-TW": "左右拖曳圖片輪播，放開後依照甩動的速度繼續滑行，最後吸附到最近的一張；甩得快可以一次跳過好幾張。拉到頭尾會有阻力。也可以用箭頭按鈕、圓點或鍵盤左右鍵切換。",
      "en": "Drag the carousel sideways; on release it glides with your fling speed and snaps to the nearest slide — fling hard to skip several. The ends resist. Arrow buttons, dots and the keyboard arrow keys also work."
    },
    "topic": "pointer",
    "tech": "Draggable",
    "tags": [
      "InertiaPlugin",
      "snap",
      "edgeResistance"
    ],
    "date": "2026-11-24",
    "thumb": ".stage",
    "useCases": [
      "ecommerce",
      "content",
      "app",
      "brand"
    ],
    "cost": "light",
    "costNote": "drag",
    "notes": [
      {
        "code": "inertia: true",
        "text": {
          "zh-TW": "放開後依照手指或滑鼠甩動的速度繼續滑（需要 InertiaPlugin，3.13 起免費）。沒有慣性的輪播放開就停，會覺得「黏手」。",
          "en": "After release the track keeps gliding at your fling speed (InertiaPlugin, free since 3.13). Without inertia a carousel stops dead on release and feels sticky."
        }
      },
      {
        "code": "snap: x => gsap.utils.snap(stops, x)",
        "text": {
          "zh-TW": "慣性算出來的落點會被吸到最近的一張。stops 是每一張對齊左邊時 track 的位置；給 snap 一個陣列，它會回傳最接近的值。",
          "en": "The landing point of the glide snaps to the nearest slide. stops holds the track position for each slide; given an array, snap returns the closest value."
        }
      },
      {
        "code": "touch-action: pan-y",
        "text": {
          "zh-TW": "手機上「上下滑」仍然交給瀏覽器捲動頁面，只有左右滑才是拖曳輪播，不然輪播會擋住整頁的捲動。",
          "en": "On phones, vertical swipes still scroll the page and only horizontal ones drag the carousel; otherwise the carousel would block page scrolling."
        }
      },
      {
        "code": "onUpdate: () => drag.update()",
        "text": {
          "zh-TW": "用按鈕切換時是 gsap.to 在移動 track，要通知 Draggable 位置變了，下一次拖曳才會從正確的位置開始。",
          "en": "When buttons move the track with gsap.to, tell Draggable the position changed so the next drag starts from the right place."
        }
      }
    ]
  },
  {
    "id": "45-quantity-stepper",
    "title": {
      "zh-TW": "購物車數量增減按鈕",
      "en": "Cart quantity stepper"
    },
    "short": {
      "zh-TW": "數量增減",
      "en": "Quantity stepper"
    },
    "summary": {
      "zh-TW": "電商購物車常見的「－ 1 ＋」：數字上下翻動交換、小計金額跟著跑、右上角購物車徽章跳一下；超過庫存時數字框左右搖一下並說明原因，而不是默默停用按鈕。",
      "en": "The common “– 1 +” in a cart: the number flips, the subtotal counts along, and the cart badge pops. Going past the stock limit shakes the stepper and says why, instead of silently disabling the button."
    },
    "topic": "feedback",
    "tech": "Timeline",
    "tags": [
      "keyframes",
      "yPercent",
      "overwrite"
    ],
    "date": "2026-11-24",
    "thumb": ".stage",
    "useCases": [
      "ecommerce",
      "app"
    ],
    "cost": "light",
    "costNote": "transform",
    "notes": [
      {
        "code": ".to(old, { yPercent: -100 * dir })",
        "text": {
          "zh-TW": "複製一個新的數字放進同一個框，舊的滑出、新的滑進，兩段放在同一個 timeline 的同一時間點。dir 決定方向：加是往上、減是往下，方向和數字變化一致。",
          "en": "Clone a new number into the same window; the old slides out while the new slides in, at the same point of one timeline. dir sets the direction — up for plus, down for minus."
        }
      },
      {
        "code": "keyframes: { scale: [1, 1.45, 1] }",
        "text": {
          "zh-TW": "陣列寫法的 keyframes：依序經過這幾個值，一個補間就能做「放大再回來」或「左右搖」，不用串好幾段。",
          "en": "Array keyframes pass through each value in order, so one tween can pop up and back or shake side to side without chaining several."
        }
      },
      {
        "code": "gsap.to(total, { value })",
        "text": {
          "zh-TW": "補間一個普通物件的數字，在 onUpdate 裡寫回畫面，小計就會從舊金額「跑」到新金額。overwrite: true 讓連續點擊時只留最新的一段。",
          "en": "Tween a number on a plain object and write it back in onUpdate so the subtotal runs to the new amount. overwrite: true keeps only the latest tween when clicking fast."
        }
      },
      {
        "code": "refuse()",
        "text": {
          "zh-TW": "到上限時不停用「＋」：停用的按鈕不會回應，使用者不知道為什麼。改成搖一下數字框（像輸入錯誤）並顯示原因，role=\"status\" 會讓讀屏軟體唸出來。",
          "en": "At the limit “+” stays enabled — a disabled button gives no reason. Instead the stepper shakes like an input error and shows why; role=\"status\" announces it to screen readers."
        }
      }
    ]
  },
  {
    "id": "46-shared-element",
    "title": {
      "zh-TW": "列表縮圖放大成詳細頁",
      "en": "List thumbnail grows into a detail view"
    },
    "short": {
      "zh-TW": "縮圖放大轉場",
      "en": "Shared element"
    },
    "summary": {
      "zh-TW": "點列表裡的一張卡片，縮圖本身從原本的位置「長大」成詳細頁的大圖，接著標題和內容依序進場；關閉時大圖縮回原本那張卡片。App Store、相簿、電商商品頁常見的「共用元素轉場」，讓使用者知道新畫面是從哪裡來的。",
      "en": "Tap a card and its thumbnail grows from where it sits into the detail view’s hero image, then the title and text come in; closing shrinks it back into the same card. The “shared element transition” seen in app stores, photo apps and shops — it shows where the new screen came from."
    },
    "topic": "transitions",
    "tech": "Flip",
    "tags": [
      "data-flip-id",
      "Flip.getState",
      "targets"
    ],
    "date": "2026-11-24",
    "thumb": ".grid",
    "useCases": [
      "ecommerce",
      "app",
      "content"
    ],
    "cost": "light",
    "costNote": "flip",
    "notes": [
      {
        "code": "data-flip-id",
        "text": {
          "zh-TW": "縮圖和大圖是兩個不同的元素，但給它們同一個 data-flip-id，Flip 就會把它們當成同一個東西：記下縮圖的位置，讓大圖從那裡長出來。和練習 6（同一張卡片換 class）不同，這裡是「兩個畫面之間」的轉場。",
          "en": "The thumbnail and the hero are different elements, but sharing a data-flip-id makes Flip treat them as one: it records the thumbnail’s box and grows the hero from there. Unlike practice 6 (one card changing class), this transitions between two views."
        }
      },
      {
        "code": "Flip.from(state, { targets: hero })",
        "text": {
          "zh-TW": "state 是從縮圖記下來的，targets 指定要動的是大圖。關閉時反過來：從大圖記下 state，targets 改成縮圖。",
          "en": "state is captured from the thumbnail and targets says the hero should move. Closing reverses it: capture from the hero, target the thumbnail."
        }
      },
      {
        "code": "scale: true",
        "text": {
          "zh-TW": "用縮放而不是改寬高：裡面的圖示會跟著一起放大縮小，而且只動 transform，比較順。",
          "en": "Uses scale instead of width/height, so the icon inside grows along with it, and only transforms change — smoother."
        }
      },
      {
        "code": "focus({ preventScroll: true })",
        "text": {
          "zh-TW": "打開時焦點移到關閉按鈕、關閉後回到原本的卡片，鍵盤使用者不會迷路；按 Esc 也能關閉。",
          "en": "Focus moves to the close button on open and back to the card on close so keyboard users stay oriented; Esc also closes."
        }
      }
    ],
    "featured": true
  },
  {
    "id": "47-swipe-delete",
    "title": {
      "zh-TW": "往左滑刪除列表項目",
      "en": "Swipe left to delete a list item"
    },
    "short": {
      "zh-TW": "滑動刪除",
      "en": "Swipe to delete"
    },
    "summary": {
      "zh-TW": "收件匣、待辦清單常見的手勢：往左滑一點露出刪除按鈕並停住；滑超過一半放開就直接刪除，整列滑出去後高度收起來，下面的項目往上補。一次只會打開一列，鍵盤可以按 Delete 刪除。",
      "en": "A common inbox and to-do gesture: swipe a little to reveal and hold the delete button; swipe past halfway and let go to delete — the row slides out, collapses, and the rows below move up. Only one row opens at a time, and the Delete key works too."
    },
    "topic": "pointer",
    "tech": "Draggable",
    "tags": [
      "bounds",
      "onRelease",
      "height: 0"
    ],
    "date": "2026-11-24",
    "thumb": ".stage",
    "useCases": [
      "app",
      "saas"
    ],
    "cost": "light",
    "costNote": "drag",
    "notes": [
      {
        "code": "bounds: { minX: -row.offsetWidth, maxX: 0 }",
        "text": {
          "zh-TW": "只能往左拖，最多拖一整列寬；往右拖不動。刪除按鈕一直都在項目下面，項目往左移就露出來。",
          "en": "Drag only leftward, at most one row width. The delete button always sits underneath; moving the row left reveals it."
        }
      },
      {
        "code": "onRelease → 刪除／打開／收回",
        "text": {
          "zh-TW": "放開時依照拖了多遠決定三種結果：超過一半寬就刪除、超過按鈕寬的一半就停在打開的位置、其他就彈回去。拖過「刪除線」時圖示先放大，讓使用者在放開前就知道會發生什麼。",
          "en": "On release the distance picks one of three outcomes: past half the row deletes, past half the button stays open, otherwise it springs back. The icon grows when you cross the delete line so you know before letting go."
        }
      },
      {
        "code": ".to(row, { height: 0 })",
        "text": {
          "zh-TW": "刪除分兩段：先整列滑出畫面，再把高度收成 0。如果直接 remove()，下面的項目會「瞬間跳上來」，看不出少了哪一列。",
          "en": "Deleting has two steps: slide the row out, then collapse its height to 0. Removing it outright makes the rows below jump up, hiding which one disappeared."
        }
      },
      {
        "code": "keydown: 'Delete'",
        "text": {
          "zh-TW": "滑動是滑鼠和觸控的捷徑，不是唯一的方法：每列都能用鍵盤選到並按 Delete 刪除，刪除按鈕本身也能用 Tab 選到。",
          "en": "Swiping is a shortcut, not the only way: every row can be focused and deleted with the Delete key, and the delete button is reachable with Tab."
        }
      }
    ]
  }
];
