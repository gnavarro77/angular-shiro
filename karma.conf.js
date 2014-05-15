// Karma configuration
// Generated on Thu Jan 02 2014 17:46:23 GMT+0100 (Paris, Madrid)

module.exports = function(config) {
	config.set({
		basePath : '',

		// frameworks to use
		frameworks : [ 'jasmine' ],

		// list of files / patterns to load in the browser
		files : [ 'bower_components/angular/angular.min.js',
				'bower_components/angular-mocks/angular-mocks.js',
				'src/classes/*.js', 'src/directive/*.js', 'src/services/*.js',
				'src/angular-security.js',
//				'test/unit/AuthorizationInfoLoaderSpec.js',
				'test/directive/**/*.js'
		// 'test/unit/**/*.js'
		],

		// list of files to exclude
		exclude : [

		],

		reporters : [ 'progress', 'junit', 'dots' ],
		junitReporter : {
			outputFile : 'build/test/results.xml',
			suite : ''
		},

		// web server port
		// port : 9876,
		// enable / disable colors in the output (reporters and logs)
		colors : true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR ||
		// config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel : config.LOG_INFO,
		autoWatch : true,
		browsers : [ 'Firefox' ],
		captureTimeout : 60000,
		singleRun : false

	});
};
