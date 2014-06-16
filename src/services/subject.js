'use strict';

/**
 * @ngdoc object
 * @name angularShiro.services.authenticationResponseParser
 * 
 * @description `AuthenticationResponseParser` is responsible of validating then
 *              parsing the response received from the authentication service
 *              backend # Response
 * 
 * The response returned from the backend have to be a `json` object that comply
 * to the following structure :
 * 
 * <pre>
 * {
 * 	info : {
 * 		authc : {
 * 			principal : {
 * 				// the Suject/User principal, for example
 * 				&quot;login&quot; : &quot;edegas&quot;,
 * 				&quot;apiKey&quot; : &quot;*******&quot;
 * 			},
 * 			credentials : {
 * 				// the Subject/User credentials, for example
 * 				&quot;name&quot; : &quot;Edgar Degas&quot;,
 * 				&quot;email&quot; : &quot;degas@mail.com&quot;
 * 			}
 * 		},
 * 		authz : {
 * 			roles : [
 * 			// list of the Subject/User roles, for example
 * 			&quot;GUEST&quot; ],
 * 			permissions : [
 * 			// list of the Subject/User permissions, for example
 * 			&quot;newsletter$read&quot;, &quot;book$*&quot;, ]
 * 		}
 * 	}
 * }
 * </pre>
 * 
 * @since 0.0.1
 */
function AuthenticationResponseParser() {

	/**
	 * 
	 * @ngdoc method
	 * @function
	 * @name AuthenticationResponseParser#parse
	 * @methodOf angularShiro.services.authenticationResponseParser
	 * 
	 * @description Validates then parse the data received from the backend
	 *              authentication service
	 * 
	 * @param {Object}
	 *            data the token encapsulating the subject's principals and
	 *            credentials to be passed to the Authentication subsystem for
	 *            verification.
	 * 
	 * @returns {object} the parsed data
	 * 
	 */
	this.parse = function(data) {
		this.checkValidity(data);
		return {
			authc : this.parseAuthc(data.info.authc),
			authz : this.parseAuthz(data.info.authz)
		};
	};

	this.parseAuthc = function(authc) {
		return new AuthenticationInfo(authc.principal, authc.credentials);
	};

	this.parseAuthz = function(authz) {
		return new AuthorizationInfo(authz.roles, authz.permissions);
	};

	/**
	 * 
	 */
	this.checkValidity = function(data) {
		if (!angular.isDefined(data) || !angular.isDefined(data.info)
				|| !this.isAuthcValid(data.info)
				|| !this.isAuthzValid(data.info)) {
			var msg = 'Response does not match expected structure.';
			throw {
				'name' : 'ParseException',
				'message' : msg
			};
		}
	};

	this.isAuthcValid = function(info) {
		var valid = angular.isDefined(info.authc);
		if (valid) {
			var authc = info.authc;
			valid = angular.isDefined(authc.principal)
					&& angular.isDefined(authc.credentials);
		}
		return valid;
	};

	this.isAuthzValid = function(info) {
		var valid = angular.isDefined(info.authz);
		if (valid) {
			var authz = info.authz;
			valid = angular.isDefined(authz.roles)
					&& angular.isDefined(authz.permissions);
		}
		return valid;
	};
}

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
 * @param {AngularShiroConfig}
 *            configuration
 * 
 * @since 0.0.1
 */
function Subject(authenticator, authorizer, authenticationResponseParser) {

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
			var infos = authenticationResponseParser.parse(data);
			me.authenticationInfo = infos.authc;
			me.authorizer.setAuthorizationInfo(infos.authz);
			me.authenticated = true;
			token.username = null;
			token.password = null;
		}, function(data, status, headers, config) {
			me.clear();
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
		this.clear();
	};

	/**
	 * 
	 */
	this.clear = function() {
		this.authenticated = false;
		this.authenticationInfo = null;
		this.authorizer.clear();
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
		var principal = '';
		if (angular.isDefined(this.authenticationInfo)
				&& angular.isObject(this.authenticationInfo)) {
			principal = this.authenticationInfo.getPrincipal();
		}
		return principal;
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
		var result = [];
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
	};
}