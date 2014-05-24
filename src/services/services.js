'use strict';

var angularShiroServices = angular.module('angularShiro.services', [])

angularShiroServices.provider('authenticator', authenticatorProvider);
angularShiroServices.factory('subject', [ 'authenticator',
		function(authenticator) {
			return new Subject(authenticator);
		} ]);