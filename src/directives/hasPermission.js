'use strict';

/**
 * @ngdoc directive
 * @name angularShiro.directives.hasPermission
 * @restrict A
 * 
 * @description Display its content only if the current `Subject` 'has' (implies) the specified permission.
 * 
 * @element ANY
 * @scope
 * @priority 600
 * @param {string | expression}
 *            hasPermission the permission to check
 */
var hasPermissionDirective = [ 'subject','$animate', function(subject, $animate) {
	return {
		transclude: 'element',
		priority: 600,
		terminal: true,
		restrict: 'A',
		$$tlb: true,
		link: function ($scope, $element, $attr, ctrl, $transclude) {
	        var block, childScope, previousElements;
			$scope.$watch($attr.hasPermission, function (permission) {
				permission = (angular.isUndefined(permission)) ? $attr.hasPermission : permission;
				if (subject.isPermitted(permission)) {
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