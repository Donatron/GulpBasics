'use strict';

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    del = require('del');

gulp.task("concatScripts", function() {
  // "return" will help minify task know that this task has finished running
  return gulp.src([
    'js/jquery.js',
    'js/stick/jquery.sticky.js',
    'js/main.js'])
    // .pipe(maps.init())
    .pipe(concat("app.js"))
    // .pipe(maps.write('./'))
    .pipe(gulp.dest("js"));
});

// ["concatScripts"] creates a dependency for the minify task to check before it runs
gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("js/app.js")
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('compileSass', function() {
  return gulp.src("scss/application.scss")
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'));
})

gulp.task("watchFiles", function() {
  // "Globbing pattern to look for all files in scss folder wtih scss extension"
  gulp.watch('scss/**/*.scss', ['compileSass']);
  gulp.watch('js/main.js', ['concatScripts']);
})

// Deletes files built by running "build" task previously
gulp.task('clean', function() {
  del(['dist', 'css/application.css*', 'js/app.*.js*']);
})

gulp.task("build", ['minifyScripts', 'compileSass'], function() {
  return gulp.src(['css/application.css', 'js/app.min.js', 'index.html',
                    'img/**', 'fonts/**'], { base: './'})
                    .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles']);

// runs "clean" task before build to delete any files which may have had name changes and be left behind by the build task
gulp.task("default", ["clean"], function() {
  gulp.start('build');
});
