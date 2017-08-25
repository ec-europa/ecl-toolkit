const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const watchify = require('watchify');
const babel = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const del = require('del');

//
// JS
//
gulp.task('js', ['clean:js'], () => compileJS());
gulp.task('js:watch', () => compileJS(true));

gulp.task('clean:js', () => del(['./dist/js']));

//
// Images
//
gulp.task('img', ['img:clean'], () => {
  gulp.src('./assets/img/**/*').pipe(gulp.dest('./dist/img'));
  gulp.src('./assets/favicon.ico').pipe(gulp.dest('./dist'));
});

gulp.task('img:clean', () => del(['./dist/img']));

gulp.task('img:watch', () => {
  gulp.watch('./assets/img/**/*', ['img']);
});

//
// Task sets
//
gulp.task('watch', ['js:watch', 'img:watch']);

gulp.task('default', ['js', 'img']);

//
// Utils
//
function compileJS(watch) {
  let bundler = browserify('./assets/js/ecl-fractal-theme.js', {
    debug: true,
  }).transform(babel, { presets: ['es2015'] });

  if (watch) {
    bundler = watchify(bundler);
    bundler.on('update', () => {
      console.log('Rebundling JS....');
      rebundle();
    });
  }

  function rebundle() {
    const bundle = bundler
      .bundle()
      .on('error', err => {
        console.error(err.message);
        // this.emit('end');
      })
      .pipe(source('ecl-fractal-theme.js'))
      .pipe(buffer());

    if (!watch) {
      bundle.pipe(uglify());
    }

    bundle
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('./dist/js'));

    return bundle;
  }

  rebundle();
}
