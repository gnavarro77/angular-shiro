'use strict';

/* globals trim */

/**
 * @ngdoc object
 * @name angularShiro.services.SessionException
 * 
 * @description Exception associated with the session management
 * 
 */
function SessionException(msg) {
    this.msg = msg;
}

/**
 * @ngdoc object
 * @name angularShiro.services.Session
 * 
 * @description A `Session` is a stateful data context associated with a single
 *              `Subject` who interacts with a software system over a period of
 *              time.
 * 
 */
function Session() {

    /**
     * @name Session#uid
     * @description unique identifier assigned by the system
     * @propertyOf angularShiro.services.Session
     */
    this.uid;

    /**
     * @name Session#startTimestamp
     * @description time the session was started
     * @propertyOf angularShiro.services.Session
     */
    this.startTimestamp = new Date();

    /**
     * @name Session#stopTimestamp
     * @description time the session was stopped
     * @propertyOf angularShiro.services.Session
     */
    this.stopTimestamp = null;

    /**
     * @name Session#lastAccessTime
     * @description last time the application received a request or method
     *              invocation
     * @propertyOf angularShiro.services.Session
     */
    this.lastAccessTime = new Date();

    /**
     * @name Session#timeout
     * @description the time in milliseconds that the session session may remain
     *              idle before expiring. Default value is 30 minutes
     * @propertyOf angularShiro.services.Session
     */
    this.timeout = 30 * 60 * 1000;

    /**
     * @name Session#expired
     * @description flag indicating if the session is expired
     * @propertyOf angularShiro.services.Session
     */
    this.expired = false;

    /**
     * @name Session#attributes
     * @description the attributes attached to the session
     * @propertyOf angularShiro.services.Session
     */
    this.attributes = {};

    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#getId
     * @methodOf angularShiro.services.Session
     * 
     * @description Returns the unique identifier assigned by the system upon
     *              session creation
     * 
     * @returns {string} unique identifier assigned by the system upon session
     *          creation
     */
    this.getId = function() {
	return this.uid;
    };
    /**
     * @ngdoc method
     * @function
     * @name Session#setId
     * @methodOf angularShiro.services.Session
     * 
     * @description Assign a generated session ID to the session instance
     *              directly
     */
    this.setId = function(uid){
	this.uid = uid;
    };
    
    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#getStartTimestamp
     * @methodOf angularShiro.services.Session
     * 
     * @description Returns the time the session was started
     * 
     * @returns {date} time the session was started
     */
    this.getStartTimestamp = function() {
	return this.startTimestamp;
    };

    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#getLastAccessTime
     * @methodOf angularShiro.services.Session
     * 
     * @description Returns the last time the application received a request or
     *              method invocation from the user associated with this session
     * 
     * @returns {date} last time the application received a request or method
     *          invocation from the user associated with this session
     */
    this.getLastAccessTime = function() {
	return this.lastAccessTime;
    };

    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#getTimeout
     * @methodOf angularShiro.services.Session
     * 
     * @description Returns the time in milliseconds that the session session
     *              may remain idle before expiring
     * 
     * @returns {date} the time in milliseconds the session may remain idle
     *          before expiring
     */
    this.getTimeout = function() {
	return this.timeout;
    };

    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#setTimeout
     * @methodOf angularShiro.services.Session
     * 
     * @description Sets the time in milliseconds that the session may remain
     *              idle before expiring
     * 
     * @param {long}
     *                the time in milliseconds that the session may remain idle
     *                before expiring
     * 
     */
    this.setTimeout = function(maxIdleTimeInMillis) {
	this.timeout = maxIdleTimeInMillis;
    };

    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#touch
     * @methodOf angularShiro.services.Session
     * 
     * @description Explicitly updates the `lastAccessTime` of this session to
     *              the current time when this method is invoked. This method
     *              can be used to ensure a session does not time out
     * 
     */
    this.touch = function() {
	this.lastAccessTime = new Date();
    };

    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#stop
     * @methodOf angularShiro.services.Session
     * 
     * @description Explicitly stops (invalidates) this session
     * 
     */
    this.stop = function() {
	if (this.stopTimestamp === null) {
	    this.stopTimestamp = new Date();
	}
    };

    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#isStopped
     * @methodOf angularShiro.services.Session
     * 
     * @description Returns `true` if the session is stopped, `false' otherwise
     * 
     * @returns {boolean} `true` if the session is stopped, `false' otherwise
     */
    this.isStopped = function() {
	return this.stopTimestamp !== null;
    };

    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#isExpired
     * @methodOf angularShiro.services.Session
     * 
     * @description Returns `true` if the session is expired, `false' otherwise
     * 
     * @returns {boolean} `true` if the session is expired, `false' otherwise
     */
    this.isExpired = function() {
	return this.expired;
    };
    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#expire
     * @methodOf angularShiro.services.Session
     * 
     * @description Explicitly make the session expires
     * 
     */
    this.expire = function() {
	this.stop();
	this.expired = true;
    };
    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#isValid
     * @methodOf angularShiro.services.Session
     * 
     * @description Returns `true` if the session is valid (not expired nor
     *              stopped), `false' otherwise
     * 
     * @returns {boolean} `true` if the session is valid, `false' otherwise
     */
    this.isValid = function() {
	return !this.isStopped() && !this.isExpired();
    };

    /**
     * 
     */
    this.validate = function() {
	if (this.isStopped()) {
	    var msg = 'Session with id [' + this.getId() + '] has been '
		    + 'explicitly stopped.  No further interaction under this session is allowed.';
	    throw new SessionException(msg);
	}
	if (this.isTimedOut()) {
	    this.expire();
	    throw new SessionException('Session has expired');
	}
    };
    /**
     * 
     */
    this.isTimedOut = function() {
	var timedOut = this.isExpired();
	if (!timedOut) {
	    var timeout = this.getTimeout();
	    if (timeout >= 1) {
		var currentTimestamp = new Date().getTime();
		var expireTimeMillis = currentTimestamp - timeout;
		var expireTime = new Date(expireTimeMillis);
		timedOut = this.lastAccessTime <= expireTime;
	    }
	}
	return timedOut;
    };

    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#getAttributeKeys
     * @methodOf angularShiro.services.Session
     * 
     * @description Returns the keys of all the attributes stored under this
     *              session. If there are no attributes, this returns an empty
     *              collection
     * 
     * @returns {array} the keys of all attributes stored under this session, or
     *          an empty collection if there are no session attributes
     * 
     */
    this.getAttributeKeys = function() {
	var keys = [];
	angular.forEach(this.attributes, function(value, key) {
	    keys.push(key);
	});
	return keys;
    };

    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#getAttribute
     * @methodOf angularShiro.services.Session
     * 
     * @description Returns the keys of all the attributes stored under this
     *              session. If there are no attributes, this returns an empty
     *              collection
     * 
     * @param {object}
     *                the unique name of the object bound to this session
     * 
     * @returns {object} the object bound under the specified `key` name or
     *          `null` if there is no object bound under that name
     * 
     */
    this.getAttribute = function(key) {
	return this.attributes[key];
    };

    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#setAttribute
     * @methodOf angularShiro.services.Session
     * 
     * @description Returns the keys of all the attributes stored under this
     *              session. If there are no attributes, this returns an empty
     *              collection
     * 
     * @param {object}
     *                `key` the name under which the `value` object will be
     *                bound in this session
     * @param {object}
     *                `value` the object to bind in this session
     * 
     */
    this.setAttribute = function(key, value) {
	this.attributes[key] = value;
    };

    /**
     * 
     * @ngdoc method
     * @function
     * @name Session#removeAttribute
     * @methodOf angularShiro.services.Session
     * 
     * @description Removes (unbinds) the object bound to this session under the
     *              specified `key` name
     * 
     * @param {object}
     *                `key` the name under which the `value` object will be
     *                bound in this session
     * 
     */
    this.removeAttribute = function(key) {
	delete this.attributes[key];
    };
}

