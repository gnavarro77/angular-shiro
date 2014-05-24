/**
 * <p>
 * UsernamePasswordToken is a simple username/password authentication token.
 * </p>
 * 
 * @class UsernamePasswordToken
 * @param username
 *            {string} the Subject's user name
 * @param password{string}
 *            the Subject's password
 * 
 * @constructor
 * @since 0.0.1
 */
function UsernamePasswordToken(username, password) {
	this.username = username;
	this.password = password;
}

/**
 * Subject's user name
 * 
 * @property username
 * @type String
 * @private
 * @since 0.0.1
 */
UsernamePasswordToken.prototype.username = null;

/**
 * Subject's password
 * 
 * @property password
 * @type String
 * @private
 * @since 0.0.1
 */
UsernamePasswordToken.prototype.password = null;

/**
 * Simply returns <code>getUsername()</code> returned value
 * 
 * @method getPrincipal
 * @return the username
 */
UsernamePasswordToken.prototype.getPrincipal = function() {
	return this.getUsername();
};

/**
 * Returns the <code>getPassword()</code> returned value
 * 
 * @method getCredentials
 * @return the password
 * @public
 */
UsernamePasswordToken.prototype.getCredentials = function() {
	return this.getPassword();
};