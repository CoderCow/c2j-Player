// A task to start a connect webserver.
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