'use strict';

describe('authenticator', function() {

    var authenticator, $httpBackend, token;

    beforeEach(module('angularShiro'));

    beforeEach(inject(function(_authenticator_, _$httpBackend_, _usernamePasswordToken_) {
	authenticator = _authenticator_;
	$httpBackend = _$httpBackend_;
	token = _usernamePasswordToken_;
	token.username = 'test';
	token.password = 'test';
    }));

    afterEach(function() {
	$httpBackend.verifyNoOutstandingExpectation();
	$httpBackend.verifyNoOutstandingRequest();
    });

    it('should raise exception if the provided token is missing', function() {
	var except = false;
	try {
	    authenticator.authenticate();
	} catch (exception) {
	    except = true;
	}
	expect(except).toBeTruthy();
    });

    it('should resolve the promise on successful login', function() {
	$httpBackend.whenPOST("/api/authenticate").respond({
	    status : 'success'
	});
	authenticator.authenticate(token).then(function(data) {
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
	authenticator.authenticate(token).then(function(data) {
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

describe('authenticator with invalid configuration', function() {

    beforeEach(module('angularShiro', function(authenticatorProvider) {
	authenticatorProvider.setUri(uri);
    }));

});
//
// describe('authenticator', function() {
//
// var authenticator, $httpBackend, uri = '/another/uri';
//
// beforeEach(module('angularShiro', function(authenticatorProvider) {
// authenticatorProvider.setUri(uri);
// }));
//
// beforeEach(inject(function(_authenticator_, _$httpBackend_) {
// authenticator = _authenticator_;
// $httpBackend = _$httpBackend_;
// }));
//
// it('should be able to configure the authentication uri', function() {
// $httpBackend.whenPOST(uri).respond({
// status : 'success'
// });
//
// authenticator.authenticate().then(function(data) {
// describe('should be successful', function(data) {
// expect(true).toBeTruthy();
// });
// }, function(data) {
// it('should not be rejected', function() {
// expect(true).toBeFalsy();
// });
// });
// $httpBackend.flush();
// });
//
// });
