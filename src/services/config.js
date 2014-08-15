'use strict';

/**
 * @ngdoc service
 * @name angularShiro.services.angularShiroConfig
 * 
 * @description Angular Shiro Configuration # Default configuration
 * 
 * <pre>
 * options = {
 * 	logout : {
 * 		uri : '/api/logout',
 * 		path : 'logout',
 * 	}
 * }
 * </pre> # Custom configuration
 * 
 * <pre>
 *  app.config([ 'angularShiroConfigProvider', function(config) {
 *  	// Customize the configuration
 *  } ]);
 * </pre>
 */
function AngularShiroConfigProvider() {

	this.options = {
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