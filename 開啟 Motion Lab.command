#!/bin/bash
# 雙擊這個檔案：啟動本機預覽伺服器並用瀏覽器打開 Motion Lab。
# 視窗開著網站就能用；關掉視窗（或按 Ctrl+C）就會停止。
cd "$(dirname "$0")"
URL="http://localhost:5173"
if curl -s -o /dev/null "$URL"; then
  echo "伺服器已經在執行，直接打開瀏覽器。"
  open "$URL"
  exit 0
fi
python3 tools/serve.py 5173 &
sleep 1
open "$URL"
wait
