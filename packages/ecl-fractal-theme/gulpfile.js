const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const babel = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

//
// JS
//
gulp.task('js', compileJS);

//
// Task sets
//
gulp.task('default', ['js']);

//
// Utils
//
function compileJS() {
  const bundler = browserify('./assets/js/ecl-fractal-theme.js', {
    debug: true,
  }).transform(babel, { presets: ['es2015'] });

  function rebundle() {
    const bundle = bundler
      .bundle()
      .on('error', err => {
        console.error(err.message);
        // this.emit('end');
      })
      .pipe(source('ecl-fractal-theme.js'))
      .pipe(buffer());

    bundle.pipe(uglify());

    bundle
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/js'));

    return bundle;
  }

  rebundle();
}
