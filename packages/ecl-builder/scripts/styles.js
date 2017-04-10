const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const mkdirp = require('mkdirp');

const entry = process.argv[2];

// console.log('postcss -c ./node_modules/@ecl/ecl-builder/postcss.config.js');

const params = process.env.NODE_ENV === 'production' ? {
  output: path.resolve(process.cwd(), 'dist/framework/styles/europa.css'),
  plugins: [cssnano],
  map: 'file',
} : {
  output: path.resolve(process.cwd(), 'static/framework/styles/europa.css'),
  plugins: [autoprefixer],
  map: true,
};

sass.render({
  file: entry,
  includePaths: [path.resolve(process.cwd(), 'node_modules')],
}, (sassErr, sassResult) => {
  if (!sassErr) {
    postcss(params.plugins)
      .process(sassResult.css, { map: params.map, from: entry, to: params.output })
      .then((postcssResult) => {
        mkdirp(path.dirname(params.output), (mkdirpErr) => {
          if (mkdirpErr) {
            console.error(mkdirpErr);
          } else {
            fs.writeFile(params.output, postcssResult.css);
            if (postcssResult.map) {
              fs.writeFile(`${params.output}.map`, postcssResult.map);
            }
          }
        });
      });
  }
});
