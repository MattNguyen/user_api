'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var nodemon = require('gulp-nodemon');

gulp.task('lint', function() {
  gulp.src(['./**/*.js', '!./node_modules/**'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('dev', function() {
  nodemon({
    script: './index.js',
    ignore: ['gulpfile.js', 'node_modules'],
    env: {
      'NODE_ENV': 'development',
      'PORT': 8080,
      'HOST': 'localhost'
    },
    nodeArgs: ['--debug', '--harmony', '--use_strict']
  })
  .on('change', ['lint']);
});
