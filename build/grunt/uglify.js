// Minimizes the Javascript code into one JavaScript file.
module.exports = function(grunt, shared) {
	return {
		options: {
			preserveComments: false,
			compress: {
				global_defs: { // enables conditional compilation.
					"DEBUG": false // removes if (DEBUG) code blocks.
				},
				drop_console: true // removes calls to console.* functions.
			}
		},
		release: {
			files: {
				'dist/js/script.js': 'dist/js/script.js',
				'dist/js/dust-runtime.js': 'dist/js/dust-runtime.js'
			}
		}
	}
};