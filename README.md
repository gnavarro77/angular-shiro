angular-shiro
=============

`angular-shiro` is an attempt to bring [Apache Shiro](http://shiro.apache.org/) to the [AngularJS](https://angularjs.org/) world.

## What is it all about?

`angular-shiro` is born out of the such simple needs as

* if the user is not an *admin* then this button must not be *available*
* if the user does not have *that* permission then he should not be able to do or access that *action* or *resource*

As [Apache Shiro](http://shiro.apache.org/) is all about those issues (and more), instead of reinventing the wheel, `angular-shiro` is strongly inspired, if not more, from its JAVA mentor.


## Getting started

### Install

Using `bower`

`bower install angular-shiro` --save

or by downloading project as zip

[angular-shiro](https://github.com/gnavarro77/angular-shiro/archive/master.zip)

### Usage

   - Load `angular-shiro` script

```javascript
<script type="text/javascript" src="path_to_angular_shiro/angular-shiro.min.js"></script>
```
   - Add `angular-shiro` module to your application module dependencies

```javascript
angular.module('myApp', ['angularShiro', ...])
```
   - Authenticate `Subject/User` to your application 

```javascript
subject.login(new UsernamePasswordToken('myLogin','myPassword')
    .then(function(data){  
        // do whatever you need on successful authentication
    }, function(data){
        // do whatever you need on authentication failure
    });
```
   - Apply your authorization rules

```javascript
// This button is visible only to authenticated Subject having the ADMIN role
<button 
    type="button" 
    class="btn btn-default" 
    ng-click="edit()"
    has-role="'ADMIN'">Edit</button>
```
## Demo

As a demo is worth a thousand words, check out [**angular-shiro address book demo application**](http://gnavarro77.github.io/angular-shiro)

## Authentication

Authentication is `Subject` based.

The `Subject` is availbale for injection under the name `subject`.

You can make a login attempt for a Subject/user through the use of `subject` method [login(token)](http://gnavarro77.github.io/angular-shiro/docs/#/api/angularShiro.services.subject)

        var token = new UsernamePasswordToken('username','password');
        subject.login(token);
        
The default authentication mecanism is to send a `POST` request to `/api/authenticate` with the following post data :

    {"token":{"principal":"username","credentials":"password"}}

The response returned from the backend have to be a `json` object that comply to the following structure :

	{
		info : {
			authc : {
				principal : {
					// the Suject/User principal, for example
					"login":"edegas",
					"apiKey":"*******"
				},
				credentials : {
					// the Subject/User credentials, for example
					"name" : "Edgar Degas",
					"email":"degas@mail.com"
				}
			},
			authz : {
				// list of the Subject/User roles, for example
				roles:["GUEST"],
				// list of the Subject/User permissions, for example
				permissions:["newsletter:read","book:*"]
			}
		}
	}

## Authorization

The authorization support is based on the same [elements of Authorization](http://shiro.apache.org/authorization.html#Authorization-ElementsofAuthorization) as [Apache Shiro](http://shiro.apache.org/).

Authorization can be done in 2 ways :

* Programmatically, in interacting directly with the current `Subject` instance
* Directives, in adding directives on UI elements

### Role-Based Authorization

#### Programmatically

| Subject Method | Description 
| ------------- |-------------
| hasRole(roleName) | Returns `true` if the Subject is assigned the specified role, `false` otherwise.
| hasRoles(roleNames)|  Returns an `array` of `hasRole` results corresponding to the indices in the method argument
|hasAllRoles(roleNames)|Returns `true` if the Subject is assigned all of the specified roles, `false` otherwise. 

#### Directives

* [has-role](http://gnavarro77.github.io/angular-shiro/docs/#/api/angularShiro.directives.hasRole)
* [lacks-role](http://gnavarro77.github.io/angular-shiro/docs/#/api/angularShiro.directives.lacksRole)
* [has-any-role](http://gnavarro77.github.io/angular-shiro/docs/#/api/angularShiro.directives.hasAnyRole)

### Permission-Based Authorization

#### Programmatically

| Subject Method | Description 
| ------------- |-------------
| isPermitted(permission) | Returns `true` if the Subject is permitted to perform an action or access a resource summarized by the specified permission, `false` otherwise
|isPermitted(permissions)| Returns an array of `isPermitted` results corresponding to the indices in the method argument
|isPermittedAll(permissions)|Returns `true` if the Subject is permitted all of the specified permissions, `false` otherwise

#### Directives

* [has-permission](http://gnavarro77.github.io/angular-shiro/docs/#/api/angularShiro.directives.hasPermission)
* [lacks-permission](http://gnavarro77.github.io/angular-shiro/docs/#/api/angularShiro.directives.lacksPermission)


### Protects `$location` paths

`angular-shiro` offers the ability to define ad-hoc filter chains for any matching `$location` path in your application.

Use `angularShiroConfig` `setFilter(path, filter(s))` to associate the filter(s) to the paths.

    app.config(['angularShiroConfigProvider', function(config) {
        config.setFilter('/admin/**', 'roles["ADMIN","GUEST"]');
    } ]);

The format of each line in the urls section is as follows :

	_URL Ant Path Expression_ = _Path_Specific_Filter_Chain_

_URL_Ant_Path_Expression_ is an Ant-style path expression. 

The `_Path_Specific_Filter_Chain_` is a comma-delimited list of filters to execute for a `$location` path matching _URL_Ant_Path_Expression_.

For example, 
	
    '/admin/**' = 'authc, roles["ADMIN"]'

declares that any path of `/admin` or any sub paths (`/admin/user`,`/admin/user/profile`) will trigger the `authc, roles["ADMIN"]` filter chain in that order.

### Default filters

|Filter Name    | Description 
| ------------- |-------------
| anon      | Filter that allows access to a path immediately without performing security checks of any kind
| authc     | Filter that allows access if the current user is authenticated, otherwise forces the user to login by redirecting to the configured path
| logout    | Filter that immediately log-out the current user and redirect him to the configured path
| perms     | Filter that allows access if the current user has the permissions specified by the mapped value, or denies access if the user does not have all of the permissions specified and redirect him to the configured path 
| roles     | Filter that allows access if the current user has the roles specified by the mapped value, or denies access if the user does not have all of the roles specified and redirect him to the configured path


## API

[API documentation](http://gnavarro77.github.io/angular-shiro/docs/#/api)