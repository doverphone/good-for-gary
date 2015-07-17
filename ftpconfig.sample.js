// Sample ftp config so that you can upload your build to staging and production servers
// via the 'gulp stage' and 'gulp deploy' tasks.  Rename this file to ftpconfig.js to use it with gulp.

var gutil = require('gulp-util');

module.exports = {
	staging: {	
		user: "user@yourdomain.com",
		host: "yourstagingserver.com",
		password: "pwgoeshere!",
		parallel: 2,
		log: gutil.log
	},
	production: {
		user: "user@prodserver.com",
		host: "prod.com",
		password: "verystrongprodpassword",
		parallel: 2,
		log: gutil.log
	}
};