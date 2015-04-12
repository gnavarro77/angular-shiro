'use strict';

describe('Session', function() {

    var session;

    beforeEach(module('angularShiro'));

    beforeEach(function() {
	session = new Session();
    });

    it('should have an id', function() {
	expect(session.getId()).not.toBeNull();
	expect(session.getId()).toBeDefined();
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