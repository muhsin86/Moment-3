const { src, dest, watch, series, parallel } = require("gulp"),
concat = require("gulp-concat"),
uglifyes = require('gulp-uglify-es').default,
babel = require("gulp-babel"),
csso = require('gulp-csso'),
sass = require('gulp-sass'),
browserSync = require('browser-sync').create(),
livereload = require('gulp-livereload');

// Paths
const files = {
	htmlPath: 'src/**/*.html',
	scssPath: "src/scss/main.scss",
	jsPath: "src/**/*.js", 
	imagePath: "src/images/*.*"
	
};

// Tasks for copying a html files and images
function html() {
    return src(files.htmlPath)
        .pipe(dest('Public'))
		.pipe(browserSync.stream())
		.pipe(livereload());  
}

function image()
{
	return src(files.imagePath)
	.pipe(dest('Public/images'))
	.pipe(livereload());  
}
// Tasks for Concatenating And Minifying JavaScript and CSS Files

function js() {
	    return src(files.jsPath)
	    .pipe(concat('main.js'))
	    .pipe(uglifyes())
	    .pipe(babel({
		presets: ['@babel/preset-env'],
		plugins: ['@babel/transform-runtime']
	     }))
	    .pipe(dest('public/js'))
	    .pipe(browserSync.stream())
	    .pipe(livereload()); 
}

function scss()
{
	return src(files.scssPath)
	.pipe(sass().on('error', sass.logError))
	.pipe(csso())
	.pipe(dest('Public/css'))
	.pipe(browserSync.stream())
	.pipe(livereload());  
}

//
function image()
{
	return src(files.imagePath)
	.pipe(dest('Public/images'))
	.pipe(browserSync.stream())
	.pipe(livereload());  
}

// watch task
function watchTask()
{
	livereload.listen();
	browserSync.init({
		server:{
			baseDir: 'Public/' }
		});
	watch([files.htmlPath, files.jsPath, files.scssPath, files.imagePath],
        parallel(html, js, scss, image)
    ).on('change', browserSync.reload);
}

// Gulp basic task
exports.default = series(
    parallel(html, js, scss, image, watchTask),
);
