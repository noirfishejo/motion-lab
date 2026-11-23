"""產生分享預覽圖（貼網址到 LINE、Facebook、Slack 時顯示的圖片）：
  og.png     中文版（首頁、作品頁用）
  og-en.png  英文版（en/index.html 用，分享英文連結 …/motion-lab/en/ 時顯示）

用法（需要本機預覽伺服器正在執行）：
  python3 tools/make_og.py
練習數量會自動算，新增幾個練習後重跑一次就好。
"""
import glob, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
BASE = 'http://localhost:5173'

if __name__ == '__main__':
    if not os.path.exists(CHROME):
        sys.exit('找不到 Google Chrome，請先安裝：https://www.google.com/chrome/')
    n = len(glob.glob(os.path.join(ROOT, 'works', '[0-9]*', 'meta.json')))
    for lang, name in (('zh', 'og.png'), ('en', 'og-en.png')):
        subprocess.run([
            CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--window-size=1200,630',
            '--virtual-time-budget=3000', f'--screenshot={os.path.join(ROOT, name)}',
            f'{BASE}/tools/og.html?lang={lang}&n={n}'
        ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=60)
        print(f'{name}（{n} 個練習）')
