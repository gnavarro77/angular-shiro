/**
 * 
 * AuthorizationInfo represents a Subject's authorization informations (roles,
 * permissions, etc) used for access control operations
 * 
 * @class AuthorizationInfo
 * @constructor
 * 
 * @param roles
 *            {Array} names of all roles assigned to a corresponding Subject
 * @param permissions
 *            {Array} list of the permissions assigned to the corresponding
 *            Subject
 * 
 * @since 0.0.1
 * 
 */
function AuthorizationInfo(roles, permissions) {

	/**
	 * @private
	 */
	this.roles = roles ? roles : new Array();

	/**
	 * @private
	 */
	this.permissions = permissions ? permissions : new Array();

};

/**
 * names of all roles
 * 
 * @property roles
 * @type Array
 * @private
 * @since 0.0.1
 */
AuthorizationInfo.prototype.roles = null;
/**
 * collection of all the permissions
 * 
 * @property permissions
 * @type Array
 * @private
 * @since 0.0.1
 */
AuthorizationInfo.prototype.permissions = null;

/**
 * Returns names of all roles assigned to a corresponding Subject
 * 
 * @method getRoles
 * @return {Array} names of all roles assigned to a corresponding Subject
 * @since 0.0.1
 */
AuthorizationInfo.prototype.getRoles = function() {
	return this.roles;
}

/**
 * Returns all string-based permissions assigned to the corresponding Subject
 * 
 * @method getStringPermissions
 * @return {Array} all string-based permissions assigned to the corresponding
 *         Subject
 * @since 0.0.1
 * 
 */
AuthorizationInfo.prototype.getStringPermissions = function() {
	var permissions = new Array();
	for ( var i = 0, len = this.permissions.length; i < len; i++) {
		var p = this.permissions[i];
		if (toString.call(p) == '[object String]') {
			permissions.push(p);
		}
	}
	return permissions;
}
/**
 * Returns all <code>Permission</code>s assigned to the corresponding
 * Subject.
 * 
 * @method getObjectPermissions
 * @return {Array} all <code>Permission</code>s assigned to the corresponding
 *         Subject
 * @since 0.0.1
 */
AuthorizationInfo.prototype.getObjectPermissions = function() {
	var permissions = new Array();
	for ( var i = 0, len = this.permissions.length; i < len; i++) {
		var p = this.permissions[i];
		if (p instanceof Permission) {
			permissions.push(p);
		}
	}
	return permissions;
}

/**
 * Adds a role to the <code>Subject</code> role list
 * 
 * @method addRole
 * @param role
 *            {String} the role to add to the <code>Subject</code> role list
 * @since 0.0.1
 */
AuthorizationInfo.prototype.addRole = function(role) {
	if (role && (toString.call(p) == '[object String]')) {
		this.roles.push(role);
	}
}

/**
 * Adds a multiple roles to the <code>Subject</code> role list
 * 
 * @method addRoles
 * 
 * @param roles
 *            {Array} list of role to add to the <code>Subject</code> role
 *            list
 * @since 0.0.1
 */
AuthorizationInfo.prototype.addRoles = function(roles) {
	if (roles && roles.length) {
		for ( var i = 0, len = roles.length; i < len; i++) {
			this.addRole(roles[i]);
		}
	}
}

/**
 * Adds a permission to the permission list of the Subject
 * 
 * @method addPermission
 * @param permission
 *            {string | Permission} a permission
 * @since 0.0.1
 */
AuthorizationInfo.prototype.addPermission = function(permission) {
	if (permission) {
		this.permissions.push(permission);
	}
}

/**
 * Adds a list of permissions to the permission assigned to the Subject
 * 
 * @method addPermissions
 * @param permissions
 *            {Array} a collection of permissions
 * @since 0.0.1
 */
AuthorizationInfo.prototype.addPermissions = function(permissions) {
	if (permissions && permissions.length) {
		for ( var i = 0, len = permissions.length; i < len; i++) {
			this.addPermission(permissions[i]);
		}
	}
}

/**
 * Returns all permissions assigned to the Subject
 * 
 * @method getPermissions
 * @return {Array} all permissions assigned to the Subject
 * @since 0.0.1
 */
AuthorizationInfo.prototype.getPermissions = function() {
	return this.permissions;
}

AuthorizationInfo.prototype.toString = function() {
	return JSON.stringify(this);
}
