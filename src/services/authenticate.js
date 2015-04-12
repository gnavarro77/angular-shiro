'use strict';

/**
 * @ngdoc service
 * @name angularShiro.services.Authenticator
 * @requires $q
 * @requires $http
 * @requires $$timeout
 * @requires angularShiro.services.AngularShiroConfig
 * 
 * @description Service in charge of the authentication process.
 * 
 * Default implementation send a `post` request to the uri specified in the
 * <code>AngularShiroConfig</code> through the <code>login.uri</code>
 * property value.
 * 
 * <span class=" alert-danger">This service is not intended to be accessed
 * directly; It's meant to be used internally by the `subject` service.</span>
 * 
 */
function AuthenticatorProvider() {

    this.$get = [
	    '$q',
	    '$http',
	    '$timeout',
	    'angularShiroConfig',
	    function($q, $http, $timeout, config) {
		return {
		    /**
		     * @ngdoc method
		     * @name authenticator#authenticate
		     * @param {UsernamePasswordToken}
		     *                token authentication token
		     * @methodOf angularShiro.services.Authenticator
		     * @returns {Promise} Returns a promise
		     */
		    authenticate : function(token) {
			var promise = null;
			if (!token || !token.getPrincipal() || !token.getCredentials()) {
			    throw '[Autheticate] Can not authenticate. Invalid token provided!';
			}

			if (config && config.login && config.login.uri) {
			    var deferred = $q.defer();
			    $http.post(config.login.uri, {
				token : {
				    principal : token.getPrincipal(),
				    credentials : token.getCredentials()
				}
			    }).success(function(data, status, headers, config) {
				deferred.resolve(data);
			    }).error(function(data, status, headers, config) {
				deferred.reject(data);
			    });
			    promise = deferred.promise;
			} else {
			    throw '[Autheticate] Can not authenticate since no \'config.login.uri\' is provided. Please check your configuration.';
			}
			return promise;
		    }

		};
	    } ];

}

/**
 * @ngdoc object
 * @name angularShiro.services.UsernamePasswordToken
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
     * @propertyOf angularShiro.services.UsernamePasswordToken
     * @description the Subject's user name
     * @returns {string} the Subject's user name
     */
    this.username = null;
    /**
     * @ngdoc property
     * @name UsernamePasswordToken#password
     * @propertyOf angularShiro.services.UsernamePasswordToken
     * @description the Subject's password
     * @returns {string} the Subject's password
     */
    this.password = null;

    /**
     * @ngdoc method
     * @name UsernamePasswordToken#getPrincipal
     * @methodOf angularShiro.services.UsernamePasswordToken
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
     * @methodOf angularShiro.services.UsernamePasswordToken
     * 
     * @description Returns the <code>password</code> value
     * 
     * @return {string} <code>password</code> value
     */
    this.getCredentials = function() {
	return this.password;
    };
}

/**
 * @ngdoc object
 * @name angularShiro.services.AuthenticationInfo
 * 
 * @description <code>AuthenticationInfo</code> represents the Subject's
 *              informations regarding the authentication process
 * 
 * @param {string}
 *                principal Subject's principal (ex : Subject's login, username,
 *                ...)
 * 
 * @param {string}
 *                credentials Subject's principal (ex : Subject's login,
 *                username, ...)
 * 
 * @since 0.0.1
 */
function AuthenticationInfo(principal, credentials) {
    /**
     * @name AuthenticationInfo#principal
     * @propertyOf angularShiro.services.AuthenticationInfo
     * @description the Subject's principal
     * @returns {string} the Subject's principal
     */
    this.principal = principal;
    /**
     * @name AuthenticationInfo#username
     * @propertyOf angularShiro.services.AuthenticationInfo
     * @description the Subject's credentials
     * @returns {object} the Subject's credentials
     */
    this.credentials = credentials;

    /**
     * @ngdoc method
     * @name AuthenticationInfo#getCredentials
     * @methodOf angularShiro.services.AuthenticationInfo
     * 
     * @description Returns the Suject's principal
     * 
     * @return {object} the Subject's principal
     * @since 0.0.1
     */
    this.getPrincipal = function() {
	return this.principal;
    };

    /**
     * @ngdoc method
     * @name AuthenticationInfo#getCredentials
     * @methodOf angularShiro.services.AuthenticationInfo
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