'use strict';

angular.module('angularShiro.directives', [])
.directive('hasRole', hasRoleDirective);

angular.module('angularShiro', [ 'angularShiro.services',
		'angularShiro.directives' ]);