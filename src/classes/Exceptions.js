/**
 * Thrown to indicate that a method has been passed an illegal or inappropriate
 * argument.
 * 
 * @param {string}
 *            message - A message to pass along with the exception
 * @constructor
 * @public
 * @since 0.1
 */
function IllegalArgumentException(message) {
	this.message = message;
};

/**
 * Exception thrown on authentication error
 * 
 * @param {string}
 *            message - A message to pass along with the exception
 * @constructor
 * @public
 * @since 0.1
 */
function AuthenticationException(message) {
	this.message = message;
}

/**
 * Exception thrown on authorization violation
 * 
 * @param {string}
 *            message - A message to pass along with the exception
 * @constructor
 * @public
 * @since 0.1
 */
function AuthorizationException(message) {
	this.message = message;
}