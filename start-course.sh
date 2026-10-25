#!/usr/bin/env sh
cd "$(dirname "$0")"
echo ""
echo "Pathline course: http://127.0.0.1:8765"
echo "Press Ctrl+C to stop."
echo ""
python3 -m http.server 8765
