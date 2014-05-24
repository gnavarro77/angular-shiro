/**
 * A <code>Session</code> is a stateful data context associated with a single
 * Subject who interacts with a software system over a period of time
 * 
 * @class Session
 * 
 * @since 0.0.1
 */
function Session() {
	this.startTimestamp = new Date();
	this.lastAccessTime = this.startTimestamp;
	this.expired = false;
};

Session.MILLIS_PER_SECOND = 1000;
Session.MILLIS_PER_MINUTE = 60 * Session.MILLIS_PER_SECOND;
Session.DEFAULT_GLOBAL_SESSION_TIMEOUT = 30 * Session.MILLIS_PER_MINUTE;

Session.prototype.id = null;
Session.prototype.startTimestamp = null;
Session.prototype.stopTimestamp = null;
Session.prototype.lastAccessTime = null;
Session.prototype.timeout = Session.DEFAULT_GLOBAL_SESSION_TIMEOUT;
Session.prototype.expired = null;
Session.prototype.host = null;
Session.prototype.attributes = {};

Session.prototype.getAttribute = function(attributeName) {
	return this.attributes[attributeName];
};

Session.prototype.getAttributes = function() {
	return this.attributes;
}

Session.prototype.setAttribute = function(name, value) {
	this.attributes[name] = value;
}

Session.prototype.removeAttribute = function(Object) {
};

Session.prototype.isExpired = function() {
	return this.expired;
};

Session.prototype.setExpired = function(expired) {
	this.expired = expired;
};

Session.prototype.isValid = function() {
	return !this.isStopped() && !this.isExpired();
};

Session.prototype.getAttributeKeys = function() {
};
Session.prototype.getHost = function() {
	return this.host;
};
Session.prototype.setHost = function(host) {
	this.host = host;
};

Session.prototype.getId = function() {
	return this.id;
};

Session.prototype.setId = function(id) {
	this.id = id;
};

Session.prototype.getLastAccessTime = function() {
	return this.lastAccessTime;
};
Session.prototype.setLastAccessTime = function(lastAccessTime) {
	this.lastAccessTime = lastAccessTime;
};

Session.prototype.getStartTimestamp = function() {
	return this.startTimestamp;
};

Session.prototype.setStartTimestamp = function(startTimestamp) {
	this.startTimestamp = startTimestamp;
};

Session.prototype.getTimeout = function() {
	return this.timeout;
};
Session.prototype.setTimeout = function(timeout) {
	this.timeout = timeout;
};

Session.prototype.isTimedOut = function() {
	var timedOut = this.isExpired();
	if (!timedOut) {
		var timeout = this.getTimeout();
		if (timeout) {
			var lastAccessTime = this.getLastAccessTime();
			var expireTimeMillis = new Date().getTime() - timeout;
			var expireTime = new Date(expireTimeMillis);
			timedOut = (expireTimeMillis > lastAccessTime.getTime());
		}
	}
	return timedOut;
}

Session.prototype.getStopTimestamp = function() {
	return this.stopTimestamp;
};

Session.prototype.setStopTimestamp = function(stopTimestamp) {
	this.stopTimestamp = stopTimestamp;
};

Session.prototype.stop = function() {
	if (this.stopTimestamp == null) {
		this.stopTimestamp = new Date();
	}
};
Session.prototype.isStopped = function() {
	return this.getStopTimestamp() != null;
}
Session.prototype.touch = function() {
	this.lastAccessTime = new Date();
};
Session.prototype.validate = function() {
	return null;
}