'use strict';

angular.module('angularShiro.services', []).provider('authenticator',
		authenticatorProvider).factory('subject',
		[ 'authenticator', 'authorizer', function(authenticator, authorizer) {
			return new Subject(authenticator, authorizer);
		} ]).factory('usernamePasswordToken', function() {
	return new UsernamePasswordToken();
}).factory('authorizer', function() {
	return new Authorizer();
});

angular.module('angularShiro.directives', []).directive('hasRole',
		hasRoleDirective).directive('notAuthenticated',
		notAuthenticatedDirective).directive('authenticated',
		authenticatedDirective).directive('lacksRole', lacksRoleDirective)
		.directive('hasAnyRole', hasAnyRoleDirective).directive(
				'hasPermission', hasPermissionDirective).directive(
				'lacksPermission', lacksPermissionDirective);

angular.module('angularShiro', [ 'angularShiro.services',
		'angularShiro.directives' ]);