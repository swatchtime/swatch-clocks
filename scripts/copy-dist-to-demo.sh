#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DIST_DIR="$ROOT_DIR/dist"
DEMO_DIR="$ROOT_DIR/../swatch-clocks-demo"

echo "Copying dist artifacts from: $DIST_DIR"

if [ ! -d "$DIST_DIR" ]; then
  echo "dist directory not found. Run 'npm run build' first." >&2
  exit 1
fi

mkdir -p "$DEMO_DIR/examples/preact-auto/public/vendor"
mkdir -p "$DEMO_DIR/examples/preact-manual/public/vendor"

# Copy ESM and CSS for examples
cp -f "$DIST_DIR/clocks.esm.js" "$DEMO_DIR/examples/preact-auto/public/vendor/clocks.esm.js"
cp -f "$DIST_DIR/clocks.esm.js" "$DEMO_DIR/examples/preact-manual/public/vendor/clocks.esm.js"
cp -f "$DIST_DIR/clocks.css" "$DEMO_DIR/examples/preact-auto/public/vendor/clocks.css"
cp -f "$DIST_DIR/clocks.css" "$DEMO_DIR/examples/preact-manual/public/vendor/clocks.css"

echo "Copied to:"
echo " - $DEMO_DIR/examples/preact-auto/public/vendor/"
echo " - $DEMO_DIR/examples/preact-manual/public/vendor/"

exit 0
