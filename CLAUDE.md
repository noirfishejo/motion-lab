# Motion Portfolio（動態練習作品集）

收藏 GSAP 練習的個人作品集。每個練習都能看即時預覽、看程式碼、一鍵複製，參考 CodePen 的用法。
純前端：HTML／CSS／JS＋GSAP（CDN），沒有後端和資料庫。需要用本機預覽伺服器開啟，因為作品頁要讀取程式碼檔案：
雙擊專案資料夾裡的 `開啟 Motion Lab.command`（或在專案資料夾執行 `python3 tools/serve.py`），再打開 http://localhost:5173 （這個伺服器關閉了快取，改檔後重新整理一定是最新版）。

作品頁版面：電腦版（≥1024px）預覽和程式碼固定左右並排；平板展開程式碼時預覽固定在上方約半個畫面；手機預覽保持完整大小，捲到程式碼時出現「看預覽」按鈕。捲動類練習的預覽上有一層「點一下才捲動」的遮罩。預覽右上角的按鈕是同一頁的全螢幕（不開新分頁）。「作品列表」側欄的開關在作品頁頁首 logo 左邊；側欄參考 shadcn/ui 文件，依主題分組、只列短名稱（works.js 的 short），不顯示編號。≥1280px 固定在左側可收合（記住開關），較窄時覆蓋在畫面上。程式碼預設打開 JS 分頁。介面上不顯示作品編號；首頁篩選列捲到頂端會吸附在頁首下方，旁邊有搜尋（和分類一起篩選）。複製按鈕：「複製 JS／CSS／HTML」只複製目前分頁，「複製完整頁面」合成一個可直接打開的 HTML。從側欄換頁不播進場動畫，改用瀏覽器內建的 View Transitions 淡出淡入（頁首、側欄不動，work.css 最下方）。首頁作品格：手機 1 欄、600px 起 2 欄、1680px 起 3 欄。首頁開場播完前只顯示開場本身（頁首按鈕、作品區、頁尾都先藏起來；從作品頁回到 #works 或一開始就捲動時直接顯示）。首頁縮圖只播放畫面上看得到的，捲出畫面就暫停。全站互動（js/interactions.js，把練習的動效用在網站上）：自訂游標取代系統游標（貼著滑鼠的小方塊＋跟在後面的外框；可點的東西外框放大、作品卡變成實心方塊＋眼睛圖示；預覽／程式碼／輸入框換回系統游標；觸控與減少動態時用系統游標）、Markers 開關的滑塊伸縮（練習 11）、頁首圖示按鈕磁吸、篩選列與程式碼分頁的滑動底線、複製／存檔結果用 Toast 通知。全站用 Lenis 平滑捲動（js/smooth.js，滾輪停下後微微滑行；減少動態時關閉）。

手機（同一個 Wi-Fi）可以用 serve.py 顯示的區網網址開啟；不是 localhost 時「存回檔案」會隱藏，只能試改。

作品頁的程式碼可以在網頁上直接編輯、即時預覽；按「存回檔案」會透過 serve.py 寫回 `works/<id>/` 的檔案（只接受本機請求，只能寫既有練習的 index.html／style.css／script.js）。

## 練習程式碼的語言
`works/` 裡的程式碼（HTML 文字、class、變數、label、字串）一律用英文；註解可以用中文說明。

## 已定案的設計決策
| 項目 | 決定 |
|---|---|
| 模式 | 深色為主，另有亮色模式（`html[data-theme="light"]`，頁首右上角切換，預設跟著系統）。亮色的數值在 `tokens.css` 的亮色區塊。每個練習的 `style.css` 也有同一組亮色變數，`index.html` 開頭的小程式會跟著作品集切換（單獨打開時維持深色）；新增練習時要一起加。 |
| 背景 | `--bg #0B0D10` |
| 中性色 | `--text #F0F0F0`・`--muted #8F8C85`・`--surface #14161A`・`--line #23262B`・`--line-strong #3B3E44` |
| 強調色（克萊因藍） | 填色 `--accent #1733E5`（按鈕、色塊、動畫長條，上面放白字 `--accent-ink #FFFFFF`）；深色底上的字和線用 `--accent-fg #6E83FF`（篩選底線、標籤、連結、焦點框）。**#1733E5 不可以直接當字或細線放在深色底上**，對比只有 2.4:1。 |
| 字體 | Poppins（標題）／Inter Tight（內文）／JetBrains Mono（程式碼、標籤）／Noto Sans TC（中文備援） |
| 字重 | 中文大標 500；按鈕和 20px 以下的文字 ≤ 400～500；全站開啟 `-webkit-font-smoothing: antialiased`。深色底上的淺色字看起來會比實際更粗，所以字重要偏輕。 |
| 形狀 | 直角，所有圓角都是 0 |
| 圖示 | Phosphor Icons・Light |
| 動態節奏 | expo 快出：GSAP 用 `expo.out`，CSS 用 `cubic-bezier(.16,1,.3,1)` |

所有數值都定義在 `css/tokens.css`，元件裡不寫死數值。

## 參考網站
- 滾動敘事、3D 文字空間：https://santalarch.com/#works （用 ScrollTrigger＋CSS 做近似效果，不用 WebGL）
- 大字排版、暖紙白配黑：https://www.angelamilosevic.com/
- 分類篩選列、兩欄大圖作品格、捲動時 logo 縮小：https://www.koleksiyondesign.com/tr/projeler/

## 不要清單
- 不要大面積的螢光色。強調色只用在「選取中、可點擊、正在動」的地方。
- 不要圓角。
- 不要手繪 SVG 圖示，一律用 Phosphor。
- 中文和按鈕文字不要太粗（使用者回饋：太重會糊）。

## 語言
- 繁體中文＋英文。頁首右上角切換（記住設定）；沒設定過就跟著瀏覽器語言；網址加 `?lang=en` 可直接開英文版。
- 介面文字放在 `locales/zh-TW.json` 和 `locales/en.json`（兩邊的 key 要一致），不寫死在 HTML 裡。
- 練習資料（`js/works.js`）的 title、short、summary、notes 都寫成 `{ 'zh-TW': '…', en: '…' }`；新增練習時兩種語言都要填。

## 作品命名與分類
- **分類（topic）依用途**，不依 GSAP 功能：`components` 元件／`transitions` 進場與轉場／`scroll` 捲動／`graphics` 文字與圖形。
- **title**：看得到的東西（元件或效果）＋情境，用設計師會搜尋的詞，不用 GSAP 名詞開頭。例：「浮動標籤輸入框」「捲動時 Logo 飛進頁首」。
- **short**：側欄名稱，中文 8 個字以內。
- **tech**：主要的 GSAP 功能（Tween、Timeline、ScrollTrigger、Flip…），顯示在卡片右上角和作品頁第一個標籤；**tags** 放細節技巧。
- 作品頁側欄有搜尋，比對中英文名稱、分類、tech、tags。

## 新增作品
請照 `新增作品.md` 的步驟：複製 `works/_template`，再在 `js/works.js` 加一筆資料。

## 版本管理
- 使用 git，每個改版主題開一個分支。
- 完成一個改版主題就自動 commit 並合併回 main，不用先問使用者（使用者 2026-11-20 指定）。回覆中說明存了哪個版本。
