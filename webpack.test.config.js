'use strict';

const merge = require('webpack-merge');
const webpack = require('webpack');

// https://webpack.github.io/docs/configuration.html
let config = merge(require('./webpack.config'), {
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      DEBUG: 'true'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: ['file-loader']
      }
    ]
  }
});
// these will be set by karma
delete config.entry;
delete config.output;

module.exports = config;
