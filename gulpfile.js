var gulp = require('gulp'),
    path = require('path'),
    pkg = require('./package.json'),
    browserify = require('gulp-browserify'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    transform = require('vinyl-transform'),
    rename = require('gulp-rename'),
    traceur = require('gulp-traceur'),
    exorcist = require('exorcist');

gulp.task('lint', function() {
    gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('browserify', function () {
    gulp.src('./src/index.js')
        .pipe(browserify({
            entries: ['./index.js'],
            debug: true
        }))
        .pipe(traceur())
        .pipe(transform(function() { // Extracts the inline source maps to an external file
            return exorcist(path.join(__dirname, '/', pkg.name + '.js.map'));
        }))
        .pipe(rename(pkg.name + '.min.js'))
        .pipe(rename('winston-churchill.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('default', ['lint', 'browserify'], function () {

});
