'use strict';

var demo = angular
		.module('demo', [ 'angularShiro', 'ngMockE2E' ])
		.run(
				function($httpBackend, $rootScope, subject) {

					$rootScope.subject = subject;

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
							+ "        \"permissions\" : [\"address$view,create,edit,delete\"]\n"
							+ "    }\n" + "  }\n" + "}";

					$httpBackend
							.whenPOST('/api/authenticate',
									'{"token":{"principal":"admin","credentials":"admin"}}')
							.respond(admin);

					var guest = "{\n" + "  \"info\": {\n"
							+ "    \"authc\": {\n"
							+ "      \"principal\": \"edegas\",\n"
							+ "      \"credentials\": {\n"
							+ "        \"name\": \"Edgar Degas\",\n"
							+ "        \"login\": \"edegas\",\n"
							+ "        \"email\": \"edegas@mail.com\"\n"
							+ "      }\n" + "    },\n" + "    \"authz\": {\n"
							+ "        \"roles\" : [\"GUEST\"],\n"
							+ "        \"permissions\" : [\"address$view\"]\n"
							+ "    }\n" + "  }\n" + "}";

					$httpBackend
							.whenPOST('/api/authenticate',
									'{"token":{"principal":"guest","credentials":"guest"}}')
							.respond(guest);

				});

demo
		.controller(
				'DemoCtrl',
				[
						'$scope',
						'$rootScope',
						'$timeout',
						'subject',
						function($scope, $rootScope, $timeout, subject) {

							$scope.entries = [ {
								id : 0,
								firstname : 'Claude',
								lastname : 'Monet',
								address : ' 45 rue Laffitte',
								city : 'Paris'
							}, {
								id : 1,
								lastname : 'C\u00e9zanne',
								firstname : 'Paul',
								address : 'cours Mirabeau',
								city : 'Aix-en-Provence'
							}, {
								id : 2,
								lastname : 'Sisley',
								firstname : 'Alfred',
								address : '19 rue des Trois-Bornes',
								city : 'Paris'
							} ];

							$scope.entry;

							$scope.selectedItem;

							$scope.onItemClicked = function(item) {
								if (subject.isPermitted('address$view')) {
									$scope.selectedItem = item;
									$scope.entry = null;
								}
							};

							$scope.create = function() {
								$scope.selectedItem = null;
								$scope.entry = {};
							}

							$scope.edit = function() {
								$scope.entry = angular
										.copy($scope.selectedItem);
							}

							$scope.saveOrUpdate = function() {
								if ($scope.selectedItem) {
									for ( var i = 0, len = $scope.entries.length; i < len; i++) {
										if ($scope.entries[i].id == $scope.entry.id) {
											$scope.entries[i] = $scope.selectedItem = $scope.entry;
										}
									}
								} else {
									$scope.entries.push($scope.entry);
								}
								$scope.entry = null;
							}

							$scope.success = function(data) {
								// get informed of successful log in
							}

							$scope.error = function(data) {
								// get informed of unsuccessful log in
							}

							$scope.logout = function() {
								subject.logout();
							}

						} ]);