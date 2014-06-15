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
 *  config.options.
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
			path : 'index'
		},
		logout : {
			uri : '/api/logout',
			path : 'logout',
			redirectUrl : '/',
		}
	}

	this.$get = [ function() {
		return this.options;
	} ];

}