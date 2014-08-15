'use strict';

function PathMatcher() {

    this.DEFAULT_PATH_SEPARATOR = '/';

    this.pathSeparator = this.DEFAULT_PATH_SEPARATOR;

    this.setPathSeparator = function(pathSeparator) {
	this.pathSeparator = (pathSeparator !== null ? pathSeparator : this.DEFAULT_PATH_SEPARATOR);
    };

    this.match = function(pattern, path) {
	return this.doMatch(pattern, path, true);
    };

    this.doMatch = function(pattern, path, fullMatch) {
	if (path.startsWith(this.pathSeparator) !== pattern.startsWith(this.pathSeparator)) {
	    return false;
	}
	var pattDirs = pattern.split(this.pathSeparator);
	var pathDirs = path.split(this.pathSeparator);
	var pattIdxStart = 0;
	var pattIdxEnd = pattDirs.length - 1;
	var pathIdxStart = 0;
	var pathIdxEnd = pathDirs.length - 1;

	// Match all elements up to the first **
	while (pattIdxStart <= pattIdxEnd && pathIdxStart <= pathIdxEnd) {
	    var patDir = pattDirs[pattIdxStart];
	    if ('**' === patDir) {
		break;
	    }
	    if (!this.matchStrings(patDir, pathDirs[pathIdxStart])) {
		return false;
	    }
	    pattIdxStart++;
	    pathIdxStart++;
	}

	if (pathIdxStart > pathIdxEnd) {
	    // Path is exhausted, only match if rest of pattern is * or **'s
	    if (pattIdxStart > pattIdxEnd) {
		return (pattern.endsWith(this.pathSeparator) ? path.endsWith(this.pathSeparator) : !path
			.endsWith(this.pathSeparator));
	    }
	    if (!fullMatch) {
		return true;
	    }
	    if (pattIdxStart === pattIdxEnd && pattDirs[pattIdxStart] === '*' && path.endsWith(this.pathSeparator)) {
		return true;
	    }
	    for ( var i = pattIdxStart; i <= pattIdxEnd; i++) {
		if (pattDirs[i] !== '**') {
		    return false;
		}
	    }
	    return true;
	} else if (pattIdxStart > pattIdxEnd) {
	    // String not exhausted, but pattern is. Failure.
	    return false;
	} else if (!fullMatch && '**' === pattDirs[pattIdxStart]) {
	    // Path start definitely matches due to '**' part in pattern.
	    return true;
	}

	// up to last '**'
	while (pattIdxStart <= pattIdxEnd && pathIdxStart <= pathIdxEnd) {
	    var patDir = pattDirs[pattIdxEnd];
	    if (patDir === '**') {
		break;
	    }
	    if (!this.matchStrings(patDir, pathDirs[pathIdxEnd])) {
		return false;
	    }
	    pattIdxEnd--;
	    pathIdxEnd--;
	}
	if (pathIdxStart > pathIdxEnd) {
	    // String is exhausted
	    for ( var i = pattIdxStart; i <= pattIdxEnd; i++) {
		if (pattDirs[i] !== '**') {
		    return false;
		}
	    }
	    return true;
	}

	while (pattIdxStart !== pattIdxEnd && pathIdxStart <= pathIdxEnd) {
	    var patIdxTmp = -1;
	    for ( var i = pattIdxStart + 1; i <= pattIdxEnd; i++) {
		if (pattDirs[i] === '**') {
		    patIdxTmp = i;
		    break;
		}
	    }
	    if (patIdxTmp === pattIdxStart + 1) {
		// '**/**' situation, so skip one
		pattIdxStart++;
		continue;
	    }
	    // Find the pattern between padIdxStart & padIdxTmp in str between
	    // strIdxStart & strIdxEnd
	    var patLength = (patIdxTmp - pattIdxStart - 1);
	    var strLength = (pathIdxEnd - pathIdxStart + 1);
	    var foundIdx = -1;

	    for ( var i = 0; i <= strLength - patLength; i++) {
		for ( var j = 0; j < patLength; j++) {
		    var subPat = pattDirs[pattIdxStart + j + 1];
		    var subStr = pathDirs[pathIdxStart + i + j];
		    if (!this.matchStrings(subPat, subStr)) {

		    }
		}
		foundIdx = pathIdxStart + i;
		break;
	    }

	    if (foundIdx === -1) {
		return false;
	    }

	    pattIdxStart = patIdxTmp;
	    pathIdxStart = foundIdx + patLength;
	}

	for ( var i = pattIdxStart; i <= pattIdxEnd; i++) {
	    if (!(pattDirs[i] === '**')) {
		return false;
	    }
	}
	return true;
    };

    /**
     * 
     */
    this.matchStrings = function(pattern, str) {
	var patArr = pattern.split('');
	var strArr = str.split('');
	var patIdxStart = 0;
	var patIdxEnd = patArr.length - 1;
	var strIdxStart = 0;
	var strIdxEnd = strArr.length - 1;
	var ch;

	var containsStar = this.containsStar(pattern);

	if (!containsStar) {
	    // No '*'s, so we make a shortcut
	    if (patIdxEnd !== strIdxEnd) {
		return false; // Pattern and string do not have the
		// same size
	    }
	    for ( var i = 0; i <= patIdxEnd; i++) {
		ch = patArr[i];
		if (ch !== '?') {
		    if (ch !== strArr[i]) {
			return false;// Character mismatch
		    }
		}
	    }
	    return true; // String matches against pattern
	}
	if (patIdxEnd === 0) {
	    return true; // Pattern contains only '*', which matches
	    // anything
	}

	// Process characters before first star
	while ((ch = patArr[patIdxStart]) !== '*' && strIdxStart <= strIdxEnd) {
	    if (ch !== '?') {
		if (ch !== strArr[strIdxStart]) {
		    return false;// Character mismatch
		}
	    }
	    patIdxStart++;
	    strIdxStart++;
	}
	if (strIdxStart > strIdxEnd) {
	    // All characters in the string are used. Check if only '*'s
	    // are
	    // left in the pattern. If so, we succeeded. Otherwise
	    // failure.
	    for ( var i = patIdxStart; i <= patIdxEnd; i++) {
		if (patArr[i] !== '*') {
		    return false;
		}
	    }
	    return true;
	}

	// Process characters after last star
	while ((ch = patArr[patIdxEnd]) !== '*' && strIdxStart <= strIdxEnd) {
	    if (ch !== '?') {
		if (ch !== strArr[strIdxEnd]) {
		    return false;// Character mismatch
		}
	    }
	    patIdxEnd--;
	    strIdxEnd--;
	}
	if (strIdxStart > strIdxEnd) {
	    // All characters in the string are used. Check if only '*'s
	    // are
	    // left in the pattern. If so, we succeeded. Otherwise
	    // failure.
	    for ( var i = patIdxStart; i <= patIdxEnd; i++) {
		if (patArr[i] !== '*') {
		    return false;
		}
	    }
	    return true;
	}

	// process pattern between stars. padIdxStart and patIdxEnd
	// point
	// always to a '*'.
	while (patIdxStart !== patIdxEnd && strIdxStart <= strIdxEnd) {
	    var patIdxTmp = -1;
	    for ( var i = patIdxStart + 1; i <= patIdxEnd; i++) {
		if (patArr[i] === '*') {
		    patIdxTmp = i;
		    break;
		}
	    }
	    if (patIdxTmp === patIdxStart + 1) {
		// Two stars next to each other, skip the first one.
		patIdxStart++;
		continue;
	    }
	    // Find the pattern between padIdxStart & padIdxTmp in str
	    // between
	    // strIdxStart & strIdxEnd
	    var patLength = (patIdxTmp - patIdxStart - 1);
	    var strLength = (strIdxEnd - strIdxStart + 1);
	    var foundIdx = -1;
	    strLoop: for ( var i = 0; i <= strLength - patLength; i++) {
		for ( var j = 0; j < patLength; j++) {
		    ch = patArr[patIdxStart + j + 1];
		    if (ch !== '?') {
			if (ch !== strArr[strIdxStart + i + j]) {
			    continue strLoop;
			}
		    }
		}

		foundIdx = strIdxStart + i;
		break;
	    }

	    if (foundIdx === -1) {
		return false;
	    }

	    patIdxStart = patIdxTmp;
	    strIdxStart = foundIdx + patLength;
	}

	// All characters in the string are used. Check if only '*'s are
	// left
	// in the pattern. If so, we succeeded. Otherwise failure.
	for ( var i = patIdxStart; i <= patIdxEnd; i++) {
	    if (patArr[i] !== '*') {
		return false;
	    }
	}
	return true;
    };

    this.containsStar = function(str) {
	var containsStar = false;
	if (str && str !== null) {
	    for ( var i = 0; i < str.length; i++) {
		if (str.charAt(i) === '*') {
		    containsStar = true;
		    break;
		}
	    }
	}
	return containsStar;
    };

}

