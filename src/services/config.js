'use strict';

/**
 * @ngdoc service
 * @name angularShiro.services.AngularShiroConfig
 * 
 * @description Angular Shiro Configuration 
 * 
 * #Custom configuration
 * 
 * <pre>
 *  app.config([ 'angularShiroConfigProvider', function(config) {
 *  	// Customize the configuration
 *  	config.options.login.uri = 'my/custom/uri';
 *  } ]);
 * </pre>
 */
function AngularShiroConfigProvider() {

	this.options = {
		loginUrl : '/login',
		urls : {
			'/' : 'anon',
			'/index' : 'anon',
			'/login' : 'anon',
			'/signin' : 'anon',
			'/logout' : 'logout',
			'/signout' : 'logout'
		},
		login : {
			uri : '/api/authenticate',
			path : '/login'
		},
		logout : {
			uri : '/api/logout',
			path : 'logout',
			redirectUrl : '/'
		}
	};

	this.$get = [ function() {
		return this.options;
	} ];

}