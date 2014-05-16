module.exports = function(config) {
	config.set({
		basePath : '',
		frameworks : [ 'jasmine' ],
		files : [ 'bower_components/angular/angular.min.js',
				'bower_components/angular-mocks/angular-mocks.js',
				'src/classes/*.js', 'src/services/*.js', 'src/directive/*.js',
				'src/angular-shiro.js',
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
		colors : true,
		logLevel : config.LOG_INFO,
		autoWatch : true,
		browsers : [ 'Firefox' ],
		captureTimeout : 60000,
		singleRun : false
	});
};
