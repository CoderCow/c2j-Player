// Watches files for changes and runs tasks accordingly.
module.exports = function(grunt, shared) {
	return {
		options: {
			interrupt: true,
			spawn: true
		},
		sass: {
			files: 'src/scss/**/*.scss',
			tasks: ['sass:debug']
		},
		ts: {
			files: ['src/ts/**/*.ts', 'src/d.ts/**/*.ts'],
			tasks: ['ts:debug']
		},
		dust: {
			files: 'src/templates/**/*.dust',
			tasks: ['dust:debug']
		},
		html: {
			files: 'src/*.html',
			tasks: ['copy:html']
		},
		img: {
			files: 'img/**/*.*',
			tasks: ['copy:img']
		},
		fontDir: {
			files: 'font/**/*.*',
			tasks: ['copy:font']
		},
		fontgen: {
			files: ['src/iconfont/**/*.*', 'build/iconfont/**/*.*'],
			tasks: ['makefont']
		}
	}
};