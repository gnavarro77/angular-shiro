'use strict'

/**
 * A Permission represents the ability to perform an action or access a
 * resource.
 * 
 * @param {string}
 *            wildcardString string representing the permission
 * @param {boolean}
 *            flag indicating if the comparison is case sensitive
 * 
 * @see {@link http://shiro.apache.org/static/1.2.2/apidocs/org/apache/shiro/authz/Permission.html|Apache Shiro, org.apache.shiro.authz.Permission}
 * @see {@link http://shiro.apache.org/static/1.2.2/apidocs/org/apache/shiro/authz/permission/WildcardPermission.html|Apache Shiro, org.apache.shiro.authz.permission.WildcardPermission}
 * @constructor
 */
function Permission(wildcardString, caseSensitive) {
	if (!caseSensitive) {
		caseSensitive = Permission.DEFAULT_CASE_SENSITIVE;
	}
	this.parts = this.resolveParts(wildcardString, caseSensitive);
};

/**
 * @private
 */
Permission.WILDCARD_TOKEN = "*";
/**
 * @private
 */
Permission.PART_DIVIDER_TOKEN = ":";
/**
 * @private
 */
Permission.SUBPART_DIVIDER_TOKEN = ",";
/**
 * @private
 */
Permission.DEFAULT_CASE_SENSITIVE = false;

/**
 * Instance variable storing the different parts of the wildcardString
 * 
 * @private
 */
Permission.prototype.parts = null;

/**
 * @param {object}
 *            permission
 * @returns {boolean}
 * @see {@link http://shiro.apache.org/static/1.2.2/apidocs|Apache Shiro, org.apache.shiro.authz.Permission#implies(Permission p)}
 * @see {@link http://shiro.apache.org/static/1.2.2/apidocs|Apache Shiro, org.apache.shiro.authz.permission.WildcardPermission#implies(Permission p)}
 */
Permission.prototype.implies = function(permission) {
	var implies = true;
	if (permission) {
		var theirParts = permission.getParts();
		for ( var i = 0; i < this.parts.length; i++) {
			var ourPart = this.getParts()[i];
			if (i < theirParts.length) {
				var theirPart = theirParts[i];
				if (!this.containsWildCardToken(ourPart)
						&& !this.containsAll(ourPart, theirPart)) {
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
	} else {
		implies = false;
	}
	return implies;
}

/**
 * Returns <code>true</code> if all their parts are contained in our parts ,
 * <code>false</code> otherwise.
 * 
 * @param {array}
 *            ourPart
 * @param {array}
 *            theirPart
 * 
 * @returns {boolean}
 * @private
 */
Permission.prototype.containsAll = function(ourPart, theirPart) {
	var contains = true;
	for ( var i = 0; i < theirPart.length; i++) {
		if (ourPart.indexOf(theirPart[i]) == -1) {
			contains = false;
			break;
		}
	}
	return contains;
}

/**
 * Returns <code>true</code> if the part contains the wildcard token,
 * <code>false</code> otherwise.
 * 
 * @retuns {boolean}
 * @private
 */
Permission.prototype.containsWildCardToken = function(part) {
	return (part.indexOf(Permission.WILDCARD_TOKEN) > -1);
}

/**
 * @param {string}
 *            wildcardString string representing the permission
 * @param {boolean}
 *            caseSensitive flag indicating if the comparison is case sensitive
 * @private
 */
Permission.prototype.resolveParts = function(wildcardString, caseSensitive) {
	if (!wildcardString) {
		throw new IllegalArgumentException(
				'Wildcard string must not be null or empty');
	}
	if (wildcardString.trim) {
		wildcardString = wildcardString.trim();
	}
	var parts = new Array();
	var tokens = wildcardString.split(Permission.PART_DIVIDER_TOKEN);
	for ( var i = 0; i < tokens.length; i++) {
		var token = tokens[i];
		parts.push(this.resolveSubParts(token, caseSensitive));
	}
	return parts;
};

/**
 * <p>
 * Split a part of the overall wildcardString into its sub parts
 * </p>
 * <p>
 * Considering the following part <code>'view,create,edit'</code> the resolved
 * sub parts would be <code>[view,create,edit]</code>
 * </p>
 * 
 * @param {string}
 *            part a part of the overall wildcardString
 * @param {boolean}
 *            caseSensitive flag indicating if the comparison is case sensitive
 * @retuns {array} the subparts
 * @private
 */
Permission.prototype.resolveSubParts = function(part, caseSensitive) {
	var subParts = new Array();
	var tokens = part.split(Permission.SUBPART_DIVIDER_TOKEN);
	for ( var i = 0; i < tokens.length; i++) {
		var token = tokens[i];
		if (token.trim) {
			token = token.trim();
		}
		if (caseSensitive == false) {
			token = token.toLowerCase();
		}
		if (token == null || token === '' || !token) {
			throw new IllegalArgumentException(
					'"Wildcard string contain malformed parts');
		}
		subParts[i] = token;
	}
	return subParts;
}

/**
 * Returns the wildcardString parts
 * 
 * @returns {array} )wildcardString parts
 * @protected
 */
Permission.prototype.getParts = function() {
	return this.parts;
}