// Checks SCSS (SASS CSS) code for common mistakes, bad practices or coding style violations.
module.exports = function(grunt, shared) {
	return {
		options: {
			// List of linters: https://github.com/brigade/scss-lint/blob/master/lib/scss_lint/linter/README.md#bangformat
			config: 'scss-lint.yml',
			force: true
		},
		allFiles: [
			'src/scss/*.scss'
		]
	}
};