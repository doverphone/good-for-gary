var gulp = require('gulp'),
	watch = require('gulp-watch'),
	path = require('path'),
	less = require('gulp-less'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	cssConcat = require('gulp-concat-css'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload, 
	jshint = require('gulp-jshint');


gulp.task('less', function() {	
	return gulp.src('./styles/**/master.less')
		.pipe(less())
		.pipe(cssConcat("styles/styles.css"))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./'))
		.pipe(reload({stream: true}));
});

gulp.task('jshint', function() {
	return gulp.src('./js/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
	gulp.watch('./styles/less/*.less', ['less']);
	gulp.watch('./js/**/*.js', ['jshint']).on('change', reload);
	gulp.watch('./*.html').on('change', reload);
});

gulp.task('serve', function() {
	browserSync.init({
		server: "./"
	});
});

gulp.task('default', ['serve', 'watch']);