"use strict";
describe(
		'AuthorizationInfo',
		function() {

			var roles = [ 'role1', 'role2', 'role3' ];
			var permissions = [ 'permission1', 'permission2', 'permission3',
					'permission4', 'permission5' ];

			var authorizationInfo = new AuthorizationInfo(roles, permissions);

			it(
					'Should be able to inject roles and permissions through constructor',
					function() {
						expect(authorizationInfo.getRoles()).toEqual(roles);
						expect(authorizationInfo.getPermissions()).toEqual(
								permissions);
					});

			it('Should have one more role after adding a new one', function() {
				var newRole = 'role456';
				var newRoles = roles.slice(0);
				newRoles.push(newRole);
				authorizationInfo.addRole(newRole);
				expect(authorizationInfo.getRoles()).toEqual(newRoles);
			});

			it('Should have two more roles after adding two new ones',
					function() {
						var additionalRoles = [ 'role0504', 'role450' ];
						var newRoles = roles.slice(0);
						newRoles.push.apply(newRoles, additionalRoles);
						authorizationInfo.addRoles(additionalRoles);
						expect(authorizationInfo.getRoles()).toEqual(newRoles);
					});

			it('Should have one more permission after adding a new permission',
					function() {
						var newPermission = 'permission540';
						var newPermissions = permissions.slice(0);
						newPermissions.push(newPermission);
						authorizationInfo.addPermission(newPermission);
						expect(authorizationInfo.getPermissions()).toEqual(
								newPermissions);
					});

			it(
					'Should have two more permissions after adding two new permissions',
					function() {
						var additionalPermissions = [ 'permission50540',
								'permission98704' ];
						var newPermissions = roles.slice(0);
						newPermissions.push.apply(newPermissions,
								additionalPermissions);
						authorizationInfo.addRoles(additionalPermissions);
						expect(authorizationInfo.getRoles()).toEqual(
								newPermissions);
					});
		});