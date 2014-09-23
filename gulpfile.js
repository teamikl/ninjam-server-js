'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var allSpecFiles = ['./test/*_spec.js'];
var allJSFiles = ['./*.js', './src/*.js'];

gulp.task('test', function() {
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
