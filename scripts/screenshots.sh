#!/usr/bin/env bash
# Takes a screenshot of every design for the gallery (docs/designs.md), or of the designs named
# as arguments. Needs Google Chrome. Builds the site, serves it, and photographs each design.
set -euo pipefail
cd "$(dirname "$0")/.."

names=("$@")
if [ ${#names[@]} -eq 0 ]; then
  # Every design: the keys of DESIGNS in src/scenes.ts, plus the made-up tartan.
  mapfile -t names < <(sed -n '/^const DESIGNS/,/^};/p' src/scenes.ts | grep -oE '^  [a-z]+:' | tr -d ' :')
  names=(tartan "${names[@]}")
fi

npx vite build >/dev/null
npx vite preview --port 4178 --strictPort >/dev/null 2>&1 &
server=$!
trap 'kill $server' EXIT
sleep 2

for name in "${names[@]}"; do
  # The made-up tartan is photographed at Eleanor's favourite seed so the picture stays the same.
  address="?scene=$name"
  [ "$name" = tartan ] && address="?scene=tartan&seed=780891"
  google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
    --window-size=900,560 --virtual-time-budget=2000 \
    --screenshot="docs/designs/$name.png" "http://localhost:4178/$address" 2>/dev/null
  echo "docs/designs/$name.png"
done
