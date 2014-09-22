'use strict';

var gulp = require('gulp');

// TODO: watch lint
gulp.task('lint', function() {
  var jshint = require('gulp-jshint');
  var stylish = require('jshint-stylish');

  return gulp.src(['*.js', './src/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function(){
  gulp.watch('./src/*.js', ['lint']);
});

gulp.task('default', ['lint']);
