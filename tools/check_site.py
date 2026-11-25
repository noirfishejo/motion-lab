#!/usr/bin/env python3
# ═══════════════════════════════════════════════
# 網站靜態檢查（不用開瀏覽器）：檢視網站時先跑這個，再用瀏覽器看畫面
#   python3 tools/check_site.py
# 檢查項目
#   1. 語系檔：zh-TW 和 en 的 key 一致、程式裡用到的 key 都存在
#   2. 練習資料：meta.json 必填欄位、中英文都有、short 中文 8 個字以內、分類合法、有縮圖
#   3. 設計規範：元件 CSS 不寫死顏色（tokens.css 以外）、沒有圓角、不用已移除的 token
#   4. 連結：頁面裡連到的 .html 檔都存在
# 有問題時列出來並回傳 1；全部通過回傳 0
# ═══════════════════════════════════════════════
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
problems = []
def bad(msg): problems.append(msg)

# ── 1. 語系檔 ──
zh = json.loads((ROOT / 'locales/zh-TW.json').read_text(encoding='utf-8'))
en = json.loads((ROOT / 'locales/en.json').read_text(encoding='utf-8'))
for k in sorted(set(zh) ^ set(en)):
    bad(f'語系 key 只出現在一邊：{k}')
used = set()
for f in list(ROOT.glob('*.html')) + list((ROOT / 'js').glob('*.js')):
    text = f.read_text(encoding='utf-8')
    text = '\n'.join(l for l in text.splitlines() if not l.lstrip().startswith('//'))  # 註解裡的範例不算
    used |= set(re.findall(r'data-i18n="([\w.]+)"', text))
    used |= set(re.findall(r'data-i18n-attr="([^"]+)"', text) and [kv.split(':')[1].strip() for a in re.findall(r'data-i18n-attr="([^"]+)"', text) for kv in a.split(';')])
    used |= set(re.findall(r"\bt\('([\w.]+)'", text))
for k in sorted(used):
    if k not in zh and not k.endswith('.'):
        bad(f'程式用到的語系 key 不存在：{k}')

# ── 2. 練習資料 ──
TOPICS = {'forms', 'overlays', 'feedback', 'pointer', 'transitions', 'scroll', 'graphics'}
for meta_path in sorted(ROOT.glob('works/[0-9]*/meta.json')):
    d = meta_path.parent
    try:
        m = json.loads(meta_path.read_text(encoding='utf-8'))
    except Exception as e:
        bad(f'{d.name}: meta.json 讀不到（{e}）'); continue
    for field in ['title', 'short', 'summary']:
        v = m.get(field)
        if not isinstance(v, dict) or not v.get('zh-TW') or not v.get('en'):
            bad(f'{d.name}: {field} 要有中英文')
    # short 中文 8 個字以內：中文一個字算一個，英文一個詞算一個（例如「開關 Switch」＝3）
    if isinstance(m.get('short'), dict):
        sh = m['short'].get('zh-TW', '')
        size = len(re.findall(r'[\u4e00-\u9fff]', sh)) + len(re.findall(r'[A-Za-z0-9]+', sh))
        if size > 8: bad(f'{d.name}: short 超過 8 個字（{sh}）')
    if m.get('topic') not in TOPICS:
        bad(f'{d.name}: topic 不合法（{m.get("topic")}）')
    for n in m.get('notes', []):
        t = n.get('text', {})
        if not t.get('zh-TW') or not t.get('en'):
            bad(f'{d.name}: 筆記少了中文或英文（{n.get("code", "")}）')
    for thumb in ['thumb-dark.jpg', 'thumb-light.jpg']:
        if not (d / thumb).exists():
            bad(f'{d.name}: 沒有縮圖 {thumb}（python3 tools/make_thumbs.py {d.name}）')
    for f in ['index.html', 'style.css', 'script.js']:
        if not (d / f).exists():
            bad(f'{d.name}: 少了 {f}')

# ── 3. 設計規範（網站本身的 CSS，不含練習） ──
for css in sorted((ROOT / 'css').glob('*.css')):
    text = css.read_text(encoding='utf-8')
    if css.name != 'tokens.css':
        for line_no, line in enumerate(text.splitlines(), 1):
            code = re.sub(r'/\*.*?\*/', '', line)
            if 'mask-image' in code: continue  # 遮罩裡的 #000 只代表「看得到」，不是顏色
            if re.search(r'#[0-9a-fA-F]{3,8}\b', code) or re.search(r'rgba?\(', code):
                bad(f'css/{css.name}:{line_no} 寫死顏色（請用 tokens.css 的變數）')
    for line_no, line in enumerate(text.splitlines(), 1):
        code = re.sub(r'/\*.*?\*/', '', line)
        m = re.search(r'border-radius:\s*([^;}]+)', code)
        if m and m.group(1).strip() not in ('0', '0px', 'var(--radius)'):
            bad(f'css/{css.name}:{line_no} 有圓角（全站直角）')
        if '--fs-title' in code:
            bad(f'css/{css.name}:{line_no} 用了已移除的 --fs-title（改用 --fs-h1／--fs-h2）')

# ── 4. 連結 ──
for f in list(ROOT.glob('*.html')) + list((ROOT / 'js').glob('*.js')):
    text = f.read_text(encoding='utf-8')
    for href in set(re.findall(r"""href=["'`]([\w-]+\.html)""", text)):
        if not (ROOT / href).exists():
            bad(f'{f.relative_to(ROOT)}：連到不存在的 {href}')

if problems:
    print(f'有 {len(problems)} 個問題：')
    for p in problems: print('  · ' + p)
    sys.exit(1)
print('靜態檢查全部通過：語系、練習資料、設計規範、連結')
