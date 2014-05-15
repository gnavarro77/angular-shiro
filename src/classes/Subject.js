/**
 * 
 * A Subject represents state and security operations for an application user.
 * Operations goes from authentication (login and logout) to authorization and
 * session management.
 * 
 * @param {Authenticator}
 *            $authenticator - Authenticator instance in charge of the
 *            authentication of the Subject
 * @param {AuthorizationInfoLoader}
 *            $authorizationInfoLoader - AuthorizationInfoLoader instance
 *            responsible for authroization data loading
 * 
 * @constructor
 * @since 0.1
 */
var Subject = function($authenticator, $authorizationInfoLoader) {

	/**
	 * @private
	 * 
	 */
	this.authenticated = false;
	/**
	 * @private
	 */
	this.session = new Session();
	/**
	 * @private
	 * @desc {Authenticator} authenticator - Authenticator instance in charge of
	 *       the authentication of the Subject
	 */
	this.authenticator = $authenticator;

	/**
	 * @private
	 * @desc {AuthorizationInfoLoader} authorizationInfoLoader -
	 */
	this.authorizationInfoLoader = $authorizationInfoLoader;

	/**
	 * Object in charge of authorization resolution
	 * 
	 * @private
	 * @memberof Subject
	 */
	this.authorizer;

	/**
	 * @private
	 * @member {AuthenticationInfo} authenticationInfo
	 * 
	 */
	this.authenticationInfo;

};

/**
 * @public
 * 
 * @desc Returns the principal (primary key, username, ...) that uniquely
 *       identify the Subject throughout the entire application, or null if the
 *       Subject is not yet known from the application.
 * 
 * @returns {string} the principal of the Subject
 * 
 */
Subject.prototype.getPrincipal = function() {
	return this.authenticationInfo.getPrincipal();
};

/**
 * @proteted
 * 
 * @desc Indicates if a principal exits for the Subject
 * 
 * @returns {boolean} <code>true</code> if a principal exists for the Subject,
 *          <code>false</code> otherwise
 * 
 */
Subject.prototype.hasPrincipal = function() {
	return (this.getPrincipal() != null);
}

/**
 * @public
 * 
 * @desc Performs a login attempt for this Subject. On unsuccessful attempts an
 *       exception is thrown; On the contrary authentication informations along
 *       with with the submitted principals/credentials are associated with this
 *       Subject and the method will return quietly. On successful
 *       authentication, the Subject instance is considered authenticated so
 *       that the isAuthenticated() method will return true and the
 *       getPrincipal() method must return a non-null value and .
 * 
 * @param {UsernamePasswordToken}
 *            token the token encapsulating the subject's principals and
 *            credentials to be passed to the Authentication subsystem for
 *            verification.
 * 
 * @returns {ng.promise} promise
 * 
 * @throws {exception}
 *             if the authentication attempt fails.
 * 
 */
Subject.prototype.login = function(token) {
	var promise = this.authenticator.authenticate(token);
	var me = this;
	promise.then(function(authenticationInfo, status, headers, config) {
		me.authenticationInfo = authenticationInfo;
		me.authenticated = true;
		me.loadAuthorizations();
	}, me.errorCallback);
	return promise;
};

/**
 * 
 */
Subject.prototype.loadAuthorizations = function() {
	var principal = this.authenticationInfo.getPrincipal();
	var me = this;
	var promise = this.authorizationInfoLoader.getAuthorizationInfo(principal)
			.then(function(authorizationInfo, status, headers, config) {
				me.authorizer = new Authorizer(authorizationInfo);
			}, this.errorCallback);
	return promise;
}

/**
 * @private
 */
Subject.prototype.errorCallback = function(data, status, headers, config) {
	console.log("zzzzzzzzzzz error");
};

/**
 * Logs out this Subject and invalidates and/or removes any associated entities,
 * such as a {@link Session Session} and authorization data. After this method
 * is called, the Subject is considered 'anonymous' and may continue to be used
 * for another log-in if desired.
 */
Subject.prototype.logout = function() {
	this.authenticationInfo = null;
	this.session = null;
	this.authenticated = false;
}

/**
 * @see Authorizer#isPermittedAll(permissions)
 */
Subject.prototype.isPermitted = function(permissions) {
	return this.isAuthenticated() && this.authorizer.isPermitted(permissions);
};

/**
 * @see Authorizer#isPermittedAll(permissions)
 */
Subject.prototype.isPermittedAll = function(permissions) {
	return this.isAuthenticated()
			&& this.authorizer.isPermittedAll(permissions);
}

/**
 * Returns <code>true</code> if this Subject/user has authenticated himself to
 * the system ,{@code false} otherwise.
 * 
 * @return <code>true</code> if this Subject/user is authenticated
 * @memberof Subject
 */
Subject.prototype.isAuthenticated = function() {
	return this.authenticated;
};

/**
 * @see Authorizer#hasRole(role)
 */
Subject.prototype.hasRole = function(role) {
	var hasRole = this.isAuthenticated() && angular.isDefined(this.authorizer)
			&& this.authorizer.hasRole(role);
	console.log('hasRole = ' + hasRole);
	return hasRole;
};

/**
 * @see Authorizer#hasAllRoles(roles)
 */
Subject.prototype.hasRoles = function(roles) {
	return this.isAuthenticated() && this.authorizer.hasRoles(roles);
};

/**
 * @see Authorizer#hasAllRoles(roles)
 */
Subject.prototype.hasAllRoles = function(roles) {
	return this.isAuthenticated() && this.authorizer.hasAllRoles(roles);
};

/**
 * Returns the application <code>Session</code> associated with this
 * Subject/User. If no session exists when this method is called, a new session
 * will be created, associated with this Subject, and then returned.
 * 
 * @return the application <code>Session</code> associated with this
 *         SubjectUser
 * @memberof Subject
 */
Subject.prototype.getSession = function(create) {

};