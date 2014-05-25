'use strict';

describe('authenticator', function() {

	var authenticator, $httpBackend;

	beforeEach(module('angularShiro'));

	beforeEach(inject(function(_authenticator_, _$httpBackend_) {
		authenticator = _authenticator_;
		$httpBackend = _$httpBackend_;
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	});

	it('should resolve the promise on successful login', function() {
		$httpBackend.whenPOST("/api/authenticate").respond({
			status : 'success'
		});
		authenticator.authenticate().then(function(data) {
			describe('should be successful', function(data) {
				expect(true).toBeTruthy();
			});
		}, function(data) {
			it('should not be rejected', function() {
				expect(true).toBeFalsy();
			});
		});
		$httpBackend.flush();
	});

	it('should reject the promise on unsuccessful login', function() {
		$httpBackend.whenPOST("/api/authenticate").respond(400, {
			status : 'error'
		});
		authenticator.authenticate().then(function(data) {
			describe('should not be successful', function(data) {
				expect(true).toBeFalsy();
			});
		}, function(data) {
			describe('should be rejected', function() {
				expect(true).toBeTruthy();
			});
		});
		$httpBackend.flush();
	});

});

describe('authenticator', function() {

	var authenticator, $httpBackend, uri = '/another/uri';

	beforeEach(module('angularShiro', function(authenticatorProvider) {
		authenticatorProvider.setUri(uri);
	}));

	beforeEach(inject(function(_authenticator_, _$httpBackend_) {
		authenticator = _authenticator_;
		$httpBackend = _$httpBackend_;
	}));

	it('should be able to configure the authentication uri', function() {
		$httpBackend.whenPOST(uri).respond({
			status : 'success'
		});

		authenticator.authenticate().then(function(data) {
			describe('should be successful', function(data) {
				expect(true).toBeTruthy();
			});
		}, function(data) {
			it('should not be rejected', function() {
				expect(true).toBeFalsy();
			});
		});
		$httpBackend.flush();
	});

});