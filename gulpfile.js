// Load plugins
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    minifyHTML = require('gulp-minify-html'),
    ngHtml2Js = require("gulp-ng-html2js"),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr(),
    livereloadport = 35729;

// Styles
gulp.task('styles', function() {
    return gulp.src('assets/css/main.scss')
        .pipe(sass({ style: 'expanded' }))
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles'))
        .pipe(livereload(server));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(['src/partials-js/**/*.js'])
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(livereload(server));
});

// Scripts
gulp.task('angular', function() {
    return gulp.src(['src/angular/**/*.js'])
        .pipe(concat('angular-lib.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(uglify())
        .pipe(livereload(server));
});

// Jquery
gulp.task('jquery', function() {
    return gulp.src(['src/jquery-lib/**/*.js'])
        .pipe(concat('jquery-lib.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(uglify())
        .pipe(livereload(server));
});

//html
gulp.task('html', function() {
    return gulp.src(['src/partials/**/*.html'])
        .pipe(minifyHTML({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(gulp.dest('dist/partials'))
        .pipe(ngHtml2Js({
            moduleName: "ODAdmin.Partials",
            prefix: "/partials"
        }))
        .pipe(concat("partials.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest('dist/partials'))
        .pipe(livereload(server));
});

// Clean
//gulp.task('clean', function() {
//    return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
//        .pipe(clean());
//});

// Watch
gulp.task('watch', function() {

    server.listen(livereloadport, function (err) {

        if (err) {
            return console.log(err)
        }

        // Watch .scss files
        gulp.watch('assets/css/*.scss', ['styles']);

        // Watch .js files
        gulp.watch(['src/partials-js/**/*.js'], ['scripts']);

        // Watch angular files & angular libs
        gulp.watch(['src/angular/**/*.js'], ['angular']);

        // Watch jquery libs
        gulp.watch(['src/jquery-lib/*.js'], ['jquery']);

        // Watch .html files
        gulp.watch('src/partials/**/*.html', ['html']);

    });

});

//Default Task
gulp.task('default', ['styles', 'html', 'scripts', 'angular','jquery', 'watch']);
