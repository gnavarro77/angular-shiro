'use strict';

angular.module('angularShiro.services', []).provider('authenticator',
		authenticatorProvider).factory('subject',
		[ 'authenticator', function(authenticator) {
			return new Subject(authenticator);
		} ]).factory('usernamePasswordToken', function() {
	return new UsernamePasswordToken();
}).factory('authenticationInfo', function() {
	return new AuthenticationInfo();
});

angular.module('angularShiro.directives', []).directive('hasRole',
		hasRoleDirective);

angular.module('angularShiro', [ 'angularShiro.services',
		'angularShiro.directives' ]);