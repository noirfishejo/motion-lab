"""產生首頁用的靜態縮圖：每個練習兩張（深色 thumb-dark.jpg、亮色 thumb-light.jpg），存在練習自己的資料夾。

為什麼要有靜態縮圖：首頁 30 幾張卡片如果都放「真的網頁」（iframe），每一張都要載入 GSAP、跑動畫，
越往下捲越吃記憶體，手機會明顯變卡。改成平常顯示圖片，滑鼠移上去才載入真的練習播放。

用法（需要本機預覽伺服器正在執行，也就是先打開「開啟 Motion Lab.command」）：
  python3 tools/make_thumbs.py                 # 全部重做
  python3 tools/make_thumbs.py 33-new-thing    # 只做指定的練習（新增練習後用這個）

需要 Google Chrome（用它在背景開頁面截圖，不會跳出視窗）。
"""
import os, subprocess, sys, glob, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
BASE = 'http://localhost:5173'
WAIT_MS = 4500      # 截圖前等多久（讓練習的自動示範播完）
QUALITY = 80        # JPEG 品質


def works(ids):
    if ids:
        return ids
    return sorted(os.path.basename(os.path.dirname(p)) for p in glob.glob(os.path.join(ROOT, 'works', '[0-9]*', 'meta.json')))


def shoot(work_id, theme, tmpdir):
    png = os.path.join(tmpdir, f'{work_id}-{theme}.png')
    out = os.path.join(ROOT, 'works', work_id, f'thumb-{theme}.jpg')
    subprocess.run([
        CHROME, '--headless=new', '--disable-gpu', '--hide-scrollbars', '--mute-audio',
        '--window-size=1200,750',
        f'--virtual-time-budget={WAIT_MS}', f'--screenshot={png}',
        f'{BASE}/tools/capture.html?id={work_id}&theme={theme}'
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=90)
    # PNG → JPEG（檔案小很多）
    subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', str(QUALITY), png, '--out', out],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return out


if __name__ == '__main__':
    if not os.path.exists(CHROME):
        sys.exit('找不到 Google Chrome，請先安裝：https://www.google.com/chrome/')
    ids = works(sys.argv[1:])
    with tempfile.TemporaryDirectory() as tmp:
        for i, work_id in enumerate(ids, 1):
            for theme in ('dark', 'light'):
                shoot(work_id, theme, tmp)
            print(f'[{i}/{len(ids)}] {work_id}')
    print('完成。重新整理首頁就會看到新的縮圖。')
