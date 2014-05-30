'use strict'

describe('authenticationResponseParser', function() {

	var authenticationResponseParser, data;

	beforeEach(module('angularShiro'));

	beforeEach(inject(function(_authenticationResponseParser_) {
		authenticationResponseParser = _authenticationResponseParser_;
		data = {
			info : {
				authc : {
					principal : 'edegas',
					credentials : {
						'name' : 'Edgar Degas'
					}
				},
				authz : {
					roles : [ 'ADMIN', 'DEV' ],
					permissions : [ 'newletter:*', 'book:view' ]
				}
			}
		};
	}));

	function assertParseException(data) {
		var thrown = false;
		try {
			authenticationResponseParser.parse(data);
		} catch (e) {
			thrown = true;
		}
		expect(thrown).toBeTruthy();
	}

	it('should check response structure validity', function() {
		assertParseException();
		assertParseException(null);
		assertParseException('');
		assertParseException({
			info : {}
		});
		assertParseException({
			info : {
				authc : {}
			}
		});
		assertParseException({
			info : {
				authc : {},
				authz : {}
			}
		});

		var thrown = false;
		try {
			authenticationResponseParser.parse(data);
		} catch (e) {
			thrown = true;
		}
		expect(thrown).toBeFalsy();
	});

	it('should parse authc', function() {
		var authc = authenticationResponseParser.parse(data)['authc'];
		expect(authc).toBeDefined();
		expect(authc.getPrincipal()).toEqual('edegas');
		expect(authc.getCredentials().name).toBeDefined();
	});

	it('should parse authz', function() {
		var authz = authenticationResponseParser.parse(data)['authz'];
		expect(authz).toBeDefined();
		expect(authz.getRoles()).toEqual([ 'ADMIN', 'DEV' ]);
		expect(authz.getPermissions()).toEqual([ 'newletter:*', 'book:view' ]);
	});

});