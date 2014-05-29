/**
 * 
 * @ngdoc service
 * @name angularShiro.services.subject
 * @requires authenticator
 * 
 * @description A Subject represents state and security operations for an
 *              application user. Operations goes from authentication (login and
 *              logout) to authorization and session management.
 * 
 * @class Subject
 * @constructor
 * 
 * @param {Authenticator}
 *            Authenticator instance in charge of the authentication of the
 *            Subject
 * 
 * @since 0.0.1
 */
function Subject(authenticator, authorizer) {

	/**
	 * @ngdoc property
	 * @name Subject#authenticated
	 * @description flag indicating if the current Subject is authenticated or
	 *              not
	 * @returns {boolean} <code>true</code> if this Subject is authenticated,
	 *          <code>false</code> otherwise
	 * @propertyOf angularShiro.services.subject
	 */
	this.authenticated = false;
	/**
	 * @private
	 */
	// this.session = new Session();
	/**
	 * @private
	 * @desc {Authenticator} authenticator - Authenticator instance in charge of
	 *       the authentication of the Subject
	 */
	// this.authenticator = authenticator;
	/**
	 * @ngdoc property
	 * @name Subject#authorizer
	 * @propertyOf angularShiro.services.subject
	 * @description <code>Authorizer</code> instance in charge of
	 *              authorization operations
	 * @returns {Authorizer} <code>Authorizer</code> instance in charge of
	 *          authorization operations
	 * 
	 */
	this.authorizer = authorizer;

	/**
	 * @ngdoc property
	 * @name Subject#authenticationInfo
	 * @propertyOf angularShiro.services.subject
	 * @description this Subject authenticiation infos
	 * @returns {AuthenticationInfo} this Subject authentication infos
	 */
	this.authenticationInfo;

	/**
	 * 
	 * @ngdoc method
	 * @function
	 * @name Subject#login
	 * @methodOf angularShiro.services.subject
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
	 *            token the token encapsulating the subject's principals and
	 *            credentials to be passed to the Authentication subsystem for
	 *            verification.
	 * 
	 * @returns {Promise} Returns a promise
	 * 
	 */
	this.login = function(token) {
		var promise = authenticator.authenticate(token);
		var me = this;
		promise.then(function(data, status, headers, config) {
			me.authenticated = true;
			me.authenticationInfo = data['infos']['authc'];
			me.authorizer.setAuthorizationInfo(data['info']['authz']);
		}, function(data, status, headers, config) {
			me.authenticated = false;
			me.authenticationInfo = null;
			// me.authorizer = null;
		});
		return promise;
	};

	/**
	 * @ngdoc method
	 * @name Subject#logout
	 * @methodOf angularShiro.services.subject
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
		me.authenticated = false;
		me.authenticationInfo = null;
		me.authorizer = null;
	}

	/**
	 * Returns the application <code>Session</code> associated with this
	 * Subject/User. If no session exists when this method is called, a new
	 * session will be created, associated with this Subject, and then returned.
	 * 
	 * @return the application <code>Session</code> associated with this
	 *         SubjectUser
	 */
	this.getSession = function(create) {

	};

	/**
	 * @ngdoc method
	 * @name Subject#getPrincipal
	 * @methodOf angularShiro.services.subject
	 * 
	 * @description Returns this Subject's application-wide uniquely identifying
	 *              principal, or <code>null</code> if this Subject is
	 *              anonymous
	 * 
	 * @return {*} this Subject's application-specific unique identity
	 */
	this.getPrincipal = function() {
		return this.authenticationInfo.getPrincipal();
	};

	/**
	 * @ngdoc method
	 * @name Subject#isAuthenticated
	 * @methodOf angularShiro.services.subject
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
	 * @name Subject#hasRole
	 * @methodOf angularShiro.services.subject
	 * 
	 * @description Returns <code>true</code> if the <code>Subject</code>
	 *              has the specified role, <code>false</code> otherwise.
	 * 
	 * 
	 * @param {string}
	 *            roleIdentifier the application-specific role identifier
	 *            (usually a role id or role name)
	 * @return {boolean} <code>true</code> if the <code>Subject</code> has
	 *         the specified role, <code>false</code> otherwise
	 */
	this.hasRole = function(role) {
		return this.isAuthenticated() && angular.isDefined(this.authorizer)
				&& this.authorizer.hasRole(role);
	};

	/**
	 * @ngdoc method
	 * @name Subject#hasRoles
	 * @methodOf angularShiro.services.subject
	 * 
	 * @description Checks if the <code>Subject</code> has the specified
	 *              roles, returning a boolean array indicating which roles are
	 *              associated
	 * 
	 * @param {array}
	 *            roleIdentifiers the application-specific role identifiers to
	 *            check (usually role ids or role names)
	 * @return {array} a boolean array where indices correspond to the index of
	 *         the roles in the given identifiers. A <code>true</code> value
	 *         indicates the <code>Subject</code> has the role at that index.
	 *         <code>false</code> indicates the <code>Subject</code> does
	 *         not have the role at that index
	 */
	this.hasRoles = function(roles) {
		var result = new Array();
		angular.forEach(roles, function(role) {
			result.push(this.hasRole(role));
		}, this);
		return result;
	};

	/**
	 * @ngdoc method
	 * @name Subject#hasAllRoles
	 * @methodOf angularShiro.services.subject
	 * 
	 * @description Returns <code>true</code> if the <code>Subject</code>
	 *              has all of the specified roles, <code>false</code>
	 *              otherwise.
	 * 
	 * @param {array}
	 *            roleIdentifiers the application-specific role identifiers to
	 *            check (usually role ids or role names)
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
	 * @methodOf angularShiro.services.subject
	 * 
	 * 
	 */
	this.isPermitted = function(permissions) {
		return this.isAuthenticated()
				&& this.authorizer.isPermitted(permissions);
	};

	/**
	 * @ngdoc method
	 * @name Subject#isPermittedAll
	 * @methodOf angularShiro.services.subject
	 * 
	 * @description Returns <code>true</code> if this Subject implies all of
	 *              the specified permissions, <code>false</code> otherwise
	 * 
	 * @param {array}
	 *            permissions the permissions to check
	 * 
	 * @return {boolean} <code>true</code> if this Subject implies all of the
	 *         specified permissions, <code>false</code> otherwise
	 */
	this.isPermittedAll = function(permissions) {
		return this.isAuthenticated()
				&& this.authorizer.isPermittedAll(permissions);
	}
};