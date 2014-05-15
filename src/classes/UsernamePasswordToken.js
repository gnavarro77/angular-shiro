/**
 * <p>
 * UsernamePasswordToken is a simple username/password authentication token.
 * </p>
 * 
 * @param {string}
 *            username - the Subject's username
 * @param {string}
 *            password - the Subject's password
 * 
 * @constructor
 * @since 0.1
 */
function UsernamePasswordToken(username, password) {
	this.username = username;
	this.password = password;
}

/**
 * 
 * Returns the username submitted during an authentication attempt
 * 
 * @returns {string} the username submitted during an authentication attempt
 * @protected
 */
UsernamePasswordToken.prototype.getUsername = function() {
	return this.username;
};
/**
 * Sets the username for submission during an authentication attempt.
 * 
 * @param {string}
 *            username - the username to be used for submission during an
 *            authentication attempt
 * @protected
 */
UsernamePasswordToken.prototype.setUsername = function(username) {
	this.username = username;
};

/**
 * Returns the password submitted during an authentication attempt as a
 * character array.
 * 
 * @returns {string} the password submitted during an authentication attempt as
 *          a character array
 * @protected
 */
UsernamePasswordToken.prototype.getPassword = function() {
	return this.password;
};
/**
 * Sets the password for submission during an authentication attempt.
 * 
 * @param {string}
 *            password the password to be used for submission during an
 *            authentication attempt
 * @protected
 */
UsernamePasswordToken.prototype.setPassword = function(password) {
	this.password = password;
};

/**
 * Simply returns <code>getUsername()</code> returned value
 * 
 * @returns the username
 * @public
 */
UsernamePasswordToken.prototype.getPrincipal = function() {
	return this.getUsername();
};

/**
 * Returns the <code>getPassword()</code> returned value
 * 
 * @returns the password
 * @public
 */
UsernamePasswordToken.prototype.getCredentials = function() {
	return this.getPassword();
};