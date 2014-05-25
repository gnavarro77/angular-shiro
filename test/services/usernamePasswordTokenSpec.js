'use strict';

describe('usernamePasswordToken', function() {

	var token;

	beforeEach(module('angularShiro'));

	beforeEach(inject(function(_usernamePasswordToken_) {
		token = _usernamePasswordToken_;
	}));

	it('should access principal', function() {
		var username = 'username';
		token.username = username;
		expect(token.getPrincipal()).toBe(username);
	});

	it('should access credentials', function() {
		var pwd = 'password';
		token.password = pwd;
		expect(token.getCredentials()).toBe(pwd);
	});

});