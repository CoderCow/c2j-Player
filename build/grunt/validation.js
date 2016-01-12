// Runs the W3C validator against the html files to ensure HTML5 conformance.
module.exports = function(grunt, shared) {
	return {
		release: {
			options: {
				reset: grunt.option('reset') || false,
				relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.'], // Errors to ignore
				path: 'build/temp/validation-status.json',
				reportpath: false,
				serverUrl: 'https://validator.w3.org/',
				maxTry: 1
			},
			files: {
				src: 'src/index.html'
			}
		}
	}
};