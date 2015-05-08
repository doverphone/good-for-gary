var gulp = require('gulp'),
	watch = require('gulp-watch'),
	path = require('path'),
	less = require('gulp-less'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	cssConcat = require('gulp-concat-css'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload;


gulp.task('less', function() {
	
	return gulp.src('./styles/**/master.less')
		.pipe(less())
		.pipe(cssConcat("styles/styles.css"))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./'))
		.pipe(reload({stream: true}));
});

gulp.task('watch', function() {
	gulp.watch('./styles/less/*.less', ['less']);
})

gulp.task('serve', ['less'], function() {
	browserSync.init({
		server: "./"
	});

	gulp.watch('./styles/less/*.less', ['less']);
	gulp.watch('./*.html').on('change', reload);
	gulp.watch('./js/*.js').on('change', reload);
})

gulp.task('default', ['serve']);