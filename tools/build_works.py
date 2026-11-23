"""把每個練習資料夾裡的 meta.json 合成一個 js/works-data.js（網站實際讀的檔案）。

為什麼要這樣做：
· 新增或修改練習時，只要動那個練習自己的資料夾（index.html／style.css／script.js／meta.json）
· 網站只需要讀一個檔案，不用一次發 30 幾個請求，首頁比較快
· GitHub Pages 是靜態網站，所以合好的 works-data.js 也要一起存進版本紀錄

什麼時候會執行：
· tools/serve.py 啟動時、以及網頁要讀 works-data.js 時（有 meta.json 比它新就自動重新產生）
· 也可以手動執行：python3 tools/build_works.py
"""
import json, os, glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'js', 'works-data.js')


def meta_files():
    # 資料夾名稱開頭是數字的才是練習（_template 不算），依名稱排序 = 首頁的順序
    return sorted(p for p in glob.glob(os.path.join(ROOT, 'works', '*', 'meta.json'))
                  if os.path.basename(os.path.dirname(p))[:1].isdigit())


def needs_build():
    if not os.path.exists(OUT):
        return True
    built = os.path.getmtime(OUT)
    return any(os.path.getmtime(p) > built for p in meta_files())


def build():
    works = []
    for path in meta_files():
        with open(path, encoding='utf-8') as f:
            data = json.load(f)
        works.append({'id': os.path.basename(os.path.dirname(path)), **data})
    body = json.dumps(works, ensure_ascii=False, indent=2)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write('// ⚠ 自動產生的檔案，請不要直接修改。\n'
                '// 要改練習的名稱、說明、筆記：改 works/<練習>/meta.json，'
                'tools/build_works.py 會重新產生這個檔案（serve.py 會自動執行）。\n'
                f'export const WORKS = {body};\n')
    return len(works)


if __name__ == '__main__':
    print(f'works-data.js：{build()} 個練習')
