
module.exports = function(grunt) {

	var _ = require('underscore');

	// Load required NPM tasks.
	// You must first run `npm install` in the project's root directory to get these dependencies.
    grunt.loadNpmTasks('grunt-contrib-coffee');


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
	grunt.registerTask('default', ['coffee']);


    /* coffee script */
    config.coffee = {
        compile: {
            files: {
                'assets/backbone_edit/find_element_mixin.js':    'assets/backbone_edit/find_element_mixin.js.coffee',
                'assets/backbone_edit/backbone_edit_helpers.js': 'assets/backbone_edit/backbone_edit_helpers.js.coffee',
                'assets/backbone_edit/formatters.js':            'assets/backbone_edit/formatters.js.coffee',
                'assets/backbone_edit/converters.js':            'assets/backbone_edit/converters.js.coffee',
                'assets/backbone_edit/slickgrid_formatters.js':  'assets/backbone_edit/slickgrid_formatters.js.coffee',
                'assets/backbone_edit/slickgrid_view.js':        'assets/backbone_edit/slickgrid_view.js.coffee',
                'tests/tests.js':                                'tests/tests.js.coffee'
            },
            options: {
                basePath: 'src/'
            }
        }
    },



	// finally, give grunt the config object...
	grunt.initConfig(config);
};
