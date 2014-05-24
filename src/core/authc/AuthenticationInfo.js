/**
 * 
 * <code>AuthenticationInfo</code> represents the Subject's informations
 * regarding the authentication process
 * 
 * @class AuthenticationInfo
 * @constructor
 * 
 * @param principal
 *            {Object} the Subject's principal
 * @param credentials
 *            {Array} the Subject's credentials
 * @since 0.0.1
 */
function AuthenticationInfo(principal, credentials) {
	this.principal = principal;
	this.credentials = credentials;
}

/**
 * the Subject's principal
 * 
 * @property principal
 * @type Object
 * @private
 * @since 0.0.1
 */
AuthenticationInfo.prototype.principal = null;

/**
 * @property credentials
 * @type Array
 * @private
 * @since 0.0.1
 */
AuthenticationInfo.prototype.credentials = null;

/**
 * Returns the Suject's principal
 * 
 * @method getPrincipal
 * 
 * @return {Object} the Subject's principal
 * @since 0.0.1
 */
AuthenticationInfo.prototype.getPrincipal = function() {
	return this.principal;
}

/**
 * Returns the Subject's credentials . A credential verifies the Subject's
 * principal, such as a password or private key
 * 
 * @method getCredentials
 * @returns {Array} the Subject's credentials
 * @since 0.0.1
 */
AuthenticationInfo.prototype.getCredentials = function() {
	return this.credentials;
};
