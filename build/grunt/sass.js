// Preprocesses SASS/SCSS files and outputs regular CSS.
module.exports = function(grunt, shared) {
	return {
		options: {
			precision: 5 // How many digits of precision to use when outputting decimal numbers.
		},
		debug: {
			options: {
				sourcemap: 'auto',
			},
			src: 'src/scss/main.scss',
			dest: 'dist/css/style.css'
		},
		release: {
			options: {
				sourcemap: 'inline',
				style: 'compressed'
			},
			dest: 'dist/css/style.css',
			src: 'src/scss/main.scss'
		},
		makefont: {
			options: {
				sourcemap: 'none',
				style: 'compressed'
			},
			dest: 'build/temp/font.css',
			src: 'build/temp/font.scss'
		}
	}
};