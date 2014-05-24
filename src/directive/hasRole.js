'use strict';

/**
 * @ngdoc directive
 * @name hasRole
 * @restrict A
 * 
 * @description The `hasRole` directive removes or recreates a portion of the
 *              DOM tree based on the roles of the current Subject/User. If the
 *              current Subject/User does not have the specified role then the element
 *              is removed from the DOM, otherwise a clone of the element is
 *              reinserted into the DOM.
 * 
 * 
 * @element ANY
 * @scope
 * @priority 600
 * @param {role}
 *            hasRole If the {@link Subject Subject/USer} does not have the
 *            specified role then the element is removed from the DOM tree,
 *            otherwise a copy of the compiled element is added to the DOM tree.
 * 
 */
var hasRoleDirective = [ '$subject','$animate','$interpolate', function($subject, $animate, $interpolate) {
	return {
		transclude: 'element',
		priority: 600,
		terminal: true,
		restrict: 'A',
		$$tlb: true,
		link: function ($scope, $element, $attr, ctrl, $transclude) {
	        var block, childScope, previousElements;
			$scope.$watch($attr.hasRole, function hasRoleWatchAction(role) {
				console.log('*** role =>' + role);
				if ($subject.hasRole(role)) {
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