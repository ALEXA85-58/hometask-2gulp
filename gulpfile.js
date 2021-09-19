'use strict';

const gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rigger = require('gulp-rigger'),
    terser = require('gulp-terser'),
    prefixer = require('gulp-autoprefixer'),
    htmlmin = require('gulp-htmlmin'),
    sass = require('gulp-sass')(require('node-sass')),
    rimraf = require('gulp-rimraf'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;


const path = {
    build:{
        html:'build/',
        scss:'build/css/',
        js:'build/js/',
        fonts:'build/fonts/',
        img:'build/img/',
    },
    src:{
        html:'src/*.{html,htm}',
        scss:'src/scss/main.scss',
        js:['src/js/libs.js','src/js/app.js'],
        fonts:'src/fonts/**/*.{eot,svg,ttf,woff,woff2}',
        img:'src/img/**/*.{jpg,gif,jpeg,png,svg,webp}',
    },
    watch:{
      html:'src/*.{html,htm}',
    },
    clean:'build/'
},
    config = {
      server:{
        baseDir:'build/',
        index:'index.html'
        },
        tunnel:true,
        port:7787,
        logPrefix: 'WebDev'
    };

gulp.task('clean', function (done){
    rimraf(path.clean)
    done();
});

gulp.task('mv:fonts', function (done){
    gulp.src(path.src.fonts)
        .pipe(plumber())
        .pipe(gulp.dest(path.build.fonts));
    done()
});

gulp.task('build:html', function (done){
    gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(htmlmin({
            collapseWhitespace:true,
            removeComments:true,
            useShortDoctype:true
            }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream:true}));
done();
});

gulp.task('build:scss', function (done){
    gulp.src(path.src.scss)
        .pipe(plumber())
        .pipe(sass({
            outputStyle:'compressed'
        }))
        .pipe(prefixer({
            cascade:false,
            remove:true
        }))
        .pipe(gulp.dest(path.build.scss))
        .pipe(reload({stream:true}));
    done();
});

gulp.task('build:js', function (done){
    gulp.src(path.src.js)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(terser())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream:true}));
    done();
});

gulp.task('watch', function (done){
    gulp.watch(path.watch.html, gulp.series('build:html'))
    done();
});

gulp.task('webserver', function (done){
   browserSync(config);
   done();
});

gulp.task('default', gulp.series('clean',gulp.parallel('mv:fonts','build:js','build:html','build:scss'),'watch','webserver'));