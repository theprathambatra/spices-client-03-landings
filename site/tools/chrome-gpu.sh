#!/usr/bin/env bash
# Chrome shim for the taste-skill inspector (inspect.mjs / scenes.mjs).
# The inspector launches the browser from CHROME_PATH but cannot pass extra flags, so this adds the GPU
# flags WebGL (Three.js / R3F) needs on macOS, then execs the real browser with the inspector's own flags.
# Browser, in order: $REAL_CHROME, Google Chrome, then Playwright's "Chrome for Testing" in the cache.
CHROME="${REAL_CHROME:-}"
if [ -z "$CHROME" ] || [ ! -x "$CHROME" ]; then
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
fi
if [ ! -x "$CHROME" ]; then
  for c in "$HOME"/Library/Caches/ms-playwright/chromium-*/chrome-mac*/"Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing" \
           "$HOME"/Library/Caches/ms-playwright/chromium-*/chrome-mac*/Chromium.app/Contents/MacOS/Chromium; do
    [ -x "$c" ] && CHROME="$c"
  done
fi
if [ ! -x "$CHROME" ]; then echo "chrome-gpu.sh: no Chrome found; set REAL_CHROME" >&2; exit 127; fi
exec "$CHROME" --enable-gpu --use-angle=metal --ignore-gpu-blocklist "$@"
