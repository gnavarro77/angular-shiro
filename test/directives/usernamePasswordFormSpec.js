'use strict';

describe('usernamePasswordForm', function() {

	var $scope, $compile, form, subject, loginForm;

	beforeEach(module('angularShiro'));
	beforeEach(module('angularShiro.templates'));

	beforeEach(inject(function($rootScope, _$compile_, _subject_,
			$templateCache) {
		$scope = $rootScope.$new();
		$compile = _$compile_;
		subject = _subject_;
		form = $compile('<username-password-form>')($scope);
		$scope.$apply();

		for ( var cs = $scope.$$childHead; cs; cs = cs.$$nextSibling) {
			if (cs.loginForm) {
				loginForm = cs.loginForm;
			}
		}
	}));

	function findSumitButton() {
		return angular.element(form).find('button');
	}

	function isSubmitDisabled() {
		return 'disabled' == findSumitButton().attr('disabled');
	}

	it('should have submit button disabled initially', function() {
		expect(isSubmitDisabled()).toBeTruthy();
	});

	it('should have submit button if username and password are not empty',
			function() {
				loginForm.username.$setViewValue('edgar');
				loginForm.password.$setViewValue('degas');
				$scope.$digest();
				expect(isSubmitDisabled()).toBeFalsy();
			});

});