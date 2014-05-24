/**
 * Exception thrown on authorization violation
 * 
 * @class AuthorizationException
 * @param message
 *            {string} A message to pass along with the exception
 * @constructor
 * @public
 * @since 0.1
 */
function AuthorizationException(message) {
	this.message = message;
}