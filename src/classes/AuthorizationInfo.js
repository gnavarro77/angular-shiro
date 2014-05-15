/**
 * 
 * AuthorizationInfo represents a Subject's authorization informations (roles,
 * permissions, etc) used for access control operations
 * 
 * @constructor
 * 
 * @param {Array}
 *            roles - names of all roles assigned to a corresponding Subject
 * @param {Array}
 *            permissions - list of the permissions assigned to the
 *            corresponding Subject
 * 
 * @see {@link http://shiro.apache.org/static/1.2.2/apidocs/org/apache/shiro/authz/AuthorizationInfo.html}
 * 
 * @since 0.1
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
 * Adds a role to the role list of the Subject
 * 
 * @param {string}
 *            role - the role to add
 * @since 0.1
 */
AuthorizationInfo.prototype.addRole = function(role) {
	this.roles.push(role);
}

/**
 * Adds a multiple roles to the role list of the subject
 * 
 * @param {Array}
 *            roles - the roles to add
 * @since 0.1
 */
AuthorizationInfo.prototype.addRoles = function(roles) {
	this.roles.push.apply(this.roles, roles);
}

/**
 * Adds a permission to the permission list of the Subject
 * 
 * @param {string}
 *            permission - the permission to add
 * @since 0.1
 */
AuthorizationInfo.prototype.addPermission = function(permission) {
	this.permissions.push(permission);
}

/**
 * Adds a list of permissions to the permission list of the Subject
 * 
 * @param {Array}
 *            permissions - the permissions to add
 * @since 0.1
 */
AuthorizationInfo.prototype.addPermissions = function(permissions) {
	this.roles.push.apply(this.permissions, permissions);
}

/**
 * Returns the role list of the Subject
 * 
 * @returns {Array} the role list of the Subject
 * @since 0.1
 * @see {@link http://shiro.apache.org/static/1.2.2/apidocs/org/apache/shiro/authz/AuthorizationInfo.html#getRoles%28%29}
 */
AuthorizationInfo.prototype.getRoles = function() {
	return this.roles;
}

/**
 * Returns the permission list of the Subject
 * 
 * @returns {Array} the permission list of the Subject
 * @since 0.1
 */
AuthorizationInfo.prototype.getPermissions = function() {
	return this.permissions;
}

/**
 * Returns all string-based permissions assigned to the corresponding Subject.
 * 
 * @returns {Array} the role list of the Subject
 * @since 0.1
 * 
 * @see {@link http://shiro.apache.org/static/1.2.2/apidocs/org/apache/shiro/authz/AuthorizationInfo.html#getStringPermissions%28%29}
 */
AuthorizationInfo.prototype.getStringPermissions = function() {
	var permissions = new Array();
	for ( var i = 0; i < this.permissions.length; i++) {
		if (angular.isString(this.permissions[i])) {
			permissions.push(this.permissions[i]);
		}
	}
	return permissions;
}
/**
 * Returns all type-safe {@link Permission Permission}s assigned to the
 * corresponding Subject.
 * 
 * @returns {Array}
 * @since 0.1
 * @see {@link http://shiro.apache.org/static/1.2.2/apidocs/org/apache/shiro/authz/AuthorizationInfo.html#getObjectPermissions%28%29}
 */
AuthorizationInfo.prototype.getObjectPermissions = function() {
	var permissions = new Array();
	for ( var i = 0; i < this.permissions.length; i++) {
		if (this.permissions[i] instanceof Permission) {
			permissions.push(this.permissions[i]);
		}
	}
	return permissions;
}

AuthorizationInfo.prototype.toString = function() {
	return JSON.stringify(this);
}
