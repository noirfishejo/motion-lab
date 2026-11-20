"""本機預覽伺服器：關閉快取，改了檔案重新整理就能看到最新版。
用法：在專案資料夾執行  python3 tools/serve.py   然後打開 http://localhost:5173
（或直接雙擊專案資料夾裡的「開啟 Motion Lab.command」）

另外提供「存回檔案」：作品頁按下儲存時，會用 PUT 把程式碼寫回 works/<id>/ 的檔案。
為了安全，只接受這台電腦自己（127.0.0.1）送來的請求，而且只能寫 works/ 底下既有練習的三個檔案。
"""
import http.server, socketserver, os, re, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 5173
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
WRITABLE = re.compile(r'^/works/([0-9][A-Za-z0-9-]*)/(index\.html|style\.css|script\.js)$')

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_PUT(self):
        m = WRITABLE.match(self.path)
        if self.client_address[0] not in ('127.0.0.1', '::1') or not m:
            return self.send_error(403, 'Only works/<id>/index.html|style.css|script.js from localhost')
        folder = os.path.join(ROOT, 'works', m.group(1))
        if not os.path.isdir(folder):
            return self.send_error(404, 'No such work')
        length = int(self.headers.get('Content-Length', 0))
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

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', PORT), Handler) as httpd:
    print(f'Motion Lab 預覽：http://localhost:{PORT}　（關掉這個視窗就會停止）')
    ip = lan_ip()
    if ip:
        print(f'手機（連同一個 Wi-Fi）：http://{ip}:{PORT}　（手機上可以看、可以試改，但不能存回檔案）')
    httpd.serve_forever()
