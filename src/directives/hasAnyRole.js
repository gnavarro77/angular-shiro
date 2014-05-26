'use strict';

/**
 * @ngdoc directive
 * @name angularShiro.directives.hasAnyRole
 * @restrict A
 * 
 * @description Display its wrapped content if the current `Subject` is assigned any of the specified 
 * 			roles from a comma-delimited list of role names.
 * 
 * @element ANY
 * @scope
 * @priority 600
 * @param {string | expression}
 *            hasAnyRole the specified role names
 */
var hasAnyRoleDirective = [ 'subject','$animate', function(subject, $animate) {
	return {
		transclude: 'element',
		priority: 600,
		terminal: true,
		restrict: 'A',
		$$tlb: true,
		link: function ($scope, $element, $attr, ctrl, $transclude) {
	        var block, childScope, previousElements;
			$scope.$watch($attr.hasRole, function hasRoleWatchAction(role) {
				role = (angular.isUndefined(role)) ? $attr.hasRole : role;
				if (!subject.hasRole(role)) {
					if (!childScope) {
					  childScope = $scope.$new();
					  $transclude(childScope, function (clone) {
						block = {
						  clone: clone
						};
						$animate.enter(clone, $element.parent(), $element);
					  });
					}
				} else {
		            if(previousElements) {
		              previousElements.remove();
		              previousElements = null;
		            }
		            if(childScope) {
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