"use strict";
describe(
		'Authorizer',
		function() {
			var UNKNOW = 'unknown';
			var role01 = "role01";
			var role02 = "role02";
			var roles = [ role01, role02 ];
			var permission01 = "permission01";
			var permission02 = "permission02";
			var permissions = [ permission01, permission02, 'permission03',
					'permission04', 'permission05' ];
			var authorizationInfo = new AuthorizationInfo(roles, permissions);
			var authorizer = new Authorizer(authorizationInfo);

			it(
					'Should get an IllegalArgumentException trying to instantiate an Authorizer with a null or undefined AuthorizationInfo',
					function() {
						var exceptionRaised = false;
						try {
							var authz = new Authorizer();
						} catch (ex) {
							exceptionRaised = (ex instanceof IllegalArgumentException);
						}
						expect(exceptionRaised).toBeTruthy();

						exceptionRaised = false;
						try {
							var authz = new Authorizer(null);
						} catch (ex) {
							exceptionRaised = (ex instanceof IllegalArgumentException);
						}
						expect(exceptionRaised).toBeTruthy();
					});

			it('method isPermitted should work as expected', function() {
				expect(authorizer.isPermitted()).toBeFalsy();
				expect(authorizer.isPermitted(null)).toBeFalsy();
				expect(authorizer.isPermitted(UNKNOW)).toBeFalsy();
				expect(authorizer.isPermitted(permission01)).toBeTruthy();
			});

			it('method isPermittedAll should work as expected', function() {
				expect(authorizer.isPermittedAll(null)).toBeFalsy();
				expect(authorizer.isPermittedAll([])).toBeFalsy();
				expect(authorizer.isPermittedAll([ UNKNOW ])).toBeFalsy();
				expect(authorizer.isPermittedAll([ permission02 ]))
						.toBeTruthy();
				expect(authorizer.isPermittedAll([ permission02, UNKNOW ]))
						.toBeFalsy();
			});

			it('method hasRole should work as expected', function() {
				expect(authorizer.hasRole(role01)).toBeTruthy();
				expect(authorizer.hasRole(UNKNOW)).toBeFalsy();
			});

			it('method hasRoles should work as expected', function() {
				expect(authorizer.hasRoles(null)).toEqual([]);
				expect(authorizer.hasRoles([])).toEqual([]);
				expect(authorizer.hasRoles([ role01 ])).toEqual([ true ]);
				expect(authorizer.hasRoles([ role01, role02 ])).toEqual(
						[ true, true ]);
				expect(authorizer.hasRoles([ role01, 'unknow', role02 ]))
						.toEqual([ true, false, true ]);

			});

		});