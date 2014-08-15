'use strict'

describe('hasPermission', function() {

    var $scope, $compile, element, subject;

    beforeEach(module('angularShiro'));

    beforeEach(inject(function($rootScope, _$compile_, _subject_) {
	$scope = $rootScope.$new();
	$compile = _$compile_;
	subject = _subject_;
	element = $compile('<div></div>')($scope);
    }));

    function makeHasPermission(permission, scope) {
	var p = "'" + permission + "'";
	if (scope) {
	    p = permission;
	}

	element.append($compile('<div class="my-class" has-permission="' + p + '"><div>Hi</div></div>')($scope));
	$scope.$apply();
    }

    function assignPermission(permission) {
	subject.authenticated = true;
	subject.authorizer.setAuthorizationInfo(new AuthorizationInfo([], [ permission ]));
    }

    it('should leave the element if Subject have the specified permission', function() {
	assignPermission('newsletter:*');
	makeHasPermission('newsletter:view');
	expect(element.children().length).toBe(1);
    });

    it('should immediately remove element if Subject does not have the specified role', function() {
	assignPermission('newsletter:*');
	makeHasPermission('whatever');
	expect(element.children().length).toBe(0);
    });

    it('should evaluate permission specified throught scope', function() {
	$scope.permission = 'newsletter:view';
	assignPermission('newsletter:*');
	makeHasPermission('permission', true);
	expect(element.children().length).toBe(1);
    });

});