var gulp = require('gulp'),
    glob = require("glob"),
    path = require('path'),
    pkg = require('./package.json'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    // uglify = require('gulp-uglify'),
    uglify = require("uglify-js").minify,
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    gutil = require('gulp-util'),
    // size = require('gulp-size'),
    fs = require('fs'),

    extendWinston = function (extentions, extentionsBasePath) {
        //Gulp plugin requires
        var through2 = require('through2'),
            plexer = require('plexer'),
            mergestream = require('merge-stream'),
            path = require('path');

        // console.log(vinylFile.inspect());

        var restoreStream = through2.obj();

        var stream = through2.obj(function(file, enc, cb) {
            // cb(<error>, <vinylFile>)

            extentions.forEach(function (extpath) {

            });




        }, function (cb) {
            restoreStream.end();
            cb();
        });

        stream.restore = function (options) {
            var tempStream;

            options = options || {};

            if (options.end) {
                return restoreStream;
            }

            return plexer(
                {objectMode: true},
                tmpStream,
                mergestream(restoreStream, tmpStream)
            );
        };

        return stream;
    };

gulp.task('lint', function() {
    gulp.src('./src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build-winston', function () {
    gulp.src('./src/register.js')
        .pipe(extendWinston(['on', 'template', 'data', 'render'],
                            './src/extentions/'));
});

gulp.task('transpile', function () {
    var bundler = browserify({ debug: true }),
        b;

    bundler.transform(babelify);
    bundler.add('./src/wc.js');

    b = bundler.bundle()
        .on('error', gutil.log)
        .pipe(fs.createWriteStream('./dist/wc.js'));

});

gulp.task('distro', ['transpile'], function () {
    var bundler = browserify({ debug: true }),
        b;

    bundler.transform(babelify);
    bundler.add('./distro.js');

    b = bundler.bundle()
        .on('error', gutil.log)
        .pipe(fs.createWriteStream('./dist/winston-churchill.js'));
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

gulp.task('default', ['lint', 'distro']);
