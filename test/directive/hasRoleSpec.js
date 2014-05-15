'use strict';

describe(
		'hasRole',
		function() {
			var $scope, $compile, element, $subject, $httpBackend;

			beforeEach(module('angularSecurity'));

			beforeEach(inject(function($rootScope, _$compile_, $injector) {
				$scope = $rootScope.$new();
				$compile = _$compile_;
				$subject = $injector.get('$subject');
				$httpBackend = $injector.get('$httpBackend');

				AngularSecurityDirectiveTestHelper.setupAuthentication(
						$httpBackend).setupAuthorizationInfo($httpBackend);
			}));

			afterEach(function() {
				$httpBackend.verifyNoOutstandingExpectation();
				$httpBackend.verifyNoOutstandingRequest();
			});

			function makeHasRole(role) {
				element = $compile(
						'<div has-role="' + role + '"><div>Hi</div></div>')(
						$scope);
				$scope.$apply();
			}

			it(
					'should immediately remove element if Subject/User is not authenticated',
					function() {
						makeHasRole('ADMIN');
						console.log('children ' + element.children().length);
						expect(element.children().length).toBe(0);
					});

			it(
					'should leave the element if the Subject.User is authenticated and has the specified role',
					function() {
						var token = AngularSecurityDirectiveTestHelper
								.getAuthenticationToken();
						$subject.login(token);
						$httpBackend.flush();
						makeHasRole(AngularSecurityDirectiveTestHelper.ADMIN_ROLE);
						expect(element.children().length).toBe(1);
					});

		});