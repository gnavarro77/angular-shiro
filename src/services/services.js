/**
 * 
 * 
 */
var angularShiroServices = angular.module('angularShiro.services', [])

/**
 * @ngdoc service
 * @name angularSecurity.services.$authenticator
 * 
 * @description An Authenticator is in charge of the authentication process. The
 *              implements of this Authenticator relies on AngularJS
 * 
 * @requires $q
 * @requires $http
 * @requires $log
 * 
 * 
 */
angularShiroServices.factory('$authenticator',['$q','$http','$log',function($q, $http, $log) {
	return {
		/**
		 * @ngdoc method
		 * @name authenticate
		 * @param {UsernamePasswordToken}
		 *            token authentication token
		 * @methodOf angularSecurity.services.$authenticator
		 * @returns {string} What do I return // return type and
		 *          description
		 */
		authenticate : function(token) {
			if (token == null) {
				throw new IllegalArgumentException('token must not be null');
			}
			var deferred = $q.defer();
			$http.post("authenticate", {
				data : token
			}).success(function(data, status, headers, config) {
				deferred.resolve(data);
			}).error(function(data, status, headers, config) {
				deferred.reject(data);
			});
			return deferred.promise;
		}
	}
} ]);

/**
 * @name $authorizationInfoLoader
 * @desc Instance of AuthorizationInfoLoader. Not supposed to be used directly.
 * @private
 */
angularShiroServices.factory('$authorizationInfoLoader',
		[ '$q', '$http', '$log', function($q, $http, $log) {
			return new AuthorizationInfoLoader($q, $http, $log);
		} ]);

/**
 * @name $subject
 * @desc AngularJS factory instance of Subject available throughout the
 *       application
 * 
 */
angularShiroServices.factory('$subject', ['$authenticator', '$authorizationInfoLoader', function($authenticator, $authorizationInfoLoader) {
							return new Subject($authenticator,
									$authorizationInfoLoader);
						} ]);


/**
 * Return the DOM siblings between the first and last node in the given array.
 * @param {Array} array like object
 * @returns {DOMElement} object containing the elements
 */
function getBlockElements(nodes) {
  var startNode = nodes[0],
      endNode = nodes[nodes.length - 1];
  if (startNode === endNode) {
    return angular.element(startNode);
  }

  var element = startNode;
  var elements = [element];

  do {
    element = element.nextSibling;
    if (!element) break;
    elements.push(element);
  } while (element !== endNode);

  return angular.element(elements);
}