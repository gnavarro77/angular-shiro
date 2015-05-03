'use strict';

/*
 * globals AuthenticationInfo, AuthorizationInfo, SessionManager, SessionDAO, UsernamePasswordToken
 */


/**
 * 
 * @ngdoc service
 * @name angularShiro.services.Subject
 * @requires angularShiro.services.Authenticator
 * @requires angularShiro.services.Authorizer
 * @requires angularShiro.services.AuthenticationResponseParser
 * 
 * @description A <code>Subject</code> represents state and security
 *              operations for an application user. Operations goes from
 *              authentication (login and logout) to authorization.
 * 
 * @class Subject
 * @constructor
 * 
 * @param {Authenticator}
 *                authenticator instance of <code>Authenticator</code>
 * 
 * @param {Authorizer}
 *                authorizer instance of <code>Authorizer</code>
 * 
 * @param {AuthenticationResponseParser}
 *                authenticationResponseParser instance of
 *                <code>AuthenticationResponseParser</code>
 * 
 * 
 * @since 0.0.1
 */
function Subject(authenticator, authorizer, authenticationResponseParser) {

    /**
     * @name Subject#authenticated
     * @description flag indicating if the current Subject is authenticated or
     *              not
     * @propertyOf angularShiro.services.Subject
     */
    this.authenticated = false;
    /**
     * 
     */
    this.sessionManager = new SessionManager(new SessionDAO());
    /**
     * @private
     */
    this.session = null;
    /**
     * @name Subject#authorizer
     * @propertyOf angularShiro.services.Subject
     * @description <code>Authorizer</code> instance in charge of
     *              authorization operations
     * 
     */
    this.authorizer = authorizer;

    /**
     * @name Subject#authenticationInfo
     * @propertyOf angularShiro.services.Subject
     * @description this Subject authenticiation infos
     */
    this.authenticationInfo;

    /**
     * @name Subject#remembered
     * @propertyOf angularShiro.services.Subject
     * @description flag indicating if the current subject is to be remembered
     */
    this.remembered = false;

    /**
     * 
     * @ngdoc method
     * @function
     * @name Subject#login
     * @methodOf angularShiro.services.Subject
     * 
     * @description Performs a login attempt for this Subject.
     * 
     * On unsuccessful attempts returned <code>httpPromise</code> is rejected;
     * 
     * On the contrary authentication informations along with with the submitted
     * principals/credentials are associated with this Subject and the method
     * will return quietly. On successful authentication, the Subject instance
     * is considered authenticated so that the isAuthenticated() method will
     * return true and the getPrincipal() method must return a non-null value
     * and .
     * 
     * @param {UsernamePasswordToken}
     *                token the token encapsulating the subject's principals and
     *                credentials to be passed to the Authentication subsystem
     *                for verification.
     * 
     * @returns {Promise} Returns a promise
     * 
     */
    this.login = function(token) {
	var promise = authenticator.authenticate(token);
	var me = this;
	promise.then(function(data, status, headers, config) {
	    var infos = authenticationResponseParser.parse(data);
	    me.authenticationInfo = infos.authc;
	    me.authorizer.setAuthorizationInfo(infos.authz);
	    me.authenticated = true;
	    if (token.isRememberMe()) {
		// put the token in session to auto login if needed
		var session = me.getSession(true);
		session.setAttribute('token', token);
		me.sessionManager.update(session);
		me.remembered = true;
	    }
	    token.clear();
	}, function(data, status, headers, config) {
	    me.clear();
	});
	return promise;
    };
    /**
     * 
     */
    this.rememberMe = function(sessionId) {
	var output = false;
	var session = this.sessionManager.getSession(sessionId);
	if (session !== null && session.getAttribute('token')) {
	    var token = new UsernamePasswordToken();
	    token.deserialize(session.getAttribute('token'));
	    // auto login to reload authorization infos
	    output = this.login(token);
	}
	return output;
    };
    /**
     * @ngdoc method
     * @name Subject#logout
     * @methodOf angularShiro.services.Subject
     * 
     * @description Logs out this Subject and invalidates and/or removes any
     *              associated entities, such as <code>Session</code> and
     *              authorization data. After this method is called, the Subject
     *              is considered 'anonymous' and may continue to be used for
     *              another log-in if desired.
     * 
     * @method logout
     * @public
     */
    this.logout = function() {
	this.clear();
    };

    /**
     * Returns the application <code>Session</code> associated with this
     * Subject/User. If no session exists when this method is called, a new
     * session will be created, associated with this Subject, and then returned.
     * 
     * @return the application <code>Session</code> associated with this
     *         SubjectUser
     */
    this.getSession = function(create) {
	if (this.session === null && create) {
	    this.session = this.sessionManager.start();
	}
	return this.session;
    };

    /**
     * @ngdoc method
     * @name Subject#getPrincipal
     * @methodOf angularShiro.services.Subject
     * 
     * @description Returns this Subject's application-wide uniquely identifying
     *              principal, or <code>null</code> if this Subject is
     *              anonymous
     * 
     * @return {*} this Subject's application-specific unique identity
     */
    this.getPrincipal = function() {
	var principal = '';
	if (angular.isDefined(this.authenticationInfo) && angular.isObject(this.authenticationInfo)) {
	    principal = this.authenticationInfo.getPrincipal();
	}
	return principal;
    };

    /**
     * @ngdoc method
     * @name Subject#isAuthenticated
     * @methodOf angularShiro.services.Subject
     * 
     * @description Returns <code>true</code> if the <code>Subject</code>
     *              has provided valid credentials, <code>false</code>
     *              otherwise.
     * 
     * @return {boolean} <code>true</code> if the <code>Subject</code> is
     *         authenticated, <code>false</code> otherwise
     */
    this.isAuthenticated = function() {
	return this.authenticated;
    };

    /**
     * @ngdoc method
     * @name Subject#isRemembered
     * @methodOf angularShiro.services.Subject
     * 
     * @description Returns `true` if this Subject is remembered from a
     *              successful authentication.
     * 
     * @return {boolean} Returns `true` if this Subject is remembered from a
     *         successful authentication.
     */
    this.isRemembered = function() {
	return this.remembered;
    };

    /**
     * @ngdoc method
     * @name Subject#hasRole
     * @methodOf angularShiro.services.Subject
     * 
     * @description Returns <code>true</code> if the <code>Subject</code>
     *              has the specified role, <code>false</code> otherwise.
     * 
     * 
     * @param {string}
     *                roleIdentifier the application-specific role identifier
     *                (usually a role id or role name)
     * @return {boolean} <code>true</code> if the <code>Subject</code> has
     *         the specified role, <code>false</code> otherwise
     */
    this.hasRole = function(role) {
	return this.isAuthenticated() && angular.isDefined(this.authorizer) && this.authorizer.hasRole(role);
    };

    /**
     * @ngdoc method
     * @name Subject#hasRoles
     * @methodOf angularShiro.services.Subject
     * 
     * @description Checks if the <code>Subject</code> has the specified
     *              roles, returning a boolean array indicating which roles are
     *              associated
     * 
     * @param {array}
     *                roleIdentifiers the application-specific role identifiers
     *                to check (usually role ids or role names)
     * @return {array} a boolean array where indices correspond to the index of
     *         the roles in the given identifiers. A <code>true</code> value
     *         indicates the <code>Subject</code> has the role at that index.
     *         <code>false</code> indicates the <code>Subject</code> does
     *         not have the role at that index
     */
    this.hasRoles = function(roles) {
	var result = [];
	angular.forEach(roles, function(role) {
	    result.push(this.hasRole(role));
	}, this);
	return result;
    };

    /**
     * @ngdoc method
     * @name Subject#hasAllRoles
     * @methodOf angularShiro.services.Subject
     * 
     * @description Returns <code>true</code> if the <code>Subject</code>
     *              has all of the specified roles, <code>false</code>
     *              otherwise.
     * 
     * @param {array}
     *                roleIdentifiers the application-specific role identifiers
     *                to check (usually role ids or role names)
     * 
     * @return {boolean} <code>true</code> if the <code>Subject</code> has
     *         all the roles, <code>false</code> otherwise.
     */
    this.hasAllRoles = function(roles) {
	return this.isAuthenticated() && this.authorizer.hasAllRoles(roles);
    };

    /**
     * @ngdoc method
     * @name Subject#isPermitted
     * @methodOf angularShiro.services.Subject
     * 
     * @description Returns <code>true</code> if the current
     *              <code>Subject</code> has the specified permission(s),
     *              <code>false</code> otherwise.
     * 
     * @param {string |
     *                Permission | array} permission a permission
     * @return {boolean | array} <code>true</code> if the current
     *         <code>Subject</code> has the specified permission(s),
     *         <code>false</code> otherwise.
     * 
     */
    this.isPermitted = function(permissions) {
	return this.isAuthenticated() && this.authorizer.isPermitted(permissions);
    };

    /**
     * @ngdoc method
     * @name Subject#isPermittedAll
     * @methodOf angularShiro.services.Subject
     * 
     * @description Returns <code>true</code> if this Subject implies all of
     *              the specified permissions, <code>false</code> otherwise
     * 
     * @param {array}
     *                permissions the permissions to check
     * 
     * @return {boolean} <code>true</code> if the current <code>Subject</code>
     *         implies all of the specified permissions, <code>false</code>
     *         otherwise
     */
    this.isPermittedAll = function(permissions) {
	return this.isAuthenticated() && this.authorizer.isPermittedAll(permissions);
    };

    /**
     * 
     */
    this.clear = function() {
	this.authenticated = false;
	this.authenticationInfo = null;
	this.authorizer.clear();
	this.remembered = false;
    };
}