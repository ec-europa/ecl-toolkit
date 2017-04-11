const copy = require('fs-extra').copy;

module.exports = (from, to) => {
  copy(from, to, (err) => {
    if (err) {
      return console.error(err);
    }

    return 0;
  });
};
