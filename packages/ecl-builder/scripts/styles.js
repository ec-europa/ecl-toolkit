const sass = require('node-sass');
const path = require('path');
const fs = require('fs');
const postcss = require('postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const postcssNormalize = require('postcss-normalize');
const mkdirp = require('mkdirp');
const findup = require('findup-sync');

module.exports = (entry, dest, options) => {
  const plugins = [];

  if (options.normalize) {
    plugins.push(postcssNormalize());
  }

  plugins.push(autoprefixer());

  if (process.env.NODE_ENV === 'production') {
    plugins.push(cssnano({ safe: true }));
  }

  sass.render(
    {
      file: entry,
      outFile: dest,
      sourceMap: true,
      importer: (url, prev, done) => {
        try {
          const base = path.dirname(prev);
          const normalizedUrl = url.startsWith('~') ? url.substr(1) : url;
          const normalizedDir = path.dirname(normalizedUrl);
          const normalizedFile = path.basename(normalizedUrl, '.scss');
          const prefix = url.startsWith('~') ? 'node_modules' : '';

          const checkFor = [
            path.join(prefix, normalizedDir, `${normalizedFile}.scss`),
            path.join(prefix, normalizedDir, `_${normalizedFile}.scss`),
            path.join(prefix, normalizedUrl, 'index.scss'),
            path.join(prefix, normalizedDir, 'package.json'),
            path.join(prefix, normalizedDir, normalizedFile, 'package.json'),
          ];

          const file = findup(checkFor, {
            cwd: base,
          });

          if (path.basename(file) === 'package.json') {
            // eslint-disable-next-line
            const pkg = require(file);
            const relativeStyle = pkg.style || pkg.main || 'index.scss';

            return done({
              file: path.resolve(path.dirname(file), relativeStyle),
            });
          }

          return done({ file });
        } catch (e) {
          // Return a better error message?
          return done();
        }
      },
    },
    (sassErr, sassResult) => {
      if (!sassErr) {
        postcss(plugins)
          .process(sassResult.css, {
            map: options.sourceMap === true ? true : { inline: false },
            from: entry,
            to: dest,
          })
          .then(postcssResult => {
            mkdirp(path.dirname(dest), mkdirpErr => {
              if (mkdirpErr) {
                console.error(mkdirpErr);
                process.exit(1);
                return;
              }

              fs.writeFile(dest, postcssResult.css);
              if (postcssResult.map) {
                fs.writeFile(`${dest}.map`, postcssResult.map);
              }
            });
          });
      } else {
        console.error(sassErr);
        process.exit(1);
      }
    }
  );
};
