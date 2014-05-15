(function() {

	"use strict";

	describe(
			'Permission',
			function() {

				it(
						'Should get an exception trying to instantiate a Permission with null or undefined wildcardString',
						function() {
							var exceptionRaised = false;
							try {
								new Permission();
							} catch (ex) {
								exceptionRaised = (ex instanceof IllegalArgumentException);
							}
							expect(exceptionRaised).toBeTruthy();

							exceptionRaised = false;
							try {
								new Permission(null);
							} catch (ex) {
								exceptionRaised = (ex instanceof IllegalArgumentException);
							}
							expect(exceptionRaised).toBeTruthy();
						});

				it('Should be able to have a simple usage of permissions',
						function() {
							var p = new Permission('editNewsletter');
							var p2 = new Permission('editNewsletter');
							expect(p.implies(p2)).toBeTruthy();
							var p3 = new Permission('*');
							expect(p3.implies(p)).toBeTruthy();
							expect(p.implies(p3)).toBeFalsy();
						});

				it(
						'\'newsletter:view,create,edit,delete\' should imply permission \'newsletter:view,delete\'',
						function() {
							var p = new Permission(
									'newsletter:view,create,edit,delete');
							var p2 = new Permission('newsletter:view');
							expect(p.implies(p2)).toBeTruthy();
						});

				it(
						'\'newsletter:view,create,edit,delete\' should not imply permission \'newsletter:view,remove\'',
						function() {
							var p = new Permission(
									'newsletter:view,create,edit,delete');
							var p2 = new Permission('newsletter:view,remove');
							expect(p.implies(p2)).toBeFalsy();
						});

				it(
						'\'newsletter:view\' should imply permission \'newsletter:view:12\'',
						function() {
							expect(
									new Permission('newsletter:view')
											.implies(new Permission(
													'newsletter:view:12')))
									.toBeTruthy();
						});
				it(
						'\'newsletter:view:12\' should not imply permission \'newsletter:view\'',
						function() {
							expect(
									new Permission('newsletter:view:12')
											.implies(new Permission(
													'newsletter:view')))
									.toBeFalsy();
						});
				it('\'*:view\' should imply permission \'newsletter:view\'',
						function() {
							var p = new Permission('*:view');
							var p2 = new Permission('newsletter:view');
							expect(p.implies(p2)).toBeTruthy();
						});

				it('\newsletter:*:*\' should imply \'newsletter:edit:12',
						function() {
							var p = new Permission('newsletter:*:*');
							var p2 = new Permission('newsletter:edit:12');
							expect(p.implies(p2)).toBeTruthy();
						});

				it('\*\' should imply any permission', function() {
					var p = new Permission('*');
					expect(p.implies(new Permission('newsletter')))
							.toBeTruthy();
					expect(p.implies(new Permission('newsletter:edit')))
							.toBeTruthy();
				});

				it('Should be able to resolve parts', function() {
					var p = new Permission('whatever');

					expect(p.resolveParts('editNewsletter', true)).toEqual(
							[ [ 'editNewsletter' ] ]);

					expect(p.resolveParts('editNewsletter', false)).toEqual(
							[ [ 'editnewsletter' ] ]);

					expect(p.resolveParts('newsletter:edit')).toEqual(
							[ [ 'newsletter' ], [ 'edit' ] ]);
					expect(p.resolveParts('newsletter:view,edit,create'))
							.toEqual(
									[ [ 'newsletter' ],
											[ 'view', 'edit', 'create' ] ]);

					expect(p.resolveParts('newsletter:edit:12,13,18')).toEqual(
							[ [ 'newsletter' ], [ 'edit' ],
									[ '12', '13', '18' ] ]);
				});

			});

})();