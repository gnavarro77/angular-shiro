'use strict';

/**
 * @ngdoc object
 * @name angularShiro.services.Permission
 * 
 * @description A <code>Permission</code> represents the ability to perform an
 *              action or access a resource
 * 
 * @param {string}
 *                wildcardString wildcardString string representing the
 *                permission
 * @param {boolean}
 *                caseSensitive flag indicating if the comparison is case
 *                sensitive
 */
function Permission(wildcardString, caseSensitive) {

    /**
     * @ngdoc property
     * @name Permission#WILDCARD_TOKEN
     * @propertyOf angularShiro.services.Permission
     * @description the token representing wildcard
     * @returns {string} the token representing wildcard
     */
    this.WILDCARD_TOKEN = '*';
    /**
     * @ngdoc property
     * @name Permission#PART_DIVIDER_TOKEN
     * @propertyOf angularShiro.services.Permission
     * @description the string used to separate the different parts of a token
     * @returns {string} the string used to separate the different parts of a
     *          token
     */
    this.PART_DIVIDER_TOKEN = ':';
    /**
     * @ngdoc property
     * @name Permission#SUBPART_DIVIDER_TOKEN
     * @propertyOf angularShiro.services.Permission
     * @description the string used to separate multiple tokens
     * @returns {string} the string used to separate multiple tokens
     */
    this.SUBPART_DIVIDER_TOKEN = ',';
    /**
     * @ngdoc property
     * @name Permission#caseSensitive
     * @propertyOf angularShiro.services.Permission
     * @description flag indicating if the comparisons are case sensitive or not
     * @returns {string} flag indicating if the comparisons are case sensitive
     *          or not
     */
    this.caseSensitive = (caseSensitive) ? caseSensitive : false;

    /**
     * @ngdoc property
     * @name Permission#parts
     * @propertyOf angularShiro.services.Permission
     * @description Represents the differents parts of a token
     * @returns {array} Represents the differents parts of a token
     */
    this.parts;

    /**
     * @ngdoc method
     * @name Permission#implies
     * @methodOf angularShiro.services.Permission
     * 
     * @description Returns <code>true</code> if this current instance implies
     *              all the functionality and/or resource access described by
     *              the specified <code>Permission</code> argument,
     *              <code>false</code> otherwise
     * 
     * @param {string |
     *                Permission} permission the permission to check for
     *                behavior/functionality comparison
     * 
     * @return {boolean} <code>true</code> if this current instance implies
     *         all the functionality and/or resource access described by the
     *         specified <code>Permission</code> argument, <code>false</code>
     *         otherwise
     */
    this.implies = function(permission) {
	var implies = angular.isDefined(permission) && (this.getParts().length > 0);
	if (implies) {
	    permission = (angular.isString(permission)) ? new Permission(permission) : permission;
	    var theirParts = permission.getParts();
	    var theirPartsLength = theirParts.length;
	    var ourParts = this.getParts();
	    for ( var i = 0, len = ourParts.length; i < len; i++) {
		var ourPart = ourParts[i];
		if (i < theirPartsLength) {
		    var theirPart = theirParts[i];
		    if (!this.containsWildCardToken(ourPart) && !this.containsAll(ourPart, theirPart)) {
			implies = false;
			break;
		    }
		} else {
		    if (!this.containsWildCardToken(ourPart)) {
			implies = false;
			break;
		    }
		}
	    }
	}
	return implies;
    };

    /**
     * Returns <code>true</code> if all their parts are contained in our
     * parts, <code>false</code> otherwise.
     * 
     * @param {array}
     *                ourPart
     * @param {array}
     *                theirPart
     * 
     * @return {boolean} <code>true</code> if all their parts are contained in
     *         our parts, <code>false</code> otherwise
     * @private
     */
    this.containsAll = function(ourPart, theirPart) {
	var contains = true;
	for ( var i = 0; i < theirPart.length; i++) {
	    if (ourPart.indexOf(theirPart[i]) === -1) {
		contains = false;
		break;
	    }
	}
	return contains;
    };

    /**
     * Returns <code>true</code> if the part contains the wildcard token,
     * <code>false</code> otherwise.
     * 
     * @param {String}
     *                part part of the token to be tested
     * @return {boolean} <code>true</code> if the part contains the wildcard
     *         token, <code>false</code> otherwise
     * @private
     */
    this.containsWildCardToken = function(part) {
	return part.indexOf(this.WILDCARD_TOKEN) > -1;
    };

    /**
     * Returns the parts composing the specified wildcard string
     * 
     * @param {string}
     *                wildcardString string representing the permission
     * @param {boolean}
     *                caseSensitive flag indicating if the comparison is case
     *                sensitive
     * @return {array} the parts composinf the wildcard string
     * @private
     */
    this.resolveParts = function(wildcardString, caseSensitive) {
	var parts = [];
	if (angular.isDefined(wildcardString) && angular.isString(wildcardString)) {
	    wildcardString = (wildcardString.trim) ? wildcardString.trim() : wildcardString;
	    var tokens = wildcardString.split(this.PART_DIVIDER_TOKEN);
	    angular.forEach(tokens, function(token) {
		parts.push(this.resolveSubParts(token, caseSensitive));
	    }, this);
	}
	return parts;
    };

    /**
     * Split a part of the overall wildcardString into its sub parts
     * 
     * @method resolveSubParts
     * @param part
     *                {string} a part of the overall wildcardString
     * @param caseSensitive
     *                {boolean} flag indicating if the comparison is case
     *                sensitive
     * @retun {array} the subparts
     * @private
     */
    this.resolveSubParts = function(part, caseSensitive) {
	var subParts = [];
	var tokens = part.split(this.SUBPART_DIVIDER_TOKEN);
	var idx = 0;
	angular.forEach(tokens, function(token) {
	    token = (token.trim) ? token.trim() : token;
	    token = (caseSensitive === false) ? angular.lowercase(token) : token;
	    subParts[idx++] = token;
	});
	return subParts;
    };

    /**
     * Returns the wildcardString parts
     * 
     * @return {array} wildcard string parts
     * @private
     */
    this.getParts = function() {
	return this.parts;
    };

    // initialize
    this.parts = this.resolveParts(wildcardString, caseSensitive);
}

