const { src, dest, watch, series, parallel } = require('gulp'),
concat = require('gulp-concat'),
cssnano = require('gulp-cssnano'),
autoprefixer = require('gulp-autoprefixer'),
uglifyes = require('gulp-uglify-es').default,
imagemin = require('gulp-imagemin'),
sourcemaps = require('gulp-sourcemaps'),
sass = require('gulp-sass'),
rename = require('gulp-rename'),
livereload = require('gulp-livereload');

// Paths
const files = {
    htmlPath: "src/**/*.html",
    jsPath: "src/**/*.js",
    scssPath: "src/**/*.scss",
    cssPath: "public/**/*.css",
    imagePath: "src/images/*"
}

// Tasks for copying a html files and images
function html() {
    return src(files.htmlPath)
    .pipe(dest('public'))
    .pipe(livereload());
}

function image() {
        return src(files.imagePath)
        .pipe(imagemin())
        .pipe(dest('public/images'))
        .pipe(livereload());
    }
    

// Tasks for Concatenating And Minifying JavaScript and CSS Files

function js() {
    return src(files.jsPath)
    .pipe(concat('main.js'))
    .pipe(uglifyes())
    .pipe(dest('public/js'))
    .pipe(livereload()); 
}

function css() {
    return src(files.cssPath)
    .pipe(autoprefixer())
    .pipe(concat('main.css'))
    .pipe(concat('style.css'))
    .pipe(cssnano())
    .pipe(dest('public/css/sass'))
    .pipe(livereload());   
}


// Task for compile Scss Files
function scss() {
  return src(files.scssPath)
      .pipe(sass().on('error', sass.logError))
      .pipe(dest('public/css/'))
      .pipe(livereload()); 
}

// Watching tasks

function watchTask() {
    livereload.listen();
    watch([files.htmlPath, files.jsPath, files.cssPath, files.scssPath, files.imagePath],
       parallel(html, js, css, scss, image))
}

// Gulp basic task

exports.default = series(
    parallel(html, js, css, scss, image),
    watchTask
);
