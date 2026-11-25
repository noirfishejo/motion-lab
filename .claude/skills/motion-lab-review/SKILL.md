---
name: motion-lab-review
description: 檢視 Motion Lab 網站（首頁、作品頁、練習頁、動態規範、Ease 實驗室）的固定流程與清單：靜態檢查、各寬度與語言的畫面、真實捲動測試、動態與效能、無障礙。改版後、使用者說「檢視網站」「幫我看看有沒有問題」「驗收」或要合併前使用。
---

# 檢視 Motion Lab 網站

這份 skill 是這個網站的驗收流程。目的：把過去實際踩過的錯誤變成固定的檢查，下一次不再犯。
回報一律用繁體中文，先說結果，再說檢查了什麼、沒檢查到什麼。

## 0. 準備
- 伺服器由使用者自己開（雙擊 `開啟 Motion Lab.command` 或 `python3 tools/serve.py`），網址 http://localhost:5173 。
  `preview_start` 不能跑這個伺服器，直接用瀏覽器面板 `navigate` 到 localhost:5173。
- 先跑靜態檢查（不用開瀏覽器）：
  ```bash
  python3 tools/check_site.py
  ```
  檢查語系 key 兩邊一致、練習資料完整（中英文、short 長度、分類、縮圖）、CSS 不寫死顏色和圓角、連結的頁面都存在。

## 1. 要看的頁面
| 頁面 | 網址 | 重點 |
|---|---|---|
| 首頁 | `index.html` | 開場（方塊＋標題、聚光燈）→ 介紹段落：大字逐字亮起、數字、方法尺規、分類卡片、最新練習輪播、工具；每段向上覆蓋 |
| 作品 | `works.html`、`works.html?topic=pointer` | 篩選、搜尋、GSAP 功能、排序；從首頁分類進來要直接套用分類 |
| 練習 | `work.html?id=11-toggle-switch` 等 | 預覽、程式碼、筆記（ease 連到實驗室）、側欄 |
| 動態規範 | `guide.html` | 側欄目錄、示範、預覽減少動態、手機排版 |
| Ease 實驗室 | `ease.html?ease=back.out(2.5)&d=0.8` | 網址帶入設定、比較、複製 |
| 舊網址 | `index.html#works`、`work.html?id=09-micro-interactions` | 要自動轉到新頁面 |

## 2. 寬度 × 語言 × 配色
- 寬度：**320、375×667（矮手機）、600、834、1024、1440**，必要時 1920。
  用 `resize_window`；手機一定要看「矮」的（375×667、橫拿），固定住的區塊只有一個螢幕高，最容易擠壓、重疊。
- 每個寬度：中文、英文（網址加 `?lang=en`／`?lang=zh-TW`）各看一次。
- 亮色、暗色各看一次（`resize_window` 的 colorScheme，或把 `html[data-theme]` 改掉）。
- 每個寬度都要確認：`document.documentElement.scrollWidth === innerWidth`（沒有橫向溢出）、文字沒被裁切、沒有元件互相重疊。

## 3. 捲動與動態：一定要「真的捲」
**教訓：直接跳到某個捲動位置截圖，會漏掉固定（pin）失效、捲到空白這類問題。**
- 瀏覽器面板要是「顯示中」（`tabs_context` 會說 displayed）。隱藏時 requestAnimationFrame 幾乎不跑，動畫不會動。
- 用 Lenis 平滑捲動一路捲過去，每一段停下來量位置：
  ```js
  window.__lenis.scrollTo(y);            // 不要加 immediate，讓它真的捲
  await new Promise(r => setTimeout(r, 1600));
  ```
- 有固定（pin）的段落，在 10%、50%、90% 和結束後各量一次：固定中的區塊 `getBoundingClientRect().top` 應該是 0；
  下一段蓋上來時，蓋上來那段的 bottom 要 ≥ 被蓋住那段的 bottom（不能露出下面的內容）。
- 列出所有固定：`ScrollTrigger.getAll().filter(s => s.pin).map(s => [s.pin.className, s.start, s.end])`。
- 面板隱藏、只能手動推進時：用 `gsap.ticker.tick()` 迴圈推進，並在回報裡明說「是手動推進測的，沒驗到真實手感」。

### 這個網站踩過的坑（檢查時特別注意）
- **不要巢狀固定**：在已經固定的區塊外面再包一層固定，外層會被加 transform，裡面固定的區塊就跑掉、捲到一片空白。要延長，就延長同一個固定、下一段用負 margin 拉上來。
- **transform 不能有 CSS transition**，否則 GSAP 每一格的位移都被延遲（頁首語言、配色按鈕的磁吸因此失效過）。transition 只在需要的那一次用 class 加上去。
- **模組最上層呼叫的函式，用到的 `let`／`const` 要宣告在呼叫之前**（TDZ）：作品頁的 `filterTl`、練習頁的 ease 比對規則都因此壞過，症狀是整塊內容沒出現。看主控台的 ReferenceError。
- **中文拆字**：SplitText 用 words 拆中文會變成一大塊、換行亂掉，中文要用 chars。
- **grid 裡放很寬的內容**（例如橫向輪播的名稱列），欄寬要用 `minmax(0, 1fr)`，不然整個版面被撐寬。
- **輪播第一張要停得住**：一進來就推走會看不到；每張之間要有停留。
- 使用者不喜歡：3D 轉角度的視角移動、太基礎的樣式、大面積強調色、圓角、太粗的中文字、每個區塊都一樣的淡入。

## 4. 設計系統（DESIGN.md、css/tokens.css）
- 顏色、字級、間距都用 token；標題只用 `--fs-h1`（每頁大標）／`--fs-h2`（區塊、單一練習標題）／`--fs-h3`（卡片、面板）。
- `#1733E5` 不可當字或細線放在深色底上（對比 2.4:1），字和線用 `--accent-fg`。
- 全站直角；圖示一律 Phosphor Light（實心只有「選中」的例外）；不手繪 SVG 圖示。
- 20px 以下文字字重 ≤ 500；中文大標 500。
- 頁首：尺規（刻度撐滿整格、亮線延伸到目前頁面、滑過整格反白）、右邊按鈕是同一把尺的格子且有磁吸；手機是漢堡選單（× 要對稱、目前頁面整列反白）。

## 5. 無障礙與減少動態
- Tab 走一遍：焦點框看得到、順序合理；漢堡選單 Esc 可關、焦點回到按鈕；輪播的卡片連結 Tab 到時會捲到那一張。
- 開啟減少動態（系統設定或 `matchMedia` 模擬）：開場、覆蓋、視差都關掉，內容全部看得到；首頁最新練習維持卡片格。
- 圖示按鈕有 aria-label；動態狀態用 `role="status"`。

## 6. 效能（gsap-performance）
- 只動 transform／opacity／clip-path；跟著游標的用 `quickTo`；捲出畫面就暫停；resize 要 debounce。
- 主控台：`read_console_messages`（onlyErrors）。View Transition 的 InvalidStateError 是瀏覽器層級、可忽略；其他錯誤都要處理。

## 7. 回報格式
1. 結果：通過幾項、發現幾個問題（嚴重的先說）。
2. 每個問題：在哪一頁、哪個寬度／語言、怎麼重現、原因、建議怎麼修（或已修好）。
3. 檢查了什麼：寬度、語言、配色、真實捲動或手動推進。
4. 沒檢查到的：例如真手機觸控、真實裝置的流暢度。
修好的問題照 CLAUDE.md 的版本管理規則：開分支、commit、合併回 main，不要 push。
