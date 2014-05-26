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
				src : [ 'src/services/authenticate.js',
						'src/services/authorize.js', 'src/services/subject.js',
						'src/angular-shiro' ],
				dest : '<%= dist %>/<%= pkg.name %>.js',
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
				dest : '<%= docs %>',
				startPage : '/demo',
				//scripts : [  ],
				html5Mode : false
			},
			demo : {
				src : [ 'demo/*.ngdoc' ],
				title : 'Demo'
			},
			api : {
				src : [ 'src/services/*.js',
				        'src/directives/*.js'
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
			dist : [ '<%= dist %>' ],
			docs : [ '<%= docs %>' ]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-connect');
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-karma');

	grunt.loadNpmTasks('grunt-ngdocs');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	grunt.registerTask('doc', [ 'clean:docs', 'ngdocs' ]);

	grunt.registerTask('test', [ 'karma' ]);

	grunt.registerTask('build', [ 'concat:core', 'doc' ]);

};