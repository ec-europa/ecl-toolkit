const es2015Rollup = require('babel-preset-es2015-rollup');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');

module.exports = (entry, dest, options) => {
  const config = {
    entry,
    dest,
    format: 'iife',
    sourceMap: options.sourceMap,
    moduleName: options.moduleName,
    exports: 'named',
    plugins: [
      resolve({
        jsnext: true,
        main: true,
        browser: true,
      }),
      commonjs(),
      babel({
        presets: [es2015Rollup],
        exclude: 'node_modules/**',
      }),
      (process.env.NODE_ENV === 'production' && uglify()),
    ],
  };

  rollup.rollup(config).then((bundle) => {
    bundle.write(config);
  });
};
