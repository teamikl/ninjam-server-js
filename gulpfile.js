'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var allSpecFiles = ['./test/*_spec.js'];
var allJSFiles = ['./*.js', './src/*.js'];

gulp.task('test', function() {
  // NOTE: need to load explicitly
  var mocha = require('gulp-mocha');

  // XXX: load from ./test/mocha.opt
  global._ = require('lodash');
  global.expect = require('chai').expect;

  return gulp.src(allSpecFiles)
    .pipe(mocha({
      ui: 'bdd',
      reporter: 'spec'
    }));
});

// XXX: not work
gulp.task('cover', function() {
  gulp.src(allJSFiles)
    .pipe($.istanbul())
    .on('end', function() {
      gulp.src(allJSFiles)
        .pipe($.mocha())
        .pipe($.istanbul.writeReports('coverage'));
    });
});

gulp.task('jscs', function() {
  return gulp.src(allJSFiles)
    .pipe($.jscs());
});

gulp.task('jshint', function() {
  return gulp.src(allJSFiles)
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
  gulp.watch(allJSFiles, ['jshint', 'jscs']);
});

gulp.task('default', ['watch']);