/**
 * 
 * @param angularShiroConfig
 * @returns
 */

var filtersResolver = [ 'angularShiroConfig', '$injector', function FiltersResolver(config, $injector) {
    var matcher = new PathMatcher();
    var urls = config.urls;
    return {
	resolve : function(path) {
	    var stringFilters = this.resolveStringFilters(path);
	    return this.resolveFilters(stringFilters);
	},

	resolveFilters : function(str) {
	    var filters = [];
	    if (str) {
		var tokens = str.split(',');
		for ( var i = 0; i < tokens.length; i++) {
		    var filter = this.resolveFilter(tokens[i]);
		    if (filter !== null) {
			filters.push(filter);
		    }
		}
	    }
	    return filters;
	},
	resolveFilter : function(stringFilter) {
	    var filter = null;
	    var name = this.resolveFilterName(stringFilter);
	    var args = this.resolveFilterArgs(stringFilter);
	    filter = $injector.get(name);
	    return function() {
		return filter.execute(args);
	    };
	},

	resolveFilterName : function(stringFilter) {
	    var name = stringFilter;
	    if (this.isParametrizedFilter(stringFilter)) {
		name = stringFilter.substr(0, stringFilter.indexOf('['));
	    }
	    return trim(name);
	},
	resolveFilterArgs : function(stringFilter) {
	    var args = null;
	    if (this.isParametrizedFilter(stringFilter)) {
		var sIdx = stringFilter.indexOf('[');
		var eIdx = stringFilter.indexOf(']');
		var str = stringFilter.substr(sIdx + 1, eIdx - sIdx - 1);
		var tokens = str.split(',');
		args = [];
		angular.forEach(tokens, function(token) {
		    args.push(trim(token));
		});
	    }
	    return args;
	},
	resolveStringFilters : function(path) {
	    var stringFilters = null;
	    for ( var pattern in urls) {
		if (matcher.match(pattern, path)) {
		    stringFilters = urls[pattern];
		    break;
		}
	    }
	    return stringFilters;
	},
	isParametrizedFilter : function(stringFilter) {
	    return (stringFilter.indexOf('perms') > -1) || (stringFilter.indexOf('roles') > -1);
	}

    };

} ]

