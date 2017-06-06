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
  copy: [
    {
      from: path.resolve(
        __dirname,
        'node_modules/@ec-europa/ecl-components-preset-base/node_modules/@ec-europa/ecl-icons/fonts'
      ),
      to: path.resolve(__dirname, 'dist/fonts'),
    },
    {
      from: path.resolve(
        __dirname,
        'node_modules/@ec-europa/ecl-components-preset-base/node_modules/@ec-europa/ecl-logos/images'
      ),
      to: path.resolve(__dirname, 'dist/images'),
    },
  ],
};
