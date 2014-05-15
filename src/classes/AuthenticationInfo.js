/**
 * 
 * AuthenticationInfo represents the Subject's informations regarding the
 * authentication process
 * 
 * @constructor
 * 
 * @param {Object}
 *            principal - the Subject's principal
 * @param {Object}
 *            credentials - the Subject's credentials
 * @since 0.1
 */
function AuthenticationInfo(principal, credentials) {
	/**
	 * @private
	 * @desc the principal
	 * @member {Object}
	 * @since 0.1
	 */
	this.principal = principal;

	/**
	 * @private
	 * @desc the principal's credentials
	 * @member {Object}
	 * @since 0.1
	 */
	this.credentials = credentials;
}

/**
 * @public
 * @desc Returns the Suject's principal
 * @returns {Object} principal - the Subject's principal
 * @since 0.1
 */
AuthenticationInfo.prototype.getPrincipal = function() {
	return this.principal;
}

/**
 * @public
 * @desc Returns the Subject's credentials . A credential verifies the Subject's
 *       principal, such as a password or private key
 * @returns {Object} creadentials - the Subject's credentials
 * @since 0.1
 */
AuthenticationInfo.prototype.getCredentials = function() {
	return this.credentials;
};
