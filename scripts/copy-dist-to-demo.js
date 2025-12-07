#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function log(...args) { console.log(...args); }
function err(...args) { console.error(...args); }

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const DEMO_DIR = path.resolve(ROOT_DIR, '..', 'swatch-clocks-demo');

log(`Copying dist artifacts from: ${DIST_DIR}`);

if (!fs.existsSync(DIST_DIR) || !fs.statSync(DIST_DIR).isDirectory()) {
  err('dist directory not found. Run "npm run build" first.');
  process.exit(1);
}

const targets = [
  path.join(DEMO_DIR, 'examples', 'preact-auto', 'public', 'vendor'),
  path.join(DEMO_DIR, 'examples', 'preact-manual', 'public', 'vendor')
];

const filesToCopy = [
  { src: 'clocks.esm.js', dest: 'clocks.esm.js' },
  { src: 'clocks.css', dest: 'clocks.css' }
];

for (const t of targets) {
  fs.mkdirSync(t, { recursive: true });
}

for (const f of filesToCopy) {
  const srcPath = path.join(DIST_DIR, f.src);
  if (!fs.existsSync(srcPath)) {
    err(`Missing ${f.src} in dist/. Did the build complete?`);
    process.exit(1);
  }
  for (const t of targets) {
    const destPath = path.join(t, f.dest);
    fs.copyFileSync(srcPath, destPath);
    log(`Copied ${f.src} -> ${destPath}`);
  }
}

log('Copied to:');
for (const t of targets) log(` - ${t}`);

process.exit(0);
