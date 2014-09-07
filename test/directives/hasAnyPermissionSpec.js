'use strict';

describe('hasAnyPermission', function() {
    var $scope, $compile, element, subject;

    var NEWSLETTER_READ = 'newsletter:read';
    var NEWSLETTER_EDIT = 'newsletter:edit';

    beforeEach(module('angularShiro'));

    beforeEach(inject(function($rootScope, _$compile_, _subject_) {
	$scope = $rootScope.$new();
	$compile = _$compile_;
	subject = _subject_;
	element = $compile('<div></div>')($scope);
    }));

    function makeHasAnyRole(permissions) {
	element.append($compile('<div class="my-class" has-any-permission="' + permissions + '"><div>Hi</div></div>')(
		$scope));
	$scope.$apply();
    }

    function assignPermissions(permissions) {
	subject.authenticated = true;
	subject.authorizer.setAuthorizationInfo(new AuthorizationInfo([], permissions));
    }

    it('should immediately remove element if Subject is not authenticated', function() {
	makeHasAnyRole("['newsletter:read']");
	expect(element.children().length).toBe(0);
    });

    it('should immediately remove element if Subject is have none of the specified permissions', function() {
	assignPermissions([ NEWSLETTER_EDIT ]);
	makeHasAnyRole("['" + NEWSLETTER_READ + "']");
	expect(element.children().length).toBe(0);
    });

    it('should leave the element if Subject have any of the specified permissions', function() {
	assignPermissions([ NEWSLETTER_READ ]);
	makeHasAnyRole("['" + NEWSLETTER_READ + "', '" + NEWSLETTER_EDIT + "']");
	expect(element.children().length).toBe(1);

    });

    it('should evaluate permissions specified throught scope', function() {
	$scope.permissions = [ NEWSLETTER_READ, NEWSLETTER_EDIT ];
	assignPermissions([ NEWSLETTER_READ ]);
	makeHasAnyRole('permissions');
	expect(element.children().length).toBe(1);
    });

});