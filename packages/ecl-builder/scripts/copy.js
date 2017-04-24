const path = require('path');
const copy = require('ncp').ncp;
const mkdirp = require('mkdirp');

module.exports = (from, to) => {
  mkdirp(path.dirname(to), (mkdirpErr) => {
    if (mkdirpErr) {
      console.error(mkdirpErr);
      process.exit(1);
    }

    copy(from, to, (err) => {
      if (err) {
        return console.error(err);
      }

      return 0;
    });
  });
};
