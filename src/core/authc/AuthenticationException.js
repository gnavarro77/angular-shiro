/**
 * Exception thrown on authentication error
 * 
 * @class AuthenticationException
 * @param message
 *            {string} A message to pass along with the exception
 * @constructor
 * @public
 * @since 0.1
 */
function AuthenticationException(message) {
	this.message = message;
}