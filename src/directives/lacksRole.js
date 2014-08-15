'use strict';

/**
 * @ngdoc directive
 * @name angularShiro.directives.lacksRole
 * @restrict A
 * 
 * @description Display if the current Subject is **NOT** assigned the specified
 *              role (for example, `ADMIN`)
 * 
 * @element ANY
 * @scope
 * @priority 600
 * @param {string |
 *            expression} lacksRole the excluded role (for example, `ADMIN`)
 * 
 */
var lacksRoleDirective = [ 'subject', '$animate', function(subject, $animate) {
	return {
		transclude : 'element',
		priority : 600,
		terminal : true,
		restrict : 'A',
		$$tlb : true,
		link : function($scope, $element, $attr, ctrl, $transclude) {
			var block, childScope, previousElements;
			$scope.$watch(function() {
				return subject.authenticated;
			}, function() {
				var role = $attr.lacksRole;
				if (!subject.hasRole(role)) {
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