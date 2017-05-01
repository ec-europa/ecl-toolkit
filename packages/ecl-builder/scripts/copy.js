const path = require('path');
const copy = require('ncp').ncp;
const mkdirp = require('mkdirp');
const globby = require('globby');

module.exports = (patterns, from, to) => {
  globby(patterns, {
    nodir: true,
    cwd: from,
  }).then((paths) => {
    paths.forEach((file) => {
      const input = path.resolve(from, file);
      const dest = path.resolve(to, file);

      mkdirp(path.dirname(dest), (mkdirpErr) => {
        if (mkdirpErr) {
          console.error(mkdirpErr);
          process.exit(1);
        }

        copy(input, dest, (err) => {
          if (err) {
            return console.error(err);
          }

          return 0;
        });
      });
    });
  });
};
