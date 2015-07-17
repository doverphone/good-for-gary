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
	jshint = require('gulp-jshint')
	del = require('del'),
	ftpconfig = require('./ftpconfig'),
	ftp = require('vinyl-ftp');


gulp.task('less', function() {	
	return gulp.src('./src/css/less/master.less')
		.pipe(less())
		.pipe(cssConcat("./src/css/styles.css"))
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./'))
		.pipe(reload({stream: true}));
});

gulp.task('jshint', function() {
	return gulp.src('./src/js/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('compress-vendor-js',function() {
	var vendorSource = ['./node_modules/jquery/dist/jquery.min.js',
						'./node_modules/jquery.easing/jquery.easing.min.js', 
						'./node_modules/bootstrap/dist/js/bootstrap.min.js',
						'./node_modules/mustache/mustache.min.js',
						'./src/js/vendor/*.js'];
	return gulp.src(vendorSource)
		.pipe(uglify())
		.pipe(concat('vendor.min.js'))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('compress-src-js', function() {
	return gulp.src('./src/js/*.js')
		.pipe(uglify())
		.pipe(concat('scripts.min.js'))
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('compress-images', function() {
	return gulp.src('./src/img/**/*.*')
		.pipe(imagemin({progressive: true}))
		.pipe(gulp.dest('./dist/img'));
});

gulp.task('compress-html', function() {
	return gulp.src('./src/index.html')
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
	gulp.watch('./src/less/**/*.less', ['less']);
	gulp.watch('./src/js/**/*.js', ['jshint', 'compress-js']).on('change', reload);
	gulp.watch('./src/*.html').on('change', reload);
});

gulp.task('clean', function(cb) {
	del(['dist/**/*']);
});

gulp.task('copy-css', function() {
	return gulp.src('./src/css/styles.min.css')
		.pipe(gulp.dest('./dist/css'));
});

gulp.task('copy-static', function() {
	return gulp.src('./src/static/**/*')
		.pipe(gulp.dest('./dist/static'));
});

gulp.task('build', ['compress-js', 'less', 'compress-html', 'compress-images', 'copy-static', 'copy-css']);

gulp.task('serve', function() {
	browserSync.init({
		server: "./dist"
	});
});

gulp.task('stage', function() {
	process.stdout.write('Transfering files...\n');
    var conn = ftp.create(ftpconfig.staging);
    return gulp.src('dist/**/*', {base: './dist', buffer: false})
	    .pipe(conn.newer('/'))
	    .pipe(conn.dest('/'));
    process.stdout.write('Transfer complete...\n');
});

gulp.task('deploy', function() {
	process.stdout.write('Transfering files...\n');
    var conn = ftp.create(ftpconfig.production);
    return gulp.src('dist/**/*', {base: './dist', buffer: false}) 
    	.pipe(conn.newer('/'))
    	.pipe(conn.dest('/'));
    process.stdout.write('Transfer complete...\n');
});

gulp.task('default', ['serve', 'watch']);