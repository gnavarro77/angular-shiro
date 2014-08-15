'use strict'

describe('pathMatcher', function() {

    var matcher;

    beforeEach(function() {
	matcher = new PathMatcher();
    });

    it('should match', function() {
	var pattern = 'com/t?st.jsp';
	expect(matcher.match(pattern, 'com/test.jsp')).toBeTruthy();
	expect(matcher.match(pattern, 'com/tast.jsp')).toBeTruthy();
	expect(matcher.match(pattern, 'com/txst.jsp')).toBeTruthy();

	pattern = 'com/*.jsp';
	expect(matcher.match(pattern, 'com/test.jsp')).toBeTruthy();

	pattern = 'com/**/test.jsp';
	expect(matcher.match(pattern, 'com/test.jsp')).toBeTruthy();
	expect(matcher.match(pattern, 'com/subdir/test.jsp')).toBeTruthy();

	pattern = 'com/**/*.txt';
	expect(matcher.match(pattern, 'com/test.txt')).toBeTruthy();
	expect(matcher.match(pattern, 'com/subdir/test.txt')).toBeTruthy();

	pattern = 'org/**/servlet/bla.jsp';
	expect(matcher.match(pattern, 'org/springframework/servlet/bla.jsp')).toBeTruthy();
	expect(matcher.match(pattern, 'org/springframework/testing/servlet/bla.jsp')).toBeTruthy();
	expect(matcher.match(pattern, 'org/servlet/bla.jsp')).toBeTruthy();
    });

});

describe('FiltersResolver', function() {

    var resolver;

    beforeEach(module('angularShiro', function(angularShiroConfigProvider) {
	var urls = angularShiroConfigProvider.options.urls;
	urls['/chain'] = 'anon, authc';
	urls['/perms'] = 'perms["newsletter:edit"]';
	urls['/roles'] = 'roles["ADMIN"]';
    }));

    beforeEach(inject(function(_filtersResolver_) {
	resolver = _filtersResolver_;
    }));

    it('should resolve filter name', function() {
	expect(resolver.resolveFilterName('anon')).toEqual('anon');
	expect(resolver.resolveFilterName('authc')).toEqual('authc');
	expect(resolver.resolveFilterName('perms["newsletter$read", "newsletter$edit"]')).toEqual('perms');
	expect(resolver.resolveFilterName('roles["ADMIN", "GUEST"]')).toEqual('roles');
    });

    it('should resolve filter args', function() {
	expect(resolver.resolveFilterArgs('anon')).toEqual(null);
	expect(resolver.resolveFilterArgs('authc')).toEqual(null);
	expect(resolver.resolveFilterArgs('perms[newsletter$read, newsletter$edit]')).toEqual(
		[ "newsletter$read", "newsletter$edit" ]);
	expect(resolver.resolveFilterArgs('roles[ADMIN, GUEST]')).toEqual([ 'ADMIN', "GUEST" ]);
    });

    it('should resolve default string filters', function() {
	expect(resolver.resolveStringFilters('/index')).toEqual('anon');
	expect(resolver.resolveStringFilters('/login')).toEqual('anon');
	expect(resolver.resolveStringFilters('/signin')).toEqual('anon');
    });

    it('should resolve filters', function() {
	var filters = resolver.resolve('/index');
	expect(filters.length).toBe(1);
    });

    it('should resolve chained filters', function() {
	var filters = resolver.resolve('/chain');
	expect(filters.length).toBe(2);
    });

});

describe('formAuthenticationFilter', function() {

    var authc, config, $location, $timeout, loginUrl;

    beforeEach(module('angularShiro'));

    beforeEach(inject(function(_authc_, _angularShiroConfig_, _$timeout_, _$location_) {
	authc = _authc_;
	config = _angularShiroConfig_;
	$location = _$location_;
	$timeout = _$timeout_;
	loginUrl = config.login.path;
    }));

    it('should allow access to authenticated Subject', inject(function(subject) {
	subject.authenticated = true;
	var out = authc.execute();
	expect(out).toBeTruthy();
	expect($location.path()).toEqual('');
    }));

    it('should deny access to unauthenticated Subject', function() {
	var out = authc.execute();
	$timeout.flush();
	expect(out).toBeFalsy();
	expect($location.path()).toEqual(loginUrl);
    });
});

describe('logoutFilter', function() {

    beforeEach(module('angularShiro'));

    it('should be unauthenticated after execution', inject(function(subject, logout, $location) {
	subject.authenticated = true;
	logout.execute('/logout');
	expect(subject.isAuthenticated()).toBeFalsy();
	expect($location.path()).toEqual('/');
    }));

});

describe('permsFilter', function() {

    var subject, config, perms, $location, permission = 'newsletter$edit', $timeout, loginUrl;

    beforeEach(module('angularShiro'));

    beforeEach(inject(function(_subject_, _angularShiroConfig_, _perms_, _$timeout_, _$location_) {
	perms = _perms_;
	subject = _subject_;
	$location = _$location_;
	$timeout = _$timeout_;
	config = _angularShiroConfig_;
	loginUrl = config.login.path;
    }));

    it('should deny access if not permitted', function() {
	var out = perms.execute([ permission ]);
	$timeout.flush();
	expect(out).toBeFalsy();
	expect($location.path()).toEqual(loginUrl);
    });

    it('should allow access if permitted', function() {
	subject.authenticated = true;
	subject.authorizer.setAuthorizationInfo(new AuthorizationInfo([], [ permission ]));
	var out = perms.execute([ permission ]);
	expect(out).toBeTruthy();
	expect($location.path()).toEqual('');
    });

});

describe('rolesFilter', function() {
    var subject, config, roles, $location, role = 'ADMIN', $timeout, loginUrl;

    beforeEach(module('angularShiro'));

    beforeEach(inject(function(_subject_, _angularShiroConfig_, _roles_, _$timeout_, _$location_) {
	roles = _roles_;
	subject = _subject_;
	$location = _$location_;
	$timeout = _$timeout_;
	config = _angularShiroConfig_;
	loginUrl = config.login.path;
    }));

    it('should deny access if does not have role', function() {
	var out = roles.execute([ role ]);
	$timeout.flush();
	expect(out).toBeFalsy();
	expect($location.path()).toEqual(loginUrl);
    });

    it('should allow access if have role', function() {
	subject.authenticated = true;
	subject.authorizer.setAuthorizationInfo(new AuthorizationInfo([ role ], []));
	var out = roles.execute([ role ]);
	expect(out).toBeTruthy();
	expect($location.path()).toEqual('');
    });

});

describe('$location', function() {

    var $location, config, $rootScope;

    beforeEach(module('angularShiro'));

    beforeEach(inject(function(_$rootScope_, _angularShiroConfig_, _$location_) {
	$rootScope = _$rootScope_;
	config = _angularShiroConfig_;
	$location = _$location_;
    }));

    it('should be redirected on logout', function() {
	console.log($rootScope.$$listenerCount);
	$rootScope.$apply(function() {
	    $location.path("/logout");
	});
	expect($location.path()).toEqual("/");
    });
});
