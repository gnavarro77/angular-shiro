module.exports = function(config) {
	config.set({
		basePath : '',
		frameworks : [ 'jasmine' ],
		files : [ 'bower_components/angular/angular.min.js',
				'bower_components/angular-mocks/angular-mocks.js',
				'src/core/IllegalArgumentException.js.js',
				'src/core/authz/AuthorizationException.js',
				'src/core/authz/AuthorizationInfo.js',
				'src/core/authz/Permission.js',
				'src/core/authz/Authorizer.js',
				'src/core/session/Session.js',
				
				'src/services/authenticate.js',
				'src/services/subject.js',
				
				'src/directives/hasRole.js',
				'src/angular-shiro.js',
				
				'test/services/authenticateSpec.js',
				'test/services/usernamePasswordTokenSpec.js'
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
