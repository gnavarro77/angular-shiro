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
 *  # Configuration
 * 
 * In case that the default behavior of the `authenticator` service does not fit
 * your needs you can 
 * 
 * - specify our own uri (if that the point of contention)
 * ```js
	app.config(['authenticatorProvider', function (authenticatorProvider) {
		authenticatorProvider.setUri('path/to/my/authentication/service');
	}]);
 * ```
 * 
 */

///**
// * @ngdoc object
// * @name angularShiro.authenticatorProvider
// * @description Use the `authenticatorProvider` to configure how the application
// *              authenticates users
// */
function authenticatorProvider() {

	var uri = "/api/authenticate", delegate;

//	/**
//	 * @ngdoc property
//	 * @name authenticatorProvider#setUri
//	 * @methodOf angularShiro.authenticatorProvider0
//	 * @description
//	 * @param {string=}
//	 *            uri associated to the authentication process
//	 * @returns {*} itself (chaining)
//	 */
	this.setUri = function(uri) {
		this.uri = uri;
		return this;
	};
	
	this.setDelegate = function(delegate) {
		this.delegate = delegate;
		return this;
	}

	this.$get = [ '$q', '$http', function($q, $http) {
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
				$http.post(uri, {
					data : token
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