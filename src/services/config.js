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
	
	this.registerPathFilter = function(path, filterChain) {
		var obj = {};
		obj[path] = filterChain;
		var replaced = false;
		var urls = this.options.urls;
		var tmp = [];
		for (var i = 0; i < urls.length; i++) {
			var url = urls[i];
			var p = Object.keys(url)[0];
			if (p === path) {
				tmp.push(obj);
				replaced = true;
			} else {
				tmp.push(url);
			}
		}
		if (!replaced) {
			tmp.push(obj);
		}
		this.options.urls = tmp;
	};
	
	this.$get = [ function() {
		return this.options;
	} ];

}