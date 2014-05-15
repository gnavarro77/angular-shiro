"use strict";
describe(
		'Session',
		function() {
			var session = new Session();

			// id
			it('Should getter/setter on id work as expected', function() {
				var myId = 'session0145105640';
				session.setId(myId);
				expect(session.getId()).toEqual(myId);
			});

			// host
			it('getter/setter::host', function() {
				var myHost = 'myHost';
				session.setHost(myHost);
				expect(session.getHost()).toEqual(myHost);
			});

			var timestamp = new Date(2014, 1, 1, 0, 0, 0, 0);
			// startTimestamp
			session.setStartTimestamp(timestamp);
			it('getter/setter::startTimestamp', function() {
				expect(session.getStartTimestamp()).toEqual(timestamp);
			});

			// stopTimestamp
			session.setStopTimestamp(timestamp);
			it('getter/setter::stopTimestamp', function() {
				expect(session.getStopTimestamp()).toEqual(timestamp);
			});

			// lastAccessTime
			session.setLastAccessTime(timestamp);
			it('getter/setter::lastAccessTime', function() {
				expect(session.getLastAccessTime()).toEqual(timestamp);
			});

			// expired
			session.setExpired(true);
			it('getter/setter::expired', function() {
				expect(session.isExpired()).toEqual(true);
			});

			// attribute
			it('test ajout d\'attribut', function() {
				var myAttribute = "attribute";
				var myValue = "value";
				session.setAttribute(myAttribute, myValue);
				expect(session.getAttribute(myAttribute)).toEqual(myValue);
			});

			// timeout
			session.setTimeout(100);
			it('getter/setter::timeout', function() {
				expect(session.getTimeout()).toEqual(100);
			});

			it('if session is expired then session should be timedOut',
					function() {
						session.setExpired(true);
						expect(session.isTimedOut()).toEqual(true);
					});

			it(
					'if session is 500 ms and i call isTimedOut after 1000 ms then session should be timedOut knowing that session has not expired',
					function() {
						session.setExpired(false);
						session.setTimeout(500);
						setTimeout(function() {
							expect(session.isTimedOut()).toEqual(true);
						}, 1000);
					});

			// stop
			it('test stop method', function() {
				session.stop();
				expect(session.isStopped()).toEqual(true);
			});

			// touch
			it('test touch method', function() {
				var now = new Date();
				session.touch();
				var diff = session.getLastAccessTime().getTime()
						- now.getTime();
				expect((diff >= 0)).toEqual(true);
			});
		});
