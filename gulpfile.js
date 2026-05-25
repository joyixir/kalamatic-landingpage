'use strict';

const fs = require('fs');
const path = require('path');
const { src, dest, series, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const log = require('fancy-log');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const ejs = require('gulp-ejs');
const rename = require('gulp-rename');
const adsAndVerificationConfig = require('./src/statics/ads-and-verification-config');
const chatSiteConfig = require('./src/statics/chat-config');

const paths = {
    styles: './src/scss/*.scss',
    styleWatch: './src/scss/**/*.scss',
    scripts: './src/js/**/*.js',
    pages: './pages/*.ejs',
    partials: './pages/**/*.ejs',
    fonts: './src/fonts/**/*',
    images: './src/img/**/*',
    statics: [
        './src/statics/**/*',
        '!./src/statics/ads-and-verification-config.js',
        '!./src/statics/ads-and-verification{,/**}'
    ],
    adsAndVerificationDir: './src/statics/ads-and-verification',
    dist: './dist'
};

function clean(done) {
    fs.rmSync(paths.dist, { recursive: true, force: true });
    done();
}

function styles() {
    return src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('./dist/assets/css'))
        .pipe(browserSync.stream({ match: '**/*.css' }));
}

function scripts() {
    return src(paths.scripts)
        .pipe(dest('./dist/assets/js'));
}

function fonts() {
    return src(paths.fonts)
        .pipe(dest('./dist/assets/fonts'));
}

function images() {
    return src(paths.images)
        .pipe(dest('./dist/assets/img'));
}

function statics() {
    return src(paths.statics, { dot: true })
        .pipe(dest(paths.dist));
}

function adsAndVerificationRootFiles() {
    const configuredFiles = adsAndVerificationConfig.adsAndVerification.files;

    for (const fileName of configuredFiles) {
        fs.rmSync(path.join(paths.dist, fileName), { force: true });
    }

    if (!adsAndVerificationConfig.adsAndVerification.enabled) {
        return Promise.resolve();
    }

    const rootFiles = configuredFiles.map((fileName) => path.join(paths.adsAndVerificationDir, fileName));

    return src(rootFiles, { dot: true, base: paths.adsAndVerificationDir })
        .pipe(dest(paths.dist));
}

function html() {
    return src([paths.pages, '!./pages/landing-data.ejs'])
        .pipe(ejs({
            CHAT_SITE_CONFIG: chatSiteConfig
        }, {}, { ext: '.html' }).on('error', function (err) {
            log.error(err);
            this.emit('end');
        }))
        .pipe(rename({ extname: '.html' }))
        .pipe(dest(paths.dist));
}

function reload(done) {
    browserSync.reload();
    done();
}

function serve(done) {
    browserSync.init({
        port: 12345,
        host: '127.0.0.1',
        server: {
            baseDir: paths.dist
        },
        notify: false,
        open: false,
        online: false,
        ui: false
    }, done);
}

function watchFiles() {
    watch(paths.styleWatch, styles);
    watch(paths.scripts, series(scripts, reload));
    watch(paths.partials, series(html, reload));
    watch(paths.images, series(images, reload));
    watch(paths.fonts, series(fonts, reload));
    watch(['./src/statics/ads-and-verification-config.js', './src/statics/ads-and-verification/**/*'], series(adsAndVerificationRootFiles, reload));
    return watch(paths.statics, series(statics, reload));
}

const build = series(clean, parallel(styles, scripts, html, fonts, images, statics, adsAndVerificationRootFiles));
const dev = series(build, serve, watchFiles);

exports.clean = clean;
exports.build = build;
exports.dev = dev;
exports.default = build;
