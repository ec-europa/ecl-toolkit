const path = require('path');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');

const entry = process.argv[2];

const params = process.env.NODE_ENV === 'production' ? {
  dest: path.resolve(process.cwd(), 'dist/framework/scripts/europa.js'),
  sourceMap: false,
} : {
  dest: path.resolve(process.cwd(), 'static/framework/scripts/europa.js'),
  sourceMap: 'inline',
};

const config = {
  entry,
  dest: params.dest,
  format: 'iife',
  sourceMap: params.sourceMap,
  moduleName: 'Europa',
  exports: 'named',
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    babel({
      presets: ['es2015-rollup'],
      exclude: 'node_modules/**',
    }),
    (process.env.NODE_ENV === 'production' && uglify()),
  ],
};

rollup.rollup(config).then((bundle) => {
  bundle.write(config);
});
