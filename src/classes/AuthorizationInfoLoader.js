/**
 * <p>
 * An AuthorizationInfoLoader is responsible for loading authorization data
 * relative to a specified Subject.
 * </p>
 * <p>
 * This implementation is based on $q and $http supplied by AngularJS.
 * </p>
 * The implements of this Authenticator relies on AngularJS
 * 
 * @param {ng.$q}
 *            $q - promise/deferred implementation from Angular
 * 
 * @param {ng.$http}
 *            $http - Core Angular service that facilitates communication with
 *            the remote HTTP servers
 * 
 * @param {ng.$log}
 *            $log - Angular service for logging
 * @protected
 * @constructor
 * @requires angularjs
 * @see {@link http://docs.angularjs.org/api|AngularJS}
 * @since 0.1
 * 
 */
function AuthorizationInfoLoader($q, $http, $log) {
	this.q = $q;
	this.http = $http;
	this.log = $log;
	this.authorizationUri = AuthorizationInfoLoader.DEFAULT_AUTHORIZATION_URI;
}

/**
 * Default URI of the backend service responsible for returning the
 * authorization data of the Subject
 */
AuthorizationInfoLoader.DEFAULT_AUTHORIZATION_URI = "users/{0}/authorizations";

/**
 * 
 * 
 * @param {string}
 *            principal - the principal for which we want to collect
 *            authorization data
 * 
 * @returns {Promise} a promise - an AngularJS promise
 */
AuthorizationInfoLoader.prototype.getAuthorizationInfo = function(principal) {
	this.log.debug("AuthorizationInfoLoader::getAuthorizationInfo(" + principal
			+ ")");
	var deferred = this.q.defer();
	var uri = this.buildAuthorizationURI(
			AuthorizationInfoLoader.DEFAULT_AUTHORIZATION_URI, principal);
	this.http.get(uri).success(function(data, status, headers, config) {
		deferred.resolve(data);
	}).error(function(data, status, headers, config) {
		deferred.reject(data);
	});
	return deferred.promise;
}

/**
 * <p>
 * Returns the URI of the backend service responsible for returning the
 * authorization data of the Subject
 * </p>
 * 
 * @returns {string} uri - the uri of the backend service returning the
 *          authorization data of the Subject
 * @protected
 */
AuthorizationInfoLoader.prototype.buildAuthorizationURI = function(uri,
		principal) {
	return uri.replace(/\{(\d+)\}/g, principal);
}
