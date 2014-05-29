'use strict';

describe('authenticated', function() {

	var $scope, $compile, element, subject;

	beforeEach(module('angularShiro'));

	beforeEach(inject(function($rootScope, _$compile_, _subject_) {
		$scope = $rootScope.$new();
		$compile = _$compile_;
		subject = _subject_;
		element = $compile('<div></div>')($scope);
	}));

	function makeAuthenticated() {
		element.append($compile(
				'<div class="my-class" authenticated><div>Hi</div></div>')(
				$scope));
		$scope.$apply();
	}

	it('should leave the element if Subject is authenticated', function() {
		subject.authenticated = true;
		makeAuthenticated();
		expect(element.children().length).toBe(1);
	});

	it('should immediately remove element if Subject is not authenticated',
			function() {
				makeAuthenticated();
				expect(element.children().length).toBe(0);
			});

});