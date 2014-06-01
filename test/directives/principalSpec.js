'use strict'

describe('principal', function() {

	var $scope, $compile, element, subject, authenticationResponseParser;

	beforeEach(module('angularShiro'));

	beforeEach(inject(function($rootScope, _$compile_, _subject_,
			_authenticationResponseParser_) {
		$scope = $rootScope.$new();
		$compile = _$compile_;
		subject = _subject_;
		authenticationResponseParser = _authenticationResponseParser_;
	}));

	function buildData(principal) {
		return {
			info : {
				authc : {
					principal : principal,
					credentials : {}
				},
				authz : {
					roles : [],
					permissions : []
				}
			}
		};
	}

	function makePrincipal(principal, property) {
		var infos = authenticationResponseParser.parse(buildData(principal));
		subject.authenticationInfo = infos['authc'];
		subject.authorizer.setAuthorizationInfo(infos['authz']);
		if (angular.isDefined(property)) {
			element = $compile('<principal property="' + property + '">')(
					$scope);
		} else {
			element = $compile('<principal>')($scope);
		}
		$scope.$apply();
	}

//	it('should render string principal', function() {
//		var principal = 'degas';
//		makePrincipal(principal);
//		expect(element.text()).toBe(principal);
//	});
//
//	it('should render object principal as json', function() {
//		var principal = {
//			'name' : 'degas'
//		};
//		makePrincipal(principal);
//		expect(element.text()).toBe(angular.toJson(principal));
//	});

	it('should render principal object property', function() {
		var principal = {
			'name' : 'degas'
		};
		makePrincipal(principal, 'name');
		expect(element.text()).toBe('degas');
	});

});