/**
 * 
 * A Subject represents state and security operations for an application user.
 * Operations goes from authentication (login and logout) to authorization and
 * session management.
 *
 * @class Subject
 * @constructor
 *
 * @param {Authenticator}
 *            $authenticator - Authenticator instance in charge of the
 *            authentication of the Subject
 * @param {AuthorizationInfoLoader}
 *            $authorizationInfoLoader - AuthorizationInfoLoader instance
 *            responsible for authroization data loading
 * 
 *
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
 * Returns the principal (primary key, username, ...) that uniquely
 * identify the <code>Subject</code> throughout the entire application, or <code>null</code> if the
 * Subject is not yet known from the application.
 *
 * @method getPrincipal
 * @return {string} the principal of the Subject
 * @public
 */
Subject.prototype.getPrincipal = function() {
	return this.authenticationInfo.getPrincipal();
};

/**
 * Indicates if a principal exits for the Subject
 * 
 * @method hasPrincipal
 * @return {boolean} <code>true</code> if a principal exists for the Subject,
 *          <code>false</code> otherwise
 * @protected
 */
Subject.prototype.hasPrincipal = function() {
	return (this.getPrincipal() != null);
}

/**
 * Performs a login attempt for this Subject. On unsuccessful attempts an
* exception is thrown; On the contrary authentication informations along
* with with the submitted principals/credentials are associated with this
* Subject and the method will return quietly. On successful
* authentication, the Subject instance is considered authenticated so
* that the isAuthenticated() method will return true and the
* getPrincipal() method must return a non-null value and .
*
 * @method login
 *
 * @param  token {UsernamePasswordToken}  token the token encapsulating the subject's principals and credentials to be passed to the Authentication subsystem for verification.
 * 
 * @return {ng.promise} promise
 * 
 * @throws {exception}
 *             if the authentication attempt fails.
 * @public
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
 * such as <code>Session</code> and authorization data. After this method
 * is called, the Subject is considered 'anonymous' and may continue to be used
 * for another log-in if desired.
 * 
 * @method logout
 * @public
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
 * Returns <code>true</code> if the <code>Subject</code> has provided valid credentials, <code>false</code> otherwise.
 * @method isAuthenticated
 * @return <code>true</code> if the <code>Subject</code> is authenticated, <code>false</code> otherwise
 * @public
 */
Subject.prototype.isAuthenticated = function() {
	return this.authenticated;
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
/**
* Returns <code>true</code> if the <code>Subject</code> has the specified role, <code>false</code> otherwise. 
 * @method hasRole
 * @param roleIdentifier {string} the application-specific role identifier (usually a role id or role name)
 * @return {boolean} <code>true</code> if the <code>Subject</code> has the specified role, <code>false</code> otherwise
 * @public
 */
Subject.prototype.hasRole = function(role) {
	var hasRole = this.isAuthenticated() && angular.isDefined(this.authorizer)
			&& this.authorizer.hasRole(role);
	return hasRole;
};
/**
* Checks if the <code>Subject</code> has the specified roles, returning a boolean array indicating which roles are associated
* @method hasRoles
* @param roleIdentifiers {array} the application-specific role identifiers to check (usually role ids or role names)
* @return {array} a boolean array where indices correspond to the index of the roles in the given identifiers. 
* A <code>true</code> value indicates the <code>Subject</code> has the role at that index. <code>false</code> indicates the <code>Subject</code> does not have the role at that index
* @public
*/
Subject.prototype.hasRoles = function(roles) {
	return this.isAuthenticated() && this.authorizer.hasRoles(roles);
};

/**
* Returns <code>true</code> if the <code>Subject</code> has all of the specified roles, <code>false</code> otherwise. 
 * @method  hasAllRoles
 * @param roleIdentifiers {array} the application-specific role identifiers to check (usually role ids or role names). 
 * @return {boolean} <code>true</code> if the <code>Subject</code> has all the roles, <code>false</code> otherwise.
 * @public
 */
Subject.prototype.hasAllRoles = function(roles) {
	return this.isAuthenticated() && this.authorizer.hasAllRoles(roles);
};