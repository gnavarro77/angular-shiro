'use strict';

/*globals getBlockElements*/

/**
 * @ngdoc directive
 * @name angularShiro.directives.authenticated
 * @restrict A
 * 
 * @description Display its content only if the current Subject has successfully authenticated 
 * 			    during their current session.
 * 
 * @element ANY
 * @scope
 * @priority 600
 * 
 */
var authenticatedDirective = [ 'subject','$animate', function(subject, $animate) {
	return {
		transclude: 'element',
		priority: 600,
		terminal: true,
		restrict: 'A',
		$$tlb: true,
		link: function ($scope, $element, $attr, ctrl, $transclude) {
	        var block, childScope, previousElements;
			$scope.$watch(function(){
            	return subject.authenticated;
            }, function () {
				if (subject.isAuthenticated()) {
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