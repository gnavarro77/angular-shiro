/**
 * 
 * <p>
 * An <code>Authorizer</code> performs authorization (access control)
 * operations for any given Subject
 * </p>
 * 
 * <p>
 * All the authorization operations are based upon the instance of
 * <code>AuthorizationInfo</code> that is injected through the
 * <code>Authorizer</code> constructor.
 * </p>
 * 
 * @param {AuthorizationInfo}
 *            authorizationInfo - All informations regarding the Subject
 *            authorizations
 * @throws {IllegalArgumentException}
 *             An <code>IllegalArgumentException</code> is thrown in case of a
 *             null <code>authorizationInfo</code> attempt
 * @constructor
 * @see {@link http://shiro.apache.org/static/1.2.2/apidocs/org/apache/shiro/authz/Authorizer.html}
 * 
 * @requires angularjs
 * @since 0.1
 */
function Authorizer(authorizationInfo) {
	if (authorizationInfo == null || angular.isUndefined(authorizationInfo)) {
		throw new IllegalArgumentException('authorizationInfo must not be null');
	}
	this.authorizationInfo = authorizationInfo;
	this.permissions = this.getPermissions(authorizationInfo);
}

/**
 * Evaluate if the Subject is permitted to perform an action or access a
 * resource
 * 
 * @param {string |
 *            Permission} permission - the permission to evaluate
 * @returns {boolean} <code>true</code> for permitted Subject,
 *          <code>false</code> otherwise.
 * @see {@link http://shiro.apache.org/static/1.2.2/apidocs/org/apache/shiro/authz/Authorizer.html#isPermitted%28org.apache.shiro.subject.PrincipalCollection,%20java.lang.String%29}
 * 
 */
Authorizer.prototype.isPermitted = function(permission) {
	return this.isObjectPermissionPermitted(this.resolvePermission(permission));
}

/**
 * Evaluate if the Subject is permitted to perform all action or access all
 * resource implied by specified permissions
 * 
 * @param {array}
 *            permission - the permission(s) to check
 * @returns {boolean | Array} true for all permissions are permitted, false
 *          otherwise.
 * 
 * @see {@link http://shiro.apache.org/static/1.2.2/apidocs/org/apache/shiro/authz/Authorizer.html#isPermittedAll%28org.apache.shiro.subject.PrincipalCollection,%20java.lang.String...%29}
 */
Authorizer.prototype.isPermittedAll = function(permissions) {
	var permitted = angular.isArray(permissions) && (permissions.length > 0);
	if (permitted) {
		for ( var i = 0; i < permissions.length && permitted; i++) {
			permitted = this.isPermitted(permissions[i]);
		}
	}
	return permitted;
}

/**
 * Evaluate if the Subject has the specified role
 * 
 * @param {string}
 *            role - role to check
 * 
 * @returns {boolean} <code>true</code> if the Subject has the specified role,
 *          <code>false</code> otherwise
 * 
 */
Authorizer.prototype.hasRole = function(role) {
	return (this.authorizationInfo.getRoles().indexOf(role) > -1);
}

/**
 * Checks a list of roles against the Subject's roles
 * 
 * @param {Array}
 *            roles - the list of roles to check against the Subject's roles
 * @returns {Array} an array of booleans whose indices correspond to the index
 *          of the roles in the given identifiers. At a given index, a
 *          <code>true</code> value indicates that the user has the role, a
 *          <code>false</code> value indicates that does not have the role
 */
Authorizer.prototype.hasRoles = function(roles) {
	var result = new Array();
	if (roles) {
		for ( var i = 0; i < roles.length; i++) {
			result.push(this.hasRole(roles[i]));
		}
	}
	return result;
}

/**
 * Checks if the Subject has all of the specified roles
 * 
 * @param {Array}
 *            roles - the list of roles to check
 * @returns {boolean} <code>true</code> if the user has all the roles,
 *          <code>false</code> otherwise.
 */
Authorizer.prototype.hasAllRoles = function(roles) {
	var hasAllRoles = this.hasRoles(roles);
	if (angular.isArray(hasAllRoles)) {
		hasAllRoles = ((hasAllRoles.length > 0) && (hasAllRoles.indexOf(false) == -1));
	}
	return hasAllRoles;
}

/**
 * Returns the permissions collected out of the AuthorizationInfo object
 * 
 * @param {AuthorizationInfo}
 *            authorizationInfo Subject/User authorization data
 * @returns {Array} permissions
 * @private
 */
Authorizer.prototype.getPermissions = function(authorizationInfo) {
	var permissions = authorizationInfo.getObjectPermissions();
	var stringPermissions = authorizationInfo.getStringPermissions();
	for ( var i = 0; i < stringPermissions.length; i++) {
		permissions.push(new Permission(stringPermissions[i]));
	}
	return permissions;
};

/**
 * Evaluate if the permission is granted to the Subject/User
 * 
 * @param {Permission}
 *            permission Permission object to evaluate
 * @retuns {boolean} <code>true</code> if the permission is granted,
 *         <code>false</code>otherwise
 * @private
 */
Authorizer.prototype.isObjectPermissionPermitted = function(permission) {
	var permitted = false;
	for ( var i = 0; i < this.permissions.length && !permitted; i++) {
		permitted = this.permissions[i].implies(permission);
	}
	return permitted;
};
/**
 * Returns an object Permission
 * 
 * @param {string |
 *            Permission}
 * @retuns {Permission} a Permission object
 * @private
 */
Authorizer.prototype.resolvePermission = function(permission) {
	var p = permission;
	if (angular.isString(permission)) {
		p = new Permission(permission);
	}
	return p;
}
