'use strict';

angular.module('angularSecurity.directives', []).directive('hasRole',
		hasRoleDirective);

angular.module('angularSecurity', [ 'angularSecurity.services',
		'angularSecurity.directives' ]);
