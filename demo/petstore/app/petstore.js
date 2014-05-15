/**
 * @module petstore
 */
var petstore = angular.module('petstore', [ 'ngRoute', 'ngGrid',
		'ui.bootstrap', 'ui.bootstrap.tooltip', 'pascalprecht.translate',
		'angularTreeview' ]);

petstore
		.config(function($routeProvider, $locationProvider, $translateProvider) {

			$translateProvider.useStaticFilesLoader({
				prefix : 'app/messages_',
				suffix : '.json'
			});
			$translateProvider.preferredLanguage('en-US');

			/**
			 * 
			 */
			$routeProvider.when('/about', {
				templateUrl : 'app/views/about.html',
				controller : 'AboutCtrl',
			});

			/**
			 * 
			 */
			$routeProvider.when('/owners', {
				templateUrl : 'app/views/owner-manager.html',
				controller : 'OwnerManagerCtrl',
				resolve : {
					treedata : function($q, clinic) {
						var deferred = $q.defer();
						deferred.resolve(clinic.buildOwnerTreeModel());
						return deferred.promise;
					}
				}
			});

			/**
			 * 
			 */
			$routeProvider.when('/vets', {
				templateUrl : 'app/views/vet-manager.html',
				controller : 'VetManagerCtrl',
				resolve : {
					treedata : function($q, clinic) {
						var deferred = $q.defer();
						deferred.resolve(clinic.buildVetTreeModel());
						return deferred.promise;
					}
				}
			});

			/**
			 * 
			 */
			$routeProvider.when('/pets', {
				templateUrl : 'app/views/pet-manager.html',
				controller : 'PetManagerCtrl',
				resolve : {
					treedata : function($q, clinic) {
						var deferred = $q.defer();
						deferred.resolve(clinic.buildVetTreeModel());
						return deferred.promise;
					}
				}
			});

			$routeProvider.otherwise({
				redirectTo : '/about'
			});

		});

petstore.factory('clinic', function() {
	return new Clinic();
})

/**
 * 
 */
petstore.controller('OwnerManagerCtrl', function($scope, clinic, treedata,
		$translate, $log) {
	$scope.treedata = treedata;
	$scope.owner;
	$scope.pet;
	$scope.types = clinic.getPetTypes();
	$scope.title;
	$scope.mode;
	/**
	 * 
	 */
	$scope.dirty = false;

	/**
	 * Save or update the edited owner
	 */
	$scope.saveOrUpdateOwner = function() {
		$log.debug("OwnerManagerCtrl::saveOrUpdateOwner");
		clinic.storeOwner($scope.owner);
		$scope.ownertree.currentNode = null;
		$scope.reset();
		$scope.refresh();
	};

	/**
	 * 
	 */
	$scope.saveOrUpdatePet = function() {
		$log.debug("OwnerManagerCtrl::saveOrUpdatePet");
		clinic.storePet($scope.pet);
		$scope.ownertree.currentNode = null;
		$scope.reset();
		$scope.refresh();
	}

	/**
	 * 
	 */
	$scope.isDirty = function() {
		$log.debug("OwnerManagerCtrl::isDirty => "
				+ JSON.stringify($scope.dirty));
		return $scope.dirty;
	}

	/**
	 * Event listener on selection change
	 */
	$scope.$watch('ownertree.currentNode',
			function(newObj, oldObj) {
				$scope.reset();
				if ($scope.ownertree
						&& angular.isObject($scope.ownertree.currentNode)) {

					$scope.mode = 'edit';
					switch ($scope.ownertree.currentNode.type) {
					case 'owner':
						$scope.owner = clinic
								.loadOwner($scope.ownertree.currentNode.id);
						$scope.title = $translate('ownerProperties.title');
						break;
					case 'pet':
						$scope.pet = clinic
								.loadPet($scope.ownertree.currentNode.id);
						$scope.title = $translate('petProperties.title');
						break;
					}
				}
			}, false);
	/**
	 * 
	 */
	$scope.$watch('owner', function(newObj, oldObj) {
		if (newObj && oldObj && newObj.id == oldObj.id) {
			$scope.dirty = true;
		} else {
			$scope.dirty = false;
		}
	}, true);
	/**
	 * 
	 */
	$scope.$watch('pet', function(newObj, oldObj) {
		$scope.dirty = (newObj && oldObj && newObj.id == oldObj.id);
	}, true);

	/**
	 * 
	 */
	$scope.refresh = function() {
		$scope.treedata = clinic.buildOwnerTreeModel();
	};

	/**
	 * 
	 */
	$scope.reset = function() {
		$log.debug("OwnerManagerCtrl::reset");
		$scope.dirty = false;
		$scope.mode = null;
		$scope.owner = null;
		$scope.pet = null;
	}

});

/**
 * 
 */
petstore.controller('VetManagerCtrl', function($scope, treedata, clinic,
		$translate) {
	$scope.treedata = treedata;
});

/**
 * Controller of the 'Pet Manager' view
 * 
 * @class PetManagerCtrl
 */
petstore.controller('PetManagerCtrl', [ '$scope', function($scope) {

} ]);

/**
 * Controller of the 'About' view
 * 
 * @class AboutCtrl
 */
petstore.controller('AboutCtrl', [ '$scope', function($scope) {
	$scope.roles = roles;
} ]);
