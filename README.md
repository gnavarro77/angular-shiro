angular-shiro
=============

`angular-shiro` is an attempt to bring [Apache Shiro](http://shiro.apache.org/) to the [AngularJS](https://angularjs.org/) world.

## What is it all about?

`angular-shiro` is born out of the such simple needs as

* if the user is not an *admin* then this button must not be *available*
* if the user does not have *that* permission then he should not be able to do or access that *action* or *resource*

As [Apache Shiro](http://shiro.apache.org/) was all about those issues (and more), instead of reinventing the wheel, `angular-shiro` is strongly inspired, if not more, from its JAVA mentor.

## Demo

As a demo is worth a thousand words, check out [**angular-shiro address book demo application**](http://gnavarro77.github.io/angular-shiro)

## Authentication

Authentication is `Subject` based.

The `Subject` is availbale for injection under the name `subject`.

You can make a login attempt for a Subject/user through the use of `subject` method [login(token)](http://gnavarro77.github.io/angular-shiro/docs/#/api/angularShiro.services.subject) method

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
				roles:[ 
					// list of the Subject/User roles, for example
					"GUEST" 
				],
				permissions:[ 
					// list of the Subject/User permissions, for example
					"newsletter$read",
					"book$*",
				]
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

The declarations are made through the `urls` attribut of `AngularShiroConfig`.

    app.config(['angularShiroConfigProvider', function(config) {
        config.options.urls['/admin/**] = 'roles["ADMIN","GUEST"]';
    } ]);

The format of each line in the urls section is as follows :

_URL_Ant_Path_Expression_ = _Path_Specific_Filter_Chain_

_URL_Ant_Path_Expression_ is an Ant-style path expression. 

For example, 

    '/admin/**' = 'authc, roles["ADMIN"]'

declares that "any path of `/admin` or any of it's sub paths (`/admin/user`,`/admin/user/profile`) will trigger the 'authc, roles["ADMIN"]' filter chain.

The _Path_Specific_Filter_Chain_ is a comma-delimited list of filters to execute for a `$location` path matching that _URL_Ant_Path_Expression_.

The default _Filter_ instances available automatically for configuration are :

|Filter Name    | Description 
| ------------- |-------------
| anon      | Filter that allows access to a path immeidately without performing security checks of any kind
| authc     | The Subject must be authenticated for the request to continue, otherwise forces the user to login by redirecting to the configured `loginUrl`
| logout    | Simple Filter that, upon location change, will immediately log-out the currently executing `subject` and then redirect them to a configured `redirectUrl`
| perms     | Filter that allows access if the current user has the permissions specified by the mapped value, or denies access if the user does not have all of the permissions specified
| roles     | Filter that allows access if the current user has the roles specified by the mapped value, or denies access if the user does not have all of the roles specified