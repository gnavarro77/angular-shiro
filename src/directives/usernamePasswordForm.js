'use strict';

/**
 * @ngdoc directive
 * @name angularShiro.directives.usernamePasswordForm
 * @restrict E
 * 
 * @description The <code>usernamePasswordForm</code> directive will display a
 *              simple <code>username / password</code> form with built-in
 *              integration with `angular-shiro` authentication mechanism.
 *  #Style
 *  
 *  Form markup is based on latest {@link http://getbootstrap.com/css/#forms Bootstrap form documentation}
 *               
 *               
 *  # Default labels
 * 
 * <pre>
 * {
 * 	'field.login.placeholder' : 'login',
 * 	'field.password.placeholder' : 'password',
 * 	'button.submit.label' : 'Connection',
 * 	'connection.denied.message' : 'Username and password do not match'
 * }
 * </pre>
 * 
 * 
 * 
 * @element ANY
 * @scope
 * @priority 600
 * 
 * @param {object=}
 *            labels custom labels
 * @param {expression=}
 *            onSuccess Expression to evaluate upon
 *            successful authentication
 * @param {expression=}
 *            onError Expression to evaluate upon
 *            authentication failure
 *            
 * @example
<example module="angularShiro"> 
	<file name="index.html"> 
		<div ng-controller="Ctrl">
			<username-password-form
			 	labels="{{myLabels}}"
				on-error="error()">
		</div> 
	</file>
	<file name="app.js">
	function Ctrl($scope) {
		
		$scope.myLabels = {
			'field.login.placeholder' : 'email',
			'button.submit.label' : 'Login'
		};
	
		$scope.error = function() {
			alert('An error occured!');
		}
	}
	</file>
</example>	
 */
var usernamePasswordFormDirective = [
		'subject',
		'usernamePasswordToken',
		function(subject, token) {
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
					onSuccess : '&',
					onError : '&'
				},
				link : function($scope, $element, $attr) {
					$scope.error = false;
					$scope.token = token;
					
					if (angular.isDefined($attr.labels)) {
						$scope.labels = angular.extend(labels, angular.fromJson($attr.labels));
					} else {
						$scope.labels = labels;
					}

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
							token.username = token.password = null;
						}, function(data) {
							$scope.error = true;
							if (angular.isDefined($scope.onError)) {
								$scope.onError({
									data : data
								});
							}
						});
					}
				}
			};
		} ];