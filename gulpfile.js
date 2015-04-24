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
    // uglify = require("uglify-js").minify,
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    gutil = require('gulp-util'),
    // size = require('gulp-size'),
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



gulp.task('components', function () {

    glob('./components/**/*.es', function (err, files) {
        console.log('glob args: ', arguments);

        files.forEach(function (file) {

            var bundler = browserify({ debug: true }),
                b;

            bundler.transform(babelify);
            bundler.add(file);

            b = bundler.bundle()
                .on('error', gutil.log)
                .pipe(function () {
                    console.log('this: ', this);
                    console.log('arguments: ', arguments);
                    return this;
                })
                .pipe(fs.createWriteStream('./dist/temp.js'));
        });
    });

});

gulp.task('default', ['distro', 'core']);
