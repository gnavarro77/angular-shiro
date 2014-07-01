'use strict';

/**
 * @ngdoc directive
 * @name angularShiro.directives.hasAnyRole
 * @restrict A
 * 
 * @description Display if the current `Subject` is assigned
 *              any of the specified roles (for example, `'ADMIN'` or `['ADMIN','DEVELOPPER','GUEST']`)
 * 
 * @element ANY
 * @scope
 * @priority 600
 * @param {string | array |
 *            expression} hasAnyRole the specified role names (for example, `'ADMIN'` or `['ADMIN','DEVELOPPER','GUEST']`)
 */
var hasAnyRoleDirective = [ 'subject', '$animate', function(subject, $animate) {
	return {
		transclude : 'element',
		priority : 600,
		terminal : true,
		restrict : 'A',
		$$tlb : true,
		link : function($scope, $element, $attr, ctrl, $transclude) {
			var block, childScope, previousElements;
			$scope.$watch(function(){
            	return subject.authenticated;
            }, function() {
				var roles = $attr.hasAnyRole;
				roles = angular.isArray(roles)?roles:[roles];
				if (subject.hasRoles(roles).indexOf(true) > -1) {
					if (!childScope) {
						childScope = $scope.$new();
						$transclude(childScope, function(clone) {
							block = {
								clone : clone
							};
							$animate.enter(clone, $element.parent(), $element);
						});
					}
				} else {
					if (previousElements) {
						previousElements.remove();
						previousElements = null;
					}
					if (childScope) {
						childScope.$destroy();
						childScope = null;
					}
					if (block) {
						previousElements = getBlockElements(block.clone);
						$animate.leave(previousElements, function() {
							previousElements = null;
						});
						block = null;
					}
				}
			});
		}
	};
} ];