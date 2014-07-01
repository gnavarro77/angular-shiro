'use strict';

/**
 * @ngdoc directive
 * @name angularShiro.directives.principal
 * @restrict E
 * 
 * @description The principal directive will output the `Subject`'s `principal`
 *              or a property of that principal.
 * 
 * If no property attribute is specified the directive will 
 * render the `angular.toJson(principal)` value.
 * 
 * @element ANY
 * @scope
 * @priority 600
 * 
 * @param {string=}
 *            property a property name of the `principal` object
 * 
 * @example 
<example module="angularShiro"> 
	<file name="index.html"> 
		<div ng-controller="Ctrl"> 
			The principal with no property specified is : <principal />
			<br /><br />
			The principal with the <code>login</code> property specified is : <principal property="login" />
			<br /><br />
			The principal with the <code>email</code> property specified is : <principal property="email" />
		</div> 
	</file> 
	<file name="app.js">
function Ctrl($scope, subject, authenticationResponseParser) {
  			
	// expose Subject instance to the current scope
	$scope.subject = subject;
	// mock data  		 	
	var data = {info:{authc:{principal:{"login":"edegas","email":"degas@mail.com"},credentials:{}},authz:{roles:[],permissions:[]}}};
	  		 	
	// Injecting mock data into the Subject instance (for example purpose)
	// Normally data are injected during the log in process (Subject.login(token))
	var infos = authenticationResponseParser.parse(data);
	subject.authenticationInfo = infos['authc'];
	subject.authorizer.setAuthorizationInfo(infos['authz']);
}
	</file> 
	<file name="style.css">
	.principal {
		border-radius: 0.25em;
	    color: #FFFFFF;
	    display: inline;
	    font-size: 75%;
	    font-weight: 700;
	    line-height: 1;
	    padding: 0.2em 0.6em 0.3em;
	    text-align: center;
	    vertical-align: baseline;
	    white-space: nowrap;
	    background: none repeat scroll 0 0 #128327;
	}
	</file>
</example>
 * 
 */
var principalDirective = [ 'subject', function(subject) {
	return {
		restrict : 'E',
		replace : true,
		scope : {},
		template : '<span class="principal" ng-bind="getPrincipal()"></span>',
		link : function(scope, element, attr) {
			scope.getPrincipal = function() {
				var text = subject.getPrincipal();
				if (angular.isObject(text)) {
					if (attr.property && angular.isDefined(text[attr.property])) {
						text = text[attr.property];
					} else {
					text = angular.toJson(text);
					}
				}
				return text;
			};
		}
	};
} ];