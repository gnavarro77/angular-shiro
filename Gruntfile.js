module.exports = function(grunt) {

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		dist : 'dist',
		src : 'src',
		docs : '<%= dist %>/docs',
		concat : {
			options : {
				separator : ';',
			},
			core : {
				src : [ 
				        'src/core/IllegalArgumentException.js.js',
						'src/core/authz/AuthorizationException.js',
						'src/core/authz/AuthorizationInfo.js',
						'src/core/authz/Permission.js',
						'src/core/authz/Authorizer.js',
						'src/core/session/Session.js'],
				dest : '<%= dist %>/<%= pkg.name %>-core.js',
			},
		},
		karma : {
			unit : {
				configFile : 'karma.conf.js'
			},
			tasks : [ 'karma:unit:run' ]
		},
		ngdocs : {
			options : {
				dest : '<%= docs %>/angular',
				html5Mode : false
			},
			api : {
				src : [ 'src/services/authenticate.js',
				        'src/services/subject.js'
				        //'src/services/*.js',
				        //'src/directives/*.js',
				        //'src/angular-shiro.js'
				        ],
				title : 'API Reference'
			}
		},
		yuidoc : {
			compile : {
				name : '<%= pkg.name %>',
				description : '<%= pkg.description %>',
				version : '<%= pkg.version %>',
				url : '<%= pkg.homepage %>',
				options : {
					paths : '<%= src %>/core',
					outdir : '<%= docs %>/core'
				}
			}
		},
		connect : {
			options : {
				keepalive : true
			},
			server : {}
		},
		clean : {
			dist : [ '<%= dist %>' ],
			docs : [ '<%= docs %>' ]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.loadNpmTasks('grunt-contrib-connect');
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-karma');

	grunt.loadNpmTasks('grunt-ngdocs');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	grunt.registerTask('doc', [ 'clean:docs', 'yuidoc', 'ngdocs', 'connect' ]);

	grunt.registerTask('test', [ 'karma' ]);

	grunt.registerTask('build', [ 'concat:core', 'doc' ]);

};