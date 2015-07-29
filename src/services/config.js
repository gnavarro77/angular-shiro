'use strict';

/**
 * @ngdoc service
 * @name angularShiro.services.angularShiroConfigProvider
 * 
 * @description `angularShiroConfigProvider` is used to configure
 *              `angular-shiro`.
 * 
 */
function AngularShiroConfigProvider() {

    var options = {
	urls : {
	    '/' : 'anon',
	    '/index' : 'anon',
	    '/login' : 'anon',
	    '/signin' : 'anon',
	    '/logout' : 'logout',
	    '/signout' : 'logout'
	},
	login : {
	    api : '/api/authenticate',
	    path : '/login'
	},
	logout : {
	    api : '/api/logout',
	    path : '/'
	}
    };

    /**
     * 
     * @ngdoc method
     * @function
     * @name AngularShiroConfigProvider#setFilter
     * @methodOf angularShiro.services.angularShiroConfigProvider
     * 
     * @description Associate the specified filter(s) with the given path
     * 
     * @param {string}
     *                path the path for which the filter(s) should be applied
     * @param {string|array}
     *                filterName the filter(s) to apply to the path
     * 
     * @example
     * 
     * <pre>
     * app.config([ 'angularShiroConfigProvider', function(config) {
     *     config.setFilter('/my/path', 'authc');
     * } ]);
     * </pre>
     */
    this.setFilter = function(path, filterName) {
	angular.extend(options, {
	    path : filterName
	});
    }

    /**
     * 
     * @ngdoc method
     * @function
     * @name AngularShiroConfigProvider#setLogoutPath
     * @methodOf angularShiro.services.angularShiroConfigProvider
     * 
     * @description The `logoutPath` specifies the path to apply to `$location`
     *              when the user log out of the application.
     * 
     * @param {string}
     *                logoutPath the application path to be applied on log out
     * 
     * @example
     * 
     * <pre>
     * app.config([ 'angularShiroConfigProvider', function(config) {
     *     config.setLogoutPath('/my/logout/page');
     * } ]);
     * </pre>
     */
    this.setLogoutPath = function(logoutPath) {
	options.logout.path = logoutPath;
    }

    /**
     * 
     * @ngdoc method
     * @function
     * @name AngularShiroConfigProvider#setLoginPath
     * @methodOf angularShiro.services.angularShiroConfigProvider
     * 
     * @description The `loginPath` specifies the path used for redirecting the
     *              user on an attempt to reach a denied url.
     * 
     * @param {string}
     *                loginPath The path to the login page (default '`/login`')
     * 
     * @example
     * 
     * <pre>
     * app.config([ 'angularShiroConfigProvider', function(config) {
     *     config.setLoginPath('/my/login/page');
     * } ]);
     * </pre>
     */
    this.setLoginPath = function(loginPath) {
	options.login.path = loginPath;
    }
    /**
     * 
     * @ngdoc method
     * @function
     * @name AngularShiroConfigProvider#setAuthenticateUrl
     * @methodOf angularShiro.services.angularShiroConfigProvider
     * 
     * @description The `authenticateUrl` specifies the url to call when the
     *              user try to login to the application. The url is called with
     *              a `POST` method.
     * 
     * @param {string}
     *                authenticateUrl The uri to be called on a login attempt
     *                (default '`/api/authenticate`')
     * @example
     * 
     * <pre>
     * app.config([ 'angularShiroConfigProvider', function(config) {
     *     config.setAuthenticateUrl('/my/custom/url');
     * } ]);
     * </pre>
     */
    this.setAuthenticateUrl = function(authenticateUrl) {
	options.login.api = authenticateUrl;
    }

    this.$get = [ function() {
	return options;
    } ];

}