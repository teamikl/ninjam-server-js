'use strict';

var gulp = require('gulp');

var allJSFiles = ['./*.js', './src/*.js'];

gulp.task('jscs', function() {
  var jscs = require('gulp-jscs');

  return gulp.src(allJSFiles)
    .pipe(jscs());
});

gulp.task('jshint', function() {
  var jshint = require('gulp-jshint');
  var stylish = require('jshint-stylish');

  return gulp.src(allJSFiles)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function() {
  gulp.watch(allJSFiles, ['jshint', 'jscs']);
});

gulp.task('default', ['watch']);
