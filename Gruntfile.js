module.exports = function(grunt) {

	grunt
		.initConfig({
			pkg : grunt.file.readJSON('package.json'),
			build_dir : 'dist',
			src: 'src',
			uglify : {
				options : {
					banner : '/** <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
					mangle : true,
					drop_console : true
				},
				build : {
					files : {
						'build/angular-shiro.min.js' : [
								'src/classes/*.js', 'src/services/*.js',
								'src/directive/*.js',
								'src/angular-security.js' ]
					}
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
					dest : 'build/docs',
					// navTemplate : 'docs/html/nav.html',
					html5Mode : true,
					title : false,
					// image :
					// 'identity/logo/angular-translate-alternative/angular-translate_alternative_small2.png',
					// imageLink :
					// 'http://pascalprecht.github.io/angular-translate',
					startPage : '/guide',
					scripts : [
							'http://code.angularjs.org/1.2.9/angular.js',
							'http://code.angularjs.org/1.2.9/angular-route.min.js',
							'http://code.angularjs.org/1.2.9/angular-animate.js',
							'http://code.angularjs.org/1.2.9/angular-loader.min.js'

					// 'http://getbootstrap.com/2.3.2/assets/js/bootstrap-dropdown.js',
					// 'http://rawgithub.com/SlexAxton/messageformat.js/master/messageformat.js',
					// 'http://rawgithub.com/SlexAxton/messageformat.js/master/locale/de.js',
					// 'http://code.angularjs.org/1.1.5/angular.min.js',
					// 'http://rawgithub.com/angular/bower-angular-cookies/master/angular-cookies.min.js',
					// 'http://rawgithub.com/angular-translate/bower-angular-translate/master/angular-translate.min.js',
					// 'http://rawgithub.com/angular-translate/bower-angular-translate-interpolation-messageformat/master/angular-translate-interpolation-messageformat.min.js',
					// 'http://rawgithub.com/angular-translate/bower-angular-translate-storage-cookie/master/angular-translate-storage-cookie.min.js',
					// 'http://rawgithub.com/angular-translate/bower-angular-translate-storage-local/master/angular-translate-storage-local.min.js',
					// 'http://rawgithub.com/angular-translate/bower-angular-translate-loader-static-files/master/angular-translate-loader-static-files.min.js',
					// 'http://rawgithub.com/angular-translate/bower-angular-translate-handler-log/master/angular-translate-handler-log.min.js'
					]
				// styles : [ 'docs/css/styles.css' ]
				},
				api : {
					src : [ 'src/**/*.js' ],
					title : 'API Reference'
				},
				guide : {
					src : [ 'docs/content/guide/<%= language %>/*.ngdoc' ],
					title : 'Guide'
				}
			},
			jsdoc : {
				dist : {
					src : [ 'src/**/*.js' ],
					options : {
						destination : 'build/doc'
					}
				}
			},
			yuidoc: {
				compile: {
					name: '<%= pkg.name %>',
					description: '<%= pkg.description %>',
					version: '<%= pkg.version %>',
					url: '<%= pkg.homepage %>',
					options: {
						paths: '<%= src %>/classes',
						outdir: '<%= build_dir %>/docs'
					}
				}
			},
			clean : {
				docs : [ '<%= build_dir %>/docs' ]
			}
		});

	//grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-karma');
	//grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-ngdocs');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-contrib-clean');

	grunt.registerTask('doc', [ 'clean:docs', 'yuidoc']);
	grunt.registerTask('test', [ 'karma' ]);

	grunt.registerTask('build', [ 'uglify' ]);

};