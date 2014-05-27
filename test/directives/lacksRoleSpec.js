'use strict'

describe(
		'lacksRole',
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

			function makeLacksRole(role) {
				element.append($compile(
						'<div class="my-class" lacks-role="' + role
								+ '"><div>Hi</div></div>')($scope));
				$scope.$apply();
			}

			function assignRole(role) {
				subject.authenticated = true;
				subject.authorizer.setAuthorizationInfo(new AuthorizationInfo(
						[ ADMIN ], []));
			}

			it('should leave the element if Subject lacks the specified role',
					function() {
						assignRole(ADMIN);
						makeLacksRole(GUEST);
						expect(element.children().length).toBe(1);
					});

			it(
					'should immediately remove element if Subject does not have the specified role',
					function() {
						assignRole(ADMIN);
						makeLacksRole(ADMIN);
						expect(element.children().length).toBe(0);
					});

			it('should evaluate role specified throught scope', function() {
				assignRole(ADMIN);
				$scope.role = GUEST;
				makeLacksRole('role');
				expect(element.children().length).toBe(1);
			});
		});