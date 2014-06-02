'use strict';

angular.module('angularShiro.services', []).provider('authenticator',
		AuthenticatorProvider).provider('angularShiroConfig',
		AngularShiroConfigProvider).factory(
		'subject',
		[
				'authenticator',
				'authorizer',
				'authenticationResponseParser',
				function(authenticator, authorizer,
						authenticationResponseParser) {
					return new Subject(authenticator, authorizer,
							authenticationResponseParser);
				} ]).factory('usernamePasswordToken', function() {
	return new UsernamePasswordToken();
}).factory('authorizer', function() {
	return new Authorizer();
}).factory('authenticationResponseParser', function() {
	return new AuthenticationResponseParser();
});

angular.module('angularShiro.directives', []).directive('hasRole',
		hasRoleDirective).directive('notAuthenticated',
		notAuthenticatedDirective).directive('authenticated',
		authenticatedDirective).directive('lacksRole', lacksRoleDirective)
		.directive('hasAnyRole', hasAnyRoleDirective).directive(
				'hasPermission', hasPermissionDirective).directive(
				'lacksPermission', lacksPermissionDirective).directive(
				'principal', principalDirective).directive(
				'usernamePasswordForm', usernamePasswordFormDirective);

angular.module('angularShiro', [ 'angularShiro.services',
		'angularShiro.directives', 'angularShiro.templates' ]);

/**
 * Return the DOM siblings between the first and last node in the given array.
 * 
 * @param {Array}
 *            array like object
 * @returns jQlite object containing the elements
 */
function getBlockElements(nodes) {
	var startNode = nodes[0], endNode = nodes[nodes.length - 1];
	if (startNode === endNode) {
		return angular.element(startNode);
	}

	var element = startNode;
	var elements = [ element ];

	do {
		element = element.nextSibling;
		if (!element)
			break;
		elements.push(element);
	} while (element !== endNode);

	return angular.element(elements);
}
