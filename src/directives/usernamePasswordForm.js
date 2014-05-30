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
var usernamePasswordFormDirective = [
		'subject',
		'usernamePasswordToken',
		'$templateCache',
		function(subject, token, $templateCache) {
			var labels = {
				'field.login.placeholder' : 'login',
				'field.password.placeholder' : 'password',
				'button.submit.label' : 'Connection',
				'connection.denied.message' : 'Username and password do not match'
			};
			return {
				restrict : 'E',
				replace : true,
				templateUrl : 'templates/usernamePasswordForm.html',
				scope : {
					labels : '&',
					onSuccess : '&'

				},
				link : function($scope, $element, $attr) {
					$scope.error = false;
					$scope.token = token;
					$scope.labels = angular.extend($scope.labels, labels);

					$scope.$watch('token.getPrincipal()', function(value) {
						$scope.error = false;
					});

					$scope.$watch('token.getCredentials()', function(value) {
						$scope.error = false;
					});

					$scope.submit = function() {
						subject.login(token).then(function(data) {
							if (angular.isDefined($scope.onSuccess)) {
								$scope.onSuccess({
									data : data
								});
							}
						}, function(data) {
							$scope.error = true;
						});
					}
				}
			};
		} ];