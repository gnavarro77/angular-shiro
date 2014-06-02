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

var directives = {
	'hasRole' : hasRoleDirective,
	'notAuthenticated' : notAuthenticatedDirective,
	'authenticated' : authenticatedDirective,
	'lacksRole' : lacksRoleDirective,
	'hasAnyRole' : hasAnyRoleDirective,
	'hasPermission' : hasPermissionDirective,
	'lacksPermission' : lacksPermissionDirective,
	'principal' : principalDirective,
	'usernamePasswordForm' : usernamePasswordFormDirective
}

var moduleDirectives = angular.module('angularShiro.directives', []);

for (var name in directives) {
	moduleDirectives.directive(name, directives[name]);
}


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
