import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';

export default [
  // ESM build
  {
    input: 'src/index.js',
    output: { file: 'dist/clocks.esm.js', format: 'es', sourcemap: true },
    plugins: [resolve(), commonjs(), postcss({ extract: 'clocks.css', minimize: true })]
  },
  // UMD build (minified for browser)
  {
    input: 'src/index.js',
    output: { file: 'dist/clocks.js', format: 'umd', name: 'SwatchClocks', sourcemap: true, exports: 'named' },
    plugins: [resolve(), commonjs(), postcss({ extract: 'clocks.css', minimize: true }), terser()]
  }
];