/**
 * @ngdoc object
 * @name angularShiro.services.AuthorizationInfo
 * 
 * 
 * @description AuthorizationInfo represents a Subject's authorization
 *              informations (roles, permissions, etc) used for access control
 *              operations
 * 
 * @param {array}
 *                roles the list of the <code>Subject</code> roles
 * @param {array}
 *                permissions the list of the <code>Subject</code> permissions
 * 
 * 
 */
function AuthorizationInfo(roles, permissions) {

    /**
     * @name AuthorizationInfo#roles
     * @propertyOf angularShiro.services.AuthorizationInfo
     * @description names of all roles assigned to a corresponding
     *              <code>Subject</code>
     * @returns {array} the Subject's roles
     */
    this.roles = angular.isArray(roles) ? roles : [];

    /**
     * @name AuthorizationInfo#permissions
     * @propertyOf angularShiro.services.AuthorizationInfo
     * @description list of the permissions assigned to the corresponding
     *              <code>Subject</code>
     * @returns {array} the Subject's permissions
     */
    this.permissions = angular.isArray(permissions) ? permissions : [];

    /**
     * @ngdoc method
     * @name AuthorizationInfo#getRoles
     * @methodOf angularShiro.services.AuthorizationInfo
     * 
     * @description Returns names of all roles assigned to a corresponding
     *              <code>Subject</code>
     * 
     * @return {Array} all roles assigned to a corresponding
     *         <code>Subject</code>
     */
    this.getRoles = function() {
	return this.roles;
    };

    /**
     * @ngdoc method
     * @name AuthorizationInfo#getPermissions
     * @methodOf angularShiro.services.AuthorizationInfo
     * 
     * @description Returns all permissions assigned to the <code>Subject</code>
     * 
     * @return {Array} all permissions assigned to the <code>Subject</code>
     */
    this.getPermissions = function() {
	return this.permissions;
    };

    /**
     * Returns all string-based permissions assigned to the corresponding
     * Subject
     * 
     * @method getStringPermissions
     * @return {Array} all string-based permissions assigned to the
     *         corresponding Subject
     * @since 0.0.1
     * 
     */
    this.getStringPermissions = function() {
	var permissions = [];
	for ( var i = 0, len = this.permissions.length; i < len; i++) {
	    var p = this.permissions[i];
	    if (angular.isString(p)) {
		permissions.push(p);
	    }
	}
	return permissions;
    };
    /**
     * Returns all <code>Permission</code>s assigned to the corresponding
     * Subject.
     * 
     * @method getObjectPermissions
     * @return {Array} all <code>Permission</code>s assigned to the
     *         corresponding Subject
     * @since 0.0.1
     */
    this.getObjectPermissions = function() {
	var permissions = [];
	for ( var i = 0, len = this.permissions.length; i < len; i++) {
	    var p = this.permissions[i];
	    if (p instanceof Permission) {
		permissions.push(p);
	    }
	}
	return permissions;
    };
}

/**
 * @ngdoc object
 * @name angularShiro.services.Authorizer
 * 
 * 
 * @description An <code>Authorizer</code> performs authorization (access
 *              control) operations for any given Subject
 * 
 * All the authorization operations are based upon the instance of
 * <code>AuthorizationInfo</code> that is injected through the
 * <code>Authorizer</code> constructor.
 * 
 * 
 * @param {AuthorizationInfo}
 *                authorizationInfo All informations regarding the Subject
 *                authorizations
 */
