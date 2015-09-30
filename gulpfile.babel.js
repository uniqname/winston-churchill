import gulp from 'gulp';
import glob from 'glob';
import path from 'path';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import streamify from 'gulp-streamify';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import eslint from 'gulp-eslint';
import gutil from 'gulp-util';

gulp.task('lint', function () {
    gulp.src('./src/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('core', ['lint'], function () {
    let bundler = browserify({ debug: true });

    bundler.transform(babelify);
    bundler.add('./src/wc.js');

    return bundler.bundle()
        .on('error', gutil.log)
        .pipe(source('./wc.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(streamify(uglify()))
        .pipe(rename('wc.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('distro', ['lint'], function () {
    var bundler = browserify({ debug: true });

    bundler.transform(babelify);
    bundler.add('./distro.js');

    return bundler.bundle()
        .on('error', gutil.log)
        .pipe(source('./distro.js'))
        .pipe(rename('winston-churchill.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(streamify(uglify()))
        .pipe(rename('winston-churchill.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('es', function () {
    const globOptions = {
    ignore: ['/node_modules/**/*',
             '/bower_components/**/*']
    };

    glob('./**/*.es', globOptions, function (err, files) {

        files.forEach(function (file) {

            var bundler = browserify({ debug: true });

            bundler.transform(babelify);
            bundler.add(file);
            bundler.bundle()
                .on('error', gutil.log)
                .pipe(source(path.basename(file)))
                .pipe(rename(path.basename(file, '.es') + '.js'))
                .pipe(gulp.dest(path.dirname(file)));
        });
        return;
    });

});

gulp.task('default', ['distro', 'core', 'es']);
