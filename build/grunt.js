module.exports = function(grunt) {
	// Loads all grunt tasks needed to run the given task. Will search for the given modules in the node_modules folder.
	// More info: https://github.com/shootaroo/jit-grunt
	require('jit-grunt')(
		// Some modules require static directory mappings.
		// See: https://github.com/shootaroo/jit-grunt#static-mappings
		grunt, {
			validation: 'grunt-html-validation',
			protractor: 'grunt-protractor-runner',
			scsslint: 'grunt-scss-lint'
		}
	);
	//require('./grunt/_makefont.js');

	/**
	 * Loads all configs from path by requiring them as node modules and builds one config map as a single object from them.
	 */
	function configObjectFromConfigDir(path) {
		var config = {};
		var shared = require(path + '_shared')(grunt);

		// glob makes enumerating file names from the file system easy.
		var glob = require('glob');
		var thisNodeModuleDir = __dirname;

		// Iterate through all files in the directory given by the path.
		glob.sync('*.js', {cwd: thisNodeModuleDir + '/' + path}).forEach(function(fileName) {
			var isUnderscorePrefixed = (fileName.substring(0, 1) == "_");

			if (!isUnderscorePrefixed) {
				var nameWithoutJsExtension = fileName.replace(/\.js$/, ''); // remove the .js filename suffix.
				var requirePath = path + nameWithoutJsExtension;

				// Load the module (function), call it and add the config entry.
				config[nameWithoutJsExtension] = require(requirePath)(grunt, shared);
			}
		});

		return config;
	}
	grunt.initConfig(configObjectFromConfigDir('./grunt/'));

	// Alias Tasks
	grunt.registerTask('default', ['debug']);
	grunt.registerTask('release', ['clean', 'ts:release', 'sass:release', 'dust:release', 'makefont', 'uglify:release', 'copy:release']);
	grunt.registerTask('debug', ['clean', 'ts:debug', 'sass:debug', 'dust:debug', 'makefont', 'copy:release']);
	grunt.registerTask('debugging', ['debug', 'watch']);
	grunt.registerTask('webserver', 'connect:debug');
	grunt.registerTask('validate', ['scsslint', 'tslint']);
};