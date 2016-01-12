// Transpiles TypeScript files to one JavaScript file.
module.exports = function(grunt, shared) {
	return {
		options: {
			//verbose: true,
			fast: 'never'
		},
		release: {
			tsconfig: 'tsconfig.release.json'
		},
		debug: {
			tsconfig: true
		}
	}
}