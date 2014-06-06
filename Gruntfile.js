module.exports = function(grunt) {

	grunt
			.initConfig({
				pkg : grunt.file.readJSON('package.json'),
				dist : 'dist',
				build : 'build',
				src : 'src',
				docs : '<%= dist %>/docs',
				pages : '../angular-shiro-gh-pages/angular-shiro',
				concat : {
					options : {
						separator : ';',
					},
					main : {
						src : [ 'src/services/config.js',
								'src/services/authenticate.js',
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
					travis : {
						configFile : 'karma.conf.js',
						singleRun : true,
						browsers : [ 'PhantomJS' ]
					}
				},
				ngdocs : {
					options : {
						dest : '<%= docs %>',
						scripts : [
								'angular.js',
								'https://code.angularjs.org/1.2.16/angular-mocks.js',
								'../<%= pkg.name %>.min.js' ],
						title : "<%= pkg.description %>",
						html5Mode : false
					},
					api : {
						src : [ 'src/services/*.js', 'src/directives/*.js' ],
						title : 'API Reference'
					}
				},
				copy : {
					pages : {
						files : [ {
							expand : true,
							cwd : 'demo/',
							src : [ '**' ],
							dest : '<%= pages %>'
						}, {
							expand : true,
							cwd : '<%= dist %>',
							src : [ '<%= pkg.name %>.min.js' ],
							dest : '<%= pages %>'
						}, {
							expand : true,
							cwd : '<%= dist %>',
							src : [ 'docs/**/*' ],
							dest : '<%= pages %>'
						} ]
					},
					demo : {
						files : [ {
							expand : true,
							cwd : '<%= dist %>',
							src : [ '<%= pkg.name %>.js' ],
							dest : 'demo'
						} ]
					}
				},
				clean : {
					options : {
						force : true
					},
					build : [ '<%= build %>' ],
					dist : [ '<%= dist %>' ],
					docs : [ '<%= docs %>' ],
					pages : [ '<%= pages %>/**/*' ]
				},
				connect : {
					options : {
						keepalive : true
					},
					server : {}
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

	grunt
			.registerTask('pages', [ 'build', 'doc', 'clean:pages',
					'copy:pages' ]);

};