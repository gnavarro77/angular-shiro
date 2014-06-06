angular-shiro
=============

`angular-shiro` is an attempt to bring [Apache Shiro](http://shiro.apache.org/) to the [AngularJS](https://angularjs.org/) world.

## What is it all about?

`angular-shiro` is born out of the such simple needs as

* if the user is not an *admin* then this button must not be *available*

or

* if the user does not have *that* permission then he should not be able to do or access that *action* or *resource*

As [Apache Shiro](http://shiro.apache.org/) was all about those issues (and more), instead of reinventing the wheel, `angular-shiro` is strongly inspired, if not more, from its JAVA mentor.

## Demo

As a demo is worth a thousand words, check out [**angular-shiro address book demo application**](http://gnavarro77.github.io/angular-shiro)

## Authentication

Authentication is `Subject` based. The `Subject` is availbale for injection under the name `subject`.

To performs a login attempt for a Subject/user the use the [login(token)](http://gnavarro77.github.io/angular-shiro/docs/#/api/angularShiro.services.subject) method

        var token = new UsernamePasswordToken('username','password');
        subject.login(token);
        
The default behaviour is to send a `POST` request to `/api/authenticate` with the following post data :

    {"token":{"principal":"username","credentials":"password"}}

## Authorization

The authorization support is based on the same [elements of Authorization](http://shiro.apache.org/authorization.html#Authorization-ElementsofAuthorization) as [Apache Shiro](http://shiro.apache.org/).

You can perform authorization can be done in 2 ways :

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
