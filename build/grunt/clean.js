// A task remove all files in the specified folders.
module.exports = function(grunt, shared) {
	return {
		default: ['dist/', 'build/temp/']
	}
};