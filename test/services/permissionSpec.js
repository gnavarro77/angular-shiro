'use strict'

describe('Permission', function() {

	it('should never imply if no wildcard is supplied', function() {
		var p = new Permission();
		expect(p.implies('*')).toBeFalsy();
		p = new Permission(null);
		expect(p.implies('*')).toBeFalsy();
		p = new Permission("");
		expect(p.implies('*')).toBeFalsy();
	});

	it('should imply identical permission', function() {
		var stringPermission = "myPermission";
		var permission01 = new Permission(stringPermission);
		var permission02 = new Permission(stringPermission);

		expect(permission01.implies(permission02)).toBeTruthy();
		expect(permission01.implies(stringPermission)).toBeTruthy();
	});

	it('with wildcard should imply any permission', function() {
		var p = new Permission('*');
		expect(p.implies('any')).toBeTruthy();
	});

	it('should support subparts',
			function() {
				var p = new Permission('newsletter:view,create,edit,delete');
				expect(p.implies('newsletter:view')).toBeTruthy();
				expect(p.implies('newsletter:create')).toBeTruthy();
				expect(p.implies('newsletter:edit')).toBeTruthy();
				expect(p.implies('newsletter:delete')).toBeTruthy();
				expect(p.implies('newsletter:view,create')).toBeTruthy();
				expect(p.implies('newsletter:create,delete')).toBeTruthy();
				expect(p.implies('newsletter:*')).toBeFalsy();
				expect(p.implies('newsletter:whatever')).toBeFalsy();
				expect(p.implies('newsletter:view,create,any,edit,delete'))
						.toBeFalsy();
			});

	it('should support in depth parts', function() {
		var p = new Permission('newsletter:view');
		expect(p.implies('newsletter:view:12')).toBeTruthy();
		expect(p.implies('newsletter:view:*')).toBeTruthy();

		p = new Permission('newsletter:view:*');
		expect(p.implies('newsletter:view:12')).toBeTruthy();

		p = new Permission('newsletter:view:12');
		expect(p.implies('newsletter:view')).toBeFalsy();
		expect(p.implies('newsletter:view:*')).toBeFalsy();
	});

	it('should support wildcard parts', function() {
		var p = new Permission('*:view');
		expect(p.implies('newsletter:view')).toBeTruthy();

		p = new Permission('newsletter:*:*');
		expect(p.implies('newsletter:edit')).toBeTruthy();
		expect(p.implies('newsletter:edit:*')).toBeTruthy();
		expect(p.implies('newsletter:edit:12')).toBeTruthy();
	});

});