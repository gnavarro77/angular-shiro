'use strict';

describe('Session', function() {

    var session;

    beforeEach(module('angularShiro'));

    beforeEach(function() {
	session = new Session();
    });

    it('should have a starttime', function() {
	expect(session.getStartTimestamp()).not.toBeNull();
	expect(session.getStartTimestamp()).toBeDefined();
	expect(session.getStartTimestamp() instanceof Date).toBeTruthy();
    });

    it('should set and get attribute', function() {
	var key = 'myKey';
	var value = 'aValue';
	session.setAttribute(key, value);
	expect(session.getAttribute(key)).toEqual(value);
    });

    it('should replace old value when setting same key twice', function() {
	var key = 'myKey';
	var aValue = 'aValue';
	var anotherValue = 'anotherValue';
	session.setAttribute(key, aValue);
	session.setAttribute(key, anotherValue);
	expect(session.getAttribute(key)).toEqual(anotherValue);
    });

    it('should remove attribute', function() {
	var key = 'myKey';
	var aValue = 'aValue';
	session.setAttribute(key, aValue);
	expect(session.getAttributeKeys()).toContain(key);
	session.removeAttribute(key);
	expect(session.getAttributeKeys()).not.toContain(key);
    });

    it('should expire', function(done) {
	var timeout = 500;
	session.setTimeout(timeout);
	setTimeout(function() {
	    expect(session.isTimedOut()).toBeTruthy();
	    done();
	}, 2 * timeout);
    });

    it('should throw exception when validating a stopped session', function() {
	session.stop();
	var validate = function() {
	    session.validate();
	}
	expect(validate).toThrow();
    });

    it('should throw exception when validating an expired session', function() {
	var timeout = 500;
	session.setTimeout(timeout);
	setTimeout(function() {
	    var validate = function() {
		session.validate();
	    }
	    expect(validate).toThrow();
	    done();
	}, 2 * timeout);
    });

});

describe('SessionDAO', function() {

    var sessionDAO;
    var sessionId;

    beforeEach(module('angularShiro'));

    beforeEach(function() {
	sessionDAO = new SessionDAO();
    });

    it('should create the session', function() {
	var session = new Session();
	sessionId = sessionDAO.create(session);
	expect(session.getId()).not.toBeNull();
	expect(session.getId()).toBeDefined();
	expect(session.getId()).toBe(sessionId);

    });

    it('should read the session', function() {
	var session = new Session();
	var token = new UsernamePasswordToken('username','password',true);
	session.setAttribute('token',token.serialize());
	sessionId = sessionDAO.create(session);
	session = sessionDAO.readSession(sessionId);
	expect(session instanceof Session).toBeTruthy();
	expect(session).toBeDefined();
	expect(session.getAttribute('token')).toBe('{"username":"username","password":"password","rememberMe":true}');
    });

    it('should delete session', function() {
	var session = new Session();
	var id = sessionDAO.create(session);
	sessionDAO.delete(session);
	expect(sessionDAO.readSession(id)).toBeNull();
    });

});