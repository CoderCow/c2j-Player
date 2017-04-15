var path = require('path');

module.exports = function(config) {
  // https://karma-runner.github.io/0.13/config/configuration-file.html
  config.set({
    browsers: ['PhantomJS'], // 'Chrome'

    files: [
      //'test/import-babel-polyfill.js', // This ensures we have the es6 shims in place from babel
      // note: karma caches the contents from the CDN. however, to check if cache must be invalidated
      // karma still has to send a request to the server every time
      'https://code.jquery.com/jquery-3.1.0.min.js',
      'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
      'utils/test.entry.ts'
    ],

    preprocessors: {
      //'test/import-babel-polyfill.js': ['webpack', 'sourcemap'],
      'utils/test.entry.ts': ['webpack', 'sourcemap']
    },

    port: 9876,
    frameworks: ['mocha', 'phantomjs-shim'],
    colors: true,
    singleRun: false,
    autoWatch: true,
    logLevel: config.LOG_INFO, //config.LOG_DEBUG

    webpack: require('./webpack.test.config.js'),

    // https://github.com/webpack/webpack-dev-middleware
    webpackMiddleware: {
      noInfo: false,
      // publicPath: '',  // set this if publicPath in webpack has changed
      stats: {
        colors: true
      },
      // required for automated running of tests in the vagrant machine
      watchOptions: {
        poll: 750
      }
    },

    reporters: ['mocha', 'coverage'],

    // @see https://www.npmjs.com/package/karma-mocha-reporter
    mochaReporter: {
      output: 'autowatch',
      showDiff: 'unified'
    },

    coverageReporter: {
      dir: 'test-coverage',
			reporters: [
				{'type': 'html', subdir: 'html'}
			]
		}
  });
};
