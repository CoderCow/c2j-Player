// Compiles dust.js templates to JavaScript.
module.exports = function(grunt, shared) {
	return {
		options: {
			wrapper: false,
			basePath: 'src/templates'
		},
		debug: {
			files: { 'dist/js/templates.js': 'src/templates/**/*.dust' }
		},
		release: {
			files: { 'dist/js/templates.js': 'src/templates/**/*.dust' }
		}
	}
};