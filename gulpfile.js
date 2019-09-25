const { src, dest, watch, series, parallel } = require('gulp'),
concat = require('gulp-concat'),
uglifyes = require('gulp-uglify-es').default,
imagemin = require('gulp-imagemin'),
sourcemaps = require('gulp-sourcemaps'),
sass = require('gulp-sass'),
rename = require('gulp-rename'),
livereload = require('gulp-livereload');


// Paths
const files = {
    htmlPath: "src/**/*.html",
    jsPath: "src/**/*.js",
    scssPath: "src/**/*.scss",
    imagePath: "src/images/*"
}

// Tasks for copying a html files and images
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
    

// Task for Concatenating And Minifying JavaScript Files

function js() {
    return src(files.jsPath)
    .pipe(concat('main.js'))
    .pipe(uglifyes())
    .pipe(dest('public/js'))
    .pipe(livereload()); 
}

// Task for compile Scss Files
function scss() {
  return src(files.scssPath)
      .pipe(sourcemaps.init({ loadMaps: true, largeFile: true }))
      .pipe(sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError))
      .pipe(rename("style.css"))
      .pipe(sourcemaps.write())
      .pipe(dest('public/css/'))
      .pipe(livereload()); 
}

// Watching tasks

function watchTask() {
    livereload.listen();
    watch([files.htmlPath, files.jsPath, files.scssPath, files.imagePath],
       parallel(html, js, scss, image))
}

// Gulp basic task

exports.default = series(
    parallel(html, js, scss, image),
    watchTask
);
