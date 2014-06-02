module.exports = function(grunt) {

	grunt
			.initConfig({
				pkg : grunt.file.readJSON('package.json'),
				dist : 'dist',
				build : 'build',
				src : 'src',
				docs : '<%= dist %>/docs',
				concat : {
					options : {
						separator : ';',
					},
					main : {
						src : [ 'src/services/authenticate.js',
								'src/services/authorize.js',
								'src/services/subject.js',
								'<%= build %>/<%= pkg.name %>.templates.js',
								'src/directives/*.js', 'src/angular-shiro.js' ],
						dest : '<%= dist %>/<%= pkg.name %>.js',
					},
				},
				uglify : {
					options : {
						report : 'min'
					},
					js : {
						files : {
							'<%= dist %>/<%= pkg.name %>.min.js' : '<%= dist %>/<%= pkg.name %>.js'
						}
					}
				},
				html2js : {
					// toto : {
					// src : [ 'toto.html' ],
					// dest : 'toto.js',
					// },
					main : {
						options : {
							base : 'src',
							module : 'angularShiro.templates',
							rename : function(moduleName) {
								var tokens = moduleName.split('\/');
								var filename = tokens[tokens.length - 1];
								return 'templates/' + filename;
							}
						},
						src : [ 'src/directives/*.html' ],
						dest : '<%= build %>/<%= pkg.name %>.templates.js',
					}
				},

				karma : {
					unit : {
						configFile : 'karma.conf.js'
					},
					tasks : [ 'karma:unit:run' ]
				},
				ngdocs : {
					options : {
						dest : '<%= docs %>',
						scripts : [
								'angular.js',
								'https://code.angularjs.org/1.2.16/angular-mocks.js',
								'../<%= pkg.name %>.js',
								'demo/app.js'],
						// styles :
						// ['http://netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css'],
						title : "<%= pkg.description %>",
						html5Mode : false
					},
//					demo : {
//						src : [ 'demo/index.ngdoc' ],
//						title : 'Demo'
//					},
					api : {
						src : [ 'src/services/*.js', 'src/directives/*.js'
						// 'src/services/*.js',
						// 'src/angular-shiro.js'
						],
						title : 'API Reference'
					}
				},
				connect : {
					options : {
						keepalive : true
					},
					server : {}
				},
				clean : {
					build : [ '<%= build %>' ],
					dist : [ '<%= dist %>' ],
					docs : [ '<%= docs %>' ]
				}
			});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.loadNpmTasks('grunt-karma');
	grunt.loadNpmTasks('grunt-html2js');

	grunt.loadNpmTasks('grunt-ngdocs');

	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('doc', [ 'clean:docs', 'ngdocs' ]);
	grunt.registerTask('test', [ 'karma' ]);
	grunt.registerTask('build', [ 'clean:dist', 'html2js', 'concat', 'uglify',
			'clean:build' ]);

};