const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const mkdirp = require('mkdirp');
const findup = require('findup-sync');

module.exports = (entry, dest, options) => {
  const params = process.env.NODE_ENV === 'production' ? {
    plugins: [cssnano],
  } : {
    plugins: [autoprefixer],
  };

  sass.render({
    file: entry,
    importer: (url, prev, done) => {
      if (url.startsWith('~')) {
        const base = path.dirname(prev);
        const normalizedUrl = url.substr(1);
        const normalizedDir = path.dirname(normalizedUrl);
        const normalizedFile = path.basename(normalizedUrl, '.scss');

        const checkFor = [
          path.join('node_modules', normalizedDir, `${normalizedFile}.scss`),
          path.join('node_modules', normalizedDir, `_${normalizedFile}.scss`),
          path.join('node_modules', normalizedUrl, 'index.scss'),
          path.join('node_modules', normalizedDir, 'package.json'),
          path.join('node_modules', normalizedDir, normalizedFile, 'package.json'),
        ];

        const file = findup(checkFor, {
          cwd: base,
        });

        if (path.basename(file) === 'package.json') {
          // eslint-disable-next-line
          const pkg = require(file);
          const relativeStyle = pkg.style || pkg.main || 'index.scss';

          return done({ file: path.resolve(path.dirname(file), relativeStyle) });
        }

        return done({ file });
      }
      return null;
    },
  }, (sassErr, sassResult) => {
    if (!sassErr) {
      postcss(params.plugins)
        .process(sassResult.css, { map: options.sourceMap, from: entry, to: dest })
        .then((postcssResult) => {
          mkdirp(path.dirname(dest), (mkdirpErr) => {
            if (mkdirpErr) {
              console.error(mkdirpErr);
              process.exit(1);
            } else {
              fs.writeFile(dest, postcssResult.css);
              if (postcssResult.map) {
                fs.writeFile(`${dest}.map`, postcssResult.map);
              }
            }
          });
        });
    } else {
      console.error(sassErr);
      process.exit(1);
    }
  });
};
