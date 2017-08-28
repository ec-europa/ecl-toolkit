const path = require('path');

module.exports = {
  scripts: [],
  styles: [
    {
      entry: path.resolve(__dirname, './assets/scss/fractal.scss'),
      dest: path.resolve(__dirname, './dist/css/fractal.css'),
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
        '../../node_modules/@ec-europa/ecl-icons/fonts'
      ),
      to: path.resolve(__dirname, 'dist/fonts'),
    },
    {
      from: path.resolve(
        __dirname,
        '../../node_modules/@ec-europa/ecl-logos/images'
      ),
      to: path.resolve(__dirname, 'dist/images'),
    },
    // Fractal specific
    {
      from: path.resolve(__dirname, './assets/img'),
      to: path.resolve(__dirname, './dist/img'),
    },
    {
      patterns: 'favicon.ico',
      from: path.resolve(__dirname, './assets'),
      to: path.resolve(__dirname, './dist'),
    },
  ],
};
