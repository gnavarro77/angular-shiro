'use strict';

describe('angularShiroConfig', function() {

	var config, uri = '/my/custom/login/uri', path = "/myPath";

	var findPathFilter = function(path, urls) {
		var obj = null;
		for (var i = 0; i < urls.length; i++) {
			var url = urls[i];
			var p = Object.keys(url)[0];
			if (p === path) {
				obj = url;
				break;
			}
		}
		return obj;
	};

	beforeEach(module('angularShiro', function(angularShiroConfigProvider) {
		angularShiroConfigProvider.options.login.uri = uri;
		var filterChain = "filter01, filter02";
		angularShiroConfigProvider.registerPathFilter(path, filterChain);
		angularShiroConfigProvider.registerPathFilter('/login', 'filter');
	}));

	beforeEach(inject(function(_angularShiroConfig_) {
		config = _angularShiroConfig_;
	}));

	it('should be able to inject custom values', function() {
		expect(config.login.path).toEqual('index');
		expect(config.login.uri).toEqual(uri);
	});

	it('should override default declaration', function() {
		var url = findPathFilter('/login', config.urls);
		expect(url[Object.keys(url)[0]]).toEqual('filter');
	});

	it('should be able to register a filter path', function() {
		var urls = config.urls;
		var found = false;
		for (var i = 0; i < urls.length; i++) {
			var url = urls[i];
			if (angular.isDefined(url[path])) {
				found = true;
				break;
			}
		}
		expect(found).toBeTruthy();
		// new registered path are added to the end
		expect(i).toBeGreaterThan(5);
	});

});
