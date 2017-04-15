var path = require('path');
var merge = require('webpack-merge');

var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

module.exports = function(config) {
  require('./karma.conf.js')(config);

  webpackConfig.__reconfigureLoader('awesome-typescript', 'awesome-typescript?tsconfig=tsconfig.coverage.json&useBabel=true'); //&useCache=true

  // https://karma-runner.github.io/0.13/config/configuration-file.html
  config.set({
    singleRun: true,
    autoWatch: false,

    webpack: merge(require('./webpack.test.config.js'), {
      module: {
        postLoaders: [
          /**
           * Instruments TS source files for subsequent code coverage.
           * See https://github.com/deepsweet/istanbul-instrumenter-loader
           */
          {
            test: /\.(jsx?|tsx?)$/,
            loader: 'istanbul-instrumenter',
            exclude: [
              /node_modules/,
              /lib[\\\/].*$/,
              /\.test\.(jsx?|tsx?)$/
            ]
          }
        ]
      }
    }),

    reporters: ['mocha', 'coverage', 'karma-remap-istanbul'],

		coverageReporter: {
      dir: 'test-coverage',
			reporters: [
				{'type': 'json', subdir: '.', file: 'coverage-data.json'}
				//{'type': 'html', subdir: '.'}
			]
		},

    remapIstanbulReporter: {
		  src: 'test-coverage/coverage-data.json',
      reports: {
		    lcovonly: 'test-coverage/lcov.info',
        html: 'test-coverage/html'
      }
    }
  });
};
