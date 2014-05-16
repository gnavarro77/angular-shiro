'use strict';

describe('hasRole',	function() {
	var $scope, $compile, element, $subject;
	var ROLE_ADMIN = 'ADMIN';
	var ROLE_GUEST = 'GUEST';
	
	beforeEach(module('angularShiro'));
	
	beforeEach(inject(function($rootScope, _$compile_, _$subject_) {
		$scope = $rootScope.$new();
		$compile = _$compile_;
		$subject = _$subject_;
		element = $compile('<div></div>')($scope);
	}));
	
	function makeHasRole(role) {
	    element.append($compile('<div class="my-class" has-role="' + role + '"><div>Hi</div></div>')($scope));
	    $scope.$apply();
	}
	
	it('should immediately remove element if Subject does not have the specified role', function () {
		$scope.role = ROLE_ADMIN;
	    makeHasRole('role');
		expect(element.children().length).toBe(0);
	});
	
	it('should leave the element if Subject have the specified role', function () {
		$subject.authenticated = true;
		$subject.authorizer = new Authorizer(new AuthorizationInfo([ROLE_ADMIN]));
	    $scope.role = ROLE_ADMIN;
	    makeHasRole('role');
	    expect(element.children().length).toBe(1);
	});
	
	it('should not add the element twice if the role goes from a Subject role to another Subject role', function () {
		$subject.authenticated = true;
		$subject.authorizer = new Authorizer(new AuthorizationInfo([ROLE_ADMIN, ROLE_GUEST]));
		$scope.role = ROLE_ADMIN;
	    makeHasRole('role');
		expect(element.children().length).toBe(1);
		$scope.$apply('role = "' + ROLE_GUEST + '"');
		expect(element.children().length).toBe(1);
	});
	
	it('should not recreate the element if the role goes from a Subject role to another Subject role', function () {
		$subject.authenticated = true;
		$subject.authorizer = new Authorizer(new AuthorizationInfo([ROLE_ADMIN, ROLE_GUEST]));
		$scope.role = ROLE_ADMIN;
	    makeHasRole('role');
		element.children().data('flag', true);
		$scope.$apply('role = "' + ROLE_GUEST + '"');
		expect(element.children().data('flag')).toBeTruthy();
	});

	it('should create then remove the element if condition changes', function () {
		$subject.authenticated = true;
		$subject.authorizer = new Authorizer(new AuthorizationInfo([ROLE_ADMIN, ROLE_GUEST]));
		$scope.role = ROLE_ADMIN;
	    makeHasRole('role');
		expect(element.children().length).toBe(1);
		$scope.$apply('role = "whatever"');
		expect(element.children().length).toBe(0);
	});
	
	
});