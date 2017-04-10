const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const mkdirp = require('mkdirp');

module.exports = (entry, dest, options) => {
  // console.log('postcss -c ./node_modules/@ecl/ecl-builder/postcss.config.js');

  const params = process.env.NODE_ENV === 'production' ? {
    plugins: [cssnano],
  } : {
    plugins: [autoprefixer],
  };

  sass.render({
    file: entry,
    includePaths: [path.resolve(process.cwd(), 'node_modules')],
  }, (sassErr, sassResult) => {
    if (!sassErr) {
      postcss(params.plugins)
        .process(sassResult.css, { map: options.sourceMap, from: entry, to: dest })
        .then((postcssResult) => {
          mkdirp(path.dirname(dest), (mkdirpErr) => {
            if (mkdirpErr) {
              console.error(mkdirpErr);
            } else {
              fs.writeFile(dest, postcssResult.css);
              if (postcssResult.map) {
                fs.writeFile(`${dest}.map`, postcssResult.map);
              }
            }
          });
        });
    }
  });
};
