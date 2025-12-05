const fs = require('fs');
const path = require('path');

const src = path.resolve(__dirname, '..', 'clocks.css');
const destDir = path.resolve(__dirname, '..', 'dist');
const dest = path.join(destDir, 'clocks.css');

try {
  if (!fs.existsSync(src)) {
    console.log('No top-level clocks.css created by postcss; nothing to move.');
    process.exit(0);
  }
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.renameSync(src, dest);
  console.log('Moved clocks.css -> dist/clocks.css');
} catch (err) {
  console.error('postbuild: failed to move clocks.css', err);
  process.exit(1);
}
