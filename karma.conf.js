module.exports = function(config) {
	config.set({
		basePath : '',
		frameworks : [ 'jasmine' ],
		files : [ 'bower_components/angular/angular.min.js',
				'bower_components/angular-mocks/angular-mocks.js',

				'src/services/authenticate.js', 
				'src/services/authorize.js',
				'src/services/subject.js',

				'src/directives/*.js', 
				'src/angular-shiro.js',

				'test/services/*.js',
				'test/directives/*.js'

		],

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
