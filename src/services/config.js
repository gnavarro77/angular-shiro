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
		login : {
			uri : '/api/authenticate',
			path : 'index'
		},
		logout : {
			uri : '/api/logout',
			path : 'logout',
		}
	}

	this.$get = [ function() {
		return this.options;
	} ];

}