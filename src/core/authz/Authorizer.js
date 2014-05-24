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
 * @class Authorizer
 * @param authorizationInfo
 *            {AuthorizationInfo} All informations regarding the Subject
 *            authorizations
 * @throws {IllegalArgumentException}
 *             An <code>IllegalArgumentException</code> is thrown in case of a
 *             null <code>authorizationInfo</code> attempt
 * @constructor
 * 
 * @since 0.1
 */
function Authorizer(authorizationInfo) {
	if (!authorizationInfo || authorizationInfo == null
			|| !(authorizationInfo instanceof AuthorizationInfo)) {
		throw new IllegalArgumentException(
				'invalid value for authorizationInfo');
	}
	this.authorizationInfo = authorizationInfo;
	this.permissions = this.getPermissions(authorizationInfo);
}

/**
 * Evaluate if the Subject is permitted to perform an action or access a
 * resource
 * 
 * @method isPermitted
 * @param permission
 *            {string | Permission} a permission
 * @return {boolean} <code>true</code> for permitted Subject,
 *         <code>false</code> otherwise.
 * 
 */
Authorizer.prototype.isPermitted = function(permission) {
	return this.isObjectPermissionPermitted(this.resolvePermission(permission));
}

/**
 * Evaluate if the Subject is permitted to perform all action or access all
 * resource implied by specified permissions
 * 
 * @method isPermittedAll
 * @param permission
 *            {array} a list of permission
 * @return {boolean | Array} true for all permissions are permitted, false
 *         otherwise.
 */
Authorizer.prototype.isPermittedAll = function(permissions) {
	var permitted = (permissions && permissions.length);
	if (permitted) {
		for ( var i = 0, len = permissions.length; i < len && permitted; i++) {
			permitted = this.isPermitted(permissions[i]);
		}
	}
	return permitted;
}

/**
 * Evaluate if the Subject has the specified role
 * 
 * @method hasRole
 * @param role
 *            {string} role to check
 * 
 * @return {boolean} <code>true</code> if the Subject has the specified role,
 *         <code>false</code> otherwise
 * 
 */
Authorizer.prototype.hasRole = function(role) {
	return (this.authorizationInfo.getRoles().indexOf(role) > -1);
}

/**
 * Checks a list of roles against the Subject's roles *
 * 
 * @method hasRoles
 * @param roles
 *            {Array} the list of roles to check against the Subject's roles
 * @return {Array} an array of booleans whose indices correspond to the index of
 *         the roles in the given identifiers. At a given index, a
 *         <code>true</code> value indicates that the user has the role, a
 *         <code>false</code> value indicates that does not have the role
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
 * @method hasAllRoles
 * @param roles
 *            {Array} the list of roles to check
 * @return {boolean} <code>true</code> if the user has all the roles,
 *         <code>false</code> otherwise.
 */
Authorizer.prototype.hasAllRoles = function(roles) {
	var hasAllRoles = this.hasRoles(roles);
	if (angular.isArray(hasAllRoles)) {
		hasAllRoles = ((hasAllRoles.length > 0) && (hasAllRoles.indexOf(false) == -1));
	}
	return hasAllRoles;
}

/**
 * Returns the permissions collected out of the <code>AuthorizationInfo</code>
 * object
 * 
 * @method getPermissions
 * @param authorizationInfo
 *            {AuthorizationInfo} Subject/User authorization data
 * @return {Array} the permissions collected out of the
 *         <code>AuthorizationInfo</code> object
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
 * @method isObjectPermissionPermitted
 * @param permission {Permission}
 *            Permission object to evaluate
 * @retun {boolean} <code>true</code> if the permission is granted,
 *        <code>false</code>otherwise
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
 * @method resolvePermission
 * @param permission
 *            {string | Permission} a permission
 * @retun {Permission} a Permission object
 * @private
 */
Authorizer.prototype.resolvePermission = function(permission) {
	var p = permission;
	if (toString.call(permission) == '[object String]') {
		p = new Permission(permission);
	}
	return p;
}