function Authorizer() {

    /**
     * @name Authorizer#permissions
     * @propertyOf angularShiro.services.Authorizer
     * @description list of the permission objects assigned to the corresponding
     *              Subject
     * @return {array} the Subject's permissions
     */
    this.permissions;

    /**
     * <code>AuthorizationInfo</code> instance support of authorization
     * operations
     * 
     * @private
     */
    this.authorizationInfo;

    /**
     * Set the <code>AuthorizationInfo</code> instance
     */
    this.setAuthorizationInfo = function(authorizationInfo) {
	if (!authorizationInfo || authorizationInfo === null || !(authorizationInfo instanceof AuthorizationInfo)) {
	    throw {
		'illegalArgumentException' : 'invalid value for authorizationInfo'
	    };
	}
	this.authorizationInfo = authorizationInfo;
	this.permissions = this.getPermissions(authorizationInfo);
    };

    /**
     * Clear the properties of the current <code>Authorizer</code> instance.
     * 
     * @private
     */
    this.clear = function() {
	this.authorizationInfo = this.permissions = null;
    };

    /**
     * @ngdoc method
     * @name Authorizer#isPermitted
     * @methodOf angularShiro.services.Authorizer
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
    this.isPermitted = function(permission) {
	var result;
	if (angular.isArray(permission)) {
	    result = [];
	    angular.forEach(permission, function(p) {
		result.push(this.isObjectPermissionPermitted(this.resolvePermission(p)));
	    }, this);
	} else {
	    result = this.isObjectPermissionPermitted(this.resolvePermission(permission));
	}
	return result;
    };

    /**
     * @ngdoc method
     * @name Authorizer#isPermittedAll
     * @methodOf angularShiro.services.Authorizer
     * 
     * @description Returns <code>true</code> if the <code>Subject</code>
     *              has all the specified permissions.
     * 
     * @param {array}
     *                permissions a list of permission
     * @return {boolean} <code>true</code> if the <code>Subject</code> has
     *         all the specified permissions, <code>false</code> otherwise.
     */
    this.isPermittedAll = function(permissions) {
	return (this.isPermitted(permissions).indexOf(false) === -1);
    };

    /**
     * @ngdoc method
     * @name Authorizer#hasRole
     * @methodOf angularShiro.services.Authorizer
     * 
     * @description Returns <code>true</code> if the current
     *              <code>Subject</code> has the specified role,
     *              <code>false</code> otherwise.
     * 
     * @param {string}
     *                role role to check
     * @return {boolean} <code>true</code> if the current Subject has the
     *         specified role, <code>false</code> otherwise.
     * 
     */
    this.hasRole = function(role) {
	var hasRole = false;
	if (role) {
	    hasRole = (this.authorizationInfo.getRoles().indexOf(role) > -1);
	}
	return hasRole;
    };

    /**
     * @ngdoc method
     * @name Authorizer#hasRoles
     * @methodOf angularShiro.services.Authorizer
     * 
     * @description Returns an <code>array</code> of booleans whose indices
     *              correspond to the index of the roles in the given
     *              identifiers. At a given index, a <code>true</code> value
     *              indicates that the user has the role, a <code>false</code>
     *              value indicates that he does not have the role.
     * 
     * @param {array}
     *                roles the list of roles to check against the
     *                <code>Subject</code>'s roles
     * @return {array} an array of booleans
     */
    this.hasRoles = function(roles) {
	var result = [];
	if (roles && angular.isArray(roles)) {
	    angular.forEach(roles, function(role) {
		result.push(this.hasRole(role));
	    }, this);
	}
	return result;
    };

    /**
     * @ngdoc method
     * @name Authorizer#hasAllRoles
     * @methodOf angularShiro.services.Authorizer
     * 
     * @description Returns <code>true</code> if the current
     *              <code>Subject</code> has all of the specified roles,
     *              <code>false</code> otherwise.
     * 
     * @param {array}
     *                roles the list of roles to check
     * @return {boolean} <code>true</code> if the current <code>Subject</code>
     *         has all of the specified roles, <code>false</code> otherwise.
     */
    this.hasAllRoles = function(roles) {
	return (this.hasRoles(roles).indexOf(false) === -1);
    };

    /**
     * Returns the permission objects collected out of the
     * <code>AuthorizationInfo</code> object
     * 
     * @method getPermissions
     * @param {AuthorizationInfo}
     *                authorizationInfo Subject/User authorization data
     * @return {Array} the permissions (object) collected out of the
     *         <code>AuthorizationInfo</code> object
     */
    this.getPermissions = function(authInfo) {
	var permissions = authInfo.getObjectPermissions();
	var stringPermissions = authInfo.getStringPermissions();
	for ( var i = 0, len = stringPermissions.length; i < len; i++) {
	    permissions.push(new Permission(stringPermissions[i]));
	}
	return permissions;
    };

    /**
     * Evaluate if the permission is granted to the Subject/User
     * 
     * @method isObjectPermissionPermitted
     * @param {Permission}
     *                permission Permission object to evaluate
     * @retun {boolean} <code>true</code> if the permission is granted,
     *        <code>false</code>otherwise
     */
    this.isObjectPermissionPermitted = function(permission) {
	var permitted = false;
	for ( var i = 0, len = this.permissions.length; i < len && !permitted; i++) {
	    permitted = this.permissions[i].implies(permission);
	}
	return permitted;
    };
    /**
     * Returns an object Permission
     * 
     * @param {string |
     *                Permission} permission a permission
     * @retun {Permission} a Permission object
     */
    this.resolvePermission = function(permission) {
	return angular.isString(permission) ? new Permission(permission) : permission;
    };

}