/**
 * @ngdoc object
 * @name angularShiro.services.SessionManager
 * 
 * @description `SessionManager` manages the creation, maintenance, and clean-up
 *              of all application Sessions.
 * 
 */
function SessionManager(sessionDAO) {
    
    this.sessionDAO = sessionDAO ;
    
    /**
     * 
     * @ngdoc method
     * @function
     * @name SessionManager#start
     * @methodOf angularShiro.services.SessionManager
     * 
     * @description Starts a new session
     * 
     * @return the `Session` object or `null` if no session is found
     */
    this.start = function(){
	var session = new Session();
	this.sessionDAO.create(session);
	return session;
    };
    /**
     * 
     * @ngdoc method
     * @function
     * @name SessionManager#getSession
     * @methodOf angularShiro.services.SessionManager
     * 
     * @description Retrieves the session corresponding to the specified ID, or
     *              `null` if no Session is found
     * 
     * @param {string}
     *                session ID
     * @return the `Session` object or `null` if no session is found
     */
    this.getSession = function(sessionId){
	var session = this.sessionDAO.readSession(sessionId);
	if (session){
	    session.validate();
	}
	return session;
    };
    
    /**
     * 
     * @ngdoc method
     * @function
     * @name SessionManager#update
     * @methodOf angularShiro.services.SessionManager
     * 
     * @description Update the session
     * 
     * @param {angularShiro.services.Session}
     *                session the session to update
     */
    this.update = function(session) {
	this.sessionDAO.update(session);
    }
    
}

