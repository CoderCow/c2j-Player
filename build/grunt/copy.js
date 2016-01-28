// Copies files from one folder to another.
module.exports = function(grunt, shared) {
	return {
		release: {
			files: [{
				expand: true,
				cwd: 'src/',
				src: '*.html',
				dest: 'dist/'
			},
			{
				expand: true,
				cwd: 'src/',
				src: '*.json',
				dest: 'dist/'
			},
			{
				src: 'src/config.release.json',
				dest: 'dist/config.json'
			},
			{
				src: 'node_modules/jquery/dist/jquery.min.js',
				dest: 'dist/js/jquery.js'
			},
			{
				src: 'node_modules/jquery/dist/jquery.min.map',
				dest: 'dist/js/jquery.map'
			},
			{
				expand: true,
				cwd: 'build/dist',
				src: '**/*.*',
				dest: 'dist/'
			},
			{
				expand: true,
				cwd: 'src/img/',
				src: '**/*.*',
				dest: 'dist/img/'
			},
			{
				expand: true,
				cwd: 'src/font',
				src: '**/*.*',
				dest: 'dist/font/'
			}]
		},
		debug: {
			files: [{
				expand: true,
				cwd: 'src/',
				src: '*.html',
				dest: 'dist/'
			},
			{
				expand: true,
				cwd: 'src/',
				src: '*.json',
				dest: 'dist/'
			},
			{
				src: 'src/config.json',
				dest: 'dist/'
			},
			{
				src: 'node_modules/jquery/dist/jquery.js',
				dest: 'dist/js/jquery.js'
			},
			{
				src: 'node_modules/jquery/dist/jquery.map',
				dest: 'dist/js/jquery.map'
			},
			{
				expand: true,
				cwd: 'build/dist',
				src: '**/*.*',
				dest: 'dist/'
			},
			{
				expand: true,
				cwd: 'src/img/',
				src: '**/*.*',
				dest: 'dist/img/'
			},
			{
				expand: true,
				cwd: 'src/font',
				src: '**/*.*',
				dest: 'dist/font/'
			}]
		},
		html: {
			files: [{
				expand: true,
				cwd: 'src/',
				src: '*.html',
				dest: 'dist/'
			}]
		},
		config: {
			files: [{
				expand: true,
				cwd: 'src/',
				src: '*.json',
				dest: 'dist/'
			}]
		},
		img: {
			files: [{
				expand: true,
				cwd: 'src/img/',
				src: '**/*.*',
				dest: 'dist/img/'
			}]
		},
		font: {
			files: [{
				expand: true,
				cwd: 'src/font/',
				src: '**/*.*',
				dest: 'dist/font/'
			}]
		}
	}
};