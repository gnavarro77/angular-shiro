'use strict';

/**
 * @ngdoc directive
 * @name hasRole
 * @restrict A
 * 
 * @description The `hasRole` directive removes or recreates a portion of the
 *              DOM tree based on the roles of the current Subject/User. If the
 *              current Subject/User hasn't the specified role then the element
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
 * @example <example module="ngAnimate" deps="angular-animate.js"
 *          animations="true"> <file name="index.html"> Click me: <input
 *          type="checkbox" ng-model="checked" ng-init="checked=true" /><br/>
 *          Show when checked: <span ng-if="checked" class="animate-if"> I'm
 *          removed when the checkbox is unchecked. </span> </file> <file
 *          name="animations.css"> .animate-if { background:white; border:1px
 *          solid black; padding:10px; }
 * 
 * .animate-if.ng-enter, .animate-if.ng-leave { -webkit-transition:all
 * cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s; transition:all
 * cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s; }
 * 
 * .animate-if.ng-enter, .animate-if.ng-leave.ng-leave-active { opacity:0; }
 * 
 * .animate-if.ng-leave, .animate-if.ng-enter.ng-enter-active { opacity:1; }
 * </file> </example>
 */
var hasRoleDirective = [ '$subject', function($subject) {
	return {
		transclude : 'element',
		priority : 600,
		terminal : true,
		restrict : 'A',
		replace : true,
		template : '<div ng-transclude></div>',
		link : function($scope, $element, $attr, ctrl, $transclude) {
			if ($subject.hasRole($attr.hasRole)) {
				$transclude($scope, function(clone) {
					$element.append(clone);
				});
			}
		}
	};
} ];