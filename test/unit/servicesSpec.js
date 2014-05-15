(function() {

	"use strict";

	describe(
			'Angular Security Service',
			function() {

				var httpBackend;
				var authenticator = null;
				var username = 'test';
				var password = 'test';
				var usernamePasswordToken = new UsernamePasswordToken(username,
						password);
				var authenticationInfo = new AuthenticationInfo('userId#4054',
						[ 'password#05450', 'hashkay#5045004' ]);

				beforeEach(module('angularSecurity'));
				beforeEach(inject(function($injector) {
					httpBackend = $injector.get('$httpBackend');
					authenticator = $injector.get('$authenticator');
					httpBackend.when('POST', 'authenticate').respond(
							authenticationInfo);
				}));

				afterEach(function() {
					httpBackend.verifyNoOutstandingExpectation();
					httpBackend.verifyNoOutstandingRequest();
				});

				it('Shoud be able to get an Authenticator instance',
						function() {
							expect(authenticator).toBeDefined();
						});

				it(
						'Should get an exception when attempting to authenticate with null token',
						function() {
							var exceptionRaised = false;
							try {
								authenticator.authenticate(null);
							} catch (ex) {
								exceptionRaised = (ex instanceof IllegalArgumentException);
							}
							expect(exceptionRaised).toBeTruthy();
						});

				it('Should get a successful authentication', function() {
					authenticator.authenticate(usernamePasswordToken).then(
							function(data) {
								expect(data).toEqual(authenticationInfo);
							});
					httpBackend.flush();
				});

			});

})();