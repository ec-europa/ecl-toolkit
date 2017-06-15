const babelPresetEnv = require('babel-preset-env');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify');
const browserslist = require('browserslist');

function pickEnv(config) {
  if (typeof config !== 'object') return config;

  let env;
  if (typeof process.env.BROWSERSLIST_ENV === 'string') {
    env = process.env.BROWSERSLIST_ENV;
  } else if (typeof process.env.NODE_ENV === 'string') {
    env = process.env.NODE_ENV;
  } else {
    env = 'development';
  }

  return config[env] || config.defaults;
}

module.exports = (entry, dest, options) => {
  const browserslistConfig = pickEnv(browserslist.findConfig('.'));
  const targetBrowsers = Array.isArray(browserslistConfig)
    ? browserslistConfig
    : [browserslistConfig];

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
                browsers: targetBrowsers,
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
