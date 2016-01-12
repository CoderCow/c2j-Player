// Checks TypeScript code for common mistakes, bad practices or coding style violations.
module.exports = function(grunt, shared) {
	return {
		options: {
			// List of rules: https://www.npmjs.com/package/tslint
			configuration: grunt.file.readJSON('tslint.json')
		},
		files: {
			src: 'src/ts/**/*.ts'
		}
	}
};