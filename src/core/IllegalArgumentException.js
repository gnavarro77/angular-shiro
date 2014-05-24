/**
 * Thrown to indicate that a method has been passed an illegal or inappropriate
 * argument.
 * 
 * @class IllegalArgumentException
 * @param message
 *            {string} A message to pass along with the exception
 * @constructor
 * @public
 * @since 0.1
 */
function IllegalArgumentException(message) {
	this.message = message;
};

