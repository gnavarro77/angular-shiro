(function() {

	"use strict";
	describe('AuthorizationInfoLoader', function() {
		var $httpBackend, $authorizationInfoLoader;

		beforeEach(module('angularSecurity'));
		beforeEach(inject(function($injector) {
			$httpBackend = $injector.get('$httpBackend');

			AngularSecurityDirectiveTestHelper
					.setupAuthorizationInfo($httpBackend);

			$authorizationInfoLoader = $injector
					.get('$authorizationInfoLoader');

		}));

		afterEach(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		});

		it('Should be able to get an AuthorizationInfoLoader loader instance',
				function() {
					expect($authorizationInfoLoader).not.toBeNull();
					expect($authorizationInfoLoader).toBeDefined();
				});

		it('Should receive authorization data', function() {
			var principal = AngularSecurityDirectiveTestHelper.getPrincipal();
			var promise = $authorizationInfoLoader
					.getAuthorizationInfo(principal);
			expect(promise).not.toBeNull();
			promise.then(function(data) {
				expect(data).toEqual(
						AngularSecurityDirectiveTestHelper
								.getAuthorizationInfo());
			});
			$httpBackend.flush();
		});

	});

})();