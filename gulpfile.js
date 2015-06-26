var gulp = require('gulp'),
	watch = require('gulp-watch'),
	imagemin = require('gulp-imagemin'),
	htmlmin = require('gulp-htmlmin'),
	htmlreplace = require('gulp-html-replace'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	path = require('path'),
	less = require('gulp-less'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	cssConcat = require('gulp-concat-css'),
	browserSync = require('browser-sync').create(),
	reload = browserSync.reload, 
	jshint = require('gulp-jshint');


gulp.task('less', function() {	
	return gulp.src('./less/styles.less')
		.pipe(less())
		.pipe(cssConcat("./css/styles.css"))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist'))
		.pipe(reload({stream: true}));
});

gulp.task('jshint', function() {
	return gulp.src('./js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('compress-vendor-js',function() {
	var vendorSource = ['./bower_components/jquery/dist/jquery.min.js',
						'./bower_components/jquery.easing/js/jquery.easing.min.js', 
						'./bower_components/bootstrap/dist/js/bootstrap.min.js',
						'./bower_components/mustache/mustache.min.js'];
	return gulp.src(vendorSource)
		.pipe(uglify())
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('compress-src-js', function() {
	return gulp.src('./js/*.js')
		.pipe(uglify())
		.pipe(concat('scripts.min.js'))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('compress-images', function() {
	return gulp.src('./img/**/*.*')
		.pipe(imagemin({progressive: true}))
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('compress-html', function() {
	return gulp.src('./index.html')
		.pipe(htmlreplace({
			js: ['/js/vendor.min.js', '/js/scripts.min.js']
		}))
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('compress-js', ['compress-vendor-js', 'compress-src-js']);

gulp.task('watch', function() {
	gulp.watch('./less/**/*.less', ['less']);
	gulp.watch('./js/**/*.js', ['jshint', 'compress-js']).on('change', reload);
	gulp.watch('./*.html').on('change', reload);
});

gulp.task('serve', function() {
	browserSync.init({
		server: "./"
	});
});

gulp.task('default', ['serve', 'watch']);