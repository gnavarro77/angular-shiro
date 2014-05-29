'use strict';

/**
 * @ngdoc directive
 * @name angularShiro.directives.usernamePasswordForm
 * @restrict A
 * 
 * @description The <code>notAuthenticated</code> tag will display its wrapped
 *              content if the current Subject has NOT yet successfully
 *              authenticated during the current session.
 * 
 * 
 * @element ANY
 * @scope
 * @priority 600
 * 
 */
var usernamePasswordFormDirective = [ 'subject', 'usernamePasswordToken',
		'$templateCache', function(subject, token, $templateCache) {
			var labels = {
				'field.login.placeholder' : 'login',
				'field.password.placeholder' : 'password',
				'button.submit.label' : 'Connection'
			};
			return {
				restrict : 'E',
				replace : true,
				templateUrl : 'templates/usernamePasswordForm.html',
				scope : {
					labels : '&labels'
				},
				link : function($scope, $element, $attr) {
					$scope.token = token;
					$scope.labels = angular.extend($scope.labels, labels);
					$scope.submit = function() {
						subject.login(token);
					}
				}
			};
		} ];