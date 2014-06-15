'use strict';

var angularShiroServicesModule = angular.module('angularShiro.services', []);
angularShiroServicesModule.provider('authenticator', AuthenticatorProvider)
		.provider('angularShiroConfig', AngularShiroConfigProvider).factory(
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

var filters = {
	'anon' : anonymousFilter,
	'authc' : formAuthenticationFilter,
	'logout' : logoutFilter,
	'perms' : permsFilter,
	'roles' : rolesFilter
}

for ( var filterName in filters) {
	angularShiroServicesModule.factory(filterName, filters[filterName]);
}
angularShiroServicesModule.factory('filtersResolver', filtersResolver);

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

for ( var name in directives) {
	moduleDirectives.directive(name, directives[name]);
}

angular.module(
		'angularShiro',
		[ 'angularShiro.services', 'angularShiro.directives',
				'angularShiro.templates' ]).run(
		function($rootScope, $location, subject, angularShiroConfig,
				filtersResolver) {

			$rootScope.$on("$locationChangeStart", function(event, next,
					current) {
				var filters = filtersResolver.resolve($location.path());
				for ( var i = 0; i < filters.length; i++) {
					var filter = filters[i];
					if (!filter()) {
						event.preventDefault();
						break;
					}
				}

			});
		});

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

var trim = (function() {
	if (!String.prototype.trim) {
		return function(value) {
			return angular.isString(value) ? value.replace(/^\s\s*/, '')
					.replace(/\s\s*$/, '') : value;
		};
	}
	return function(value) {
		return angular.isString(value) ? value.trim() : value;
	};
})();
