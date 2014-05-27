'use strict';

describe(
		'hasRole',
		function() {
			var $scope, $compile, element, subject;
			
			var ADMIN = 'ADMIN';
			var GUEST = 'GUEST';

			beforeEach(module('angularShiro'));

			beforeEach(inject(function($rootScope, _$compile_, _subject_) {
				$scope = $rootScope.$new();
				$compile = _$compile_;
				subject = _subject_;
				element = $compile('<div></div>')($scope);
			}));

			function makeHasRole(role) {
				element.append($compile(
						'<div class="my-class" has-role="' + role
								+ '"><div>Hi</div></div>')($scope));
				$scope.$apply();
			}

			function assignRole(role) {
				subject.authenticated = true;
				subject.authorizer.setAuthorizationInfo(new AuthorizationInfo(
						[ ADMIN ], []));
			}

			it(
					'should immediately remove element if Subject does not have the specified role',
					function() {
						makeHasRole(ADMIN);
						expect(element.children().length).toBe(0);
					});

			it('should leave the element if Subject have the specified role',
					function() {
						assignRole(ADMIN);
						makeHasRole(ADMIN);
						expect(element.children().length).toBe(1);
					});

			it('should evaluate role specified throught scope', function() {
				$scope.role = GUEST;
				assignRole(ADMIN);
				makeHasRole('role');
				expect(element.children().length).toBe(0);
			});

			// it(
			// 'should not add the element twice if the role goes from a Subject
			// role to another Subject role',
			// function() {
			// subject.authenticated = true;
			// subject.authorizer = new Authorizer(new
			// AuthorizationInfo([ADMIN, GUEST]));
			// $scope.role = ADMIN;
			// makeHasRole('role');
			// expect(element.children().length).toBe(1);
			// $scope.$apply('role = "' + GUEST + '"');
			// expect(element.children().length).toBe(1);
			// });

			// it(
			// 'should not recreate the element if the role goes from a Subject
			// role to another Subject role',
			// function() {
			// subject.authenticated = true;
			// subject.authorizer = new Authorizer(new
			// AuthorizationInfo([ADMIN, GUEST]));
			// $scope.role = ADMIN;
			// makeHasRole('role');
			// element.children().data('flag', true);
			// $scope.$apply('role = "' + GUEST + '"');
			// expect(element.children().data('flag')).toBeTruthy();
			// });

			// it('should create then remove the element if condition changes',
			// function() {
			// subject.authenticated = true;
			// subject.authorizer = new Authorizer(new
			// AuthorizationInfo([ADMIN, GUEST]));
			// $scope.role = ADMIN;
			// makeHasRole('role');
			// expect(element.children().length).toBe(1);
			// $scope.$apply('role = "whatever"');
			// expect(element.children().length).toBe(0);
			// });

		});