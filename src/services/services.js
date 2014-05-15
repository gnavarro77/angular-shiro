/**
 * 
 * 
 */
angular.module('angularSecurity.services', []);

/**
 * @ngdoc service
 * @name angularSecurity.services.$authenticator
 * 
 * @description An Authenticator is in charge of the authentication process. The
 *              implements of this Authenticator relies on AngularJS
 * 
 * @requires $q
 * @requires $http
 * @requires $log
 * 
 * 
 */
angular.module('angularSecurity.services').factory(
		'$authenticator',
		[
				'$q',
				'$http',
				'$log',
				function($q, $http, $log) {
					return {
						/**
						 * @ngdoc method
						 * @name authenticate
						 * @param {UsernamePasswordToken}
						 *            token authentication token
						 * @methodOf angularSecurity.services.$authenticator
						 * @returns {string} What do I return // return type and
						 *          description
						 */
						authenticate : function(token) {
							if (token == null) {
								throw new IllegalArgumentException(
										'token must not be null');
							}
							var deferred = $q.defer();
							$http.post("authenticate", {
								data : token
							}).success(function(data, status, headers, config) {
								deferred.resolve(data);
							}).error(function(data, status, headers, config) {
								deferred.reject(data);
							});
							return deferred.promise;
						}
					}
				} ]);

/**
 * @name $authorizationInfoLoader
 * @desc Instance of AuthorizationInfoLoader. Not supposed to be used directly.
 * @private
 */
angular.module('angularSecurity.services').factory('$authorizationInfoLoader',
		[ '$q', '$http', '$log', function($q, $http, $log) {
			return new AuthorizationInfoLoader($q, $http, $log);
		} ]);

/**
 * @name $subject
 * @desc AngularJS factory instance of Subject available throughout the
 *       application
 * 
 */
angular.module('angularSecurity.services')
		.factory(
				'$subject',
				[
						'$authenticator',
						'$authorizationInfoLoader',
						function($authenticator, $authorizationInfoLoader) {
							return new Subject($authenticator,
									$authorizationInfoLoader);
						} ]);