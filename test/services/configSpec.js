'use strict';

describe('angularShiroConfig', function() {

    var config, uri = '/my/custom/login/uri', path = 'custom/path';

    beforeEach(module('angularShiro', function(angularShiroConfigProvider) {
	var opts = angularShiroConfigProvider.options;
	opts.login = {
	    uri : uri,
	    path : path
	}

    }));

    beforeEach(inject(function(_angularShiroConfig_) {
	config = _angularShiroConfig_;
    }));

    it('should be able to inject custom values', function(angularShiroConfig) {
	expect(config.login.uri).toEqual(uri);
	expect(config.login.uri).toEqual(uri);
    });

});