/**
 * Function used to generate a unique session id
 * 
 * @returns
 */
function guid() {
    function s4() {
	return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

/**
 * @ngdoc object
 * @name angularShiro.services.SessionDAO
 * 
 * @description Data Access Object design pattern specification to enable
 *              {@link Session} access to an EIS (Enterprise Information System)
 * 
 */
function SessionDAO() {

    /**
     * 
     * @ngdoc method
     * @function
     * @name SessionDAO#create
     * @methodOf angularShiro.services.SessionDAO
     * 
     * @description Inserts a new Session record into the browser session
     *              storage
     * 
     * @param {angularShiro.services.Session}
     *                `session` the name under which the `value` object will be
     *                bound in this session
     * @return the EIS id (e.g. primary key) of the created `Session` object
     */
    this.create = function(session) {
	var sessionId = guid();
	session.setId(sessionId);
	sessionStorage.setItem(sessionId, angular.toJson(session));
	return sessionId;
    };
 
    /**
     * @ngdoc method
     * @function
     * @name SessionDAO#readSession
     * @methodOf angularShiro.services.SessionDAO
     * 
     * @description Retrieves the session from the EIS uniquely identified by
     *              the specified `sessionId`.
     * 
     * @param {object}
     *                'sessionId' the system-wide unique identifier of the
     *                Session object to retrieve from the EIS.
     * @return the persisted session in the EIS identified by `sessionId`.
     */ 
    this.readSession = function(sessionId) {
	var session = null;
	var obj = angular.fromJson(sessionStorage.getItem(sessionId));
	if (obj){
	    session = new Session();
	    angular.extend(session, obj);	    
	}
	return session;
    }; 
 
    /**
     * 
     * @ngdoc method
     * @function
     * @name SessionDAO#update
     * @methodOf angularShiro.services.SessionDAO
     * 
     * @description Updates (persists) data from a previously created Session
     *              instance in the the browser session storage identified by
     *              `session.getId()`.
     * 
     * @param {angularShiro.services.Session}
     *                `session` the Session to update
     */ 
    this.update = function(session) {
	sessionStorage.setItem(session.getId(), angular.toJson(session));
    };
 
    /**
     * 
     * @ngdoc method
     * @function
     * @name SessionDAO#delete
     * @methodOf angularShiro.services.SessionDAO
     * 
     * @description Removes the `session` identified by `session.getId()` from
     *              the browser session storage
     * 
     * @param {angularShiro.services.Session}
     *                `session` the session to delete.
     */ 
    this.delete = function(session){
	sessionStorage.removeItem(session.getId());
    }; 
 
// /**
// *
// * @ngdoc method
// * @function
// * @name SessionDAO#getActiveSessions
// * @methodOf angularShiro.services.SessionDAO
// *
// * @description Returns all sessions in the EIS that are considered active,
// * meaning all sessions that haven't been stopped/expired
// *
// * @return {array} Sessions that are considered active, or an empty
// * collection or `null` if there are no active sessions.
// */
// this.getActiveSessions = function(){
//	
// };
}