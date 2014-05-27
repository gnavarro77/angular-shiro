'use strict'

describe(
		'authorizer',
		function() {

			var authorizer, ADMIN = 'ADMIN', GUEST = 'GUEST', ANY_OTHER_ROLE = 'ANY', newsletter = 'newsletter$view,create,edit,delete';

			beforeEach(module('angularShiro'));

			beforeEach(inject(function(_authorizer_) {
				authorizer = _authorizer_;
				authorizer.setAuthorizationInfo(new AuthorizationInfo([ ADMIN,
						GUEST ], [ newsletter ]));
			}));

			it('should tell if has role', function() {
				expect(authorizer.hasRole(ADMIN)).toBeTruthy();
				expect(authorizer.hasRole(ANY_OTHER_ROLE)).toBeFalsy();
			});

			it('should tell if has roles', function() {
				expect(authorizer.hasRoles([ ADMIN, ANY_OTHER_ROLE, GUEST ]))
						.toEqual([ true, false, true ]);
			});

			it('should tell if has all roles',
					function() {
						expect(
								authorizer.hasAllRoles([ ADMIN, ANY_OTHER_ROLE,
										GUEST ])).toBeFalsy();
						expect(authorizer.hasAllRoles([ ADMIN ])).toBeTruthy();
						expect(authorizer.hasAllRoles([ ADMIN, GUEST ]))
								.toBeTruthy();
					});

			it('should tell if is permitted', function() {
				expect(authorizer.isPermitted('any')).toBeFalsy();
				expect(authorizer.isPermitted(new Permission('any')))
						.toBeFalsy();
				expect(authorizer.isPermitted('newsletter')).toBeFalsy();
				expect(authorizer.isPermitted('newsletter$view')).toBeTruthy();
				expect(
						authorizer.isPermitted([ 'newsletter$delete', 'any',
								'newsletter$edit' ])).toEqual(
						[ true, false, true ]);
			});

			it('should tell if is all permitted', function() {
				expect(
						authorizer.isPermittedAll([ 'newsletter$delete', 'any',
								'newsletter$edit' ])).toBeFalsy();
				expect(
						authorizer.isPermittedAll([ 'newsletter$delete',
								'newsletter$edit', 'newsletter$delete,edit' ]))
						.toBeTruthy();
			});

		});