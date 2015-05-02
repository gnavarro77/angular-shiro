'use strict';

module.exports = function(grunt) {

    grunt.initConfig({
	pkg : grunt.file.readJSON('package.json'),
	meta : {
	    banner : '/**\n' + ' * <%= pkg.name %>\n'
		    + ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n'
		    + ' * @link <%= pkg.homepage %>\n'
		    + ' * @author <%= pkg.author.name %> (<%= pkg.author.email %>)\n'
		    + ' * @license MIT License, http://www.opensource.org/licenses/MIT\n' + ' */\n'
	},
	dist : 'dist',
	build : 'build',
	src : 'src',
	test : 'test',
	docs : '<%= dist %>/docs',
	pages : '../angular-shiro-gh-pages/angular-shiro',
	concat : {
	    dist : {
		options : {
		    banner : '(function(window, document, undefined) {\n\'use strict\';\n',
		    footer : '\n})(window, document);\n',
		    process : function(src, filepath) {
			return src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
		    },
		    stripBanners : true
		},
		src : [ 'src/services/config.js', 'src/services/authenticate.js', 'src/services/authorize.js',
			'src/services/session.js', 'src/services/filters.js', 'src/services/subject.js',
			'<%= build %>/<%= pkg.name %>.templates.js', 'src/directives/*.js', 'src/angular-shiro.js' ],
		dest : '<%= dist %>/<%= pkg.name %>.js',
	    },
	    banner : {
		options : {
		    banner : '<%= meta.banner %>',
		},
		files : [ {
		    expand : true,
		    cwd : '<%= dist %>',
		    src : '{,*/}*.js',
		    dest : '<%= dist %>'
		} ]
	    }
	},
	uglify : {
	    dist : {
		files : [ {
		    expand : true,
		    cwd : '<%= dist %>',
		    src : '{,*/}*.js',
		    dest : '<%= dist %>',
		    ext : '.min.js'
		} ]
	    }
	},
	ngmin : {
	    dist : {
		files : [ {
		    src : '<%= dist %>/<%= pkg.name %>.js',
		    dest : '<%= dist %>/<%= pkg.name %>.js'
		} ]
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

	jshint : {
	    options : {
		jshintrc : '.jshintrc',
		reporter : require('jshint-stylish')
	    },
	    all : [ 'Gruntfile.js', '<%= src %>/{,*/}*.js' ],
	},
	bump : {
	    options : {
		files : [ 'package.json', 'bower.json' ],
		commitFiles : [ '.' ],
		commit : true,
		createTag : true,
		push : true,
		pushTo : 'origin'
	    }
	},
	ngdocs : {
	    options : {
		dest : '<%= docs %>',
		scripts : [ 'angular.js', 'https://code.angularjs.org/1.2.16/angular-mocks.js',
			'../<%= pkg.name %>.min.js' ],
		title : '<%= pkg.description %>',
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
		    src : [ '<%= pkg.name %>.js', '<%= pkg.name %>.min.js' ],
		    dest : 'demo/bower_components/angular-shiro/dist'
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
	changelog : {
	    options : {}
	},
	watch : {
	    scripts : {
		files : [ 'src/**/*.js' ],
		tasks : [ 'jshint' ],
		options : {
		    spawn : false,
		},
	    }
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
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('doc', [ 'clean:docs', 'ngdocs' ]);
    grunt.registerTask('test', [ 'karma' ]);
    grunt.registerTask('build', [ 'clean:dist', 'html2js', 'concat:dist', 'ngmin:dist', 'uglify:dist', 'concat:banner',
	    'clean:build', 'changelog' ]);
    grunt.registerTask('pages', [ 'build', 'doc', 'clean:pages', 'copy:pages' ]);
    grunt.registerTask('demo', [ 'build', 'copy:demo' ]);
};