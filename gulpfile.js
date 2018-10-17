'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var ejs = require('gulp-ejs');
var deploy = require('gulp-gh-pages');

gulp.task('default', [], function () {
    // write default tasks here
});

gulp.task('server', ['build', 'watch'], function () {
    connect.server({
        port: 12345,
        root: './',
        livereload: true
    });
});

gulp.task('build', [
    'build:css',
    'build:js',
    'build:html',
    'build:font',
    'build:img',
    'build:statics',
]);

gulp.task('build:css', [], function () {
    gulp.src('./src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/assets/css'))
        .pipe(connect.reload());
});

gulp.task('build:js', [], function () {
    gulp.src('./src/js/**/*.js')
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(connect.reload());
});

gulp.task('build:font', [], function () {
    gulp.src('./src/fonts/**/*')
        .pipe(gulp.dest('./dist/assets/fonts'))
        .pipe(connect.reload());
});

gulp.task('build:img', [], function () {
    gulp.src('./src/img/**/*')
        .pipe(gulp.dest('./dist/assets/img'))
        .pipe(connect.reload());
});

gulp.task('build:statics', [], function () {
    gulp.src('./src/statics/**/*', {dot: true})
        .pipe(gulp.dest('./dist/'))
        .pipe(connect.reload());
});

gulp.task('build:html', [], function () {
    gulp.src('./pages/*.ejs')
        .pipe(ejs(null, null, {
            ext: '.htm'
        }).on('error', gutil.log))
        .pipe(gulp.dest('./dist'))
        .pipe(connect.reload());
});

gulp.task('watch', [], function () {
    gulp.watch('./src/scss/**/*.scss', ['build:css']);
    gulp.watch('./src/js/**/*.js', ['build:js']);
    gulp.watch('./pages/**/*.ejs', ['build:html']);
    gulp.watch('./src/img/**/*', ['build:img']);
    gulp.watch('./src/fonts/**/*', ['build:font']);
    gulp.watch('./src/statics/**/*', ['build:statics']);
});

gulp.task('clean', [], function () {
    gulp.src([
        './dist/*',
        '!./dist/**/.keep'
    ], {read: false})
        .pipe(clean());
});

gulp.task('deploy', function () {
    return gulp.src('./dist/**/*', {dot: true})
        .pipe(deploy())
});