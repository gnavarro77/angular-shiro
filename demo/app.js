'use strict';

var demo = angular
		.module('demo', [ 'angularShiro', 'ngMockE2E' ])
		.run(
				function($httpBackend) {

					var admin = "{\n"
							+ "  \"info\": {\n"
							+ "    \"authc\": {\n"
							+ "      \"principal\": \"edegas\",\n"
							+ "      \"credentials\": {\n"
							+ "        \"name\": \"Edgar Degas\",\n"
							+ "        \"login\": \"edegas\",\n"
							+ "        \"email\": \"edegas@mail.com\"\n"
							+ "      }\n"
							+ "    },\n"
							+ "    \"authz\": {\n"
							+ "        \"roles\" : [\"ADMIN\"],\n"
							+ "        \"permissions\" : [\"address:view,create,edit,delete\"]\n"
							+ "    }\n" + "  }\n" + "}";

					$httpBackend
							.whenPOST('/api/authenticate',
									'{"token":{"principal":"admin","credentials":"admin"}}')
							.respond(admin);

					var guest = '{info : { authc: {}, authz: {}}}';

					$httpBackend
							.whenPOST('/api/authenticate',
									'{"token":{"principal":"guest","credentials":"guest"}}')
							.respond(guest);

				});

demo.controller('DemoCtrl', [ '$scope', '$rootScope', '$timeout', 'subject',
		function($scope, $rootScope, $timeout, subject) {

			$scope.subject = subject;

			$scope.success = function(data) {

				$timeout(function() {
					$scope.$apply();
					$rootScope.$apply();
				}, 0);

			}

		} ]);