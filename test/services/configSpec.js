'use strict';

describe('angularShiroConfig', function() {

	var config, uri = '/my/custom/login/uri';

	beforeEach(module('angularShiro', function(angularShiroConfigProvider) {
		angularShiroConfigProvider.options.login.uri = uri;
	}));

	beforeEach(inject(function(_angularShiroConfig_) {
		config = _angularShiroConfig_;
	}));

	it('should be able to inject custom values', function(angularShiroConfig) {
		expect(config.login.path).toEqual('index');
		expect(config.login.uri).toEqual(uri);
	});

});
