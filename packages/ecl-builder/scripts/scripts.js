const babelPresetEnv = require('babel-preset-env');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const browserslist = require('browserslist');

module.exports = (entry, dest, options) => {
  const browserslistConfig = browserslist();

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
        presets: [
          [
            babelPresetEnv,
            {
              targets: {
                browsers: browserslistConfig,
                uglify: process.env.NODE_ENV === 'production',
              },
              modules: false,
              loose: true,
              useBuiltIns: true,
            },
          ],
        ],
        exclude: 'node_modules/**',
      }),
      process.env.NODE_ENV === 'production' && uglify(),
    ],
  };

  rollup.rollup(config).then(bundle => {
    bundle.write(config);
  });
};
