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
			},
			{
				expand: true,
				cwd: 'node_modules/video.js/dist/lang',
				src: '**/*.*',
				dest: 'dist/lang/'
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
		img: {
			files: [{
				expand: true,
				cwd: 'src/img/',
				src: '**/*.*',
				dest: 'dist/img/'
			},]
		},
		font: {
			files: [{
				expand: true,
				cwd: 'src/font/',
				src: '**/*.*',
				dest: 'dist/font/'
			},]
		}
	}
};