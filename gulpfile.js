var gulp = require('gulp'),
    glob = require("glob"),
    path = require('path'),
    pkg = require('./package.json'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    gutil = require('gulp-util'),
    fs = require('fs');

gulp.task('lint', function() {
    gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('core', ['lint'], function () {
    var bundler = browserify({ debug: true }),
        b;

    bundler.transform(babelify);
    bundler.add('./src/wc.js');

    b = bundler.bundle()
        .on('error', gutil.log)
        .pipe(source('./wc.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(streamify(uglify()))
        .pipe(rename('wc.min.js'))
        .pipe(gulp.dest('./dist'));

});

gulp.task('distro', ['lint'], function () {
    var bundler = browserify({ debug: true }),
        b;

    bundler.transform(babelify);
    bundler.add('./distro.js');

    b = bundler.bundle()
        .on('error', gutil.log)
        .pipe(source('./distro.js'))
        .pipe(rename('winston-churchill.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(streamify(uglify()))
        .pipe(rename('winston-churchill.min.js'))
        .pipe(gulp.dest('./dist'));
});



gulp.task('es', function () {
    var globOptions = {
    ignore: ['/node_modules/**/*',
             '/bower_components/**/*']
    };

    glob('./**/*.es', globOptions, function (err, files) {

        files.forEach(function (file) {

            var bundler = browserify({ debug: true }),
                b;

            bundler.transform(babelify);
            bundler.add(file);

            console.log(path.basename(file));

            b = bundler.bundle()
                .on('error', gutil.log)
                .pipe(source(path.basename(file)))
                .pipe(rename(path.basename(file, '.es') + '.js'))
                .pipe(gulp.dest(path.dirname(file)));
        });
    });

});

gulp.task('default', ['distro', 'core', 'es']);

var o = {
    ignore: ['/node_modules/**/*',
             '/bower_components/**/*']
};
