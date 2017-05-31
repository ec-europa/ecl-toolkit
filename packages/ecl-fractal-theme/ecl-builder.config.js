const path = require('path');

module.exports = {
  scripts: [],
  styles: [
    {
      entry: path.resolve(__dirname, 'ecl/index.scss'),
      dest: path.resolve(__dirname, 'dist/ecl/ecl.css'),
      options: {
        normalize: true,
        sourceMap: true,
      },
    },
  ],
  copy: [],
};
