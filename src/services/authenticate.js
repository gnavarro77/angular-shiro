'use strict';

/**
 * @ngdoc service
 * @name angularShiro.services.authenticator
 * @requires $q
 * @requires $http
 * 
 * @description Service in charge of the authentication process.
 * 
 * Default implementation send a `post` request to the uri `/api/authenticate`
 * with a `UsernamePasswordToken` as data.
 * 
 * 
 * <span class=" alert-danger">This service is not intended to be accessed
 * directly; It's meant to be used internally by the `subject` service.</span>
 * 
 * 
 * # Configuration
 * 
 * In case that the default behavior of the `authenticator` service does not fit
 * your needs you can - specify our own uri (if that the point of contention)
 * 
 * <pre>
 * app.config([ 'authenticatorProvider', function(authenticatorProvider) {
 * 	authenticatorProvider.setUri('path/to/my/authentication/service');
 * } ]);
 * </pre>
 * 
 */

// /**
// * @ngdoc object
// * @name angularShiro.authenticatorProvider
// * @description Use the `authenticatorProvider` to configure how the
// application
// * authenticates users
// */
function AuthenticatorProvider() {

	var uri = "/api/authenticate";

	// /**
	// * @ngdoc property
	// * @name authenticatorProvider#setUri
	// * @methodOf angularShiro.authenticatorProvider0
	// * @description
	// * @param {string=}
	// * uri associated to the authentication process
	// * @returns {*} itself (chaining)
	// */
	this.setUri = function(value) {
		uri = value;
		return this;
	};

	this.setDelegate = function(delegate) {
		this.delegate = delegate;
		return this;
	}

	this.$get = [ '$q', '$http', '$timeout', function($q, $http, $timeout) {
		return {
			/**
			 * @ngdoc method
			 * @name authenticator#authenticate
			 * @param {UsernamePasswordToken}
			 *            token authentication token
			 * @methodOf angularShiro.services.authenticator
			 * @returns {Promise} Returns a promise
			 */
			authenticate : function(token) {
				var deferred = $q.defer();
				var data = {
					principal : (token) ? token.getPrincipal() : null,
					credentials : (token) ? token.getCredentials() : null,
				};
				$http.post(uri, {
					token : data
				}).success(function(data, status, headers, config) {
					deferred.resolve(data);
				}).error(function(data, status, headers, config) {
					deferred.reject(data);
				});
				return deferred.promise;
			}

		}
	} ];

}

/**
 * @ngdoc object
 * @name angularShiro.services.usernamePasswordToken
 * 
 * @description <code>UsernamePasswordToken</code> is a simple
 *              username/password authentication token.
 * 
 * @since 0.0.1
 */
function UsernamePasswordToken() {
	/**
	 * @ngdoc property
	 * @name UsernamePasswordToken#username
	 * @propertyOf angularShiro.services.usernamePasswordToken
	 * @description the Subject's user name
	 * @returns {string} the Subject's user name
	 */
	this.username = null;
	/**
	 * @ngdoc property
	 * @name UsernamePasswordToken#password
	 * @propertyOf angularShiro.services.usernamePasswordToken
	 * @description the Subject's password
	 * @returns {string} the Subject's password
	 */
	this.password = null;

	/**
	 * @ngdoc method
	 * @name UsernamePasswordToken#getPrincipal
	 * @methodOf angularShiro.services.usernamePasswordToken
	 * 
	 * @description Returns <code>username</code> value
	 * @return {string} <code>username</code> value
	 */
	this.getPrincipal = function() {
		return this.username;
	};

	/**
	 * @ngdoc method
	 * @name UsernamePasswordToken#getCredentials
	 * @methodOf angularShiro.services.usernamePasswordToken
	 * 
	 * @description Returns the <code>getPassword()</code> returned value
	 * 
	 * @return {string} <code>password</code> value
	 */
	this.getCredentials = function() {
		return this.password;
	};
}

/**
 * @ngdoc object
 * @name angularShiro.services.authenticationInfo
 * 
 * @description <code>AuthenticationInfo</code> represents the Subject's
 *              informations regarding the authentication process
 * 
 * @param {string}
 *            principal Subject's principal (ex : Subject's login, username,
 *            ...)
 * 
 * @param {string}
 *            credentials Subject's principal (ex : Subject's login, username,
 *            ...)
 * 
 * @since 0.0.1
 */
function AuthenticationInfo(principal, credentials) {
	/**
	 * @ngdoc property
	 * @name AuthenticationInfo#principal
	 * @propertyOf angularShiro.services.authenticationInfo
	 * @description the Subject's principal
	 * @returns {string} the Subject's principal
	 */
	this.principal = principal;
	/**
	 * @ngdoc property
	 * @name AuthenticationInfo#username
	 * @propertyOf angularShiro.services.authenticationInfo
	 * @description the Subject's credentials
	 * @returns {object} the Subject's credentials
	 */
	this.credentials = credentials;

	/**
	 * @ngdoc method
	 * @name AuthenticationInfo#getCredentials
	 * @methodOf angularShiro.services.authenticationInfo
	 * 
	 * @description Returns the Suject's principal
	 * 
	 * @return {object} the Subject's principal
	 * @since 0.0.1
	 */
	this.getPrincipal = function() {
		return this.principal;
	}

	/**
	 * @ngdoc method
	 * @name AuthenticationInfo#getCredentials
	 * @methodOf angularShiro.services.authenticationInfo
	 * 
	 * @description Returns the Subject's credentials . A credential verifies
	 *              the Subject's principal, such as a password or private key
	 * 
	 * @returns {object} the Subject's credentials
	 * @since 0.0.1
	 */
	this.getCredentials = function() {
		return this.credentials;
	};

}