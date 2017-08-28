const babelPresetEnv = require('babel-preset-env');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const browserslist = require('browserslist');

module.exports = (input, dest, options) => {
  const inputOptions = {
    input,
    external: ['jquery'],
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
                browsers: browserslist(),
                uglify: process.env.NODE_ENV === 'production',
              },
              modules: false,
              loose: true,
              useBuiltIns: true,
            },
          ],
        ],
        plugins: ['external-helpers'],
      }),
      process.env.NODE_ENV === 'production' && uglify(),
    ],
  };

  const outputOptions = {
    file: dest,
    format: 'iife',
    name: options.name || options.moduleName,
    sourcemap: options.sourcemap || options.sourceMap,
    exports: 'named',
    globals: {
      jquery: 'jQuery',
    },
  };

  rollup.rollup(inputOptions).then(bundle => bundle.write(outputOptions));
};
