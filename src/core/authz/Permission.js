'use strict'

/**
 * A Permission represents the ability to perform an action or access a resource
 * 
 * @class Permission
 * @constructor
 * 
 * @param wildcardString
 *            {string} wildcardString string representing the permission
 * @param caseSensitive
 *            {boolean} flag indicating if the comparison is case sensitive
 * @since 0.0.1
 */
function Permission(wildcardString, caseSensitive) {
	if (!caseSensitive) {
		caseSensitive = Permission.DEFAULT_CASE_SENSITIVE;
	}
	this.parts = this.resolveParts(wildcardString, caseSensitive);
};

/**
 * @static
 * @property WILDCARD_TOKEN
 * @type String
 * @default "*"
 * @private
 * @since 0.0.1
 */
Permission.WILDCARD_TOKEN = "*";
/**
 * @static
 * @property PART_DIVIDER_TOKEN
 * @type String
 * @default ":"
 * @private
 * @since 0.0.1
 */
Permission.PART_DIVIDER_TOKEN = ":";
/**
 * @static
 * @property SUBPART_DIVIDER_TOKEN
 * @type String
 * @default ","
 * @private
 * @since 0.0.1
 */
Permission.SUBPART_DIVIDER_TOKEN = ",";
/**
 * @static
 * @property DEFAULT_CASE_SENSITIVE
 * @type String
 * @default false
 * @private
 * @since 0.0.1
 */
Permission.DEFAULT_CASE_SENSITIVE = false;

/**
 * Instance variable storing the different parts of the wildcardString
 * 
 * @property parts
 * @type Array
 * @private
 * @since 0.0.1
 */
Permission.prototype.parts = null;

/**
 * Returns <code>true</code> if this current instance implies all the
 * functionality and/or resource access described by the specified
 * <code>Permission</code> argument, <code>false</code> otherwise
 * 
 * @method implies
 * @param permission
 *            {Permission} the permission to check for behavior/functionality
 *            comparison
 * 
 * @return {boolean} <code>true</code> if this current instance implies all
 *         the functionality and/or resource access described by the specified
 *         <code>Permission</code> argument, <code>false</code> otherwise
 * @since 0.0.1
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
 * Returns <code>true</code> if all their parts are contained in our parts,
 * <code>false</code> otherwise.
 * 
 * @method containsAll
 * @param ourPart
 *            {array}
 * @param theirPart
 *            {array}
 * 
 * 
 * @return {boolean} <code>true</code> if all their parts are contained in our
 *         parts, <code>false</code> otherwise
 * @private
 * @since 0.0.1
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
 * @method containsWildCardToken
 * @param part
 *            {String} part of the token to be tested
 * @return {boolean} <code>true</code> if the part contains the wildcard
 *         token, <code>false</code> otherwise
 * @private
 * @since 0.0.1
 */
Permission.prototype.containsWildCardToken = function(part) {
	return (part.indexOf(Permission.WILDCARD_TOKEN) > -1);
}

/**
 * Returns the parts composing the specified wildcard string
 * 
 * @method resolveParts
 * @param wildcardString
 *            {string} string representing the permission
 * @param caseSensitive
 *            {boolean} flag indicating if the comparison is case sensitive
 * @return {array} the parts composinf the wildcard string
 * @private
 * @since 0.0.1
 */
Permission.prototype.resolveParts = function(wildcardString, caseSensitive) {
	if (!wildcardString) {
		throw new IllegalArgumentException('Wildcard string must defiend');
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
 * Split a part of the overall wildcardString into its sub parts
 * 
 * @method resolveSubParts
 * @param part
 *            {string} a part of the overall wildcardString
 * @param caseSensitive
 *            {boolean} flag indicating if the comparison is case sensitive
 * @retun {array} the subparts
 * @private
 * @since 0.0.1
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
 * @method getParts
 * @return {array} )wildcard string parts
 * @protected
 * @since 0.0.1
 */
Permission.prototype.getParts = function() {
	return this.parts;
}