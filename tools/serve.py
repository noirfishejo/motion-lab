"""本機預覽伺服器：關閉快取，改了檔案重新整理就能看到最新版。
用法：在專案資料夾執行  python3 tools/serve.py   然後打開 http://localhost:5173
（或直接雙擊專案資料夾裡的「開啟 Motion Lab.command」）

另外提供「存回檔案」：作品頁按下儲存時，會用 PUT 把程式碼寫回 works/<id>/ 的檔案。
為了安全，只接受這台電腦自己（127.0.0.1）送來、網址是 localhost 的請求（擋掉「惡意網站把網域指到 127.0.0.1」的攻擊），
而且要帶作品頁才會加的 X-Motion-Lab 標頭，只能寫 works/ 底下既有練習的三個檔案。
區網（手機）可以讀網站，但讀不到 .git 這類隱藏檔。
"""
import http.server, os, re, sys
import build_works  # 把各練習的 meta.json 合成 js/works-data.js

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
LOCAL_HOSTS = {f'localhost:{PORT}', f'127.0.0.1:{PORT}', f'[::1]:{PORT}'}
MAX_SIZE = 2_000_000  # 單一檔案最多 2MB
WRITABLE = re.compile(r'^/works/([0-9][A-Za-z0-9-]*)/(index\.html|style\.css|script\.js)$')

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # 不提供隱藏檔（.git、.claude…）：區網上的其他人也連得到這個伺服器
        if '/.' in self.path.split('?')[0]:
            return self.send_error(404)
        # 要讀作品資料時：有 meta.json 改過就先重新合成（改完 meta.json 重新整理網頁就會看到）
        if self.path.split('?')[0] == '/js/works-data.js' and build_works.needs_build():
            build_works.build()
        return super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_PUT(self):
        m = WRITABLE.match(self.path)
        origin = self.headers.get('Origin')
        local = (self.client_address[0] in ('127.0.0.1', '::1')
                 and self.headers.get('Host') in LOCAL_HOSTS
                 and (origin is None or origin.split('//', 1)[-1] in LOCAL_HOSTS)
                 and self.headers.get('X-Motion-Lab') == 'save')
        if not local or not m:
            return self.send_error(403, 'Only works/<id>/index.html|style.css|script.js from localhost')
        folder = os.path.join(ROOT, 'works', m.group(1))
        if not os.path.isdir(folder):
            return self.send_error(404, 'No such work')
        try:
            length = int(self.headers.get('Content-Length', ''))
        except ValueError:
            length = 0
        if not 0 < length <= MAX_SIZE:
            return self.send_error(400, 'Missing or invalid Content-Length')
        text = self.rfile.read(length).decode('utf-8')
        with open(os.path.join(folder, m.group(2)), 'w', encoding='utf-8', newline='') as f:
            f.write(text.rstrip() + '\n')
        self.send_response(204)
        self.end_headers()

def lan_ip():
    """這台電腦在區網（Wi-Fi）裡的位址，手機連同一個 Wi-Fi 就能用它打開網站。"""
    import socket
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('10.255.255.255', 1))  # 不會真的送出資料，只是讓系統選出對外的網卡
        ip = s.getsockname()[0]
        s.close()
        return ip
    except OSError:
        return None

build_works.build()  # 啟動時先合成一次
# ThreadingHTTPServer：同時處理多個連線，一個卡住的連線（例如手機斷線）不會讓整個網站停住
http.server.ThreadingHTTPServer.allow_reuse_address = True
with http.server.ThreadingHTTPServer(('', PORT), Handler) as httpd:
    print(f'Motion Lab 預覽：http://localhost:{PORT}　（關掉這個視窗就會停止）')
    ip = lan_ip()
    if ip:
        print(f'手機（連同一個 Wi-Fi）：http://{ip}:{PORT}　（手機上可以看、可以試改，但不能存回檔案）')
    httpd.serve_forever()
