'use strict';

function ngIfWatchAction(value, $scope, $element, $attr, ctrl, $transclude,
		$animate) {
	if (value) {
//		childScope = $scope.$new();
		$transclude($scope, function(clone) {
			console.log('clone ......... ' + clone[0].innerHTML);
			console.log('$element ......... ' + $element[0]);
			console.log('$element.parent() ' + $element.parent());
			console.log('$animate ' + $animate);
			$element.after(clone);
		});
	}
};

function AngularSecurityDirectiveTestHelper() {
			/**
			 * Return a test authentication token
			 * 
			 * @returns
			 */
			this.getAuthenticationToken = function() {
				return new UsernamePasswordToken('test', 'test');
			},
			/**
			 * Returns the principal used for the tests
			 */
			this.getPrincipal = function() {
				return "principal#test";
			},
			/**
			 * 
			 */
			this.getAuthenticationInfo = function() {
				console
						.log("getAuthenticationInfo getAuthenticationInfogetAuthentication");
				return new AuthenticationInfo(this.getPrincipal(), []);
			}
	/**
	 * Setup authentication
	 */
	this.setupAuthentication = function($httpBackend) {
		$httpBackend.when('POST', 'authenticate').respond(200,
				this.getAuthenticationInfo());
		return this;
	}
	/**
	 * Setup the http backend to send back the test authorization info
	 */
			this.setupAuthorizationInfo = function($httpBackend) {
				var uri = 'users/' + this.getPrincipal() + '/authorizations';
				$httpBackend.when('GET', uri).respond(200,
						this.getAuthorizationInfo());
				return this;
			},
			/**
			 * Returns the {@link AuthorizationInfo AuthorizationInfo}
			 * 
			 * @return
			 */
			this.getAuthorizationInfo = function() {
				return new AuthorizationInfo(this.getRoles(), this
						.getPermissions());
			}

	/**
	 * 
	 */
	this.ADMIN_ROLE = 'ADMIN';
	/**
	 * 
	 */
	this.ANONYMOUS_ROLE = 'ANONYMOUS';

	/**
	 * Returns the roles
	 */
	this.getRoles = function() {
		return [ this.ANONYMOUS_ROLE, this.ADMIN_ROLE ];
	}
	/**
	 * Returns the permissions
	 * 
	 * @return
	 */
	this.getPermissions = function() {
		return [ '*:create', '*:read', '*:update', '*:delete', 'user:create',
				'user:read', 'user:update', 'user:delete' ]
	}

};

var AngularSecurityDirectiveTestHelper = new AngularSecurityDirectiveTestHelper();