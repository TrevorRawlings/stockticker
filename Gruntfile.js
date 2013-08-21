
module.exports = function(grunt) {

	var _ = require('underscore');

	// Load required NPM tasks.
	// You must first run `npm install` in the project's root directory to get these dependencies.
    grunt.loadNpmTasks('grunt-contrib-coffee');
	grunt.loadNpmTasks('lumbar');

	// Parse config files
	var lumbarConfig = grunt.file.readJSON('lumbar.json');
	var packageConfig = grunt.file.readJSON('package.json');

	// This will eventually get passed to grunt.initConfig()
	// Initialize multitasks...
	var config = {
		concat: {},
		uglify: {},
		copy: {},
		compress: {},
		clean: {}
	};

	// Combine certain configs for the "meta" template variable (<%= meta.whatever %>)
	config.meta = _.extend({}, packageConfig);

	// The "grunt" command with no arguments
	grunt.registerTask('default', ['coffee', 'lumbar:build']);


    /* coffee script */
    config.coffee = {
        compile: {
            files: {
                'assets/backbone_edit/find_element_mixin.js':    'assets/backbone_edit/find_element_mixin.js.coffee',
                'assets/backbone_edit/backbone_edit_helpers.js': 'assets/backbone_edit/backbone_edit_helpers.js.coffee',
                'assets/backbone_edit/formatters.js':            'assets/backbone_edit/formatters.js.coffee',
                'assets/backbone_edit/converters.js':            'assets/backbone_edit/converters.js.coffee',
                'assets/backbone_edit/slickgrid_formatters.js':  'assets/backbone_edit/slickgrid_formatters.js.coffee',
                'assets/backbone_edit/slickgrid_view.js':        'assets/backbone_edit/slickgrid_view.js.coffee'
            },
            options: {
                basePath: 'src/'
            }
        }
    },

	/* FullCalendar Modules
	----------------------------------------------------------------------------------------------------*/

	grunt.registerTask('modules', 'Build the FullCalendar modules', [
		'lumbar:build',
		'concat:moduleVariables'
	]);

	// assemble modules
	config.lumbar = {
		build: {
			build: 'lumbar.json',
			output: 'build/out' // a directory. lumbar doesn't like trailing slash
		}
	};

	// replace template variables (<%= %>), IN PLACE
	config.concat.moduleVariables = {
		options: {
			process: true // replace
		},
		expand: true,
		cwd: 'build/out/',
		src: [ '*.js', '*.css', '!jquery*' ],
		dest: 'build/out/'
	};


	// finally, give grunt the config object...
	grunt.initConfig(config);
};