var $$onAccessDenied = function($timeout, $location, config) {
    if (config && config.login && config.login.path) {
	$timeout(function() {
	    $location.path(config.login.path);
	});
    }
}

/**
 * Filter that allows access to a path immeidately without performing security
 * checks of any kind.
 * 
 * @returns
 */
var anonymousFilter = [ 'subject', '$log', function AnonymousFilter(subject, $log) {
    return {
	execute : function() {
	    $log.debug('anon::execute');
	    return true;
	}
    }
} ];

/**
 * The Subject must be authenticated for the request to continue, otherwise
 * forces the user to login by redirecting to the configured loginUrl
 */
var formAuthenticationFilter = [ '$rootScope', 'subject', 'angularShiroConfig', '$location', '$timeout', '$log',
	function FormAuthenticationFilter($rootScope, subject, config, $location, $timeout, $log) {
	    return {
		execute : function() {
		    $log.debug('authc::execute');
		    return this.isAccessAllowed() || this.onAccessDenied();
		},
		isAccessAllowed : function() {
		    var accessAllowed = subject.isAuthenticated();
		    $log.debug('authc::isAccessAllowed => ' + accessAllowed);
		    return accessAllowed;
		},
		onAccessDenied : function() {
		    $$onAccessDenied($timeout, $location, config);
		    return false;
		}
	    }
	} ];

/**
 * Simple Filter that, upon location change, will immediately log-out the
 * currently executing <code>subject</code> and then redirect them to a
 * configured <code>redirectUrl</code>
 */
var logoutFilter = [ 'subject', 'angularShiroConfig', '$location', '$timeout', '$log',
	function LogoutFilter(subject, config, $location, $timeout, $log) {
	    return {
		execute : function() {
		    $log.debug('logoutFilter::execute');
		    subject.logout();
		    if (config.logout && config.logout.redirectUrl) {
			$location.path(config.logout.redirectUrl);
			$log.debug('logout::redirecting to => ' + config.logout.redirectUrl);
		    }
		    return true;
		}
	    }
	} ];
/**
 * Filter that allows access if the current user has the permissions specified
 * by the mapped value, or denies access if the user does not have all of the
 * permissions specified.
 */
var permsFilter = [ 'subject', 'angularShiroConfig', '$location', '$timeout', '$log',
	function PermsFilter(subject, config, $location, $timeout, $log) {
	    return {
		execute : function(permissions) {
		    $log.debug('perms::execute');
		    return this.isAccessAllowed(permissions) || this.onAccessDenied();
		},
		isAccessAllowed : function(permissions) {
		    var accessAllowed = subject.isPermittedAll(permissions);
		    $log.debug('perms::isAccessAllowed => ' + accessAllowed);
		    return accessAllowed;
		},
		onAccessDenied : function() {
		    $$onAccessDenied($timeout, $location, config);
		    return false;
		}
	    }
	} ];
/**
 * Filter that allows access if the current user has the roles specified by the
 * mapped value, or denies access if the user does not have all of the roles
 * specified
 */
var rolesFilter = [ 'subject', 'angularShiroConfig', '$location', '$timeout', '$log',
	function RolesFilter(subject, config, $location, $timeout, $log) {
	    return {
		execute : function(roles) {
		    $log.debug('roles::execute');
		    return this.isAccessAllowed(roles) || this.onAccessDenied();
		},
		isAccessAllowed : function(roles) {
		    var accessAllowed = subject.hasAllRoles(roles);
		    $log.debug('roles::isAccessAllowed => ' + accessAllowed);
		    return accessAllowed;
		},
		onAccessDenied : function() {
		    $$onAccessDenied($timeout, $location, config);
		    return false;
		}
	    }
	} ];
