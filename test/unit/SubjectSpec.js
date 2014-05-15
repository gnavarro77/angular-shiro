(function() {

	"use strict";

	describe('Subject', function() {

		var $subject = null;
		var $httpBackend = null;
		var usernamePasswordToken = new UsernamePasswordToken('test', 'test');

		beforeEach(module('angularSecurity'));
		beforeEach(inject(function($injector) {
			$subject = $injector.get('$subject');
			$httpBackend = $injector.get('$httpBackend');
		}));

		it('Should be able to get a Subject instance', function() {
			expect($subject).toBeDefined();
		});

	});

})();