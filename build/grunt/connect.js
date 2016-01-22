// A task remove all files in the specified folders.
module.exports = function(grunt, shared) {
	return {
		debug: {
			options: {
				keepalive: true,
				port: 63343,
				hostname: '*',
				base: '../'
			}
		}
	}
};